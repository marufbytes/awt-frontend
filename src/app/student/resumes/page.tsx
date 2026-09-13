"use client";

import React, { useState } from 'react';
import { 
  Briefcase, Calendar, Clock, FileText, Upload, Plus, 
  Trash2, Edit3, CheckCircle2, Eye, X, AlertCircle, 
  LayoutDashboard, User, Building2
} from 'lucide-react';
import Link from 'next/link';

interface Resume {
  id: string;
  name: string;
  uploadDate: string;
  fileSize: string;
  isDefault: boolean;
}

export default function ResumeManagement(): React.JSX.Element {
  // Student profile info for sidebar consistency
  const student = {
    name: "Zayed",
    id: "23-51421-1",
    major: "Software Engineering",
    totalResumes: 2,
  };

  // Mock initial resumes state
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: "res-001",
      name: "Zayed_Software_Engineer_Resume.pdf",
      uploadDate: "10 Aug 2026",
      fileSize: "2.4 MB",
      isDefault: true
    },
    {
      id: "res-002",
      name: "Zayed_Frontend_Dev_CV.pdf",
      uploadDate: "28 Jul 2026",
      fileSize: "1.8 MB",
      isDefault: false
    }
  ]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newResumeName, setNewResumeName] = useState<string>('');

  // Handlers for features
  const handleSetDefault = (id: string) => {
    setResumes(resumes.map(res => ({
      ...res,
      isDefault: res.id === id
    })));
  };

  const handleDelete = (id: string) => {
    setResumes(resumes.filter(res => res.id !== id));
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResumeName) return;

    const newResume: Resume = {
      id: `res-${Date.now()}`,
      name: newResumeName.endsWith('.pdf') ? newResumeName : `${newResumeName}.pdf`,
      uploadDate: "Today",
      fileSize: "2.1 MB",
      isDefault: resumes.length === 0
    };

    setResumes([newResume, ...resumes]);
    setNewResumeName('');
    setIsUploadModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* ================= SIDEBAR (Consistent with Internship & Dashboard layout) ================= */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-200">
              U
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">UniCareer</h1>
              <span className="text-xs text-blue-600 font-semibold tracking-wide">Connect</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            <Link href="/student/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/student/internships" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
              <Briefcase className="w-5 h-5" />
              <span>Internships</span>
            </Link>
            <Link href="/student/resumes" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-medium transition-colors">
              <FileText className="w-5 h-5" />
              <span>My Resumes</span>
              <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">{resumes.length}</span>
            </Link>
            <Link href="/student/interviews" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
              <Calendar className="w-5 h-5" />
              <span>My Interviews</span>
            </Link>
            <Link href="/student/applications" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
              <Briefcase className="w-5 h-5" />
              <span>My Applications</span>
            </Link>
            <Link href="/student/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
              <User className="w-5 h-5" />
              <span>My Profile</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer Profile Badge */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
              {student.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{student.name}</p>
              <p className="text-xs text-slate-500 truncate">{student.id}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* Page Banner Header */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="space-y-2 z-10">
              <span className="bg-blue-500/30 text-blue-200 text-xs px-3 py-1 rounded-full font-medium tracking-wide uppercase">
                Resume Management
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">Manage Your CVs & Resumes</h2>
              <p className="text-blue-200 text-sm max-w-xl">
                Upload, update, and manage your professional documents for seamless internship applications.
              </p>
            </div>
            
            <div className="flex items-center gap-3 z-10">
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-md transition-all"
              >
                <Plus className="w-4 h-4 text-blue-300" /> Create Resume
              </button>
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/35 transition-all"
              >
                <Upload className="w-4 h-4" /> Upload PDF
              </button>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm text-blue-900">
              <span className="font-semibold block mb-0.5">Application Default Resume</span>
              The resume marked as <span className="font-bold underline">Default</span> will be pre-selected automatically when you click "Apply Now" on any internship listing.
            </div>
          </div>

          {/* Resumes Grid/List Container */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Your Uploaded Resumes ({resumes.length})</h3>
              <span className="text-xs text-slate-400">PDF formats supported</span>
            </div>

            {resumes.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-slate-700 font-semibold mb-1">No resumes found</h4>
                <p className="text-slate-500 text-xs mb-4">Upload a PDF or create a resume to start applying for internships.</p>
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  Upload PDF Now
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {resumes.map((resume) => (
                  <div key={resume.id} className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    
                    {/* File Details */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-slate-900 text-base">{resume.name}</span>
                          {resume.isDefault && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                              <CheckCircle2 className="w-3 h-3" /> Default for Applications
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                          <span>Uploaded: {resume.uploadDate}</span>
                          <span>•</span>
                          <span>{resume.fileSize}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex items-center gap-2 self-end md:self-auto">
                      {!resume.isDefault && (
                        <button 
                          onClick={() => handleSetDefault(resume.id)}
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors"
                        >
                          Set as Default
                        </button>
                      )}
                      
                      <button 
                        title="View Resume"
                        className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button 
                        title="Update / Replace Resume"
                        className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button 
                        title="Delete Resume"
                        onClick={() => handleDelete(resume.id)}
                        className="p-2.5 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-100 text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Modal Mock */}
          {isUploadModalOpen && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-slate-900">Upload PDF Resume</h3>
                  <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-600 transition-colors cursor-pointer bg-slate-50">
                    <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-slate-700 mb-1">Click to browse or drag and drop your PDF</p>
                    <p className="text-[10px] text-slate-400">PDF (Max file size: 5MB)</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Resume Filename / Label</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Zayed_Software_Engineer_CV.pdf"
                      value={newResumeName}
                      onChange={(e) => setNewResumeName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsUploadModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-600/30"
                    >
                      Upload and Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Create Resume Modal Mock */}
          {isCreateModalOpen && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-slate-900">Create New Resume Builder</h3>
                  <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 mb-4">
                  Fill in your details or import your profile information to generate a professional PDF resume instantly.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input type="text" defaultValue="Zayed" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role / Title</label>
                    <input type="text" placeholder="e.g., Software Engineering Intern" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-600/30"
                  >
                    Generate Resume
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}