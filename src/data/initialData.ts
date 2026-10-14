import {
  User,
  StudentProfile,
  AlumniProfile,
  Question,
  Answer,
  Opportunity,
  ReviewRequest,
  NotificationItem
} from '../types';

export const BRANCHES = [
  'CSE',
  'AI & ML',
  'IT',
  'ECE/EEE',
  'Mechanical',
  'Civil',
  'MBA',
  'MCA',
  'Other'
];

export const BATCH_YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028];

export const MASTER_SKILLS = [
  'Python',
  'Java',
  'C++',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Spring Boot',
  'MySQL',
  'PostgreSQL',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'Machine Learning',
  'Deep Learning',
  'NLP',
  'DSA',
  'FastAPI',
  'Tableau',
  'Power BI',
  'Git',
  'Linux',
  'Tailwind CSS',
  'GraphQL',
  'Redis',
  'MongoDB'
];

export const QUESTION_CATEGORIES = [
  'All',
  'Placements',
  'DSA & Coding',
  'Career Advice',
  'Higher Studies',
  'Internships',
  'Startups & Projects'
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    email: 'admin@anurag.edu.in',
    role: 'admin',
    is_verified: true,
    is_active: true,
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'user_karthik',
    email: 'karthik.r@anurag.edu.in',
    role: 'alumni',
    is_verified: true,
    is_active: true,
    created_at: '2026-01-15T09:30:00Z'
  },
  {
    id: 'user_priya',
    email: 'priya.s@anurag.edu.in',
    role: 'alumni',
    is_verified: true,
    is_active: true,
    created_at: '2026-02-01T11:00:00Z'
  },
  {
    id: 'user_riya',
    email: 'riya.m@anurag.edu.in',
    role: 'student',
    is_verified: true,
    is_active: true,
    created_at: '2026-02-10T14:15:00Z'
  }
];

export const INITIAL_STUDENT_PROFILES: Record<string, StudentProfile> = {
  user_riya: {
    id: 'sp_riya',
    user_id: 'user_riya',
    name: 'Riya Mehta',
    phone: '+91 98490 12345',
    branch: 'CSE',
    batch_year: 2026,
    cgpa: 8.25,
    skills: ['Python', 'DSA', 'React', 'Machine Learning', 'SQL', 'Git'],
    bio: 'Pre-final year CSE student at Anurag University. Actively preparing for campus placements, competitive programming, and AI projects.',
    linkedin_url: 'https://linkedin.com/in/riya-mehta-au',
    github_url: 'https://github.com/riya-mehta',
    avatar_url: '',
    resume_url: 'riya_mehta_resume_2026.pdf',
    created_at: '2026-02-10T14:15:00Z',
    updated_at: '2026-03-01T10:00:00Z'
  }
};

