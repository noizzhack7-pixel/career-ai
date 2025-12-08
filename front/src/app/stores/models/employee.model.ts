// Employee-related interfaces

export interface Organization {
  division: string;
  department: string;
  team: string;
}

export interface UserDetails {
  seniority: string;
  grade: string;
  manager: string;
  location: string;
}

export interface UserMetrics {
  kudos: number;
  data_quality: number;
  matching_jobs_count: number;
}

export interface Education {
  degree: string;
  institution: string;
}

export interface Specialization {
  main: string;
  area: string;
}

export interface IDPProgress {
  overall: number;
  gaps_remaining: number;
  gaps_total: number;
  tasks_completed: number;
  tasks_total: number;
  estimated_months: number;
}

export interface IDPTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date?: string;
}

export interface EmployeeProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  cover_image: string;
  organization: Organization;
  details: UserDetails;
  metrics: UserMetrics;
  education: Education;
  specialization: Specialization;
  soft_skills: string[];
  hard_skills: string[];
}

export interface EmployeeIDP {
  progress: IDPProgress;
  tasks: IDPTask[];
}

export interface EmployeeState {
  profile: EmployeeProfile | null;
  idp: EmployeeIDP | null;
  isLoading: boolean;
  error: string | null;
}


