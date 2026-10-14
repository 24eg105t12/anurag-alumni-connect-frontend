import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Plus,
  ExternalLink,
  MapPin,
  IndianRupee,
  Building2,
  Calendar,
  CheckCircle2,
  Trash2,
  X,
  Sparkles,
  Share2,
  Send,
  Users
} from 'lucide-react';
import { CurrentUser, Opportunity } from '../../types';
import { BRANCHES, MASTER_SKILLS } from '../../data/initialData';
import { createOpportunity, deleteOpportunity } from '../../services/storage';

interface OpportunitiesViewProps {
  currentUser: CurrentUser;
  opportunities: Opportunity[];
  selectedOpportunity: Opportunity | null;
  onSelectOpportunity: (opportunity: Opportunity | null) => void;
  onRefreshOpportunities: () => void;
  isPostModalOpen: boolean;
  setIsPostModalOpen: (open: boolean) => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  currentUser,
  opportunities,
  selectedOpportunity,
  onSelectOpportunity,
  onRefreshOpportunities,
  isPostModalOpen,
  setIsPostModalOpen
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [remoteOnly, setRemoteOnly] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formType, setFormType] = useState<'internship' | 'full-time' | 'contract' | 'freelance'>('internship');
  const [formLocation, setFormLocation] = useState('Hyderabad');
  const [formIsRemote, setFormIsRemote] = useState(false);
  const [formDescription, setFormDescription] = useState('');
  const [formRequirements, setFormRequirements] = useState('');
  const [formSkills, setFormSkills] = useState<string[]>(['Java', 'Python']);
  const [formSalaryMin, setFormSalaryMin] = useState<number>(25000);
  const [formSalaryMax, setFormSalaryMax] = useState<number>(30000);
  const [formEligibleBranches, setFormEligibleBranches] = useState<string[]>(['CSE', 'AI & ML', 'IT']);
  const [formDeadline, setFormDeadline] = useState('2026-06-30');
  const [formApplyLink, setFormApplyLink] = useState('https://career.infosys.com');
  const [formReferral, setFormReferral] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Referral Request Modal
  const [referralModalOpp, setReferralModalOpp] = useState<Opportunity | null>(null);
  const [referralNote, setReferralNote] = useState('');
  const [referralSent, setReferralSent] = useState(false);

  const role = currentUser.user.role;
  const canPost = role === 'alumni' || role === 'admin';

  const formatSalary = (min?: number, max?: number, type?: string) => {
    if (!min && !max) return 'Competitive Stipend';
    if (type === 'internship') {
      return `₹${((min || max || 0) / 1000).toFixed(0)}K/mo`;
    }
    const lpa = ((max || min || 0) / 100000).toFixed(1);
    return `₹${lpa} LPA`;
  };

  const filteredOpportunities = opportunities.filter(opp => {
    if (!opp.is_active) return false;
    const matchesType = selectedType === 'all' || opp.type === selectedType;
    const matchesBranch = selectedBranch === 'all' || opp.eligible_branches.includes(selectedBranch);
    const matchesRemote = !remoteOnly || opp.is_remote;
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.skills_required.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesBranch && matchesRemote && matchesSearch;
  });

  const handlePostOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Job title is required');
      return;
    }
    if (!formCompany.trim()) {
      setFormError('Company name is required');
      return;
    }
    if (!formApplyLink.trim()) {
      setFormError('Official application URL is required');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      createOpportunity({
        title: formTitle.trim(),
        company: formCompany.trim(),
        type: formType,
        location: formLocation.trim() || 'Hyderabad',
        is_remote: formIsRemote,
        description: formDescription.trim() || 'Role details and expectations.',
        requirements: formRequirements.trim(),
        skills_required: formSkills,
        salary_min: formSalaryMin || undefined,
        salary_max: formSalaryMax || undefined,
        eligible_branches: formEligibleBranches,
        deadline: formDeadline,
        apply_link: formApplyLink.trim(),
        is_referral_available: formReferral,
        is_active: true
      });

      setIsPostModalOpen(false);
      onRefreshOpportunities();
      alert('Career opportunity posted successfully!');
    } catch (err: any) {
      setFormError(err.message || 'Failed to post opportunity');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOpportunity = (e: React.MouseEvent, oppId: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this job posting? This cannot be undone.')) {
      try {
        deleteOpportunity(oppId);
        onRefreshOpportunities();
        if (selectedOpportunity?.id === oppId) {
          onSelectOpportunity(null);
        }
      } catch (err: any) {
        alert(err.message || 'Failed to delete');
      }
    }
  };

  const toggleBranchSelection = (branch: string) => {
    if (formEligibleBranches.includes(branch)) {
      if (formEligibleBranches.length > 1) {
        setFormEligibleBranches(formEligibleBranches.filter(b => b !== branch));
      }
    } else {
      setFormEligibleBranches([...formEligibleBranches, branch]);
    }
  };

  const toggleSkillSelection = (skill: string) => {
    if (formSkills.includes(skill)) {
      setFormSkills(formSkills.filter(s => s !== skill));
    } else {
      setFormSkills([...formSkills, skill]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] tracking-tight">
            Opportunities Board
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified internships and full-time career openings posted directly by Anurag University alumni
          </p>
        </div>

        {canPost && (
          <button
            onClick={() => {
              setFormError(null);
              setIsPostModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Post Opportunity</span>
          </button>
        )}
      </div>

      {/* Selected Opportunity Detail Modal / View */}
      {selectedOpportunity && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <button
              onClick={() => onSelectOpportunity(null)}
              className="text-xs font-semibold text-[#8B1A1A] hover:underline flex items-center gap-1"
            >
              ← Back to All Postings
            </button>

            {(selectedOpportunity.posted_by === currentUser.user.id || currentUser.user.role === 'admin') && (
              <button
                onClick={(e) => handleDeleteOpportunity(e, selectedOpportunity.id)}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Posting</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Details */}
            <div className="lg:col-span-8 space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#C9922D]/20 text-[#8B6210] border border-[#C9922D]/30">
                    {selectedOpportunity.type.replace('_', ' ')}
                  </span>
                  {selectedOpportunity.is_referral_available && (
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Referral Available
                    </span>
                  )}
                  {selectedOpportunity.is_remote && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Remote Friendly
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-extrabold text-[#1A1A2E] leading-snug">
                  {selectedOpportunity.title}
                </h2>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#8B1A1A] mt-1">
                  <Building2 className="w-4 h-4 text-[#8B1A1A]" />
                  <span>{selectedOpportunity.company}</span>
                </div>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Compensation</span>
                  <span className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                    {formatSalary(selectedOpportunity.salary_min, selectedOpportunity.salary_max, selectedOpportunity.type)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Location</span>
                  <span className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {selectedOpportunity.location}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Deadline</span>
                  <span className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {selectedOpportunity.deadline || 'Rolling basis'}
                  </span>
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-[#1A1A2E]">Role Overview</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedOpportunity.description}
                </p>
              </div>

              {/* Requirements */}
              {selectedOpportunity.requirements && (
                <div className="space-y-2">
                  <h3 className="font-bold text-sm text-[#1A1A2E]">Key Requirements</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {selectedOpportunity.requirements}
                  </p>
                </div>
              )}

              {/* Skills */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-[#1A1A2E]">Desired Skills & Tech Stack</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedOpportunity.skills_required.map(s => (
                    <span
                      key={s}
                      className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#1A1A2E] text-white"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Eligibility */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-[#1A1A2E]">Eligible Anurag Branches</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedOpportunity.eligible_branches.map(b => (
                    <span
                      key={b}
                      className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Apply & Poster Card */}
            <div className="lg:col-span-4 space-y-4">
              {/* Primary Apply Card */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="font-bold text-sm text-[#1A1A2E]">Apply for this Position</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You will be redirected directly to the verified corporate portal. Make sure your resume is up to date.
                </p>

                {/* THE WORKING APPLY NOW BUTTON */}
                <a
                  href={selectedOpportunity.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#8B1A1A] hover:bg-[#6B1010] text-white font-bold text-xs tracking-wide uppercase transition-all shadow-md active:scale-[0.98]"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                {selectedOpportunity.is_referral_available && (
                  <button
                    onClick={() => {
                      setReferralModalOpp(selectedOpportunity);
                      setReferralSent(false);
                      setReferralNote('');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-[#C9922D] text-[#8B6210] hover:bg-[#C9922D]/10 font-bold text-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-[#C9922D]" />
                    <span>Request Referral from Alumni</span>
                  </button>
                )}
              </div>

              {/* Poster Profile Card */}
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Posted By Alumnus
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1A1A2E] text-[#E5B55A] font-bold text-sm flex items-center justify-center">
                    {selectedOpportunity.posted_by_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1A1A2E]">
                      {selectedOpportunity.posted_by_name}
                    </h4>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {selectedOpportunity.posted_by_role || 'Alumni'} @ {selectedOpportunity.posted_by_company || selectedOpportunity.company}
                    </p>
                    {selectedOpportunity.posted_by_batch && (
                      <p className="text-[10px] text-slate-400">
                        Anurag University Batch of {selectedOpportunity.posted_by_batch}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Opportunities List View */}
      <div className="space-y-4">
        {/* Filters Strip */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, company, or tech stack (e.g. Python, Infosys, SQL)..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Type Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Openings' },
                { id: 'internship', label: 'Internships' },
                { id: 'full-time', label: 'Full-Time (FTE)' },
                { id: 'contract', label: 'Contract' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    selectedType === t.id
                      ? 'bg-[#8B1A1A] text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Branch and Remote Controls */}
            <div className="flex items-center gap-3">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A]"
              >
                <option value="all">All Branches</option>
                {BRANCHES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                  className="rounded text-[#8B1A1A] focus:ring-[#8B1A1A]"
                />
                <span>Remote Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Opportunity Cards Grid */}
        {filteredOpportunities.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-800">No opportunities match criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your branch filters or search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOpportunities.map(opp => (
              <div
                key={opp.id}
                onClick={() => onSelectOpportunity(opp)}
                className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#8B1A1A]/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9922D] block mb-0.5">
                        {opp.type.replace('_', ' ')}
                      </span>
                      <h3 className="font-bold text-base text-[#1A1A2E] leading-snug">
                        {opp.title}
                      </h3>
                      <p className="text-xs font-semibold text-[#8B1A1A] mt-0.5">
                        {opp.company}
                      </p>
                    </div>

                    {opp.is_referral_available && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                        Referral
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <IndianRupee className="w-3 h-3 text-slate-400" />
                      {formatSalary(opp.salary_min, opp.salary_max, opp.type)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[130px]">{opp.location}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {opp.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {opp.skills_required.slice(0, 4).map(skill => (
                      <span
                        key={skill}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1A1A2E] text-white"
                      >
                        {skill}
                      </span>
                    ))}
                    {opp.skills_required.length > 4 && (
                      <span className="text-[10px] text-slate-500 self-center">
                        +{opp.skills_required.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">
                    Alumni: <strong className="text-slate-700">{opp.posted_by_name}</strong>
                  </span>

                  {/* Direct Apply Button */}
                  <div className="flex items-center gap-2">
                    <a
                      href={opp.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold transition-colors shadow-xs"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Opportunity Modal for Alumni & Admin */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-[#1A1A2E]">Post a Job or Internship</h2>
                <p className="text-xs text-slate-500">Share openings from your company with Anurag University students</p>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostOpportunity} className="mt-4 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Role Title *</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Software Engineer Intern"
                    required
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Company Name *</label>
                  <input
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="e.g. Infosys, Microsoft"
                    required
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Opportunity Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                  >
                    <option value="internship">Internship</option>
                    <option value="full-time">Full-Time (FTE)</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Location</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Hyderabad"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {formType === 'internship' ? 'Monthly Stipend (₹)' : 'Annual Package Min (₹)'}
                  </label>
                  <input
                    type="number"
                    value={formSalaryMin}
                    onChange={(e) => setFormSalaryMin(parseInt(e.target.value, 10))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {formType === 'internship' ? 'Stipend Max (optional)' : 'Annual Package Max (₹)'}
                  </label>
                  <input
                    type="number"
                    value={formSalaryMax}
                    onChange={(e) => setFormSalaryMax(parseInt(e.target.value, 10))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Official Apply URL *</label>
                <input
                  type="url"
                  value={formApplyLink}
                  onChange={(e) => setFormApplyLink(e.target.value)}
                  placeholder="https://company.com/careers/job123"
                  required
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Role Description & Responsibilities</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  placeholder="Summarize team mission, expected contributions, and day-to-day responsibilities..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] resize-none"
                />
              </div>

              {/* Eligible Branches Checkbox Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Eligible Branches</label>
                <div className="flex flex-wrap gap-1.5 p-2 border border-slate-200 rounded-lg max-h-24 overflow-y-auto">
                  {BRANCHES.map(branch => (
                    <button
                      type="button"
                      key={branch}
                      onClick={() => toggleBranchSelection(branch)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                        formEligibleBranches.includes(branch)
                          ? 'bg-[#8B1A1A] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {branch}
                    </button>
                  ))}
                </div>
              </div>

              {/* Referral & Remote Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formReferral}
                    onChange={(e) => setFormReferral(e.target.checked)}
                    className="rounded text-[#8B1A1A] focus:ring-[#8B1A1A]"
                  />
                  <span>I am offering employee referrals for qualified students</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsRemote}
                    onChange={(e) => setFormIsRemote(e.target.checked)}
                    className="rounded text-[#8B1A1A] focus:ring-[#8B1A1A]"
                  />
                  <span>Remote / Hybrid Position</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : 'Publish Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Referral Request Dialog */}
      {referralModalOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#1A1A2E]">
                Request Referral: {referralModalOpp.company}
              </h3>
              <button
                onClick={() => setReferralModalOpp(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {referralSent ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-slate-800">Referral Inquiry Sent!</h4>
                <p className="text-xs text-slate-500">
                  {referralModalOpp.posted_by_name} has received your profile summary and message. They will reach out via email or LinkedIn.
                </p>
                <button
                  onClick={() => setReferralModalOpp(null)}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-[#8B1A1A] text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-slate-600">
                  Sending referral note to <strong>{referralModalOpp.posted_by_name}</strong> for <strong>{referralModalOpp.title}</strong>.
                </p>
                <textarea
                  value={referralNote}
                  onChange={(e) => setReferralNote(e.target.value)}
                  rows={4}
                  placeholder="Introduce yourself, your CGPA/skills match, and link to your portfolio or resume..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] resize-none"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setReferralModalOpp(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setReferralSent(true)}
                    className="px-4 py-1.5 rounded-lg bg-[#8B1A1A] text-white text-xs font-bold hover:bg-[#6B1010]"
                  >
                    Send Referral Note
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
