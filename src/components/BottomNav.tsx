import React from 'react';
import {
  Home,
  MessageSquare,
  Briefcase,
  ClipboardList,
  Star,
  User,
  Shield
} from 'lucide-react';
import { CurrentUser } from '../types';

interface BottomNavProps {
  currentUser: CurrentUser;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentUser,
  activeTab,
  setActiveTab
}) => {
  const role = currentUser.user.role;

  const items = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'questions', label: 'Q&A', icon: MessageSquare },
    { id: 'opportunities', label: 'Jobs', icon: Briefcase },
    {
      id: 'reviews',
      label: role === 'student' ? 'Reviews' : 'Pool',
      icon: role === 'student' ? ClipboardList : Star
    },
    {
      id: role === 'admin' ? 'admin' : 'profile',
      label: role === 'admin' ? 'Admin' : 'Profile',
      icon: role === 'admin' ? Shield : User
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1A1A2E] border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
              isActive ? 'text-[#C9922D]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
