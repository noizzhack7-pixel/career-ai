import uuid
from pydantic import BaseModel, Field
from app.models.BaseValues import SkillType, SkillRange


class Skill(BaseModel):
    """A soft or hard skill with a validated proficiency level."""

    type: SkillType
    name: str
    level: SkillRange
    id: str = Field(default_factory=uuid.uuid4, description="Unique skill identifier")

    class Config:
        frozen = True  # Skills should be immutable once created
        json_schema_extra = {
            "example": {
                "type": "soft",
                "name": "Communication",
                "level": 4.5,
            }
        }
