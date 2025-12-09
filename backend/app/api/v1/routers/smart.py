from __future__ import annotations

import ast
import json
import os
from typing import List, Optional, Literal, Dict, Any

import numpy as np
from fastapi import FastAPI, HTTPException, Query, APIRouter
from pydantic import BaseModel, Field
from supabase import create_client, Client
from dotenv import load_dotenv
load_dotenv()
# -------------------------------------------------------------------
# CONFIG & CLIENT
# -------------------------------------------------------------------
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]  # service role key

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
router = APIRouter(prefix="/smart", tags=["smart"])


# -------------------------------------------------------------------
# Pydantic Models
# -------------------------------------------------------------------
class MatchResult(BaseModel):
    """Generic match result for profile↔candidate or profile↔profile."""
    candidate_id: Optional[int] = Field(default=None)
    position_id: Optional[int] = Field(default=None)
    profile_id: Optional[int] = Field(default=None)
    name: Optional[str] = None  # can be candidate name or position/profile name
    score: float = Field(..., description="Similarity score between 0 and 1")
    extra: Optional[Dict[str, Any]] = None


class SkillLevel(BaseModel):
    skill: str
    level: int


class SkillGap(BaseModel):
    skill: str
    candidate_level: int
    required_level: int
    gap: int
    status: Literal["strength", "meet", "upskill", "missing"]


class SkillGapResponse(BaseModel):
    candidate_id: int
    position_id: int
    candidate_name: Optional[str] = None
    position_name: Optional[str] = None
    hard_skill_gaps: List[SkillGap]
    soft_skill_gaps: List[SkillGap]
    summary: Dict[str, Any]


