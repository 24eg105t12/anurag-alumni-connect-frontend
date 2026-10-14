import React, { useState } from 'react';
import {
  GraduationCap,
  Bell,
  Code2,
  Users,
  LogOut,
  ChevronDown,
  Check,
  User,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { CurrentUser, NotificationItem } from '../types';
import { markAllNotificationsRead } from '../services/storage';

interface NavbarProps {
  currentUser: CurrentUser;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: NotificationItem[];
  onOpenSpringBootModal: () => void;
  onOpenDemoSwitcher: () => void;
  onOpenAuthModal: (mode: 'login' | 'register_student' | 'register_alumni') => void;
  onRefreshData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  notifications,
  onOpenSpringBootModal,
  onOpenDemoSwitcher,
  onOpenAuthModal,
  onRefreshData
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    onRefreshData();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-[#8B1A1A] text-white">
            <ShieldCheck className="w-3 h-3" />
            Admin
          </span>
        );
      case 'alumni':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-[#C9922D] text-white">
            <Briefcase className="w-3 h-3" />
            Alumni
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800">
            <GraduationCap className="w-3 h-3" />
            Student
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#8B1A1A] text-white shadow-md border-b border-[#6B1010]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand wordmark with crest */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('feed')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-[#C9922D] shadow-sm group-hover:bg-white/15 transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white whitespace-nowrap">
                  Alumni Connect
                </span>
                <span className="text-[#E5B55A] text-xs font-semibold uppercase tracking-wider hidden sm:inline">
                  • Anurag University
                </span>
              </div>
              <p className="text-[11px] text-white/70 hidden sm:block leading-none mt-0.5">
                Official Student-Alumni Network
              </p>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'feed'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'questions'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Q&A Forum
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'opportunities'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Opportunities
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab('alumni')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'alumni'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Alumni Directory
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Spring Boot & MySQL Spec Viewer Button */}
          <button
            onClick={onOpenSpringBootModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md bg-[#1A1A2E] text-[#E5B55A] border border-[#C9922D]/40 hover:bg-[#252542] hover:border-[#C9922D] transition-colors whitespace-nowrap shadow-sm"
            title="Inspect Spring Boot and MySQL Backend Architecture"
          >
            <Code2 className="w-3.5 h-3.5 text-[#E5B55A]" />
            <span className="hidden sm:inline">Spring Boot & MySQL</span>
            <span className="sm:hidden font-mono">Backend</span>
          </button>

          {/* Persona Switcher Quick Dropdown Button */}
          <button
            onClick={onOpenDemoSwitcher}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors whitespace-nowrap"
            title="Switch demo role between Student, Alumni, and Admin"
          >
            <Users className="w-3.5 h-3.5 text-[#E5B55A]" />
            <span>Switch Role</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-md hover:bg-white/10 text-white/90 hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9922D] text-[#1A1A2E] text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 z-50 overflow-hidden">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1A1A2E]">Notifications</span>
                    <span className="text-xs font-medium text-slate-500 font-mono">
                      ({unreadCount} new)
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-[#8B1A1A] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Check className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.link) setActiveTab(n.link);
                          setShowNotifications(false);
                        }}
                        className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                          !n.is_read ? 'bg-amber-50/50' : ''
                        }`}
                      >
                        <p className="font-semibold text-slate-900 mb-0.5">{n.title}</p>
                        <p className="text-slate-600 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(n.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Current User Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-[#1A1A2E] text-[#E5B55A] font-bold text-xs flex items-center justify-center border border-white/20">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white truncate max-w-[120px]">
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-1">
                  {getRoleBadge(currentUser.user.role)}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-white/70 hidden sm:block" />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 z-50 overflow-hidden divide-y divide-slate-100">
                <div className="p-3 bg-slate-50">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.user.email}</p>
                  <div className="mt-1.5">{getRoleBadge(currentUser.user.role)}</div>
                </div>

                <div className="p-1">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      onOpenDemoSwitcher();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md flex items-center gap-2"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    Switch Persona / Role
                  </button>
                  <button
                    onClick={() => {
                      onOpenSpringBootModal();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md flex items-center gap-2"
                  >
                    <Code2 className="w-3.5 h-3.5 text-slate-500" />
                    Spring Boot & MySQL Code
                  </button>
                </div>

                <div className="p-1">
                  <button
                    onClick={() => {
                      onOpenAuthModal('login');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out / Switch Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
