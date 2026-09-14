"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft, Edit3, Power, PowerOff, X } from "lucide-react";

interface ApplicationStats {
  total: number;
  pending: number;
  reviewed: number;
  interview: number;
  accepted: number;
  rejected: number;
}

interface Internship {
  id: number;
  title: string;
  description: string;
  requirements: string;
  isActive: boolean;
  company?: {
    id: number;
    name: string;
  };
  stats?: ApplicationStats;
}

export default function InternshipDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams?.id;
  const router = useRouter();

  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
  });

  useEffect(() => {
    if (!id) return;
    fetchInternship();
  }, [id]);

  const fetchInternship = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/internship/${id}`, {
        withCredentials: true,
      });
      setInternship(res.data);
    } catch (error: any) {
      console.error("Error fetching internship details:", error);
      if (error.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = () => {
    if (internship) {
      setFormData({
        title: internship.title || "",
        description: internship.description || "",
        requirements: internship.requirements || "",
      });
      setIsEditOpen(true);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.patch(
        `http://localhost:3000/internship/${id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      setInternship((prev) => (prev ? { ...prev, ...formData } : null));
      setIsEditOpen(false);
    } catch (error: any) {
      console.error("Error updating internship:", error);
      if (error.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!internship) return;

    try {
      const res = await axios.patch(
        `http://localhost:3000/internship/${id}/toggle-status`,
        {},
        {
          withCredentials: true,
        }
      );

      setInternship((prev) => (prev ? { ...prev, isActive: res.data.isActive } : null));
    } catch (error: any) {
      console.error("Error toggling internship status:", error);
      if (error.response?.status === 401) {
        router.push("/login");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm font-bold text-slate-500">Loading internship details...</p>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-sm font-bold text-slate-600">Internship not found.</p>
        <Link href="/dashboard/HR/internships" className="text-sm font-bold text-black hover:underline">
          Back to Internships
        </Link>
      </div>
    );
  }

  const stats = internship.stats || {
    total: 0,
    pending: 0,
    reviewed: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
  };

  return (
    <div className="w-full max-w-full space-y-5 font-sans relative">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-100/80 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => router.push("/dashboard/HR/internships")}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200/60"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{internship.title}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                internship.isActive
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-rose-50 text-rose-600 border-rose-100"
              }`}>
                {internship.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Internships / <span className="text-slate-600 font-semibold">{internship.title}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <button
            onClick={handleOpenEditModal}
            className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>

          <button
            onClick={handleToggleStatus}
            className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            {internship.isActive ? (
              <>
                <PowerOff className="w-4 h-4" />
                Deactivate
              </>
            ) : (
              <>
                <Power className="w-4 h-4" />
                Activate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left Side: Description & Requirements */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-5">

            {/* Description Block */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Description
              </h3>
              <div className="bg-slate-50/70 border border-slate-100 p-4 rounded-2xl">
                <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-line break-words">
                  {internship.description || "No description provided."}
                </p>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Requirements Block */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Requirements
              </h3>
              <div className="bg-slate-50/70 border border-slate-100 p-4 rounded-2xl">
                <p className="text-sm font-semibold text-slate-800 leading-relaxed whitespace-pre-line break-words">
                  {internship.requirements || "No requirements specified."}
                </p>
              </div>
            </div>

            {internship.company && (
              <>
                <hr className="border-slate-100" />

                {/* Company Block */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Company
                  </h3>
                  <p className="text-sm font-extrabold text-slate-900 tracking-tight">
                    {internship.company.name}
                  </p>
                </div>
              </>
            )}

          </div>
        </div>

        {/* Right Side: Application Summary */}
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 tracking-tight uppercase">Application Summary</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50/60 border border-slate-100/60 p-3.5 rounded-2xl text-center">
                <span className="block text-lg font-extrabold text-slate-900">{stats.total ?? 0}</span>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total</span>
              </div>

              <div className="bg-amber-50/60 border border-amber-100/60 p-3.5 rounded-2xl text-center">
                <span className="block text-lg font-extrabold text-amber-600">{stats.pending ?? 0}</span>
                <span className="block text-xs font-bold text-amber-500 uppercase tracking-wider mt-0.5">Pending</span>
              </div>

              <div className="bg-sky-50/60 border border-sky-100/60 p-3.5 rounded-2xl text-center">
                <span className="block text-lg font-extrabold text-sky-600">{stats.reviewed ?? 0}</span>
                <span className="block text-xs font-bold text-sky-500 uppercase tracking-wider mt-0.5">Reviewed</span>
              </div>

              <div className="bg-indigo-50/60 border border-indigo-100/60 p-3.5 rounded-2xl text-center">
                <span className="block text-lg font-extrabold text-indigo-600">{stats.interview ?? 0}</span>
                <span className="block text-xs font-bold text-indigo-500 uppercase tracking-wider mt-0.5">Interview</span>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-100/60 p-3.5 rounded-2xl text-center">
                <span className="block text-lg font-extrabold text-emerald-600">{stats.accepted ?? 0}</span>
                <span className="block text-xs font-bold text-emerald-500 uppercase tracking-wider mt-0.5">Accepted</span>
              </div>

              <div className="bg-rose-50/60 border border-rose-100/60 p-3.5 rounded-2xl text-center">
                <span className="block text-lg font-extrabold text-rose-600">{stats.rejected ?? 0}</span>
                <span className="block text-xs font-bold text-rose-500 uppercase tracking-wider mt-0.5">Rejected</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Popup Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Edit Internship Details</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                  placeholder="Internship Title"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-hidden focus:border-black focus:bg-white transition-all resize-none"
                  placeholder="Enter description..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Requirements
                </label>
                <textarea
                  rows={3}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-hidden focus:border-black focus:bg-white transition-all resize-none"
                  placeholder="Enter requirements..."
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-black hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs shadow-black/10 transition-all cursor-pointer active:scale-95"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
