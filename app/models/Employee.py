import uuid
from uuid import UUID
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator
from app.models.Position import Position
from app.models.Skill import Skill


class Employee(BaseModel):
    """
    Represents an employee or applicant with a structured set of skills
    and employment history.

    An Employee contains:
    - a unique employee identifier,
    - personal info (name),
    - categorized skills (soft & hard),
    - and an optional list of past positions for career trajectory analysis.
    """

    employee_id: UUID = Field(
        default_factory=uuid.uuid4,
        description="Unique employee identifier.",
    )

    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Full name of the employee or candidate.",
    )

    hard_skills: List[Skill] = Field(
        default_factory=list,
        description="List of hard (technical) skills. Each skill must have type='hard'.",
    )

    soft_skills: List[Skill] = Field(
        default_factory=list,
        description="List of soft (behavioral) skills. Each skill must have type='soft'.",
    )

    past_positions: Optional[List[Position]] = Field(
        default=None,
        description="Optional list of previously held positions for the candidate.",
    )

    @field_validator("soft_skills")
    @classmethod
    def ensure_soft_skills_are_soft(cls, skill: Skill) -> Skill:
        """
        Ensure that every skill in `soft_skills` has type == 'soft'.
        """
        if skill.type != "soft":
            raise ValueError(
                f"soft_skills can only contain skills with type='soft', "
                f"got type='{skill.type}' for skill '{skill.name}'."
            )
        return skill

    @field_validator("hard_skills")
    @classmethod
    def ensure_hard_skills_are_hard(cls, skill: Skill) -> Skill:
        """
        Ensure that every skill in `hard_skills` has type == 'hard'.
        """
        if skill.type != "hard":
            raise ValueError(
                f"hard_skills can only contain skills with type='hard', "
                f"got type='{skill.type}' for skill '{skill.name}'."
            )
        return skill

    class Config:
        """
        Pydantic configuration for the Candidate model.
        """
        orm_mode = True
        json_schema_extra = {
            "example": {
                "employee_id": str(uuid.uuid4()),
                "name": "Dana Levi",
                "hard_skills": [
                    {"id": str(uuid.uuid4()), "type": "hard", "name": "Python", "level": 5},
                    {"id": str(uuid.uuid4()), "type": "hard", "name": "SQL", "level": 4},
                ],
                "soft_skills": [
                    {"id": str(uuid.uuid4()), "type": "soft", "name": "Teamwork", "level": 5},
                    {"id": str(uuid.uuid4()), "type": "soft", "name": "Adaptability", "level": 4},
                ],
                "past_positions": [],
            }
        }
