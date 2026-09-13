
"use client";
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Bell, 
  ChevronDown, 
  Search, 
  MapPin, 
  Clock, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  X,
  ExternalLink,
  DollarSign,
  User
} from 'lucide-react';
import Link from 'next/link';

interface Internship {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string; // e.g. "Remote", "On-site", "Hybrid"
  stipend: string;
  deadline: string;
  postedDate: string;
  category: string;
  description: string;
  requirements: string[];
  companyInfo: {
    size: string;
    industry: string;
    website: string;
    about: string;
  };
}

export default function InternshipBrowsing(): JSX.Element {
  // Mock student info for the sidebar & top bar
  const student = {
    name: "Zayed",
    id: "23-51421-1",
    major: "Software Engineering",
    totalResumes: 3,
  };

  // Comprehensive mock data simulating internships available from backend API
  const internshipsData: Internship[] = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "TechCorp Solutions",
      location: "Dhaka, Bangladesh (Hybrid)",
      type: "Hybrid",
      stipend: "৳ 25,000 / mo",
      deadline: "25 Sep 2026",
      postedDate: "2 days ago",
      category: "Software Engineering",
      description: "We are seeking a motivated Frontend Developer Intern with a strong command of React, JSX, and Tailwind CSS. You will work closely with our core engineering team to build scalable responsive interfaces and dashboard components for our enterprise clients.",
      requirements: [
        "Proficiency in React.js, HTML5, and Modern CSS (Tailwind CSS)",
        "Understanding of state management and RESTful APIs",
        "Currently studying Computer Science, Software Engineering or related field",
        "Ability to write clean, maintainable, and well-documented code"
      ],
      companyInfo: {
        size: "250-500 employees",
        industry: "Information Technology & Services",
        website: "techcorp-solutions.example.com",
        about: "TechCorp Solutions is a leading enterprise software provider focused on building high-performance cloud applications."
      }
    },
    {
      id: 2,
      title: "UI/UX Product Design Intern",
      company: "Global Systems",
      location: "Remote",
      type: "Remote",
      stipend: "৳ 20,000 / mo",
      deadline: "30 Sep 2026",
      postedDate: "4 days ago",
      category: "Design",
      description: "Join Global Systems as a UI/UX Intern to help craft intuitive user journeys for modern web and mobile apps. You will build wireframes, interactive Figma prototypes, and maintain our design systems.",
      requirements: [
        "Strong portfolio demonstrating UI/UX wireframing & prototyping skills",
        "Experience using Figma or Adobe XD",
        "Strong understanding of user-centered design principles",
        "Excellent communication and collaboration skills"
      ],
      companyInfo: {
        size: "100-250 employees",
        industry: "Design & Software Development",
        website: "globalsystems.example.com",
        about: "Global Systems creates digital products that empower millions of users worldwide across multiple platforms."
      }
    },
    {
      id: 3,
      title: "Data Analyst Intern",
      company: "Innovatech Inc.",
      location: "Dhaka, Bangladesh",
      type: "On-site",
      stipend: "৳ 22,000 / mo",
      deadline: "05 Oct 2026",
      postedDate: "1 week ago",
      category: "Data Science",
      description: "We are looking for an analytical mind to help process datasets, build predictive models, and generate comprehensive metrics reports using Python and SQL.",
      requirements: [
        "Strong knowledge of Python (Pandas, NumPy) and SQL",
        "Experience with data visualization tools (Tableau, PowerBI)",
        "Basic understanding of statistical analysis and machine learning metrics",
        "Problem-solving mindset with acute attention to detail"
      ],
      companyInfo: {
        size: "50-100 employees",
        industry: "Data Analytics & AI",
        website: "innovatech.example.com",
        about: "Innovatech specializes in predictive maintenance systems and industrial automation intelligence."
      }
    },
    {
      id: 4,
      title: "Full Stack Engineering Intern",
      company: "BioGen Labs",
      location: "Sylhet, Bangladesh (Hybrid)",
      type: "Hybrid",
      stipend: "৳ 30,000 / mo",
      deadline: "12 Oct 2026",
      postedDate: "2 weeks ago",
      category: "Software Engineering",
      description: "Work on cutting-edge research platforms combining backend microservices with dynamic frontend dashboards. Perfect for developers passionate about full-stack architectures.",
      requirements: [
        "Experience with Node.js / Express or Python backend frameworks",
        "Familiarity with React or frontend component libraries",
        "Knowledge of database systems (MongoDB, PostgreSQL)",
        "Eagerness to learn and adapt in a fast-paced environment"
      ],
      companyInfo: {
        size: "500+ employees",
        industry: "Biotech & Software",
        website: "biogenlabs.example.com",
        about: "BioGen Labs bridges the gap between biological sciences and advanced software systems."
      }
    }
  ];

  // Search & Filter state parameters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  // Modal detailed view state
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [hasApplied, setHasApplied] = useState<boolean>(false);

  // Filter logic matching search keyword and dropdown parameters
  const filteredInternships = internshipsData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesType = selectedType === "All" || item.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleApply = () => {
    setHasApplied(true);
    setTimeout(() => {
      setHasApplied(false);
      setSelectedInternship(null);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* ================= SIDEBAR (Consistent with Dashboard) ================= */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-200">
              U
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">UniCareer</h1>
              <span className="text-xs text-blue-600 font-semibold tracking-wide">Connect</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            <Link href="/student/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/student/internships" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-medium transition-colors">
              <Briefcase className="w-5 h-5" />
              <span>Internships</span>
            </Link>
            <Link href="/student/resumes" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
              <FileText className="w-5 h-5" />
              <span>My Resumes</span>
              <span className="ml-auto bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-semibold">{student.totalResumes}</span>
            </Link>
            <Link href="/student/interviews" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
              <Calendar className="w-5 h-5" />
              <span>My Interviews</span>
            </Link>
            <Link href="/student/applications" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
              <Briefcase className="w-5 h-5" />
              <span>My Applications</span>
            </Link>
            <Link href="/student/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
              <User className="w-5 h-5" />
              <span>My Profile</span>
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
        {/* <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Portal / Internship Browsing</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                alt={student.name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-600 shadow-sm"
              />
              <div className="hidden sm:block text-left">
                <span className="block text-sm font-bold text-slate-900">{student.name}</span>
                <span className="block text-xs text-slate-500">{student.major}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </header> */}

        {/* Browsing Content Body */}
        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* Page Banner Header */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="space-y-2 z-10">
              <span className="bg-blue-500/30 text-blue-200 text-xs px-3 py-1 rounded-full font-medium tracking-wide uppercase">
                Career Hub
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">Explore Recommended Internships</h2>
              <p className="text-blue-200 text-sm max-w-xl">
                Browse through verified internship opportunities tailored for your academic profile and career goals.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl z-10">
              <p className="text-xs text-blue-200 font-medium">Available Openings</p>
              <p className="text-2xl font-black text-white mt-0.5">{filteredInternships.length} Positions</p>
            </div>
          </div>

          {/* Search & Filter Bar Controls */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Keyword Search Input */}
              <div className="relative md:col-span-1">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search role, company or keyword..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                />
              </div>

              {/* Category Filter Dropdown */}
              <div>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium bg-white text-slate-700"
                >
                  <option value="All">All Categories</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>

              {/* Work Type Filter Dropdown (Remote/Hybrid/On-site) */}
              <div>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium bg-white text-slate-700"
                >
                  <option value="All">All Work Types</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

            </div>
          </div>

          {/* Internship Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInternships.map((internship) => (
              <div 
                key={internship.id} 
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  
                  {/* Company Header info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100">
                        {internship.company.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{internship.title}</h4>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3.5 h-3.5" /> {internship.company}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                      {internship.type}
                    </span>
                  </div>

                  {/* Location & Stipend Badges */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {internship.location}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <DollarSign className="w-3.5 h-3.5" /> {internship.stipend}
                    </span>
                  </div>

                  {/* Short snippet description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {internship.description}
                  </p>
                </div>

                {/* Footer Details & Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] font-medium text-amber-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Deadline: {internship.deadline}
                  </div>
                  <button 
                    onClick={() => setSelectedInternship(internship)}
                    className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {filteredInternships.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-sm font-medium">No internships found matching your search criteria.</p>
            </div>
          )}

        </div>
      </main>

      {/* ================= INTERNSHIP DETAILS MODAL ================= */}
      {selectedInternship && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{selectedInternship.category}</span>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedInternship.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedInternship(null)}
                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-sm">
              
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="block text-slate-400 font-semibold uppercase">Company</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{selectedInternship.company}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-semibold uppercase">Stipend</span>
                  <span className="font-bold text-emerald-600 mt-0.5 block">{selectedInternship.stipend}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-semibold uppercase">Location Type</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{selectedInternship.type}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-semibold uppercase">Deadline</span>
                  <span className="font-bold text-amber-600 mt-0.5 block">{selectedInternship.deadline}</span>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">About the Internship</h4>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                  {selectedInternship.description}
                </p>
              </div>

              {/* Requirements Section */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">Key Requirements & Skills</h4>
                <ul className="space-y-2">
                  {selectedInternship.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Information Section */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" /> Company Information
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedInternship.companyInfo.about}
                </p>
                <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-500 font-medium">
                  <span>Size: <strong className="text-slate-700">{selectedInternship.companyInfo.size}</strong></span>
                  <span>Industry: <strong className="text-slate-700">{selectedInternship.companyInfo.industry}</strong></span>
                  <a href={`https://${selectedInternship.companyInfo.website}`} target="_blank" rel="noreferrer" className="text-blue-600 flex items-center gap-1 hover:underline">
                    Website <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>

            {/* Modal Footer Action */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 sticky bottom-0">
              <button 
                onClick={() => setSelectedInternship(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors"
              >
                Close
              </button>
              <button 
                onClick={handleApply}
                disabled={hasApplied}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors ${
                  hasApplied ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {hasApplied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Application Submitted!</span>
                  </>
                ) : (
                  <span>Apply Now</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}