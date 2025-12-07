import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface JobData {
  title: string;
  match: string;
  matchLevel: string;
  category: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  selectedJobId: string | null = null;
  showIDP = false;
  selectedJobTitle = '';
  selectedJobMatch = '';

  jobData: { [key: string]: JobData } = {
    '1': {
      title: 'ראש צוות פיתוח',
      match: '92%',
      matchLevel: 'גבוהה',
      category: 'טכנולוגיה',
      description: 'הובלת צוות פיתוח Backend בטכנולוגיות Java ו-Spring, ניהול ארכיטקטורה ופיתוח מערכות מורכבות.'
    },
    '2': {
      title: 'מנהל/ת תקציבים',
      match: '81%',
      matchLevel: 'טובה',
      category: 'כספים',
      description: 'ניהול תקציבי פרויקטים, ניתוח פיננסי ובקרה תקציבית לפרויקטים אסטרטגיים בארגון.'
    },
    '3': {
      title: 'שותף/ה עסקי HR',
      match: '73%',
      matchLevel: 'בינונית',
      category: 'משאבי אנוש',
      description: 'ליווי מנהלים בתהליכי פיתוח ארגוני, גיוס ושימור עובדים, וניהול תהליכי שינוי ארגוני.'
    }
  };

  selectJob(jobId: string): void {
    const job = this.jobData[jobId];
    if (job) {
      this.selectedJobId = jobId;
      this.selectedJobTitle = job.title;
      this.selectedJobMatch = job.match;
      this.showIDP = true;
      
      // Scroll to IDP section after a short delay
      setTimeout(() => {
        document.getElementById('idp-connected')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  closeIDP(): void {
    this.showIDP = false;
    this.selectedJobId = null;
    
    // Scroll back to opportunities section
    document.getElementById('matching-opportunities')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scrollToQuestionnaire(): void {
    document.getElementById('matching-questionnaire')?.scrollIntoView({ behavior: 'smooth' });
  }
}

