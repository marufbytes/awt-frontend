"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {Briefcase,FileText,Clock,CheckCircle2,ChevronRight,} from "lucide-react";
import {ResponsiveContainer,LineChart,Line,BarChart,Bar,PieChart,Pie,XAxis,YAxis,Tooltip, Cell,} from "recharts";

import ApplicationsTable, { Application } from "@/components/ApplicationsTable";

export default function DashboardPage() {
  const router = useRouter();

  // State Management
  const [metrics, setMetrics] = useState({
    activeInternships: 0,
    totalApps: 0,
    pendingApps: 0,
    acceptedApps: 0,
  });

  const [statusCounts, setStatusCounts] = useState([
    { name: "Pending", value: 0, color: "#F59E0B" },
    { name: "Reviewed", value: 0, color: "#3B82F6" },
    { name: "Interview", value: 0, color: "#8B5CF6" },
    { name: "Accepted", value: 0, color: "#10B981" },
    { name: "Rejected", value: 0, color: "#EF4444" },
  ]);

  const [lineChartData, setLineChartData] = useState<any[]>([]);
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [totalApplicationsCount, setTotalApplicationsCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/company/my", {
          withCredentials: true,
        });

        const company = res.data;
        const internships = company?.internships || [];

        let total = 0;
        let pending = 0;
        let reviewed = 0;
        let interview = 0;
        let accepted = 0;
        let rejected = 0;

        const barData: any[] = [];
        const applicationDates: Date[] = [];

        internships.forEach((item: any) => {
          const apps = item.applications || [];
          total += apps.length;

          barData.push({
            name: item.title || "Untitled",
            applications: apps.length,
          });

          apps.forEach((app: any) => {
            const status = app.status?.toLowerCase();
            if (status === "pending") pending++;
            else if (status === "reviewed") reviewed++;
            else if (status === "interview") interview++;
            else if (status === "accepted") accepted++;
            else if (status === "rejected") rejected++;

            if (app.createdAt) {
              applicationDates.push(new Date(app.createdAt));
            }
          });
        });

        setMetrics({
          activeInternships: internships.filter((i: any) => i.isActive !== false).length,
          totalApps: total,
          pendingApps: pending,
          acceptedApps: accepted,
        });

        setStatusCounts([
          { name: "Pending", value: pending, color: "#F59E0B" },
          { name: "Reviewed", value: reviewed, color: "#3B82F6" },
          { name: "Interview", value: interview, color: "#8B5CF6" },
          { name: "Accepted", value: accepted, color: "#10B981" },
          { name: "Rejected", value: rejected, color: "#EF4444" },
        ]);

        setBarChartData(barData);

        // --- Real Last 7 Days Data Generation ---
        const last7Days: { [key: string]: number } = {};
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
          last7Days[dayName] = 0;
        }

        applicationDates.forEach((date) => {
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          if (last7Days[dayName] !== undefined) {
            last7Days[dayName]++;
          }
        });

        const dynamicLineChartData = Object.keys(last7Days).map((day) => ({
          day,
          apps: last7Days[day],
        }));

        setLineChartData(dynamicLineChartData);

      } catch (error: any) {
        console.error("Data Fetch Error:", error);
        if (error.response?.status === 401) router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/application/company?page=${currentPage}&limit=5`,
          { withCredentials: true }
        );

        setTotalApplicationsCount(res.data?.total || 0);

        const formatted = (res.data?.data || []).map((app: any) => ({
          id: app.id,
          status: app.status || "pending",
          type: app.type,
          createdAt: app.createdAt || new Date().toISOString(),
          updatedAt: app.updatedAt,
          student: {
            id: app.student?.id || 0,
            firstName: app.student?.firstName || "Candidate",
            email: app.student?.email || "N/A",
            phone: app.student?.phone,
          },
          internship: {
            id: app.internship?.id,
            title: app.internship?.title || "Untitled Role",
            company: app.internship?.company,
          },
          referredBy: app.referredBy || null,
          resume: app.resume || null,
        }));

        setApplications(formatted);
      } catch (error) {
        console.error("Table Fetch Error:", error);
      }
    };

    fetchApplications();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-slate-400 font-medium text-sm">
        Dashboard Loading...
      </div>
    );
  }

  const metricCards = [
    { title: "Active Internships", value: metrics.activeInternships, icon: Briefcase },
    { title: "Total Applications", value: metrics.totalApps, icon: FileText },
    { title: "Pending Review", value: metrics.pendingApps, icon: Clock },
    { title: "Accepted Candidates", value: metrics.acceptedApps, icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">HR Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track and manage your internship hiring metrics and status.
        </p>
      </div>

      {/* 1. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-300 group cursor-default"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-slate-800 transition-colors">
                  {card.title}
                </span>
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </h3>
            </div>
          );
        })}
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-300">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Applications Overview</h2>
              <p className="text-[11px] text-slate-400">Last 7 days trend</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">Last 7 days</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} allowDecimals={false} axisLine={false} ticks={[0, 2, 4, 6, 8, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="apps" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-300">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">Applications by Internship</h2>
            <p className="text-[11px] text-slate-400">Total applications per role</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="applications" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Status Breakdown & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-300 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Status Breakdown</h2>
            <p className="text-[11px] text-slate-400">Current applicant statuses</p>
          </div>

          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusCounts}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-900">{metrics.totalApps}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-[11px] font-medium">
            {statusCounts.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-300 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Applications</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage candidates who recently applied</p>
              </div>
              <button
                onClick={() => router.push("/dashboard/applications")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition-all hover:translate-x-1"
              >
                View all <ChevronRight className="w-3.5 h-3.5 inline" />
              </button>
            </div>

            <ApplicationsTable
              applications={applications}
              currentPage={currentPage}
              itemsPerPage={5}
              totalItems={totalApplicationsCount}
              onPageChange={(page: number) => setCurrentPage(page)}
              search=""
              status="All"
              internshipId=""
              showAction={false}
              showFilters={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
