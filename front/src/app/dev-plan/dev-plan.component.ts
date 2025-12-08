import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeStore, PositionsStore } from '../stores';
import { Position } from '../stores/models';
import { DropdownComponent, DropdownOption } from '../shared/dropdown/dropdown.component';

// Local interfaces for this page
interface SkillGap {
  id: string;
  name: string;
  severity: 'critical' | 'medium' | 'low';
  jobsRequiring: number;
}

interface RecommendedCourse {
  id: string;
  title: string;
  duration: string;
  format: string;
  gapsClosing: number;
  color: 'primary' | 'accent' | 'secondary';
}

interface CareerInsight {
  id: string;
  type: 'opportunity' | 'trend' | 'network';
  title: string;
  description: string;
  icon: string;
  iconColor: string;
}

interface FilterState {
  minMatchLevel: string;
  categories: string[];
  grades: string[];
  locations: string[];
  dateRange: string;
}

@Component({
  selector: 'app-dev-plan',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DropdownComponent],
  templateUrl: './dev-plan.component.html',
  styleUrls: ['./dev-plan.component.css']
})
export class DevPlanComponent implements OnInit {
  // Inject stores
  readonly employeeStore = inject(EmployeeStore);
  readonly positionsStore = inject(PositionsStore);

  // Local state signals
  private _skillGaps = signal<SkillGap[]>([]);
  private _courses = signal<RecommendedCourse[]>([]);
  private _insights = signal<CareerInsight[]>([]);
  private _filters = signal<FilterState>({
    minMatchLevel: '85',
    categories: ['טכנולוגיה'],
    grades: ['Senior Manager', 'Principal'],
    locations: ['תל אביב'],
    dateRange: 'all'
  });
  private _showMoreJobs = signal<boolean>(false);

  // Public readonly signals
  readonly skillGaps = this._skillGaps.asReadonly();
  readonly courses = this._courses.asReadonly();
  readonly insights = this._insights.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly showMoreJobs = this._showMoreJobs.asReadonly();

  // Computed signals
  readonly isLoading = computed(() => 
    this.employeeStore.isLoading() || this.positionsStore.isLoading()
  );
  
  readonly error = computed(() => 
    this.employeeStore.error() || this.positionsStore.error()
  );

  readonly highMatchJobs = computed(() => 
    this.positionsStore.positions().filter(p => p.match_percentage >= 85).length
  );

  readonly goodMatchJobs = computed(() => 
    this.positionsStore.positions().filter(p => p.match_percentage >= 75 && p.match_percentage < 85).length
  );

  readonly targetRoleMatch = computed(() => {
    const positions = this.positionsStore.positions();
    return positions.length > 0 ? Math.max(...positions.map(p => p.match_percentage)) : 0;
  });

  readonly filteredPositions = computed(() => {
    let positions = this.positionsStore.positions();
    const f = this._filters();
    
    // Filter by min match level
    if (f.minMatchLevel !== 'all') {
      const minMatch = parseInt(f.minMatchLevel);
      positions = positions.filter(p => p.match_percentage >= minMatch);
    }
    
    return positions;
  });

  readonly displayedPositions = computed(() => {
    const positions = this.filteredPositions();
    return this._showMoreJobs() ? positions : positions.slice(0, 4);
  });

  readonly remainingJobsCount = computed(() => {
    const total = this.filteredPositions().length;
    const displayed = this.displayedPositions().length;
    return total - displayed;
  });

  // Dropdown options
  categoryFilterOptions: DropdownOption[] = [
    { value: 'all', label: 'כל הקטגוריות', icon: 'fa-solid fa-layer-group' },
    { value: 'טכנולוגיה', label: 'טכנולוגיה', icon: 'fa-solid fa-laptop-code' },
    { value: 'כספים', label: 'כספים', icon: 'fa-solid fa-chart-line' },
    { value: 'משאבי אנוש', label: 'משאבי אנוש', icon: 'fa-solid fa-users' },
    { value: 'לוגיסטיקה', label: 'לוגיסטיקה', icon: 'fa-solid fa-truck' }
  ];

  sortFilterOptions: DropdownOption[] = [
    { value: 'match', label: 'מיין לפי התאמה', icon: 'fa-solid fa-trophy' },
    { value: 'date', label: 'מיין לפי תאריך פרסום', icon: 'fa-solid fa-calendar' },
    { value: 'grade', label: 'מיין לפי דרגה', icon: 'fa-solid fa-ranking-star' }
  ];

  minMatchOptions: DropdownOption[] = [
    { value: 'all', label: 'כל הרמות', icon: 'fa-solid fa-sliders' },
    { value: '85', label: '85% ומעלה', icon: 'fa-solid fa-star' },
    { value: '75', label: '75% - 84%', icon: 'fa-solid fa-star-half-alt' },
    { value: '65', label: '65% - 74%', icon: 'fa-regular fa-star' }
  ];

  dateRangeOptions: DropdownOption[] = [
    { value: 'all', label: 'כל התקופות', icon: 'fa-solid fa-calendar-days' },
    { value: 'week', label: 'שבוע אחרון', icon: 'fa-solid fa-calendar-week' },
    { value: 'month', label: 'חודש אחרון', icon: 'fa-solid fa-calendar' },
    { value: 'quarter', label: '3 חודשים אחרונים', icon: 'fa-solid fa-calendar-alt' }
  ];

  ngOnInit(): void {
    this.loadData();
    this.loadMockData();
  }

