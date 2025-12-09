from typing import List, Dict, Any, Optional
import numpy as np

# Optional import for sentence_transformers (heavy ML dependency)
try:
    from sentence_transformers import SentenceTransformer
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    SentenceTransformer = None
    SENTENCE_TRANSFORMERS_AVAILABLE = False
    print("Warning: sentence_transformers not installed. ML features will be disabled.")
    print("Install with: pip install sentence-transformers")

from app.models.Employee import Employee
from app.models.Position import Position
from app.models.Skill import HardSkill, SoftSkill
from app.core.config import settings


class VectorizationService:
    """Hybrid vectorization service using Sentence Transformers + structured features"""

    def __init__(self):
        self._model = None

    @property
    def model(self) -> Optional[Any]:
        """Lazy load the embedding model"""
        if not SENTENCE_TRANSFORMERS_AVAILABLE:
            return None
        if self._model is None:
            self._model = SentenceTransformer('all-MiniLM-L6-v2')
        return self._model
    
    def is_available(self) -> bool:
        """Check if vectorization is available"""
        return SENTENCE_TRANSFORMERS_AVAILABLE

    def _level_to_text(self, level: float) -> str:
        """Convert numeric skill level to descriptive text"""
        if level >= 4.5:
            return "Expert level"
        elif level >= 4.0:
            return "Advanced level"
        elif level >= 3.0:
            return "Intermediate level"
        elif level >= 2.0:
            return "Basic level"
        else:
            return "Beginner level"

    def _format_employee_text(self, employee: Employee) -> str:
        """Convert employee to rich text description for semantic embedding"""

        # Calculate experience
        total_positions = len(employee.past_positions)
        if employee.current_position:
            total_positions += 1

        # Format hard skills
        hard_skills_text = "\n".join([
            f"- {skill.skill}: {self._level_to_text(skill.level)} ({skill.level}/5.0)"
            for skill in employee.hard_skills
        ])

        # Format soft skills
        soft_skills_text = "\n".join([
            f"- {skill.skill}: {self._level_to_text(skill.level)} ({skill.level}/5.0)"
            for skill in employee.soft_skills
        ])

        # Build experience section
        experience_text = ""
        if employee.current_position:
            experience_text += f"- Current: {employee.current_position.name} in {employee.current_position.category}\n"

        if employee.past_positions:
            past_names = [p.name for p in employee.past_positions[:3]]
            experience_text += f"- Previous roles: {', '.join(past_names)}\n"

        # Combine everything
        text = f"""
{employee.name} is a professional with {total_positions} position(s) in their career.

Technical Skills (Hard Skills):
{hard_skills_text}

Professional Skills (Soft Skills):
{soft_skills_text}

Work Experience:
{experience_text}

This employee has demonstrated expertise in {len(employee.hard_skills)} technical areas and {len(employee.soft_skills)} professional competencies.
"""
        return text.strip()

    def _format_position_text(self, position: Position) -> str:
        """Convert position to rich text description for semantic embedding"""

        # Collect all skills from all profiles
        all_hard_skills = []
        all_soft_skills = []

        for profile in position.profiles:
            all_hard_skills.extend(profile.hard_skills)
            all_soft_skills.extend(profile.soft_skills)

        # Format skills
        hard_skills_text = "\n".join([
            f"- {skill.skill}: {self._level_to_text(skill.level)} required ({skill.level}/5.0)"
            for skill in all_hard_skills
        ]) if all_hard_skills else "- No specific hard skills required"

        soft_skills_text = "\n".join([
            f"- {skill.skill}: {self._level_to_text(skill.level)} required ({skill.level}/5.0)"
            for skill in all_soft_skills
        ]) if all_soft_skills else "- No specific soft skills required"

        # Profile names
        profile_names = [p.name for p in position.profiles if p.name]
        profiles_text = f"Profiles: {', '.join(profile_names)}" if profile_names else ""

        text = f"""
Position: {position.name} in the {position.category} category.
{profiles_text}

Required Technical Skills (Hard Skills):
{hard_skills_text}

Required Professional Skills (Soft Skills):
{soft_skills_text}

This position requires {len(all_hard_skills)} technical skills and {len(all_soft_skills)} professional skills.
"""
        return text.strip()

    def _create_structured_features(self, hard_skills: List[HardSkill], soft_skills: List[SoftSkill]) -> np.ndarray:
        """Create structured numeric features from skills (Option 1 component)"""

        # Create a simple feature vector based on skill counts and average levels
        features = []

        # Hard skills stats
        if hard_skills:
            features.extend([
                len(hard_skills),  # Count
                np.mean([s.level for s in hard_skills]),  # Average level
                np.max([s.level for s in hard_skills]),   # Max level
                np.min([s.level for s in hard_skills]),   # Min level
            ])
        else:
            features.extend([0.0, 0.0, 0.0, 0.0])

        # Soft skills stats
        if soft_skills:
            features.extend([
                len(soft_skills),  # Count
                np.mean([s.level for s in soft_skills]),  # Average level
                np.max([s.level for s in soft_skills]),   # Max level
                np.min([s.level for s in soft_skills]),   # Min level
            ])
        else:
            features.extend([0.0, 0.0, 0.0, 0.0])

        return np.array(features)

    def vectorize_employee(self, employee: Employee) -> List[float]:
        """
        Generate hybrid embedding vector for a employee
        Combines semantic (70%) + structured (30%) features
        """
        if not self.is_available():
            # Return empty vector if ML features not available
            return []

        # 1. Semantic embedding (384 dims)
        text = self._format_employee_text(employee)
        semantic_embedding = self.model.encode(text, convert_to_numpy=True)

        # 2. Structured features (8 dims)
        structured_features = self._create_structured_features(
            employee.hard_skills,
            employee.soft_skills
        )

        # 3. Normalize structured features to same scale as semantic
        if np.any(structured_features):
            structured_features = structured_features / np.linalg.norm(structured_features)

        # 4. Combine with weights (semantic 70%, structured 30%)
        # For simplicity, we'll just use semantic embedding
        # In production, you'd concatenate and adjust dimensions

        return semantic_embedding.tolist()

    def vectorize_position(self, position: Position) -> List[float]:
        """
        Generate hybrid embedding vector for a position
        Combines semantic (70%) + structured (30%) features
        """
        if not self.is_available():
            # Return empty vector if ML features not available
            return []

        # 1. Semantic embedding
        text = self._format_position_text(position)
        semantic_embedding = self.model.encode(text, convert_to_numpy=True)

        # 2. Structured features
        all_hard_skills = []
        all_soft_skills = []
        for profile in position.profiles:
            all_hard_skills.extend(profile.hard_skills)
            all_soft_skills.extend(profile.soft_skills)

        structured_features = self._create_structured_features(
            all_hard_skills,
            all_soft_skills
        )

        # 3. Combine (using semantic only for MVP)
        return semantic_embedding.tolist()

    def calculate_skill_overlap(
        self,
        employee_hard: List[HardSkill],
        employee_soft: List[SoftSkill],
        position_hard: List[HardSkill],
        position_soft: List[SoftSkill]
    ) -> Dict[str, float]:
        """
        Calculate exact skill overlap for hybrid scoring
        Returns percentage of required skills that employee has at sufficient level
        """

        if not position_hard and not position_soft:
            return {"hard_match": 1.0, "soft_match": 1.0, "overall_match": 1.0}

        # Build employee skill dictionaries
        employee_hard_dict = {skill.skill: skill.level for skill in employee_hard}
        employee_soft_dict = {skill.skill: skill.level for skill in employee_soft}

        # Check hard skills
        hard_matches = 0
        hard_total = len(position_hard)

        for required_skill in position_hard:
            if required_skill.skill in employee_hard_dict:
                employee_level = employee_hard_dict[required_skill.skill]
                # Consider it a match if employee is at least 80% of required level
                if employee_level >= required_skill.level * 0.8:
                    hard_matches += 1

        # Check soft skills
        soft_matches = 0
        soft_total = len(position_soft)

        for required_skill in position_soft:
            if required_skill.skill in employee_soft_dict:
                employee_level = employee_soft_dict[required_skill.skill]
                if employee_level >= required_skill.level * 0.8:
                    soft_matches += 1

        hard_match = hard_matches / hard_total if hard_total > 0 else 1.0
        soft_match = soft_matches / soft_total if soft_total > 0 else 1.0

        # Weighted average (hard skills 70%, soft skills 30%)
        overall_match = (hard_match * 0.7) + (soft_match * 0.3)

        return {
            "hard_match": hard_match,
            "soft_match": soft_match,
            "overall_match": overall_match
        }

    def get_vector_dimension(self) -> int:
        """Return the dimension of vectors produced by this service"""
        return settings.VECTOR_DIMENSIONS


# Singleton instance
vectorization_service = VectorizationService()
