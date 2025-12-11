from __future__ import annotations
import os
import math
from typing import List, Optional, Literal, Dict, Any, Union, cast
from collections import Counter, defaultdict
from xml.etree.ElementTree import indent

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel, Field
from supabase import create_client, Client
from dotenv import load_dotenv

# LLM (LangChain)
try:
    from langchain_openai import ChatOpenAI  # type: ignore
    from langchain_core.prompts import ChatPromptTemplate  # type: ignore
except Exception:  # pragma: no cover - optional dependency at runtime
    ChatOpenAI = None  # type: ignore
    ChatPromptTemplate = None  # type: ignore

load_dotenv()

# -------------------------------------------------------------------
# CONFIG
# -------------------------------------------------------------------
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
router = APIRouter(prefix="/smart", tags=["smart"])
colours = ["red", "blue", "green", "yellow", "orange"]


# -------------------------------------------------------------------
# MODELS
# -------------------------------------------------------------------


class SkillGap(BaseModel):
    skill: str
    candidate_level: int
    required_level: int
    gap: int
    status: Literal["strength", "meet", "upskill", "missing"]


class SkillGapForProfile(BaseModel):
    """
    Used when comparing a candidate to a profile/position
    OR, in /positions/similar, when comparing a similar profile
    to a reference/base profile.
    """
    profile_id: int
    hard_skill_gaps: List[SkillGap]
    soft_skill_gaps: List[SkillGap]
    summary: Dict[str, Any]


class MatchResult(BaseModel):
    """
    Generic match result for endpoints that involve positions/profiles.
    Used by:
      - /candidates/top
      - /positions/top
    """
    candidate_id: int
    candidate_name: Optional[str] = None  # top-level only
    position_id: int
    profile_id: int
    category: str
    category_colour: Literal["red", "blue", "green", "yellow", "orange"] | None
    score: float
    profile_name: str
    profile_description: str
    position_name: str
    gaps: Optional[SkillGapForProfile] = None
    experience_match: Optional[SkillGapForProfile] = None

class PositionsSimilar(BaseModel):
    """
    Generic match result for endpoints that involve positions/profiles.
    Used by:
      - /positions/similar
    """
    position_id: int
    profile_id: int
    category: str
    category_colour: Literal["red", "blue", "green", "yellow", "orange"] | None
    score: float
    profile_name: str
    profile_description: str
    position_name: str
    gaps: Optional[SkillGapForProfile] = None
    experience_match: Optional[SkillGapForProfile] = None

class SkillGapResponse(BaseModel):
    candidate_id: int
    position_id: int
    candidate_name: Optional[str]
    position_name: Optional[str]
    hard_skill_gaps: List[SkillGap]
    soft_skill_gaps: List[SkillGap]
    summary: Dict[str, Any]


class Course(BaseModel):
    name: str
    id: int
    description: str


class LearningRecommendationModel(BaseModel):
    plan: str
    ids: List[int]


class LearningRecommendationResponse(BaseModel):
    plan: str
    courses: List[Course]


# 🔹 For /candidates/similar only (no position/profile fields)
class CandidateSimilarityGap(BaseModel):
    """
    Gaps when comparing one candidate to another (no profile_id here).
    """
    candidate_id: int
    candidate_name: Optional[str]
    hard_skill_gaps: List[SkillGap]
    soft_skill_gaps: List[SkillGap]
    summary: Dict[str, Any]


class SimilarCandidateResult(BaseModel):
    """
    Slim result model for /candidates/similar – no position/profile fields.
    """
    candidate_id: int
    category: str
    category_colour: Literal["red", "blue", "green", "yellow", "orange"] | None
    score: float
    gaps: Optional[CandidateSimilarityGap] = None
    experience_match: Optional[CandidateSimilarityGap] = None


# -------------------------------------------------------------------
# HELPERS
# -------------------------------------------------------------------


