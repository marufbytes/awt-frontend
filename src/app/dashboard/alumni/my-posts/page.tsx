'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { MapPin, Users, CalendarDays, FileText, PlusCircle } from 'lucide-react';

import { getMyReferralPosts } from '@/lib/alumni/api';
import type { ReferralPost, ReferralPostStatus } from '@/lib/alumni/types';

const STATUS_STYLES: Record<ReferralPostStatus, string> = {
  APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

const FILTERS: Array<'ALL' | ReferralPostStatus> = [
  'ALL',
  'APPROVED',
  'PENDING',
  'REJECTED',
];

export default function MyPostsPage() {
  const [posts, setPosts] = useState<ReferralPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'ALL' | ReferralPostStatus>('ALL');

  useEffect(() => {
    getMyReferralPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const visiblePosts = useMemo(
    () => (filter === 'ALL' ? posts : posts.filter((p) => p.status === filter)),
    [posts, filter],
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="loading loading-spinner loading-lg text-sky-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm rounded-xl border-none ${
                filter === f
                  ? 'bg-sky-500 text-white hover:bg-sky-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'ALL' ? 'All Posts' : f.charAt(0) + f.slice(1).toLowerCase()}
              <span className="ml-1 opacity-70">
                ({f === 'ALL' ? posts.length : posts.filter((p) => p.status === f).length})
              </span>
            </button>
          ))}
        </div>

        <Link
          href="/dashboard/alumni/create-post"
          className="btn btn-sm bg-sky-500 hover:bg-sky-600 text-white border-none rounded-xl gap-2"
        >
          <PlusCircle className="w-4 h-4" /> New Post
        </Link>
      </div>

      {visiblePosts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-700">No posts here yet</h3>
          <p className="text-sm text-slate-400 mt-1">
            Create a referral post when your company opens an internship vacancy.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visiblePosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{post.title}</h3>
                  <p className="text-sm text-slate-500">{post.companyName}</p>
                </div>

                <span
                  className={`badge badge-sm font-semibold border ${STATUS_STYLES[post.status]}`}
                >
                  {post.status}
                </span>
              </div>

              <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                {post.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {post.requiredSkills.map((skill) => (
                  <span key={skill} className="badge badge-ghost badge-sm">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {post.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> {post.vacancies}{' '}
                  vacanc{post.vacancies === 1 ? 'y' : 'ies'}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-400" /> Deadline{' '}
                  {post.deadline}
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />{' '}
                  {post.suggestedStudentIds.length} student
                  {post.suggestedStudentIds.length !== 1 && 's'} suggested
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
