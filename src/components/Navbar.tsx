"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { Search, Bell, Menu, Clock } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface NavbarProps {
  isOpen: boolean;
  onMenuClick: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export default function Navbar({ isOpen, onMenuClick }: NavbarProps) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [profile, setProfile] = useState({
    name: "Company User",
    role: "HR Manager",
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/company/my", {
          withCredentials: true,
        });

        const data = response.data;

        if (data) {
          setProfile({
            name: data.name || data.companyName || "Company User",
            role: data.industry || "HR Manager",
          });

          const internships = data.internships || [];
          const notifs: NotificationItem[] = [];

          internships.forEach((internship: any) => {
            const apps = internship.applications || [];
            apps.forEach((app: any) => {
              const studentName = app.student
                ? `${app.student.firstName || ""} ${
                    app.student.lastName || ""
                  }`.trim()
                : "A candidate";

              notifs.push({
                id: `${internship.id}-${app.id}`,
                title: "New Application",
                description: `${studentName} applied for ${
                  internship.title || "an internship"
                }`,
                time: app.createdAt
                  ? new Date(app.createdAt).toLocaleDateString()
                  : "Recent",
                read: false,
              });
            });
          });

          setNotifications(notifs.slice(0, 5));
        }
      } catch (error) {
        console.error("Navbar data fetch error:", error);
      }
    };

    fetchCompanyData();
  }, []);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/dashboard/HR/applications?search=${encodeURIComponent(
          searchQuery.trim()
        )}`
      );
    } else {
      router.push("/dashboard/HR/applications");
    }
  };

  const unreadCount = notifications.length;

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-30 shadow-2xs">
      {/* Left: Hamburger Toggle & Main Brand Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* UniCareer Connect Logo & Title */}
        <div
          onClick={() => router.push("/dashboard/HR")}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <Image
            src="/unicareer-logo.png"
            alt="UniCareer Connect Logo"
            width={34}
            height={34}
            className="h-8 w-auto object-contain"
            priority
          />
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-base text-slate-900 tracking-tight">
              UniCareer
            </span>
            <span className="text-xs font-semibold text-slate-500 tracking-normal mt-0.5">
              Connect
            </span>
          </div>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates, roles..."
            className="w-full bg-[#F4F6FA] border border-transparent rounded-full pl-11 pr-14 py-2 text-xs font-medium text-slate-700 placeholder:text-slate-400 hover:border-slate-900 hover:ring-1 hover:ring-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
          />
        </form>
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Boxed Button & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-11 h-11 flex items-center justify-center rounded-[16px] border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-xs"
          >
            <Bell className="w-5 h-5 text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Notifications
                </h3>
                <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
                  {unreadCount} New
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setShowNotifications(false);
                        router.push("/dashboard/HR/applications");
                      }}
                      className="p-3 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start"
                    >
                      <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                          {notif.description}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400 font-medium">
                    No new notifications
                  </div>
                )}
              </div>

              <div className="pt-2 px-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    router.push("/dashboard/HR/applications");
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View All Applications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Card Header */}
        <div className="flex items-center gap-3 bg-white border border-slate-200/80 rounded-2xl p-1.5 px-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer">
          <div className="relative">
            {/* Black Circle Avatar */}
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold uppercase shadow-inner">
              {profile.name.charAt(0)}
            </div>
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute bottom-0 right-0 border-2 border-white" />
          </div>

          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {profile.name}
            </p>
            <p className="text-[10px] font-medium text-slate-400 mt-0.5">
              {profile.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
