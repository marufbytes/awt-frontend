'use client';

import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Trash2, X, AlertCircle } from 'lucide-react';

import { getSession } from '@/lib/auth/session';
import {
  ApiError,
  createInternship,
  deleteInternship,
  getMyInternships,
  updateInternship,
} from '@/lib/company/api';
import type { Internship } from '@/lib/company/types';

export default function CompanyInternshipsPage() {
  const companyId = getSession()?.user.company?.id ?? null;

  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!companyId) {
      setLoading(false);
      return;
    }
    try {
      setInternships(await getMyInternships(companyId));
    } catch {
      setError('Could not load your internships.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [companyId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!companyId) return;
    setFormErrors([]);
    setSaving(true);
    try {
      const created = await createInternship(companyId, { title, description, requirements });
      setInternships((prev) => [created, ...prev]);
      setTitle('');
      setDescription('');
      setRequirements('');
      setShowForm(false);
    } catch (err) {
      setFormErrors(err instanceof ApiError ? err.messages : ['Something went wrong.']);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(internship: Internship) {
    const updated = await updateInternship(internship.id, { isActive: !internship.isActive });
    setInternships((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this internship posting? This cannot be undone.')) return;
    await deleteInternship(id);
    setInternships((prev) => prev.filter((i) => i.id !== id));
  }

  if (!companyId) {
    return (
      <div className="alert rounded-2xl">
        <AlertCircle className="w-4 h-4" />
        <span>Create your company profile before posting internships.</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="loading loading-spinner loading-lg text-sky-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <h3 className="font-bold text-slate-900">Your Internship Postings</h3>
          <p className="text-xs text-slate-400 mt-0.5">{internships.length} total</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn btn-sm bg-sky-500 hover:bg-sky-600 text-white border-none rounded-xl gap-2"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Post Internship'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error rounded-2xl">
          <span>{error}</span>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          {formErrors.length > 0 && (
            <div className="alert alert-error rounded-xl text-sm">
              <div>{formErrors.map((m) => <p key={m}>{m}</p>)}</div>
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
            <input
              type="text"
              required
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full mt-1 rounded-xl bg-slate-50"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full mt-1 rounded-xl bg-slate-50"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requirements</label>
            <textarea
              required
              rows={3}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="textarea textarea-bordered w-full mt-1 rounded-xl bg-slate-50"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="btn bg-sky-500 hover:bg-sky-600 text-white border-none rounded-xl gap-2"
          >
            {saving ? <span className="loading loading-spinner loading-sm" /> : null}
            Publish
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="table w-full">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <th>Title</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {internships.map((i) => (
              <tr key={i.id} className="hover:bg-slate-50/60 transition">
                <td>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-sky-500" /> {i.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 max-w-md truncate">{i.description}</div>
                </td>
                <td>
                  <button
                    onClick={() => toggleActive(i)}
                    className={`badge badge-sm font-semibold border cursor-pointer ${
                      i.isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {i.isActive ? 'Active' : 'Closed'}
                  </button>
                </td>
                <td className="text-right">
                  <button
                    onClick={() => handleDelete(i.id)}
                    className="btn btn-ghost btn-xs text-red-500 gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {internships.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-sm text-slate-400 py-8">
                  You haven&apos;t posted any internships yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
