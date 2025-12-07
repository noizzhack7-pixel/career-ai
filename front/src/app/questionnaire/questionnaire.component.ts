import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

interface AssessmentQuestion {
  id: number;
  text: string;
  category: string;
}

interface CategoryScore {
  category: string;
  score: number;
  question_count: number;
}

interface AssessmentResult {
  user_id: string;
  submitted_at: string;
  category_scores: CategoryScore[];
  ai_summary: string;
  top_strengths: string[];
  growth_recommendation: string;
}

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, RouterLink],
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  // Test mode signal
  isTestMode = signal<boolean>(false);

  // State signals
  questions = signal<AssessmentQuestion[]>([]);
  answers = signal<Map<number, number>>(new Map());
  currentPage = signal<number>(0);
  questionsPerPage = signal<number>(5);
  isLoading = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);
  results = signal<AssessmentResult | null>(null);
  error = signal<string | null>(null);
  
  // User ID - in production, this would come from authentication
  userId = signal<string>('user-' + Date.now());

  // Computed signals
  totalPages = computed(() => Math.ceil(this.questions().length / this.questionsPerPage()));
  
  currentQuestions = computed(() => {
    const start = this.currentPage() * this.questionsPerPage();
    const end = start + this.questionsPerPage();
    return this.questions().slice(start, end);
  });

  answeredCount = computed(() => this.answers().size);

  // Check if all questions on current page are answered
  isCurrentPageComplete = computed(() => {
    return this.currentQuestions().every(q => this.answers().has(q.id));
  });

  // Check if we're on the last page
  isLastPage = computed(() => this.currentPage() === this.totalPages() - 1);

  // Check if we're on the first page
  isFirstPage = computed(() => this.currentPage() === 0);

  // Radar Chart Configuration
  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        min: 0,
        ticks: {
          stepSize: 1,
          font: {
            size: 12
          }
        },
        pointLabels: {
          font: {
            size: 13,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.r.toFixed(2)}/5.0`;
          }
        }
      }
    }
  };

  radarChartLabels = signal<string[]>([]);
  radarChartData = signal<ChartData<'radar'>>({
    labels: [],
    datasets: [{
      label: 'Skills Score',
      data: [],
      backgroundColor: 'rgba(84, 19, 136, 0.2)',
      borderColor: 'rgba(84, 19, 136, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(84, 19, 136, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(84, 19, 136, 1)'
    }]
  });
  public radarChartType: ChartType = 'radar';

  ngOnInit(): void {
    // Check if test mode from route data
    this.route.data.subscribe(data => {
      this.isTestMode.set(data['testMode'] === true);
      this.loadQuestions();
    });
  }

  loadQuestions(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    // Use test endpoint if in test mode
    const endpoint = this.isTestMode()
      ? 'http://localhost:8001/api/v1/assessment/questions/test'
      : 'http://localhost:8001/api/v1/assessment/questions';
    
    this.http.get<AssessmentQuestion[]>(endpoint)
      .subscribe({
        next: (data) => {
          this.questions.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('נכשל בטעינת השאלות. אנא ודא ששרת ה-backend פועל.');
          this.isLoading.set(false);
          console.error('Error loading questions:', err);
        }
      });
  }

  setAnswer(questionId: number, score: number): void {
    this.answers.update(map => {
      const newMap = new Map(map);
      newMap.set(questionId, score);
      return newMap;
    });
    
    // Scroll to next question after a short delay
    setTimeout(() => {
      this.scrollToNextQuestion(questionId);
    }, 150);
  }

  private scrollToNextQuestion(currentQuestionId: number): void {
    const currentPageQuestions = this.currentQuestions();
    const currentIndex = currentPageQuestions.findIndex(q => q.id === currentQuestionId);
    
    // If there's a next question on this page, scroll to it
    if (currentIndex < currentPageQuestions.length - 1) {
      const nextQuestion = currentPageQuestions[currentIndex + 1];
      const nextElement = document.getElementById(`question-${nextQuestion.id}`);
      if (nextElement) {
        nextElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      // Last question on the page - scroll to navigation
      const pagination = document.querySelector('.pagination');
      if (pagination) {
        pagination.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  getAnswer(questionId: number): number | undefined {
    return this.answers().get(questionId);
  }

  isAllAnswered(): boolean {
    return this.questions().every(q => this.answers().has(q.id));
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.scrollToTop();
    }
  }

  nextPage(): void {
    if (!this.isCurrentPageComplete()) {
      this.error.set('אנא ענה על כל השאלות בעמוד זה לפני המעבר לעמוד הבא.');
      return;
    }
    this.error.set(null);
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(p => p + 1);
      this.scrollToTop();
    }
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submitAssessment(): void {
    if (!this.isAllAnswered()) {
      this.error.set('אנא ענה על כל השאלות לפני השליחה.');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    // Convert Map to object for JSON
    const answersObj: { [key: number]: number } = {};
    this.answers().forEach((value, key) => {
      answersObj[key] = value;
    });

    const headers = new HttpHeaders({
      'X-User-ID': this.userId(),
      'Content-Type': 'application/json'
    });

    // Use test endpoint if in test mode
    const endpoint = this.isTestMode()
      ? 'http://localhost:8001/api/v1/assessment/submit/test'
      : 'http://localhost:8001/api/v1/assessment/submit';

    this.http.post<AssessmentResult>(
      endpoint,
      { answers: answersObj },
      { headers }
    ).subscribe({
      next: (result) => {
        this.results.set(result);
        this.isSubmitted.set(true);
        this.isLoading.set(false);
        this.updateRadarChart();
      },
      error: (err) => {
        this.error.set(err.error?.detail || 'נכשל בשליחת ההערכה. אנא נסה שוב.');
        this.isLoading.set(false);
        console.error('Error submitting assessment:', err);
      }
    });
  }

  updateRadarChart(): void {
    const currentResults = this.results();
    if (!currentResults) return;

    // Extract labels and data from category scores
    const labels = currentResults.category_scores.map(cs => cs.category);
    const scores = currentResults.category_scores.map(cs => cs.score);

    this.radarChartLabels.set(labels);
    this.radarChartData.set({
      labels: labels,
      datasets: [{
        label: 'Skills Score',
        data: scores,
        backgroundColor: 'rgba(84, 19, 136, 0.2)',
        borderColor: 'rgba(84, 19, 136, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(84, 19, 136, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(84, 19, 136, 1)'
      }]
    });
  }

  resetAssessment(): void {
    this.answers.set(new Map());
    this.currentPage.set(0);
    this.isSubmitted.set(false);
    this.results.set(null);
    this.error.set(null);
  }
}
