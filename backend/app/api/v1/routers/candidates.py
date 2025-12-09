"""Candidates API router."""

import json
from pathlib import Path
from typing import List, Optional, Literal
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models.Candidate import Candidate

router = APIRouter(prefix="/candidates", tags=["candidates"])

# Data directory
DATA_DIR = Path(__file__).parent.parent.parent.parent.parent / "data"

# Hardcoded mock candidate ID
MOCK_CANDIDATE_ID = "user-1"


# =====================
# Profile-related models
# =====================

class Organization(BaseModel):
    division: str
    department: str
    team: str


class CandidateDetails(BaseModel):
    seniority: str
    grade: str
    manager: str
    location: str
    email: Optional[str] = None
    phone: Optional[str] = None


class CandidateMetrics(BaseModel):
    kudos: int
    data_quality: int
    matching_jobs_count: int


class Education(BaseModel):
    degree: str
    institution: str


class Specialization(BaseModel):
    main: str
    area: str


class IDPProgress(BaseModel):
    overall: int
    gaps_remaining: int
    gaps_total: int
    tasks_completed: int
    tasks_total: int
    estimated_months: int


class IDP(BaseModel):
    progress: IDPProgress


# Extended profile models
class SkillWithLevel(BaseModel):
    name: str
    level: int  # 1-5


class EducationItem(BaseModel):
    id: str
    title: str
    institution: str
    year_start: Optional[str] = None
    year_end: Optional[str] = None
    type: Literal["degree", "certification", "course"]
    description: Optional[str] = None


class ExperienceItem(BaseModel):
    id: str
    title: str
    department: str
    division: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    is_current: bool
    description: str
    achievements: List[str]


class Recommendation(BaseModel):
    id: str
    author_name: str
    author_title: str
    author_avatar: str
    relationship: Literal["manager", "colleague", "mentee"]
    date: str
    rating: int  # 1-5
    content: str
    skills_mentioned: List[str]


class WishlistItem(BaseModel):
    id: str
    type: Literal["text", "role", "keywords"]
    created_at: str
    has_alert: bool
    # For text type
    content: Optional[str] = None
    # For role type
    role_title: Optional[str] = None
    role_department: Optional[str] = None
    role_status: Optional[Literal["open", "closed"]] = None
    # For keywords type
    keywords: Optional[List[str]] = None


class CareerPreferences(BaseModel):
    career_path: Literal["management", "professional"]
    role_types: List[str]
    interests: List[str]
    locations: List[str]


class Language(BaseModel):
    name: str
    level: Literal["native", "fluent", "intermediate", "basic"]


class TargetRole(BaseModel):
    title: str
    division: str
    match_percentage: int
    required_skills_met: int
    required_skills_total: int
    gaps_count: int
    estimated_months: int


class NotificationItem(BaseModel):
    id: str
    type: Literal["job_match", "idp_update", "recommendation", "general"]
    title: str
    message: str
    timestamp: str


class CandidateProfile(BaseModel):
    """Extended candidate profile with all details."""
    id: str
    name: str
    title: str
    avatar: str
    cover_image: str
    is_active: Optional[bool] = True
    organization: Organization
    details: CandidateDetails
    metrics: CandidateMetrics
    education: Education
    specialization: Specialization
    soft_skills: List[str]
    hard_skills: List[str]
    idp: Optional[IDP] = None
    # Extended profile fields
    bio: Optional[str] = None
    professional_interests: Optional[List[str]] = None
    soft_skills_detailed: Optional[List[SkillWithLevel]] = None
    hard_skills_detailed: Optional[List[SkillWithLevel]] = None
    education_items: Optional[List[EducationItem]] = None
    experience: Optional[List[ExperienceItem]] = None
    recommendations: Optional[List[Recommendation]] = None
    wishlist: Optional[List[WishlistItem]] = None
    career_preferences: Optional[CareerPreferences] = None
    languages: Optional[List[Language]] = None
    target_role: Optional[TargetRole] = None
    notifications: Optional[List[NotificationItem]] = None


def load_json_file(filename: str) -> dict:
    """Load JSON data from file."""
    filepath = DATA_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail=f"Data file not found: {filename}")
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


# =====================
# API Endpoints
# =====================

@router.post("/", response_model=Candidate, status_code=201)
async def create_candidate(candidate: Candidate):
    """Create a new candidate"""
    return candidate


@router.post("/batch", response_model=List[Candidate], status_code=201)
async def create_candidates(candidates: List[Candidate]):
    """Create multiple candidates"""
    return candidates


@router.get("/", response_model=List[Candidate])
async def get_all_candidates():
    """Retrieve all candidates"""
    return []


@router.get("/profile/{candidate_id}", response_model=CandidateProfile)
async def get_candidate_profile(candidate_id: str):
    """
    Get a candidate's full profile including IDP.
    For now, returns mock data for the hardcoded candidate ID.
    """
    # For now, we only have mock data for one candidate
    if candidate_id != MOCK_CANDIDATE_ID:
        raise HTTPException(status_code=404, detail=f"Candidate not found: {candidate_id}")
    
    data = load_json_file("mock_user_profile.json")
    return CandidateProfile(**data)


@router.get("/me", response_model=CandidateProfile)
async def get_current_candidate():
    """
    Get the current user's profile (convenience endpoint).
    Returns the mock candidate profile.
    """
    data = load_json_file("mock_user_profile.json")
    return CandidateProfile(**data)


@router.get("/{candidate_id}", response_model=Candidate)
async def get_candidate(candidate_id: str):
    """Retrieve a specific candidate by ID"""
    raise HTTPException(status_code=404, detail="Candidate not found")


@router.put("/{candidate_id}", response_model=Candidate)
async def update_candidate(candidate_id: str, candidate: Candidate):
    """Update an existing candidate"""
    return candidate


@router.delete("/{candidate_id}", status_code=204)
async def delete_candidate(candidate_id: str):
    """Delete a specific candidate"""
    pass


@router.delete("/", status_code=204)
async def delete_all_candidates():
    """Delete all candidates"""
    pass
