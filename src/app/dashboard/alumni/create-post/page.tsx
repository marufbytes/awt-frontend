// src/app/dashboard/alumni/create-post/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Info } from 'lucide-react';

import { createReferralPost, getUnplacedStudents } from '@/lib/alumni/api';
import type { NewReferralPostForm, UnplacedStudent } from '@/lib/alumni/types';
import { MOCK_CURRENT_ALUMNI } from '@/lib/alumni/mockData';

const EMPTY_FORM: NewReferralPostForm = {
  title: '',
  companyName: MOCK_CURRENT_ALUMNI.companyName,
  location: '',
  description: '',
  requiredSkills: '',
  vacancies: 1,
  deadline: '',
  suggestedStudentIds: [],
};

export default function CreateReferralPostPage() {
  const router = useRouter();

  const [form, setForm] = useState<NewReferralPostForm>(EMPTY_FORM);
  const [students, setStudents] = useState<UnplacedStudent[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getUnplacedStudents().then(setStudents);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const toggleStudent = (id: number) => {
    setForm((prev) => ({
      ...prev,
      suggestedStudentIds: prev.suggestedStudentIds.includes(id)
        ? prev.suggestedStudentIds.filter((s) => s !== id)
        : [...prev.suggestedStudentIds, id],
    }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};

    if (!form.title.trim()) next.title = 'Job title is required';
    if (!form.companyName.trim()) next.companyName = 'Company name is required';
    if (!form.location.trim()) next.location = 'Location is required';
    if (form.description.trim().length < 20)
      next.description = 'Please write at least 20 characters';
    if (!form.requiredSkills.trim()) next.requiredSkills = 'Add at least one skill';
    if (form.vacancies < 1) next.vacancies = 'Must be at least 1';
    if (!form.deadline) next.deadline = 'Pick a deadline';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      await createReferralPost(form);
      setToast('Post submitted! An admin will review it shortly.');
      setForm(EMPTY_FORM);

      setTimeout(() => router.push('/dashboard/alumni/my-posts'), 1500);
    } catch {
      setToast('Could not submit the post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {toast && (
        <div className="toast toast-end z-50">
          <div className="alert alert-success text-white shadow-lg rounded-2xl">
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Explanation banner */}
      <div className="flex gap-3 bg-sky-50 border border-sky-100 rounded-2xl p-4">
        <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <p className="text-sm text-sky-800">
          Your post will be sent to an admin for approval before students can see it.
          You cannot edit or delete it afterwards.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
        {/* Title + Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Junior Frontend Intern"
              className="input input-bordered w-full rounded-xl bg-slate-50"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Company
            </label>
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="e.g. Akij IT"
              className="input input-bordered w-full rounded-xl bg-slate-50"
            />
            {errors.companyName && (
              <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>
            )}
          </div>
        </div>

        {/* Location + Vacancies + Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Banani, Dhaka"
              className="input input-bordered w-full rounded-xl bg-slate-50"
            />
            {errors.location && (
              <p className="text-xs text-red-500 mt-1">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Vacancies
            </label>
            <input
              type="number"
              name="vacancies"
              min={1}
              value={form.vacancies}
              onChange={handleChange}
              className="input input-bordered w-full rounded-xl bg-slate-50"
            />
            {errors.vacancies && (
              <p className="text-xs text-red-500 mt-1">{errors.vacancies}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="input input-bordered w-full rounded-xl bg-slate-50"
            />
            {errors.deadline && (
              <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Required Skills
          </label>
          <input
            type="text"
            name="requiredSkills"
            value={form.requiredSkills}
            onChange={handleChange}
            placeholder="React, TypeScript, Tailwind CSS"
            className="input input-bordered w-full rounded-xl bg-slate-50"
          />
          <p className="text-xs text-slate-400 mt-1">Separate each skill with a comma.</p>
          {errors.requiredSkills && (
            <p className="text-xs text-red-500 mt-1">{errors.requiredSkills}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder="Describe the role, the team, and what kind of student would fit..."
            className="textarea textarea-bordered w-full rounded-xl bg-slate-50"
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Suggest students */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Suggest Students{' '}
            <span className="text-slate-400 font-medium normal-case">(optional)</span>
          </label>

          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-64 overflow-y-auto">
            {students.map((s) => (
              <label
                key={s.id}
                className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={form.suggestedStudentIds.includes(s.id)}
                  onChange={() => toggleStudent(s.id)}
                  className="checkbox checkbox-sm checkbox-info"
                />
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-slate-800">
                    {s.firstName} {s.lastName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {s.department} · CGPA {s.cgpa.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 justify-end max-w-[40%]">
                  {s.skills.slice(0, 2).map((skill) => (
                    <span key={skill} className="badge badge-ghost badge-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </label>
            ))}
          </div>

          <p className="text-xs text-slate-400 mt-2">
            {form.suggestedStudentIds.length} student
            {form.suggestedStudentIds.length !== 1 && 's'} selected
          </p>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="btn bg-sky-500 hover:bg-sky-600 text-white border-none rounded-xl gap-2"
          >
            {submitting ? (
              <>
                <span className="loading loading-spinner loading-sm" /> Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit for Approval
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
