"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  User,
} from "lucide-react";
import { useAuth } from "@/lib/student/auth-context";

type ActiveRoute =
  | "dashboard"
  | "internships"
  | "resumes"
  | "interviews"
  | "applications"
  | "profile";

const linkClass = (isActive: boolean) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
    isActive
      ? "bg-blue-50 text-blue-600"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
  }`;

export default function StudentSidebar({
  active,
  resumesCount,
  interviewsCount,
}: {
  active: ActiveRoute;
  resumesCount?: number;
  interviewsCount?: number;
}) {
  const { user } = useAuth();
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : "";

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex-col justify-between hidden md:flex sticky top-0 h-screen">
      <div>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
          <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-blue-600">
            <Image src="/logo.jpg" alt="InternNova Logo" fill className="object-cover" />
          </div>
          <Link href="/">
            <h1 className="font-bold text-slate-900 leading-tight">UniCareer</h1>
            <span className="text-xs text-blue-600 font-semibold tracking-wide">
              Connect
            </span>
          </Link>
        </div>

        <nav className="p-4 space-y-1.5">
          <Link href="/student/dashboard" className={linkClass(active === "dashboard")}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/student/internships" className={linkClass(active === "internships")}>
            <Briefcase className="w-5 h-5" />
            <span>Internships</span>
          </Link>
          <Link href="/student/resumes" className={linkClass(active === "resumes")}>
            <FileText className="w-5 h-5" />
            <span>My Resumes</span>
            {typeof resumesCount === "number" && (
              <span className="ml-auto bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                {resumesCount}
              </span>
            )}
          </Link>
          <Link href="/student/interviews" className={linkClass(active === "interviews")}>
            <Calendar className="w-5 h-5" />
            <span>My Interviews</span>
            {typeof interviewsCount === "number" && interviewsCount > 0 && (
              <span className="ml-auto bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                {interviewsCount}
              </span>
            )}
          </Link>
          <Link href="/student/applications" className={linkClass(active === "applications")}>
            <Briefcase className="w-5 h-5" />
            <span>My Applications</span>
          </Link>
          <Link href="/student/profile" className={linkClass(active === "profile")}>
            <User className="w-5 h-5" />
            <span>My Profile</span>
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
            {displayName.charAt(0) || "?"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">
              {displayName || "..."}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
