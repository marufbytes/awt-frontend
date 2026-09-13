"use client";

import { useState } from "react";
import Image from "next/image";

export default function AdminProfilePage() {
  const [name, setName] = useState("Administrator");
  const [email, setEmail] = useState("admin@internnova.com");
  const [pwd, setPwd] = useState({ current: "", new: "" });
  const [msg, setMsg] = useState("");

  const showMsg = (txt: string) => {
    setMsg(txt);
    setTimeout(() => setMsg(""), 3000);
  };

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showMsg("Profile saved!");
  };

  const savePwd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwd.current || !pwd.new) return showMsg("Fill both password fields");
    setPwd({ current: "", new: "" });
    showMsg("Password updated!");
  };

  return (
    <div className="w-full space-y-6">
      {msg && (
        <div className="toast toast-end z-50">
          <div className="alert alert-info text-white text-xs">{msg}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card bg-base-100 shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center justify-center">
          <div className="avatar mb-3">
            <div className="w-24 rounded-full relative overflow-hidden">
              <Image src="/admin.avif" alt="Admin" fill className="object-cover" />
            </div>
          </div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <span className="badge badge-primary badge-xs mt-1">Admin</span>
          <p className="text-xs text-slate-400 mt-2 break-all">{email}</p>
        </div>

        {/* Forms */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={saveProfile} className="card bg-base-100 shadow-sm border border-slate-100 p-6 space-y-4">
            <h3 className="font-semibold text-sm">General Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered input-sm w-full"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered input-sm w-full"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
            </div>
          </form>

          <form onSubmit={savePwd} className="card bg-base-100 shadow-sm border border-slate-100 p-6 space-y-4">
            <h3 className="font-semibold text-sm">Security & Password</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={pwd.current}
                  onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                  className="input input-bordered input-sm w-full"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={pwd.new}
                  onChange={(e) => setPwd({ ...pwd, new: e.target.value })}
                  className="input input-bordered input-sm w-full"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn btn-neutral btn-sm">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}