"use client";
import React, { useState } from 'react';
import { 
  Briefcase, MapPin, Clock, Calendar, DollarSign, 
  CheckCircle, ArrowLeft, Share2, Bookmark, Building2, Check 
} from 'lucide-react';
import Link from 'next/link';

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  deadline: string;
  stipend: string;
  type: string;
  postedDate: string;
  description: string;
  requirements: string[];
  skills: string[];
  otherInfo: string;
}

export default function InternshipDetails(): React.JSX.Element {
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Mock data for the specific internship ID typed with the Internship interface
  const internship: Internship = {
    id: "1",
    title: "Frontend Developer Intern",
    company: "TechCorp Solutions",
    location: "Dhaka, Bangladesh (Hybrid / Remote Option)",
    duration: "3 Months",
    deadline: "25 Sep 2026",
    stipend: "15,000 - 20,000 BDT / month",
    type: "Full-time Internship",
    postedDate: "2 days ago",
    description: `We are looking for a passionate and driven Frontend Developer Intern to join our dynamic engineering team at TechCorp Solutions. In this role, you will work closely with senior software engineers to build responsive, user-facing web applications using React, Tailwind CSS, and modern JavaScript standards. 

    If you have a strong foundation in component-based UI architecture and a keen eye for design details, this is a great opportunity to scale your skills in a fast-paced environment.`,
    requirements: [
      "Currently pursuing or recently graduated with a B.Sc. in Computer Science & Engineering or related field.",
      "Solid understanding of JavaScript (ES6+), HTML5, and CSS3 / Tailwind CSS.",
      "Familiarity with React.js concepts (Components, State, Props, Hooks).",
      "Good understanding of version control systems (Git & GitHub).",
      "Strong problem-solving skills and eagerness to learn new technologies."
    ],
    skills: ["React.js", "Tailwind CSS", "JavaScript", "HTML/CSS", "Git", "REST APIs"],
    otherInfo: "Successful interns will be evaluated for a full-time Junior Software Engineer position upon completion of the 3-month program. Flexible working hours available for university students."
  };

  const handleApply = (): void => {
    setIsApplied(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">
      
      {/* Sidebar Mock matching your Dashboard */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              U
            </div>
            <div>
              <span className="font-bold text-lg leading-none block text-slate-900">UniCareer</span>
              <span className="text-xs text-sky-500 font-medium tracking-wide">Connect</span>
            </div>
          </div>

          <nav className="space-y-1">
            <Link href="/student/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-medium">
              <Briefcase className="w-5 h-5" /> Dashboard
            </Link>
            <Link href="/student/internships" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sky-500 text-white font-medium shadow-sm shadow-sky-500/20">
              <Briefcase className="w-5 h-5" /> Internships
            </Link>
            <Link href="/student/resumes" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-medium">
              <Calendar className="w-5 h-5" /> My Resumes
            </Link>
            <Link href="/student/interviews" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-medium">
              <Clock className="w-5 h-5" /> Interviews
            </Link>
            <Link href="/student/interviews" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-medium">
              <Clock className="w-5 h-5" /> My Applications
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto">
        
        {/* Back Button & Actions Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/student/internships" 
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Job Listings
          </Link>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors ${isBookmarked ? 'text-sky-500 border-sky-200 bg-sky-50/50' : ''}`}
              title="Bookmark Internship"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button 
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-center text-sky-500 font-bold text-2xl shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-600 inline-block mb-2">
                  {internship.type}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                  {internship.title}
                </h1>
                <p className="text-base font-medium text-slate-600">
                  {internship.company}
                </p>
              </div>
            </div>

            {/* Apply Button matching Dashboard Blue Color Scheme */}
            <div>
              {isApplied ? (
                <button 
                  disabled 
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium shadow-sm cursor-default"
                >
                  <Check className="w-5 h-5" /> Application Submitted
                </button>
              ) : (
                <button 
                  onClick={handleApply}
                  className="w-full md:w-auto px-8 py-3 rounded-xl bg-[#0095ff] hover:bg-[#0080e6] text-white font-medium shadow-md shadow-sky-500/25 transition-all"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 text-sm">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="p-2 rounded-lg bg-slate-50 text-sky-500"><MapPin className="w-5 h-5" /></div>
              <div>
                <span className="block text-xs text-slate-400">Location</span>
                <span className="font-semibold text-slate-700">{internship.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="p-2 rounded-lg bg-slate-50 text-sky-500"><Clock className="w-5 h-5" /></div>
              <div>
                <span className="block text-xs text-slate-400">Duration</span>
                <span className="font-semibold text-slate-700">{internship.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="p-2 rounded-lg bg-slate-50 text-sky-500"><DollarSign className="w-5 h-5" /></div>
              <div>
                <span className="block text-xs text-slate-400">Stipend</span>
                <span className="font-semibold text-slate-700">{internship.stipend}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="p-2 rounded-lg bg-slate-50 text-sky-500"><Calendar className="w-5 h-5" /></div>
              <div>
                <span className="block text-xs text-slate-400">Deadline</span>
                <span className="font-semibold text-rose-500">{internship.deadline}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Body Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Description & Requirements */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Internship Description</h2>
              <div className="text-slate-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {internship.description}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Requirements & Qualifications</h2>
              <ul className="space-y-3">
                {internship.requirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-slate-600 text-sm md:text-base">
                    <CheckCircle className="text-sky-500 w-5 h-5 mt-0.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Column: Skills & Additional Info */}
          <div className="space-y-6">
            
            {/* Required Skills */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4">Target Skills</h2>
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Other Available Information */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-2">Additional Information</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {internship.otherInfo}
              </p>
            </div>

            {/* Quick Support Card */}
            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 text-center">
              <h3 className="font-bold text-sky-900 mb-1 text-sm">Have questions?</h3>
              <p className="text-xs text-sky-700 mb-4">Reach out to the university placement cell coordinator for assistance.</p>
              <button className="px-4 py-2 bg-white text-sky-600 rounded-xl text-xs font-semibold shadow-sm hover:bg-sky-50 transition-colors">
                Contact Support
              </button>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}