def get_skill_gaps_by_candidate_and_profiles(
    candidate_id: int,
    profiles: List[Dict]
) -> Dict[int, SkillGapForProfile]:
    """
    profiles: list of RPC rows (at least profile_id, profile_name, position_id, etc.)
    We will fetch the full profile from DB to get hard_skills / soft_skills.
    """
    candidate = _get_candidate(candidate_id)
    responses: Dict[int, SkillGapForProfile] = {}

    cand_hard = _parse_skills(candidate.get("hard_skills"))
    cand_soft = _parse_skills(candidate.get("soft_skills"))

    for profile_row in profiles:
        profile_id = profile_row["profile_id"]

        # fetch full profile with skills from DB
        full_profile = _get_profile(profile_id)

        req_hard = _parse_skills(full_profile.get("hard_skills"))
        req_soft = _parse_skills(full_profile.get("soft_skills"))

        hard_gaps = _analyze_skill_gaps(cand_hard, req_hard)
        soft_gaps = _analyze_skill_gaps(cand_soft, req_soft)

        summary = {
            "total_required_hard": len(req_hard),
            "total_required_soft": len(req_soft),
            "hard_status_counts": dict(Counter(g.status for g in hard_gaps)),
            "soft_status_counts": dict(Counter(g.status for g in soft_gaps)),
            "profile_id": profile_id,
            "profile_name": full_profile.get("profile_name"),
        }

        responses[profile_id] = SkillGapForProfile(
            profile_id=profile_id,
            hard_skill_gaps=hard_gaps,
            soft_skill_gaps=soft_gaps,
            summary=summary,
        )

    return responses


def get_skill_gaps_for_candidates_and_profiles(
    rows: List[Dict[str, Any]]
) -> Dict[tuple[int, int], SkillGapForProfile]:
    """
    Given a list of RPC rows that include at least:
      - candidate_id
      - profile_id

    Returns a dict keyed by (candidate_id, profile_id) -> SkillGapForProfile
    using the existing get_skill_gaps_by_candidate_and_profiles helper.
    """
    profiles_by_candidate: Dict[int, List[Dict[str, Any]]] = defaultdict(list)

    # group profiles per candidate
    for row in rows:
        cid = int(row["candidate_id"])
        profiles_by_candidate[cid].append(row)

    combined: Dict[tuple[int, int], SkillGapForProfile] = {}

    for cid, candidate_profiles in profiles_by_candidate.items():
        per_profile = get_skill_gaps_by_candidate_and_profiles(
            candidate_id=cid,
            profiles=candidate_profiles,
        )
        # per_profile: profile_id -> SkillGapForProfile
        for pid, gap in per_profile.items():
            combined[(cid, pid)] = gap

    return combined


def get_skill_gaps_between_candidates(
    base_candidate_id: int,
    similar_candidate_ids: List[int],
) -> Dict[int, CandidateSimilarityGap]:
    """
    Compute skill gaps between a base candidate and a list of similar candidates.

    We treat the base candidate as the "required reference", and each similar candidate
    as the "candidate" in SkillGap terms.

    Returns:
        Dict[similar_candidate_id, CandidateSimilarityGap]
    """
    # Base candidate (the one we compare everyone to)
    base_candidate = _get_candidate(base_candidate_id)
    base_name = f"{base_candidate.get('first_name', '')} {base_candidate.get('last_name', '')}".strip()

    base_hard = _parse_skills(base_candidate.get("hard_skills"))
    base_soft = _parse_skills(base_candidate.get("soft_skills"))

    results: Dict[int, CandidateSimilarityGap] = {}

    # Deduplicate ids to avoid redundant DB calls
    for cid in set(similar_candidate_ids):
        other = _get_candidate(cid)
        other_name = f"{other.get('first_name', '')} {other.get('last_name', '')}".strip() or None

        cand_hard = _parse_skills(other.get("hard_skills"))
        cand_soft = _parse_skills(other.get("soft_skills"))

        # Base candidate is the "required" reference
        hard_gaps = _analyze_skill_gaps(cand_hard, base_hard)
        soft_gaps = _analyze_skill_gaps(cand_soft, base_soft)

        summary = {
            "total_required_hard": len(base_hard),
            "total_required_soft": len(base_soft),
            "hard_status_counts": dict(Counter(g.status for g in hard_gaps)),
            "soft_status_counts": dict(Counter(g.status for g in soft_gaps)),
            "reference_candidate_id": base_candidate_id,
            "reference_candidate_name": base_name,
        }

        results[cid] = CandidateSimilarityGap(
            candidate_id=cid,
            candidate_name=other_name,
            hard_skill_gaps=hard_gaps,
            soft_skill_gaps=soft_gaps,
            summary=summary,
        )

    return results


