import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PositionsStore } from '../stores';
import { Position, PositionFilters } from '../stores/models';
import { DropdownComponent, DropdownOption } from '../shared/dropdown/dropdown.component';

@Component({
  selector: 'app-positions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DropdownComponent],
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css']
})
export class PositionsComponent implements OnInit {
  positionsStore = inject(PositionsStore);

  // Local state signals
  currentView = signal<'all' | 'open'>('all');
  sortBy = signal<'match' | 'newest'>('match');
  filters = signal<PositionFilters>({
    search: '',
    category: 'all',
    location: 'all',
    grade: 'all',
    showOpenOnly: false
  });

  // Computed signals
  filteredPositions = computed(() => {
    let positions = [...this.positionsStore.positions()];
    const view = this.currentView();
    const f = this.filters();
    const sort = this.sortBy();

    // Filter by open status
    if (view === 'open') {
      positions = positions.filter(p => p.is_open);
    }

    // Filter by search
    if (f.search) {
      const searchLower = f.search.toLowerCase();
      positions = positions.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.division.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (f.category !== 'all') {
      positions = positions.filter(p => p.category === f.category);
    }

    // Filter by location
    if (f.location !== 'all') {
      positions = positions.filter(p => 
        p.location.includes(f.location) || p.work_model.includes(f.location)
      );
    }

    // Sort positions
    if (sort === 'match') {
      positions.sort((a, b) => b.match_percentage - a.match_percentage);
    } else if (sort === 'newest') {
      // Sort by posted_time - assuming "פורסם היום" is newest, "פורסם לפני שבוע" is oldest
      positions.sort((a, b) => {
        const getTimeValue = (time: string | undefined): number => {
          if (!time) return 0;
          if (time.includes('היום')) return 5;
          if (time.includes('יום')) return 4;
          if (time.includes('יומיים')) return 4;
          if (time.includes('3 ימים') || time.includes('שלושה')) return 3;
          if (time.includes('4 ימים') || time.includes('ארבעה')) return 3;
          if (time.includes('5 ימים') || time.includes('חמישה')) return 2;
          if (time.includes('שבוע')) return 1;
          if (time.includes('שבועיים')) return 0;
          return 0;
        };
        return getTimeValue(b.posted_time) - getTimeValue(a.posted_time);
      });
    }

    return positions;
  });

  filteredCount = computed(() => this.filteredPositions().length);
  
  openJobsCount = computed(() => 
    this.positionsStore.positions().filter(p => p.is_open).length
  );

  categories = computed(() => {
    const cats = new Set(this.positionsStore.positions().map(p => p.category));
    return Array.from(cats);
  });

  locations = computed(() => {
    const locs = new Set(this.positionsStore.positions().map(p => p.location));
    return Array.from(locs);
  });

  // Dropdown options
  categoryOptions = computed<DropdownOption[]>(() => [
    { value: 'all', label: 'כל הקטגוריות', icon: 'fa-solid fa-layer-group' },
    ...this.categories().map(cat => ({ value: cat, label: cat, icon: 'fa-solid fa-tag' }))
  ]);

  locationOptions = computed<DropdownOption[]>(() => [
    { value: 'all', label: 'כל המיקומים', icon: 'fa-solid fa-location-dot' },
    ...this.locations().map(loc => ({ value: loc, label: loc, icon: 'fa-solid fa-map-marker-alt' })),
    { value: 'היברידי', label: 'היברידי', icon: 'fa-solid fa-arrows-alt-h' },
    { value: 'מרוחק', label: 'מרוחק', icon: 'fa-solid fa-house-laptop' }
  ]);

  gradeOptions: DropdownOption[] = [
    { value: 'all', label: 'כל הדרגות', icon: 'fa-solid fa-ranking-star' },
    { value: 'junior', label: 'Junior', icon: 'fa-solid fa-seedling' },
    { value: 'mid', label: 'Mid-level', icon: 'fa-solid fa-user' },
    { value: 'senior', label: 'Senior', icon: 'fa-solid fa-user-tie' },
    { value: 'lead', label: 'Team Lead', icon: 'fa-solid fa-users' }
  ];

  sortOptions: DropdownOption[] = [
    { value: 'match', label: 'התאמה הגבוהה ביותר', icon: 'fa-solid fa-trophy' },
    { value: 'newest', label: 'החדשות ביותר', icon: 'fa-solid fa-clock' }
  ];

  constructor() {
    // Effect to select first position when positions are loaded
    effect(() => {
      const positions = this.positionsStore.positions();
      const hasSelection = this.positionsStore.hasSelection();
      if (positions.length > 0 && !hasSelection) {
        this.positionsStore.selectPosition(positions[0].id);
      }
    });
  }

  ngOnInit(): void {
    if (!this.positionsStore.isPositionsLoaded()) {
      this.positionsStore.loadPositions();
    }
  }

  // Tab switching
  setView(view: 'all' | 'open'): void {
    this.currentView.set(view);
  }

  // Sort
  setSortBy(value: string): void {
    if (value === 'match' || value === 'newest') {
      this.sortBy.set(value);
    }
  }

  // Filter updates
  updateFilter<K extends keyof PositionFilters>(key: K, value: PositionFilters[K]): void {
    this.filters.update(f => ({ ...f, [key]: value }));
  }

  clearFilters(): void {
    this.filters.set({
      search: '',
      category: 'all',
      location: 'all',
      grade: 'all',
      showOpenOnly: false
    });
  }

  // Position selection
  selectPosition(position: Position): void {
    this.positionsStore.selectPosition(position.id);
  }

  isSelected(position: Position): boolean {
    return this.positionsStore.selectedPositionId() === position.id;
  }

  // Helper methods for styling
  getCategoryColorClass(color: string): string {
    const colorMap: Record<string, string> = {
      'blue': 'bg-blue-100 text-blue-800',
      'green': 'bg-green-100 text-green-800',
      'purple': 'bg-purple-100 text-purple-800',
      'orange': 'bg-orange-100 text-orange-800',
      'primary': 'bg-primary-light text-primary',
      'accent': 'bg-accent/20 text-accent-dark',
      'secondary': 'bg-secondary/20 text-secondary'
    };
    return colorMap[color] || 'bg-neutral-light text-neutral-dark';
  }

  getMatchColorClass(percentage: number): string {
    if (percentage >= 85) return 'text-primary';
    if (percentage >= 70) return 'text-accent-dark';
    return 'text-secondary';
  }

  getMatchBgClass(percentage: number): string {
    if (percentage >= 85) return 'text-primary';
    if (percentage >= 70) return 'text-accent-dark';
    return 'text-secondary';
  }

  getRequirementStatusClass(status: string): string {
    if (status === 'יש') {
      return 'bg-status-success/10 border-status-success';
    }
    return 'bg-status-warning/10 border-status-warning';
  }

  getRequirementIconClass(status: string): string {
    if (status === 'יש') {
      return 'fa-check-circle text-status-success';
    }
    return 'fa-exclamation-triangle text-status-warning';
  }

  getRequirementTextClass(status: string): string {
    if (status === 'יש') {
      return 'text-status-success';
    }
    return 'text-status-warning';
  }

  getSkillMatchClass(matched: boolean): string {
    if (matched) {
      return 'bg-status-success/15 text-status-success border-status-success/30';
    }
    return 'bg-status-warning/15 text-status-warning border-status-warning/30';
  }

  getSkillIcon(matched: boolean): string {
    return matched ? 'fa-check' : 'fa-triangle-exclamation';
  }

  getMatchedSkillsCount(skills: { matched: boolean }[] | undefined): number {
    if (!skills) return 0;
    return skills.filter(s => s.matched).length;
  }

  getTotalSkillsCount(skills: { matched: boolean }[] | undefined): number {
    return skills?.length || 0;
  }
}

