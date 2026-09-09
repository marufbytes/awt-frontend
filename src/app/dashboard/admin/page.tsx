
'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { 
  AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const applicationsTrendData = [
  { month: 'Jan', applications: 120 },
  { month: 'Feb', applications: 210 },
  { month: 'Mar', applications: 350 },
  { month: 'Apr', applications: 480 },
  { month: 'May', applications: 650 },
  { month: 'Jun', applications: 890 },
];

const statusBreakdownData = [
  { name: 'Applied', value: 450, color: '#0ea5e9' },
  { name: 'Interviewing', value: 210, color: '#3b82f6' },
  { name: 'Offered', value: 95, color: '#10b981' },
  { name: 'Rejected', value: 135, color: '#f43f5e' },
];

export default function AdminDashboardHome() {
  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 p-8 rounded-3xl shadow-lg shadow-sky-500/10 text-white flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="space-y-2">
          <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-lg backdrop-blur-sm">
            ADMIN DASHBOARD
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Platform Control Center</h1>
          <p className="text-sm text-sky-100 max-w-xl">
            Real-time metrics, platform user activities, applications velocity, and corporate verifications.
          </p>
        </div>
        <button onClick={() => alert('Analytics Report Exported!')} className="mt-4 md:mt-0 btn bg-white hover:bg-sky-50 text-sky-700 border-none shadow-md font-bold text-xs rounded-xl">
          <Download className="w-4 h-4 mr-1" /> Export Analytics
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Total Students', value: '3,420', desc: '+12.4% from last month', accent: 'bg-sky-500' },
          { title: 'Total Companies', value: '142', desc: '5 pending approval', accent: 'bg-blue-500' },
          { title: 'Total Alumni', value: '850', desc: 'Active referral network', accent: 'bg-cyan-400' },
          { title: 'Total Internships', value: '96', desc: 'Active listings', accent: 'bg-indigo-500' },
          { title: 'Total Applications', value: '890', desc: '+24.5% conversion rate', accent: 'bg-emerald-400' },
          { title: 'Pending Verifications', value: '7', desc: 'Requires immediate action', accent: 'bg-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${stat.accent}`}></div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{stat.title}</p>
            <div className="flex justify-between items-baseline">
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
              <span className="text-xs font-semibold text-slate-500">{stat.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Applications Over Time</h3>
              <p className="text-xs text-slate-400">Student application volume trends</p>
            </div>
            <span className="badge badge-ghost font-mono text-xs">Area Chart</span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={applicationsTrendData}>
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{fontSize: 12}} />
                <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '12px'}} />
                <Area type="monotone" dataKey="applications" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorApp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Application Status</h3>
            <p className="text-xs text-slate-400">Funnel stage distribution</p>
          </div>
          <div className="h-[180px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusBreakdownData} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                  {statusBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 pt-4 border-t border-slate-100">
            {statusBreakdownData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.color}}></span>{item.name}</span>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}