# -------------------------------------------------------------------
# Helpers
# -------------------------------------------------------------------
def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Cosine similarity between two 1D vectors."""
    an = np.linalg.norm(a)
    bn = np.linalg.norm(b)
    if an == 0 or bn == 0:
        return 0.0
    return float(np.dot(a, b) / (an * bn))


def _to_vec(value: Any) -> Optional[np.ndarray]:
    """
    Convert a value from Supabase (list, tuple, numpy array or stringified list)
    into a 1D numpy array of floats.
    """
    if value is None:
        return None

    # If the embedding is stored as TEXT/VARCHAR and looks like "[0.1, 0.2, ...]"
    if isinstance(value, str):
        s = value.strip()
        if not s:
            return None

        # Try JSON first
        try:
            value = json.loads(s)
        except json.JSONDecodeError:
            # Fallback to Python literal (e.g. if it's not strict JSON)
            try:
                value = ast.literal_eval(s)
            except Exception:
                # If we still can't parse, treat as invalid
                return None

    # Now we expect value to be list/tuple/np array
    arr = np.array(value, dtype=float)

    # Ensure 1D
    if arr.ndim != 1:
        arr = arr.ravel()

    return arr



def _get_candidate(candidate_id: int) -> Dict[str, Any]:
    resp = (
        supabase.table("structured_employees")
        .select("employee_number, first_name, last_name, embedding, hard_skills, soft_skills")
        .eq("employee_number", candidate_id)
        .single()
        .execute()
    )
    if not resp.data:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return resp.data


def _get_position(position_id: int) -> Dict[str, Any]:
    resp = (
        supabase.table("positions")
        .select("position_id, position_name, description")
        .eq("position_id", position_id)
        .single()
        .execute()
    )
    if not resp.data:
        raise HTTPException(status_code=404, detail="Position not found")
    return resp.data


def _get_profile(profile_id: int) -> Dict[str, Any]:
    resp = (
        supabase.table("profiles")
        .select(
            "profile_id, position_id, profile_name, position_name, "
            "description, hard_skills, soft_skills, embedding"
        )
        .eq("profile_id", profile_id)
        .single()
        .execute()
    )
    if not resp.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return resp.data


def _get_profile_by_position_id(position_id: int) -> Dict[str, Any]:
    """
    Get the profile associated with a position_id.
    Assumes 1 profile per position (MVP). If multiple, takes the first.
    """
    resp = (
        supabase.table("profiles")
        .select(
            "profile_id, position_id, profile_name, position_name, "
            "description, hard_skills, soft_skills, embedding"
        )
        .eq("position_id", position_id)
        .limit(1)
        .execute()
    )
    data = resp.data or []
    if not data:
        raise HTTPException(status_code=404, detail="No profile found for this position")
    return data[0]


def _parse_skills(skills_json: Any) -> Dict[str, int]:
    """
    Convert JSONB[] like:
      [{ "skill": "Python", "level": 3 }, ...]
    into:
      { "python": 3, ... }
    """
    result: Dict[str, int] = {}
    if not skills_json:
        return result
    for item in skills_json:
        skill = (item.get("skill") or "").strip()
        if not skill:
            continue
        level = int(item.get("level") or 0)
        result[skill.lower()] = level
    return result


def _analyze_skill_gaps(
    candidate_skills: Dict[str, int],
    required_skills: Dict[str, int],
) -> List[SkillGap]:
    gaps: List[SkillGap] = []
    for skill_name, req_level in required_skills.items():
        cand_level = candidate_skills.get(skill_name, 0)
        gap_val = req_level - cand_level

        if gap_val <= -1:
            status = "strength"
        elif gap_val == 0:
            status = "meet"
        elif 1 <= gap_val <= 2:
            status = "upskill"
        else:
            status = "missing"

        gaps.append(
            SkillGap(
                skill=skill_name,
                candidate_level=cand_level,
                required_level=req_level,
                gap=gap_val,
                status=status,
            )
        )
    return gaps


# -------------------------------------------------------------------
# /smart/candidates/top
# Top candidates for a position – via the PROFILE embedding
# -------------------------------------------------------------------
@router.get(
    "/candidates/top",
    response_model=List[MatchResult],
    summary="Top candidates for a position (profile → employees)",
)
def get_top_candidates_for_position(
    position_id: int = Query(...),
    limit: int = Query(10, ge=1, le=100),
):
    # validate position exists (also gives us name)
    position = _get_position(position_id)

    # get the profile for this position (profiles.position_id = position_id)
    profile = _get_profile_by_position_id(position_id)
    prof_vec = _to_vec(profile.get("embedding"))
    if prof_vec is None:
        raise HTTPException(status_code=400, detail="Profile has no embedding")

    # fetch all employees with embeddings
    resp = (
        supabase.table("structured_employees")
        .select("employee_number, first_name, last_name, embedding")
        .execute()
    )
    rows = resp.data or []

    results: List[MatchResult] = []
    for row in rows:
        cand_vec = _to_vec(row.get("embedding"))
        if cand_vec is None:
            continue

        score = cosine_similarity(prof_vec, cand_vec)
        full_name = f"{row.get('first_name') or ''} {row.get('last_name') or ''}".strip()
        results.append(
            MatchResult(
                candidate_id=row["employee_number"],
                position_id=position_id,
                profile_id=profile["profile_id"],
                name=full_name,
                score=score,
                extra={
                    "position_name": position.get("position_name"),
                    "profile_name": profile.get("profile_name"),
                },
            )
        )

    results.sort(key=lambda r: r.score, reverse=True)
    return results[:limit]


# -------------------------------------------------------------------
# /smart/candidates/similar
# Similar candidates to a given candidate (still candidate↔candidate)
# -------------------------------------------------------------------
@router.get(
    "/candidates/similar",
    response_model=List[MatchResult],
    summary="Similar candidates (employee → employees)",
)
def get_similar_candidates(
    candidate_id: int = Query(...),
    limit: int = Query(10, ge=1, le=100),
):
    candidate = _get_candidate(candidate_id)
    cand_vec = _to_vec(candidate.get("embedding"))
    if cand_vec is None:
        raise HTTPException(status_code=400, detail="Candidate has no embedding")

    resp = (
        supabase.table("structured_employees")
        .select("employee_number, first_name, last_name, embedding")
        .execute()
    )
    rows = resp.data or []

    results: List[MatchResult] = []
    for row in rows:
        other_id = row["employee_number"]
        if other_id == candidate_id:
            continue

        other_vec = _to_vec(row.get("embedding"))
        if other_vec is None:
            continue

        score = cosine_similarity(cand_vec, other_vec)
        full_name = f"{row.get('first_name') or ''} {row.get('last_name') or ''}".strip()
        results.append(
            MatchResult(
                candidate_id=other_id,
                name=full_name,
                score=score,
            )
        )

    results.sort(key=lambda r: r.score, reverse=True)
    return results[:limit]


# -------------------------------------------------------------------
# /smart/positions/top
# Top positions for a candidate – via PROFILE embeddings
# We actually rank PROFILES, then map to positions.
# -------------------------------------------------------------------
@router.get(
    "/positions/top",
    response_model=List[MatchResult],
    summary="Top positions for a candidate (candidate → profiles → positions)",
)
def get_top_positions_for_candidate(
    candidate_id: int = Query(...),
    limit: int = Query(10, ge=1, le=100),
):
    candidate = _get_candidate(candidate_id)
    cand_vec = _to_vec(candidate.get("embedding"))
    if cand_vec is None:
        raise HTTPException(status_code=400, detail="Candidate has no embedding")

    # fetch all profiles with embeddings
    resp = (
        supabase.table("profiles")
        .select("profile_id, position_id, profile_name, position_name, embedding")
        .execute()
    )
    profiles = resp.data or []

    results: List[MatchResult] = []
    for prof in profiles:
        prof_vec = _to_vec(prof.get("embedding"))
        if prof_vec is None:
            continue

        score = cosine_similarity(cand_vec, prof_vec)

        results.append(
            MatchResult(
                candidate_id=candidate_id,
                position_id=prof.get("position_id"),
                profile_id=prof["profile_id"],
                name=prof.get("position_name") or prof.get("profile_name"),
                score=score,
                extra={
                    "profile_name": prof.get("profile_name"),
                },
            )
        )

    results.sort(key=lambda r: r.score, reverse=True)
    return results[:limit]


# -------------------------------------------------------------------
# /smart/positions/similar
# Similar positions – via PROFILE embeddings (profile ↔ profile)
# -------------------------------------------------------------------
@router.get(
    "/positions/similar",
    response_model=List[MatchResult],
    summary="Similar positions (via profile embeddings)",
)
def get_similar_positions(
    position_id: int = Query(...),
    limit: int = Query(10, ge=1, le=100),
):
    # anchor profile for this position
    anchor_profile = _get_profile_by_position_id(position_id)
    anchor_vec = _to_vec(anchor_profile.get("embedding"))
    if anchor_vec is None:
        raise HTTPException(status_code=400, detail="Anchor profile has no embedding")

    # all other profiles
    resp = (
        supabase.table("profiles")
        .select("profile_id, position_id, profile_name, position_name, embedding")
        .execute()
    )
    profiles = resp.data or []

    results: List[MatchResult] = []
    for prof in profiles:
        other_pos_id = prof.get("position_id")
        other_profile_id = prof["profile_id"]
        if other_pos_id == position_id and other_profile_id == anchor_profile["profile_id"]:
            continue

        prof_vec = _to_vec(prof.get("embedding"))
        if prof_vec is None:
            continue

        score = cosine_similarity(anchor_vec, prof_vec)

        results.append(
            MatchResult(
                position_id=other_pos_id,
                profile_id=other_profile_id,
                name=prof.get("position_name") or prof.get("profile_name"),
                score=score,
                extra={
                    "profile_name": prof.get("profile_name"),
                },
            )
        )

    results.sort(key=lambda r: r.score, reverse=True)
    return results[:limit]


# -------------------------------------------------------------------
# /smart/gaps
# Skill gap analysis – candidate vs PROFILE (for the given position)
# -------------------------------------------------------------------
@router.get(
    "/gaps",
    response_model=SkillGapResponse,
    summary="Skill gap analysis for candidate vs position (via profile)",
)
def get_skill_gaps(
    candidate_id: int = Query(...),
    position_id: int = Query(...),
):
    candidate = _get_candidate(candidate_id)
    position = _get_position(position_id)

    cand_name = f"{candidate.get('first_name') or ''} {candidate.get('last_name') or ''}".strip()
    pos_name = position.get("position_name")

    # Candidate skills
    cand_hard = _parse_skills(candidate.get("hard_skills"))
    cand_soft = _parse_skills(candidate.get("soft_skills"))

    # Required skills from profile:
    # 1) try profiles.position_id = position_id
    # 2) if not found and positions.profile_id is set → use that
    req_hard: Dict[str, int] = {}
    req_soft: Dict[str, int] = {}
    chosen_profile: Optional[Dict[str, Any]] = None

    try:
        chosen_profile = _get_profile_by_position_id(position_id)
    except HTTPException:
        profile_id = position.get("profile_id")
        if profile_id:
            chosen_profile = _get_profile(profile_id)

    if chosen_profile:
        req_hard = _parse_skills(chosen_profile.get("hard_skills"))
        req_soft = _parse_skills(chosen_profile.get("soft_skills"))

    hard_gaps = _analyze_skill_gaps(cand_hard, req_hard)
    soft_gaps = _analyze_skill_gaps(cand_soft, req_soft)

    from collections import Counter

    summary = {
        "total_required_hard": len(req_hard),
        "total_required_soft": len(req_soft),
        "hard_status_counts": dict(Counter([g.status for g in hard_gaps])),
        "soft_status_counts": dict(Counter([g.status for g in soft_gaps])),
        "profile_id": chosen_profile["profile_id"] if chosen_profile else None,
    }

    return SkillGapResponse(
        candidate_id=candidate_id,
        position_id=position_id,
        candidate_name=cand_name or None,
        position_name=pos_name,
        hard_skill_gaps=hard_gaps,
        soft_skill_gaps=soft_gaps,
        summary=summary,
    )