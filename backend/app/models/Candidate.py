import uuid
from typing import List, Optional
from pydantic import BaseModel, Field
from backend.app.models.Position import Position
from backend.app.models.Skill import HardSkill, SoftSkill


class Candidate(BaseModel):
    """
    Represents a candidate with a structured set of skills
    and employment history.
    """

    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Full name of the candidate.",
    )

    candidate_id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        description="Unique candidate identifier.",
    )

    current_position: Optional[Position] = Field(
        default=None,
        description="Optional current position for the candidate - if currently employed.",
    )

    past_positions: List[Position] = Field(
        default_factory=list,
        description="List of previously held positions for the candidate.",
    )

    hard_skills: List[HardSkill] = Field(
        description="List of hard (technical) skills.",
        min_length=3,
        max_length=10
    )

    soft_skills: List[SoftSkill] = Field(
        description="List of soft (behavioral) skills.",
        min_length=3,
        max_length=10
    )