'use client';

import React, { useEffect, useState } from 'react';
import { CalendarClock, AlertCircle, ExternalLink } from 'lucide-react';

import { getSession } from '@/lib/auth/session';
import { getMyInterviews } from '@/lib/company/api';
import type { Interview } from '@/lib/company/types';

export default function CompanyInterviewsPage() {
  const companyId = getSession()?.user.company?.id ?? null;

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }
    getMyInterviews(companyId)
      .then(setInterviews)
      .catch(() => setError('Could not load interviews.'))
      .finally(() => setLoading(false));
  }, [companyId]);

  if (!companyId) {
    return (
      <div className="alert rounded-2xl">
        <AlertCircle className="w-4 h-4" />
        <span>Create your company profile to see scheduled interviews.</span>
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

  const sorted = [...interviews].sort(
    (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime(),
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold text-slate-900">Scheduled Interviews</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {interviews.length} total · scheduling is managed by admins
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="table w-full">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <th>Candidate</th>
              <th>Internship</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-right">Link</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((iv) => (
              <tr key={iv.id} className="hover:bg-slate-50/60 transition">
                <td>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 text-sky-500" />
                    {iv.application.student.firstName} {iv.application.student.lastName}
                  </div>
                  <div className="text-xs text-slate-400">{iv.application.student.email}</div>
                </td>
                <td className="text-sm text-slate-600">{iv.application.internship.title}</td>
                <td className="text-xs text-slate-500">
                  {new Date(iv.scheduledDate).toLocaleString()}
                </td>
                <td>
                  <span className="badge badge-sm font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                    {iv.status}
                  </span>
                </td>
                <td className="text-right">
                  <a
                    href={iv.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost btn-xs text-sky-600 gap-1"
                  >
                    <ExternalLink className="w-4 h-4" /> Join
                  </a>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-sm text-slate-400 py-8">
                  No interviews scheduled yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
