from typing import List
from app.models.Candidate import Candidate
from app.models.Position import Position
from app.models.Skill import Skill


class IngestionService:
    """Service for ingesting and processing candidates, positions, and skills"""

    def ingest_candidates(self, candidates: List[Candidate]) -> List[Candidate]:
        """Ingest candidate data and prepare for vectorization"""
        pass

    def ingest_positions(self, positions: List[Position]) -> List[Position]:
        """Ingest position data"""
        pass

    def ingest_skills(self, skills: List[Skill]) -> List[Skill]:
        """Ingest skill data"""
        pass

    def validate_candidate(self, candidate: Candidate) -> bool:
        """Validate candidate data"""
        pass

    def validate_position(self, position: Position) -> bool:
        """Validate position data"""
        pass


# Singleton instance
ingestion_service = IngestionService()
