from typing import List, Dict, Any
from app.models.Candidate import Candidate
from app.models.Skill import HardSkill, SoftSkill


class VectorizationService:
    """Service for creating embeddings from candidate and skill data"""

    def __init__(self):
        self.model = None  # Placeholder for embedding model

    def vectorize_candidate(self, candidate: Candidate) -> List[float]:
        """Generate embedding vector for a candidate based on skills and experience"""
        pass

    def vectorize_skill(self, skill: HardSkill | SoftSkill) -> List[float]:
        """Generate embedding vector for a skill"""
        pass

    def vectorize_skills_list(self, skills: List[HardSkill | SoftSkill]) -> List[List[float]]:
        """Generate embedding vectors for a list of skills"""
        pass

    def create_skill_profile_vector(self, hard_skills: List[HardSkill], soft_skills: List[SoftSkill]) -> List[float]:
        """Create combined vector from hard and soft skills"""
        pass

    def get_vector_dimension(self) -> int:
        """Return the dimension of vectors produced by this service"""
        pass


# Singleton instance
vectorization_service = VectorizationService()
