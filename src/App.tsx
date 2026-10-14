import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { FeedView } from './components/feed/FeedView';
import { QuestionsView } from './components/questions/QuestionsView';
import { OpportunitiesView } from './components/opportunities/OpportunitiesView';
import { ReviewsView } from './components/reviews/ReviewsView';
import { AlumniDirectoryView } from './components/alumni/AlumniDirectoryView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminView } from './components/admin/AdminView';
import { SpringBootModal } from './components/SpringBootModal';
import { DemoSwitcherModal } from './components/DemoSwitcherModal';
import { AuthModal } from './components/auth/AuthModal';
import {
  initDatabase,
  getCurrentUser,
  getQuestions,
  getOpportunities,
  getReviews,
  getAlumniDirectory,
  getNotifications
} from './services/storage';
import {
  CurrentUser,
  Question,
  Opportunity,
  ReviewRequest,
  AlumniProfile,
  NotificationItem
} from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    initDatabase();
    return getCurrentUser();
  });

  const [activeTab, setActiveTab] = useState<string>('feed');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [reviews, setReviews] = useState<ReviewRequest[]>([]);
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Navigation targets
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  // Modals
  const [isSpringBootModalOpen, setIsSpringBootModalOpen] = useState(false);
  const [isDemoSwitcherOpen, setIsDemoSwitcherOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register_student' | 'register_alumni'>('login');
  const [isPostOpportunityModalOpen, setIsPostOpportunityModalOpen] = useState(false);
  const [isSubmitReviewModalOpen, setIsSubmitReviewModalOpen] = useState(false);

  const refreshAllData = () => {
    const updatedUser = getCurrentUser();
    setCurrentUser(updatedUser);
    setQuestions(getQuestions());
    setOpportunities(getOpportunities());
    setReviews(getReviews());
    setAlumniList(getAlumniDirectory());
    setNotifications(getNotifications());
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleOpenAuth = (mode: 'login' | 'register_student' | 'register_alumni') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleUserSwitched = (user: CurrentUser) => {
    setCurrentUser(user);
    refreshAllData();
    setSelectedQuestion(null);
    setSelectedOpportunity(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] text-[#1A1A2E] flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedQuestion(null);
          setSelectedOpportunity(null);
        }}
        notifications={notifications}
        onOpenSpringBootModal={() => setIsSpringBootModalOpen(true)}
        onOpenDemoSwitcher={() => setIsDemoSwitcherOpen(true)}
        onOpenAuthModal={handleOpenAuth}
        onRefreshData={refreshAllData}
      />

      {/* Architecture Separation Banner */}
      <div className="bg-[#1A1A2E] text-white border-b border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200">Separated Full-Stack:</span>
            <span className="text-cyan-400 font-mono">React 19 SPA (/src)</span>
            <span className="text-slate-500">·</span>
            <span className="text-[#E5B55A] font-mono">Spring Boot 3.3 (/backend)</span>
            <span className="text-slate-500">·</span>
            <span className="text-emerald-400 font-mono hidden sm:inline">MySQL 8.0 DDL</span>
          </div>
          <button
            onClick={() => setIsSpringBootModalOpen(true)}
            className="text-[11px] font-semibold text-[#E5B55A] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Explore /backend directory</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Main Workspace with Desktop Sidebar & Viewport */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Left Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            currentUser={currentUser}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setSelectedQuestion(null);
              setSelectedOpportunity(null);
            }}
            onOpenSpringBootModal={() => setIsSpringBootModalOpen(true)}
            onOpenPostOpportunity={() => {
              setActiveTab('opportunities');
              setIsPostOpportunityModalOpen(true);
            }}
          />
        </div>

        {/* Main View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 overflow-x-hidden">
          {activeTab === 'feed' && (
            <FeedView
              currentUser={currentUser}
              questions={questions}
              opportunities={opportunities}
              reviews={reviews}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                setSelectedQuestion(null);
                setSelectedOpportunity(null);
              }}
              onSelectQuestion={(q) => {
                setSelectedQuestion(q);
                setActiveTab('questions');
              }}
              onSelectOpportunity={(opp) => {
                setSelectedOpportunity(opp);
                setActiveTab('opportunities');
              }}
              onOpenAskQuestion={() => {
                setActiveTab('questions');
              }}
              onOpenPostOpportunity={() => {
                setActiveTab('opportunities');
                setIsPostOpportunityModalOpen(true);
              }}
              onOpenSubmitReview={() => {
                setActiveTab('reviews');
                setIsSubmitReviewModalOpen(true);
              }}
            />
          )}

          {activeTab === 'questions' && (
            <QuestionsView
              currentUser={currentUser}
              questions={questions}
              selectedQuestion={selectedQuestion}
              onSelectQuestion={setSelectedQuestion}
              onRefreshQuestions={refreshAllData}
            />
          )}

          {activeTab === 'opportunities' && (
            <OpportunitiesView
              currentUser={currentUser}
              opportunities={opportunities}
              selectedOpportunity={selectedOpportunity}
              onSelectOpportunity={setSelectedOpportunity}
              onRefreshOpportunities={refreshAllData}
              isPostModalOpen={isPostOpportunityModalOpen}
              setIsPostModalOpen={setIsPostOpportunityModalOpen}
            />
          )}

          {activeTab === 'reviews' && (
            <ReviewsView
              currentUser={currentUser}
              reviews={reviews}
              onRefreshReviews={refreshAllData}
              isSubmitModalOpen={isSubmitReviewModalOpen}
              setIsSubmitModalOpen={setIsSubmitReviewModalOpen}
            />
          )}

          {activeTab === 'alumni' && (
            <AlumniDirectoryView
              currentUser={currentUser}
              alumniList={alumniList}
              onOpenAskQuestion={() => setActiveTab('questions')}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              onRefreshUser={refreshAllData}
            />
          )}

          {activeTab === 'admin' && (
            <AdminView
              onRefreshData={refreshAllData}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedQuestion(null);
          setSelectedOpportunity(null);
        }}
      />

      {/* Spring Boot & MySQL Spec Viewer Modal */}
      <SpringBootModal
        isOpen={isSpringBootModalOpen}
        onClose={() => setIsSpringBootModalOpen(false)}
      />

      {/* Demo Switcher Quick Modal */}
      <DemoSwitcherModal
        isOpen={isDemoSwitcherOpen}
        onClose={() => setIsDemoSwitcherOpen(false)}
        currentUser={currentUser}
        onUserSwitched={handleUserSwitched}
        onOpenAuth={handleOpenAuth}
      />

      {/* Auth / Dual Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthenticated={handleUserSwitched}
      />
    </div>
  );
}
