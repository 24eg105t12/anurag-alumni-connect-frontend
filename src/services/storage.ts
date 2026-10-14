import {
  User,
  StudentProfile,
  AlumniProfile,
  CurrentUser,
  Question,
  Answer,
  Opportunity,
  ReviewRequest,
  ReviewFeedback,
  NotificationItem,
  ParsedResumeResult,
  ReviewType
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_STUDENT_PROFILES,
  INITIAL_ALUMNI_PROFILES,
  INITIAL_QUESTIONS,
  INITIAL_ANSWERS,
  INITIAL_OPPORTUNITIES,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  MASTER_SKILLS
} from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'aac_users',
  STUDENT_PROFILES: 'aac_student_profiles',
  ALUMNI_PROFILES: 'aac_alumni_profiles',
  QUESTIONS: 'aac_questions',
  ANSWERS: 'aac_answers',
  LIKED_QUESTIONS: 'aac_liked_questions',
  OPPORTUNITIES: 'aac_opportunities',
  REVIEWS: 'aac_reviews',
  NOTIFICATIONS: 'aac_notifications',
  CURRENT_USER_ID: 'aac_current_user_id'
};

function getStorage<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultVal;
  }
}

function setStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

// Initialize seed data if not present
export function initDatabase() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILES)) {
    setStorage(STORAGE_KEYS.STUDENT_PROFILES, INITIAL_STUDENT_PROFILES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ALUMNI_PROFILES)) {
    setStorage(STORAGE_KEYS.ALUMNI_PROFILES, INITIAL_ALUMNI_PROFILES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
    setStorage(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANSWERS)) {
    setStorage(STORAGE_KEYS.ANSWERS, INITIAL_ANSWERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES)) {
    setStorage(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    setStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    setStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
    // Default to Riya Mehta (Student)
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user_riya');
  }
}

// User / Auth
export function getCurrentUser(): CurrentUser {
  initDatabase();
  const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user_riya';
  const users = getStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  const user = users.find(u => u.id === userId) || users[3]; // default Riya

  let profile: any = { name: 'Anurag Member', email: user.email };
  if (user.role === 'student') {
    const studentProfiles = getStorage<Record<string, StudentProfile>>(STORAGE_KEYS.STUDENT_PROFILES, INITIAL_STUDENT_PROFILES);
    profile = studentProfiles[user.id] || {
      id: `sp_${user.id}`,
      user_id: user.id,
      name: user.email.split('@')[0],
      branch: 'CSE',
      batch_year: 2026,
      skills: ['Python', 'DSA'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } else if (user.role === 'alumni') {
    const alumniProfiles = getStorage<Record<string, AlumniProfile>>(STORAGE_KEYS.ALUMNI_PROFILES, INITIAL_ALUMNI_PROFILES);
    profile = alumniProfiles[user.id] || {
      id: `ap_${user.id}`,
      user_id: user.id,
      name: user.email.split('@')[0],
      branch: 'CSE',
      batch_year: 2022,
      current_company: 'Infosys',
      current_role: 'Software Engineer',
      skills: ['Java', 'SQL'],
      is_mentor: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } else {
    profile = {
      name: 'Prof. Dr. V. Rao',
      email: user.email,
      role: 'admin',
      department: 'University Placement & Alumni Cell'
    };
  }

  return {
    user,
    profile,
    name: profile.name || user.email.split('@')[0]
  };
}

export function switchUser(userId: string): CurrentUser {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  return getCurrentUser();
}

export function registerStudent(data: {
  name: string;
  email: string;
  phone?: string;
  branch: string;
  batch_year: number;
  cgpa?: number;
  skills: string[];
  bio?: string;
  linkedin_url?: string;
  github_url?: string;
  resume_url?: string;
}): CurrentUser {
  const users = getStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  const existing = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
  
  const userId = existing ? existing.id : `user_stu_${Date.now()}`;
  if (!existing) {
    const newUser: User = {
      id: userId,
      email: data.email,
      role: 'student',
      is_verified: true,
      is_active: true,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    setStorage(STORAGE_KEYS.USERS, users);
  }

  const studentProfiles = getStorage<Record<string, StudentProfile>>(STORAGE_KEYS.STUDENT_PROFILES, INITIAL_STUDENT_PROFILES);
  const newProfile: StudentProfile = {
    id: `sp_${userId}`,
    user_id: userId,
    name: data.name,
    phone: data.phone,
    branch: data.branch,
    batch_year: data.batch_year,
    cgpa: data.cgpa,
    skills: data.skills || [],
    bio: data.bio || '',
    linkedin_url: data.linkedin_url || '',
    github_url: data.github_url || '',
    resume_url: data.resume_url || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  studentProfiles[userId] = newProfile;
  setStorage(STORAGE_KEYS.STUDENT_PROFILES, studentProfiles);

  localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  return getCurrentUser();
}

export function registerAlumni(data: {
  name: string;
  email: string;
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
  is_mentor?: boolean;
}): CurrentUser {
  const users = getStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  const existing = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
  
  const userId = existing ? existing.id : `user_alm_${Date.now()}`;
  if (!existing) {
    const newUser: User = {
      id: userId,
      email: data.email,
      role: 'alumni',
      is_verified: true,
      is_active: true,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    setStorage(STORAGE_KEYS.USERS, users);
  }

  const alumniProfiles = getStorage<Record<string, AlumniProfile>>(STORAGE_KEYS.ALUMNI_PROFILES, INITIAL_ALUMNI_PROFILES);
  const newProfile: AlumniProfile = {
    id: `ap_${userId}`,
    user_id: userId,
    name: data.name,
    phone: data.phone,
    branch: data.branch,
    batch_year: data.batch_year,
    current_company: data.current_company,
    current_role: data.current_role,
    experience_years: data.experience_years || 0,
    skills: data.skills || [],
    bio: data.bio || '',
    linkedin_url: data.linkedin_url || '',
    github_url: data.github_url || '',
    is_mentor: data.is_mentor ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  alumniProfiles[userId] = newProfile;
  setStorage(STORAGE_KEYS.ALUMNI_PROFILES, alumniProfiles);

  localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  return getCurrentUser();
}

export function updateStudentProfile(userId: string, data: Partial<StudentProfile>): StudentProfile {
  const studentProfiles = getStorage<Record<string, StudentProfile>>(STORAGE_KEYS.STUDENT_PROFILES, INITIAL_STUDENT_PROFILES);
  const existing = studentProfiles[userId] || {
    id: `sp_${userId}`,
    user_id: userId,
    name: 'Student',
    branch: 'CSE',
    batch_year: 2026,
    skills: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const updated: StudentProfile = {
    ...existing,
    ...data,
    updated_at: new Date().toISOString()
  };
  studentProfiles[userId] = updated;
  setStorage(STORAGE_KEYS.STUDENT_PROFILES, studentProfiles);
  return updated;
}

export function updateAlumniProfile(userId: string, data: Partial<AlumniProfile>): AlumniProfile {
  const alumniProfiles = getStorage<Record<string, AlumniProfile>>(STORAGE_KEYS.ALUMNI_PROFILES, INITIAL_ALUMNI_PROFILES);
  const existing = alumniProfiles[userId] || {
    id: `ap_${userId}`,
    user_id: userId,
    name: 'Alumni',
    branch: 'CSE',
    batch_year: 2022,
    current_company: 'Tech',
    current_role: 'Engineer',
    skills: [],
    is_mentor: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const updated: AlumniProfile = {
    ...existing,
    ...data,
    updated_at: new Date().toISOString()
  };
  alumniProfiles[userId] = updated;
  setStorage(STORAGE_KEYS.ALUMNI_PROFILES, alumniProfiles);
  return updated;
}

// Questions & Answers
export function getQuestions(): Question[] {
  initDatabase();
  return getStorage<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
}

export function getQuestionById(id: string): { question: Question | undefined; answers: Answer[] } {
  const questions = getQuestions();
  const question = questions.find(q => q.id === id);
  if (question) {
    // Increment view count
    question.view_count += 1;
    setStorage(STORAGE_KEYS.QUESTIONS, questions);
  }
  const answers = getStorage<Answer[]>(STORAGE_KEYS.ANSWERS, INITIAL_ANSWERS).filter(a => a.question_id === id);
  return { question, answers };
}

export function createQuestion(title: string, body: string, tags: string[], category: string): Question {
  const currentUser = getCurrentUser();
  const questions = getQuestions();

  const newQuestion: Question = {
    id: `q_${Date.now()}`,
    title,
    body,
    tags: tags.length ? tags : ['General'],
    category: category || 'Placements',
    author_id: currentUser.user.id,
    author_name: currentUser.name,
    author_role: currentUser.user.role,
    author_branch: (currentUser.profile as any).branch,
    author_batch: (currentUser.profile as any).batch_year,
    author_company: (currentUser.profile as any).current_company,
    view_count: 1,
    like_count: 0,
    is_resolved: false,
    is_active: true,
    created_at: new Date().toISOString(),
    answers_count: 0
  };

  questions.unshift(newQuestion);
  setStorage(STORAGE_KEYS.QUESTIONS, questions);
  return newQuestion;
}

export function deleteQuestion(questionId: string): boolean {
  const currentUser = getCurrentUser();
  const questions = getQuestions();
  const target = questions.find(q => q.id === questionId);
  if (!target) return false;

  // Authorization check: author or admin
  if (target.author_id !== currentUser.user.id && currentUser.user.role !== 'admin') {
    throw new Error('Unauthorized to delete this question');
  }

  const filteredQuestions = questions.filter(q => q.id !== questionId);
  setStorage(STORAGE_KEYS.QUESTIONS, filteredQuestions);

  // Cascade delete answers
  const answers = getStorage<Answer[]>(STORAGE_KEYS.ANSWERS, INITIAL_ANSWERS).filter(a => a.question_id !== questionId);
  setStorage(STORAGE_KEYS.ANSWERS, answers);
  return true;
}

export function toggleLikeQuestion(questionId: string): { isLiked: boolean; count: number } {
  const currentUser = getCurrentUser();
  const likedKeys = getStorage<string[]>(STORAGE_KEYS.LIKED_QUESTIONS, []);
  const likeKey = `${currentUser.user.id}_${questionId}`;
  const isCurrentlyLiked = likedKeys.includes(likeKey);

  const questions = getQuestions();
  const q = questions.find(item => item.id === questionId);
  if (!q) return { isLiked: false, count: 0 };

  if (isCurrentlyLiked) {
    // Unlike
    const updatedLikes = likedKeys.filter(k => k !== likeKey);
    setStorage(STORAGE_KEYS.LIKED_QUESTIONS, updatedLikes);
    q.like_count = Math.max(0, q.like_count - 1);
    setStorage(STORAGE_KEYS.QUESTIONS, questions);
    return { isLiked: false, count: q.like_count };
  } else {
    // Like
    likedKeys.push(likeKey);
    setStorage(STORAGE_KEYS.LIKED_QUESTIONS, likedKeys);
    q.like_count += 1;
    setStorage(STORAGE_KEYS.QUESTIONS, questions);
    return { isLiked: true, count: q.like_count };
  }
}

export function isQuestionLikedByCurrentUser(questionId: string): boolean {
  const currentUser = getCurrentUser();
  const likedKeys = getStorage<string[]>(STORAGE_KEYS.LIKED_QUESTIONS, []);
  return likedKeys.includes(`${currentUser.user.id}_${questionId}`);
}

export function addAnswer(questionId: string, body: string): Answer {
  const currentUser = getCurrentUser();
  const answers = getStorage<Answer[]>(STORAGE_KEYS.ANSWERS, INITIAL_ANSWERS);

  const newAnswer: Answer = {
    id: `ans_${Date.now()}`,
    question_id: questionId,
    author_id: currentUser.user.id,
    author_name: currentUser.name,
    author_role: currentUser.user.role,
    author_company: (currentUser.profile as any).current_company,
    body,
    upvotes: 0,
    is_accepted: false,
    created_at: new Date().toISOString()
  };

  answers.push(newAnswer);
  setStorage(STORAGE_KEYS.ANSWERS, answers);

  // Update question answers count
  const questions = getQuestions();
  const q = questions.find(item => item.id === questionId);
  if (q) {
    q.answers_count = (q.answers_count || 0) + 1;
    setStorage(STORAGE_KEYS.QUESTIONS, questions);
  }

  return newAnswer;
}

export function markAnswerAccepted(questionId: string, answerId: string): void {
  const answers = getStorage<Answer[]>(STORAGE_KEYS.ANSWERS, INITIAL_ANSWERS);
  answers.forEach(a => {
    if (a.question_id === questionId) {
      a.is_accepted = a.id === answerId;
    }
  });
  setStorage(STORAGE_KEYS.ANSWERS, answers);

  const questions = getQuestions();
  const q = questions.find(item => item.id === questionId);
  if (q) {
    q.is_resolved = true;
    setStorage(STORAGE_KEYS.QUESTIONS, questions);
  }
}

// Opportunities
export function getOpportunities(): Opportunity[] {
  initDatabase();
  return getStorage<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
}

export function createOpportunity(data: Omit<Opportunity, 'id' | 'created_at' | 'posted_by' | 'posted_by_name'>): Opportunity {
  const currentUser = getCurrentUser();
  if (currentUser.user.role !== 'alumni' && currentUser.user.role !== 'admin') {
    throw new Error('Only verified alumni or admins can post opportunities');
  }

  const opportunities = getOpportunities();
  
  // Idempotent duplicate check: same title, company, within 5 minutes
  const duplicate = opportunities.find(
    o => o.title.toLowerCase() === data.title.toLowerCase() &&
         o.company.toLowerCase() === data.company.toLowerCase() &&
         o.posted_by === currentUser.user.id
  );
  if (duplicate) {
    return duplicate;
  }

  const newOpp: Opportunity = {
    ...data,
    id: `opp_${Date.now()}`,
    posted_by: currentUser.user.id,
    posted_by_name: currentUser.name,
    posted_by_role: (currentUser.profile as any).current_role,
    posted_by_company: (currentUser.profile as any).current_company,
    posted_by_batch: (currentUser.profile as any).batch_year,
    created_at: new Date().toISOString()
  };

  opportunities.unshift(newOpp);
  setStorage(STORAGE_KEYS.OPPORTUNITIES, opportunities);
  return newOpp;
}

export function deleteOpportunity(id: string): boolean {
  const currentUser = getCurrentUser();
  const opportunities = getOpportunities();
  const opp = opportunities.find(o => o.id === id);
  if (!opp) return false;

  if (opp.posted_by !== currentUser.user.id && currentUser.user.role !== 'admin') {
    throw new Error('Unauthorized to remove this opportunity');
  }

  const filtered = opportunities.filter(o => o.id !== id);
  setStorage(STORAGE_KEYS.OPPORTUNITIES, filtered);
  return true;
}

// Reviews
export function getReviews(): ReviewRequest[] {
  initDatabase();
  return getStorage<ReviewRequest[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
}

export function createReviewRequest(data: {
  type: ReviewType;
  message: string;
  resume_url?: string;
  resume_name?: string;
  project_title?: string;
  project_url?: string;
  project_tech?: string[];
  project_description?: string;
}): ReviewRequest {
  const currentUser = getCurrentUser();
  const reviews = getReviews();

  const newRev: ReviewRequest = {
    id: `rev_${Date.now()}`,
    student_id: currentUser.user.id,
    student_name: currentUser.name,
    student_branch: (currentUser.profile as any).branch || 'CSE',
    student_batch: (currentUser.profile as any).batch_year || 2026,
    type: data.type,
    status: 'pending',
    message: data.message,
    resume_url: data.resume_url,
    resume_name: data.resume_name,
    project_title: data.project_title,
    project_url: data.project_url,
    project_tech: data.project_tech,
    project_description: data.project_description,
    created_at: new Date().toISOString()
  };

  reviews.unshift(newRev);
  setStorage(STORAGE_KEYS.REVIEWS, reviews);
  return newRev;
}

export function claimReview(reviewId: string): ReviewRequest {
  const currentUser = getCurrentUser();
  if (currentUser.user.role !== 'alumni' && currentUser.user.role !== 'admin') {
    throw new Error('Only alumni or admins can claim reviews');
  }

  const reviews = getReviews();
  const target = reviews.find(r => r.id === reviewId);
  if (!target) throw new Error('Review request not found');

  if (target.status !== 'pending') {
    throw new Error('Review is already claimed or completed');
  }

  target.reviewer_id = currentUser.user.id;
  target.reviewer_name = currentUser.name;
  target.reviewer_company = (currentUser.profile as any).current_company || 'Alumni Mentor';
  target.status = 'in_review';
  target.claimed_at = new Date().toISOString();

  setStorage(STORAGE_KEYS.REVIEWS, reviews);
  return target;
}

export function submitFeedback(reviewId: string, data: {
  rating: number;
  feedback: string;
  strengths?: string[];
  improvements?: string[];
}): ReviewRequest {
  const currentUser = getCurrentUser();
  const reviews = getReviews();
  const target = reviews.find(r => r.id === reviewId);
  if (!target) throw new Error('Review request not found');

  if (target.reviewer_id !== currentUser.user.id && currentUser.user.role !== 'admin') {
    throw new Error('You are not the designated reviewer for this request');
  }

  const feedbackObj: ReviewFeedback = {
    id: `fb_${Date.now()}`,
    request_id: reviewId,
    reviewer_id: currentUser.user.id,
    reviewer_name: currentUser.name,
    reviewer_company: (currentUser.profile as any).current_company,
    reviewer_role: (currentUser.profile as any).current_role,
    rating: data.rating,
    feedback: data.feedback,
    strengths: data.strengths || [],
    improvements: data.improvements || [],
    created_at: new Date().toISOString()
  };

  target.status = 'completed';
  target.completed_at = new Date().toISOString();
  target.feedback = feedbackObj;

  setStorage(STORAGE_KEYS.REVIEWS, reviews);
  return target;
}

// Alumni Directory
export function getAlumniDirectory(): AlumniProfile[] {
  initDatabase();
  const alumniProfiles = getStorage<Record<string, AlumniProfile>>(STORAGE_KEYS.ALUMNI_PROFILES, INITIAL_ALUMNI_PROFILES);
  return Object.values(alumniProfiles);
}

// Notifications
export function getNotifications(): NotificationItem[] {
  initDatabase();
  const currentUser = getCurrentUser();
  const allNotifs = getStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  return allNotifs.filter(n => n.user_id === currentUser.user.id);
}

export function markAllNotificationsRead(): void {
  const currentUser = getCurrentUser();
  const allNotifs = getStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  allNotifs.forEach(n => {
    if (n.user_id === currentUser.user.id) {
      n.is_read = true;
    }
  });
  setStorage(STORAGE_KEYS.NOTIFICATIONS, allNotifs);
}

// Admin stats and management
export function getAdminStats() {
  const users = getStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  const questions = getQuestions();
  const opportunities = getOpportunities();
  const reviews = getReviews();

  return {
    totalUsers: users.length,
    studentsCount: users.filter(u => u.role === 'student').length,
    alumniCount: users.filter(u => u.role === 'alumni').length,
    questionsCount: questions.length,
    opportunitiesCount: opportunities.length,
    pendingReviews: reviews.filter(r => r.status === 'pending').length,
    completedReviews: reviews.filter(r => r.status === 'completed').length,
    users
  };
}

export function toggleUserVerified(userId: string): boolean {
  const users = getStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  const target = users.find(u => u.id === userId);
  if (!target) return false;
  target.is_verified = !target.is_verified;
  setStorage(STORAGE_KEYS.USERS, users);
  return target.is_verified;
}

export function toggleUserActive(userId: string): boolean {
  const users = getStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  const target = users.find(u => u.id === userId);
  if (!target) return false;
  target.is_active = !target.is_active;
  setStorage(STORAGE_KEYS.USERS, users);
  return target.is_active;
}

// Intelligent Resume Parser (Client-side heuristic engine)
export function parseResumeSimulation(fileName: string, sampleText: string): ParsedResumeResult {
  const lower = sampleText.toLowerCase();

  // Name extraction heuristics
  const lines = sampleText.split('\n').map(l => l.trim()).filter(Boolean);
  let detectedName = 'Student Applicant';
  for (const line of lines.slice(0, 4)) {
    if (/^[A-Za-z\s.]{3,40}$/.test(line) && line.split(' ').length >= 2) {
      detectedName = line;
      break;
    }
  }

  // Email extraction
  const emailMatch = sampleText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const detectedEmail = emailMatch ? emailMatch[0].toLowerCase() : 'student@anurag.edu.in';

  // Phone extraction (Indian formats)
  const phoneMatch = sampleText.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
  const detectedPhone = phoneMatch ? phoneMatch[0] : '+91 98490 54321';

  // CGPA extraction
  let detectedCgpa = 8.2;
  const cgpaMatch = sampleText.match(/(?:CGPA|GPA|SGPA)[:\s]+(\d+\.?\d*)\s*(?:\/\s*10|\/\s*4\.0)?/i);
  if (cgpaMatch) {
    const val = parseFloat(cgpaMatch[1]);
    if (val <= 4.0 && val > 0) detectedCgpa = parseFloat((val * 2.5).toFixed(2));
    else if (val <= 10.0 && val > 0) detectedCgpa = parseFloat(val.toFixed(2));
  } else {
    // Percentage check
    const pctMatch = sampleText.match(/(\d{2,3}(?:\.\d+)?)\s*%/);
    if (pctMatch) {
      const pct = parseFloat(pctMatch[1]);
      if (pct > 50 && pct <= 100) detectedCgpa = parseFloat((pct / 9.5).toFixed(2));
    }
  }

  // Branch extraction
  let detectedBranch = 'CSE';
  if (/artificial intelligence|ai\s*&\s*ml|aiml|machine learning/i.test(lower)) {
    detectedBranch = 'AI & ML';
  } else if (/information technology|\bit\b/i.test(lower)) {
    detectedBranch = 'IT';
  } else if (/electronics|ece|eee/i.test(lower)) {
    detectedBranch = 'ECE/EEE';
  } else if (/mechanical/i.test(lower)) {
    detectedBranch = 'Mechanical';
  } else if (/civil/i.test(lower)) {
    detectedBranch = 'Civil';
  } else if (/mba/i.test(lower)) {
    detectedBranch = 'MBA';
  } else if (/mca/i.test(lower)) {
    detectedBranch = 'MCA';
  }

  // Batch year extraction
  let detectedBatch = 2026;
  const batchMatch = sampleText.match(/(?:batch|graduation|class of|202[0-9]|203[0-2])/i);
  const yearMatch = sampleText.match(/202[2-9]|203[0-2]/);
  if (yearMatch) {
    detectedBatch = parseInt(yearMatch[0], 10);
  }

  // Skills matching
  const detectedSkills: string[] = [];
  MASTER_SKILLS.forEach(skill => {
    if (lower.includes(skill.toLowerCase())) {
      detectedSkills.push(skill);
    }
  });
  if (detectedSkills.length === 0) {
    detectedSkills.push('Python', 'Java', 'SQL', 'DSA');
  }

  // Projects heuristics
  const projects = [
    {
      title: 'Smart Campus Event Registry',
      tech: 'React, Node.js, SQL',
      description: 'Engineered a real-time event booking and QR attendance system for university hackathons.'
    },
    {
      title: 'Multimodal Disease Classifier',
      tech: 'Python, PyTorch, FastAPI',
      description: 'Implemented CNN visual diagnosis with 92% validation accuracy on clinical imaging benchmarks.'
    }
  ];

  return {
    name: detectedName,
    email: detectedEmail,
    phone: detectedPhone,
    branch: detectedBranch,
    batch_year: detectedBatch,
    cgpa: detectedCgpa,
    skills: detectedSkills.slice(0, 8),
    bio: `Enthusiastic ${detectedBranch} engineering student at Anurag University with hands-on expertise in ${detectedSkills.slice(0, 3).join(', ')}.`,
    linkedin_url: `https://linkedin.com/in/${detectedName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    github_url: `https://github.com/${detectedName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    projects,
    confidence: {
      name: detectedName !== 'Student Applicant' ? 0.92 : 0.65,
      email: emailMatch ? 0.98 : 0.6,
      phone: phoneMatch ? 0.95 : 0.7,
      branch: 0.88,
      batch_year: yearMatch ? 0.9 : 0.75,
      cgpa: cgpaMatch ? 0.94 : 0.82,
      skills: detectedSkills.length > 2 ? 0.91 : 0.7
    }
  };
}
