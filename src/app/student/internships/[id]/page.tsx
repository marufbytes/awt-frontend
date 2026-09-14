"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Briefcase, CheckCircle, ArrowLeft, Building2,
} from 'lucide-react';
import Link from 'next/link';
import StudentSidebar from '@/components/student/StudentSidebar';
import { useRequireStudent } from '@/lib/student/use-require-student';
import { api, ApiError } from '@/lib/student/api';
import type { Internship } from '@/lib/student/types';

export default function InternshipDetails(): React.JSX.Element {
  const { ready } = useRequireStudent();
  const params = useParams<{ id: string }>();
  const [internship, setInternship] = useState<Internship | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    api
      .get<Internship>(`/internship/${params.id}`)
      .then(setInternship)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load internship'))
      .finally(() => setLoading(false));
  }, [ready, params.id]);

  if (!ready || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Loading internship…
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <StudentSidebar active="internships" />
        <main className="flex-1 p-10">
          <p className="text-rose-600 font-medium">{error ?? 'Internship not found.'}</p>
          <Link href="/student/internships" className="text-blue-600 text-sm hover:underline mt-4 inline-block">
            Back to Job Listings
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">
      <StudentSidebar active="internships" />

      <main className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/student/internships"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Job Listings
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-2xl shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-block mb-2 ${internship.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  {internship.isActive ? 'Actively Hiring' : 'Closed'}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                  {internship.title}
                </h1>
                <p className="text-base font-medium text-slate-600">
                  {internship.company?.name}
                </p>
              </div>
            </div>

            <div>
              {internship.isActive ? (
                <Link
                  href={`/student/internships/${internship.id}/apply`}
                  className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/25 transition-all"
                >
                  Apply Now
                </Link>
              ) : (
                <span className="inline-flex items-center px-6 py-3 rounded-xl bg-slate-100 text-slate-500 font-medium">
                  Applications Closed
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Internship Description</h2>
              <div className="text-slate-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {internship.description}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Requirements & Qualifications</h2>
              <div className="flex items-start gap-3 text-slate-600 text-sm md:text-base">
                <CheckCircle className="text-blue-500 w-5 h-5 mt-0.5 shrink-0" />
                <span className="whitespace-pre-line">{internship.requirements}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
              <Briefcase className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-bold text-blue-900 mb-1 text-sm">Ready to apply?</h3>
              <p className="text-xs text-blue-700 mb-4">Use a resume from your resume library to submit a direct application.</p>
              <Link
                href="/student/resumes"
                className="px-4 py-2 bg-white text-blue-600 rounded-xl text-xs font-semibold shadow-sm hover:bg-blue-50 transition-colors inline-block"
              >
                Manage Resumes
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
