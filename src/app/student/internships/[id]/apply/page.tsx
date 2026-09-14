"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Briefcase, FileText, ArrowLeft, CheckCircle2, Send, Building2, AlertCircle, UserCheck,
} from 'lucide-react';
import Link from 'next/link';
import StudentSidebar from '@/components/student/StudentSidebar';
import { useRequireStudent } from '@/lib/student/use-require-student';
import { api, ApiError } from '@/lib/student/api';
import type { Internship, Resume, ApplicationType } from '@/lib/student/types';

export default function ApplyToInternship(): React.JSX.Element {
  const { ready } = useRequireStudent();
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [internship, setInternship] = useState<Internship | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedResume, setSelectedResume] = useState<number | null>(null);
  const [applicationType, setApplicationType] = useState<ApplicationType>('direct');
  const [referrerId, setReferrerId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!ready) return;
    (async () => {
      try {
        const [internshipData, resumeData] = await Promise.all([
          api.get<Internship>(`/internship/${params.id}`),
          api.get<Resume[]>('/resume/mine'),
        ]);
        setInternship(internshipData);
        setResumes(resumeData);
        if (resumeData.length > 0) setSelectedResume(resumeData[0].id);
      } catch (err) {
        setLoadError(err instanceof ApiError ? err.message : 'Failed to load internship');
      } finally {
        setLoading(false);
      }
    })();
  }, [ready, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResume) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.post('/application', {
        internshipId: Number(params.id),
        resumeId: selectedResume,
        type: applicationType,
        ...(applicationType === 'referral' && referrerId
          ? { referredById: Number(referrerId) }
          : {}),
      });
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Loading…
      </div>
    );
  }

  if (loadError || !internship) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <StudentSidebar active="internships" />
        <main className="flex-1 p-10">
          <p className="text-rose-600 font-medium">{loadError ?? 'Internship not found.'}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <StudentSidebar active="internships" resumesCount={resumes.length} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-8 space-y-6 max-w-4xl w-full mx-auto">
          <div>
            <Link
              href={`/student/internships/${internship.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Internship Details
            </Link>
          </div>

          {isSubmitted ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted Successfully!</h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto mb-8">
                Your application for <span className="font-semibold text-slate-800">{internship.title}</span> at{' '}
                <span className="font-semibold text-slate-800">{internship.company?.name}</span> has been recorded.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => router.push('/student/applications')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-600/30 transition-all"
                >
                  View My Applications
                </button>
                <Link
                  href="/student/internships"
                  className="px-6 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-all"
                >
                  Browse More Internships
                </Link>
              </div>
            </div>
          ) : resumes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 text-center shadow-sm">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-slate-800 font-bold mb-1">You need a resume to apply</h3>
              <p className="text-slate-500 text-sm mb-6">Upload a PDF resume first, then come back to apply.</p>
              <Link
                href="/student/resumes"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-600/30 transition-all"
              >
                Upload a Resume
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                  <p className="text-sm text-slate-500">{internship.company?.name}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                {submitError && (
                  <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Select Resume</label>
                  <select
                    value={selectedResume ?? ''}
                    onChange={(e) => setSelectedResume(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white font-medium text-slate-700 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer"
                  >
                    {resumes.map((res) => (
                      <option key={res.id} value={res.id}>
                        {res.title}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Need a different resume? Manage your files in{' '}
                    <Link href="/student/resumes" className="text-blue-600 underline font-medium">
                      Resume Management
                    </Link>.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Application Type</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label
                      onClick={() => setApplicationType('direct')}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        applicationType === 'direct'
                          ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input type="radio" name="applicationType" checked={applicationType === 'direct'} onChange={() => setApplicationType('direct')} className="mt-1" />
                      <div>
                        <span className="block font-bold text-slate-900 text-sm">Direct Application</span>
                        <span className="text-xs text-slate-500">Apply straight to the company.</span>
                      </div>
                    </label>

                    <label
                      onClick={() => setApplicationType('referral')}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        applicationType === 'referral'
                          ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input type="radio" name="applicationType" checked={applicationType === 'referral'} onChange={() => setApplicationType('referral')} className="mt-1" />
                      <div>
                        <span className="block font-bold text-slate-900 text-sm">Referral Application</span>
                        <span className="text-xs text-slate-500">Apply via an alumni referrer.</span>
                      </div>
                    </label>
                  </div>
                </div>

                {applicationType === 'referral' && (
                  <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                    <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      Alumni Referrer
                    </div>
                    <input
                      type="number"
                      required
                      placeholder="Alumni's user ID"
                      value={referrerId}
                      onChange={(e) => setReferrerId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm bg-white font-medium text-slate-700 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600"
                    />
                    <p className="text-xs text-blue-700">
                      Ask your referring alumnus for their account ID — an alumni directory isn&apos;t available yet.
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold shadow-md shadow-blue-600/30 transition-all"
                  >
                    <Send className="w-4 h-4" /> {submitting ? 'Submitting…' : 'Submit Application'}
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
