'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, FileText, CalendarClock, Building2, ArrowRight, AlertCircle } from 'lucide-react';

import { getSession } from '@/lib/auth/session';
import {
  getMyApplications,
  getMyInternships,
  getMyInterviews,
} from '@/lib/company/api';
import type { ApplicationView, Internship, Interview } from '@/lib/company/types';

const STATUS_STYLES: Record<string, string> = {
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  reviewed: 'bg-sky-50 text-sky-700 border-sky-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

export default function CompanyDashboardPage() {
  const companyId = getSession()?.user.company?.id ?? null;

  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<ApplicationView[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }
    async function loadData() {
      try {
        const [i, a, iv] = await Promise.all([
          getMyInternships(companyId!),
          getMyApplications(companyId!),
          getMyInterviews(companyId!),
        ]);
        setInternships(i);
        setApplications(a);
        setInterviews(iv);
      } catch {
        setError('Something went wrong while loading your dashboard.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [companyId]);

  if (!companyId) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center space-y-4">
        <Building2 className="w-10 h-10 text-sky-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Set up your company first</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          You need a company profile before you can post internships or review
          applications.
        </p>
        <Link
          href="/dashboard/company/profile"
          className="btn btn-sm bg-sky-500 hover:bg-sky-600 text-white border-none rounded-xl gap-2"
        >
          Create Company Profile <ArrowRight className="w-4 h-4" />
        </Link>
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
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    );
  }

  const activeInternships = internships.filter((i) => i.isActive).length;
  const pendingApplications = applications.filter((a) => a.status === 'pending').length;
  const upcomingInterviews = interviews.filter(
    (iv) => new Date(iv.scheduledDate).getTime() >= Date.now(),
  ).length;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg shadow-sky-500/20">
        <h1 className="text-2xl font-black tracking-tight">Welcome back!</h1>
        <p className="text-sky-100 mt-2 text-sm max-w-2xl">
          Post internship openings, review incoming applications, and keep track
          of upcoming interviews for your company.
        </p>
        <Link
          href="/dashboard/company/internships"
          className="btn btn-sm bg-white text-sky-600 border-none rounded-xl mt-5 gap-2 hover:bg-sky-50"
        >
          Post an Internship <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Internships</p>
            <p className="text-3xl font-black text-slate-900 mt-2">{activeInternships}</p>
            <p className="text-xs text-slate-400 mt-1">{internships.length} total posted</p>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-sky-50 text-sky-600">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Applications</p>
            <p className="text-3xl font-black text-slate-900 mt-2">{pendingApplications}</p>
            <p className="text-xs text-slate-400 mt-1">{applications.length} total received</p>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-600">
            <FileText className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Interviews</p>
            <p className="text-3xl font-black text-slate-900 mt-2">{upcomingInterviews}</p>
            <p className="text-xs text-slate-400 mt-1">{interviews.length} scheduled total</p>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
            <CalendarClock className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accepted</p>
            <p className="text-3xl font-black text-slate-900 mt-2">
              {applications.filter((a) => a.status === 'accepted').length}
            </p>
            <p className="text-xs text-slate-400 mt-1">All time</p>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900">Recent Applications</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {Math.min(5, applications.length)} of {applications.length}
            </p>
          </div>
          <Link
            href="/dashboard/company/applications"
            className="btn btn-ghost btn-sm rounded-xl text-sky-600 gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <table className="table w-full">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <th>Student</th>
              <th>Internship</th>
              <th className="text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.slice(0, 5).map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/60 transition">
                <td>
                  <div className="font-bold text-slate-900">
                    {a.student.firstName} {a.student.lastName}
                  </div>
                  <div className="text-xs text-slate-400">{a.student.email}</div>
                </td>
                <td className="text-sm text-slate-600">{a.internship.title}</td>
                <td className="text-right">
                  <span className={`badge badge-sm font-semibold border ${STATUS_STYLES[a.status]}`}>
                    {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-sm text-slate-400 py-8">
                  No applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
