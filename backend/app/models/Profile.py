import uuid
from uuid import UUID
from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.Skill import SoftSkill, HardSkill


class Profile(BaseModel):
    """
    Represents a structured profile of skills for a user, role, or position.

    A Profile typically groups:
    - soft skills (e.g., communication, teamwork),
    - hard skills (e.g., Python, SQL),
    and may optionally have a human-readable name.
    """

    id: UUID = Field(
        default_factory=uuid.uuid4,
        description="Unique profile identifier.",
    )

    name: Optional[str] = Field(
        default=None,
        description="Human-readable profile name (e.g., 'Senior Backend Engineer Profile').",
    )

    soft_skills: List[SoftSkill] = Field(
        default_factory=list,
        description="List of soft skills associated with this profile.",
    )

    hard_skills: List[HardSkill] = Field(
        default_factory=list,
        description="List of hard skills associated with this profile..",

    )
