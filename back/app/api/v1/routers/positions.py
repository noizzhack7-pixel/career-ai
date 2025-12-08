"""Positions API router."""

import json
from pathlib import Path
from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models.Position import Position

router = APIRouter(prefix="/positions", tags=["positions"])

# Data directory
DATA_DIR = Path(__file__).parent.parent.parent.parent.parent / "data"


# =====================
# Matching Position models
# =====================

class PositionRequirement(BaseModel):
    skill: str
    status: str


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


@router.get("/", response_model=List[Position])
async def get_all_positions():
    """Retrieve all positions"""
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


@router.get("/{position_id}", response_model=Position)
async def get_position(position_id: str):
    """Retrieve a specific position by ID"""
    raise HTTPException(status_code=404, detail="Position not found")


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
