"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Phone, AlertCircle } from "lucide-react";
import { api, ApiError } from "@/lib/student/api";
import { useAuth } from "@/lib/student/auth-context";
import type { CurrentUser, UserRole } from "@/lib/student/types";

export default function RegisterPage(): React.JSX.Element {
  const router = useRouter();
  const { refresh } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "STUDENT" as UserRole,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { user } = await api.post<{ user: CurrentUser }>("/auth/register", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: form.role,
        ...(form.phone ? { phone: form.phone } : {}),
      });
      await refresh();
      if (user.role === "STUDENT") {
        router.push("/student/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-200">
              U
            </div>
            <span className="text-xl font-bold text-slate-900">
              UniCareer <span className="text-blue-600">Connect</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Create your account</h1>
          <p className="text-sm text-slate-500 mb-6">
            Join UniCareer Connect to browse internships and track applications.
          </p>

          {error && (
            <div className="mb-5 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-500 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    name="firstName"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full pl-11 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-500 mb-2">
                  Last Name
                </label>
                <input
                  name="lastName"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-500 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-500 mb-2">
                Phone (optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                  placeholder="+880 1XXX-XXXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-500 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                  placeholder="At least 6 characters, mixed case"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-500 mb-2">
                I am a
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium bg-white"
              >
                <option value="STUDENT">Student</option>
                <option value="ALUMNI">Alumni</option>
                <option value="HR">Employer / HR</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-5 py-3 rounded-xl text-sm shadow-sm transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Already have an account?{" "}
            <Link href="/student/auth/login" className="text-blue-600 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
