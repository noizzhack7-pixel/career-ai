import json
import os
from typing import Dict
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from project root (parent of back folder)
project_root = Path(__file__).parent.parent.parent.parent
env_path = project_root / ".env"
if env_path.exists():
    load_dotenv(env_path)
    # print(f"Loaded .env from: {env_path}")
else:
    # Try current directory
    load_dotenv()
    print("Loaded .env from current directory")


class AIService:
    """Service for generating AI-powered profile analysis using OpenAI"""

    def __init__(self):
        # Try to get API key from environment
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.use_mock = not self.api_key
        
        if self.api_key:
            print(f"OpenAI API key loaded successfully (length: {len(self.api_key)})")
        else:
            print("No OpenAI API key found - using mock responses")

    def generate_profile_analysis(self, scores: Dict[str, float]) -> Dict[str, any]:
        """
        Generate AI-powered profile analysis based on category scores.
        
        Args:
            scores: Dictionary mapping category names to average scores (1-5)
        
        Returns:
            Dictionary with 'summary', 'strengths', and 'recommendation' in Hebrew
        """
        if self.use_mock:
            return self._get_mock_response(scores)
        
        try:
            return self._call_openai(scores)
        except Exception as e:
            print(f"Error calling OpenAI API: {e}")
            # Fallback to mock if API call fails
            return self._get_mock_response(scores)

    def _call_openai(self, scores: Dict[str, float]) -> Dict[str, any]:
        """Call OpenAI API to generate profile analysis using gpt-4o-mini"""
        try:
            from openai import OpenAI
            
            print("Calling OpenAI API with gpt-4o-mini model...")
            client = OpenAI(api_key=self.api_key)
            
            # Format scores for the prompt
            scores_text = "\n".join([f"- {category}: {score:.2f}/5.0" for category, score in scores.items()])
            
            prompt = f"""אתה יועץ קריירה מקצועי. נתח את הפרופיל הבא של עובד על סמך הציונים הבאים:

{scores_text}

השב ב-JSON תקין בלבד עם המבנה הבא:
{{
  "summary": "פסקה קצרה (4-5 משפטים) המתארת את הפרופיל המקצועי של העובד בעברית",
  "strengths": ["חוזקה ראשונה", "חוזקה שנייה", "חוזקה שלישית"],
  "recommendation": "פסקה קצרה (4-5 משפטים) מעשית לצמיחה מקצועית בעברית"
}}

חשוב:
- כל הטקסט חייב להיות בעברית
- ה-summary צריך להיות מקצועי ומדויק
- ה-strengths צריכים להיות 3 נקודות מפתח
- ה-recommendation צריכה להיות מעשית וספציפית
- החזר רק JSON, ללא טקסט נוסף"""

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "אתה יועץ קריירה מקצועי. תמיד החזר תשובות ב-JSON תקין בלבד."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            result_text = response.choices[0].message.content
            print(f"OpenAI response received successfully")
            result = json.loads(result_text)
            print(result_text)
            
            # Validate structure
            if not all(key in result for key in ["summary", "strengths", "recommendation"]):
                raise ValueError("Invalid response structure from OpenAI")
            
            return result
            
        except ImportError as e:
            print(f"OpenAI package not installed: {e}. Using mock response.")
            # return self._get_mock_response(scores)
        except Exception as e:
            print(f"Error in OpenAI API call: {e}")
            raise e  # Re-raise to see the actual error

    def _get_mock_response(self, scores: Dict[str, float]) -> Dict[str, any]:
        """Generate mock AI response for testing without API key"""
        # Find top 3 categories
        sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        top_categories = [cat for cat, _ in sorted_scores[:3]]
        
        # Generate mock summary based on scores
        avg_score = sum(scores.values()) / len(scores) if scores else 0
        
        if avg_score >= 4.0:
            summary = "הפרופיל המקצועי שלך מציג יכולות גבוהות ומגוונות. אתה בעל פוטנציאל מקצועי גבוה עם יכולות מנהיגות, עבודת צוות וחשיבה אנליטית חזקות."
        elif avg_score >= 3.0:
            summary = "הפרופיל המקצועי שלך מציג בסיס איתן עם פוטנציאל לצמיחה. יש לך יכולות טובות במספר תחומים עם אפשרות לפתח ולחזק תחומים נוספים."
        else:
            summary = "הפרופיל המקצועי שלך מציג הזדמנות לצמיחה משמעותית. עם התמקדות והתפתחות, תוכל לחזק את הכישורים הקיימים ולפתח חדשים."
        
        strengths = [
            f"{top_categories[0]} - ציון גבוה של {scores.get(top_categories[0], 0):.1f}/5",
            f"{top_categories[1]} - ציון טוב של {scores.get(top_categories[1], 0):.1f}/5",
            f"{top_categories[2]} - ציון חיובי של {scores.get(top_categories[2], 0):.1f}/5"
        ] if len(top_categories) >= 3 else ["חוזקה 1", "חוזקה 2", "חוזקה 3"]
        
        recommendation = "מומלץ להמשיך לפתח את הכישורים הקיימים ולהתמקד בתחומים בהם יש פוטנציאל לצמיחה. שקול להשתתף בקורסים מקצועיים או לחפש הזדמנויות למידה נוספות."
        
        return {
            "summary": summary,
            "strengths": strengths,
            "recommendation": recommendation
        }


# Singleton instance
ai_service = AIService()

