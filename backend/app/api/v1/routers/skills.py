from fastapi import APIRouter, HTTPException
from typing import List, Union
from backend.app.models.Skill import HardSkill, SoftSkill

router = APIRouter(prefix="/skills", tags=["skills"])


@router.post("/hard", response_model=HardSkill, status_code=201)
async def create_hard_skill(skill: HardSkill):
    """Create a new hard skill"""
    return skill


@router.post("/soft", response_model=SoftSkill, status_code=201)
async def create_soft_skill(skill: SoftSkill):
    """Create a new soft skill"""
    return skill


@router.get("/hard", response_model=List[HardSkill])
async def get_all_hard_skills():
    """Retrieve all hard skills"""
    return []


@router.get("/soft", response_model=List[SoftSkill])
async def get_all_soft_skills():
    """Retrieve all soft skills"""
    return []


@router.get("/hard/{skill_id}", response_model=HardSkill)
async def get_hard_skill(skill_id: str):
    """Retrieve a specific hard skill by ID"""
    raise HTTPException(status_code=404, detail="Hard skill not found")


@router.get("/soft/{skill_id}", response_model=SoftSkill)
async def get_soft_skill(skill_id: str):
    """Retrieve a specific soft skill by ID"""
    raise HTTPException(status_code=404, detail="Soft skill not found")


@router.delete("/hard/{skill_id}", status_code=204)
async def delete_hard_skill(skill_id: str):
    """Delete a specific hard skill"""
    pass


@router.delete("/soft/{skill_id}", status_code=204)
async def delete_soft_skill(skill_id: str):
    """Delete a specific soft skill"""
    pass


@router.delete("/", status_code=204)
async def delete_all_skills():
    """Delete all skills"""
    pass
