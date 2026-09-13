"use client";
import React, { useState } from 'react';
import { 
  Briefcase, Building2, Calendar, FileText, UserCheck, 
  ArrowLeft, Clock, CheckCircle2, AlertCircle, ExternalLink 
} from 'lucide-react';

interface ApplicationDetail {
  id: string;
  internshipTitle: string;
  companyName: string;
  location: string;
  applicationDate: string;
  applicationType: 'DIRECT' | 'REFERRAL';
  referredBy?: string;
  resumeName: string;
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
  notes?: string;
}

export default function ApplicationDetails(): React.JSX.Element {
  // Mock detailed data for application id: app-002
  const [application] = useState<ApplicationDetail>({
    id: "1",
    internshipTitle: "Data Analyst Intern",
    companyName: "XYZ Technologies",
    location: "Dhaka, Bangladesh (Remote)",
    applicationDate: "02 Sep 2026",
    applicationType: "REFERRAL",
    referredBy: "Kazi Aminul Islam Rifat",
    resumeName: "Zayed_Frontend_Dev_CV.pdf",
    status: "REVIEWED",
    notes: "Your application has passed initial screening and has been forwarded to the department lead for technical evaluation."
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              U
            </div>
            <div>
              <span className="font-bold text-lg leading-none block text-slate-900">UniCareer</span>
              <span className="text-xs text-sky-500 font-medium tracking-wide">Connect</span>
            </div>
          </div>

          <nav className="space-y-1">
            <a href="/student/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors">
              <Briefcase className="w-5 h-5" /> Dashboard
            </a>
            <a href="/student/internships" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors">
              <Briefcase className="w-5 h-5" /> Job Listings
            </a>
            <a href="/student/applications" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sky-500 text-white font-medium shadow-sm shadow-sky-500/20">
              <Briefcase className="w-5 h-5" /> My Applications
            </a>
            <a href="/student/resumes" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors">
              <FileText className="w-5 h-5" /> My Resumes
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 max-w-4xl mx-auto">
        
        {/* Back Link */}
        <div className="mb-6">
          <a 
            href="/student/applications" 
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Applications
          </a>
        </div>

        {/* Main Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Header Banner */}
          <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-600 inline-block mb-2">
                Application Summary ID: #{application.id}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                {application.internshipTitle}
              </h1>
              <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" /> {application.companyName} ({application.location})
              </p>
            </div>

            {/* Status Badge */}
            <div className="self-start md:self-auto">
              <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border ${
                application.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                application.status === 'REVIEWED' ? 'bg-sky-50 text-sky-600 border-sky-100' :
                application.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {application.status === 'ACCEPTED' && <CheckCircle2 className="w-4 h-4" />}
                {application.status === 'REVIEWED' && <Clock className="w-4 h-4" />}
                Status: {application.status}
              </span>
            </div>
          </div>

          {/* Details Body Grid */}
          <div className="p-6 md:p-8 space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Company Info Box */}
              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/40 space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Company</span>
                <p className="font-bold text-slate-900 text-base">{application.companyName}</p>
                <p className="text-xs text-slate-500">{application.location}</p>
              </div>

              {/* Application Date Box */}
              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/40 space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Application Date</span>
                <p className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-500" /> {application.applicationDate}
                </p>
                <p className="text-xs text-slate-500">Submitted securely via platform</p>
              </div>

              {/* Application Type Box */}
              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/40 space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Application Type</span>
                <p className="font-bold text-slate-900 text-base">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold inline-block ${
                    application.applicationType === 'REFERRAL' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'
                  }`}>
                    {application.applicationType}
                  </span>
                </p>
                <p className="text-xs text-slate-500">
                  {application.applicationType === 'REFERRAL' ? 'Routed through internal alumni recommendation.' : 'Direct submission channel.'}
                </p>
              </div>

              {/* Resume Used Box */}
              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/40 space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Resume Used</span>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-sky-500 shrink-0" /> <span className="truncate">{application.resumeName}</span>
                </p>
                <a href="/student/resumes" className="text-xs text-sky-500 hover:underline inline-flex items-center gap-1 mt-1">
                  View file <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>

            {/* Referral Alumni Section (Conditional) */}
            {application.applicationType === 'REFERRAL' && application.referredBy && (
              <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-semibold block uppercase tracking-wider">Referred By Alumni</span>
                    <h4 className="font-bold text-slate-900 text-base">{application.referredBy}</h4>
                  </div>
                </div>
                <span className="text-xs bg-white text-purple-700 px-3 py-1 rounded-lg border border-purple-200 font-medium shadow-sm">
                  Verified Referral
                </span>
              </div>
            )}

            {/* Status Notes Section */}
            {application.notes && (
              <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-1">
                <h4 className="font-bold text-sky-900 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-sky-500" /> Status Remarks / Progress Update
                </h4>
                <p className="text-xs md:text-sm text-sky-800 leading-relaxed">
                  {application.notes}
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <a 
                href="/student/applications"
                className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              >
                Back to List
              </a>
              <button 
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-[#0095ff] hover:bg-[#0080e6] text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all"
              >
                Print Summary
              </button>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}