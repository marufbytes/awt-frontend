"use client";
import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Calendar,
  ArrowUpRight,
  Video,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import StudentSidebar from '@/components/student/StudentSidebar';
import StudentTopbar from '@/components/student/StudentTopbar';
import { useRequireStudent } from '@/lib/student/use-require-student';
import { api } from '@/lib/student/api';
import type { Application, Interview, Resume, Internship } from '@/lib/student/types';

const statusBadge: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending Review', className: 'bg-amber-50 text-amber-700 border-amber-200/60', icon: <Clock className="w-3.5 h-3.5" /> },
  reviewed: { label: 'Reviewed', className: 'bg-blue-50 text-blue-700 border-blue-200/60', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  accepted: { label: 'Accepted', className: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  rejected: { label: 'Rejected', className: 'bg-rose-50 text-rose-700 border-rose-200/60', icon: <XCircle className="w-3.5 h-3.5" /> },
};

export default function StudentDashboard(): React.JSX.Element {
  const { user, ready } = useRequireStudent();
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    (async () => {
      try {
        const [apps, ivs, res, ins] = await Promise.all([
          api.get<Application[]>('/application/mine'),
          api.get<Interview[]>('/interviews/mine'),
          api.get<Resume[]>('/resume/mine'),
          api.get<Internship[]>('/internship'),
        ]);
        setApplications(apps);
        setInterviews(ivs);
        setResumes(res);
        setInternships(ins);
      } finally {
        setLoading(false);
      }
    })();
  }, [ready]);

  if (!ready || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Loading dashboard…
      </div>
    );
  }

  const appliedInternshipIds = new Set(applications.map((a) => a.internship.id));
  const openInternships = internships.filter((i) => i.isActive && !appliedInternshipIds.has(i.id));
  const activeApplications = applications.filter((a) => a.status === 'pending' || a.status === 'reviewed');
  const pendingReview = applications.filter((a) => a.status === 'pending').length;
  const today = new Date().toDateString();
  const todaysInterviews = interviews.filter((iv) => new Date(iv.scheduledDate).toDateString() === today);
  const recentApplications = applications.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <StudentSidebar active="dashboard" resumesCount={resumes.length} interviewsCount={interviews.length} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <StudentTopbar label="Portal / Overview" />

        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="space-y-2 z-10">
              <span className="bg-blue-500/30 text-blue-200 text-xs px-3 py-1 rounded-full font-medium tracking-wide uppercase">
                Student Dashboard
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.firstName}!</h2>
              <p className="text-blue-200 text-sm">
                Here is your career overview, active applications, and schedule updates for today.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 z-10">
              <div>
                <p className="text-xs text-blue-200 font-medium">Profile Summary</p>
                <p className="text-sm font-bold text-white">{user?.email}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-blue-100">
                  <span>Resumes: {resumes.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                  Total: {applications.length}
                </span>
              </div>
              <h3 className="text-slate-500 font-medium text-sm">Active Applications</h3>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900">{activeApplications.length}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Pending Review: <strong className="text-slate-700">{pendingReview}</strong></span>
                <span>Interviews: <strong className="text-blue-600">{interviews.length}</strong></span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg">
                  Scheduled
                </span>
              </div>
              <h3 className="text-slate-500 font-medium text-sm">Upcoming Interviews</h3>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900">{interviews.length}</span>
                {todaysInterviews.length > 0 && (
                  <span className="text-xs text-amber-600 font-semibold">Today</span>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 truncate">
                {todaysInterviews.length > 0
                  ? `${todaysInterviews.length} interview(s) scheduled today`
                  : 'No interviews scheduled today'}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg">
                  Open
                </span>
              </div>
              <h3 className="text-slate-500 font-medium text-sm">Internships You Haven&apos;t Applied To</h3>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900">{openInternships.length}</span>
              </div>
              <Link href="/student/internships" className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold cursor-pointer hover:underline">
                <span>Browse internships</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Recent Applications</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Track status of your submitted internship applications</p>
                </div>
                <Link href="/student/applications" className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors">
                  View All
                </Link>
              </div>

              <div className="overflow-x-auto flex-1">
                {recentApplications.length === 0 ? (
                  <p className="p-6 text-sm text-slate-500">You haven&apos;t applied to any internships yet.</p>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-xs uppercase font-semibold text-slate-400 tracking-wider">
                        <th className="py-3.5 px-6">Company</th>
                        <th className="py-3.5 px-6">Role</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6">Applied Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {recentApplications.map((app) => {
                        const badge = statusBadge[app.status];
                        return (
                          <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-4 px-6 font-semibold text-slate-900">{app.internship.company?.name}</td>
                            <td className="py-4 px-6 text-slate-600">{app.internship.title}</td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.className}`}>
                                {badge.icon} {badge.label}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Today&apos;s Interviews</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Upcoming meetings scheduled for today</p>
                  </div>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Video className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  {todaysInterviews.length === 0 && (
                    <p className="text-sm text-slate-500">No interviews scheduled for today.</p>
                  )}
                  {todaysInterviews.map((interview) => (
                    <div key={interview.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2 hover:border-blue-200 transition-colors">
                      <div className="flex items-center justify-between text-xs font-semibold text-blue-600">
                        <span>{new Date(interview.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="bg-blue-100/70 text-blue-700 px-2 py-0.5 rounded text-[10px] uppercase">
                          {interview.status}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{interview.application.internship.title}</h4>
                        <p className="text-xs text-slate-500">{interview.application.internship.company?.name}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-mono truncate max-w-[140px]">{interview.meetingLink}</span>
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                        >
                          Join
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-blue-100/60 text-xs text-indigo-900">
                <p className="font-semibold mb-1">💡 Interview Tip</p>
                <p className="text-indigo-700/80 leading-relaxed">
                  Join 5 minutes prior to your interview slot and keep your resume summary accessible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