def get_skill_gaps_between_profiles(
    base_profile_id: int,
    similar_profile_ids: List[int],
) -> Dict[int, SkillGapForProfile]:
    """
    Compute skill gaps between a base profile and a list of similar profiles.

    We treat the base profile as the "required reference", and each similar profile
    as the "candidate" in SkillGap terms.

    Returns:
        Dict[similar_profile_id, SkillGapForProfile]
    """
    base_profile = _get_profile(base_profile_id)
    base_name = base_profile.get("profile_name")

    req_hard = _parse_skills(base_profile.get("hard_skills"))
    req_soft = _parse_skills(base_profile.get("soft_skills"))

    results: Dict[int, SkillGapForProfile] = {}

    for pid in set(similar_profile_ids):
        similar_profile = _get_profile(pid)

        cand_hard = _parse_skills(similar_profile.get("hard_skills"))
        cand_soft = _parse_skills(similar_profile.get("soft_skills"))

        hard_gaps = _analyze_skill_gaps(cand_hard, req_hard)
        soft_gaps = _analyze_skill_gaps(cand_soft, req_soft)

        summary = {
            "total_required_hard": len(req_hard),
            "total_required_soft": len(req_soft),
            "hard_status_counts": dict(Counter(g.status for g in hard_gaps)),
            "soft_status_counts": dict(Counter(g.status for g in soft_gaps)),
            "reference_profile_id": base_profile_id,
            "reference_profile_name": base_name,
        }

        results[pid] = SkillGapForProfile(
            profile_id=pid,
            hard_skill_gaps=hard_gaps,
            soft_skill_gaps=soft_gaps,
            summary=summary,
        )

    return results


def _normalize(
    scores: List[float],
    midpoint: float = 1.2,   # raw score that should map to ~50
    steepness: float = 10.0   # how “sharp” the transition is
) -> List[float]:
    """
    Map raw scores to [0,100] using a logistic curve, without depending
    on min/max of the current batch.

    - `midpoint`  = the raw score that maps to 50.
    - `steepness` = how quickly scores move from low to high.
    """
    if not scores:
        return scores

    normalized: List[float] = []
    for s in scores:
        # classic logistic: 1 / (1 + e^(-k(x - x0)))
        prob = 1.0 / (1.0 + math.exp(-steepness * (s - midpoint)))
        normalized.append(prob * 100.0)

    return normalized


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
    used in /gaps and as base profile for /positions/similar.
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


def _category_colour_for_position(
    position_id: int,
) -> Optional[Literal["red", "blue", "green", "yellow", "orange"]]:
    """
    Deterministically map a position_id to one of the allowed category colours
    using the global `colours` list.
    """
    if not colours:
        return None
    idx = position_id % len(colours)
    return colours[idx]


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


def get_position_category(supabase: Client, position_id: int) -> Optional[str]:
    """
    Given a position_id, return its category from the positions table.
    """
    resp = (
        supabase
        .table("positions")
        .select("category")
        .eq("position_id", position_id)
        .single()
        .execute()
    )
    print(resp.data)

    if not resp.data:
        return None

    return resp.data.get("category")


# -------------------------------------------------------------------
# SMART ENDPOINTS (RPC POWERED)
# -------------------------------------------------------------------

