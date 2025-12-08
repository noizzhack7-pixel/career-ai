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
  email?: string;
  phone?: string;
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

// Extended skill with level
export interface SkillWithLevel {
  name: string;
  level: number; // 1-5
  label?: string; // e.g., "מומחה", "מתקדם", "בסיסי"
}

// Education item for profile
export interface EducationItem {
  id: string;
  title: string;
  institution: string;
  year_start?: string;
  year_end?: string;
  type: 'degree' | 'certification' | 'course';
  description?: string;
}

// Work experience item
export interface ExperienceItem {
  id: string;
  title: string;
  department: string;
  division?: string;
  start_date: string;
  end_date?: string; // null means current
  is_current: boolean;
  description: string;
  achievements: string[];
}

// Recommendation from colleague/manager
export interface Recommendation {
  id: string;
  author_name: string;
  author_title: string;
  author_avatar: string;
  relationship: 'manager' | 'colleague' | 'mentee';
  date: string;
  rating: number; // 1-5
  content: string;
  skills_mentioned: string[];
}

// Wishlist item types
export interface WishlistItem {
  id: string;
  type: 'text' | 'role' | 'keywords';
  created_at: string;
  has_alert: boolean;
  // For text type
  content?: string;
  // For role type
  role_title?: string;
  role_department?: string;
  role_status?: 'open' | 'closed';
  // For keywords type
  keywords?: string[];
}

// Career preferences
export interface CareerPreferences {
  career_path: 'management' | 'professional';
  role_types: string[];
  interests: string[];
  locations: string[];
}

// Language proficiency
export interface Language {
  name: string;
  level: 'native' | 'fluent' | 'intermediate' | 'basic';
}

// Target role for career goal
export interface TargetRole {
  title: string;
  division: string;
  match_percentage: number;
  required_skills_met: number;
  required_skills_total: number;
  gaps_count: number;
  estimated_months: number;
}

// Notification item
export interface NotificationItem {
  id: string;
  type: 'job_match' | 'idp_update' | 'recommendation' | 'general';
  title: string;
  message: string;
  timestamp: string;
}

// Extended profile for profile page
export interface ExtendedProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  cover_image: string;
  is_active: boolean;
  organization: Organization;
  details: UserDetails;
  metrics: UserMetrics;
  education: Education;
  specialization: Specialization;
  // Basic skills (names only)
  soft_skills: string[];
  hard_skills: string[];
  // Extended profile data
  bio?: string;
  professional_interests?: string[];
  soft_skills_detailed?: SkillWithLevel[];
  hard_skills_detailed?: SkillWithLevel[];
  education_items?: EducationItem[];
  experience?: ExperienceItem[];
  recommendations?: Recommendation[];
  wishlist?: WishlistItem[];
  career_preferences?: CareerPreferences;
  languages?: Language[];
  target_role?: TargetRole;
  notifications?: NotificationItem[];
  idp?: {
    progress: IDPProgress;
  };
}

// Basic profile (used on home page)
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
