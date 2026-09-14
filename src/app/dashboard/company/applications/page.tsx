'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Check, X, AlertCircle } from 'lucide-react';

import { getSession } from '@/lib/auth/session';
import { getMyApplications, resolveFileUrl, updateApplicationStatus } from '@/lib/company/api';
import type { ApplicationStatus, ApplicationView } from '@/lib/company/types';

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  reviewed: 'bg-sky-50 text-sky-700 border-sky-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

export default function CompanyApplicationsPage() {
  const companyId = getSession()?.user.company?.id ?? null;

  const [applications, setApplications] = useState<ApplicationView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | ApplicationStatus>('all');
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }
    getMyApplications(companyId)
      .then(setApplications)
      .catch(() => setError('Could not load applications.'))
      .finally(() => setLoading(false));
  }, [companyId]);

  async function setStatus(id: number, status: ApplicationStatus) {
    setBusyId(id);
    try {
      const updated = await updateApplicationStatus(id, status);
      setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    } finally {
      setBusyId(null);
    }
  }

  if (!companyId) {
    return (
      <div className="alert rounded-2xl">
        <AlertCircle className="w-4 h-4" />
        <span>Create your company profile before reviewing applications.</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="loading loading-spinner loading-lg text-sky-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error rounded-2xl">
        <span>{error}</span>
      </div>
    );
  }

  const filtered = filter === 'all' ? applications : applications.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <h3 className="font-bold text-slate-900">Applications</h3>
          <p className="text-xs text-slate-400 mt-0.5">{applications.length} total received</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | ApplicationStatus)}
          className="select select-bordered select-sm rounded-xl bg-slate-50"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="table w-full">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <th>Student</th>
              <th>Internship</th>
              <th>Resume</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/60 transition">
                <td>
                  <div className="font-bold text-slate-900">
                    {a.student.firstName} {a.student.lastName}
                  </div>
                  <div className="text-xs text-slate-400">{a.student.email}</div>
                </td>
                <td className="text-sm text-slate-600">{a.internship.title}</td>
                <td>
                  {a.resume ? (
                    <a
                      href={resolveFileUrl(a.resume.fileUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-sky-600 hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> {a.resume.title}
                    </a>
                  ) : (
                    <span className="text-xs text-slate-300 italic">No resume</span>
                  )}
                </td>
                <td>
                  <span className={`badge badge-sm font-semibold border ${STATUS_STYLES[a.status]}`}>
                    {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                  </span>
                </td>
                <td className="text-right space-x-1">
                  <button
                    disabled={busyId === a.id || a.status === 'accepted'}
                    onClick={() => setStatus(a.id, 'accepted')}
                    className="btn btn-ghost btn-xs text-emerald-600 gap-1"
                  >
                    <Check className="w-4 h-4" /> Accept
                  </button>
                  <button
                    disabled={busyId === a.id || a.status === 'rejected'}
                    onClick={() => setStatus(a.id, 'rejected')}
                    className="btn btn-ghost btn-xs text-red-500 gap-1"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-sm text-slate-400 py-8">
                  No applications match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