# 1️⃣ Top candidates for a position (profile → employees)
@router.get("/candidates/top", response_model=List[MatchResult])
def get_top_candidates_for_position(
    position_id: int = Query(...),
    limit: int = Query(10, ge=1, le=100),
):
    # 1) Validate position exists (for name / 404)
    position = _get_position(position_id)

    # 2) Fetch category once for this position
    category = get_position_category(supabase, position_id) or ""
    category_colour = _category_colour_for_position(position_id) if category else None

    # 3) Call RPC: match_candidates_for_position
    rpc = supabase.rpc(
        "match_candidates_for_position",
        {"p_position_id": position_id, "p_limit": limit},
    ).execute()

    rows = rpc.data or []

    if not rows:
        return []

    # 4) Basic schema validation for safety
    required_fields = ["candidate_id", "profile_id", "score"]
    for idx, row in enumerate(rows):
        for field in required_fields:
            if field not in row:
                raise HTTPException(
                    status_code=500,
                    detail=f"RPC 'match_candidates_for_position' missing field '{field}' in row {idx}",
                )

    # 5) Normalize scores with logistic mapping (absolute, not batch-based)
    scores = [float(row["score"]) for row in rows]
    norm_scores = _normalize(scores)

    # 6) Compute gaps for ALL (candidate, profile) pairs in these rows
    gaps_map = get_skill_gaps_for_candidates_and_profiles(rows)
    # gaps_map key: (candidate_id, profile_id) -> SkillGapForProfile

    # 7) Cache profiles and candidates to avoid repeated DB calls
    profile_cache: Dict[int, Dict[str, Any]] = {}
    candidate_cache: Dict[int, Dict[str, Any]] = {}

    results: List[MatchResult] = []

    for row, norm_score in zip(rows, norm_scores):
        candidate_id = int(row["candidate_id"])
        profile_id = int(row["profile_id"])

        # cache profile
        if profile_id not in profile_cache:
            profile_cache[profile_id] = _get_profile(profile_id)
        profile = profile_cache[profile_id]

        # cache candidate to get candidate_name
        if candidate_id not in candidate_cache:
            candidate_cache[candidate_id] = _get_candidate(candidate_id)
        cand = candidate_cache[candidate_id]
        candidate_name = (
            f"{cand.get('first_name', '')} {cand.get('last_name', '')}".strip() or None
        )

        # look up gaps for this specific (candidate, profile)
        gap_obj = gaps_map.get((candidate_id, profile_id))

        results.append(
            MatchResult(
                candidate_id=candidate_id,
                candidate_name=candidate_name,
                position_id=position_id,
                profile_id=profile_id,
                category=category,
                category_colour=category_colour,
                score=norm_score,
                profile_name=str(profile.get("profile_name") or ""),
                profile_description=str(profile.get("description") or ""),
                position_name=str(position.get("position_name") or ""),
                gaps=gap_obj,
                experience_match=gap_obj,
            )
        )

    return results


# 2️⃣ Similar candidates (employee → employees)
@router.get("/candidates/similar", response_model=List[SimilarCandidateResult])
def get_similar_candidates(
    candidate_id: int = Query(...),
    limit: int = Query(10, ge=1, le=100),
):
    # 1) Validate base candidate exists
    _ = _get_candidate(candidate_id)

    # 2) Call RPC
    rpc = supabase.rpc(
        "match_similar_candidates",
        {"p_candidate_id": candidate_id, "p_limit": limit},
    ).execute()

    rows = rpc.data or []
    if not rows:
        return []

    # 3) Basic schema validation
    required_fields = ["candidate_id", "score"]
    for idx, row in enumerate(rows):
        for field in required_fields:
            if field not in row:
                raise HTTPException(
                    status_code=500,
                    detail=f"RPC 'match_similar_candidates' missing field '{field}' in row {idx}",
                )

    # 4) Normalize scores (logistic, batch-independent)
    scores = [float(row["score"]) for row in rows]
    norm_scores = _normalize(scores)

    # 5) Compute gaps between base candidate and all similar candidates
    similar_ids = [int(r["candidate_id"]) for r in rows]
    gaps_map = get_skill_gaps_between_candidates(
        base_candidate_id=candidate_id,
        similar_candidate_ids=similar_ids,
    )

    results: List[SimilarCandidateResult] = []

    for row, norm_score in zip(rows, norm_scores):
        similar_id = int(row["candidate_id"])

        # deterministic colour based on similar candidate id
        category = "similar_candidates"
        category_colour: Optional[Literal["red", "blue", "green", "yellow", "orange"]] = None
        if colours:
            category_colour = colours[similar_id % len(colours)]

        gap_obj = gaps_map.get(similar_id)

        results.append(
            SimilarCandidateResult(
                candidate_id=similar_id,
                category=category,
                category_colour=category_colour,
                score=norm_score,
                gaps=gap_obj,
                experience_match=gap_obj,
            )
        )

    return results


