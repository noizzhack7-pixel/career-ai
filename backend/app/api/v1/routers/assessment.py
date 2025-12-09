from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from backend.app.models.Assessment import AssessmentQuestion, AssessmentSubmission, AssessmentResult
from backend.app.services.assessment import assessment_service




router = APIRouter(prefix="/assessment", tags=["assessment"])


@router.get("/questions", response_model=list[AssessmentQuestion])
async def get_assessment_questions():
    """
    Returns the list of 40 assessment questions.
    Each question is mapped to a specific Skill Category.
    """
    try:
        questions = assessment_service.load_questions()
        return questions
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/questions/test", response_model=list[AssessmentQuestion])
async def get_test_questions():
    """
    Returns a subset of 5 questions for testing purposes.
    One question from each category (or first 5 if fewer categories).
    """
    try:
        questions = assessment_service.load_questions()
        
        # Get one question from each category
        categories_seen = set()
        test_questions = []
        
        for q in questions:
            if q.category not in categories_seen and len(test_questions) < 5:
                test_questions.append(q)
                categories_seen.add(q.category)
        
        # If we don't have 5 yet, add more from beginning
        if len(test_questions) < 5:
            for q in questions:
                if q not in test_questions and len(test_questions) < 5:
                    test_questions.append(q)
        
        return test_questions
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/submit", response_model=AssessmentResult, status_code=201)
async def submit_assessment(
    submission: AssessmentSubmission,
    x_user_id: Optional[str] = Header(None, alias="X-User-ID")
):
    """
    Accepts the user's assessment answers and calculates category scores with AI analysis.
    
    - **answers**: Map of QuestionID (1-40) to Score (1-5)
    - **X-User-ID**: Header containing the user identifier
    
    Returns the calculated scores for each skill category, AI summary, top strengths, and growth recommendation.
    """
    if not x_user_id:
        raise HTTPException(
            status_code=400,
            detail="X-User-ID header is required"
        )
    
    # Validate that all question IDs are in range
    questions = assessment_service.load_questions()
    question_ids = {q.id for q in questions}
    
    invalid_ids = [qid for qid in submission.answers.keys() if qid not in question_ids]
    if invalid_ids:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid question IDs: {invalid_ids}. Valid IDs are 1-40."
        )
    
    # Validate scores are in range (1-5)
    invalid_scores = [
        qid for qid, score in submission.answers.items()
        if not (1 <= score <= 5)
    ]
    if invalid_scores:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid scores for question IDs: {invalid_scores}. Scores must be between 1 and 5."
        )
    
    try:
        result = assessment_service.save_results(x_user_id, submission.answers)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing assessment: {str(e)}")


@router.post("/submit/test", response_model=AssessmentResult, status_code=201)
async def submit_test_assessment(
    submission: AssessmentSubmission,
    x_user_id: Optional[str] = Header(None, alias="X-User-ID")
):
    """
    Test endpoint - accepts any number of answers (for testing with 5 questions).
    
    - **answers**: Map of QuestionID to Score (1-5)
    - **X-User-ID**: Header containing the user identifier
    """
    if not x_user_id:
        raise HTTPException(
            status_code=400,
            detail="X-User-ID header is required"
        )
    
    # Validate scores are in range (1-5)
    invalid_scores = [
        qid for qid, score in submission.answers.items()
        if not (1 <= score <= 5)
    ]
    if invalid_scores:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid scores for question IDs: {invalid_scores}. Scores must be between 1 and 5."
        )
    
    try:
        result = assessment_service.save_results(x_user_id, submission.answers, is_test=True)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing assessment: {str(e)}")


@router.get("/results", response_model=AssessmentResult)
async def get_assessment_results(
    x_user_id: Optional[str] = Header(None, alias="X-User-ID")
):
    """
    Returns the calculated category scores and AI analysis for the current user.
    
    Requires the X-User-ID header to identify the user.
    """
    if not x_user_id:
        raise HTTPException(
            status_code=400,
            detail="X-User-ID header is required"
        )
    
    try:
        result = assessment_service.get_user_results(x_user_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail="No assessment results found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving results: {str(e)}")

