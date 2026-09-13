"use client";

import React, { useEffect, useState } from "react";
import { Download, Eye, Trash2, X } from "lucide-react";
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";

interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

const MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ROLE_COLORS: Record<string, string> = {
  STUDENT: "#0ea5e9", // Sky 500
  HR: "#3b82f6", // Blue 500
  ADMIN: "#f43f5e", // Rose 500
  ALUMNI: "#10b981", // Emerald 500
};

export default function AdminDashboardHome() {
  const [users, setUsers] = useState<User[]>([]);
  const [trendData, setTrendData] = useState<{ month: string; users: number }[]>([]);
  const [roleData, setRoleData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/users", {
        credentials: "include",
      });
      const json = await response.json();
      const usersList: User[] = Array.isArray(json) 
        ? json 
        : (json.users || json.data || []);

      setUsers(usersList);
      setTotalCount(usersList.length);

      // Trend mapping
      const monthMap = MONTHS.reduce((acc, m) => ({ ...acc, [m]: 0 }), {} as Record<string, number>);
      usersList.forEach(u => {
        if (u.createdAt) {
          const m = MONTHS[new Date(u.createdAt).getMonth()];
          if (m) monthMap[m]++;
        }
      });
      setTrendData(MONTHS.map(month => ({ month, users: monthMap[month] })));

      // Role mapping
      const roleMap: Record<string, number> = {};
      usersList.forEach(u => {
        const r = (u.role || "OTHER").toUpperCase();
        roleMap[r] = (roleMap[r] || 0) + 1;
      });
      const formattedRoles = Object.entries(roleMap).map(([role, value]) => ({
        name: role.charAt(0) + role.slice(1).toLowerCase(),
        value,
        color: ROLE_COLORS[role] || "#94a3b8",
      }));
      setRoleData(formattedRoles.length ? formattedRoles : [{ name: "No data", value: 1, color: "#e2e8f0" }]);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // View Details API Call
  const handleViewDetails = async (id: number) => {
    try {
      setModalLoading(true);
      setSelectedUser(null);
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const detail = await res.json();
        setSelectedUser(detail);
      } else {
        const local = users.find(u => u.id === id);
        setSelectedUser(local || null);
      }
    } catch (e) {
      const local = users.find(u => u.id === id);
      setSelectedUser(local || null);
    } finally {
      setModalLoading(false);
    }
  };

  // Delete API Call
  const handleDeleteUser = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete user ID #${id}?`)) return;
    try {
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
        setTotalCount(prev => Math.max(0, prev - 1));
        alert(`User ID #${id} deleted successfully.`);
      } else {
        alert("Failed to delete user from server.");
      }
    } catch (e) {
      console.error("Delete error:", e);
      alert("Error occurred while deleting user.");
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 p-8 rounded-3xl shadow-lg shadow-sky-500/10 text-white flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="space-y-2">
          <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-lg backdrop-blur-sm">
            ADMIN DASHBOARD
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Platform Control Center
          </h1>
          <p className="text-sm text-sky-100 max-w-xl">
            Real-time metrics, platform user activities, applications velocity,
            and corporate verifications.
          </p>
        </div>
        <button
          onClick={() => alert("Analytics Report Exported!")}
          className="mt-4 md:mt-0 btn bg-white hover:bg-sky-50 text-sky-700 border-none shadow-md font-bold text-xs rounded-xl px-4 py-2.5 flex items-center"
        >
          <Download className="w-4 h-4 mr-1" /> Export Analytics
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Total Users", value: loading ? "..." : totalCount.toLocaleString(), desc: "Synced from DB", accent: "bg-sky-500" },
          { title: "Total Companies", value: "142", desc: "5 pending approval", accent: "bg-blue-500" },
          { title: "Total Alumni", value: "850", desc: "Active referral network", accent: "bg-cyan-400" },
          { title: "Total Internships", value: "96", desc: "Active listings", accent: "bg-indigo-500" },
          { title: "Total Applications", value: "890", desc: "+24.5% conversion rate", accent: "bg-emerald-400" },
          { title: "Pending Verifications", value: "7", desc: "Requires immediate action", accent: "bg-amber-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${stat.accent}`}></div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {stat.title}
            </p>
            <div className="flex justify-between items-baseline">
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
              <span className="text-xs font-semibold text-slate-500">{stat.desc}</span>
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
              <h3 className="text-lg font-bold text-slate-900">Users Overview</h3>
              <p className="text-xs text-slate-400">Monthly Registration Trends (createdAt)</p>
            </div>
            <span className="badge badge-ghost font-mono text-xs px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600">Total Users</span>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                <Area type="monotone" dataKey="users" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users Category / Role Breakdown (PieChart) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Users Category</h3>
            <p className="text-xs text-slate-400">Distribution by Role: Student, HR, Admin, Alumni</p>
          </div>

          <div className="h-[180px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleData} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
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
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </span>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users List Table with View Details & Delete */}
      <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900">User Records Table</h3>
            <p className="text-xs text-slate-400">Click &apos;Details&apos; to inspect full profile or &apos;Delete&apos; to remove entry</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">First Name</th>
                <th className="py-3 px-4 font-semibold">Last Name</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">Loading users list...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">#{user.id}</td>
                    <td className="py-3.5 px-4 font-medium">{user.firstName || "N/A"}</td>
                    <td className="py-3.5 px-4 font-medium">{user.lastName || "N/A"}</td>
                    <td className="py-3.5 px-4 text-slate-500">{user.email || "N/A"}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleViewDetails(user.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 font-semibold transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nice Pop-up Modal for User Details */}
      {(selectedUser || modalLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-6 space-y-6 relative border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-sky-500 uppercase tracking-wider">User Information</span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {modalLoading ? "Fetching details..." : `User ID #${selectedUser?.id}`}
                </h3>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalLoading ? (
              <div className="py-12 text-center text-slate-400 text-sm">Loading user profile from API...</div>
            ) : selectedUser ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <span className="text-slate-400 block mb-0.5">First Name</span>
                    <strong className="text-slate-900 text-sm">{selectedUser.firstName || "N/A"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Last Name</span>
                    <strong className="text-slate-900 text-sm">{selectedUser.lastName || "N/A"}</strong>
                  </div>
                </div>

                <div className="space-y-2.5 px-1">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Email</span>
                    <span className="font-semibold text-slate-800">{selectedUser.email || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Phone</span>
                    <span className="font-semibold text-slate-800">{selectedUser.phone || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Role</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700">{selectedUser.role}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Created At</span>
                    <span className="text-slate-600">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Updated At</span>
                    <span className="text-slate-600">{selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Deleted At</span>
                    <span className="text-slate-600">{selectedUser.deletedAt ? new Date(selectedUser.deletedAt).toLocaleString() : "Active (Null)"}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow-sm"
                  >
                    Close Modal
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-red-500 text-sm">Could not load details.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}