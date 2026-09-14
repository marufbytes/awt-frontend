"use client";

import React, { useState } from 'react';
import { 
  Briefcase, Clock, FileText, ArrowLeft, CheckCircle2, 
  Send, UserCheck, Building2, AlertCircle, 
  LayoutDashboard, Calendar, User
} from 'lucide-react';
import Link from 'next/link';

interface ResumeOption {
  id: string;
  name: string;
  isDefault: boolean;
}

interface AlumniOption {
  id: string;
  name: string;
  role: string;
  company: string;
}

export default function InternshipApplication(): React.JSX.Element {
  // Student profile info for sidebar consistency
  const student = {
    name: "Zayed",
    id: "23-51421-1",
    major: "Software Engineering",
    totalResumes: 2,
  };

  // Mock data matching your user state
  const internship = {
    id: "int-001",
    title: "Frontend Developer Intern",
    company: "TechCorp Solutions",
    location: "Dhaka, Bangladesh"
  };

  const resumes: ResumeOption[] = [
    { id: "res-001", name: "Zayed_Software_Engineer_Resume.pdf", isDefault: true },
    { id: "res-002", name: "Zayed_Frontend_Dev_CV.pdf", isDefault: false }
  ];

  const alumniList: AlumniOption[] = [
    { id: "alum-1", name: "Kazi Aminul Islam Rifat", role: "Senior Software Engineer", company: "TechCorp Solutions" },
    { id: "alum-2", name: "Kazi Kamrul", role: "Lead Systems Architect", company: "Innovatech Inc." },
    { id: "alum-3", name: "Tanvir Ahmed", role: "Frontend Lead", company: "Global Systems" }
  ];

  // Form State
  const [selectedResume, setSelectedResume] = useState<string>(
    resumes.find(r => r.isDefault)?.id || resumes[0].id
  );
  const [applicationType, setApplicationType] = useState<'DIRECT' | 'REFERRAL'>('DIRECT');
  const [selectedAlumni, setSelectedAlumni] = useState<string>(alumniList[0].id);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* ================= SIDEBAR (Consistent with Dashboard & Internship Browsing) ================= */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-200">
              U
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">Internnova</h1>
              <span className="text-xs text-blue-600 font-semibold tracking-wide">Connect</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            <Link href="/student/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/student/internships" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-medium transition-colors">
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
        <div className="p-8 space-y-6 max-w-4xl w-full mx-auto">
          
          {/* Back Link */}
          <div>
            <Link 
              href={`/student/internships/${internship.id}`} 
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Internship Details
            </Link>
          </div>

          {isSubmitted ? (
            /* Success State Card */
            <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted Successfully!</h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto mb-8">
                Your application for <span className="font-semibold text-slate-800">{internship.title}</span> at <span className="font-semibold text-slate-800">{internship.company}</span> has been logged via <span className="font-bold text-blue-600">{applicationType}</span> channel.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link 
                  href="/student/dashboard" 
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-600/30 transition-all"
                >
                  Go to Dashboard
                </Link>
                <Link 
                  href="/student/internships" 
                  className="px-6 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-all"
                >
                  Browse More Internships
                </Link>
              </div>
            </div>
          ) : (
            /* Application Form Card */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              
              {/* Header banner */}
              <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 inline-block mb-1">
                    Application Portal
                  </span>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                    Apply for {internship.title}
                  </h1>
                  <p className="text-sm text-slate-500">{internship.company} • {internship.location}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                
                {/* Select Resume */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Select Resume
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedResume}
                      onChange={(e) => setSelectedResume(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white font-medium text-slate-700 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer"
                    >
                      {resumes.map((res) => (
                        <option key={res.id} value={res.id}>
                          {res.name} {res.isDefault ? "(Default)" : ""}
                        </option>
                      ))}
                    </select>
                    <FileText className="w-4 h-4 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Need to change or upload a new CV? Manage your files in <Link href="/student/resumes" className="text-blue-600 underline font-medium">Resume Management</Link>.
                  </p>
                </div>

                {/* Application Type Selection */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Application Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Direct Option Card */}
                    <label 
                      onClick={() => setApplicationType('DIRECT')}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        applicationType === 'DIRECT' 
                          ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="applicationType" 
                        checked={applicationType === 'DIRECT'} 
                        onChange={() => setApplicationType('DIRECT')}
                        className="mt-1 text-blue-600 focus:ring-blue-600" 
                      />
                      <div>
                        <span className="block font-bold text-slate-900 text-sm">Direct Application</span>
                        <span className="text-xs text-slate-500">Apply straight through the university-company channel.</span>
                      </div>
                    </label>

                    {/* Referral Option Card */}
                    <label 
                      onClick={() => setApplicationType('REFERRAL')}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        applicationType === 'REFERRAL' 
                          ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="applicationType" 
                        checked={applicationType === 'REFERRAL'} 
                        onChange={() => setApplicationType('REFERRAL')}
                        className="mt-1 text-blue-600 focus:ring-blue-600" 
                      />
                      <div>
                        <span className="block font-bold text-slate-900 text-sm">Referral Application</span>
                        <span className="text-xs text-slate-500">Apply via an alumni recommendation at the company.</span>
                      </div>
                    </label>

                  </div>
                </div>

                {/* Conditional Alumni Section if Referral is chosen */}
                {applicationType === 'REFERRAL' && (
                  <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      Select Alumni Referee
                    </div>
                    <div className="relative">
                      <select 
                        value={selectedAlumni}
                        onChange={(e) => setSelectedAlumni(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm bg-white font-medium text-slate-700 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer"
                      >
                        {alumniList.map((alum) => (
                          <option key={alum.id} value={alum.id}>
                            {alum.name} — {alum.role} ({alum.company})
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-blue-700">
                      Your selected alumnus will receive an automated notice to endorse your application internally.
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button 
                    type="submit"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/30 transition-all"
                  >
                    <Send className="w-4 h-4" /> Submit Application
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}