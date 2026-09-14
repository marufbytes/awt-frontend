"use client";

import React, { useEffect, useState } from 'react';
import {
  FileText, Upload, Trash2, Eye, X, AlertCircle,
} from 'lucide-react';
import StudentSidebar from '@/components/student/StudentSidebar';
import { useRequireStudent } from '@/lib/student/use-require-student';
import { api, ApiError, resolveFileUrl } from '@/lib/student/api';
import type { Resume } from '@/lib/student/types';

export default function ResumeManagement(): React.JSX.Element {
  const { ready } = useRequireStudent();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!ready) return;
    api
      .get<Resume[]>('/resume/mine')
      .then(setResumes)
      .finally(() => setLoading(false));
  }, [ready]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await api.delete(`/resume/${id}`);
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete resume');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append('title', title);
      if (skills) body.append('skills', skills);
      body.append('file', file);
      const created = await api.post<Resume>('/resume', body);
      setResumes((prev) => [created, ...prev]);
      setTitle('');
      setSkills('');
      setFile(null);
      setIsUploadModalOpen(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  if (!ready || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Loading resumes…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <StudentSidebar active="resumes" resumesCount={resumes.length} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="space-y-2 z-10">
              <span className="bg-blue-500/30 text-blue-200 text-xs px-3 py-1 rounded-full font-medium tracking-wide uppercase">
                Resume Management
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">Manage Your Resumes</h2>
              <p className="text-blue-200 text-sm max-w-xl">
                Upload PDF resumes to use when applying for internships.
              </p>
            </div>

            <div className="flex items-center gap-3 z-10">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/35 transition-all"
              >
                <Upload className="w-4 h-4" /> Upload PDF
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-3 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Your Uploaded Resumes ({resumes.length})</h3>
              <span className="text-xs text-slate-400">PDF format, max 5MB</span>
            </div>

            {resumes.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-slate-700 font-semibold mb-1">No resumes found</h4>
                <p className="text-slate-500 text-xs mb-4">Upload a PDF to start applying for internships.</p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  Upload PDF Now
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {resumes.map((resume) => (
                  <div key={resume.id} className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-slate-900 text-base">{resume.title}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium flex-wrap">
                          <span>Uploaded: {new Date(resume.createDate).toLocaleDateString()}</span>
                          {resume.skills && resume.skills.length > 0 && (
                            <span>Skills: {resume.skills.join(', ')}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <a
                        href={resolveFileUrl(resume.fileUrl)}
                        target="_blank"
                        rel="noreferrer"
                        title="View Resume"
                        className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </a>

                      <button
                        title="Delete Resume"
                        onClick={() => handleDelete(resume.id)}
                        disabled={deletingId === resume.id}
                        className="p-2.5 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-100 disabled:opacity-60 text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isUploadModalOpen && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-slate-900">Upload PDF Resume</h3>
                  <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <label className="block border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-600 transition-colors cursor-pointer bg-slate-50">
                    <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-slate-700 mb-1">
                      {file ? file.name : 'Click to browse for a PDF'}
                    </p>
                    <p className="text-[10px] text-slate-400">PDF (Max file size: 5MB)</p>
                    <input
                      type="file"
                      accept="application/pdf"
                      required
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="hidden"
                    />
                  </label>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Resume Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Software Engineer Resume"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Skills (comma-separated, optional)</label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, SQL"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsUploadModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-600/30"
                    >
                      {uploading ? 'Uploading…' : 'Upload and Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
