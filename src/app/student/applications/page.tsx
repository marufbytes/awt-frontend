"use client";

import React, { useEffect, useState } from 'react';
import {
  Briefcase, Clock, Building2, CheckCircle2, XCircle, Eye, Trash2,
} from 'lucide-react';
import Link from 'next/link';
import StudentSidebar from '@/components/student/StudentSidebar';
import { useRequireStudent } from '@/lib/student/use-require-student';
import { api, ApiError } from '@/lib/student/api';
import type { Application } from '@/lib/student/types';

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-100',
  reviewed: 'bg-blue-50 text-blue-700 border border-blue-100',
  accepted: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  rejected: 'bg-rose-50 text-rose-700 border border-rose-100',
};

export default function MyApplications(): React.JSX.Element {
  const { ready } = useRequireStudent();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    api
      .get<Application[]>('/application/mine')
      .then(setApplications)
      .finally(() => setLoading(false));
  }, [ready]);

  const handleWithdraw = async (id: number) => {
    setWithdrawingId(id);
    setError(null);
    try {
      await api.delete(`/application/${id}`);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to withdraw application');
    } finally {
      setWithdrawingId(null);
    }
  };

  if (!ready || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Loading applications…
      </div>
    );
  }

  const filtered = applications.filter((app) => filter === 'ALL' || app.status === filter.toLowerCase());

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <StudentSidebar active="applications" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="space-y-2 z-10">
              <span className="bg-blue-500/30 text-blue-200 text-xs px-3 py-1 rounded-full font-medium tracking-wide uppercase">
                Application Tracker
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">My Applications</h2>
              <p className="text-blue-200 text-sm max-w-xl">
                Track the status of your submitted internship applications.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl z-10">
              <p className="text-xs text-blue-200 font-medium">Total Applications</p>
              <p className="text-2xl font-black text-white mt-0.5">{applications.length} Tracked</p>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-3 rounded-xl text-sm">{error}</div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Application History</h3>
              <p className="text-xs text-slate-500">Filter your application status across companies</p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl flex-wrap">
              {['ALL', 'PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'].map((statusTab) => (
                <button
                  key={statusTab}
                  onClick={() => setFilter(statusTab)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    filter === statusTab ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {statusTab.charAt(0) + statusTab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-slate-800 font-bold mb-1">No applications found</h3>
              <p className="text-slate-500 text-xs mb-6">You haven&apos;t submitted any applications matching this filter yet.</p>
              <Link
                href="/student/internships"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
              >
                Browse Internships
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                        app.type === 'referral' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        Type: {app.type.toUpperCase()}
                      </span>

                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full ${statusStyles[app.status]}`}>
                        {app.status === 'accepted' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {app.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                        {app.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                        {app.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                        {app.internship.title}
                      </h2>
                      <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-slate-400" /> {app.internship.company?.name}
                      </p>
                    </div>

                    <div className="space-y-2 py-3.5 border-t border-slate-100 text-xs text-slate-500 mb-4 bg-slate-50/50 p-3 rounded-xl">
                      <div className="flex justify-between">
                        <span className="font-medium">Applied Date:</span>
                        <span className="font-bold text-slate-700">{new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Resume Used:</span>
                        <span className="font-bold text-slate-700 truncate max-w-[190px]" title={app.resume?.title}>{app.resume?.title}</span>
                      </div>
                      {app.type === 'referral' && app.referredBy && (
                        <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                          <span className="font-medium text-purple-700">Referee:</span>
                          <span className="font-bold text-purple-700">{app.referredBy.firstName} {app.referredBy.lastName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <Link
                      href={`/student/applications/${app.id}`}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold text-center transition-all inline-flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Eye className="w-4 h-4 text-blue-600" /> View Details
                    </Link>

                    {app.status === 'pending' && (
                      <button
                        onClick={() => handleWithdraw(app.id)}
                        disabled={withdrawingId === app.id}
                        className="py-2.5 px-4 rounded-xl border border-rose-100 bg-rose-50/80 hover:bg-rose-100 disabled:opacity-60 text-rose-600 text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" /> {withdrawingId === app.id ? 'Withdrawing…' : 'Withdraw'}
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
