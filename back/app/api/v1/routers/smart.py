from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.services.matching import matching_service
from app.services.ingestion import ingestion_service
from app.models.Employee import Employee
from app.models.Position import Position

router = APIRouter(prefix="/smart", tags=["smart"])


class MatchResult(BaseModel):
    """Result from matching operation with detailed explanation"""
    id: str
    name: str
    score: float
    semantic_similarity: Optional[float] = None
    skill_match: Optional[float] = None
    details: Optional[Dict[str, Any]] = None


class SkillGapResponse(BaseModel):
    """Comprehensive skill gap analysis response"""
    readiness_score: float
    summary: Dict[str, int]
    hard_skills_analysis: Dict[str, Any]
    soft_skills_analysis: Dict[str, Any]
    recommendations: List[Dict[str, Any]]


"""
Smart routes use the ingestion_service as an in-memory data store for the MVP.
In production, these routes would read/write to a database and vector index.
"""


@router.post("/employees/ingest")
async def ingest_employee(employee: Employee):
    """
    Ingest a employee into the system (demo endpoint)
    In production, this would vectorize and store in database
    """
    ingestion_service.ingest_employee(employee)
    return {
        "message": "Employee ingested successfully",
        "employee_id": employee.employee_id,
        "note": "In production, this would generate embeddings and store in PostgreSQL"
    }


@router.post("/positions/ingest")
async def ingest_position(position: Position):
    """
    Ingest a position into the system (demo endpoint)
    In production, this would vectorize and store in database
    """
    ingestion_service.ingest_position(position)
    return {
        "message": "Position ingested successfully",
        "position_id": str(position.id),
        "note": "In production, this would generate embeddings and store in PostgreSQL"
    }


@router.get("/employees/top", response_model=List[MatchResult])
async def get_top_employees(
    position_id: str = Query(..., description="Position ID to match against"),
    limit: int = Query(10, ge=1, le=100, description="Number of top employees to return")
):
    """
    Get top matching employees for a position using hybrid scoring

    Algorithm:
    1. Fetch position embedding from database
    2. Perform vector similarity search in employees table
    3. Calculate skill overlap for top results
    4. Combine semantic similarity (60%) + skill match (30%) + category bonus (10%)
    5. Return ranked results with explanations
    """
    # Ensure position exists
    if not ingestion_service.get_position(position_id):
        raise HTTPException(status_code=404, detail=f"Position {position_id} not found. Use /smart/positions/ingest to add positions.")

    results = matching_service.get_top_employees_for_position(position_id, limit)
    return results


@router.get("/employees/similar", response_model=List[MatchResult])
async def get_similar_employees(
    employee_id: str = Query(..., description="Employee ID to find similar employees"),
    limit: int = Query(10, ge=1, le=100, description="Number of similar employees to return")
):
    """
    Find similar employees based on skills and experience
    Uses pure vector similarity search
    """
    if not ingestion_service.get_employee(employee_id):
        raise HTTPException(status_code=404, detail=f"Employee {employee_id} not found. Use /smart/employees/ingest to add employees.")

    results = matching_service.get_similar_employees(employee_id, limit)
    return results


@router.get("/positions/top", response_model=List[MatchResult])
async def get_top_positions(
    employee_id: str = Query(..., description="Employee ID to match against"),
    limit: int = Query(10, ge=1, le=100, description="Number of top positions to return")
):
    """
    Get top matching positions for a employee using hybrid scoring
    Filters out positions where employee is significantly overqualified
    """
    if not ingestion_service.get_employee(employee_id):
        raise HTTPException(status_code=404, detail=f"Employee {employee_id} not found. Use /smart/employees/ingest to add employees.")

    results = matching_service.get_top_positions_for_employee(employee_id, limit)
    return results


@router.get("/positions/similar", response_model=List[MatchResult])
async def get_similar_positions(
    position_id: str = Query(..., description="Position ID to find similar positions"),
    limit: int = Query(10, ge=1, le=100, description="Number of similar positions to return")
):
    """
    Find similar positions based on requirements and skills
    Uses pure vector similarity search
    """
    if not ingestion_service.get_position(position_id):
        raise HTTPException(status_code=404, detail=f"Position {position_id} not found. Use /smart/positions/ingest to add positions.")

    results = matching_service.get_similar_positions(position_id, limit)
    return results


@router.get("/gaps", response_model=SkillGapResponse)
async def get_skill_gaps(
    employee_id: str = Query(..., description="Employee ID"),
    position_id: str = Query(..., description="Position ID")
):
    """
    Comprehensive skill gap analysis between employee and position

    Returns:
    - Readiness score (0-100): Overall fitness for the position
    - Detailed gaps by skill with severity levels
    - Actionable recommendations for skill development

    Gap Status Levels:
    - critical_gap: Gap > 1.5 points (high priority to address)
    - moderate_gap: Gap 0.5-1.5 points (should improve)
    - minor_gap: Gap <= 0.5 points (nice to improve)
    - met: Employee meets or exceeds requirement
    """

    # Get employee and position from storage
    employee = ingestion_service.get_employee(employee_id)
    position = ingestion_service.get_position(position_id)

    if not employee:
        raise HTTPException(status_code=404, detail=f"Employee {employee_id} not found. Use /smart/employees/ingest to add employees.")

    if not position:
        raise HTTPException(status_code=404, detail=f"Position {position_id} not found. Use /smart/positions/ingest to add positions.")

    # Perform skill gap analysis
    analysis = matching_service.analyze_skill_gaps(employee, position)

    return SkillGapResponse(**analysis)


@router.get("/health")
async def health_check():
    """Check if the smart matching service is ready"""
    return {
        "status": "healthy",
        "service": "smart-matching",
        "features": {
            "vectorization": "sentence-transformers (all-MiniLM-L6-v2)",
            "database": "PostgreSQL + pgvector",
            "scoring": "hybrid (semantic + structured)",
            "employees_loaded": len(ingestion_service.list_employees()),
            "positions_loaded": len(ingestion_service.list_positions()),
        }
    }
