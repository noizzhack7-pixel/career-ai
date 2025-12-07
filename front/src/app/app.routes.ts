import { Routes } from '@angular/router';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';

export const routes: Routes = [
  { path: '', redirectTo: '/questionnaire', pathMatch: 'full' },
  { path: 'questionnaire', component: QuestionnaireComponent, data: { testMode: false } },
  { path: 'questionnaire/test', component: QuestionnaireComponent, data: { testMode: true } },
  { path: '**', redirectTo: '/questionnaire' }
];