# 3️⃣ Top positions for a candidate (candidate → profiles → positions)
@router.get(
    "/positions/top",
    response_model=List[MatchResult],
)
def get_top_positions_for_candidate(
    candidate_id: int = Query(...),
    limit: int = Query(10, ge=1, le=100),
):
    # 1) Validate candidate exists (404 if missing) + get their record
    candidate = _get_candidate(candidate_id)
    candidate_name = (
        f"{candidate.get('first_name', '')} {candidate.get('last_name', '')}".strip() or None
    )

    # 2) Call RPC: match_positions_for_candidate
    rpc = supabase.rpc(
        "match_positions_for_candidate",
        {"p_candidate_id": candidate_id, "p_limit": limit},
    ).execute()

    rows = rpc.data or []
    if not rows:
        return []

    # 3) Basic schema validation for safety
    required_fields = ["profile_id", "position_id", "score"]
    for idx, row in enumerate(rows):
        for field in required_fields:
            if field not in row:
                raise HTTPException(
                    status_code=500,
                    detail=f"RPC 'match_positions_for_candidate' missing field '{field}' in row {idx}",
                )

    # 4) Precompute categories per position (avoid repeated DB calls)
    unique_position_ids = {int(row["position_id"]) for row in rows}
    category_map: Dict[int, str] = {}
    for pos_id in unique_position_ids:
        category_map[pos_id] = get_position_category(supabase, pos_id) or ""

    # 5) Normalize scores using logistic mapping (batch-independent)
    scores = [float(row["score"]) for row in rows]
    norm_scores = _normalize(scores)

    # 6) Compute skill gaps once for all profiles in this result
    gaps = get_skill_gaps_by_candidate_and_profiles(
        candidate_id=candidate_id,
        profiles=rows,
    )

    # 7) Cache profiles to avoid repeated DB calls
    profile_cache: Dict[int, Dict[str, Any]] = {}

    results: List[MatchResult] = []

    for row, norm_score in zip(rows, norm_scores):
        profile_id = int(row["profile_id"])
        position_id = int(row["position_id"])

        # cache profile
        if profile_id not in profile_cache:
            profile_cache[profile_id] = _get_profile(profile_id)
        profile = profile_cache[profile_id]

        # category + colour for this position
        category = category_map.get(position_id, "")
        category_colour = (
            _category_colour_for_position(position_id) if category else None
        )

        # prefer names from RPC, fallback to profile if missing
        profile_name = row.get("profile_name") or profile.get("profile_name") or ""
        position_name = row.get("position_name") or ""

        results.append(
            MatchResult(
                candidate_id=candidate_id,
                candidate_name=candidate_name,
                position_id=position_id,
                profile_id=profile_id,
                category=category,
                category_colour=category_colour,
                profile_name=str(profile_name),
                profile_description=str(profile.get("description") or ""),
                position_name=str(position_name),
                score=norm_score,
                gaps=gaps.get(profile_id),
                experience_match=gaps.get(profile_id),
            )
        )

    return results


# 4️⃣ Similar positions (profile ↔ profile)
@router.get(
    "/positions/similar",
    response_model=List[PositionsSimilar])
