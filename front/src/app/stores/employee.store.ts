import { Injectable, inject, signal, computed } from '@angular/core';
import { ApiService } from '../services';
import { EmployeeProfile, IDPProgress } from './models';

// Extended profile response that includes IDP
interface CandidateProfileResponse extends EmployeeProfile {
  idp?: {
    progress: IDPProgress;
  };
}

@Injectable({ providedIn: 'root' })
export class EmployeeStore {
  private api = inject(ApiService);

  // State signals
  private _profile = signal<EmployeeProfile | null>(null);
  private _idpProgress = signal<IDPProgress | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly profile = this._profile.asReadonly();
  readonly idpProgress = this._idpProgress.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals
  readonly fullName = computed(() => this._profile()?.name ?? '');
  readonly title = computed(() => this._profile()?.title ?? '');
  readonly avatar = computed(() => this._profile()?.avatar ?? '');
  readonly metrics = computed(() => this._profile()?.metrics ?? null);
  readonly softSkills = computed(() => this._profile()?.soft_skills ?? []);
  readonly hardSkills = computed(() => this._profile()?.hard_skills ?? []);
  readonly organization = computed(() => this._profile()?.organization ?? null);
  readonly isProfileLoaded = computed(() => this._profile() !== null);
  readonly dataQuality = computed(() => this._profile()?.metrics?.data_quality ?? 0);

  // Load candidate profile (includes IDP)
  loadProfile(candidateId: string = 'user-1'): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.api.get<CandidateProfileResponse>(ApiService.ENDPOINTS.CANDIDATES.PROFILE(candidateId)).subscribe({
      next: (data) => {
        const { idp, ...profile } = data;
        this._profile.set(profile as EmployeeProfile);
        if (idp?.progress) {
          this._idpProgress.set(idp.progress);
        }
        this._isLoading.set(false);
      },
      error: (error) => {
        this._error.set('שגיאה בטעינת פרופיל המשתמש');
        this._isLoading.set(false);
        console.error('Error loading profile:', error);
      },
    });
  }

  // Load current user's profile (convenience method)
  loadCurrentUser(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.api.get<CandidateProfileResponse>(ApiService.ENDPOINTS.CANDIDATES.ME).subscribe({
      next: (data) => {
        const { idp, ...profile } = data;
        this._profile.set(profile as EmployeeProfile);
        if (idp?.progress) {
          this._idpProgress.set(idp.progress);
        }
        this._isLoading.set(false);
      },
      error: (error) => {
        this._error.set('שגיאה בטעינת פרופיל המשתמש');
        this._isLoading.set(false);
        console.error('Error loading profile:', error);
      },
    });
  }

  // Alias for loadCurrentUser (backwards compatibility)
  loadAll(): void {
    this.loadCurrentUser();
  }

  // Clear error
  clearError(): void {
    this._error.set(null);
  }

  // Reset store
  reset(): void {
    this._profile.set(null);
    this._idpProgress.set(null);
    this._isLoading.set(false);
    this._error.set(null);
  }
}
