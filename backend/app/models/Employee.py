import uuid
from typing import List, Optional

from pydantic import BaseModel, Field

from backend.app.models.Skill import HardSkill, SoftSkill
from backend.app.models.Position import Position


class Employee(BaseModel):
    """
    Represents an employee with identified skills and optional position history.

    This mirrors the style used across other models (immutable IDs, Pydantic types).
    """

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        description="Unique employee identifier.",
    )

    name: str = Field(
        ..., min_length=1, max_length=100, description="Full name of the employee."
    )

    current_position: Optional[Position] = Field(
        default=None,
        description="Optional current position of the employee.",
    )

    past_positions: List[Position] = Field(
        default_factory=list,
        description="List of previously held positions.",
    )

    hard_skills: List[HardSkill] = Field(
        default_factory=list,
        description="List of hard (technical) skills.",
    )

    soft_skills: List[SoftSkill] = Field(
        default_factory=list,
        description="List of soft (behavioral) skills.",
    )
