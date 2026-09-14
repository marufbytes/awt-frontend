'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  PlusCircle,
  FileText,
  LogOut,
  Home,
} from 'lucide-react';
import { clearSession, getSession } from '@/lib/auth/session';
import type { AuthUser } from '@/lib/auth/types';

export default function AlumniLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session || session.user.role !== 'ALUMNI') {
      router.replace('/auth/login');
      return;
    }
    setUser(session.user);
  }, [router]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = () => {
    clearSession();
    triggerToast('Logged out securely.');
    router.replace('/auth/login');
  };

  if (!user) return null;

  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

  const getPageTitle = (path: string): string => {
    if (path.includes('/students')) return 'Students Seeking Internships';
    if (path.includes('/create-post')) return 'Create Referral Post';
    if (path.includes('/my-posts')) return 'My Referral Posts';
    return 'Alumni Dashboard';
  };

  const navItems = [
    { href: '/dashboard/alumni', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/alumni/students', label: 'Find Students', icon: GraduationCap },
    { href: '/dashboard/alumni/create-post', label: 'Create Post', icon: PlusCircle },
    { href: '/dashboard/alumni/my-posts', label: 'My Posts', icon: FileText },
  ];

  return (
    <div data-theme="light" className="min-h-screen flex bg-slate-50 text-slate-800 font-sans">
      {toastMessage && (
        <div className="toast toast-end z-50">
          <div className="alert alert-success text-white shadow-lg rounded-2xl">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <aside className="w-20 md:w-64 bg-white border-r border-slate-100 flex flex-col justify-between shadow-xs transition-all duration-300 shrink-0 sticky top-0 h-screen">
        <div>
          <div className="p-5 md:p-6 flex items-center space-x-3 mb-1 overflow-hidden">
            <div className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-blue-600">
              <Image src="/logo.jpg" alt="InternNova Logo" fill className="object-cover" />
            </div>
            <span className="hidden md:block text-xl font-bold text-gray-900 leading-tight whitespace-nowrap">
              InternNova
              <span className="block text-xs font-normal text-gray-500">Connect</span>
            </span>
          </div>

          <div className="px-3 md:px-4 mb-3">
            <Link
              href="/"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 transition-all border border-slate-100/80"
            >
              <Home className="w-4 h-4 shrink-0 text-slate-400" />
              <span className="hidden md:block whitespace-nowrap">Back to Home</span>
            </Link>
          </div>

          <nav className="space-y-1.5 px-3 md:px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-sky-500 text-white font-semibold shadow-md shadow-sky-500/20'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="hidden md:block whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 md:p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center md:justify-start space-x-2 py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition shadow-xs"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="hidden md:block whitespace-nowrap">Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 py-3.5 px-8 flex justify-between items-center shadow-xs">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {getPageTitle(pathname)}
          </h2>

          <div className="flex items-center space-x-3 py-1 px-2 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {initials}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-800">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-slate-400">{user.email}</p>
            </div>
          </div>
        </header>

        <main className="p-8 space-y-8 flex-grow">{children}</main>
      </div>
    </div>
  );
}
