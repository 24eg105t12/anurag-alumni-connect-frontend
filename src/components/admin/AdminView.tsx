import React, { useState } from 'react';
import {
  Shield,
  Users,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Briefcase,
  MessageSquare,
  ClipboardList
} from 'lucide-react';
import { User } from '../../types';
import { getAdminStats, toggleUserVerified, toggleUserActive } from '../../services/storage';

interface AdminViewProps {
  onRefreshData: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onRefreshData }) => {
  const [stats, setStats] = useState(getAdminStats());
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const refreshStats = () => {
    setStats(getAdminStats());
    onRefreshData();
  };

  const handleToggleVerified = (userId: string) => {
    toggleUserVerified(userId);
    refreshStats();
  };

  const handleToggleActive = (userId: string) => {
    toggleUserActive(userId);
    refreshStats();
  };

  const filteredUsers = stats.users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch = u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E] tracking-tight flex items-center gap-2">
          <Shield className="w-6 h-6 text-[#8B1A1A]" />
          <span>University Administrative Console</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Campus verification panel, user activity management, and moderation controls
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Total Users</span>
          <span className="text-2xl font-black text-slate-800 font-mono">{stats.totalUsers}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            {stats.studentsCount} Students · {stats.alumniCount} Alumni
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Active Opportunities</span>
          <span className="text-2xl font-black text-[#C9922D] font-mono">{stats.opportunitiesCount}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Verified postings</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Forum Questions</span>
          <span className="text-2xl font-black text-[#8B1A1A] font-mono">{stats.questionsCount}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Community Q&A</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Review Requests</span>
          <span className="text-2xl font-black text-emerald-600 font-mono">{stats.pendingReviews}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            {stats.completedReviews} Completed
          </span>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900">User Account Directory</h2>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email..."
              className="text-xs p-2 rounded-lg border border-slate-200 w-48 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A]"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="alumni">Alumni</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">User Email</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Verified Status</th>
                <th className="py-2.5 px-3">Account State</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 font-medium text-slate-800 font-mono">{u.email}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-[#8B1A1A]/10 text-[#8B1A1A]' :
                      u.role === 'alumni' ? 'bg-[#C9922D]/20 text-[#8B6210]' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {u.is_verified ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold flex items-center gap-1">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                      u.is_active ? 'bg-emerald-500' : 'bg-red-500'
                    }`} />
                    <span>{u.is_active ? 'Active' : 'Suspended'}</span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => handleToggleVerified(u.id)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                    >
                      {u.is_verified ? 'Unverify' : 'Verify'}
                    </button>
                    <button
                      onClick={() => handleToggleActive(u.id)}
                      className={`px-2.5 py-1 rounded font-medium ${
                        u.is_active
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {u.is_active ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
