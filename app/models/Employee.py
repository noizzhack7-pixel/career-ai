from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.Position import Position
from app.models.Skill import HardSkill, SoftSkill


class Employee(BaseModel):
    """
    Represents an employee or applicant with a structured set of skills
    and employment history.
    """

    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Full name of the employee or candidate.",
    )

    current_position: Optional[Position] = Field(
        default=None,
        description="Optional current position for the candidate - if currently employed.",
    )

    past_positions: Optional[List[Position]] = Field(
        default=None,
        description="Optional list of previously held positions for the candidate.",
    )

    hard_skills: List[HardSkill] = Field(
        default_factory=list,
        description="List of hard (technical) skills.",
        min_length=3,
        max_length=10
    )

    soft_skills: List[SoftSkill] = Field(
        default_factory=list,
        description="List of soft (behavioral) skills.",
        min_length=3,
        max_length=10
    )

    employee_id: int = Field(
        description="Unique employee identifier.",
        le=100_000
    )