  loadData(): void {
    this.positionsStore.loadPositions();
  }

  private loadMockData(): void {
    // Load skill gaps
    this._skillGaps.set([
      { id: 'gap-1', name: 'Cloud Architecture', severity: 'critical', jobsRequiring: 5 },
      { id: 'gap-2', name: 'ניהול תקציבים', severity: 'medium', jobsRequiring: 3 },
      { id: 'gap-3', name: 'DevOps Practices', severity: 'medium', jobsRequiring: 4 }
    ]);

    // Load recommended courses
    this._courses.set([
      { id: 'course-1', title: 'AWS Solutions Architect', duration: '40 שעות', format: 'מקוון', gapsClosing: 2, color: 'primary' },
      { id: 'course-2', title: 'Financial Management for Tech Leaders', duration: '16 שעות', format: 'היברידי', gapsClosing: 1, color: 'accent' },
      { id: 'course-3', title: 'DevOps Fundamentals', duration: '24 שעות', format: 'מקוון', gapsClosing: 1, color: 'secondary' }
    ]);

    // Load career insights
    this._insights.set([
      { id: 'insight-1', type: 'opportunity', title: 'הזדמנות חמה', description: '3 משרות חדשות נפתחו השבוע בתחום שלך', icon: 'fa-star', iconColor: 'text-status-warning' },
      { id: 'insight-2', type: 'trend', title: 'מגמה עולה', description: 'ביקוש גבוה למומחי Cloud בארגון', icon: 'fa-chart-line', iconColor: 'text-status-success' },
      { id: 'insight-3', type: 'network', title: 'רשת מקצועית', description: '5 עובדים עברו לתפקידים דומים בשנה האחרונה', icon: 'fa-users', iconColor: 'text-accent' }
    ]);
  }

  // Actions
  toggleShowMoreJobs(): void {
    this._showMoreJobs.update(v => !v);
  }

  updateFilter(key: keyof FilterState, value: any): void {
    this._filters.update(f => ({ ...f, [key]: value }));
  }

  toggleCategoryFilter(category: string): void {
    this._filters.update(f => {
      const categories = f.categories.includes(category)
        ? f.categories.filter(c => c !== category)
        : [...f.categories, category];
      return { ...f, categories };
    });
  }

  toggleGradeFilter(grade: string): void {
    this._filters.update(f => {
      const grades = f.grades.includes(grade)
        ? f.grades.filter(g => g !== grade)
        : [...f.grades, grade];
      return { ...f, grades };
    });
  }

  toggleLocationFilter(location: string): void {
    this._filters.update(f => {
      const locations = f.locations.includes(location)
        ? f.locations.filter(l => l !== location)
        : [...f.locations, location];
      return { ...f, locations };
    });
  }

  clearFilters(): void {
    this._filters.set({
      minMatchLevel: 'all',
      categories: [],
      grades: [],
      locations: [],
      dateRange: 'all'
    });
  }

  // Helper methods
  getMatchLevelClass(percentage: number): string {
    if (percentage >= 85) return 'text-status-success';
    if (percentage >= 75) return 'text-status-warning';
    return 'text-neutral-medium';
  }

  getMatchLevelBgClass(percentage: number): string {
    if (percentage >= 85) return 'bg-status-success/10 text-status-success';
    if (percentage >= 75) return 'bg-status-warning/10 text-status-warning';
    return 'bg-neutral-light text-neutral-medium';
  }

  getMatchLevelLabel(percentage: number): string {
    if (percentage >= 85) return 'התאמה גבוהה';
    if (percentage >= 75) return 'התאמה טובה';
    return 'התאמה בינונית';
  }

  getSeverityBadgeClass(severity: string): string {
    switch (severity) {
      case 'critical': return 'bg-status-danger/20 text-status-danger';
      case 'medium': return 'bg-status-warning/20 text-status-warning';
      default: return 'bg-status-info/20 text-status-info';
    }
  }

  getSeverityLabel(severity: string): string {
    switch (severity) {
      case 'critical': return 'פער קריטי';
      case 'medium': return 'פער בינוני';
      default: return 'פער קל';
    }
  }

  getCourseBorderClass(color: string): string {
    switch (color) {
      case 'primary': return 'border-primary bg-primary-light/20';
      case 'accent': return 'border-accent bg-accent/10';
      case 'secondary': return 'border-secondary bg-secondary/10';
      default: return 'border-primary bg-primary-light/20';
    }
  }

  getCourseTextClass(color: string): string {
    switch (color) {
      case 'primary': return 'text-primary';
      case 'accent': return 'text-accent-dark';
      case 'secondary': return 'text-secondary';
      default: return 'text-primary';
    }
  }

  getCategoryBadgeClass(category: string): string {
    // Map categories to colors
    const categoryColors: { [key: string]: string } = {
      'טכנולוגיה': 'bg-category-tech/20 text-category-tech',
      'כספים': 'bg-category-finance/20 text-category-finance',
      'משאבי אנוש': 'bg-category-hr/20 text-category-hr',
      'לוגיסטיקה': 'bg-category-logistics/20 text-category-logistics',
      'תפעול': 'bg-category-operations/20 text-category-operations'
    };
    return categoryColors[category] || 'bg-primary/20 text-primary';
  }

  buildDevelopmentPlan(position: Position): void {
    this.positionsStore.selectPosition(position.id);
    // Navigate to home page which shows the IDP section
    // In a real app, you might navigate to a dedicated IDP page
  }
}

