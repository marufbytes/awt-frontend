"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, Mail, Phone, Edit3, CheckCircle2, XCircle, X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Company {
  id: number;
  name: string;
  industry?: string;
  location?: string;
  email?: string;
  phone?: string;
  description?: string;
  isVerified?: boolean;
  users?: { email: string }[];
}

export default function MyCompanyPage() {
  const router = useRouter();

  // ১. Main Company State & Page States
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ২. Form Input Fields State
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    location: "",
    email: "",
    phone: "",
    description: "",
  });

  // ৩. Form Validation Errors State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Backend থেকে Company Data ফেচ করার কাজ
  const fetchCompanyProfile = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/company/my", {
        withCredentials: true,
      });

      const data = response.data;
      setCompany(data);

      // Form State-এ ডাটা সেট করা
      setFormData({
        name: data.name || "",
        industry: data.industry || "",
        location: data.location || "",
        email: data.email || "",
        phone: data.phone || "",
        description: data.description || "",
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCompanyProfile();
  }, [fetchCompanyProfile]);

  // Input টাইপ করার সাথে সাথে Form State আপডেট করা
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // ইউজার ইনপুট দেওয়া শুরু করলে সাথে সাথে ওই ফিল্ডের Error মুছে দেওয়া
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Edit Button Toggle করা
  const handleToggleEdit = () => {
    if (isEditing && company) {
      // Edit ক্যানসেল করলে আগের ডাটা রিস্টোর করা
      setFormData({
        name: company.name || "",
        industry: company.industry || "",
        location: company.location || "",
        email: company.email || "",
        phone: company.phone || "",
        description: company.description || "",
      });
      setErrors({});
    }
    setIsEditing((prev) => !prev);
  };

  // ৪. Custom Validation Function (সহজ লজিক)
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company Name is required";
    }

    if (!formData.industry.trim()) {
      newErrors.industry = "Industry is required";
    }

    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);

    // কোনো এরর না থাকলে Object.keys(newErrors).length হবে 0 (মানে True)
    return Object.keys(newErrors).length === 0;
  };

  // ৫. Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Browser-এর Default Reload বন্ধ করা

    // ভ্যালিডেশন চেক করা
    if (!validateForm()) return;

    if (!company?.id) return;

    setIsSubmitting(true);

    try {
      await axios.patch(`http://localhost:3000/company/${company.id}`, formData, {
        withCredentials: true,
      });

      setIsEditing(false);
      await fetchCompanyProfile();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update company profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-slate-400 text-sm font-medium">
        Loading Company Profile...
      </div>
    );
  }

  return (
    <div className="w-full max-w-full space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Company</h1>
        <p className="text-sm text-slate-500 mt-1">View and update your company details.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-extrabold text-lg shrink-0">
              {company?.name ? company.name.charAt(0).toUpperCase() : "C"}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900">{company?.name || "Company Name"}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${
                    company?.isVerified
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                      : "bg-amber-50 text-amber-600 border-amber-200/60"
                  }`}
                >
                  {company?.isVerified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {company?.isVerified ? "Verified" : "Unverified"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{company?.industry || "Software & Technology"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleEdit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
          >
            {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            {isEditing ? "Cancel" : "Edit Company"}
          </button>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100 text-xs">
          <div>
            <p className="text-[11px] font-bold uppercase text-slate-400 mb-1.5">Location</p>
            <p className="font-semibold text-slate-700 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              {company?.location || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-slate-400 mb-1.5">Email</p>
            <p className="font-semibold text-slate-700 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {company?.email || company?.users?.[0]?.email || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-slate-400 mb-1.5">Phone</p>
            <p className="font-semibold text-slate-700 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {company?.phone || "N/A"}
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-[11px] font-bold uppercase text-slate-400 mb-2">Description</p>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {company?.description || "No description provided yet."}
          </p>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Update Company Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border ${
                    errors.name ? "border-rose-500" : "border-slate-200"
                  } rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none`}
                />
                {errors.name && (
                  <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Industry */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Industry *</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border ${
                    errors.industry ? "border-rose-500" : "border-slate-200"
                  } rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none`}
                />
                {errors.industry && (
                  <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.industry}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Dhaka, Bangladesh"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. contact@company.com"
                  className={`w-full bg-slate-50 border ${
                    errors.email ? "border-rose-500" : "border-slate-200"
                  } rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none`}
                />
                {errors.email && (
                  <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +8801700000000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Write a short description..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 focus:outline-none resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleToggleEdit}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-semibold disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
