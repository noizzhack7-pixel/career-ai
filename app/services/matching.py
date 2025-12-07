from typing import List, Dict, Any
from app.models.Candidate import Candidate
from app.models.Position import Position


class MatchingService:
    """Service for AI-powered matching between candidates and positions"""

    def get_top_candidates_for_position(self, position: Position, limit: int = 10) -> List[Candidate]:
        """Find top matching candidates for a position"""
        pass

    def get_similar_candidates(self, candidate: Candidate, limit: int = 10) -> List[Candidate]:
        """Find similar candidates to a given candidate"""
        pass

    def get_top_positions_for_candidate(self, candidate: Candidate, limit: int = 10) -> List[Position]:
        """Find top matching positions for a candidate"""
        pass

    def get_similar_positions(self, position: Position, limit: int = 10) -> List[Position]:
        """Find similar positions to a given position"""
        pass

    def get_skill_gaps(self, candidate: Candidate, position: Position) -> Dict[str, Any]:
        """Analyze skill gaps between a candidate and a position"""
        pass


# Singleton instance
matching_service = MatchingService()
