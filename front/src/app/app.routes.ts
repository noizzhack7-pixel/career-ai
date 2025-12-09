import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { ProfileComponent } from './profile/profile.component';
import { DevPlanComponent } from './dev-plan/dev-plan.component';
import { PositionsComponent } from './positions/positions.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'positions', component: PositionsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'dev-plan', component: DevPlanComponent },
  { path: 'questionnaire', component: QuestionnaireComponent, data: { testMode: false } },
  { path: 'questionnaire/test', component: QuestionnaireComponent, data: { testMode: true } },
  { path: '**', redirectTo: '' }
];
