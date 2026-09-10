// src/app/dashboard/alumni/students/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search, FileDown, GraduationCap } from 'lucide-react';

import { getUnplacedStudents } from '@/lib/alumni/api';
import type { UnplacedStudent } from '@/lib/alumni/types';

export default function AlumniStudentsPage() {
  const [students, setStudents] = useState<UnplacedStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [search, setSearch] = useState<string>('');
  const [department, setDepartment] = useState<string>('All');

  useEffect(() => {
    getUnplacedStudents()
      .then(setStudents)
      .finally(() => setLoading(false));
  }, []);

  const departments = useMemo(
    () => ['All', ...Array.from(new Set(students.map((s) => s.department)))],
    [students],
  );

  const visibleStudents = useMemo(() => {
    return students.filter((s) => {
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      const query = search.toLowerCase();

      const matchesSearch =
        query === '' ||
        fullName.includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.skills.some((skill) => skill.toLowerCase().includes(query));

      const matchesDepartment = department === 'All' || s.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [students, search, department]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="loading loading-spinner loading-lg text-sky-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or skill..."
              className="input input-bordered input-sm rounded-xl pl-10 w-full sm:w-80 bg-slate-50"
            />
          </div>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="select select-bordered select-sm rounded-xl bg-slate-50"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-slate-500 font-medium">
          {visibleStudents.length} student{visibleStudents.length !== 1 && 's'} found
        </div>
      </div>

      {/* Empty state */}
      {visibleStudents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-700">No students match your search</h3>
          <p className="text-sm text-slate-400 mt-1">
            Try a different name, skill or department.
          </p>
        </div>
      ) : (
        /* Student cards */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {visibleStudents.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
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
                    <p className="text-xs text-slate-400">Batch of {s.graduationYear}</p>
                  </div>
                </div>
                <span className="badge badge-sm bg-sky-50 text-sky-600 border-none font-semibold">
                  CGPA {s.cgpa.toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-4">{s.department}</p>
              <p className="text-xs text-slate-400">{s.email}</p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {s.skills.map((skill) => (
                  <span key={skill} className="badge badge-ghost badge-sm">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  Applied to <strong className="text-slate-600">{s.applicationCount}</strong>{' '}
                  internships
                </span>

                {s.resumeUrl ? (
                  <a
                    href={s.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-xs text-sky-600 gap-1 rounded-lg"
                  >
                    <FileDown className="w-3.5 h-3.5" /> Resume
                  </a>
                ) : (
                  <span className="text-xs text-slate-300 italic">No resume</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
