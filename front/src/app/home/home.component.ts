import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeStore, PositionsStore } from '../stores';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Inject stores
  readonly employeeStore = inject(EmployeeStore);
  readonly positionsStore = inject(PositionsStore);

  // Computed: Combined loading state
  isLoading = computed(() => 
    this.employeeStore.isLoading() || this.positionsStore.isLoading()
  );

  // Computed: Combined error state
  error = computed(() => 
    this.employeeStore.error() || this.positionsStore.error()
  );

  // Computed: Show IDP section
  showIDP = computed(() => this.positionsStore.hasSelection());

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Load positions data (employee data is loaded at app startup)
    this.positionsStore.loadPositions();
  }

  selectPosition(positionId: string): void {
    this.positionsStore.selectPosition(positionId);
      
      // Scroll to IDP section after a short delay
      setTimeout(() => {
        document.getElementById('idp-connected')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
  }

  closeIDP(): void {
    this.positionsStore.clearSelection();
    
    // Scroll back to opportunities section
    document.getElementById('matching-opportunities')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scrollToQuestionnaire(): void {
    document.getElementById('matching-questionnaire')?.scrollIntoView({ behavior: 'smooth' });
  }

  // Helper to get job card border class based on category color
  getJobCardBorderClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      'primary': 'border-border-light hover:border-primary',
      'accent': 'border-border-light hover:border-accent',
      'secondary': 'border-border-light hover:border-secondary'
    };
    return colorMap[color] || colorMap['primary'];
  }

  // Helper to get category tag class
  getCategoryTagClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      'primary': 'bg-primary/10 text-primary border-primary/20',
      'accent': 'bg-accent/15 text-accent-dark border-accent/30',
      'secondary': 'bg-secondary-light/60 text-secondary border-secondary/30'
    };
    return colorMap[color] || colorMap['primary'];
  }

  // Helper to get progress circle color class
  getProgressColorClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      'primary': 'text-primary',
      'accent': 'text-accent-dark',
      'secondary': 'text-secondary'
    };
    return colorMap[color] || colorMap['primary'];
  }

  // Helper to get match level text color class
  getMatchTextClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      'primary': 'text-primary',
      'accent': 'text-accent-dark',
      'secondary': 'text-secondary'
    };
    return colorMap[color] || colorMap['primary'];
  }

  // Helper to get requirement dot color class
  getRequirementDotClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      'primary': 'text-primary-dark',
      'accent': 'text-accent-dark',
      'secondary': 'text-secondary'
    };
    return colorMap[color] || colorMap['primary'];
  }
}
