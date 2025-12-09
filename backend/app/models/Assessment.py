from typing import Dict, List
from pydantic import BaseModel, Field
from datetime import datetime


class AssessmentQuestion(BaseModel):
    """Represents a single assessment question"""
    id: int = Field(..., description="Unique question identifier")
    text: str = Field(..., description="Question text")
    category: str = Field(..., description="Skill category this question maps to")


class AssessmentSubmission(BaseModel):
    """Request model for submitting assessment answers"""
    answers: Dict[int, int] = Field(
        ...,
        description="Map of QuestionID to Score (1-5)",
        example={1: 5, 2: 4, 3: 3}
    )


class CategoryScore(BaseModel):
    """Represents the calculated score for a skill category"""
    category: str = Field(..., description="Skill category name")
    score: float = Field(..., ge=0.0, le=5.0, description="Average score for this category")
    question_count: int = Field(..., description="Number of questions in this category")


class AssessmentResult(BaseModel):
    """Complete assessment result for a user with AI analysis"""
    user_id: str = Field(..., description="User ID from X-User-ID header")
    submitted_at: datetime = Field(default_factory=datetime.now, description="Timestamp of submission")
    category_scores: List[CategoryScore] = Field(..., description="Scores for each skill category")
    ai_summary: str = Field(..., description="AI-generated profile summary in Hebrew")
    top_strengths: List[str] = Field(..., description="Top 3 strengths identified by AI")
    growth_recommendation: str = Field(..., description="AI-generated career growth recommendation in Hebrew")

