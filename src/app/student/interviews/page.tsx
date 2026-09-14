"use client";

import React, { useEffect, useState } from 'react';
import {
  Calendar, Clock, Building2, Video, CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import StudentSidebar from '@/components/student/StudentSidebar';
import { useRequireStudent } from '@/lib/student/use-require-student';
import { api } from '@/lib/student/api';
import type { Interview } from '@/lib/student/types';

export default function MyInterviews(): React.JSX.Element {
  const { ready } = useRequireStudent();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    api
      .get<Interview[]>('/interviews/mine')
      .then(setInterviews)
      .finally(() => setLoading(false));
  }, [ready]);

  if (!ready || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Loading interviews…
      </div>
    );
  }

  const now = Date.now();
  const upcoming = interviews.filter((iv) => new Date(iv.scheduledDate).getTime() >= now);
  const past = interviews.filter((iv) => new Date(iv.scheduledDate).getTime() < now);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <StudentSidebar active="interviews" interviewsCount={interviews.length} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="space-y-2 z-10">
              <span className="bg-blue-500/30 text-blue-200 text-xs px-3 py-1 rounded-full font-medium tracking-wide uppercase">
                Interview Schedule
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">My Interviews</h2>
              <p className="text-blue-200 text-sm max-w-xl">
                Interviews scheduled by employers for your internship applications.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl z-10">
              <p className="text-xs text-blue-200 font-medium">Total Interviews</p>
              <p className="text-2xl font-black text-white mt-0.5">{interviews.length}</p>
            </div>
          </div>

          {interviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-slate-800 font-bold mb-1">No interviews scheduled yet</h3>
              <p className="text-slate-500 text-xs mb-6">
                When an employer schedules an interview for one of your applications, it will show up here.
              </p>
              <Link
                href="/student/applications"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
              >
                View My Applications
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {upcoming.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Upcoming</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcoming.map((iv) => (
                      <InterviewCard key={iv.id} interview={iv} />
                    ))}
                  </div>
                </div>
              )}

              {past.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Past</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-75">
                    {past.map((iv) => (
                      <InterviewCard key={iv.id} interview={iv} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function InterviewCard({ interview }: { interview: Interview }) {
  const date = new Date(interview.scheduledDate);
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
          <CheckCircle2 className="w-3.5 h-3.5" /> {interview.status}
        </span>
        <Link
          href={`/student/applications/${interview.application.id}`}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600"
        >
          View Application →
        </Link>
      </div>

      <h4 className="font-bold text-slate-900 text-base mb-1">{interview.application.internship.title}</h4>
      <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-4">
        <Building2 className="w-4 h-4 text-slate-400" /> {interview.application.internship.company?.name}
      </p>

      <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50/60 p-3 rounded-xl border border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-500" /> {date.toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" /> {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <a
        href={interview.meetingLink}
        target="_blank"
        rel="noreferrer"
        className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl shadow-sm transition-colors"
      >
        <Video className="w-4 h-4" /> Join Meeting
      </a>
    </div>
  );
}