export const INITIAL_ALUMNI_PROFILES: Record<string, AlumniProfile> = {
  user_karthik: {
    id: 'ap_karthik',
    user_id: 'user_karthik',
    name: 'Karthik Reddy',
    phone: '+91 94401 54321',
    branch: 'CSE',
    batch_year: 2022,
    current_company: 'Infosys',
    current_role: 'Software Development Engineer',
    experience_years: 3,
    skills: ['Java', 'Spring Boot', 'Python', 'React', 'SQL', 'AWS', 'DSA'],
    bio: 'Alumnus from 2022 B.Tech CSE batch. Working on enterprise microservices & cloud architectures at Infosys Hyderabad. Open to mentoring AU students and referral inquiries.',
    linkedin_url: 'https://linkedin.com/in/karthik-reddy-au',
    github_url: 'https://github.com/karthik-au-dev',
    avatar_url: '',
    is_mentor: true,
    created_at: '2026-01-15T09:30:00Z',
    updated_at: '2026-02-18T16:20:00Z'
  },
  user_priya: {
    id: 'ap_priya',
    user_id: 'user_priya',
    name: 'Priya Sharma',
    phone: '+91 91234 98765',
    branch: 'IT',
    batch_year: 2021,
    current_company: 'Tata Consultancy Services (TCS)',
    current_role: 'Lead Data Analyst',
    experience_years: 4,
    skills: ['SQL', 'Python', 'Power BI', 'Tableau', 'Machine Learning', 'Azure'],
    bio: '2021 IT graduate. Leading analytics pipelines and business intelligence at TCS Innovation Park. Happy to review project architectures and discuss analytics careers.',
    linkedin_url: 'https://linkedin.com/in/priya-sharma-tcs',
    github_url: 'https://github.com/priya-analytics',
    avatar_url: '',
    is_mentor: true,
    created_at: '2026-02-01T11:00:00Z',
    updated_at: '2026-02-24T12:00:00Z'
  }
};

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q_1',
    title: 'How do I crack Infosys SP (Specialist Programmer) for CSE 2026 batch?',
    body: 'I have an Infosys Specialist Programmer hiring drive scheduled next month on campus. Could alumni please guide on the exact problem types asked in the 3-question coding assessment (Hard DSA vs Graphs) and interview rounds?',
    tags: ['Placements', 'DSA', 'Infosys', 'Interview'],
    category: 'Placements',
    author_id: 'user_riya',
    author_name: 'Riya Mehta',
    author_role: 'student',
    author_branch: 'CSE',
    author_batch: 2026,
    view_count: 142,
    like_count: 24,
    is_resolved: true,
    is_active: true,
    created_at: '2026-03-01T10:30:00Z',
    answers_count: 2
  },
  {
    id: 'q_2',
    title: 'Essential DSA & Core CS topics for JPMC, Amazon & high-CTC campus drives',
    body: 'For students targeting 12+ LPA product companies visiting Anurag University: How much weightage is given to System Design (LLD/HLD) versus standard LeetCode Medium trees/graphs?',
    tags: ['Career Advice', 'DSA', 'Placements'],
    category: 'DSA & Coding',
    author_id: 'user_riya',
    author_name: 'Riya Mehta',
    author_role: 'student',
    author_branch: 'CSE',
    author_batch: 2026,
    view_count: 98,
    like_count: 18,
    is_resolved: false,
    is_active: true,
    created_at: '2026-03-05T14:10:00Z',
    answers_count: 1
  },
  {
    id: 'q_3',
    title: 'AI & ML Project Guidance: How to stand out beyond generic Titanic/MNIST datasets?',
    body: 'As a 3rd year student in AI & ML, recruiters often skip over standard Kaggle baseline projects. What are production-grade architectures or real-world problem statements that grab an engineering manager\'s attention?',
    tags: ['AI & ML', 'Projects', 'Resume'],
    category: 'Startups & Projects',
    author_id: 'user_student_2',
    author_name: 'Arjun Varma',
    author_role: 'student',
    author_branch: 'AI & ML',
    author_batch: 2026,
    view_count: 76,
    like_count: 15,
    is_resolved: false,
    is_active: true,
    created_at: '2026-03-08T09:20:00Z',
    answers_count: 1
  }
];

