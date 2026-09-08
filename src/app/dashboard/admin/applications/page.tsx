// src/app/dashboard/admin/applications/page.tsx
'use client';

import React, { useState } from 'react';
import { FileText, Eye, CheckCircle2 } from 'lucide-react';

const applicationsData = [
  { id: 1, student: 'Alex Johnson', position: 'Frontend Developer Intern', company: 'TechNova', date: 'May 12, 2026', status: 'Interviewing' },
  { id: 2, student: 'Michael Chen', position: 'AI Research Assistant', company: 'AlphaSolutions', date: 'May 10, 2026', status: 'Applied' },
  { id: 3, student: 'Sarah Jenkins', position: 'UI/UX Design Intern', company: 'NexusCorp', date: 'May 08, 2026', status: 'Offered' },
];

export default function ManageApplicationsPage() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Container */}
      {toast && (
        <div className="toast toast-end z-50">
          <div className="alert alert-success text-white shadow-lg rounded-2xl">
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm">
        <input 
          type="text" 
          placeholder="Filter by student, position, or company..." 
          className="input input-bordered input-sm rounded-xl w-full sm:w-80 bg-slate-50" 
        />
        <div className="flex gap-2">
          <select className="select select-bordered select-sm rounded-xl bg-slate-50">
            <option>All Stages</option>
            <option>Applied</option>
            <option>Interviewing</option>
            <option>Offered</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <th>Student Name</th>
              <th>Position & Company</th>
              <th>Applied Date</th>
              <th>Status Pipeline</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicationsData.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50/60 transition">
                <td>
                  <div className="font-bold text-slate-900">{app.student}</div>
                </td>
                <td>
                  <div className="text-slate-800 font-medium">{app.position}</div>
                  <div className="text-xs text-slate-400">{app.company}</div>
                </td>
                <td className="text-xs text-slate-500">{app.date}</td>
                <td>
                  <span className={`badge badge-sm font-semibold ${app.status === 'Offered' ? 'badge-success text-white' : app.status === 'Interviewing' ? 'badge-info text-white' : 'badge-ghost'}`}>
                    {app.status}
                  </span>
                </td>
                <td className="text-right">
                  <button onClick={() => showToast(`Viewing application file for ${app.student}`)} className="btn btn-ghost btn-xs text-sky-600 gap-1">
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}