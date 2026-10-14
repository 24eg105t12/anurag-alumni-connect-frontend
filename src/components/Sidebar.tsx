import React from 'react';
import {
  Home,
  MessageSquare,
  Briefcase,
  ClipboardList,
  Star,
  PlusCircle,
  Users,
  User,
  Shield,
  Code2,
  Database
} from 'lucide-react';
import { CurrentUser } from '../types';

interface SidebarProps {
  currentUser: CurrentUser;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSpringBootModal: () => void;
  onOpenPostOpportunity: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenSpringBootModal,
  onOpenPostOpportunity
}) => {
  const role = currentUser.user.role;

  const links = [
    {
      id: 'feed',
      label: 'Home Feed',
      icon: Home,
      roles: ['student', 'alumni', 'admin']
    },
    {
      id: 'questions',
      label: 'Q&A Forum',
      icon: MessageSquare,
      roles: ['student', 'alumni', 'admin']
    },
    {
      id: 'opportunities',
      label: 'Opportunities',
      icon: Briefcase,
      roles: ['student', 'alumni', 'admin']
    },
    {
      id: 'reviews',
      label: role === 'student' ? 'My Reviews' : 'Mentorship Reviews',
      icon: role === 'student' ? ClipboardList : Star,
      roles: ['student', 'alumni', 'admin'],
      badge: role === 'alumni' ? 'Pool' : undefined
    },
    {
      id: 'alumni',
      label: 'Alumni Directory',
      icon: Users,
      roles: ['student', 'alumni', 'admin']
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
      roles: ['student', 'alumni', 'admin']
    },
    {
      id: 'admin',
      label: 'Admin Console',
      icon: Shield,
      roles: ['admin']
    }
  ];

  const visibleLinks = links.filter(link => link.roles.includes(role));

  return (
    <aside className="w-60 shrink-0 bg-[#1A1A2E] text-white min-h-[calc(100vh-4rem)] flex flex-col justify-between py-6 px-3 border-r border-slate-800">
      <div className="space-y-6">
        {/* Quick Post Action for Alumni/Admin */}
        {(role === 'alumni' || role === 'admin') && (
          <div className="px-1">
            <button
              onClick={onOpenPostOpportunity}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#C9922D] hover:bg-[#a87520] text-[#1A1A2E] font-bold text-xs shadow-md transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Opportunity</span>
            </button>
          </div>
        )}

        {/* Primary Nav Menu */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Navigation
          </p>
          {visibleLinks.map(link => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#8B1A1A] text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] bg-[#C9922D]/20 text-[#E5B55A] font-semibold px-1.5 py-0.5 rounded">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Backend Tech Specs Box */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 px-1">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded bg-[#8B1A1A]/30 text-[#C9922D] flex items-center justify-center">
              <Database className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white leading-none">Spring Boot + MySQL</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">REST API / Port 8080</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
            Architected with Spring Boot 3.3, JPA Entities & MySQL 8 DDL schema.
          </p>
          <button
            onClick={onOpenSpringBootModal}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-[11px] font-medium transition-colors"
          >
            <Code2 className="w-3 h-3 text-[#E5B55A]" />
            <span>View Architecture</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
