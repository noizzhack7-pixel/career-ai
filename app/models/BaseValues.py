from typing import Literal, Annotated
from pydantic import Field


# Distinguishes between two major skill types
SkillType = Literal["soft", "hard"]

# Numeric range for skill levels (0–6). Annotated creates a clean alias.
SkillRange = Annotated[float, Field(ge=0.0, le=6.0)]

# Categories for a job position in the organization
PositionCategory = Literal[
    "Tech",
    "HR",
    "Business",
    "Finance",
    "Law",
    "Other",
]
