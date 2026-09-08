// src/app/dashboard/admin/companies/page.tsx
'use client';

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Building } from 'lucide-react';

const pendingCompanies = [
  { id: 101, name: 'Vortex Dynamics', industry: 'Robotics & AI', submitted: '2 hours ago', docUrl: '#' },
  { id: 102, name: 'CloudScale Inc.', industry: 'Cloud Computing', submitted: 'Yesterday', docUrl: '#' },
];

export default function ManageCompaniesPage() {
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

      {/* Verification Queue Section */}
      <div className="bg-amber-50/70 p-6 rounded-3xl shadow-xs space-y-4 border border-amber-100">
        <div className="flex items-center space-x-2 text-amber-800 font-bold">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <span>Pending Corporate Verifications ({pendingCompanies.length})</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingCompanies.map(comp => (
            <div key={comp.id} className="bg-white p-5 rounded-2xl flex justify-between items-center shadow-xs border border-amber-100/50">
              <div>
                <h4 className="font-bold text-slate-800">{comp.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{comp.industry} • Submitted {comp.submitted}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => showToast(`Approved verification for ${comp.name}`)} className="btn btn-success btn-xs text-white rounded-lg gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </button>
                <button onClick={() => showToast(`Rejected verification for ${comp.name}`)} className="btn btn-error btn-xs text-white rounded-lg gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Directory Table Placeholder */}
      <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-sky-500" /> All Registered Companies
          </h3>
          <input type="text" placeholder="Search company..." className="input input-bordered input-sm rounded-xl w-64 bg-slate-50" />
        </div>
        <p className="text-slate-500 text-xs">Manage active corporate partners, view posting quotas, and adjust enterprise statuses.</p>
      </div>
    </div>
  );
}