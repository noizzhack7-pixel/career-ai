import json
from typing import Dict, List
from pathlib import Path
from datetime import datetime
from backend.app.models.Assessment import AssessmentQuestion, CategoryScore, AssessmentResult
from backend.app.services.ai_service import ai_service


class AssessmentService:
    """Service for handling assessment questions, submissions, and results"""
    
    def __init__(self):
        # Get the base directory (back folder)
        self.base_dir = Path(__file__).parent.parent.parent
        self.questions_file = self.base_dir / "data" / "assessment_questions.json"
        self.results_file = self.base_dir / "data" / "assessment_results.json"
        self._ensure_results_file()
    
    def _ensure_results_file(self):
        """Ensure the results file exists"""
        if not self.results_file.exists():
            with open(self.results_file, 'w', encoding='utf-8') as f:
                json.dump({}, f)
    
    def load_questions(self) -> List[AssessmentQuestion]:
        """Load assessment questions from JSON file"""
        if not self.questions_file.exists():
            raise FileNotFoundError(f"Questions file not found: {self.questions_file}")
        
        with open(self.questions_file, 'r', encoding='utf-8') as f:
            questions_data = json.load(f)
        
        return [AssessmentQuestion(**q) for q in questions_data]
    
    def calculate_category_scores(self, answers: Dict[int, int], questions: List[AssessmentQuestion]) -> List[CategoryScore]:
        """Calculate average score for each skill category"""
        # Group answers by category
        category_scores: Dict[str, List[int]] = {}
        
        for question in questions:
            if question.id in answers:
                score = answers[question.id]
                if question.category not in category_scores:
                    category_scores[question.category] = []
                category_scores[question.category].append(score)
        
        # Calculate averages
        result = []
        for category, scores in category_scores.items():
            avg_score = sum(scores) / len(scores) if scores else 0.0
            result.append(CategoryScore(
                category=category,
                score=round(avg_score, 2),
                question_count=len(scores)
            ))
        
        # Sort by score descending
        result.sort(key=lambda x: x.score, reverse=True)
        return result
    
    def save_results(self, user_id: str, answers: Dict[int, int], is_test: bool = False) -> AssessmentResult:
        """Save assessment results for a user with AI analysis"""
        questions = self.load_questions()
        
        # For test mode, only use questions that were answered
        if is_test:
            answered_ids = set(answers.keys())
            questions = [q for q in questions if q.id in answered_ids]
        
        category_scores = self.calculate_category_scores(answers, questions)
        
        # Prepare scores dict for AI service
        scores_dict = {cs.category: cs.score for cs in category_scores}
        
        # Get AI analysis
        ai_analysis = ai_service.generate_profile_analysis(scores_dict)
        
        # Get top 3 categories by score
        top_strengths = [cs.category for cs in category_scores[:3]]
        
        result = AssessmentResult(
            user_id=user_id,
            submitted_at=datetime.now(),
            category_scores=category_scores,
            ai_summary=ai_analysis["summary"],
            top_strengths=ai_analysis["strengths"],
            growth_recommendation=ai_analysis["recommendation"]
        )
        
        # Load existing results
        if self.results_file.exists():
            with open(self.results_file, 'r', encoding='utf-8') as f:
                all_results = json.load(f)
        else:
            all_results = {}
        
        # Convert result to dict for JSON serialization
        result_dict = {
            "user_id": result.user_id,
            "submitted_at": result.submitted_at.isoformat(),
            "category_scores": [
                {
                    "category": cs.category,
                    "score": cs.score,
                    "question_count": cs.question_count
                }
                for cs in result.category_scores
            ],
            "ai_summary": result.ai_summary,
            "top_strengths": result.top_strengths,
            "growth_recommendation": result.growth_recommendation
        }
        
        # Save results (overwrite previous result for this user)
        all_results[user_id] = result_dict
        
        with open(self.results_file, 'w', encoding='utf-8') as f:
            json.dump(all_results, f, indent=2, ensure_ascii=False)
        
        return result
    
    def get_user_results(self, user_id: str) -> AssessmentResult:
        """Get assessment results for a specific user"""
        if not self.results_file.exists():
            raise FileNotFoundError("No assessment results found")
        
        with open(self.results_file, 'r', encoding='utf-8') as f:
            all_results = json.load(f)
        
        if user_id not in all_results:
            raise ValueError(f"No results found for user: {user_id}")
        
        result_data = all_results[user_id]
        
        # Reconstruct the AssessmentResult object
        category_scores = [
            CategoryScore(**cs) for cs in result_data["category_scores"]
        ]
        
        return AssessmentResult(
            user_id=result_data["user_id"],
            submitted_at=datetime.fromisoformat(result_data["submitted_at"]),
            category_scores=category_scores,
            ai_summary=result_data.get("ai_summary", ""),
            top_strengths=result_data.get("top_strengths", []),
            growth_recommendation=result_data.get("growth_recommendation", "")
        )


# Singleton instance
assessment_service = AssessmentService()

