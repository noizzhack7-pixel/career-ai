import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { EmployeeStore } from '../../stores/employee.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  employeeStore = inject(EmployeeStore);

  // Computed signals for header display
  readonly avatar = computed(() => this.employeeStore.profile()?.avatar ?? '');
  readonly fullName = computed(() => this.employeeStore.profile()?.name ?? '');
  readonly title = computed(() => this.employeeStore.profile()?.title ?? '');
  readonly isLoaded = computed(() => !!this.employeeStore.profile());
}

