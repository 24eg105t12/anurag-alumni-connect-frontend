import React, { useState } from 'react';
import {
  ClipboardList,
  FileText,
  Star,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Send,
  Upload,
  User,
  GraduationCap,
  Briefcase,
  X,
  Sparkles,
  Check,
  Code
} from 'lucide-react';
import { CurrentUser, ReviewRequest, ReviewType } from '../../types';
import {
  createReviewRequest,
  claimReview,
  submitFeedback
} from '../../services/storage';

interface ReviewsViewProps {
  currentUser: CurrentUser;
  reviews: ReviewRequest[];
  onRefreshReviews: () => void;
  isSubmitModalOpen: boolean;
  setIsSubmitModalOpen: (open: boolean) => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  currentUser,
  reviews,
  onRefreshReviews,
  isSubmitModalOpen,
  setIsSubmitModalOpen
}) => {
  const role = currentUser.user.role;
  const isStudent = role === 'student';

  // Tabs for alumni
  const [alumniTab, setAlumniTab] = useState<'open_pool' | 'my_claimed'>('open_pool');

  // Submit Review Form state
  const [reviewType, setReviewType] = useState<ReviewType>('resume');
  const [resumeOption, setResumeOption] = useState<'profile' | 'upload'>('profile');
  const [customResumeFileName, setCustomResumeFileName] = useState<string>('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [projectTech, setProjectTech] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [studentMessage, setStudentMessage] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // View Feedback modal state
  const [viewFeedbackReview, setViewFeedbackReview] = useState<ReviewRequest | null>(null);

  // Give Feedback modal state (Alumni)
  const [givingFeedbackReview, setGivingFeedbackReview] = useState<ReviewRequest | null>(null);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [strengthsText, setStrengthsText] = useState('');
  const [improvementsText, setImprovementsText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Filter lists
  const studentMyReviews = reviews.filter(r => r.student_id === currentUser.user.id);
  const openPoolReviews = reviews.filter(r => r.status === 'pending');
  const alumniClaimedReviews = reviews.filter(r => r.reviewer_id === currentUser.user.id);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const resumeUrl =
        reviewType === 'project'
          ? undefined
          : resumeOption === 'profile'
          ? (currentUser.profile as any).resume_url || 'student_profile_resume.pdf'
          : customResumeFileName || 'uploaded_resume.pdf';

      const resumeName =
        reviewType === 'project'
          ? undefined
          : resumeOption === 'profile'
          ? `${currentUser.name.replace(/\s+/g, '_')}_Resume.pdf`
          : customResumeFileName || 'Uploaded_Resume.pdf';

      const techArr = projectTech
        ? projectTech.split(',').map(s => s.trim()).filter(Boolean)
        : undefined;

      createReviewRequest({
        type: reviewType,
        message: studentMessage,
        resume_url: resumeUrl,
        resume_name: resumeName,
        project_title: reviewType !== 'resume' ? projectTitle : undefined,
        project_url: reviewType !== 'resume' ? projectUrl : undefined,
        project_tech: techArr,
        project_description: reviewType !== 'resume' ? projectDescription : undefined
      });

      setIsSubmitModalOpen(false);
      onRefreshReviews();
      alert('Your review request has been published to the Alumni pool!');
      // reset
      setStudentMessage('');
      setProjectTitle('');
      setProjectUrl('');
      setProjectDescription('');
    } catch (err: any) {
      setSubmitError(err.message || 'Error creating review request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaim = (reviewId: string) => {
    try {
      claimReview(reviewId);
      onRefreshReviews();
      alert('Review claimed! It is now in your "My Claimed Reviews" tab ready for evaluation.');
    } catch (err: any) {
      alert(err.message || 'Could not claim review');
    }
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!givingFeedbackReview) return;

    setIsSubmittingFeedback(true);
    try {
      const strengthsArr = strengthsText
        ? strengthsText.split('\n').map(s => s.trim()).filter(Boolean)
        : [];
      const improvementsArr = improvementsText
        ? improvementsText.split('\n').map(s => s.trim()).filter(Boolean)
        : [];

      submitFeedback(givingFeedbackReview.id, {
        rating,
        feedback: feedbackText,
        strengths: strengthsArr,
        improvements: improvementsArr
      });

      setGivingFeedbackReview(null);
      setFeedbackText('');
      setStrengthsText('');
      setImprovementsText('');
      onRefreshReviews();
      alert('Detailed feedback submitted! The student has been notified.');
    } catch (err: any) {
      alert(err.message || 'Error submitting feedback');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Feedback Complete
          </span>
        );
      case 'in_review':
        return (
          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            In Review
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Open in Pool
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] tracking-tight">
            Resume & Project Review Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Get 1-on-1 expert critiques on your resume formatting, ATS compatibility, and engineering project architectures from Anurag University alumni
          </p>
        </div>

        {isStudent && (
          <button
            onClick={() => {
              setSubmitError(null);
              setIsSubmitModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Submit for Review</span>
          </button>
        )}
      </div>

      {/* Role-Specific Views */}
      {isStudent ? (
        /* STUDENT VIEW */
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">My Review Submissions</h2>
              <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">
                {studentMyReviews.length}
              </span>
            </div>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="text-xs text-[#8B1A1A] hover:underline font-semibold"
            >
              + Submit Another Request
            </button>
          </div>

          {studentMyReviews.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-base text-slate-800">No Review Requests Submitted Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Upload your resume PDF or share a GitHub project link to get actionable suggestions from alumni working at Infosys, TCS, Microsoft, and more.
              </p>
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="mt-4 px-4 py-2 rounded-lg bg-[#8B1A1A] text-white text-xs font-bold"
              >
                Submit Review Request
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentMyReviews.map(r => (
                <div
                  key={r.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#8B1A1A]/30 shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B1A1A]">
                        {r.type.toUpperCase()} REVIEW
                      </span>
                      {renderStatusBadge(r.status)}
                    </div>

                    <h3 className="font-bold text-sm text-[#1A1A2E] mb-1">
                      {r.type === 'project' || r.type === 'both' ? r.project_title || 'Software Engineering Project' : 'Undergraduate Resume'}
                    </h3>

                    {r.message && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                        &ldquo;{r.message}&rdquo;
                      </p>
                    )}

                    {/* Attached Resources */}
                    <div className="space-y-1.5 pt-2 text-xs text-slate-600">
                      {r.resume_url && (
                        <div className="flex items-center gap-1.5 text-[#8B1A1A] font-medium">
                          <FileText className="w-3.5 h-3.5" />
                          <span className="truncate">{r.resume_name || 'Attached Resume PDF'}</span>
                        </div>
                      )}
                      {r.project_url && (
                        <div className="flex items-center gap-1.5 text-blue-600 font-medium">
                          <Code className="w-3.5 h-3.5" />
                          <a
                            href={r.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline truncate"
                          >
                            {r.project_url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      {r.reviewer_name ? (
                        <span className="text-slate-500 text-[11px]">
                          Reviewer: <strong className="text-slate-800">{r.reviewer_name}</strong> ({r.reviewer_company || 'Alumni'})
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          Awaiting alumni claim in pool
                        </span>
                      )}
                    </div>

                    {r.status === 'completed' && (
                      <button
                        onClick={() => setViewFeedbackReview(r)}
                        className="px-3 py-1.5 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold transition-colors shadow-xs"
                      >
                        Read Feedback
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ALUMNI / ADMIN VIEW */
        <div className="space-y-4">
          {/* Segmented Pool Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setAlumniTab('open_pool')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                alumniTab === 'open_pool'
                  ? 'bg-[#8B1A1A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Open Review Pool ({openPoolReviews.length})
            </button>
            <button
              onClick={() => setAlumniTab('my_claimed')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                alumniTab === 'my_claimed'
                  ? 'bg-[#8B1A1A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              My Claimed Reviews ({alumniClaimedReviews.length})
            </button>
          </div>

          {alumniTab === 'open_pool' ? (
            openPoolReviews.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-bold text-base text-slate-800">All Student Reviews Are Claimed!</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  There are currently no pending reviews in the open pool. Check back later as students submit new requests.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openPoolReviews.map(r => (
                  <div
                    key={r.id}
                    className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#C9922D] shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B1A1A]">
                          {r.type.toUpperCase()} REVIEW
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          Unclaimed
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-[#1A1A2E] text-[#E5B55A] font-bold text-xs flex items-center justify-center">
                          {r.student_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-[#1A1A2E]">{r.student_name}</p>
                          <p className="text-[11px] text-slate-500">{r.student_branch} · Batch {r.student_batch}</p>
                        </div>
                      </div>

                      {r.project_title && (
                        <h4 className="font-semibold text-xs text-slate-800 mt-1">
                          Project: {r.project_title}
                        </h4>
                      )}

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mt-1 mb-3">
                        &ldquo;{r.message || 'Looking for mentor feedback on interview readiness.'}&rdquo;
                      </p>

                      <div className="space-y-1 text-xs text-slate-500">
                        {r.resume_url && (
                          <div className="flex items-center gap-1.5 text-[#8B1A1A]">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="truncate">{r.resume_name || 'Resume Attached'}</span>
                          </div>
                        )}
                        {r.project_url && (
                          <div className="flex items-center gap-1.5 text-blue-600">
                            <Code className="w-3.5 h-3.5" />
                            <span className="truncate">{r.project_url}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">
                        Submitted {new Date(r.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>

                      <button
                        onClick={() => handleClaim(r.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#C9922D] hover:bg-[#a87520] text-[#1A1A2E] text-xs font-bold transition-colors shadow-xs"
                      >
                        Claim for Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Alumni Claimed Reviews Tab */
            alumniClaimedReviews.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-base text-slate-800">No Claimed Reviews Yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Switch to the &ldquo;Open Review Pool&rdquo; tab to claim student review submissions and share your feedback.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alumniClaimedReviews.map(r => (
                  <div
                    key={r.id}
                    className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#8B1A1A]/30 shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B1A1A]">
                          {r.type.toUpperCase()} REVIEW
                        </span>
                        {renderStatusBadge(r.status)}
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-[#1A1A2E] text-[#E5B55A] font-bold text-xs flex items-center justify-center">
                          {r.student_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-[#1A1A2E]">{r.student_name}</p>
                          <p className="text-[11px] text-slate-500">{r.student_branch} · Batch {r.student_batch}</p>
                        </div>
                      </div>

                      {r.project_title && (
                        <h4 className="font-semibold text-xs text-slate-800 mt-1">
                          Project: {r.project_title}
                        </h4>
                      )}

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1 mb-3">
                        &ldquo;{r.message}&rdquo;
                      </p>

                      {/* Inspect Links */}
                      <div className="flex flex-wrap gap-2 pt-1 text-xs">
                        {r.resume_url && (
                          <a
                            href={r.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F5F0EB] text-[#8B1A1A] font-semibold border border-[#8B1A1A]/20"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Resume PDF</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {r.project_url && (
                          <a
                            href={r.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200"
                          >
                            <Code className="w-3.5 h-3.5" />
                            <span>Inspect Code Repo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">
                        Claimed {new Date(r.claimed_at || r.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>

                      {r.status === 'completed' ? (
                        <button
                          onClick={() => setViewFeedbackReview(r)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                        >
                          View Sent Feedback
                        </button>
                      ) : (
                        <button
                          onClick={() => setGivingFeedbackReview(r)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold transition-colors shadow-xs"
                        >
                          Submit Feedback
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}

      {/* Submit Review Request Modal (Student) */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-[#1A1A2E]">Submit for Alumni Mentorship Review</h2>
                <p className="text-xs text-slate-500">Pick what you want our Anurag alumni mentors to critique</p>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="mt-4 space-y-4">
              {submitError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {submitError}
                </div>
              )}

              {/* Step 1: Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Review Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'resume', label: 'Resume Review', icon: FileText },
                    { id: 'project', label: 'Project Review', icon: Code },
                    { id: 'both', label: 'Both (Full Profile)', icon: Sparkles }
                  ].map(item => {
                    const Icon = item.icon;
                    const isSelected = reviewType === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setReviewType(item.id as ReviewType)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          isSelected
                            ? 'border-[#8B1A1A] bg-[#FDF5F5] text-[#8B1A1A] font-bold'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs block leading-tight">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resume Options (if resume or both) */}
              {(reviewType === 'resume' || reviewType === 'both') && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-800 block">Resume Attachment</span>
                  <div className="flex gap-4 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={resumeOption === 'profile'}
                        onChange={() => setResumeOption('profile')}
                        className="text-[#8B1A1A]"
                      />
                      <span>Use Resume from My Profile</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={resumeOption === 'upload'}
                        onChange={() => setResumeOption('upload')}
                        className="text-[#8B1A1A]"
                      />
                      <span>Upload New PDF</span>
                    </label>
                  </div>

                  {resumeOption === 'upload' && (
                    <div className="border border-dashed border-slate-300 rounded-lg p-3 text-center bg-white">
                      <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setCustomResumeFileName(file.name);
                        }}
                        className="text-xs"
                      />
                      {customResumeFileName && (
                        <p className="text-xs text-emerald-600 font-semibold mt-1">
                          ✓ Selected: {customResumeFileName}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Project Options (if project or both) */}
              {(reviewType === 'project' || reviewType === 'both') && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-800 block">Project Details</span>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Project Title *</label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g. Distributed Query Dispatcher with Spring Boot"
                      required={reviewType === 'project'}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">GitHub / Live URL *</label>
                    <input
                      type="url"
                      value={projectUrl}
                      onChange={(e) => setProjectUrl(e.target.value)}
                      placeholder="https://github.com/myusername/project-repo"
                      required={reviewType === 'project'}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Tech Stack</label>
                    <input
                      type="text"
                      value={projectTech}
                      onChange={(e) => setProjectTech(e.target.value)}
                      placeholder="e.g. Java, Spring Boot, MySQL, Redis"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Brief Architecture Summary</label>
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      rows={2}
                      placeholder="What does it do? Any specific bottlenecks or design patterns you want guidance on?"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Note / Message to Reviewer */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Message / Specific Questions for Reviewer
                </label>
                <textarea
                  value={studentMessage}
                  onChange={(e) => setStudentMessage(e.target.value)}
                  rows={3}
                  placeholder="e.g., I'm aiming for SDE-1 campus placement at Infosys/TCS. Please check if my project bullets show strong impact and suggest any missing skills..."
                  required
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit to Alumni Pool'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Give Feedback Modal (Alumni) */}
      {givingFeedbackReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#1A1A2E]">
                  Provide Feedback for {givingFeedbackReview.student_name}
                </h3>
                <p className="text-xs text-slate-500">
                  {givingFeedbackReview.type.toUpperCase()} Review · {givingFeedbackReview.student_branch} &apos;{String(givingFeedbackReview.student_batch).slice(2)}
                </p>
              </div>
              <button
                onClick={() => setGivingFeedbackReview(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="mt-4 space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Overall Rating (1 - 5 Stars)</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 text-lg transition-transform hover:scale-110 ${
                        rating >= star ? 'text-[#C9922D]' : 'text-slate-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Comprehensive Written Critique */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Comprehensive Review Feedback *</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                  placeholder="Provide honest, constructive feedback on layout, clarity, ATS readability, or code architecture..."
                  required
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] resize-none"
                />
              </div>

              {/* Strengths */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Key Strengths (one per line)
                </label>
                <textarea
                  value={strengthsText}
                  onChange={(e) => setStrengthsText(e.target.value)}
                  rows={2}
                  placeholder="e.g.&#10;Clear quantified results in project descriptions&#10;Clean modern 1-page formatting"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] resize-none"
                />
              </div>

              {/* Areas for Improvement */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Actionable Recommendations (one per line)
                </label>
                <textarea
                  value={improvementsText}
                  onChange={(e) => setImprovementsText(e.target.value)}
                  rows={2}
                  placeholder="e.g.&#10;Add unit tests to the backend repository&#10;Highlight Spring Boot annotations instead of generic Java"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGivingFeedbackReview(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFeedback || feedbackText.trim().length < 10}
                  className="px-5 py-2 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {isSubmittingFeedback ? 'Submitting...' : 'Submit Review Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Feedback Modal (Student or Alumni inspect) */}
      {viewFeedbackReview && viewFeedbackReview.feedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#1A1A2E]">Reviewer Feedback</h3>
                <p className="text-xs text-slate-500">
                  Evaluated by {viewFeedbackReview.feedback.reviewer_name} ({viewFeedbackReview.feedback.reviewer_company || 'Alumni Mentor'})
                </p>
              </div>
              <button
                onClick={() => setViewFeedbackReview(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Star Rating Badge */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-lg text-[#C9922D]">
                  {'★'.repeat(viewFeedbackReview.feedback.rating)}{'☆'.repeat(5 - viewFeedbackReview.feedback.rating)}
                </div>
                <span className="text-xs font-bold text-[#8B6210]">
                  {viewFeedbackReview.feedback.rating} out of 5 Rating
                </span>
              </div>

              {/* Written critique */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-1">Mentor Evaluation</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line p-3 bg-slate-50 rounded-lg border border-slate-200">
                  {viewFeedbackReview.feedback.feedback}
                </p>
              </div>

              {/* Strengths */}
              {viewFeedbackReview.feedback.strengths && viewFeedbackReview.feedback.strengths.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-emerald-800 mb-1">Key Strengths</h4>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {viewFeedbackReview.feedback.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {viewFeedbackReview.feedback.improvements && viewFeedbackReview.feedback.improvements.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-amber-800 mb-1">Recommended Next Steps</h4>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {viewFeedbackReview.feedback.improvements.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setViewFeedbackReview(null)}
                  className="px-4 py-2 rounded-lg bg-[#8B1A1A] text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
