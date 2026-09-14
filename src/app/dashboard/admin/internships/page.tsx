'use client';

import React, { useState } from 'react';
import { Briefcase, Eye, Trash2, CheckCircle2, Clock } from 'lucide-react';

const internshipsData = [
  { id: 1, title: 'Frontend Developer Intern', company: 'TechNova', type: 'Remote', applicants: 45, status: 'Active' },
  { id: 2, title: 'AI Research Assistant', company: 'AlphaSolutions', type: 'Hybrid', applicants: 28, status: 'Active' },
  { id: 3, title: 'UI/UX Design Intern', company: 'NexusCorp', type: 'On-site', applicants: 19, status: 'Pending Review' },
];

export default function ManageInternshipsPage() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {}
      {toast && (
        <div className="toast toast-end z-50">
          <div className="alert alert-success text-white shadow-lg rounded-2xl">
            <span>{toast}</span>
          </div>
        </div>
      )}

      {}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex gap-3 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search internship or company..." 
            className="input input-bordered input-sm rounded-xl w-full sm:w-72 bg-slate-50" 
          />
          <select className="select select-bordered select-sm rounded-xl bg-slate-50">
            <option>All Status</option>
            <option>Active</option>
            <option>Pending Review</option>
            <option>Closed</option>
          </select>
        </div>
        <span className="text-xs font-semibold text-slate-400">Total Listings: {internshipsData.length}</span>
      </div>

      {}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <th>Internship Title</th>
              <th>Company</th>
              <th>Work Type</th>
              <th>Applicants</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {internshipsData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition">
                <td>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-sky-500" /> {item.title}
                  </div>
                </td>
                <td className="text-slate-600 font-medium">{item.company}</td>
                <td>
                  <span className="badge badge-ghost badge-sm">{item.type}</span>
                </td>
                <td className="font-semibold text-slate-700">{item.applicants} students</td>
                <td>
                  <span className={`badge badge-sm font-semibold gap-1 ${item.status === 'Active' ? 'badge-success text-white' : 'badge-warning text-white'}`}>
                    {item.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {item.status}
                  </span>
                </td>
                <td className="text-right space-x-1">
                  <button onClick={() => showToast(`Viewing details for ${item.title}`)} className="btn btn-ghost btn-xs text-sky-600"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => showToast(`Removed listing: ${item.title}`)} className="btn btn-ghost btn-xs text-red-500"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}