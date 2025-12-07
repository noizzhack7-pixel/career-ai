from typing import List, Dict, Optional
from app.models.Candidate import Candidate
from app.models.Position import Position
from app.models.Skill import Skill


class IngestionService:
    """Service for ingesting and accessing in-memory data (MVP without DB)."""

    def __init__(self):
        # In-memory stores; swap to DB later
        self._candidates: Dict[str, Candidate] = {}
        self._positions: Dict[str, Position] = {}

    # ---- Candidates ----
    def ingest_candidates(self, candidates: List[Candidate]) -> List[Candidate]:
        for c in candidates:
            self._candidates[c.candidate_id] = c
        return candidates

    def ingest_candidate(self, candidate: Candidate) -> Candidate:
        self._candidates[candidate.candidate_id] = candidate
        return candidate

    def get_candidate(self, candidate_id: str) -> Optional[Candidate]:
        return self._candidates.get(candidate_id)

    def list_candidates(self) -> List[Candidate]:
        return list(self._candidates.values())

    def delete_candidate(self, candidate_id: str) -> None:
        self._candidates.pop(candidate_id, None)

    def clear_candidates(self) -> None:
        self._candidates.clear()

    # ---- Positions ----
    def ingest_positions(self, positions: List[Position]) -> List[Position]:
        for p in positions:
            self._positions[str(p.id)] = p
        return positions

    def ingest_position(self, position: Position) -> Position:
        self._positions[str(position.id)] = position
        return position

    def get_position(self, position_id: str) -> Optional[Position]:
        return self._positions.get(position_id)

    def list_positions(self) -> List[Position]:
        return list(self._positions.values())

    def delete_position(self, position_id: str) -> None:
        self._positions.pop(position_id, None)

    def clear_positions(self) -> None:
        self._positions.clear()

    # ---- Skills (placeholder for parity) ----
    def ingest_skills(self, skills: List[Skill]) -> List[Skill]:
        # No global skills store needed for MVP
        return skills

    # ---- Validation (basic) ----
    def validate_candidate(self, candidate: Candidate) -> bool:
        return bool(candidate.name and candidate.hard_skills and candidate.soft_skills)

    def validate_position(self, position: Position) -> bool:
        return bool(position.name and position.category is not None)


# Singleton instance
ingestion_service = IngestionService()
