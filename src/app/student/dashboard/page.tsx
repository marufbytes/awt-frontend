import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Bell, 
  ChevronDown, 
  ArrowUpRight, 
  Video, 
  Building2,
  CheckCircle2,
  Clock,
  XCircle,

} from 'lucide-react';
import Link from 'next/link';

// Type definitions for data models
interface StudentProfile {
  name: string;
  id: string;
  major: string;
  totalResumes: number;
  totalApplications: number;
  activeApplications: number;
  pendingReview: number;
  interviewsScheduled: number;
  newRecommendations: number;
}

interface Application {
  id: number;
  company: string;
  role: string;
  status: 'Pending Review' | 'Interview' | 'Rejected' | string;
  date: string;
  type: string;
}

interface Interview {
  id: number;
  time: string;
  role: string;
  company: string;
  platform: string;
  link: string;
}

export default function StudentDashboard(): JSX.Element {
  // Mock student data with TypeScript interfaces applied
  const student: StudentProfile = {
    name: "Zayed",
    id: "23-51421-1",
    major: "Software Engineering",
    totalResumes: 2,
    totalApplications: 12,
    activeApplications: 5,
    pendingReview: 3,
  
    newRecommendations: 7,
  };

  const recentApplications: Application[] = [
    { id: 1, company: "TechCorp Solutions", role: "Software Engineer", status: "Pending Review", date: "02 Sep 2026", type: "warning" },
    { id: 2, company: "Innovatech Inc.", role: "Frontend Developer (React)", status: "Interview", date: "29 Aug 2026", type: "info" },
    { id: 3, company: "Global Systems", role: "UI/UX Intern", status: "Pending Review", date: "27 Aug 2026", type: "warning" },
    { id: 4, company: "BioGen Labs", role: "Research Assistant", status: "Rejected", date: "20 Aug 2026", type: "error" },
  ];

  const todaysInterviews: Interview[] = [
    { id: 1, time: "11:00 AM - 12:00 PM", role: "Software Engineer", company: "TechCorp Solutions", platform: "Google Meet", link: "meet.google.com/abc-xyz" },
    { id: 2, time: "2:30 PM - 3:30 PM", role: "Data Analyst", company: "Innovatech Inc.", platform: "Zoom", link: "zoom.us/j/12330..." },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-200">
              U
            </div>
            <Link href={`/`}>
              <h1 className="font-bold text-slate-900 leading-tight">Internnova</h1>
              <span className="text-xs text-blue-600 font-semibold tracking-wide">Connect</span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            <Link href="/student/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-medium transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/student/internships" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
              <Briefcase className="w-5 h-5" />
              <span>Internships</span>  
            </Link>
            <Link href="/student/resumes" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
              <FileText className="w-5 h-5" />
              <span>My Resume</span>
              <span className="ml-auto bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-semibold">{student.totalResumes}</span>
            </Link>
            <Link href="/student/interviews" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
              <Calendar className="w-5 h-5" />
              <span>My Interviews</span>
              <span className="ml-auto bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-semibold"></span>
            </Link>
            <Link href="/student/applications" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
               <Briefcase className="w-5 h-5" />
              <span>My Applications</span>
            </Link>
            
          </nav>   
        </div>

        {/* Sidebar Footer Profile Badge */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
              {student.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{student.name}</p>
              <p className="text-xs text-slate-500 truncate">{student.id}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Navbar Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Portal / Overview</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="relative p-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            </button>

            {/* User Profile dropdown info */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                
                <a  href="/student/profile">
                 <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                alt={student.name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-600 shadow-sm"
              />
                </a>
             
           
              <div className="hidden sm:block text-left">
                <span className="block text-sm font-bold text-slate-900">{student.name}</span>
                <span className="block text-xs text-slate-500">{student.major}</span>
              </div>
              
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* Welcome Banner Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="space-y-2 z-10">
              <span className="bg-blue-500/30 text-blue-200 text-xs px-3 py-1 rounded-full font-medium tracking-wide uppercase">
                Student Dashboard
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">Welcome back, {student.name}!</h2>
              <p className="text-blue-200 text-sm">
                Here is your career overview, active applications, and schedule updates for today.
              </p>
            </div>
            
            {/* Quick Profile Summary Badge Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 z-10">
              <div>
                <p className="text-xs text-blue-200 font-medium">Profile Summary</p>
                <p className="text-sm font-bold text-white">{student.major}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-blue-100">
                  <span>ID: {student.id}</span>
                  <span>•</span>
                  <span>Resumes: {student.totalResumes}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top KPI Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Active Applications Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                  Total: {student.totalApplications}
                </span>
              </div>
              <h3 className="text-slate-500 font-medium text-sm">Active Applications</h3>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900">{student.activeApplications}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Pending Review: <strong className="text-slate-700">{student.pendingReview}</strong></span>
                <span>Interview: <strong className="text-blue-600">1</strong></span>
              </div>
            </div>

            {/* Upcoming Interviews Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg">
                  Scheduled
                </span>
              </div>
              <h3 className="text-slate-500 font-medium text-sm">Upcoming Interviews</h3>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900">{student.interviewsScheduled}</span>
                <span className="text-xs text-amber-600 font-semibold">Today</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 truncate">
                Today, 11:00 AM - Google Meet & Zoom
              </div>
            </div>

            {/* New Job Recommendations Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg">
                  Matched
                </span>
              </div>
              <h3 className="text-slate-500 font-medium text-sm">New Job Recommendations</h3>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900">{student.newRecommendations}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold cursor-pointer hover:underline">
                <span>View recommended roles</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

          </div>

          {/* Lower Grid: Recent Applications & Today's Interviews */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Applications Table (2 Columns wide) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Recent Applications</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Track status of your submitted job proposals</p>
                </div>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors">
                  View All Applications
                </button>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-xs uppercase font-semibold text-slate-400 tracking-wider">
                      <th className="py-3.5 px-6">Company</th>
                      <th className="py-3.5 px-6">Role</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6">Applied Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {recentApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-semibold text-slate-900">{app.company}</td>
                        <td className="py-4 px-6 text-slate-600">{app.role}</td>
                        <td className="py-4 px-6">
                          {app.status === 'Pending Review' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                              <Clock className="w-3.5 h-3.5" /> {app.status}
                            </span>
                          )}
                          {app.status === 'Interview' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {app.status}
                            </span>
                          )}
                          {app.status === 'Rejected' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                              <XCircle className="w-3.5 h-3.5" /> {app.status}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-slate-500 text-xs font-medium">{app.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Today's Interviews Panel (1 Column wide) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Today's Interviews</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Upcoming meetings scheduled for today</p>
                  </div>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Video className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  {todaysInterviews.map((interview) => (
                    <div key={interview.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2 hover:border-blue-200 transition-colors">
                      <div className="flex items-center justify-between text-xs font-semibold text-blue-600">
                        <span>{interview.time}</span>
                        <span className="bg-blue-100/70 text-blue-700 px-2 py-0.5 rounded text-[10px] uppercase">
                          {interview.platform}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{interview.role}</h4>
                        <p className="text-xs text-slate-500">{interview.company}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-mono truncate max-w-[140px]">{interview.link}</span>
                        <a 
                          href={`https://${interview.link}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                        >
                          Join
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick tip box */}
              <div className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-blue-100/60 text-xs text-indigo-900">
                <p className="font-semibold mb-1">💡 Interview Tip</p>
                <p className="text-indigo-700/80 leading-relaxed">
                  Join 5 minutes prior to your interview slot and keep your resume summary accessible.
                </p>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}