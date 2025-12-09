from __future__ import annotations
import os
from typing import List, Optional, Literal, Dict, Any

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel, Field
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# -------------------------------------------------------------------
# CONFIG
# -------------------------------------------------------------------
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
router = APIRouter(prefix="/smart", tags=["smart"])


# -------------------------------------------------------------------
# MODELS
# -------------------------------------------------------------------
class MatchResult(BaseModel):
    candidate_id: Optional[int] = None
    position_id: Optional[int] = None
    profile_id: Optional[int] = None
    name: Optional[str] = None
    score: float
    extra: Optional[Dict[str, Any]] = None


class SkillGap(BaseModel):
    skill: str
    candidate_level: int
    required_level: int
    gap: int
    status: Literal["strength", "meet", "upskill", "missing"]


class SkillGapResponse(BaseModel):
    candidate_id: int
    position_id: int
    candidate_name: Optional[str]
    position_name: Optional[str]
    hard_skill_gaps: List[SkillGap]
    soft_skill_gaps: List[SkillGap]
    summary: Dict[str, Any]


# -------------------------------------------------------------------
# HELPERS
# -------------------------------------------------------------------
def _normalize_minmax(scores: List[float]) -> List[float]:
    """
    Normalize any list of real values to [0,1] while preserving order.
    If all scores are equal, return 0.5 for all (neutral value).
    """
    if not scores:
        return scores

    min_s = min(scores)
    max_s = max(scores)

    if max_s == min_s:  # avoid division by zero; all equal
        return [0.5] * len(scores)

    return [((s - min_s) / (max_s - min_s))*100 for s in scores]


def _get_candidate(candidate_id: int):
    resp = (
        supabase.table("structured_employees")
        .select("employee_number, first_name, last_name, hard_skills, soft_skills")
        .eq("employee_number", candidate_id)
        .single()
        .execute()
    )
    if not resp.data:
        raise HTTPException(404, "Candidate not found")
    return resp.data


def _get_position(position_id: int):
    """
    positions table columns (relevant):
    - position_id (bigint)
    - position_name (varchar)
    - description (text)
    """
    resp = (
        supabase.table("positions")
        .select("position_id, position_name, description")
        .eq("position_id", position_id)
        .single()
        .execute()
    )
    if not resp.data:
        raise HTTPException(404, "Position not found")
    return resp.data


def _get_profile(profile_id: int):
    # NOTE: include description here so we can send it back in responses
    resp = (
        supabase.table("profiles")
        .select(
            "profile_id, position_id, profile_name, position_name, "
            "description, hard_skills, soft_skills"
        )
        .eq("profile_id", profile_id)
        .single()
        .execute()
    )
    if not resp.data:
        raise HTTPException(404, "Profile not found")
    return resp.data


def _get_profile_by_position_id(position_id: int):
    """
    Get the first profile for a position (MVP: 1 profile per position),
    used in /gaps. For matching we now rely on the RPC, which can use many profiles.
    """
    resp = (
        supabase.table("profiles")
        .select(
            "profile_id, position_id, profile_name, position_name, "
            "description, hard_skills, soft_skills"
        )
        .eq("position_id", position_id)
        .limit(1_000)
        .execute()
    )
    data = resp.data or []
    if not data:
        raise HTTPException(404, "No profile for this position")
    return data[0]


def _parse_skills(skills_json):
    """
    skills_json is JSON / JSONB array like:
      [{"skill": "Python", "level": 3}, ...]
    Returns a dict:
      {"python": 3, ...}
    """
    result: Dict[str, int] = {}
    if not skills_json:
        return result
    for item in skills_json:
        skill = (item.get("skill") or "").strip().lower()
        if not skill:
            continue
        level = int(item.get("level") or 0)
        result[skill] = level
    return result


