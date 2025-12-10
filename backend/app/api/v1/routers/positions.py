"""Positions API router."""

import json
from pathlib import Path
from typing import List
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from backend.app.models.Position import Position
from backend.app.services.supabase_client import get_supabase_client

router = APIRouter(prefix="/positions", tags=["positions"])
supabase = get_supabase_client()

# Data directory
DATA_DIR = Path(__file__).parent.parent.parent.parent.parent / "data"

# Hardcoded mock employee ID
MOCK_POSITION_NUMBER = '70000501'

# Hardcoded fields to enrich the returned position payload
HARD_CODED_POSITION_FIELDS = {
    "Requirements": [
        "5+ years experience building distributed systems",
        "B.Sc. in Computer Science or equivalent practical experience",
        "Hands-on with cloud infrastructure (AWS/Azure/GCP)",
    ],
    "Responsibillities": [
        "Design and own critical backend services end-to-end",
        "Collaborate with product to refine technical scope and milestones",
        "Mentor team members and drive engineering best practices",
    ],
    "location": "תל אביב",
    "position_type": "משרה מלאה",
    "skills": [
        "ארכיטקטורה:5",
        "Python:4",
        "Microservices:4",
    ],
}

# =====================
# Matching Position models
# =====================

class PositionRequirement(BaseModel):
    skill: str
    status: str
    note: str | None = None


class SkillMatch(BaseModel):
    name: str
    matched: bool
    gap: str | None = None


class MatchingPosition(BaseModel):
    """Position with matching score for a candidate."""
    id: str
    title: str
    category: str
    category_icon: str
    category_color: str
    match_percentage: int
    match_level: str
    division: str
    location: str
    work_model: str
    description: str
    requirements: List[PositionRequirement]
    responsibilities: List[str] | None = None
    posted_time: str | None = None
    is_open: bool | None = None
    hard_skills_match: List[SkillMatch] | None = None
    soft_skills_match: List[SkillMatch] | None = None
    experience_match: List[SkillMatch] | None = None
    match_summary: str | None = None


def load_json_file(filename: str) -> dict | list:
    """Load JSON data from file."""
    filepath = DATA_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail=f"Data file not found: {filename}")
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


# =====================
# API Endpoints
# =====================

@router.post("/", response_model=Position, status_code=201)
async def create_position(position: Position):
    """Create a new position"""
    return position


@router.post("/batch", response_model=List[Position], status_code=201)
async def create_positions(positions: List[Position]):
    """Create multiple positions"""
    return positions


@router.get("/", response_model=List[dict])
async def get_all_positions():
    """Retrieve all positions"""
    client = supabase
    if client:
        try:
            resp = client.table("positions").select("*").execute()
            data = resp.data or []
            # Remove embedding field from each position
            if isinstance(data, list):
                for pos in data:
                    if isinstance(pos, dict):
                        pos.pop("embedding", None)
            return data
        except Exception as exc:
            print(f"[positions] Supabase fetch all failed: {exc}")
    return []


@router.get("/matching", response_model=List[MatchingPosition])
async def get_matching_positions():
    """
    Get positions matching the current user's profile.
    Returns positions with match scores and requirements status.
    """
    data = load_json_file("mock_matching_jobs.json")
    return [MatchingPosition(**job) for job in data]


@router.get("/matching/{position_id}", response_model=MatchingPosition)
async def get_matching_position(position_id: str):
    """Get a specific matching position by ID."""
    jobs = load_json_file("mock_matching_jobs.json")
    for job in jobs:
        if job["id"] == position_id:
            return MatchingPosition(**job)
    raise HTTPException(status_code=404, detail=f"Position not found: {position_id}")

@router.get("/me", response_model=dict)
async def get_current_position(position_id: str = Header(default=MOCK_POSITION_NUMBER, alias="X-User-ID")):
    """
    Get the current employee (based on X-User-ID header, or default mock)
    """
    # Use the get_position function to fetch the position with mock_position_number
    return await get_position(position_id)

@router.get("/{position_id}", response_model=dict)
async def get_position(position_id: str):
    """Retrieve a specific position by ID"""
    client = supabase
    position_data: dict = {}
    if client:
        try:
            resp = client.table("positions").select("*").eq("position_id", position_id).single().execute()
            position_data = resp.data or {}
        except Exception as exc:
            print(f"[positions] /{position_id} Supabase fetch failed: {exc}")
    # Always include the hardcoded fields, even if Supabase is unavailable
    return {**position_data, **HARD_CODED_POSITION_FIELDS}


@router.put("/{position_id}", response_model=Position)
async def update_position(position_id: str, position: Position):
    """Update an existing position"""
    return position


@router.delete("/{position_id}", status_code=204)
async def delete_position(position_id: str):
    """Delete a specific position"""
    pass


@router.delete("/", status_code=204)
async def delete_all_positions():
    """Delete all positions"""
    pass
