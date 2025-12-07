from fastapi import APIRouter, HTTPException
from typing import List
from app.models.Position import Position

router = APIRouter(prefix="/positions", tags=["positions"])


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
