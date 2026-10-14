import React, { useState } from 'react';
import {
  X,
  FileText,
  Upload,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { CurrentUser } from '../../types';
import { BRANCHES, BATCH_YEARS, MASTER_SKILLS } from '../../data/initialData';
import {
  registerStudent,
  registerAlumni,
  parseResumeSimulation,
  switchUser
} from '../../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'register_student' | 'register_alumni';
  onAuthenticated: (user: CurrentUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  onAuthenticated
}) => {
  const [mode, setMode] = useState<'login' | 'register_student' | 'register_alumni'>(initialMode);
  
  // Student registration method: manual vs resume
  const [studentRegMethod, setStudentRegMethod] = useState<'manual' | 'resume'>('manual');
  const [resumeStep, setResumeStep] = useState<'upload' | 'parsing' | 'confirm'>('upload');
  const [parsingMessage, setParsingMessage] = useState('Extracting resume text...');

  // Common Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [batchYear, setBatchYear] = useState<number>(2026);
  const [cgpa, setCgpa] = useState<number>(8.2);
  const [skills, setSkills] = useState<string[]>(['Python', 'React', 'SQL']);
  const [newSkillText, setNewSkillText] = useState('');
  const [bio, setBio] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');

  // Alumni specific
  const [company, setCompany] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [expYears, setExpYears] = useState<number>(2);

  // Resume parsed data & confidence
  const [confidenceScores, setConfidenceScores] = useState<Record<string, number>>({});
  const [uploadedResumeName, setUploadedResumeName] = useState<string>('');

  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = (userId: string) => {
    const user = switchUser(userId);
    onAuthenticated(user);
    onClose();
  };

  const handleManualStudentRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const user = registerStudent({
        name,
        email,
        phone,
        branch,
        batch_year: batchYear,
        cgpa,
        skills,
        bio,
        linkedin_url: linkedin,
        github_url: github,
        resume_url: uploadedResumeName || undefined
      });
      onAuthenticated(user);
      onClose();
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed');
    }
  };

  const handleAlumniRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const user = registerAlumni({
        name,
        email,
        phone,
        branch,
        batch_year: batchYear,
        current_company: company,
        current_role: jobRole,
        experience_years: expYears,
        skills,
        bio,
        linkedin_url: linkedin,
        github_url: github
      });
      onAuthenticated(user);
      onClose();
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedResumeName(file.name);
    setResumeStep('parsing');

    // Simulate progress messages
    const messages = [
      'Reading PDF text stream & structure...',
      'Matching technical competencies against Anurag skill taxonomy...',
      'Normalizing CGPA (4.0 & 10.0 scale conversions)...',
      'Detecting academic branch & projected graduation batch...'
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setParsingMessage(messages[i]);
        i++;
      } else {
        clearInterval(interval);
        // Execute heuristic parser
        const dummyContent = `
          ${file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')}
          B.Tech in Artificial Intelligence & Machine Learning
          Anurag University, Batch of 2026
          CGPA: 8.45 / 10.0
          Email: student.applicant@anurag.edu.in | Phone: +91 98491 22334
          Technical Skills: Python, Java, Machine Learning, Deep Learning, React, SQL, FastAPI, Git
          Projects:
          - Real-Time Campus Query Router using React & FastAPI
          - Automated Face Detection with OpenCV and PyTorch
        `;

        const parsed = parseResumeSimulation(file.name, dummyContent);
        setName(parsed.name);
        setEmail(parsed.email);
        setPhone(parsed.phone);
        setBranch(parsed.branch);
        setBatchYear(parsed.batch_year);
        setCgpa(parsed.cgpa);
        setSkills(parsed.skills);
        setBio(parsed.bio);
        setLinkedin(parsed.linkedin_url);
        setGithub(parsed.github_url);
        setConfidenceScores(parsed.confidence);
        setResumeStep('confirm');
      }
    }, 450);
  };

  const renderConfidenceDot = (field: string) => {
    const score = confidenceScores[field];
    if (score === undefined) return null;
    if (score >= 0.8) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          High ({Math.round(score * 100)}%)
        </span>
      );
    }
    if (score >= 0.5) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Verify ({Math.round(score * 100)}%)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-700 bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
        Review
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-[#1A1A2E]">
              {mode === 'login' && 'Sign In to Alumni Connect'}
              {mode === 'register_student' && 'Create Student Account'}
              {mode === 'register_alumni' && 'Alumni Registration'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Anurag University official verified portal
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {authError && (
          <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Mode 1: LOGIN */}
        {mode === 'login' && (
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-700 mb-2">
                1-Click Quick Demo Sign In:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('user_riya')}
                  className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-left transition-colors"
                >
                  <span className="font-bold text-xs text-blue-900 block">Riya Mehta</span>
                  <span className="text-[11px] text-blue-700">Student (CSE &apos;26)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('user_karthik')}
                  className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-left transition-colors"
                >
                  <span className="font-bold text-xs text-amber-900 block">Karthik Reddy</span>
                  <span className="text-[11px] text-amber-700">Alumni (Infosys SDE)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('user_admin')}
                  className="p-2.5 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100 text-left transition-colors"
                >
                  <span className="font-bold text-xs text-red-900 block">Prof. Dr. V. Rao</span>
                  <span className="text-[11px] text-red-700">University Admin</span>
                </button>
              </div>
            </div>

            <div className="relative my-4 text-center">
              <span className="bg-white px-3 text-xs text-slate-400 font-medium">Or enter credentials</span>
              <div className="absolute inset-0 flex items-center -z-10"><div className="w-full border-t border-slate-200"></div></div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleQuickLogin('user_riya');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@anurag.edu.in"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold shadow-md transition-colors"
              >
                Sign In
              </button>
            </form>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <button onClick={() => setMode('register_student')} className="text-[#8B1A1A] font-semibold hover:underline">
                Create Student Account →
              </button>
              <button onClick={() => setMode('register_alumni')} className="text-[#8B1A1A] font-semibold hover:underline">
                Register as Alumni →
              </button>
            </div>
          </div>
        )}

        {/* Mode 2: STUDENT REGISTRATION (Dual Flow: Manual vs Resume) */}
        {mode === 'register_student' && (
          <div className="mt-4 space-y-4">
            {/* Method Choice Cards */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStudentRegMethod('manual')}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  studentRegMethod === 'manual'
                    ? 'border-[#8B1A1A] bg-[#FDF5F5] text-[#8B1A1A] font-bold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="text-xl block mb-1">📝</span>
                <span className="text-xs block font-bold">Fill Manually</span>
                <span className="text-[10px] text-slate-400 block font-normal">Step-by-step form</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStudentRegMethod('resume');
                  setResumeStep('upload');
                }}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  studentRegMethod === 'resume'
                    ? 'border-[#8B1A1A] bg-[#FDF5F5] text-[#8B1A1A] font-bold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="text-xl block mb-1">📄</span>
                <span className="text-xs block font-bold">Upload Resume</span>
                <span className="text-[10px] text-slate-400 block font-normal">Auto-parse from PDF</span>
              </button>
            </div>

            {/* Path A: Resume Upload Flow */}
            {studentRegMethod === 'resume' && (
              <div>
                {resumeStep === 'upload' && (
                  <div className="p-6 border-2 border-dashed border-[#8B1A1A]/40 rounded-xl text-center bg-slate-50/50 space-y-3">
                    <Upload className="w-10 h-10 text-[#8B1A1A] mx-auto" />
                    <div>
                      <h4 className="font-bold text-sm text-[#1A1A2E]">Drop your Resume PDF here</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Supports standard engineering resumes (Max 5MB)</p>
                    </div>
                    <label className="inline-block px-4 py-2 rounded-lg bg-[#8B1A1A] text-white text-xs font-bold cursor-pointer hover:bg-[#6B1010] shadow-sm">
                      <span>Browse PDF Document</span>
                      <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                )}

                {resumeStep === 'parsing' && (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-[#8B1A1A] border-t-transparent rounded-full animate-spin mx-auto" />
                    <h4 className="font-bold text-sm text-[#1A1A2E]">Analyzing Resume with AI Heuristics</h4>
                    <p className="text-xs text-[#8B1A1A] font-semibold">{parsingMessage}</p>
                  </div>
                )}

                {resumeStep === 'confirm' && (
                  <form onSubmit={handleManualStudentRegister} className="space-y-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
                      <span>✓ Data parsed from <strong>{uploadedResumeName}</strong></span>
                      <button
                        type="button"
                        onClick={() => setResumeStep('upload')}
                        className="text-xs text-emerald-900 underline font-semibold"
                      >
                        Re-upload
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700">Full Name *</label>
                          {renderConfidenceDot('name')}
                        </div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full text-xs p-2 rounded-lg border border-slate-300"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700">Email *</label>
                          {renderConfidenceDot('email')}
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full text-xs p-2 rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700">Branch</label>
                          {renderConfidenceDot('branch')}
                        </div>
                        <select
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300"
                        >
                          {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700">Batch Year</label>
                          {renderConfidenceDot('batch_year')}
                        </div>
                        <select
                          value={batchYear}
                          onChange={(e) => setBatchYear(parseInt(e.target.value, 10))}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300"
                        >
                          {BATCH_YEARS.map(yr => <option key={yr} value={yr}>{yr}</option>)}
                        </select>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700">CGPA</label>
                          {renderConfidenceDot('cgpa')}
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          value={cgpa}
                          onChange={(e) => setCgpa(parseFloat(e.target.value))}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700">Detected Skills</label>
                        {renderConfidenceDot('skills')}
                      </div>
                      <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                        {skills.map(s => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded bg-[#1A1A2E] text-white">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Create Account Password *</label>
                      <input
                        type="password"
                        placeholder="At least 8 characters"
                        required
                        className="w-full text-xs p-2 rounded-lg border border-slate-300"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-[#8B1A1A] text-white text-xs font-bold hover:bg-[#6B1010] shadow-md"
                    >
                      Confirm Details & Create Account
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Path B: Manual Entry Form */}
            {studentRegMethod === 'manual' && (
              <form onSubmit={handleManualStudentRegister} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Riya Mehta"
                      required
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Anurag Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@anurag.edu.in"
                      required
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Branch *</label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    >
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Batch Year *</label>
                    <select
                      value={batchYear}
                      onChange={(e) => setBatchYear(parseInt(e.target.value, 10))}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    >
                      {BATCH_YEARS.map(yr => <option key={yr} value={yr}>{yr}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={cgpa}
                      onChange={(e) => setCgpa(parseFloat(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password (min 8 chars) *</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold shadow-md transition-colors"
                >
                  Create Student Account
                </button>
              </form>
            )}

            <div className="pt-2 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-[#8B1A1A] font-bold hover:underline">
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* Mode 3: ALUMNI REGISTRATION */}
        {mode === 'register_alumni' && (
          <form onSubmit={handleAlumniRegister} className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Karthik Reddy"
                  required
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="karthik.r@alumni.anurag.edu.in"
                  required
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Company *</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Infosys, TCS"
                  required
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Designation *</label>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. SDE-2"
                  required
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Yrs)</label>
                <input
                  type="number"
                  min="0"
                  value={expYears}
                  onChange={(e) => setExpYears(parseInt(e.target.value, 10))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Branch (Alma Mater)</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                >
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Batch</label>
                <select
                  value={batchYear}
                  onChange={(e) => setBatchYear(parseInt(e.target.value, 10))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                >
                  {BATCH_YEARS.map(yr => <option key={yr} value={yr}>{yr}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full text-xs p-2 rounded-lg border border-slate-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold shadow-md transition-colors"
            >
              Submit Alumni Verification
            </button>

            <div className="pt-2 text-center text-xs text-slate-500">
              Already verified?{' '}
              <button onClick={() => setMode('login')} className="text-[#8B1A1A] font-bold hover:underline">
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
