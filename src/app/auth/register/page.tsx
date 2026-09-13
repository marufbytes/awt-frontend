"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";

const regSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "Phone required"),
  password: z.string().min(8, "Min 8 chars"),
  role: z.enum(["STUDENT", "HR", "ALUMNI"]),
  companyName: z.string().optional(),
  industry: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.role === "HR") {
    if (!data.companyName?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Company name required", path: ["companyName"] });
    if (!data.industry?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Industry required", path: ["industry"] });
  }
});

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "",
    role: "STUDENT", companyName: "", industry: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState({ loading: false, msg: "" });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setStatus({ loading: true, msg: "" });

    const parsed = regSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach(i => { if (i.path[0]) fieldErrors[i.path[0] as string] = i.message; });
      setErrors(fieldErrors);
      setStatus({ loading: false, msg: "" });
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setStatus({ loading: false, msg: "Account created successfully!" });
    } catch (err: any) {
      setStatus({ loading: false, msg: err.message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="w-full bg-white border-b border-gray-100 py-4 px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 bg-blue-600">
            <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
          </div>
          <span className="text-xl font-bold text-gray-900 leading-tight">
            InternNova <span className="block text-xs font-normal text-gray-500">Connect</span>
          </span>
        </Link>
        <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">← Back to Home</Link>
      </header>

      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-12 flex flex-col justify-between">
            <div>
              <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <Link href="/auth/login" className="flex-1 py-2 text-center text-sm font-semibold text-gray-500 hover:text-gray-900 rounded-lg transition">Log In</Link>
                <Link href="/auth/register" className="flex-1 py-2 text-center text-sm font-semibold bg-white text-blue-600 rounded-lg shadow-sm">Register</Link>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create an Account</h2>
              {status.msg && (
                <div className={`mb-4 p-3 rounded-xl text-xs ${status.msg.includes("success") ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                  {status.msg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">First Name</label>
                    <input type="text" value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="First" className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition" />
                    {errors.firstName && <p className="text-red-500 text-[11px] mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Last Name</label>
                    <input type="text" value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Last" className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition" />
                    {errors.lastName && <p className="text-red-500 text-[11px] mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Category / Role</label>
                  <select value={form.role} onChange={e => set("role", e.target.value)} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition">
                    <option value="STUDENT">Student</option>
                    <option value="HR">HR</option>
                    <option value="ALUMNI">Alumni</option>
                  </select>
                </div>

                {form.role === "HR" && (
                  <div className="space-y-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Company Name</label>
                      <input type="text" value={form.companyName} onChange={e => set("companyName", e.target.value)} placeholder="Company Name" className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition" />
                      {errors.companyName && <p className="text-red-500 text-[11px] mt-1">{errors.companyName}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Industry</label>
                      <input type="text" value={form.industry} onChange={e => set("industry", e.target.value)} placeholder="Industry" className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition" />
                      {errors.industry && <p className="text-red-500 text-[11px] mt-1">{errors.industry}</p>}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email Address</label>
                  <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="name@example.com" className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition" />
                  {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="Phone" className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition" />
                  {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Password</label>
                  <input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition" />
                  {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>}
                </div>

                <button type="submit" disabled={status.loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md transition mt-2">
                  {status.loading ? "Signing Up..." : "Sign Up"}
                </button>
              </form>
            </div>

            <div className="text-center mt-6 text-sm text-gray-500">
              <p>Already have an account? <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">Log In</Link></p>
            </div>
          </div>

          <div className="hidden md:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-blue-400 to-blue-600 text-white text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 relative overflow-hidden">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <h3 className="text-3xl font-extrabold mb-3 leading-tight">Start Your Journey<br />With Us!</h3>
            <p className="text-blue-100 text-sm max-w-sm leading-relaxed">Create your profile to unlock career opportunities, connect with top employers, and grow your professional network.</p>
          </div>
        </div>
      </div>

      <footer className="w-full py-4 px-8 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
        <p>© 2026 UniCareer Connect</p>
        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
      </footer>
    </div>
  );
}