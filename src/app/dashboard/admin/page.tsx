"use client";

import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  role: string;
  createdAt?: string;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ROLE_COLORS: Record<string, string> = {
  STUDENT: "#0ea5e9",
  HR: "#3b82f6",
  ADMIN: "#f43f5e",
  ALUMNI: "#10b981",
};

export default function AdminDashboardHome() {
  const [trendData, setTrendData] = useState<
    { month: string; users: number }[]
  >([]);
  const [roleData, setRoleData] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalCompanies, setTotalCompanies] = useState<number>(0);
  const [totalInternships, setTotalInternships] = useState<number>(0);
  const [totalApplications, setTotalApplications] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [usersRes, compRes, interRes, appRes] = await Promise.all([
          fetch("http://localhost:3000/users", {
            credentials: "include",
          }).catch(() => null),
          fetch("http://localhost:3000/company", {
            credentials: "include",
          }).catch(() => null),
          fetch("http://localhost:3000/internship", {
            credentials: "include",
          }).catch(() => null),
          fetch("http://localhost:3000/application", {
            credentials: "include",
          }).catch(() => null),
        ]);

        if (usersRes && usersRes.ok) {
          const json = await usersRes.json();
          const usersList: User[] = Array.isArray(json)
            ? json
            : json.users || json.data || [];
          setTotalUsers(usersList.length);

          // Trend mapping
          const monthMap = MONTHS.reduce(
            (acc, m) => ({ ...acc, [m]: 0 }),
            {} as Record<string, number>,
          );
          usersList.forEach((u) => {
            if (u.createdAt) {
              const m = MONTHS[new Date(u.createdAt).getMonth()];
              if (m) monthMap[m]++;
            }
          });
          setTrendData(
            MONTHS.map((month) => ({ month, users: monthMap[month] })),
          );

          // Role mapping
          const roleMap: Record<string, number> = {};
          usersList.forEach((u) => {
            const r = (u.role || "OTHER").toUpperCase();
            roleMap[r] = (roleMap[r] || 0) + 1;
          });
          const formattedRoles = Object.entries(roleMap).map(
            ([role, value]) => ({
              name: role.charAt(0) + role.slice(1).toLowerCase(),
              value,
              color: ROLE_COLORS[role] || "#94a3b8",
            }),
          );
          setRoleData(
            formattedRoles.length
              ? formattedRoles
              : [{ name: "No data", value: 1, color: "#e2e8f0" }],
          );
        }

        if (compRes && compRes.ok) {
          const json = await compRes.json();
          const list = Array.isArray(json)
            ? json
            : json.companies || json.data || [];
          setTotalCompanies(list.length);
        }

        if (interRes && interRes.ok) {
          const json = await interRes.json();
          const list = Array.isArray(json)
            ? json
            : json.internships || json.data || [];
          setTotalInternships(list.length);
        }

        if (appRes && appRes.ok) {
          const json = await appRes.json();
          const list = Array.isArray(json)
            ? json
            : json.applications || json.data || [];
          setTotalApplications(list.length);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 p-8 rounded-3xl shadow-lg shadow-sky-500/10 text-white flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="space-y-2">
          <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-lg backdrop-blur-sm">
            ADMIN DASHBOARD
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight">
            Platform Control Center
          </h1>

          <p className="text-sm text-sky-100 max-w-xl">
            Manage the whole platform from here
          </p>
        </div>
        <button
          onClick={() => alert("Analytics Report Exported!")}
          className="mt-4 md:mt-0 btn bg-white hover:bg-sky-50 text-sky-700 border-none shadow-md font-bold text-xs rounded-xl"
        >
          <Download className="w-4 h-4 mr-1" /> Export Analytics
        </button>
      </div>

      {/* KPI Stat Cards (6 items: 3 per row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          // Row 1
          {
            title: "Total Users",
            value: loading ? "..." : totalUsers.toLocaleString(),
            sub: "Registered accounts",
            accent: "bg-sky-500",
          },
          {
            title: "Total Companies",
            value: loading ? "..." : totalCompanies.toLocaleString(),
            sub: "Partner organizations",
            accent: "bg-blue-500",
          },
          {
            title: "Total Internships",
            value: loading ? "..." : totalInternships.toLocaleString(),
            sub: "Listing posts",
            accent: "bg-indigo-500",
          },

          // Row 2
          {
            title: "Total Applications",
            value: loading ? "..." : totalApplications.toLocaleString(),
            sub: "Candidate submissions",
            accent: "bg-emerald-400",
          },
          {
            title: "Company : Student Ratio",
            value: loading
              ? "..."
              : (() => {
                  const studentCount =
                    roleData.find((r) => r.name.toLowerCase() === "student")
                      ?.value || 0;
                  const compCount = totalCompanies || 0;
                  if (compCount === 0 || studentCount === 0) return "0 : 0";
                  const ratio = Math.round(studentCount / compCount);
                  return `1 : ${ratio}`;
                })(),
            sub: "Per company reach",
            accent: "bg-cyan-400",
          },
          {
            title: "Alumni : Student Ratio",
            value: loading
              ? "..."
              : (() => {
                  const studentCount =
                    roleData.find((r) => r.name.toLowerCase() === "student")
                      ?.value || 0;
                  const alumniCount =
                    roleData.find((r) => r.name.toLowerCase() === "alumni")
                      ?.value || 0;
                  if (alumniCount === 0 || studentCount === 0) return "0 : 0";
                  const ratio = Math.round(studentCount / alumniCount);
                  return `1 : ${ratio}`;
                })(),
            sub: "Mentor-to-peer index",
            accent: "bg-amber-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition relative overflow-hidden flex flex-col justify-between h-32"
          >
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${stat.accent}`}
            ></div>
            <div className="flex justify-between items-start">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {stat.title}
              </p>
            </div>
            <div className="flex justify-between items-baseline">
              <h3 className="text-3xl font-black text-slate-900">
                {stat.value}
              </h3>
              <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">
                {stat.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Users Overview (AreaChart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Users Overview
              </h3>
              <p className="text-xs text-slate-400">
                Monthly Registration Trends 
              </p>
            </div>
            <span className="badge badge-ghost font-mono text-xs">
              Total Users
            </span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users Category / Role Breakdown (PieChart) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Users Category
            </h3>
            <p className="text-xs text-slate-400">
              Distribution by Role: Student, HR, Admin, Alumni
            </p>
          </div>

          <div className="h-[180px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-4 border-t border-slate-100 max-h-[120px] overflow-y-auto">
            {roleData.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-xs"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  {item.name}
                </span>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
