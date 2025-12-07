import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'questionnaire', component: QuestionnaireComponent, data: { testMode: false } },
  { path: 'questionnaire/test', component: QuestionnaireComponent, data: { testMode: true } },
  { path: '**', redirectTo: '' }
];
