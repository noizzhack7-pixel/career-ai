// Position-related interfaces

export interface PositionRequirement {
  skill: string;
  status: 'יש' | 'חסר' | string;
  note?: string;
}

export interface SkillMatch {
  name: string;
  matched: boolean;
  gap?: string;
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
  responsibilities?: string[];
  posted_time?: string;
  is_open?: boolean;
  hard_skills_match?: SkillMatch[];
  soft_skills_match?: SkillMatch[];
  experience_match?: SkillMatch[];
  match_summary?: string;
}

export interface PositionsState {
  positions: Position[];
  selectedPosition: Position | null;
  isLoading: boolean;
  error: string | null;
}

export interface PositionFilters {
  search: string;
  category: string;
  location: string;
  grade: string;
  showOpenOnly: boolean;
}
