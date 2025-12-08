// Position-related interfaces

export interface PositionRequirement {
  skill: string;
  status: string;
}

export interface Position {
  id: string;
  title: string;
  category: string;
  category_icon: string;
  category_color: string;
  match_percentage: number;
  match_level: string;
  division: string;
  location: string;
  work_model: string;
  description: string;
  requirements: PositionRequirement[];
}

export interface PositionsState {
  positions: Position[];
  selectedPosition: Position | null;
  isLoading: boolean;
  error: string | null;
}


