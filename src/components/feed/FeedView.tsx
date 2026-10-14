import React from 'react';
import {
  MessageSquare,
  Briefcase,
  ClipboardList,
  Users,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building2,
  Clock,
  MapPin,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  ThumbsUp
} from 'lucide-react';
import { CurrentUser, Question, Opportunity, ReviewRequest } from '../../types';

interface FeedViewProps {
  currentUser: CurrentUser;
  questions: Question[];
  opportunities: Opportunity[];
  reviews: ReviewRequest[];
  onNavigateTab: (tab: string) => void;
  onSelectQuestion: (question: Question) => void;
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onOpenAskQuestion: () => void;
  onOpenPostOpportunity: () => void;
  onOpenSubmitReview: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  currentUser,
  questions,
  opportunities,
  reviews,
  onNavigateTab,
  onSelectQuestion,
  onSelectOpportunity,
  onOpenAskQuestion,
  onOpenPostOpportunity,
  onOpenSubmitReview
}) => {
  const role = currentUser.user.role;
  const firstName = currentUser.name.split(' ')[0] || 'Member';

  const pendingReviewsCount = reviews.filter(r => r.status === 'pending').length;
  const activeOpportunities = opportunities.filter(o => o.is_active);

  const formatSalary = (min?: number, max?: number, type?: string) => {
    if (!min && !max) return 'Competitive Stipend';
    if (type === 'internship') {
      return `₹${((min || max || 0) / 1000).toFixed(0)}K/mo`;
    }
    const lpa = ((max || min || 0) / 100000).toFixed(1);
    return `₹${lpa} LPA`;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Hero Banner with AU Brand Colors */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#8B1A1A] via-[#6B1010] to-[#1A1A2E] text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2 text-[#E5B55A] text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Anurag University Community Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Hello, {firstName}! 👋
          </h1>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6">
            Welcome to your official university network. Engage with senior alumni working at leading technology firms, discover verified opportunities, and get guidance on resumes and projects.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAskQuestion}
              className="px-4 py-2.5 rounded-lg bg-white text-[#8B1A1A] hover:bg-slate-100 font-bold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask a Question</span>
            </button>

            {role === 'student' ? (
              <button
                onClick={onOpenSubmitReview}
                className="px-4 py-2.5 rounded-lg bg-[#C9922D] hover:bg-[#a87520] text-[#1A1A2E] font-bold text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <ClipboardList className="w-4 h-4" />
                <span>Request Resume / Project Review</span>
              </button>
            ) : (
              <button
                onClick={onOpenPostOpportunity}
                className="px-4 py-2.5 rounded-lg bg-[#C9922D] hover:bg-[#a87520] text-[#1A1A2E] font-bold text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Job / Internship</span>
              </button>
            )}

            <button
              onClick={() => onNavigateTab('alumni')}
              className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Browse Alumni</span>
            </button>
          </div>
        </div>

        {/* Decorative Graphic Element */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-[#C9922D]/10 pointer-events-none blur-2xl" />
      </div>

      {/* Metric Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => onNavigateTab('questions')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#8B1A1A]/40 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Q&A Discussions</span>
            <MessageSquare className="w-4 h-4 text-[#8B1A1A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#1A1A2E] font-mono tabular-nums">
            {questions.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Active student inquiries</span>
        </div>

        <div
          onClick={() => onNavigateTab('opportunities')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#8B1A1A]/40 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Live Openings</span>
            <Briefcase className="w-4 h-4 text-[#C9922D]" />
          </div>
          <div className="text-2xl font-extrabold text-[#1A1A2E] font-mono tabular-nums">
            {activeOpportunities.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">With alumni referrals</span>
        </div>

        <div
          onClick={() => onNavigateTab('reviews')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#8B1A1A]/40 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Review Requests</span>
            <ClipboardList className="w-4 h-4 text-[#8B1A1A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#1A1A2E] font-mono tabular-nums">
            {reviews.length}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">
            {pendingReviewsCount} open in review pool
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('alumni')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#8B1A1A]/40 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Verified Mentors</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#1A1A2E] font-mono tabular-nums">
            200+
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Infosys, TCS, MSFT & more</span>
        </div>
      </div>

      {/* Two Column Grid: Top Q&A and Featured Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Top Q&A */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-[#1A1A2E]">Recent Q&A Discussions</h2>
              <span className="text-xs text-slate-500 font-medium">· Community Forum</span>
            </div>
            <button
              onClick={() => onNavigateTab('questions')}
              className="text-xs text-[#8B1A1A] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {questions.slice(0, 3).map(q => (
              <div
                key={q.id}
                onClick={() => onSelectQuestion(q)}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#8B1A1A]/40 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-sm text-[#1A1A2E] hover:text-[#8B1A1A] transition-colors leading-snug">
                    {q.title}
                  </h3>
                  {q.is_resolved && (
                    <span className="shrink-0 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Answered
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {q.body}
                </p>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">{q.author_name}</span>
                    <span aria-hidden="true">·</span>
                    <span>{q.author_branch} &apos;{q.author_batch ? String(q.author_batch).slice(2) : ''}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-slate-400" />
                      <span className="font-mono">{q.like_count}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-slate-400" />
                      <span className="font-mono">{q.answers_count} answers</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Featured Opportunities */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-[#1A1A2E]">Featured Opportunities</h2>
              <span className="text-xs text-slate-500 font-medium">· Alumni Openings</span>
            </div>
            <button
              onClick={() => onNavigateTab('opportunities')}
              className="text-xs text-[#8B1A1A] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeOpportunities.slice(0, 3).map(opp => (
              <div
                key={opp.id}
                onClick={() => onSelectOpportunity(opp)}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#8B1A1A]/40 hover:shadow-md transition-all cursor-pointer relative"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-[#1A1A2E] leading-snug">
                      {opp.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#8B1A1A] mt-0.5">
                      {opp.company}
                    </p>
                  </div>
                  {opp.is_referral_available && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                      Referral Available
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1 text-slate-700 font-medium">
                    <IndianRupee className="w-3 h-3 text-slate-400" />
                    <span>{formatSalary(opp.salary_min, opp.salary_max, opp.type)}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="truncate max-w-[140px]">{opp.location}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 text-[11px]">
                    Posted by <strong className="text-slate-700">{opp.posted_by_name}</strong>
                  </span>
                  <a
                    href={opp.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#8B1A1A] hover:underline"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campus Placement Partners Strip */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200">
        <div className="text-center max-w-xl mx-auto mb-4">
          <p className="text-xs font-bold text-[#8B1A1A] uppercase tracking-wider">
            Alumni Footprint
          </p>
          <h3 className="text-base font-bold text-[#1A1A2E] mt-0.5">
            Where Anurag University Alumni Are Making An Impact
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-600 font-bold text-sm tracking-wide">
          <span className="flex items-center gap-1.5 hover:text-[#8B1A1A] transition-colors">
            <Building2 className="w-4 h-4 text-blue-600" /> Infosys
          </span>
          <span className="flex items-center gap-1.5 hover:text-[#8B1A1A] transition-colors">
            <Building2 className="w-4 h-4 text-purple-600" /> Tata Consultancy Services
          </span>
          <span className="flex items-center gap-1.5 hover:text-[#8B1A1A] transition-colors">
            <Building2 className="w-4 h-4 text-sky-600" /> Microsoft
          </span>
          <span className="flex items-center gap-1.5 hover:text-[#8B1A1A] transition-colors">
            <Building2 className="w-4 h-4 text-amber-600" /> Amazon
          </span>
          <span className="flex items-center gap-1.5 hover:text-[#8B1A1A] transition-colors">
            <Building2 className="w-4 h-4 text-red-600" /> Oracle
          </span>
          <span className="flex items-center gap-1.5 hover:text-[#8B1A1A] transition-colors">
            <Building2 className="w-4 h-4 text-indigo-600" /> Darwinbox
          </span>
        </div>
      </div>
    </div>
  );
};
