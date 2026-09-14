"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Building2, Briefcase, FileText, Settings, LogOut, Home } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/");
    }
  };

  const getPageTitle = (path: string) => {
    if (path.includes("/users")) return "Manage Users";
    if (path.includes("/companies")) return "Manage Companies";
    if (path.includes("/internships")) return "Manage Internships";
    if (path.includes("/applications")) return "Manage Applications";
    if (path.includes("/profile")) return "Profile Management";
    return "Dashboard Overview";
  };

  const navItems = [
    {
      href: "/dashboard/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    {
      href: "/dashboard/admin/companies",
      label: "Manage Companies",
      icon: Building2,
    },
    {
      href: "/dashboard/admin/internships",
      label: "Manage Internships",
      icon: Briefcase,
    },
    {
      href: "/dashboard/admin/applications",
      label: "Manage Applications",
      icon: FileText,
    },
    { href: "/dashboard/admin/profile", label: "Profile Management", icon: Settings },
  ];

  return (
    <div
      className="min-h-screen flex bg-slate-50 text-slate-800 font-sans"
    >

      <aside className="w-20 md:w-64 bg-white border-r border-slate-100 flex flex-col justify-between shadow-xs transition-all duration-300 shrink-0 sticky top-0 h-screen">
        <div>

          <div className="p-5 md:p-6 flex items-center space-x-3 mb-1 overflow-hidden">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-primary flex items-center justify-center text-white font-bold overflow-hidden">
              <Image src="/logo.jpg" alt="Logo" width={36} height={36} className="w-full h-full object-cover"/>
            </div>

            <div className="hidden md:block whitespace-nowrap">
              <span className="text-lg font-extrabold tracking-tight block text-slate-900">
                Intern<span className="text-primary">Nova</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Admin Portal
              </span>
            </div>
          </div>


          <div className="px-3 md:px-4 mb-3 w-full">
            <Link
              href="/"
              data-tip="Back to Home"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 transition-all border border-slate-100/80 tooltip tooltip-right md:[&::before]:hidden md:[&::after]:hidden"
            >
              <Home className="w-4 h-4 shrink-0 text-slate-400" />
              <span className="hidden md:block whitespace-nowrap">
                Back to Home
              </span>
            </Link>
          </div>


          <nav className="space-y-1.5 px-3 md:px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <div key={item.href} className="w-full">
                  <Link
                    href={item.href}
                    data-tip={item.label}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all tooltip tooltip-right md:[&::before]:hidden md:[&::after]:hidden ${
                      isActive
                        ? "bg-sky-500 text-white font-semibold shadow-md shadow-sky-500/20"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="hidden md:block whitespace-nowrap">
                      {item.label}
                    </span>
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>


        <div className="p-3 md:p-4 w-full">
          <button
            onClick={handleLogout}
            data-tip="Logout"
            className="w-full flex items-center justify-center md:justify-start space-x-2 py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition shadow-xs tooltip tooltip-right md:[&::before]:hidden md:[&::after]:hidden">
            <LogOut className="w-5 h-5" />
            <span className="hidden md:block whitespace-nowrap">Logout</span>
          </button>
        </div>
      </aside>


      <div className="flex-grow flex flex-col h-screen overflow-y-auto">

        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 py-3.5 px-8 flex justify-between items-center shadow-xs">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {getPageTitle(pathname)}
            </h2>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 py-1 px-2 rounded-xl">
              <div className="flex items-center space-x-3 py-1 px-2 rounded-xl">
                <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-slate-200">
                  <Image src="/admin.avif" alt="Administrator" fill className="object-cover"/>
                </div>
              </div>

              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-800"> Administrator  </p>
              </div>
            </div>
          </div>
        </header>


        <main className="p-8 space-y-8 flex-grow">{children}</main>

        
      </div>
    </div>
  );
}