"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Building2, Calendar, FileText, UserCheck, ArrowLeft, CheckCircle2, Clock, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import StudentSidebar from '@/components/student/StudentSidebar';
import { useRequireStudent } from '@/lib/student/use-require-student';
import { api, ApiError, resolveFileUrl } from '@/lib/student/api';
import type { Application } from '@/lib/student/types';

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
  reviewed: 'bg-sky-50 text-sky-600 border-sky-100',
  accepted: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  rejected: 'bg-rose-50 text-rose-600 border-rose-100',
};

export default function ApplicationDetails(): React.JSX.Element {
  const { ready } = useRequireStudent();
  const params = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    api
      .get<Application>(`/application/${params.id}`)
      .then(setApplication)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load application'))
      .finally(() => setLoading(false));
  }, [ready, params.id]);

  if (!ready || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Loading application…
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <StudentSidebar active="applications" />
        <main className="flex-1 p-10">
          <p className="text-rose-600 font-medium">{error ?? 'Application not found.'}</p>
          <Link href="/student/applications" className="text-blue-600 text-sm hover:underline mt-4 inline-block">
            Back to My Applications
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">
      <StudentSidebar active="applications" />

      <main className="flex-1 p-6 lg:p-10 max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/student/applications" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to My Applications
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-600 inline-block mb-2">
                Application #{application.id}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                {application.internship.title}
              </h1>
              <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" /> {application.internship.company?.name}
              </p>
            </div>

            <div className="self-start md:self-auto">
              <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border ${statusStyles[application.status]}`}>
                {application.status === 'accepted' && <CheckCircle2 className="w-4 h-4" />}
                {(application.status === 'pending' || application.status === 'reviewed') && <Clock className="w-4 h-4" />}
                Status: {application.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/40 space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Company</span>
                <p className="font-bold text-slate-900 text-base">{application.internship.company?.name}</p>
              </div>

              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/40 space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Application Date</span>
                <p className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-500" /> {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/40 space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Application Type</span>
                <p className="font-bold text-slate-900 text-base">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold inline-block ${
                    application.type === 'referral' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'
                  }`}>
                    {application.type.toUpperCase()}
                  </span>
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/40 space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Resume Used</span>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-sky-500 shrink-0" /> <span className="truncate">{application.resume?.title}</span>
                </p>
                {application.resume?.fileUrl && (
                  <a
                    href={resolveFileUrl(application.resume.fileUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-sky-500 hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    View file <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {application.type === 'referral' && application.referredBy && (
              <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-semibold block uppercase tracking-wider">Referred By Alumni</span>
                    <h4 className="font-bold text-slate-900 text-base">
                      {application.referredBy.firstName} {application.referredBy.lastName}
                    </h4>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                href="/student/applications"
                className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              >
                Back to List
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
