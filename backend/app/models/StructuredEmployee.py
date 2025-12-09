import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field


class StructuredEmployee(BaseModel):
    """
    Pydantic model matching the `structured_employees` table schema.
    """

    employee_number: int = Field(..., description="Primary key of the employee.")
    first_name: str = Field(..., description="Employee first name.")
    last_name: str = Field(..., description="Employee last name.")

    short_summary: Optional[str] = Field(
        default=None,
        description="Free-text professional summary (feeds fulltext).",
    )

    current_position: Optional[int] = Field(
        default=None,
        description="FK to positions.position_id (nullable, on delete set null).",
    )

    past_positions: List[int] = Field(
        default_factory=list,
        description="Array of past position IDs.",
    )

    created_at: Optional[datetime.datetime] = Field(
        default=None,
        description="Creation timestamp (defaults to now() in DB).",
    )
    updated_at: Optional[datetime.datetime] = Field(
        default=None,
        description="Update timestamp (defaults to now() in DB).",
    )

    soft_skills: Optional[Any] = Field(
        default=None,
        description="JSON column of soft skills (free structure).",
    )
    hard_skills: Optional[Any] = Field(
        default=None,
        description="JSON column of hard skills (free structure).",
    )

    # Embedding is stored as `extensions.vector` in Postgres; modelled as list of floats here.
    embedding: Optional[List[float]] = Field(
        default=None,
        description="Vector embedding used for similarity search.",
    )

    # fulltext is generated in DB; typically not provided by clients.
    fulltext: Optional[str] = Field(
        default=None,
        description="Generated tsvector column (read-only).",
    )

