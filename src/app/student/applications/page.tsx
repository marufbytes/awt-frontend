"use client";

import React, { useState } from 'react';
import { 
  Briefcase, Clock, FileText, Building2, CheckCircle2, 
  XCircle, Eye, Trash2, Calendar, LayoutDashboard, User
} from 'lucide-react';
import Link from 'next/link';

interface Application {
  id: string;
  position: string;
  company: string;
  type: 'DIRECT' | 'REFERRAL';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  appliedDate: string;
  resumeUsed: string;
  referee?: string;
}

export default function MyApplications(): React.JSX.Element {
  // Student profile info for sidebar consistency
  const student = {
    name: "Zayed",
    id: "23-51421-1",
    major: "Software Engineering",
    totalResumes: 2,
  };

  // Mock applications state matching user activity
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "app-001",
      position: "Frontend Developer Intern",
      company: "TechCorp Solutions",
      type: "DIRECT",
      status: "PENDING",
      appliedDate: "11 Sep 2026",
      resumeUsed: "Zayed_Software_Engineer_Resume.pdf"
    },
    {
      id: "app-002",
      position: "Data Analyst Intern",
      company: "XYZ Technologies",
      type: "REFERRAL",
      status: "ACCEPTED",
      appliedDate: "02 Sep 2026",
      resumeUsed: "Zayed_Frontend_Dev_CV.pdf",
      referee: "Kazi Aminul Islam Rifat"
    },
    {
      id: "app-003",
      position: "Junior Software Engineer",
      company: "Innovatech Inc.",
      type: "DIRECT",
      status: "REJECTED",
      appliedDate: "15 Aug 2026",
      resumeUsed: "Zayed_Software_Engineer_Resume.pdf"
    }
  ]);

  const [filter, setFilter] = useState<string>('ALL');

  const handleWithdraw = (id: string) => {
    setApplications(applications.filter(app => app.id !== id));
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'ALL') return true;
    return app.status === filter;
  });

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* ================= SIDEBAR (Consistent with Dashboard & Internships) ================= */}
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
            <Link href="/student/resumes" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
              <FileText className="w-5 h-5" />
              <span>My Resumes</span>
              <span className="ml-auto bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-semibold">{student.totalResumes}</span>
            </Link>
            <Link href="/student/interviews" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
              <Calendar className="w-5 h-5" />
              <span>My Interviews</span>
            </Link>
            <Link href="/student/applications" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-medium transition-colors">
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
          
          {/* Top Banner Header */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="space-y-2 z-10">
              <span className="bg-blue-500/30 text-blue-200 text-xs px-3 py-1 rounded-full font-medium tracking-wide uppercase">
                Application Tracker
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">My Applications</h2>
              <p className="text-blue-200 text-sm max-w-xl">
                Track the status of your submitted internship and job applications, manage referrals, and monitor review progress.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl z-10">
              <p className="text-xs text-blue-200 font-medium">Total Applications</p>
              <p className="text-2xl font-black text-white mt-0.5">{applications.length} Tracked</p>
            </div>
          </div>

          {/* Filter Bar Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Application History</h3>
              <p className="text-xs text-slate-500">Filter your application status across companies</p>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl">
              {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].map((statusTab) => (
                <button
                  key={statusTab}
                  onClick={() => setFilter(statusTab)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    filter === statusTab
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {statusTab.charAt(0) + statusTab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Applications Grid */}
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-slate-800 font-bold mb-1">No applications found</h3>
              <p className="text-slate-500 text-xs mb-6">You haven't submitted any applications matching this status filter yet.</p>
              <Link 
                href="/student/internships" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
              >
                Browse Internships
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredApplications.map((app) => (
                <div 
                  key={app.id} 
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Badges: Type & Status */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                        app.type === 'REFERRAL' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        Type: {app.type}
                      </span>

                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full ${
                        app.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        app.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {app.status === 'ACCEPTED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {app.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                        {app.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                        {app.status}
                      </span>
                    </div>

                    {/* Position & Company */}
                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                        {app.position}
                      </h2>
                      <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-slate-400" /> {app.company}
                      </p>
                    </div>

                    {/* Additional Meta Info */}
                    <div className="space-y-2 py-3.5 border-t border-slate-100 text-xs text-slate-500 mb-4 bg-slate-50/50 p-3 rounded-xl border-slate-100">
                      <div className="flex justify-between">
                        <span className="font-medium">Applied Date:</span>
                        <span className="font-bold text-slate-700">{app.appliedDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Resume Used:</span>
                        <span className="font-bold text-slate-700 truncate max-w-[190px]" title={app.resumeUsed}>{app.resumeUsed}</span>
                      </div>
                      {app.type === 'REFERRAL' && app.referee && (
                        <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                          <span className="font-medium text-purple-700">Referee:</span>
                          <span className="font-bold text-purple-700">{app.referee}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <Link 
                      href={`/student/applications/${app.id}`}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold text-center transition-all inline-flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Eye className="w-4 h-4 text-blue-600" /> View Details
                    </Link>

                    {app.status === 'PENDING' && (
                      <button 
                        onClick={() => handleWithdraw(app.id)}
                        className="py-2.5 px-4 rounded-xl border border-rose-100 bg-rose-50/80 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" /> Withdraw
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}