export const INITIAL_ANSWERS: Answer[] = [
  {
    id: 'ans_1',
    question_id: 'q_1',
    author_id: 'user_karthik',
    author_name: 'Karthik Reddy',
    author_role: 'alumni',
    author_company: 'Infosys (SDE)',
    body: 'Hey Riya! As someone who cleared SP from Anurag in 2022: \n\n1. **Coding Round (3 Problems, 3 Hours)**: Expect 1 greedy/sliding window, 1 DP with bitmasking or memoization, and 1 Graph (Dijkstra or Topological sort). You must pass all hidden testcases on at least 2 full problems to get the SP interview shortlist (₹9.5 LPA bracket).\n2. **Interview Round**: They will ask you to explain your written code step-by-step and optimize edge conditions. Brush up OS (Processes vs Threads, Deadlocks) and DBMS normalization.\n\nAll the best, feel free to submit your resume for review here if you want me to look over it!',
    upvotes: 19,
    is_accepted: true,
    created_at: '2026-03-01T12:00:00Z'
  },
  {
    id: 'ans_2',
    question_id: 'q_1',
    author_id: 'user_priya',
    author_name: 'Priya Sharma',
    author_role: 'alumni',
    author_company: 'TCS (Lead Analyst)',
    body: 'Adding to Karthik\'s point: practice on HackerEarth or LeetCode with strict time constraints. Make sure your verbal communication while walking through algorithmic complexity (Big-O) is crisp.',
    upvotes: 7,
    is_accepted: false,
    created_at: '2026-03-02T08:15:00Z'
  },
  {
    id: 'ans_3',
    question_id: 'q_2',
    author_id: 'user_karthik',
    author_name: 'Karthik Reddy',
    author_role: 'alumni',
    author_company: 'Infosys (SDE)',
    body: 'For campus freshers, HLD is rarely asked in detail; focus heavily on Object-Oriented Design (LLD principles: SOLID, Factory/Observer patterns) and strong DSA fundamentals (Trees, HashMaps, Two Pointers, BFS/DFS).',
    upvotes: 11,
    is_accepted: false,
    created_at: '2026-03-05T16:45:00Z'
  },
  {
    id: 'ans_4',
    question_id: 'q_3',
    author_id: 'user_priya',
    author_name: 'Priya Sharma',
    author_role: 'alumni',
    author_company: 'TCS (Lead Analyst)',
    body: 'Build end-to-end deployed systems! For example, build a RAG pipeline for Telugu/English document search or a smart campus parking detector with FastAPI backend and live dashboard. Include measurable latency and accuracy metrics in your bullet points.',
    upvotes: 8,
    is_accepted: false,
    created_at: '2026-03-08T11:00:00Z'
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp_1',
    title: 'Software Engineer Intern (SP & DSE)',
    company: 'Infosys',
    type: 'internship',
    location: 'Hyderabad (Gachibowli campus)',
    is_remote: false,
    description: 'Infosys is seeking dynamic engineering interns for the Special Programs engineering track. You will collaborate on modern cloud applications, microservices, and client delivery pods.',
    requirements: 'Solid knowledge of Java, Python, or C++. Strong understanding of Data Structures and Relational Databases. Problem solving mindset.',
    skills_required: ['Java', 'Python', 'SQL', 'DSA', 'Spring Boot'],
    salary_min: 25000,
    salary_max: 30000,
    eligible_branches: ['CSE', 'AI & ML', 'IT', 'ECE/EEE'],
    eligible_batches: [2026, 2027],
    min_cgpa: 7.0,
    deadline: '2026-06-30',
    apply_link: 'https://career.infosys.com/jobdesc?jobId=AU_SE_2026',
    is_referral_available: true,
    is_active: true,
    posted_by: 'user_karthik',
    posted_by_name: 'Karthik Reddy',
    posted_by_role: 'Software Development Engineer',
    posted_by_company: 'Infosys',
    posted_by_batch: 2022,
    created_at: '2026-03-02T11:00:00Z'
  },
  {
    id: 'opp_2',
    title: 'Associate Data & Analytics Engineer',
    company: 'Tata Consultancy Services (TCS)',
    type: 'full-time',
    location: 'Hyderabad / Bengaluru',
    is_remote: false,
    description: 'Full-time entry level opportunity for graduating engineering students in TCS Digital & Analytics business unit. Involves ETL design, data quality engineering, and client dashboards.',
    requirements: 'B.Tech/BE in CSE, IT, or AI&ML. Familiarity with SQL queries, data warehousing concepts, and Python or Java scripting.',
    skills_required: ['SQL', 'Python', 'Power BI', 'Tableau', 'Azure'],
    salary_min: 700000,
    salary_max: 850000,
    eligible_branches: ['CSE', 'AI & ML', 'IT', 'MCA'],
    eligible_batches: [2025, 2026],
    min_cgpa: 7.5,
    deadline: '2026-05-15',
    apply_link: 'https://ibegin.tcs.com/iBegin/jobs/entry-level-analytics',
    is_referral_available: true,
    is_active: true,
    posted_by: 'user_priya',
    posted_by_name: 'Priya Sharma',
    posted_by_role: 'Lead Data Analyst',
    posted_by_company: 'TCS',
    posted_by_batch: 2021,
    created_at: '2026-03-04T15:20:00Z'
  },
  {
    id: 'opp_3',
    title: 'Cloud Operations & Support Engineer',
    company: 'Microsoft Partner Solutions',
    type: 'full-time',
    location: 'Hyderabad (Hitec City)',
    is_remote: true,
    description: 'Work with enterprise customers migrating on-premise infrastructure into Azure cloud environments. Automation scripting, CI/CD pipelines, and infrastructure health monitoring.',
    requirements: 'Strong fundamentals in Operating Systems, Networking (TCP/IP, DNS), Linux CLI, and cloud basics (Azure/AWS certification is a plus).',
    skills_required: ['Linux', 'Azure', 'Python', 'Docker', 'Networking'],
    salary_min: 900000,
    salary_max: 1200000,
    eligible_branches: ['CSE', 'AI & ML', 'IT', 'ECE/EEE'],
    eligible_batches: [2025, 2026],
    min_cgpa: 8.0,
    deadline: '2026-04-30',
    apply_link: 'https://careers.microsoft.com/professionals/us/en/job/1749210/Cloud-Operations',
    is_referral_available: false,
    is_active: true,
    posted_by: 'user_admin',
    posted_by_name: 'Alumni Placement Cell',
    posted_by_role: 'University Liaison',
    posted_by_company: 'Anurag University CDC',
    posted_by_batch: 2020,
    created_at: '2026-03-07T08:00:00Z'
  }
];

