"use client";
import React, { useEffect, useState } from 'react';
import {
  Search, Building2, CheckCircle2, ArrowRight, X,
} from 'lucide-react';
import Link from 'next/link';
import StudentSidebar from '@/components/student/StudentSidebar';
import { useRequireStudent } from '@/lib/student/use-require-student';
import { api } from '@/lib/student/api';
import type { Internship, Resume } from '@/lib/student/types';

export default function InternshipBrowsing(): React.JSX.Element {
  const { ready } = useRequireStudent();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [resumeCount, setResumeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<Internship | null>(null);

  useEffect(() => {
    if (!ready) return;
    (async () => {
      try {
        const [list, resumes] = await Promise.all([
          api.get<Internship[]>('/internship'),
          api.get<Resume[]>('/resume/mine'),
        ]);
        setInternships(list);
        setResumeCount(resumes.length);
      } finally {
        setLoading(false);
      }
    })();
  }, [ready]);

  if (!ready || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Loading internships…
      </div>
    );
  }

  const filtered = internships.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.isActive &&
      (item.title.toLowerCase().includes(q) ||
        item.company?.name?.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <StudentSidebar active="internships" resumesCount={resumeCount} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="space-y-2 z-10">
              <span className="bg-blue-500/30 text-blue-200 text-xs px-3 py-1 rounded-full font-medium tracking-wide uppercase">
                Career Hub
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">Explore Open Internships</h2>
              <p className="text-blue-200 text-sm max-w-xl">
                Browse verified internship postings from partner companies.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl z-10">
              <p className="text-xs text-blue-200 font-medium">Available Openings</p>
              <p className="text-2xl font-black text-white mt-0.5">{filtered.length} Positions</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search role, company or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((internship) => (
              <div
                key={internship.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100">
                        {internship.company?.name?.charAt(0) ?? '?'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{internship.title}</h4>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3.5 h-3.5" /> {internship.company?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {internship.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => setSelected(internship)}
                    className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-sm font-medium">No internships found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      {selected && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{selected.company?.name}</span>
                <h3 className="text-xl font-extrabold text-slate-900">{selected.title}</h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">About the Internship</h4>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm whitespace-pre-line">
                  {selected.description}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">Requirements</h4>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm whitespace-pre-line flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{selected.requirements}</span>
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 sticky bottom-0">
              <button
                onClick={() => setSelected(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors"
              >
                Close
              </button>
              <Link
                href={`/student/internships/${selected.id}/apply`}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors bg-blue-600 hover:bg-blue-700"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