def get_similar_positions(
    position_id: int = Query(...),
    limit: int = Query(10, ge=1, le=100),
):
    # 1) Validate base position exists (404 if not)
    _ = _get_position(position_id)

    # 1a) Determine base profile for this position (reference profile)
    base_profile = _get_profile_by_position_id(position_id)
    base_profile_id = int(base_profile["profile_id"])

    # 2) Call RPC: match_similar_positions
    rpc = supabase.rpc(
        "match_similar_positions",
        {"p_position_id": position_id, "p_limit": limit},
    ).execute()

    rows = rpc.data or []
    if not rows:
        return []

    # 3) Basic schema validation for safety
    # Expecting the same shape as match_positions_for_candidate, minus candidate_id:
    #   - profile_id (similar profile)
    #   - position_id (the similar position)
    #   - score
    required_fields = ["profile_id", "position_id", "score"]
    for idx, row in enumerate(rows):
        for field in required_fields:
            if field not in row:
                raise HTTPException(
                    status_code=500,
                    detail=f"RPC 'match_similar_positions' missing field '{field}' in row {idx}",
                )

    # 4) Precompute categories per position (avoid repeated DB calls)
    unique_position_ids = {int(row["position_id"]) for row in rows}
    category_map: Dict[int, str] = {}
    for pos_id in unique_position_ids:
        category_map[pos_id] = get_position_category(supabase, pos_id) or ""

    # 5) Normalize scores using logistic mapping (batch-independent)
    scores = [float(row["score"]) for row in rows]
    norm_scores = _normalize(scores)

    # 6) Compute profile-vs-profile gaps:
    # base_profile_id (reference) vs each similar profile_id in rows
    similar_profile_ids = [int(r["profile_id"]) for r in rows]
    profile_gaps_map = get_skill_gaps_between_profiles(
        base_profile_id=base_profile_id,
        similar_profile_ids=similar_profile_ids,
    )

    # 7) Cache profiles to avoid repeated DB calls
    profile_cache: Dict[int, Dict[str, Any]] = {}

    results: List[PositionsSimilar] = []

    for row, norm_score in zip(rows, norm_scores):
        profile_id = int(row["profile_id"])
        similar_position_id = int(row["position_id"])

        # Cache profile
        if profile_id not in profile_cache:
            profile_cache[profile_id] = _get_profile(profile_id)
        profile = profile_cache[profile_id]

        # category + colour for this similar position
        category = category_map.get(similar_position_id, "")
        category_colour = (
            _category_colour_for_position(similar_position_id) if category else None
        )

        # Prefer names from RPC, fallback to profile if missing
        profile_name = row.get("profile_name") or profile.get("profile_name") or ""
        position_name = row.get("position_name") or ""

        gap_obj = profile_gaps_map.get(profile_id)

        results.append(
            PositionsSimilar(
                # No specific candidate context here → excluded in response_model_exclude
                position_id=similar_position_id,
                profile_id=profile_id,
                category=category,
                category_colour=category_colour,
                profile_name=str(profile_name),
                profile_description=str(profile.get("description") or ""),
                position_name=str(position_name),
                score=norm_score,
                gaps=gap_obj,
                experience_match=gap_obj,
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

    # All profiles for this position
    profiles = _get_profiles_for_position(position_id)

    cand_name = f"{candidate.get('first_name', '')} {candidate.get('last_name', '')}".strip()
    pos_name = position["position_name"]
    # Candidate skills
    cand_hard = _parse_skills(candidate.get("hard_skills"))
    cand_soft = _parse_skills(candidate.get("soft_skills"))

    if not profiles:
        raise HTTPException(status_code=404, detail="No profiles found for this position")

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


@router.post("/learning_recommendations", response_model=LearningRecommendationResponse)
def get_learning_recommendations(employee_number: int, profile_id: int):
    """
    Build a prompt with employee info, target profile, skill gaps and available courses,
    then use LangChain `with_structured_output` to get a LearningRecommendationModel,
    finally return a LearningRecommendationResponse with plan and concrete course objects.
    """
    # 1) Fetch data
    employee = _get_candidate(employee_number)
    profile = _get_profile(profile_id)

    # 2) Parse skills and compute gaps
    cand_hard = _parse_skills(employee.get("hard_skills"))
    cand_soft = _parse_skills(employee.get("soft_skills"))
    req_hard = _parse_skills(profile.get("hard_skills"))
    req_soft = _parse_skills(profile.get("soft_skills"))

    hard_gaps = _analyze_skill_gaps(cand_hard, req_hard)
    soft_gaps = _analyze_skill_gaps(cand_soft, req_soft)

    # 3) Fetch courses catalog (assume courses table / endpoint exists)
    try:
        courses_resp = (
            supabase.table("courses").select("id, course_name, course_description").execute()
        )
        courses_data = courses_resp.data or []
    except Exception:  # fallback empty catalog if table absent
        courses_data = []

    # Map id->course for quick lookup later
    id_to_course: Dict[int, Course] = {}
    for c in courses_data:
        try:
            cid = int(c.get("id"))
            id_to_course[cid] = Course(
                id=cid,
                name=str(c.get("course_name") or ""),
                description=str(c.get("course_description") or ""),
            )
        except Exception:
            continue
    print(id_to_course)

    # 4) Prepare LLM
    if ChatOpenAI is None or ChatPromptTemplate is None:
        raise HTTPException(status_code=500, detail="LLM dependencies are not available on server")

    openai_key = os.environ.get("OPENAI_API_KEY")
    if not openai_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not configured")

    model_name = os.environ.get("OPENAI_MODEL", "gpt-4o")
    llm = ChatOpenAI(model=model_name, temperature=0.2)
    structured_llm = llm.with_structured_output(LearningRecommendationModel)

    # 5) Build prompt
    employee_name = f"{employee.get('first_name', '')} {employee.get('last_name', '')}".strip()
    profile_name = str(profile.get("profile_name") or profile.get("position_name") or "")

    def gaps_block(title: str, gaps: List[SkillGap]) -> str:
        lines = [title + ":"]
        if not gaps:
            lines.append("  - none")
        else:
            for g in gaps:
                lines.append(
                    f"  - {g.skill}: candidate={g.candidate_level}, required={g.required_level}, gap={g.gap}, status={g.status}"
                )
        return "\n".join(lines)

    def dict_block(title: str, d: Dict[str, int]) -> str:
        lines = [title + ":"]
        if not d:
            lines.append("  - none")
        else:
            for k, v in sorted(d.items()):
                lines.append(f"  - {k}: {v}")
        return "\n".join(lines)

    courses_block_lines = ["Available courses (choose relevant by ID):"]
    if id_to_course:
        for cid, course in sorted(id_to_course.items(), key=lambda x: x[0]):
            courses_block_lines.append(f"  - [{cid}] {course.name}: {course.description}")
    else:
        courses_block_lines.append("  - (no courses available)")
    courses_block = "\n".join(courses_block_lines)
    print(courses_block)

    full_prompt = "\n".join(
        [
            "You are an expert learning and development advisor.",
            "Given the employee's current skills and the target profile requirements,",
            "analyze the gaps and propose a concise, actionable learning plan.",
            "Return a structured response with a textual plan and a list of course IDs that best address the gaps.",
            "\nContext:",
            f"Employee: {employee_name} (#{employee_number})",
            f"Target profile: {profile_name} (#{profile_id})",
            dict_block("Candidate hard skills", cand_hard),
            dict_block("Candidate soft skills", cand_soft),
            dict_block("Required hard skills", req_hard),
            dict_block("Required soft skills", req_soft),
            gaps_block("Hard skill gaps", hard_gaps),
            gaps_block("Soft skill gaps", soft_gaps),
            "\n" + courses_block,
            "\nInstructions:",
            "- Create a short plan (3-5 bullets) prioritizing the most impactful upskilling steps.",
            "You must explain which gaps the courses help to reduce in order to meet the profiles requirements.",
            "- Select 1-3 course IDs that directly help close the most important gaps.",
            "- Prefer beginner/intermediate where gaps are large; advanced for strengths only when useful.",
            "respond ONLY in Hebrew!",
        ]
    )

    prompt = ChatPromptTemplate.from_template("{input}")
    print(full_prompt)
    chain = prompt | structured_llm
    rec: LearningRecommendationModel = cast(
        LearningRecommendationModel, chain.invoke({"input": full_prompt})
    )

    # 6) Map ids back to Course objects and build response
    selected_courses: List[Course] = []
    for cid in rec.ids:
        if cid in id_to_course:
            selected_courses.append(id_to_course[cid])

    return LearningRecommendationResponse(plan=rec.plan, courses=selected_courses)
