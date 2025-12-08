import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '../services';
import {
  AssessmentQuestion,
  AssessmentResult,
} from './models';

@Injectable({ providedIn: 'root' })
export class AssessmentStore {
  private api = inject(ApiService);

  // State signals
  private _questions = signal<AssessmentQuestion[]>([]);
  private _answers = signal<Map<number, number>>(new Map());
  private _results = signal<AssessmentResult | null>(null);
  private _currentPage = signal<number>(0);
  private _questionsPerPage = signal<number>(5);
  private _isSubmitted = signal<boolean>(false);
  private _isTestMode = signal<boolean>(false);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly questions = this._questions.asReadonly();
  readonly answers = this._answers.asReadonly();
  readonly results = this._results.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly questionsPerPage = this._questionsPerPage.asReadonly();
  readonly isSubmitted = this._isSubmitted.asReadonly();
  readonly isTestMode = this._isTestMode.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals
  readonly totalPages = computed(() =>
    Math.ceil(this._questions().length / this._questionsPerPage())
  );

  readonly currentQuestions = computed(() => {
    const questions = this._questions();
    const page = this._currentPage();
    const perPage = this._questionsPerPage();
    const start = page * perPage;
    const end = start + perPage;
    return questions.slice(start, end);
  });

  readonly answeredCount = computed(() => this._answers().size);

  readonly isCurrentPageComplete = computed(() => {
    const questions = this._questions();
    const page = this._currentPage();
    const perPage = this._questionsPerPage();
    const currentQuestions = questions.slice(page * perPage, (page + 1) * perPage);
    const answers = this._answers();
    return currentQuestions.every(q => answers.has(q.id));
  });

  readonly isAllAnswered = computed(() => {
    const questions = this._questions();
    const answers = this._answers();
    return questions.length > 0 && questions.every(q => answers.has(q.id));
  });

  readonly isLastPage = computed(() => {
    const totalPages = Math.ceil(this._questions().length / this._questionsPerPage());
    return this._currentPage() === totalPages - 1;
  });

  readonly isFirstPage = computed(() => this._currentPage() === 0);

  readonly progressPercentage = computed(() => {
    const questions = this._questions();
    if (questions.length === 0) return 0;
    return (this._answers().size / questions.length) * 100;
  });

  readonly categoryScores = computed(() => this._results()?.category_scores ?? []);
  readonly aiSummary = computed(() => this._results()?.ai_summary ?? '');
  readonly topStrengths = computed(() => this._results()?.top_strengths ?? []);
  readonly growthRecommendation = computed(() => this._results()?.growth_recommendation ?? '');

  // Load questions
  loadQuestions(testMode: boolean): void {
    this._isLoading.set(true);
    this._error.set(null);
    this._isTestMode.set(testMode);

    const endpoint = testMode
      ? ApiService.ENDPOINTS.ASSESSMENT.QUESTIONS_TEST
      : ApiService.ENDPOINTS.ASSESSMENT.QUESTIONS;

    this.api.get<AssessmentQuestion[]>(endpoint).subscribe({
      next: (questions) => {
        this._questions.set(questions);
        this._isLoading.set(false);
      },
      error: (error) => {
        this._error.set('נכשל בטעינת השאלות. אנא ודא ששרת ה-backend פועל.');
        this._isLoading.set(false);
        console.error('Error loading questions:', error);
      },
    });
  }

  // Set answer for a question
  setAnswer(questionId: number, score: number): void {
    const currentAnswers = this._answers();
    const newAnswers = new Map(currentAnswers);
    newAnswers.set(questionId, score);
    this._answers.set(newAnswers);
  }

  // Get answer for a question
  getAnswer(questionId: number): number | undefined {
    return this._answers().get(questionId);
  }

  // Go to next page
  nextPage(): boolean {
    const questions = this._questions();
    const page = this._currentPage();
    const perPage = this._questionsPerPage();
    const currentQuestions = questions.slice(page * perPage, (page + 1) * perPage);
    const answers = this._answers();
    const isPageComplete = currentQuestions.every(q => answers.has(q.id));

    if (!isPageComplete) {
      this._error.set('אנא ענה על כל השאלות בעמוד זה לפני המעבר לעמוד הבא.');
      return false;
    }

    const totalPages = Math.ceil(questions.length / perPage);
    if (page < totalPages - 1) {
      this._currentPage.set(page + 1);
      this._error.set(null);
      return true;
    }
    return false;
  }

  // Go to previous page
  previousPage(): boolean {
    const page = this._currentPage();
    if (page > 0) {
      this._currentPage.set(page - 1);
      return true;
    }
    return false;
  }

  // Submit assessment
  submitAssessment(userId: string): void {
    const questions = this._questions();
    const answers = this._answers();
    const isAllAnswered = questions.every(q => answers.has(q.id));

    if (!isAllAnswered) {
      this._error.set('אנא ענה על כל השאלות לפני השליחה.');
      return;
    }

    this._isLoading.set(true);
    this._error.set(null);

    // Convert Map to object for JSON
    const answersObj: { [key: number]: number } = {};
    answers.forEach((value, key) => {
      answersObj[key] = value;
    });

    const headers = new HttpHeaders({
      'X-User-ID': userId,
      'Content-Type': 'application/json',
    });

    const endpoint = this._isTestMode()
      ? ApiService.ENDPOINTS.ASSESSMENT.SUBMIT_TEST
      : ApiService.ENDPOINTS.ASSESSMENT.SUBMIT;

    this.api.post<AssessmentResult>(endpoint, { answers: answersObj }, { headers }).subscribe({
      next: (results) => {
        this._results.set(results);
        this._isSubmitted.set(true);
        this._isLoading.set(false);
      },
      error: (error: any) => {
        this._error.set(error?.error?.detail || 'נכשל בשליחת ההערכה. אנא נסה שוב.');
        this._isLoading.set(false);
        console.error('Error submitting assessment:', error);
      },
    });
  }

  // Clear error
  clearError(): void {
    this._error.set(null);
  }

  // Reset assessment
  reset(): void {
    this._answers.set(new Map());
    this._currentPage.set(0);
    this._isSubmitted.set(false);
    this._results.set(null);
    this._error.set(null);
  }

  // Full reset (including questions)
  fullReset(): void {
    this._questions.set([]);
    this._answers.set(new Map());
    this._results.set(null);
    this._currentPage.set(0);
    this._questionsPerPage.set(5);
    this._isSubmitted.set(false);
    this._isTestMode.set(false);
    this._isLoading.set(false);
    this._error.set(null);
  }
}
