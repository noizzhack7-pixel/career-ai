// Assessment-related interfaces

export interface AssessmentQuestion {
  id: number;
  text: string;
  category: string;
}

export interface CategoryScore {
  category: string;
  score: number;
  question_count: number;
}

export interface AssessmentResult {
  user_id: string;
  submitted_at: string;
  category_scores: CategoryScore[];
  ai_summary: string;
  top_strengths: string[];
  growth_recommendation: string;
}

export interface AssessmentState {
  questions: AssessmentQuestion[];
  answers: Map<number, number>;
  results: AssessmentResult | null;
  currentPage: number;
  questionsPerPage: number;
  isSubmitted: boolean;
  isTestMode: boolean;
  isLoading: boolean;
  error: string | null;
}


