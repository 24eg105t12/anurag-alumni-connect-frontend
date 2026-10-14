import React from 'react';
import { X, Check, GraduationCap, Briefcase, ShieldCheck, UserPlus, ArrowRight } from 'lucide-react';
import { CurrentUser } from '../types';
import { switchUser } from '../services/storage';

interface DemoSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  onUserSwitched: (user: CurrentUser) => void;
  onOpenAuth: (mode: 'login' | 'register_student' | 'register_alumni') => void;
}

export const DemoSwitcherModal: React.FC<DemoSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserSwitched,
  onOpenAuth
}) => {
  if (!isOpen) return null;

  const personas = [
    {
      id: 'user_riya',
      name: 'Riya Mehta',
      email: 'riya.m@anurag.edu.in',
      role: 'student',
      title: 'B.Tech CSE (Batch 2026) · CGPA: 8.25',
      description: 'Student view: Can ask questions, filter opportunities, click "Apply Now", submit resume/project reviews, and manage student profile.',
      icon: GraduationCap,
      accent: 'border-blue-400 bg-blue-50/50'
    },
    {
      id: 'user_karthik',
      name: 'Karthik Reddy',
      email: 'karthik.r@anurag.edu.in',
      role: 'alumni',
      title: 'Software Development Engineer @ Infosys · Batch 2022',
      description: 'Alumni view: Can post jobs/internships with referrals, answer student questions in Q&A, claim pending student reviews from Open Pool, and provide 1-5 star ratings & feedback.',
      icon: Briefcase,
      accent: 'border-amber-400 bg-amber-50/50'
    },
    {
      id: 'user_priya',
      name: 'Priya Sharma',
      email: 'priya.s@anurag.edu.in',
      role: 'alumni',
      title: 'Lead Data Analyst @ TCS · Batch 2021',
      description: 'Alumni mentor view: Tech lead reviewing student resumes, answering career guidance inquiries, and sharing corporate referral links.',
      icon: Briefcase,
      accent: 'border-emerald-400 bg-emerald-50/50'
    },
    {
      id: 'user_admin',
      name: 'Prof. Dr. V. Rao',
      email: 'admin@anurag.edu.in',
      role: 'admin',
      title: 'Dean of Alumni Relations & Career Development Cell',
      description: 'University Admin view: Full administrative console, verify alumni accounts, toggle user active status, moderate community content and view placement analytics.',
      icon: ShieldCheck,
      accent: 'border-red-400 bg-red-50/50'
    }
  ];

  const handleSelect = (userId: string) => {
    const updated = switchUser(userId);
    onUserSwitched(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#1A1A2E]">Switch Demo Persona</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantly toggle between verified Student, Alumni, and Admin accounts
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {personas.map(p => {
            const isSelected = currentUser.user.id === p.id;
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                onClick={() => handleSelect(p.id)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#8B1A1A] bg-[#FDF5F5] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      p.role === 'admin' ? 'bg-[#8B1A1A] text-white' :
                      p.role === 'alumni' ? 'bg-[#C9922D] text-white' :
                      'bg-[#1A1A2E] text-white'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1A1A2E]">{p.name}</span>
                        <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                          p.role === 'admin' ? 'bg-[#8B1A1A]/10 text-[#8B1A1A]' :
                          p.role === 'alumni' ? 'bg-[#C9922D]/15 text-[#9E6F18]' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {p.role}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 mt-0.5">{p.title}</p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{p.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#8B1A1A] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Register Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500">Need to create a new profile?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenAuth('register_student');
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#8B1A1A]" />
              <span>Register Student</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAuth('register_alumni');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Register Alumni</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
