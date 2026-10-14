import React, { useState } from 'react';
import {
  Users,
  Search,
  Building2,
  Briefcase,
  GraduationCap,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  X,
  Send,
  Linkedin,
  Github
} from 'lucide-react';
import { AlumniProfile, CurrentUser } from '../../types';
import { BRANCHES } from '../../data/initialData';

interface AlumniDirectoryViewProps {
  currentUser: CurrentUser;
  alumniList: AlumniProfile[];
  onOpenAskQuestion: () => void;
}

export const AlumniDirectoryView: React.FC<AlumniDirectoryViewProps> = ({
  currentUser,
  alumniList,
  onOpenAskQuestion
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [mentorsOnly, setMentorsOnly] = useState(false);

  // Inquire Modal
  const [inquiryAlumni, setInquiryAlumni] = useState<AlumniProfile | null>(null);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const filteredAlumni = alumniList.filter(alumni => {
    const matchesBranch = selectedBranch === 'all' || alumni.branch === selectedBranch;
    const matchesMentor = !mentorsOnly || alumni.is_mentor;
    const matchesSearch =
      alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.current_company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.current_role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesBranch && matchesMentor && matchesSearch;
  });

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setInquiryAlumni(null);
      setInquiryMessage('');
      alert(`Message successfully sent to ${inquiryAlumni?.name}!`);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Directory Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] tracking-tight">
            Alumni Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect with verified graduates from Anurag University across leading multinational tech companies and startups
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAskQuestion}
            className="px-3.5 py-2 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold transition-colors shadow-xs"
          >
            Ask Community
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alumni by name, company (Infosys, TCS), designation, or skills..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Branch:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A]"
            >
              <option value="all">All Departments</option>
              {BRANCHES.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={mentorsOnly}
              onChange={(e) => setMentorsOnly(e.target.checked)}
              className="rounded text-[#8B1A1A] focus:ring-[#8B1A1A]"
            />
            <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Open to Mentorship Only
            </span>
          </label>
        </div>
      </div>

      {/* Alumni Cards Grid */}
      {filteredAlumni.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-800">No alumni matched your filters</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your department filter or searching by company name.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAlumni.map(alumni => (
            <div
              key={alumni.id}
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#8B1A1A]/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#1A1A2E] text-[#E5B55A] font-extrabold text-sm flex items-center justify-center shrink-0 border border-slate-700">
                      {alumni.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#1A1A2E] leading-snug">
                        {alumni.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#8B1A1A]">
                        {alumni.current_role}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {alumni.current_company}
                      </p>
                    </div>
                  </div>

                  {alumni.is_mentor && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                      Mentor
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 space-y-1 mb-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>{alumni.branch} · Batch {alumni.batch_year}</span>
                  </div>
                  {alumni.experience_years ? (
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{alumni.experience_years} years industry experience</span>
                    </div>
                  ) : null}
                </div>

                {alumni.bio && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {alumni.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mb-4">
                  {alumni.skills.slice(0, 4).map(skill => (
                    <span
                      key={skill}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                  {alumni.skills.length > 4 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{alumni.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {alumni.linkedin_url && (
                    <a
                      href={alumni.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0A66C2] hover:opacity-80 p-1"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {alumni.github_url && (
                    <a
                      href={alumni.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-800 hover:opacity-80 p-1"
                      title="GitHub Profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setInquiryAlumni(alumni)}
                  className="px-3 py-1.5 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white font-semibold text-xs transition-colors flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Connect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Connect Inquiry Dialog */}
      {inquiryAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-[#1A1A2E]">
                  Connect with {inquiryAlumni.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {inquiryAlumni.current_role} @ {inquiryAlumni.current_company}
                </p>
              </div>
              <button
                onClick={() => setInquiryAlumni(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInquiry} className="mt-4 space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                Write a note / ask for career guidance:
              </label>
              <textarea
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                rows={4}
                required
                placeholder="Introduce your year/branch at Anurag, and what specific topic you'd like advice on (e.g. interview prep, referral prerequisites, company culture)..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] resize-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInquiryAlumni(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inquirySent}
                  className="px-4 py-1.5 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{inquirySent ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
