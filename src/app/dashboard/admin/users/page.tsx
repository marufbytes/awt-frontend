'use client';

import React, { useState } from 'react';
import { Eye, ShieldAlert, Trash2, UserPlus } from 'lucide-react';

const usersData = [
  { id: 1, name: 'Alex Johnson', email: 'alex.j@uni.edu', role: 'Student', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
  { id: 2, name: 'Sarah Jenkins', email: 's.jenkins@technova.io', role: 'Company', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { id: 3, name: 'Michael Chen', email: 'm.chen@alumni.org', role: 'Alumni', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: 4, name: 'Admin User', email: 'admin@internnova.com', role: 'Admin', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
];

export default function ManageUsersPage() {
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
            placeholder="Search user name or email..." 
            className="input input-bordered input-sm rounded-xl w-full sm:w-72 bg-slate-50" 
          />
          <select className="select select-bordered select-sm rounded-xl bg-slate-50">
            <option>All Roles</option>
            <option>Student</option>
            <option>Alumni</option>
            <option>Company</option>
            <option>Admin</option>
          </select>
        </div>
        <button onClick={() => showToast('User creation modal opened.')} className="btn btn-primary btn-sm rounded-xl text-white gap-2">
          <UserPlus className="w-4 h-4" /> Add New User
        </button>
      </div>

      {}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <th>User Profile</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/60 transition">
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar"><div className="mask mask-squircle w-10 h-10"><img src={u.avatar} alt="avatar" /></div></div>
                    <div>
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-xs text-slate-400">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge badge-sm font-semibold ${u.role === 'Admin' ? 'badge-error text-white' : u.role === 'Student' ? 'badge-primary text-white' : 'badge-ghost'}`}>
                    {u.role}
                  </span>
                </td>
                <td><span className="badge badge-success badge-outline badge-sm gap-1">● {u.status}</span></td>
                <td className="text-right space-x-1">
                  <button onClick={() => showToast(`Viewing details for ${u.name}`)} className="btn btn-ghost btn-xs text-sky-600"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => showToast(`Suspended user ${u.name}`)} className="btn btn-ghost btn-xs text-amber-500"><ShieldAlert className="w-4 h-4" /></button>
                  <button onClick={() => showToast(`Deleted user ${u.name}`)} className="btn btn-ghost btn-xs text-red-500"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}