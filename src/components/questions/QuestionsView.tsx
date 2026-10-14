import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  ThumbsUp,
  CheckCircle2,
  Trash2,
  Check,
  Send,
  X,
  Eye,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { CurrentUser, Question, Answer } from '../../types';
import {
  QUESTION_CATEGORIES,
  MASTER_SKILLS
} from '../../data/initialData';
import {
  createQuestion,
  deleteQuestion,
  toggleLikeQuestion,
  isQuestionLikedByCurrentUser,
  addAnswer,
  markAnswerAccepted,
  getQuestionById
} from '../../services/storage';

interface QuestionsViewProps {
  currentUser: CurrentUser;
  questions: Question[];
  selectedQuestion: Question | null;
  onSelectQuestion: (question: Question | null) => void;
  onRefreshQuestions: () => void;
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({
  currentUser,
  questions,
  selectedQuestion,
  onSelectQuestion,
  onRefreshQuestions
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Ask question modal state
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newCategory, setNewCategory] = useState('Placements');
  const [newTags, setNewTags] = useState<string[]>(['Placements']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  // Detail view state
  const [answersList, setAnswersList] = useState<Answer[]>([]);
  const [newAnswerText, setNewAnswerText] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  // When a question is selected, load its answers
  React.useEffect(() => {
    if (selectedQuestion) {
      const { answers } = getQuestionById(selectedQuestion.id);
      setAnswersList(answers);
    }
  }, [selectedQuestion]);

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesTag = !selectedTag || q.tags.includes(selectedTag);
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesTag && matchesSearch;
  });

  const handleLike = (e: React.MouseEvent, qId: string) => {
    e.stopPropagation();
    toggleLikeQuestion(qId);
    onRefreshQuestions();
    if (selectedQuestion && selectedQuestion.id === qId) {
      const { question } = getQuestionById(qId);
      if (question) onSelectQuestion(question);
    }
  };

