import uuid
from uuid import UUID
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator
from app.models.Skill import Skill


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

    soft_skills: List[Skill] = Field(
        default_factory=list,
        description="List of soft skills associated with this profile. "
                    "Each skill must have type='soft'.",
    )

    hard_skills: List[Skill] = Field(
        default_factory=list,
        description="List of hard skills associated with this profile. "
                    "Each skill must have type='hard'.",
    )

    # --- Validators ---

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
        Pydantic configuration for the Profile model.

        - `json_schema_extra` provides a concrete example for documentation / OpenAPI.
        """

        json_schema_extra = {
            "example": {
                "id": str(uuid.uuid4()),
                "name": "Senior Backend Engineer Profile",
                "soft_skills": [
                    {"id": str(uuid.uuid4()), "type": "soft", "name": "Communication", "level": 4},
                ],
                "hard_skills": [
                    {"id": str(uuid.uuid4()), "type": "hard", "name": "Python", "level": 6},
                    {"id": str(uuid.uuid4()), "type": "hard", "name": "SQL", "level": 5},
                ],
            }
        }
