"use client";
import React, { useEffect, useState } from 'react';
import {
  User, Phone, Mail, Camera, Edit3, Save, X, CheckCircle2, AlertCircle,
} from 'lucide-react';
import StudentSidebar from '@/components/student/StudentSidebar';
import StudentTopbar from '@/components/student/StudentTopbar';
import { useRequireStudent } from '@/lib/student/use-require-student';
import { useAuth } from '@/lib/student/auth-context';
import { api, resolveFileUrl } from '@/lib/student/api';
import type { CurrentUser, Resume } from '@/lib/student/types';

export default function StudentProfile(): React.JSX.Element {
  const { user, ready } = useRequireStudent();
  const { refresh } = useAuth();
  const [resumeCount, setResumeCount] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? '' });
    }
  }, [user]);

  useEffect(() => {
    if (!ready) return;
    api.get<Resume[]>('/resume/mine').then((r) => setResumeCount(r.length)).catch(() => {});
  }, [ready]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Loading profile…
      </div>
    );
  }

  const avatarUrl = avatarPreview || resolveFileUrl(user.profilePictureUrl);
  const displayName = `${user.firstName} ${user.lastName}`.trim();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? '' });
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const body = new FormData();
      body.append('firstName', form.firstName);
      body.append('lastName', form.lastName);
      if (form.phone) body.append('phone', form.phone);
      if (avatarFile) body.append('profilePicture', avatarFile);

      await api.patch(`/user/${user.id}`, body);
      await refresh();
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <StudentSidebar active="profile" resumesCount={resumeCount} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <StudentTopbar label="Portal / Student Profile" />

        <div className="p-8 space-y-8 max-w-5xl w-full mx-auto">
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-xl flex items-center gap-3 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-medium">Profile successfully updated!</span>
            </div>
          )}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-3 rounded-xl flex items-center gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="h-36 bg-gradient-to-r from-blue-900 to-indigo-900 relative">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
            </div>

            <div className="px-8 pb-8 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16">
              <div className="flex items-end gap-5">
                <div className="relative group">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-md bg-slate-800 text-white flex items-center justify-center text-3xl font-bold">
                      {displayName.charAt(0)}
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute inset-0 bg-slate-900/50 rounded-2xl flex flex-col items-center justify-center text-white cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-semibold uppercase">Change</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>

                <div className="mb-1">
                  <h2 className="text-2xl font-extrabold text-slate-900">{displayName}</h2>
                  <p className="text-slate-500 text-sm font-medium">{user.role}</p>
                  <span className="inline-block mt-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-blue-100">
                    ID: {user.id}
                  </span>
                </div>
              </div>

              <div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage your personal particulars and contact information</p>
            </div>

            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mt-0.5">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">Full Name</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{displayName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">Phone Number</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{user.phone || 'Not set'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100 md:col-span-2">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">Email Address</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{user.email}</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-500 mb-2">First Name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-500 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-500 mb-2">Phone Number</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-500 mb-2">Email Address (Read-only)</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving…' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