def _analyze_skill_gaps(
    candidate_skills: Dict[str, int],
    required_skills: Dict[str, int]
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


def _get_profiles_for_position(position_id: int) -> List[Dict[str, Any]]:
    """
    Return ALL profiles for a given position_id.
    """
    resp = (
        supabase.table("profiles")
        .select(
            "profile_id, position_id, profile_name, position_name, "
            "description, hard_skills, soft_skills"
        )
        .eq("position_id", position_id)
        .execute()
    )
    return resp.data or []


# -------------------------------------------------------------------
# SMART ENDPOINTS (RPC POWERED)
# -------------------------------------------------------------------

# 1️⃣ Top candidates for a position (profile → employees)
@router.get("/candidates/top", response_model=List[MatchResult])
def get_top_candidates_for_position(
    position_id: int = Query(...),
    limit: int = Query(10, ge=1, le=100),
):
    # validate position exists (for name / 404)
    position = _get_position(position_id)

    # RPC now returns: candidate_id, first_name, last_name,
    # profile_id, profile_name, position_name, score
    rpc = supabase.rpc(
        "match_candidates_for_position",
        {"p_position_id": position_id, "p_limit": limit},
    ).execute()

    rows = rpc.data or []

    # ---- normalize scores to [0,1] while preserving order ----
    scores = [row["score"] for row in rows]
    norm_scores = _normalize_minmax(scores)

    results = []
    for row, norm_score in zip(rows, norm_scores):
        # fetch full profile to get description & skills
        profile = _get_profile(row["profile_id"])

        results.append(
            MatchResult(
                candidate_id=row["candidate_id"],
                position_id=position_id,
                profile_id=row["profile_id"],
                name=f"{row.get('first_name', '')} {row.get('last_name', '')}".strip(),
                score=norm_score,
                extra={
                    # requested extra data
                    "profile_name": profile.get("profile_name"),
                    "position_name": position.get("position_name"),
                    "description": profile.get("description"),
                    "hard_skills": profile.get("hard_skills"),
                    "soft_skills": profile.get("soft_skills"),
                },
            )
        )

    return results


# 2️⃣ Similar candidates (employee → employees)
@router.get("/candidates/similar", response_model=List[MatchResult])
def get_similar_candidates(
    candidate_id: int = Query(...),
    limit: int = Query(10, ge=1, le=100),
):
    # validate candidate exists
    _ = _get_candidate(candidate_id)

    rpc = supabase.rpc(
        "match_similar_candidates",
        {"p_candidate_id": candidate_id, "p_limit": limit},
    ).execute()

    rows = rpc.data or []

    # ---- normalize scores to [0,1] while preserving order ----
    scores = [row["score"] for row in rows]
    norm_scores = _normalize_minmax(scores)

    return [
        MatchResult(
            candidate_id=row["candidate_id"],
            name=f"{row.get('first_name', '')} {row.get('last_name', '')}".strip(),
            score=norm_score,
        )
        for row, norm_score in zip(rows, norm_scores)
    ]


# 3️⃣ Top positions for a candidate (candidate → profiles → positions)
@router.get("/positions/top", response_model=List[MatchResult])
def get_top_positions_for_candidate(
    candidate_id: int = Query(...),
    limit: int = Query(10, ge=1, le=100),
):
    # validate candidate exists
    _ = _get_candidate(candidate_id)

    rpc = supabase.rpc(
        "match_positions_for_candidate",
        {"p_candidate_id": candidate_id, "p_limit": limit},
    ).execute()

    rows = rpc.data or []

    # ---- normalize scores to [0,1] while preserving order ----
    scores = [row["score"] for row in rows]
    norm_scores = _normalize_minmax(scores)

    results: List[MatchResult] = []
    for row, norm_score in zip(rows, norm_scores):
        # row: profile_id, position_id, profile_name, position_name, score
        profile = _get_profile(row["profile_id"])
        position = _get_position(row["position_id"])

        results.append(
            MatchResult(
                candidate_id=candidate_id,
                position_id=row["position_id"],
                profile_id=row["profile_id"],
                name=row.get("position_name") or row.get("profile_name"),
                score=norm_score,
                extra={
                    # requested extra data per matching position
                    "profile_name": profile.get("profile_name"),
                    "position_name": position.get("position_name"),
                    "description": profile.get("description"),
                    "hard_skills": profile.get("hard_skills"),
                    "soft_skills": profile.get("soft_skills"),
                },
            )
        )

    return results


# 4️⃣ Similar positions (profile ↔ profile)
@router.get("/positions/similar", response_model=List[MatchResult])
def get_similar_positions(
    position_id: int = Query(...),
    limit: int = Query(10, ge=1, le=100),
):
    # validate position exists
    _ = _get_position(position_id)

    rpc = supabase.rpc(
        "match_similar_positions",
        {"p_position_id": position_id, "p_limit": limit},
    ).execute()

    rows = rpc.data or []

    # ---- normalize scores to [0,1] while preserving order ----
    scores = [row["score"] for row in rows]
    norm_scores = _normalize_minmax(scores)

    results: List[MatchResult] = []
    for row, norm_score in zip(rows, norm_scores):
        profile = _get_profile(row["profile_id"])
        position = _get_position(row["position_id"])

        results.append(
            MatchResult(
                position_id=row["position_id"],
                profile_id=row["profile_id"],
                name=row.get("position_name") or row.get("profile_name"),
                score=norm_score,
                extra={
                    "profile_name": profile.get("profile_name"),
                    "position_name": position.get("position_name"),
                    "description": profile.get("description"),
                    "hard_skills": profile.get("hard_skills"),
                    "soft_skills": profile.get("soft_skills"),
                },
            )
        )

    return results


# -------------------------------------------------------------------
# 5️⃣ Skill gap analysis (candidate vs ALL profiles for a position)
# -------------------------------------------------------------------
@router.get("/gaps", response_model=List[SkillGapResponse])
def get_skill_gaps(
    candidate_id: int = Query(...),
    position_id: int = Query(...),
):
    candidate = _get_candidate(candidate_id)
    position = _get_position(position_id)

    cand_name = f"{candidate.get('first_name', '')} {candidate.get('last_name', '')}".strip()
    pos_name = position["position_name"]

    # Candidate skills
    cand_hard = _parse_skills(candidate.get("hard_skills"))
    cand_soft = _parse_skills(candidate.get("soft_skills"))

    # All profiles for this position
    profiles = _get_profiles_for_position(position_id)
    if not profiles:
        raise HTTPException(status_code=404, detail="No profiles found for this position")

    from collections import Counter

    responses: List[SkillGapResponse] = []

    for profile in profiles:
        req_hard = _parse_skills(profile.get("hard_skills"))
        req_soft = _parse_skills(profile.get("soft_skills"))

        hard_gaps = _analyze_skill_gaps(cand_hard, req_hard)
        soft_gaps = _analyze_skill_gaps(cand_soft, req_soft)

        summary = {
            "total_required_hard": len(req_hard),
            "total_required_soft": len(req_soft),
            "hard_status_counts": dict(Counter(g.status for g in hard_gaps)),
            "soft_status_counts": dict(Counter(g.status for g in soft_gaps)),
            "profile_id": profile["profile_id"],
            "profile_name": profile.get("profile_name"),
        }

        responses.append(
            SkillGapResponse(
                candidate_id=candidate_id,
                position_id=position_id,
                candidate_name=cand_name or None,
                position_name=pos_name,
                hard_skill_gaps=hard_gaps,
                soft_skill_gaps=soft_gaps,
                summary=summary,
            )
        )

    return responses
