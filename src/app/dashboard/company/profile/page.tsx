'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, CheckCircle2, AlertCircle } from 'lucide-react';

import { getSession, updateSessionCompany } from '@/lib/auth/session';
import { ApiError, createCompany, getCompany, updateCompany } from '@/lib/company/api';
import type { Company } from '@/lib/company/types';

export default function CompanyProfilePage() {
  const router = useRouter();
  const companyId = getSession()?.user.company?.id ?? null;

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(!!companyId);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!companyId) return;
    getCompany(companyId)
      .then((c) => {
        setCompany(c);
        setName(c.name);
        setIndustry(c.industry);
        setDescription(c.description ?? '');
      })
      .catch(() => setErrors(['Could not load your company profile.']))
      .finally(() => setLoading(false));
  }, [companyId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    setSuccess(null);
    setSaving(true);
    try {
      if (company) {
        const updated = await updateCompany(company.id, { name, industry, description });
        setCompany(updated);
        updateSessionCompany({ id: updated.id, name: updated.name });
        setSuccess('Company profile updated.');
      } else {
        const created = await createCompany({ name, industry, description });
        setCompany(created);
        updateSessionCompany({ id: created.id, name: created.name });
        setSuccess('Company created! Redirecting to your dashboard…');
        setTimeout(() => router.replace('/dashboard/company'), 1200);
      }
    } catch (err) {
      setErrors(err instanceof ApiError ? err.messages : ['Something went wrong.']);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="loading loading-spinner loading-lg text-sky-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">
              {company ? 'Edit Company Profile' : 'Create Your Company'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {company
                ? company.isVerified
                  ? 'Verified by admin'
                  : 'Awaiting admin verification'
                : 'You need a company profile before posting internships.'}
            </p>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="alert alert-error rounded-xl mb-4 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div>{errors.map((m) => <p key={m}>{m}</p>)}</div>
          </div>
        )}
        {success && (
          <div className="alert alert-success text-white rounded-xl mb-4 text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Company Name
            </label>
            <input
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full mt-1 rounded-xl bg-slate-50"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Industry
            </label>
            <input
              type="text"
              required
              maxLength={50}
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="input input-bordered w-full mt-1 rounded-xl bg-slate-50"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Description
            </label>
            <textarea
              maxLength={500}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full mt-1 rounded-xl bg-slate-50"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="btn bg-sky-500 hover:bg-sky-600 text-white border-none rounded-xl gap-2"
          >
            {saving ? <span className="loading loading-spinner loading-sm" /> : null}
            {company ? 'Save Changes' : 'Create Company'}
          </button>
        </form>
      </div>
    </div>
  );
}