export const INITIAL_REVIEWS: ReviewRequest[] = [
  {
    id: 'rev_1',
    student_id: 'user_riya',
    student_name: 'Riya Mehta',
    student_branch: 'CSE',
    student_batch: 2026,
    reviewer_id: 'user_karthik',
    reviewer_name: 'Karthik Reddy',
    reviewer_company: 'Infosys',
    type: 'resume',
    status: 'in_review',
    message: 'Hello Karthik anna! Could you please review my resume formatting and project descriptions for upcoming SDE interviews? Would appreciate tips on improving the ATS score.',
    resume_url: 'riya_mehta_sde_resume.pdf',
    resume_name: 'Riya_Mehta_SDE_Resume_AU.pdf',
    created_at: '2026-03-06T11:00:00Z',
    claimed_at: '2026-03-07T09:15:00Z'
  },
  {
    id: 'rev_2',
    student_id: 'user_student_2',
    student_name: 'Arjun Varma',
    student_branch: 'AI & ML',
    student_batch: 2026,
    reviewer_id: 'user_karthik',
    reviewer_name: 'Karthik Reddy',
    reviewer_company: 'Infosys',
    type: 'project',
    status: 'completed',
    message: 'Requesting review of my college capstone: Distributed Campus Query Routing with Spring Boot & Redis cache.',
    project_title: 'AU Campus Query Dispatcher',
    project_url: 'https://github.com/arjun-varma/au-query-dispatcher',
    project_tech: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Docker'],
    project_description: 'A microservice-based backend that ingests student academic queries and routes them to suitable faculty based on availability tags.',
    created_at: '2026-02-20T10:00:00Z',
    claimed_at: '2026-02-21T14:00:00Z',
    completed_at: '2026-02-23T18:00:00Z',
    feedback: {
      id: 'fb_1',
      request_id: 'rev_2',
      reviewer_id: 'user_karthik',
      reviewer_name: 'Karthik Reddy',
      reviewer_company: 'Infosys',
      reviewer_role: 'SDE',
      rating: 5,
      feedback: 'Excellent architectural depth for a 3rd year project! Your use of Redis for caching frequently requested department FAQs reduces DB latency noticeably. The code structure conforms well to Clean Architecture.',
      strengths: [
        'Clear separation of Controller, Service, and Repository layers in Spring Boot',
        'Docker-compose file includes healthy healthchecks',
        'README has clear local setup steps and Swagger UI documentation'
      ],
      improvements: [
        'Add integration tests using Testcontainers or mockMvc',
        'Consider rate-limiting query submissions to prevent spam',
        'Quantify throughput benchmarks in the GitHub README'
      ],
      created_at: '2026-02-23T18:00:00Z'
    }
  },
  {
    id: 'rev_3',
    student_id: 'user_student_3',
    student_name: 'Sneha Goud',
    student_branch: 'IT',
    student_batch: 2025,
    type: 'both',
    status: 'pending',
    message: 'Final year student looking for feedback on both my full-stack portfolio resume and my MERN + Machine Learning sentiment analytics portal before off-campus applications.',
    resume_url: 'sneha_goud_resume.pdf',
    resume_name: 'Sneha_Goud_Resume_2025.pdf',
    project_title: 'Telangana Transit Live Bus Tracker',
    project_url: 'https://github.com/sneha-au/transit-live-tracker',
    project_tech: ['React', 'Node.js', 'PostgreSQL', 'Mapbox GL'],
    project_description: 'Real-time telemetry and schedule predictor for regional bus routes with crowdsourced updates.',
    created_at: '2026-03-09T16:30:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    user_id: 'user_riya',
    title: 'New Answer on Your Question',
    message: 'Karthik Reddy (Infosys) answered your question: "How do I crack Infosys SP for CSE 2026 batch?"',
    type: 'answer',
    link: 'questions',
    is_read: false,
    created_at: '2026-03-01T12:00:00Z'
  },
  {
    id: 'notif_2',
    user_id: 'user_riya',
    title: 'Review Request Claimed',
    message: 'Karthik Reddy has claimed your resume review request and is currently evaluating it.',
    type: 'review',
    link: 'reviews',
    is_read: false,
    created_at: '2026-03-07T09:15:00Z'
  },
  {
    id: 'notif_3',
    user_id: 'user_karthik',
    title: 'New Review in Open Pool',
    message: 'Sneha Goud (IT 2025) submitted a new Resume & Project review request.',
    type: 'review',
    link: 'reviews',
    is_read: false,
    created_at: '2026-03-09T16:30:00Z'
  }
];
