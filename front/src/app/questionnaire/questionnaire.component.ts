import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AssessmentStore } from '../stores';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, RouterLink],
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {
  private route = inject(ActivatedRoute);
  
  // Inject AssessmentStore
  readonly assessmentStore = inject(AssessmentStore);
  
  // User ID - in production, this would come from authentication
  private userId = 'user-' + Date.now();

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

  // Computed: Radar chart data from store results
  radarChartData = computed<ChartData<'radar'>>(() => {
    const scores = this.assessmentStore.categoryScores();
    if (scores.length === 0) {
      return {
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
      };
    }
    
    return {
      labels: scores.map(cs => cs.category),
      datasets: [{
        label: 'Skills Score',
        data: scores.map(cs => cs.score),
        backgroundColor: 'rgba(84, 19, 136, 0.2)',
        borderColor: 'rgba(84, 19, 136, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(84, 19, 136, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(84, 19, 136, 1)'
      }]
    };
  });

  public radarChartType: ChartType = 'radar';

  ngOnInit(): void {
    // Check if test mode from route data
    this.route.data.subscribe(data => {
      const testMode = data['testMode'] === true;
      this.assessmentStore.loadQuestions(testMode);
    });
  }

  setAnswer(questionId: number, score: number): void {
    this.assessmentStore.setAnswer(questionId, score);
    
    // Scroll to next question after a short delay
    setTimeout(() => {
      this.scrollToNextQuestion(questionId);
    }, 150);
  }

  getAnswer(questionId: number): number | undefined {
    return this.assessmentStore.getAnswer(questionId);
  }

  previousPage(): void {
    if (this.assessmentStore.previousPage()) {
      this.scrollToTop();
    }
  }

  nextPage(): void {
    if (this.assessmentStore.nextPage()) {
      this.scrollToTop();
    }
  }

  submitAssessment(): void {
    this.assessmentStore.submitAssessment(this.userId);
    this.scrollToTop();
  }

  resetAssessment(): void {
    this.assessmentStore.reset();
    this.scrollToTop();
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private scrollToNextQuestion(currentQuestionId: number): void {
    const currentQuestions = this.assessmentStore.currentQuestions();
    const currentIndex = currentQuestions.findIndex(q => q.id === currentQuestionId);
    
    // If there's a next question on this page, scroll to it
    if (currentIndex < currentQuestions.length - 1) {
      const nextQuestion = currentQuestions[currentIndex + 1];
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
}
