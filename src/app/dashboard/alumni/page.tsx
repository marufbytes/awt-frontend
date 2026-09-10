// src/app/dashboard/alumni/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, FileText, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

import StatCard from '@/components/alumni/StatCard';
import { getMyReferralPosts, getUnplacedStudents } from '@/lib/alumni/api';
import type { ReferralPost, UnplacedStudent } from '@/lib/alumni/types';

export default function AlumniDashboardPage() {
  const [students, setStudents] = useState<UnplacedStudent[]>([]);
  const [posts, setPosts] = useState<ReferralPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [studentList, postList] = await Promise.all([
          getUnplacedStudents(),
          getMyReferralPosts(),
        ]);
        setStudents(studentList);
        setPosts(postList);
      } catch {
        setError('Something went wrong while loading your dashboard.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const approvedCount = posts.filter((p) => p.status === 'APPROVED').length;
  const pendingCount = posts.filter((p) => p.status === 'PENDING').length;
  const totalVacancies = posts
    .filter((p) => p.status === 'APPROVED')
    .reduce((sum, p) => sum + p.vacancies, 0);

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

  return (
    <div className="space-y-8">
      {/* Welcome strip */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg shadow-sky-500/20">
        <h1 className="text-2xl font-black tracking-tight">Welcome back!</h1>
        <p className="text-sky-100 mt-2 text-sm max-w-2xl">
          When your company opens an internship vacancy, create a referral post and
          suggest juniors from your university who have not been placed yet.
        </p>
        <Link
          href="/dashboard/alumni/create-post"
          className="btn btn-sm bg-white text-sky-600 border-none rounded-xl mt-5 gap-2 hover:bg-sky-50"
        >
          Create a Referral Post <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Four stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Students Waiting"
          value={students.length}
          hint="No internship yet"
          icon={GraduationCap}
        />
        <StatCard
          label="My Posts"
          value={posts.length}
          hint="All time"
          icon={FileText}
          tone="bg-sky-50 text-sky-600"
        />
        <StatCard
          label="Approved"
          value={approvedCount}
          hint={`${totalVacancies} open seats`}
          icon={CheckCircle2}
          tone="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Awaiting Approval"
          value={pendingCount}
          hint="Admin is reviewing"
          icon={Clock}
          tone="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Preview of students */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900">Students Seeking Internships</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {Math.min(4, students.length)} of {students.length}
            </p>
          </div>
          <Link
            href="/dashboard/alumni/students"
            className="btn btn-ghost btn-sm rounded-xl text-sky-600 gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <table className="table w-full">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <th>Student</th>
              <th>Department</th>
              <th>Skills</th>
              <th className="text-right">Applications</th>
            </tr>
          </thead>
          <tbody>
            {students.slice(0, 4).map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/60 transition">
                <td>
                  <div className="font-bold text-slate-900">
                    {s.firstName} {s.lastName}
                  </div>
                  <div className="text-xs text-slate-400">{s.email}</div>
                </td>
                <td className="text-sm text-slate-600">{s.department}</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {s.skills.slice(0, 2).map((skill) => (
                      <span key={skill} className="badge badge-ghost badge-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="text-right font-semibold text-slate-700">
                  {s.applicationCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