  const handleDelete = (e: React.MouseEvent, qId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      try {
        deleteQuestion(qId);
        onRefreshQuestions();
        if (selectedQuestion?.id === qId) {
          onSelectQuestion(null);
        }
      } catch (err: any) {
        alert(err.message || 'Failed to delete question');
      }
    }
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim().length < 3) {
      setFormError('Title must be at least 3 characters long');
      return;
    }
    if (newBody.trim().length < 10) {
      setFormError('Please provide more description (at least 10 characters)');
      return;
    }

    setIsSubmittingQuestion(true);
    try {
      createQuestion(newTitle.trim(), newBody.trim(), newTags, newCategory);
      setIsAskModalOpen(false);
      setNewTitle('');
      setNewBody('');
      setNewTags(['Placements']);
      setFormError(null);
      onRefreshQuestions();
    } catch (err: any) {
      setFormError(err.message || 'Error publishing question');
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const handleAddAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || newAnswerText.trim().length < 5) return;

    setIsSubmittingAnswer(true);
    try {
      addAnswer(selectedQuestion.id, newAnswerText.trim());
      setNewAnswerText('');
      const { answers } = getQuestionById(selectedQuestion.id);
      setAnswersList(answers);
      onRefreshQuestions();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleAcceptAnswer = (ansId: string) => {
    if (!selectedQuestion) return;
    markAnswerAccepted(selectedQuestion.id, ansId);
    const { answers } = getQuestionById(selectedQuestion.id);
    setAnswersList(answers);
    onRefreshQuestions();
  };

  const toggleTagSelection = (tag: string) => {
    if (newTags.includes(tag)) {
      if (newTags.length > 1) {
        setNewTags(newTags.filter(t => t !== tag));
      }
    } else {
      if (newTags.length < 5) {
        setNewTags([...newTags, tag]);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] tracking-tight">
            Q&A Community Forum
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ask technical interview questions, preparation strategies, or placement advice
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            setIsAskModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ask a Question</span>
        </button>
      </div>

      {/* If a question detail is active, show the detail view */}
      {selectedQuestion ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <button
              onClick={() => onSelectQuestion(null)}
              className="text-xs font-semibold text-[#8B1A1A] hover:underline flex items-center gap-1"
            >
              ← Back to All Questions
            </button>

            <div className="flex items-center gap-3">
              {(selectedQuestion.author_id === currentUser.user.id || currentUser.user.role === 'admin') && (
                <button
                  onClick={(e) => handleDelete(e, selectedQuestion.id)}
                  className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Question</span>
                </button>
              )}
            </div>
          </div>

          {/* Question Body */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold text-[#1A1A2E] leading-snug">
                {selectedQuestion.title}
              </h2>
              {selectedQuestion.is_resolved && (
                <span className="shrink-0 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Resolved
                </span>
              )}
            </div>

            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {selectedQuestion.body}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              {selectedQuestion.tags.map(t => (
                <span
                  key={t}
                  className="text-xs font-medium bg-[#F5F0EB] text-[#8B1A1A] border border-[#8B1A1A]/20 px-2.5 py-0.5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">{selectedQuestion.author_name}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedQuestion.author_branch}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {new Date(selectedQuestion.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleLike(e, selectedQuestion.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    isQuestionLikedByCurrentUser(selectedQuestion.id)
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{selectedQuestion.like_count}</span>
                </button>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedQuestion.view_count} views</span>
                </span>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-[#1A1A2E] flex items-center gap-2">
              <span>Answers & Advice</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {answersList.length}
              </span>
            </h3>

            {answersList.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-600 font-medium">No answers yet.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Be the first alumni or peer to provide guidance on this topic!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {answersList.map(ans => (
                  <div
                    key={ans.id}
                    className={`p-4 rounded-xl border transition-all ${
                      ans.is_accepted
                        ? 'border-emerald-300 bg-emerald-50/40 shadow-xs'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#1A1A2E] text-[#E5B55A] font-bold text-xs flex items-center justify-center">
                          {ans.author_name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-[#1A1A2E]">{ans.author_name}</span>
                            <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded ${
                              ans.author_role === 'alumni' ? 'bg-[#C9922D]/20 text-[#8B6210]' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {ans.author_role}
                            </span>
                          </div>
                          {ans.author_company && (
                            <p className="text-[11px] text-slate-500 font-medium">{ans.author_company}</p>
                          )}
                        </div>
                      </div>

                      {ans.is_accepted ? (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Best Answer
                        </span>
                      ) : (
                        selectedQuestion.author_id === currentUser.user.id && (
                          <button
                            onClick={() => handleAcceptAnswer(ans.id)}
                            className="text-xs text-slate-500 hover:text-emerald-700 font-medium px-2 py-0.5 rounded hover:bg-slate-100 border border-slate-200"
                          >
                            Mark as Best Answer
                          </button>
                        )
                      )}
                    </div>

                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line pl-9">
                      {ans.body}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pl-9 pt-2 mt-2 border-t border-slate-100">
                      <span>
                        Answered on {new Date(ans.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Answer Post Form */}
            <form onSubmit={handleAddAnswer} className="pt-4 border-t border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-[#1A1A2E]">
                Write your answer or guidance:
              </label>
              <textarea
                value={newAnswerText}
                onChange={(e) => setNewAnswerText(e.target.value)}
                placeholder="Share technical tips, problem-solving insights, or interview experience..."
                rows={4}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Posting as <strong>{currentUser.name}</strong> ({currentUser.user.role})
                </span>
                <button
                  type="submit"
                  disabled={isSubmittingAnswer || newAnswerText.trim().length < 5}
                  className="px-4 py-2 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Answer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Question List View */
        <div className="space-y-4">
          {/* Search & Category Tabs */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions by keyword, topic, or tag..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
              />
            </div>

            {/* Category Segmented Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {QUESTION_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#8B1A1A] text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}

              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#C9922D] text-white flex items-center gap-1"
                >
                  <span>Tag: {selectedTag}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* List of Questions */}
          {filteredQuestions.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-base text-slate-800">No questions found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No questions match your current query or filter. Be the first to start a conversation!
              </p>
              <button
                onClick={() => setIsAskModalOpen(true)}
                className="mt-4 px-4 py-2 rounded-lg bg-[#8B1A1A] text-white text-xs font-bold"
              >
                Ask a Question
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map(q => (
                <div
                  key={q.id}
                  onClick={() => onSelectQuestion(q)}
                  className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 hover:border-[#8B1A1A]/40 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-sm sm:text-base text-[#1A1A2E] hover:text-[#8B1A1A] transition-colors leading-snug">
                      {q.title}
                    </h3>
                    {q.is_resolved && (
                      <span className="shrink-0 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Answered
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {q.body}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {q.tags.map(tag => (
                      <button
                        key={tag}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTag(tag);
                        }}
                        className="text-[11px] font-medium bg-[#F5F0EB] text-[#8B1A1A] border border-[#8B1A1A]/15 px-2 py-0.5 rounded-full hover:bg-[#8B1A1A] hover:text-white transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center">
                        {q.author_name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-800">{q.author_name}</span>
                      <span aria-hidden="true">·</span>
                      <span>{q.author_branch}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => handleLike(e, q.id)}
                        className={`flex items-center gap-1 text-xs font-semibold ${
                          isQuestionLikedByCurrentUser(q.id) ? 'text-rose-600' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="font-mono">{q.like_count}</span>
                      </button>

                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{q.answers_count}</span>
                      </span>

                      {(q.author_id === currentUser.user.id || currentUser.user.role === 'admin') && (
                        <button
                          onClick={(e) => handleDelete(e, q.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ask Question Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#1A1A2E]">Ask a Community Question</h2>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="mt-4 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Question Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., How do I crack Infosys SP for CSE 2026 batch?"
                  required
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Detailed Explanation / Context *
                </label>
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  rows={4}
                  placeholder="Describe your query in detail, specific topics you are finding difficult, or exact interview format..."
                  required
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
                  >
                    {QUESTION_CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Select Tags (Max 5)
                  </label>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 border border-slate-200 rounded-lg">
                    {['Placements', 'DSA', 'Infosys', 'TCS', 'Career Advice', 'AI & ML', 'GATE', 'Interview'].map(tag => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTagSelection(tag)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-colors ${
                          newTags.includes(tag)
                            ? 'bg-[#8B1A1A] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingQuestion}
                  className="px-5 py-2 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {isSubmittingQuestion ? 'Publishing...' : 'Publish Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
