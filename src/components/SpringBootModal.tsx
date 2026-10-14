import React, { useState } from 'react';
import {
  X,
  Code2,
  Database,
  Copy,
  Check,
  FileCode,
  FolderTree,
  Terminal,
  Shield,
  Server,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SPRING_BOOT_PROJECT_FILES, SpringBootFile } from '../services/springBootCode';

interface SpringBootModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpringBootModal: React.FC<SpringBootModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<SpringBootFile>(SPRING_BOOT_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'structure' | 'files' | 'mysql' | 'setup'>('structure');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#1A1A2E] text-slate-100 rounded-2xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl border border-slate-700/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:px-6 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B1A1A] text-[#E5B55A] flex items-center justify-center shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Full-Stack Architecture: React + Spring Boot + MySQL
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#C9922D]/20 text-[#E5B55A] border border-[#C9922D]/30">
                  Separated Structure
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Frontend: React 19 SPA · Backend: Spring Boot 3.3.4 (Java 17) · Database: MySQL 8.0
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center p-1 bg-slate-800 rounded-lg text-xs font-medium">
              <button
                onClick={() => setActiveTab('structure')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'structure' ? 'bg-[#8B1A1A] text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Project Layout
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'files' ? 'bg-[#8B1A1A] text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Backend Files
              </button>
              <button
                onClick={() => setActiveTab('mysql')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'mysql' ? 'bg-[#8B1A1A] text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                MySQL Schema
              </button>
              <button
                onClick={() => setActiveTab('setup')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'setup' ? 'bg-[#8B1A1A] text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Run Guide
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Project Structure Layout */}
        {activeTab === 'structure' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-900/40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Frontend Card */}
              <div className="p-5 rounded-xl bg-slate-800/70 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                    <h3 className="font-bold text-sm text-white">Frontend: React 19</h3>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    Port 3000 / 5173
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Modern React 19 single page application with Tailwind CSS, modular components, Anurag brand tokens, and client state synchronization.
                </p>
                <div className="bg-black/50 p-3 rounded-lg font-mono text-xs text-slate-300 space-y-1">
                  <p className="text-cyan-400 font-bold">src/</p>
                  <p className="pl-3">├── components/ (Feed, Q&A, Jobs, Reviews)</p>
                  <p className="pl-3">├── services/ (API clients, storage, Spring DTOs)</p>
                  <p className="pl-3">├── types/ (User, Opportunity, Review models)</p>
                  <p className="pl-3">└── data/ (Anurag initial seed data)</p>
                </div>
              </div>

              {/* Backend Card */}
              <div className="p-5 rounded-xl bg-slate-800/70 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#E5B55A]"></span>
                    <h3 className="font-bold text-sm text-white">Backend: Spring Boot 3.3</h3>
                  </div>
                  <span className="text-[11px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    Port 8080 /api/v1
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Enterprise Java 17 application with Spring Data JPA, Spring Security 6 stateless JWT tokens, and HikariCP connection pooling.
                </p>
                <div className="bg-black/50 p-3 rounded-lg font-mono text-xs text-slate-300 space-y-1">
                  <p className="text-[#E5B55A] font-bold">backend/</p>
                  <p className="pl-3">├── pom.xml (Maven dependencies)</p>
                  <p className="pl-3">└── src/main/</p>
                  <p className="pl-6">├── java/.../ (Controllers, Services, Models)</p>
                  <p className="pl-6">└── resources/ (application.yml, schema.sql)</p>
                </div>
              </div>
            </div>

            {/* Visual Architecture Flow */}
            <div className="p-5 rounded-xl bg-black/40 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-[#E5B55A] uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Data & API Flow
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700">
                  <span className="font-bold text-cyan-400 block mb-1">React SPA</span>
                  <p className="text-slate-400 text-[11px]">User actions, resume PDF drop, reactive UI state</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700 flex flex-col justify-center items-center">
                  <div className="flex items-center gap-1 font-bold text-amber-400 mb-1">
                    <span>REST / JWT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-slate-400 text-[11px]">Spring Security 6 with Bearer tokens</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700">
                  <span className="font-bold text-emerald-400 block mb-1">MySQL 8.0</span>
                  <p className="text-slate-400 text-[11px]">10 relational tables, foreign keys & indexes</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Backend Source Code Explorer */}
        {activeTab === 'files' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* File List */}
            <div className="w-full md:w-80 bg-slate-900/60 border-r border-slate-800 p-3 overflow-y-auto shrink-0 space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
                Backend Files ({SPRING_BOOT_PROJECT_FILES.length})
              </div>
              {SPRING_BOOT_PROJECT_FILES.map(file => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#8B1A1A] text-white font-semibold shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#E5B55A]' : 'text-slate-400'}`} />
                      <span className="truncate font-mono text-[11px]">{file.path}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Code Viewer */}
            <div className="flex-1 flex flex-col bg-[#0D1117] overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div>
                  <span className="font-mono text-xs font-bold text-white">{selectedFile.path}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors border border-slate-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-200 select-text">
                <pre className="whitespace-pre">{selectedFile.content}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: MySQL Schema */}
        {activeTab === 'mysql' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">MySQL 8 Relational Schema (10 Tables)</h3>
                <p className="text-xs text-slate-400">Saved in <code className="text-[#E5B55A]">backend/src/main/resources/schema.sql</code></p>
              </div>
              <button
                onClick={() => {
                  const schemaFile = SPRING_BOOT_PROJECT_FILES.find(f => f.path.includes('schema.sql'));
                  if (schemaFile) {
                    navigator.clipboard.writeText(schemaFile.content);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-[#8B1A1A] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#6B1010]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy schema.sql</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-[#E5B55A]">1. users</span>
                <p className="text-slate-400 text-[11px] mt-1">id (PK), email (UQ), password_hash, role (ENUM), is_verified, is_active, created_at</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-[#E5B55A]">2. student_profiles</span>
                <p className="text-slate-400 text-[11px] mt-1">id (PK), user_id (FK), name, phone, branch, batch_year, cgpa, skills (JSON), bio, resume_url</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-[#E5B55A]">3. alumni_profiles</span>
                <p className="text-slate-400 text-[11px] mt-1">id (PK), user_id (FK), name, current_company, current_role, experience_years, is_mentor, skills (JSON)</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-[#E5B55A]">4. opportunities</span>
                <p className="text-slate-400 text-[11px] mt-1">id (PK), posted_by (FK), title, company, type, salary_min, salary_max, apply_link, is_referral_available</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-[#E5B55A]">5. questions</span>
                <p className="text-slate-400 text-[11px] mt-1">id (PK), author_id (FK), title, body, category, tags (JSON), view_count, like_count, is_resolved</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-[#E5B55A]">6. answers</span>
                <p className="text-slate-400 text-[11px] mt-1">id (PK), question_id (FK), author_id (FK), body, upvotes, is_accepted</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-[#E5B55A]">7. review_requests</span>
                <p className="text-slate-400 text-[11px] mt-1">id (PK), student_id (FK), reviewer_id (FK), type, status, resume_url, project_title, project_url</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-[#E5B55A]">8. review_feedback</span>
                <p className="text-slate-400 text-[11px] mt-1">id (PK), request_id (FK UQ), reviewer_id (FK), rating (1-5), feedback, strengths (JSON), improvements (JSON)</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-[#E5B55A]">9. question_likes</span>
                <p className="text-slate-400 text-[11px] mt-1">id (PK), question_id (FK), user_id (FK) - UNIQUE prevents duplicate votes</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-[#E5B55A]">10. notifications</span>
                <p className="text-slate-400 text-[11px] mt-1">id (PK), user_id (FK), title, message, type, is_read, link, created_at</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Setup Guide */}
        {activeTab === 'setup' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-900/40">
            <div className="p-5 rounded-xl bg-black/60 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-[#E5B55A] uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                How to Run Separated Backend & Frontend
              </h4>

              <div className="space-y-4 font-mono text-xs text-slate-300">
                <div>
                  <span className="text-cyan-400 font-bold block mb-1">Terminal 1 — Spring Boot Backend (Port 8080):</span>
                  <div className="bg-slate-900 p-3 rounded text-slate-200 space-y-1">
                    <p className="text-slate-500"># Navigate to backend directory</p>
                    <p className="text-amber-300">cd backend</p>
                    <p className="text-slate-500"># Start Spring Boot application with Maven</p>
                    <p className="text-emerald-400">mvn clean spring-boot:run</p>
                  </div>
                </div>

                <div>
                  <span className="text-cyan-400 font-bold block mb-1">Terminal 2 — React Frontend (Port 3000):</span>
                  <div className="bg-slate-900 p-3 rounded text-slate-200 space-y-1">
                    <p className="text-slate-500"># From root project directory</p>
                    <p className="text-emerald-400">npm run dev</p>
                    <p className="text-slate-500"># Open browser at http://localhost:3000</p>
                  </div>
                </div>

                <div>
                  <span className="text-cyan-400 font-bold block mb-1">Database — MySQL 8.0:</span>
                  <div className="bg-slate-900 p-3 rounded text-slate-200 space-y-1">
                    <p className="text-slate-500"># Initialize database with schema & initial seeds</p>
                    <p className="text-emerald-400">mysql -u root -p anurag_alumni_db &lt; backend/src/main/resources/schema.sql</p>
                    <p className="text-emerald-400">mysql -u root -p anurag_alumni_db &lt; backend/src/main/resources/data.sql</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3 px-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>All Backend Files Available under <code className="text-[#E5B55A]">/backend</code> directory</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
