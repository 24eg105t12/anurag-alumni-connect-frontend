import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Edit3,
  FileText,
  Star,
  CheckCircle2,
  X,
  Plus,
  ShieldCheck,
  Building2,
  Calendar,
  Award
} from 'lucide-react';
import { CurrentUser, StudentProfile, AlumniProfile } from '../../types';
import { BRANCHES, BATCH_YEARS, MASTER_SKILLS } from '../../data/initialData';
import { updateStudentProfile, updateAlumniProfile } from '../../services/storage';

interface ProfileViewProps {
  currentUser: CurrentUser;
  onRefreshUser: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onRefreshUser }) => {
  const role = currentUser.user.role;
  const isStudent = role === 'student';
  const isAlumni = role === 'alumni';

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states initialized from current profile
  const p = currentUser.profile as any;
  const [name, setName] = useState(p.name || currentUser.name);
  const [phone, setPhone] = useState(p.phone || '');
  const [branch, setBranch] = useState(p.branch || 'CSE');
  const [batchYear, setBatchYear] = useState<number>(p.batch_year || 2026);
  const [cgpa, setCgpa] = useState<number>(p.cgpa || 8.0);
  const [company, setCompany] = useState(p.current_company || 'Infosys');
  const [jobRole, setJobRole] = useState(p.current_role || 'Software Engineer');
  const [experienceYears, setExperienceYears] = useState<number>(p.experience_years || 2);
  const [bio, setBio] = useState(p.bio || '');
  const [linkedin, setLinkedin] = useState(p.linkedin_url || '');
  const [github, setGithub] = useState(p.github_url || '');
  const [skills, setSkills] = useState<string[]>(p.skills || ['Python', 'SQL', 'React']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isMentor, setIsMentor] = useState(p.is_mentor ?? true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStudent) {
      updateStudentProfile(currentUser.user.id, {
        name,
        phone,
        branch,
        batch_year: batchYear,
        cgpa,
        skills,
        bio,
        linkedin_url: linkedin,
        github_url: github
      });
    } else if (isAlumni) {
      updateAlumniProfile(currentUser.user.id, {
        name,
        phone,
        branch,
        batch_year: batchYear,
        current_company: company,
        current_role: jobRole,
        experience_years: experienceYears,
        skills,
        bio,
        linkedin_url: linkedin,
        github_url: github,
        is_mentor: isMentor
      });
    }
    setIsEditModalOpen(false);
    onRefreshUser();
    alert('Profile successfully updated!');
  };

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] tracking-tight">
            User Profile
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your academic credentials, technical skills, and industry contact links
          </p>
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): User Card & Socials */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center relative overflow-hidden">
            <div className="w-20 h-20 rounded-full bg-[#1A1A2E] text-[#E5B55A] font-black text-2xl flex items-center justify-center mx-auto mb-3 border-4 border-[#C9922D]/30 shadow-md">
              {currentUser.name.charAt(0)}
            </div>

            <h2 className="text-lg font-bold text-[#1A1A2E]">{currentUser.name}</h2>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                role === 'admin' ? 'bg-[#8B1A1A]/10 text-[#8B1A1A]' :
                role === 'alumni' ? 'bg-[#C9922D]/20 text-[#8B6210]' :
                'bg-slate-100 text-slate-700'
              }`}>
                {role}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-semibold text-slate-600">Anurag University</span>
            </div>

            {isAlumni && (
              <div className="mt-2 text-xs font-semibold text-[#8B1A1A]">
                {p.current_role} @ {p.current_company}
              </div>
            )}

            {isStudent && (
              <div className="mt-2 text-xs font-semibold text-slate-700">
                {p.branch} · Batch {p.batch_year}
              </div>
            )}

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="mt-4 w-full py-2 px-3 rounded-xl border border-slate-300 hover:border-[#8B1A1A] hover:bg-[#FDF5F5] text-xs font-bold text-slate-700 hover:text-[#8B1A1A] transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Details</span>
            </button>

            {/* Contact Details List */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-left space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{currentUser.user.email}</span>
              </div>
              {p.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{p.phone}</span>
                </div>
              )}
              {p.linkedin_url && (
                <div className="flex items-center gap-2 text-[#0A66C2]">
                  <Linkedin className="w-3.5 h-3.5 shrink-0" />
                  <a href={p.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    {p.linkedin_url.replace('https://', '')}
                  </a>
                </div>
              )}
              {p.github_url && (
                <div className="flex items-center gap-2 text-slate-900">
                  <Github className="w-3.5 h-3.5 shrink-0" />
                  <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    {p.github_url.replace('https://', '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Mentorship Banner for Alumni */}
          {isAlumni && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Mentorship Program Active</span>
              </div>
              <p className="text-emerald-700 text-[11px] leading-relaxed">
                You are currently marked as available to claim student resume and capstone project reviews in the review pool.
              </p>
            </div>
          )}
        </div>

        {/* Right Column (8 cols): Bio, Skills, Academics/Work, Resume */}
        <div className="lg:col-span-8 space-y-6">
          {/* About / Bio */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-[#1A1A2E] flex items-center gap-2">
              <span>About & Summary</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {p.bio || 'No personal bio added yet. Click "Edit Profile" to share your career goals, technical interests, or background.'}
            </p>
          </div>

          {/* Skills Grid */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#1A1A2E]">Technical Skills & Domains</h3>
              <span className="text-xs text-slate-400 font-mono">{skills.length} skills</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#1A1A2E] text-white flex items-center gap-1"
                >
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Academic / Employment Credentials */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[#1A1A2E]">
              {isStudent ? 'Academic Standing' : 'Work & Alma Mater'}
            </h3>

            {isStudent ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-400 block">Department</span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5 block">{p.branch}</span>
                  <span className="text-[11px] text-slate-500">School of Engineering</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-400 block">Graduation Batch</span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5 block font-mono">{p.batch_year}</span>
                  <span className="text-[11px] text-slate-500">4-Year B.Tech Program</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-400 block">Cumulative GPA</span>
                  <span className="text-sm font-bold text-[#8B1A1A] mt-0.5 block font-mono">
                    {p.cgpa ? `${p.cgpa} / 10.0` : 'N/A'}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold">Eligible for Placements</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-400 block">Current Employer</span>
                  <span className="text-sm font-bold text-[#8B1A1A] mt-0.5 block">{p.current_company}</span>
                  <span className="text-[11px] text-slate-500">{p.current_role}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-400 block">Experience</span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5 block font-mono">
                    {p.experience_years || 2}+ Years
                  </span>
                  <span className="text-[11px] text-slate-500">Industry Track</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-400 block">AU Degree</span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                    {p.branch} &apos;{String(p.batch_year).slice(2)}
                  </span>
                  <span className="text-[11px] text-slate-500">Anurag University Alumnus</span>
                </div>
              </div>
            )}
          </div>

          {/* Student Resume Section */}
          {isStudent && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#1A1A2E]">Active Placement Resume</h3>
                  <p className="text-xs text-slate-500">Used for 1-click review submissions to alumni mentors</p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs font-bold text-[#8B1A1A] hover:underline"
                >
                  Upload New File
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FDF5F5] border border-[#8B1A1A]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#8B1A1A] text-white flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#1A1A2E] block">
                      {p.resume_url || `${name.replace(/\s+/g, '_')}_Resume_2026.pdf`}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      ✓ Verified PDF Document
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Downloading ${p.resume_url || 'Resume.pdf'}...`)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold hover:bg-slate-50 shadow-xs"
                >
                  Preview Document
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#1A1A2E]">Update Profile Information</h3>
                <p className="text-xs text-slate-500">All fields sync immediately with your active session</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98490 XXXXX"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Branch / Major</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                  >
                    {BRANCHES.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Batch Year</label>
                  <select
                    value={batchYear}
                    onChange={(e) => setBatchYear(parseInt(e.target.value, 10))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                  >
                    {BATCH_YEARS.map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
                {isStudent && (
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">CGPA (0.0 - 10.0)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={cgpa}
                      onChange={(e) => setCgpa(parseFloat(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                    />
                  </div>
                )}
              </div>

              {isAlumni && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Current Company</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Infosys, Google"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Role / Designation</label>
                    <input
                      type="text"
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                      placeholder="e.g. SDE-2"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Years of Exp</label>
                    <input
                      type="number"
                      min="0"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(parseInt(e.target.value, 10))}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Bio / Profile Summary</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/myprofile"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/myusername"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                  />
                </div>
              </div>

              {/* Skills Tag Management */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Skills & Technologies</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    placeholder="Add custom skill (e.g. Spring Boot, PyTorch, Docker)..."
                    className="flex-1 text-xs p-2 rounded-lg border border-slate-300"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(newSkillInput);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(newSkillInput)}
                    className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 p-2 border border-slate-200 rounded-lg max-h-28 overflow-y-auto bg-slate-50">
                  {skills.map(skill => (
                    <span
                      key={skill}
                      className="text-xs bg-white text-slate-800 border border-slate-300 px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {isAlumni && (
                <label className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={isMentor}
                    onChange={(e) => setIsMentor(e.target.checked)}
                    className="rounded text-[#8B1A1A] focus:ring-[#8B1A1A]"
                  />
                  <span>Open to student mentorship inquiries & review claims</span>
                </label>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
