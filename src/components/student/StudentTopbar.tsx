"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/lib/student/auth-context";
import { resolveFileUrl } from "@/lib/student/api";

export default function StudentTopbar({ label }: { label: string }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : "";
  const avatarUrl = resolveFileUrl(user?.profilePictureUrl);

  const handleLogout = async () => {
    await logout();
    router.push("/student/auth/login");
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-3 pl-2 border-l border-slate-200"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-600 shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm border-2 border-blue-600">
                {displayName.charAt(0) || "?"}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <span className="block text-sm font-bold text-slate-900">{displayName}</span>
              <span className="block text-xs text-slate-500">{user?.role}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-20">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 font-medium"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
