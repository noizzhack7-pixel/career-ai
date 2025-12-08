import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services';
import { 
  ExtendedProfile, 
  SkillWithLevel, 
  EducationItem, 
  ExperienceItem, 
  Recommendation, 
  WishlistItem,
  Language,
  TargetRole,
  NotificationItem,
  CareerPreferences
} from '../stores/models';
import { DropdownComponent, DropdownOption } from '../shared/dropdown/dropdown.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DropdownComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private api = inject(ApiService);

  // State signals
  private _profile = signal<ExtendedProfile | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // UI state signals
  private _showWishlistModal = signal<boolean>(false);
  private _selectedWishType = signal<'text' | 'role' | 'keywords' | null>(null);

  // Public readonly signals
  readonly profile = this._profile.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly showWishlistModal = this._showWishlistModal.asReadonly();
  readonly selectedWishType = this._selectedWishType.asReadonly();

  // Dropdown options
  selectedRole = signal<string>('');
  roleOptions: DropdownOption[] = [
    { value: '', label: 'בחרי תפקיד מהרשימה...', icon: 'fa-solid fa-briefcase' },
    { value: 'team-lead', label: 'ראש צוות פיתוח Backend', icon: 'fa-solid fa-users' },
    { value: 'architect', label: 'ארכיטקט תוכנה בכיר', icon: 'fa-solid fa-sitemap' },
    { value: 'pm', label: 'מנהל/ת מוצר טכני', icon: 'fa-solid fa-clipboard-list' },
    { value: 'tech-lead', label: 'Tech Lead', icon: 'fa-solid fa-user-tie' }
  ];

  // Computed signals
  readonly fullName = computed(() => this._profile()?.name ?? '');
  readonly title = computed(() => this._profile()?.title ?? '');
  readonly avatar = computed(() => this._profile()?.avatar || this._profile()?.photo_url || '');
  readonly coverImage = computed(() => this._profile()?.cover_image ?? '');
  readonly isActive = computed(() => this._profile()?.is_active ?? false);
  readonly organization = computed(() => this._profile()?.organization ?? null);
  readonly details = computed(() => this._profile()?.details ?? null);
  readonly metrics = computed(() => this._profile()?.metrics ?? null);
  readonly bio = computed(() => this._profile()?.bio ?? '');
  readonly professionalInterests = computed(() => this._profile()?.professional_interests ?? []);
  readonly softSkillsDetailed = computed(() => this._profile()?.soft_skills_detailed ?? []);
  readonly hardSkillsDetailed = computed(() => this._profile()?.hard_skills_detailed ?? []);
  readonly educationItems = computed(() => this._profile()?.education_items ?? []);
  readonly experience = computed(() => this._profile()?.experience ?? []);
  readonly recommendations = computed(() => this._profile()?.recommendations ?? []);
  readonly wishlist = computed(() => this._profile()?.wishlist ?? []);
  readonly languages = computed(() => this._profile()?.languages ?? []);
  readonly targetRole = computed(() => this._profile()?.target_role ?? null);
  readonly notifications = computed(() => this._profile()?.notifications ?? []);
  readonly careerPreferences = computed(() => this._profile()?.career_preferences ?? null);
  readonly dataQuality = computed(() => this._profile()?.metrics?.data_quality ?? 0);
  readonly idpProgress = computed(() => this._profile()?.idp?.progress?.overall ?? 0);

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.api.get<ExtendedProfile>(ApiService.ENDPOINTS.EMPLOYEES.ME).subscribe({
      next: (profile) => {
        // Prefer photo_url when present
        const mergedProfile: ExtendedProfile = {
          ...profile,
          avatar: profile.photo_url || profile.avatar,
        };
        this._profile.set(mergedProfile);
        this._isLoading.set(false);
      },
      error: (error) => {
        this._error.set('שגיאה בטעינת הפרופיל');
        this._isLoading.set(false);
        console.error('Error loading profile:', error);
      },
    });
  }

  // Skill level helpers
  getSkillLevelPercent(level: number): number {
    return (level / 5) * 100;
  }

  getSkillLevelLabel(level: number): string {
    switch (level) {
      case 5: return 'מומחה';
      case 4: return 'מתקדם';
      case 3: return 'בינוני';
      case 2: return 'בסיסי';
      case 1: return 'מתחיל';
      default: return '';
    }
  }

  getSkillLevelColorClass(level: number): string {
    if (level >= 4) return 'bg-primary';
    if (level >= 3) return 'bg-status-warning';
    return 'bg-status-warning';
  }

  getSkillBadgeClass(level: number): string {
    if (level >= 4) return 'bg-primary/20 text-primary';
    return 'bg-status-warning/20 text-status-warning';
  }

  // Education type helpers
  getEducationTypeLabel(type: string): string {
    switch (type) {
      case 'degree': return 'תואר אקדמי';
      case 'certification': return 'הסמכה';
      case 'course': return 'קורס';
      default: return '';
    }
  }

  getEducationColorClass(type: string): string {
    switch (type) {
      case 'degree': return 'border-primary bg-primary/5';
      case 'certification': return 'border-accent bg-accent/5';
      default: return 'border-status-success bg-status-success/5';
    }
  }

  getEducationIconClass(type: string): string {
    switch (type) {
      case 'degree': return 'fa-university text-primary';
      case 'certification': return 'fa-certificate text-accent-dark';
      default: return 'fa-award text-status-success';
    }
  }

  getEducationBadgeClass(type: string): string {
    switch (type) {
      case 'degree': return 'bg-primary/20 text-primary';
      case 'certification': return 'bg-accent/30 text-accent-dark';
      default: return 'bg-status-success/20 text-status-success';
    }
  }

  // Experience helpers
  getExperienceColorClass(index: number, isCurrent: boolean): string {
    if (isCurrent) return 'bg-primary';
    const colors = ['bg-accent', 'bg-secondary', 'bg-status-info'];
    return colors[index % colors.length];
  }

  getExperienceBgClass(index: number, isCurrent: boolean): string {
    if (isCurrent) return 'bg-primary/5 border-primary/20';
    const classes = ['bg-accent/5 border-accent/20', 'bg-secondary/5 border-secondary/20'];
    return classes[index % classes.length];
  }

  getExperienceTitleClass(index: number, isCurrent: boolean): string {
    if (isCurrent) return 'text-primary';
    const classes = ['text-accent-dark', 'text-secondary'];
    return classes[index % classes.length];
  }

  getExperienceCheckClass(index: number, isCurrent: boolean): string {
    if (isCurrent) return 'text-status-success';
    const classes = ['text-accent-dark', 'text-secondary'];
    return classes[index % classes.length];
  }

  // Recommendation helpers
  getRelationshipLabel(relationship: string): string {
    switch (relationship) {
      case 'manager': return 'מנהל ישיר';
      case 'colleague': return 'עמית צוות';
      case 'mentee': return 'מנטי';
      default: return '';
    }
  }

  getRelationshipBadgeClass(relationship: string): string {
    switch (relationship) {
      case 'manager': return 'bg-primary/20 text-primary';
      case 'colleague': return 'bg-accent/20 text-accent-dark';
      case 'mentee': return 'bg-secondary/20 text-secondary';
      default: return '';
    }
  }

  // Wishlist helpers
  getWishTypeLabel(type: string): string {
    switch (type) {
      case 'text': return 'טקסט חופשי';
      case 'role': return 'תפקיד ספציפי';
      case 'keywords': return 'מילות מפתח';
      default: return '';
    }
  }

  getWishTypeBadgeClass(type: string): string {
    switch (type) {
      case 'text': return 'bg-primary/20 text-primary';
      case 'role': return 'bg-accent/20 text-accent-dark';
      case 'keywords': return 'bg-secondary/20 text-secondary';
      default: return '';
    }
  }

  getWishIconClass(type: string): string {
    switch (type) {
      case 'text': return 'fa-comment-dots text-primary';
      case 'role': return 'fa-briefcase text-accent-dark';
      case 'keywords': return 'fa-tags text-secondary';
      default: return '';
    }
  }

  getWishBgClass(type: string): string {
    switch (type) {
      case 'text': return 'bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20';
      case 'role': return 'bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20';
      case 'keywords': return 'bg-gradient-to-br from-secondary/5 to-accent/5 border-secondary/20';
      default: return '';
    }
  }

  // Language helpers
  getLanguageLevelLabel(level: string): string {
    switch (level) {
      case 'native': return 'שפת אם';
      case 'fluent': return 'שוטף';
      case 'intermediate': return 'בינוני';
      case 'basic': return 'בסיסי';
      default: return '';
    }
  }

  getLanguageBadgeClass(level: string): string {
    switch (level) {
      case 'native': return 'bg-primary/20 text-primary';
      case 'fluent': return 'bg-accent/20 text-accent-dark';
      case 'intermediate': return 'bg-secondary/20 text-secondary';
      case 'basic': return 'bg-neutral-light text-neutral-dark';
      default: return '';
    }
  }

  // Notification helpers
  getNotificationBgClass(type: string): string {
    switch (type) {
      case 'job_match': return 'bg-primary-light/20 border-primary';
      case 'idp_update': return 'bg-accent/10 border-accent';
      case 'recommendation': return 'bg-secondary/10 border-secondary';
      default: return 'bg-neutral-light border-neutral-medium';
    }
  }

  // Modal management
  openWishlistModal(): void {
    this._showWishlistModal.set(true);
    this._selectedWishType.set(null);
  }

  closeWishlistModal(): void {
    this._showWishlistModal.set(false);
    this._selectedWishType.set(null);
  }

  selectWishType(type: 'text' | 'role' | 'keywords'): void {
    this._selectedWishType.set(type);
  }

  // Generate stars for rating
  getStarsArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
