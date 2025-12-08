import { Injectable, inject, signal, computed } from '@angular/core';
import { ApiService } from '../services';
import { Position } from './models';

@Injectable({ providedIn: 'root' })
export class PositionsStore {
  private api = inject(ApiService);

  // State signals
  private _positions = signal<Position[]>([]);
  private _selectedPosition = signal<Position | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly positions = this._positions.asReadonly();
  readonly selectedPosition = this._selectedPosition.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals
  readonly positionsCount = computed(() => this._positions().length);
  readonly hasSelection = computed(() => this._selectedPosition() !== null);
  readonly selectedPositionId = computed(() => this._selectedPosition()?.id ?? null);
  readonly selectedPositionTitle = computed(() => this._selectedPosition()?.title ?? '');
  readonly selectedPositionMatch = computed(() => this._selectedPosition()?.match_percentage ?? 0);
  
  readonly positionsByCategory = computed(() => {
    const positions = this._positions();
    return positions.reduce((acc, position) => {
      const category = position.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(position);
      return acc;
    }, {} as Record<string, Position[]>);
  });

  readonly highMatchPositions = computed(() =>
    this._positions().filter(p => p.match_percentage >= 80)
  );

  readonly isPositionsLoaded = computed(() => this._positions().length > 0);

  // Load matching positions for current user
  loadPositions(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.api.get<Position[]>(ApiService.ENDPOINTS.POSITIONS.MATCHING).subscribe({
      next: (positions) => {
        this._positions.set(positions);
        this._isLoading.set(false);
      },
      error: (error) => {
        this._error.set('שגיאה בטעינת המשרות');
        this._isLoading.set(false);
        console.error('Error loading positions:', error);
      },
    });
  }

  // Load a specific matching position
  loadPosition(positionId: string): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.api.get<Position>(ApiService.ENDPOINTS.POSITIONS.MATCHING_BY_ID(positionId)).subscribe({
      next: (position) => {
        this._selectedPosition.set(position);
        this._isLoading.set(false);
      },
      error: (error) => {
        this._error.set('שגיאה בטעינת המשרה');
        this._isLoading.set(false);
        console.error('Error loading position:', error);
      },
    });
  }

  // Select a position by ID (from already loaded positions)
  selectPosition(positionId: string): void {
    const position = this._positions().find(p => p.id === positionId);
    if (position) {
      this._selectedPosition.set(position);
    }
  }

  // Clear selection
  clearSelection(): void {
    this._selectedPosition.set(null);
  }

  // Get position by ID (from already loaded positions)
  getPositionById(positionId: string): Position | undefined {
    return this._positions().find(p => p.id === positionId);
  }

  // Clear error
  clearError(): void {
    this._error.set(null);
  }

  // Reset store
  reset(): void {
    this._positions.set([]);
    this._selectedPosition.set(null);
    this._isLoading.set(false);
    this._error.set(null);
  }
}
