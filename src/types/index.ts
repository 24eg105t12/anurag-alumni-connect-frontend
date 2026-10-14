export type UserRole = 'student' | 'alumni' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  name: string;
  phone?: string;
  branch: string;
  batch_year: number;
  cgpa?: number;
  skills: string[];
  bio?: string;
  linkedin_url?: string;
  github_url?: string;
  avatar_url?: string;
  resume_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AlumniProfile {
  id: string;
  user_id: string;
  name: string;
  phone?: string;
  branch: string;
  batch_year: number;
  current_company: string;
  current_role: string;
  experience_years?: number;
  skills: string[];
  bio?: string;
  linkedin_url?: string;
  github_url?: string;
  avatar_url?: string;
  is_mentor: boolean;
  created_at: string;
  updated_at: string;
}

export interface CurrentUser {
  user: User;
  profile: StudentProfile | AlumniProfile | { name: string; email: string };
  name: string;
}

export interface Question {
  id: string;
  title: string;
  body: string;
  tags: string[];
  category: string;
  author_id: string;
  author_name: string;
  author_role: UserRole;
  author_branch?: string;
  author_batch?: number;
  author_company?: string;
  author_avatar?: string;
  view_count: number;
  like_count: number;
  is_resolved: boolean;
  is_active: boolean;
  created_at: string;
  answers_count: number;
}

export interface Answer {
  id: string;
  question_id: string;
  author_id: string;
  author_name: string;
  author_role: UserRole;
  author_company?: string;
  author_avatar?: string;
  body: string;
  upvotes: number;
  is_accepted: boolean;
  created_at: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: 'internship' | 'full-time' | 'contract' | 'freelance';
  location: string;
  is_remote: boolean;
  description: string;
  requirements?: string;
  skills_required: string[];
  salary_min?: number;
  salary_max?: number;
  eligible_branches: string[];
  eligible_batches?: number[];
  min_cgpa?: number;
  deadline?: string;
  apply_link: string;
  is_referral_available: boolean;
  is_active: boolean;
  posted_by: string;
  posted_by_name: string;
  posted_by_role?: string;
  posted_by_company?: string;
  posted_by_batch?: number;
  created_at: string;
}

export type ReviewType = 'resume' | 'project' | 'both';
export type ReviewStatus = 'pending' | 'in_review' | 'completed';

export interface ReviewFeedback {
  id: string;
  request_id: string;
  reviewer_id: string;
  reviewer_name: string;
  reviewer_company?: string;
  reviewer_role?: string;
  rating: number; // 1 - 5
  feedback: string;
  strengths?: string[];
  improvements?: string[];
  created_at: string;
}

export interface ReviewRequest {
  id: string;
  student_id: string;
  student_name: string;
  student_branch: string;
  student_batch: number;
  student_avatar?: string;
  reviewer_id?: string;
  reviewer_name?: string;
  reviewer_company?: string;
  type: ReviewType;
  status: ReviewStatus;
  message?: string;
  resume_url?: string;
  resume_name?: string;
  project_title?: string;
  project_url?: string;
  project_tech?: string[];
  project_description?: string;
  created_at: string;
  claimed_at?: string;
  completed_at?: string;
  feedback?: ReviewFeedback;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'question' | 'answer' | 'opportunity' | 'review' | 'system';
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface ParsedResumeResult {
  name: string;
  email: string;
  phone: string;
  branch: string;
  batch_year: number;
  cgpa: number;
  skills: string[];
  bio: string;
  linkedin_url: string;
  github_url: string;
  projects: Array<{ title: string; tech: string; description: string }>;
  confidence: {
    name: number;
    email: number;
    phone: number;
    branch: number;
    batch_year: number;
    cgpa: number;
    skills: number;
  };
}
