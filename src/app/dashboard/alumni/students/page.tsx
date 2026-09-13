// src/app/dashboard/alumni/students/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  FileDown,
  GraduationCap,
  Check,
  X,
  AlertTriangle,
  MailWarning,
  Eye,
  RotateCcw,
} from 'lucide-react';

import {
  getStudentApplications,
  isPostFull,
  respondToApplication,
  VACANCY_FULL_MESSAGE,
} from '@/lib/alumni/api';
import type { ApplicationStatus, StudentApplicationView } from '@/lib/alumni/types';

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  ACCEPTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_TABS: Array<'ALL' | ApplicationStatus> = [
  'ALL',
  'PENDING',
  'ACCEPTED',
  'REJECTED',
];

export default function AlumniStudentsPage() {
  const [applications, setApplications] = useState<StudentApplicationView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actingOnId, setActingOnId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<number | null>(null);

  const [search, setSearch] = useState<string>('');
  const [skill, setSkill] = useState<string>('All');
  const [statusTab, setStatusTab] = useState<'ALL' | ApplicationStatus>('ALL');

  /** Re-fetch applications without touching the full-page loading state. */
  const refreshApplications = () => getStudentApplications().then(setApplications);

  useEffect(() => {
    refreshApplications().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Each referral post has its own vacancy count, so "full" is per-post, not
  // one global number — a post with 1 vacancy can be full while another with
  // 5 still has room.
  const postFullness = useMemo(() => {
    const fullness: Record<number, boolean> = {};
    for (const a of applications) {
      fullness[a.referralPostId] ??= isPostFull(a.referralPostId, applications);
    }
    return fullness;
  }, [applications]);

  const anyPostFull = Object.values(postFullness).some(Boolean);

  // Looked up from the live list (rather than held as its own snapshot) so the
  // modal reflects the latest status right after an accept/reject.
  const previewApp = applications.find((a) => a.id === previewId) ?? null;

  const skills = useMemo(
    () => [
      'All',
      ...Array.from(new Set(applications.flatMap((a) => a.student.skills))).sort(),
    ],
    [applications],
  );

  const visibleApplications = useMemo(() => {
    return applications.filter((a) => {
      const { student } = a;
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const query = search.toLowerCase();

      const matchesSearch =
        query === '' ||
        fullName.includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.skills.some((s) => s.toLowerCase().includes(query));

      const matchesSkill = skill === 'All' || student.skills.includes(skill);
      const matchesStatus = statusTab === 'ALL' || a.status === statusTab;

      return matchesSearch && matchesSkill && matchesStatus;
    });
  }, [applications, search, skill, statusTab]);

  const handleAccept = async (applicationId: number) => {
    setActingOnId(applicationId);
    try {
      await respondToApplication(applicationId, 'ACCEPTED');
      await refreshApplications();
      setToast('Student accepted for the internship.');
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Could not accept this student.');
    } finally {
      setActingOnId(null);
    }
  };

  const handleReject = async (applicationId: number) => {
    setActingOnId(applicationId);
    try {
      await respondToApplication(applicationId, 'REJECTED');
      await refreshApplications();
      setToast('Application rejected.');
    } catch {
      setToast('Could not reject this application.');
    } finally {
      setActingOnId(null);
    }
  };

  const handleSendVacancyFull = async (applicationId: number) => {
    setActingOnId(applicationId);
    try {
      await respondToApplication(applicationId, 'REJECTED', VACANCY_FULL_MESSAGE);
      await refreshApplications();
      setToast('"Vacancy full" message sent to the student.');
    } catch {
      setToast('Could not send the message.');
    } finally {
      setActingOnId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="loading loading-spinner loading-lg text-sky-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="toast toast-end z-50">
          <div className="alert alert-success text-white shadow-lg rounded-2xl">
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Vacancy full banner */}
      {anyPostFull && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            One or more of your referral posts have filled all their vacancies. New
            applicants to those posts can only be sent the &quot;vacancy full&quot; message.
          </p>
        </div>
      )}

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            className={`btn btn-sm rounded-xl border-none ${
              statusTab === tab
                ? 'bg-sky-500 text-white hover:bg-sky-600'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            <span className="ml-1 opacity-70">
              (
              {tab === 'ALL'
                ? applications.length
                : applications.filter((a) => a.status === tab).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or skill..."
              className="input input-bordered input-sm rounded-xl pl-10 w-full sm:w-64 bg-slate-50"
            />
          </div>

          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="select select-bordered select-sm rounded-xl bg-slate-50"
          >
            {skills.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All skills' : s}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-slate-500 font-medium whitespace-nowrap">
          {visibleApplications.length} application
          {visibleApplications.length !== 1 && 's'} found
        </div>
      </div>

      {/* Empty state */}
      {visibleApplications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-700">No applications match your filters</h3>
          <p className="text-sm text-slate-400 mt-1">
            Students will show up here once they apply to one of your approved circulars.
          </p>
        </div>
      ) : (
        /* Application cards */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {visibleApplications.map((a) => {
            const s = a.student;
            const isActing = actingOnId === a.id;
            const vacancyFull = postFullness[a.referralPostId] ?? false;

            return (
              <div
                key={a.id}
                className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {s.firstName[0]}
                      {s.lastName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">
                        {s.firstName} {s.lastName}
                      </p>
                      <p className="text-xs text-slate-400">{s.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {s.skills.map((sk) => (
                    <span key={sk} className="badge badge-ghost badge-sm">
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Applied to <strong className="text-slate-700">{a.post.title}</strong>
                  </span>
                  {s.resumeUrl ? (
                    <a
                      href={s.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-xs text-sky-600 gap-1 rounded-lg shrink-0"
                    >
                      <FileDown className="w-3.5 h-3.5" /> Resume
                    </a>
                  ) : (
                    <span className="text-xs text-slate-300 italic shrink-0">No resume</span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                  <span>Applied {a.appliedAt}</span>
                  <span
                    className={`badge badge-sm font-semibold border ${STATUS_STYLES[a.status]}`}
                  >
                    {a.status.charAt(0) + a.status.slice(1).toLowerCase()}
                  </span>
                </div>

                {a.responseMessage && (
                  <p className="text-xs text-slate-500 italic mt-3 bg-slate-50 rounded-xl p-3">
                    &quot;{a.responseMessage}&quot;
                  </p>
                )}

                <button
                  onClick={() => setPreviewId(a.id)}
                  className="btn btn-ghost btn-sm w-full mt-3 text-slate-500 hover:text-sky-600 gap-1.5 rounded-xl"
                >
                  <Eye className="w-4 h-4" /> View Full Profile
                </button>

                {/* Actions */}
                {a.status === 'REJECTED' && (
                  <div className="mt-1">
                    <button
                      onClick={() => handleAccept(a.id)}
                      disabled={isActing || vacancyFull}
                      title={
                        vacancyFull
                          ? 'Vacancy full — cannot accept more students'
                          : undefined
                      }
                      className="btn btn-sm w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl gap-1.5 disabled:bg-slate-50 disabled:text-slate-300 disabled:border-slate-100"
                    >
                      {isActing ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <RotateCcw className="w-4 h-4" />
                      )}
                      Mark as Eligible &amp; Accept
                    </button>
                  </div>
                )}

                {a.status === 'PENDING' && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    {vacancyFull ? (
                      <button
                        onClick={() => handleSendVacancyFull(a.id)}
                        disabled={isActing}
                        className="btn btn-sm w-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl gap-2"
                      >
                        {isActing ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          <MailWarning className="w-4 h-4" />
                        )}
                        Send &quot;Vacancy Full&quot; Message
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(a.id)}
                          disabled={isActing}
                          className="btn btn-sm flex-1 bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl gap-1.5"
                        >
                          {isActing ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(a.id)}
                          disabled={isActing}
                          className="btn btn-sm flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-none rounded-xl gap-1.5"
                        >
                          {isActing ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Student profile modal */}
      {previewApp && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 flex items-center justify-center p-4"
          onClick={() => setPreviewId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {previewApp.student.firstName[0]}
                  {previewApp.student.lastName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 leading-tight">
                    {previewApp.student.firstName} {previewApp.student.lastName}
                  </h3>
                  <p className="text-xs text-slate-400">{previewApp.student.email}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewId(null)}
                className="btn btn-ghost btn-sm btn-circle text-slate-400 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-slate-700 mt-0.5">{previewApp.student.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Applied To
                  </p>
                  <p className="text-slate-700 mt-0.5">{previewApp.post.title}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Applied On
                  </p>
                  <p className="text-slate-700 mt-0.5">{previewApp.appliedAt}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {previewApp.student.skills.map((sk) => (
                    <span key={sk} className="badge badge-ghost badge-sm">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Resume
                </p>
                {previewApp.student.resumeUrl ? (
                  <a
                    href={previewApp.student.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm bg-sky-50 hover:bg-sky-100 text-sky-600 border-none rounded-xl gap-1.5"
                  >
                    <FileDown className="w-4 h-4" /> Download Resume
                  </a>
                ) : (
                  <p className="text-sm text-slate-400 italic">No resume uploaded</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Application Status
                </p>
                <span
                  className={`badge badge-sm font-semibold border ${STATUS_STYLES[previewApp.status]}`}
                >
                  {previewApp.status.charAt(0) + previewApp.status.slice(1).toLowerCase()}
                </span>
              </div>

              {previewApp.responseMessage && (
                <p className="text-xs text-slate-500 italic bg-slate-50 rounded-xl p-3">
                  &quot;{previewApp.responseMessage}&quot;
                </p>
              )}

              {/* Modal actions */}
              {previewApp.status === 'REJECTED' && (
                <button
                  onClick={() => handleAccept(previewApp.id)}
                  disabled={
                    actingOnId === previewApp.id ||
                    (postFullness[previewApp.referralPostId] ?? false)
                  }
                  className="btn btn-sm w-full bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl gap-1.5 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  {actingOnId === previewApp.id ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <RotateCcw className="w-4 h-4" />
                  )}
                  Mark as Eligible &amp; Accept
                </button>
              )}

              {previewApp.status === 'PENDING' &&
                !(postFullness[previewApp.referralPostId] ?? false) && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(previewApp.id)}
                      disabled={actingOnId === previewApp.id}
                      className="btn btn-sm flex-1 bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Accept
                    </button>
                    <button
                      onClick={() => handleReject(previewApp.id)}
                      disabled={actingOnId === previewApp.id}
                      className="btn btn-sm flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-none rounded-xl gap-1.5"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}

              {previewApp.status === 'PENDING' &&
                (postFullness[previewApp.referralPostId] ?? false) && (
                  <button
                    onClick={() => handleSendVacancyFull(previewApp.id)}
                    disabled={actingOnId === previewApp.id}
                    className="btn btn-sm w-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl gap-1.5"
                  >
                    <MailWarning className="w-4 h-4" /> Send &quot;Vacancy Full&quot; Message
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
