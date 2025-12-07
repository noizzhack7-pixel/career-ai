from typing import List, Dict, Any, Optional
import numpy as np
from app.models.Candidate import Candidate
from app.models.Position import Position
from app.models.Skill import HardSkill, SoftSkill
from app.services.ingestion import ingestion_service
from app.services.vectorization import vectorization_service


class SkillGapDetail:
    """Detailed information about a skill gap"""
    def __init__(self, skill_name: str, required_level: float, current_level: float):
        self.skill_name = skill_name
        self.required_level = required_level
        self.current_level = current_level
        self.gap = required_level - current_level
        self.status = self._determine_status()

    def _determine_status(self) -> str:
        if self.gap <= 0:
            if abs(self.gap) > 1.0:
                return "exceeded"  # Significantly exceeds requirement
            return "met"  # Meets requirement
        elif self.gap <= 0.5:
            return "minor_gap"  # Small gap
        elif self.gap <= 1.5:
            return "moderate_gap"  # Moderate gap
        else:
            return "critical_gap"  # Large gap

    def to_dict(self) -> Dict[str, Any]:
        return {
            "skill_name": self.skill_name,
            "required_level": self.required_level,
            "current_level": self.current_level,
            "gap": round(self.gap, 2),
            "status": self.status
        }


class MatchingService:
    """Service for AI-powered matching between candidates and positions using hybrid scoring"""

    def __init__(self):
        self.candidates_table = "candidates"
        self.positions_table = "positions"

    def calculate_hybrid_score(
        self,
        vector_similarity: float,
        skill_overlap: Dict[str, float],
        category_match: bool = False
    ) -> float:
        """
        Calculate final match score using hybrid approach

        Args:
            vector_similarity: Cosine similarity from pgvector (0-1)
            skill_overlap: Dict with 'overall_match' key (0-1)
            category_match: Boolean for category bonus

        Returns:
            Final score (0-1)
        """
        # Weights
        semantic_weight = 0.60  # Semantic understanding from embeddings
        skill_weight = 0.30     # Exact skill matching
        category_weight = 0.10  # Category bonus

        category_score = 1.0 if category_match else 0.5

        final_score = (
            vector_similarity * semantic_weight +
            skill_overlap.get("overall_match", 0) * skill_weight +
            category_score * category_weight
        )

        return min(1.0, max(0.0, final_score))  # Clamp to [0, 1]

    def get_top_candidates_for_position(
        self,
        position_id: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Find top matching candidates for a position

        Returns list of dicts with candidate info and match details
        """
        # 1. Get position (from ingestion service for MVP)
        position = ingestion_service.get_position(position_id)
        if not position:
            return []

        # 2. Vectorize position
        pos_vec = np.array(vectorization_service.vectorize_position(position))
        if pos_vec.size == 0:
            return []

        # 3. Prepare position skill requirements
        required_hard: List[HardSkill] = []
        required_soft: List[SoftSkill] = []
        for profile in position.profiles:
            required_hard.extend(profile.hard_skills)
            required_soft.extend(profile.soft_skills)

        results: List[Dict[str, Any]] = []
        for cand in ingestion_service.list_candidates():
            # 4. Vectorize candidate
            cand_vec = np.array(vectorization_service.vectorize_candidate(cand))
            if cand_vec.size == 0:
                continue

            # 5. Cosine similarity
            sim = self._cosine_similarity(pos_vec, cand_vec)

            # 6. Skill overlap
            overlap = vectorization_service.calculate_skill_overlap(
                cand.hard_skills,
                cand.soft_skills,
                required_hard,
                required_soft,
            )

            # 7. Category match heuristic
            category_match = False
            if cand.current_position and cand.current_position.category == position.category:
                category_match = True
            else:
                for past in cand.past_positions:
                    if past.category == position.category:
                        category_match = True
                        break

            score = self.calculate_hybrid_score(sim, overlap, category_match)

            # Build details: matching skills list where candidate level >= 80% of required
            candidate_hard_dict = {s.skill: s.level for s in cand.hard_skills}
            matched_skills = [
                s.skill for s in required_hard
                if s.skill in candidate_hard_dict and candidate_hard_dict[s.skill] >= s.level * 0.8
            ]

            results.append({
                "id": cand.candidate_id,
                "name": cand.name,
                "score": round(float(score), 4),
                "semantic_similarity": round(float(sim), 4),
                "skill_match": round(float(overlap.get("overall_match", 0.0)), 4),
                "details": {
                    "matching_skills": matched_skills,
                    "category_match": category_match,
                },
            })

        # Sort and limit
        results.sort(key=lambda r: r["score"], reverse=True)
        return results[:limit]

    def get_top_positions_for_candidate(
        self,
        candidate_id: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Find top matching positions for a candidate

        Returns list of dicts with position info and match details
        """
        candidate = ingestion_service.get_candidate(candidate_id)
        if not candidate:
            return []

        cand_vec = np.array(vectorization_service.vectorize_candidate(candidate))
        if cand_vec.size == 0:
            return []

        results: List[Dict[str, Any]] = []
        for pos in ingestion_service.list_positions():
            pos_vec = np.array(vectorization_service.vectorize_position(pos))
            if pos_vec.size == 0:
                continue

            sim = self._cosine_similarity(cand_vec, pos_vec)

            # Collect required skills
            req_hard: List[HardSkill] = []
            req_soft: List[SoftSkill] = []
            for profile in pos.profiles:
                req_hard.extend(profile.hard_skills)
                req_soft.extend(profile.soft_skills)

            overlap = vectorization_service.calculate_skill_overlap(
                candidate.hard_skills,
                candidate.soft_skills,
                req_hard,
                req_soft,
            )

            category_match = False
            if candidate.current_position and candidate.current_position.category == pos.category:
                category_match = True
            else:
                for past in candidate.past_positions:
                    if past.category == pos.category:
                        category_match = True
                        break

            score = self.calculate_hybrid_score(sim, overlap, category_match)

            matched_skills = [
                s.skill for s in req_hard
                if any(cs.skill == s.skill and cs.level >= s.level * 0.8 for cs in candidate.hard_skills)
            ]

            results.append({
                "id": str(pos.id),
                "name": pos.name,
                "score": round(float(score), 4),
                "semantic_similarity": round(float(sim), 4),
                "skill_match": round(float(overlap.get("overall_match", 0.0)), 4),
                "details": {
                    "matching_skills": matched_skills,
                    "category_match": category_match,
                    "matched_requirements": len(matched_skills),
                    "total_requirements": len(req_hard),
                },
            })

        results.sort(key=lambda r: r["score"], reverse=True)
        return results[:limit]

    def get_similar_candidates(
        self,
        candidate_id: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Find similar candidates based on skills and experience
        Uses only vector similarity
        """
        pivot = ingestion_service.get_candidate(candidate_id)
        if not pivot:
            return []
        pivot_vec = np.array(vectorization_service.vectorize_candidate(pivot))
        if pivot_vec.size == 0:
            return []

        results: List[Dict[str, Any]] = []
        for cand in ingestion_service.list_candidates():
            if cand.candidate_id == candidate_id:
                continue
            cand_vec = np.array(vectorization_service.vectorize_candidate(cand))
            if cand_vec.size == 0:
                continue
            sim = self._cosine_similarity(pivot_vec, cand_vec)
            # Common skills by name
            pivot_skills = set(s.skill for s in pivot.hard_skills)
            cand_skills = set(s.skill for s in cand.hard_skills)
            common = sorted(list(pivot_skills & cand_skills))
            results.append({
                "id": cand.candidate_id,
                "name": cand.name,
                "score": round(float(sim), 4),
                "semantic_similarity": round(float(sim), 4),
                "details": {
                    "explanation": "Similar skill profile and experience",
                    "common_skills": common[:10],
                },
            })

        results.sort(key=lambda r: r["score"], reverse=True)
        return results[:limit]

    def get_similar_positions(
        self,
        position_id: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Find similar positions based on requirements
        Uses only vector similarity
        """
        pivot = ingestion_service.get_position(position_id)
        if not pivot:
            return []
        pivot_vec = np.array(vectorization_service.vectorize_position(pivot))
        if pivot_vec.size == 0:
            return []

        results: List[Dict[str, Any]] = []
        for pos in ingestion_service.list_positions():
            if str(pos.id) == position_id:
                continue
            pos_vec = np.array(vectorization_service.vectorize_position(pos))
            if pos_vec.size == 0:
                continue
            sim = self._cosine_similarity(pivot_vec, pos_vec)
            # Common required skills (hard) by name
            pivot_skills = set(s.skill for pr in pivot.profiles for s in pr.hard_skills)
            pos_skills = set(s.skill for pr in pos.profiles for s in pr.hard_skills)
            common = sorted(list(pivot_skills & pos_skills))
            results.append({
                "id": str(pos.id),
                "name": pos.name,
                "score": round(float(sim), 4),
                "semantic_similarity": round(float(sim), 4),
                "details": {
                    "explanation": "Similar technical requirements and category",
                    "common_skills": common[:10],
                },
            })

        results.sort(key=lambda r: r["score"], reverse=True)
        return results[:limit]

    def analyze_skill_gaps(
        self,
        candidate: Candidate,
        position: Position
    ) -> Dict[str, Any]:
        """
        Comprehensive skill gap analysis between candidate and position

        Returns:
            - Overall readiness score (0-100)
            - Detailed gaps by skill
            - Recommendations
        """
        # Collect all required skills from position profiles
        required_hard_skills = []
        required_soft_skills = []

        for profile in position.profiles:
            required_hard_skills.extend(profile.hard_skills)
            required_soft_skills.extend(profile.soft_skills)

        # Build candidate skill dictionaries
        candidate_hard_dict = {skill.skill: skill.level for skill in candidate.hard_skills}
        candidate_soft_dict = {skill.skill: skill.level for skill in candidate.soft_skills}

        # Analyze hard skills gaps
        hard_skill_gaps = []
        for required_skill in required_hard_skills:
            current_level = candidate_hard_dict.get(required_skill.skill, 0.0)
            gap = SkillGapDetail(
                skill_name=required_skill.skill,
                required_level=required_skill.level,
                current_level=current_level
            )
            hard_skill_gaps.append(gap)

        # Analyze soft skills gaps
        soft_skill_gaps = []
        for required_skill in required_soft_skills:
            current_level = candidate_soft_dict.get(required_skill.skill, 0.0)
            gap = SkillGapDetail(
                skill_name=required_skill.skill,
                required_level=required_skill.level,
                current_level=current_level
            )
            soft_skill_gaps.append(gap)

        # Calculate statistics
        all_gaps = hard_skill_gaps + soft_skill_gaps

        critical_gaps = [g for g in all_gaps if g.status == "critical_gap"]
        moderate_gaps = [g for g in all_gaps if g.status == "moderate_gap"]
        minor_gaps = [g for g in all_gaps if g.status == "minor_gap"]
        met_skills = [g for g in all_gaps if g.status in ["met", "exceeded"]]

        # Calculate readiness score (0-100)
        if len(all_gaps) == 0:
            readiness_score = 100.0
        else:
            # Penalize based on gap severity
            penalty = (
                len(critical_gaps) * 25 +
                len(moderate_gaps) * 10 +
                len(minor_gaps) * 3
            )
            readiness_score = max(0, 100 - penalty)

        # Generate recommendations
        recommendations = []

        if critical_gaps:
            recommendations.append({
                "priority": "high",
                "message": f"Focus on developing {len(critical_gaps)} critical skill(s)",
                "skills": [g.skill_name for g in critical_gaps[:3]]  # Top 3
            })

        if moderate_gaps:
            recommendations.append({
                "priority": "medium",
                "message": f"Improve {len(moderate_gaps)} skill(s) to meet requirements",
                "skills": [g.skill_name for g in moderate_gaps[:3]]
            })

        if readiness_score >= 80:
            recommendations.append({
                "priority": "info",
                "message": "Strong match! Consider applying for this position.",
                "skills": []
            })

        return {
            "readiness_score": round(readiness_score, 2),
            "summary": {
                "total_skills_required": len(all_gaps),
                "skills_met": len(met_skills),
                "critical_gaps": len(critical_gaps),
                "moderate_gaps": len(moderate_gaps),
                "minor_gaps": len(minor_gaps)
            },
            "hard_skills_analysis": {
                "required": len(required_hard_skills),
                "gaps": [g.to_dict() for g in hard_skill_gaps]
            },
            "soft_skills_analysis": {
                "required": len(required_soft_skills),
                "gaps": [g.to_dict() for g in soft_skill_gaps]
            },
            "recommendations": recommendations
        }

    def _calculate_experience_match(
        self,
        candidate: Candidate,
        position: Position
    ) -> float:
        """
        Calculate how well candidate's experience matches position

        Returns score 0-1
        """
        candidate_positions = len(candidate.past_positions)
        if candidate.current_position:
            candidate_positions += 1

        # Simple heuristic: more positions = more experience
        # In real implementation, you'd look at years, titles, etc.
        if candidate_positions >= 3:
            return 1.0
        elif candidate_positions >= 2:
            return 0.8
        elif candidate_positions >= 1:
            return 0.6
        else:
            return 0.3

    def _cosine_similarity(self, a: np.ndarray, b: np.ndarray) -> float:
        if a.size == 0 or b.size == 0:
            return 0.0
        denom = (np.linalg.norm(a) * np.linalg.norm(b))
        if denom == 0:
            return 0.0
        return float(np.dot(a, b) / denom)


# Singleton instance
matching_service = MatchingService()
