'use client';

import React, { useState } from 'react';
import { Settings, ShieldCheck, Database, RefreshCw } from 'lucide-react';

export default function SystemPanelPage() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {}
        <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center space-x-2 font-bold text-slate-900 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-sky-500" />
            <span>Security & Authentication</span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Enforce 2FA for Corporate Accounts</span>
              <input type="checkbox" defaultChecked className="toggle toggle-primary toggle-sm" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Auto-approve Student University Emails</span>
              <input type="checkbox" defaultChecked className="toggle toggle-primary toggle-sm" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Maintenance Mode</span>
              <input type="checkbox" className="toggle toggle-error toggle-sm" />
            </div>
          </div>
        </div>

        {}
        <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center space-x-2 font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Database className="w-5 h-5 text-indigo-500" />
            <span>Database & Cache Management</span>
          </div>
          <div className="space-y-4 text-sm">
            <p className="text-xs text-slate-500">Manage cache layers, clear outdated platform logs, and export full backup copies.</p>
            <div className="flex gap-3">
              <button onClick={() => showToast('System cache cleared successfully!')} className="btn btn-outline btn-sm rounded-xl gap-2">
                <RefreshCw className="w-3.5 h-3.5" /> Clear Cache
              </button>
              <button onClick={() => showToast('Full database backup triggered.')} className="btn btn-primary btn-sm rounded-xl text-white">
                Download Backup
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}