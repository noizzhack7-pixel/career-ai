import uuid
from typing import List
from pydantic import BaseModel, Field
from app.models.BaseValues import PositionCategory
from app.models.Profile import Profile


class Position(BaseModel):
    """A job position in the organization, with one or more skill profiles."""

    name: str = Field(..., description="Position name, e.g., 'AI Engineer'")
    profiles: List[Profile] = Field(
        default_factory=list,
        description="Skill profiles defining requirements for this position"
    )
    category: PositionCategory = Field(
        ..., description="Organizational category for this position"
    )

    id: str = Field(default_factory=uuid.uuid4, description="Unique position identifier")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Data Scientist",
                "category": "Tech",
                "profiles": [],
            }
        }
