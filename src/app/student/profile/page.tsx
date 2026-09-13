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
  User,
  Phone,
  MapPin,
  Mail,
  GraduationCap,
  Camera,
  Edit3,
  Save,
  X,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

interface StudentProfileData {
  name: string;
  id: string;
  email: string;
  phone: string;
  address: string;
  major: string;
  university: string;
  totalResumes: number;
  totalApplications: number;
  avatarUrl: string;
}

export default function StudentProfile(): JSX.Element {
  // Initial student data based on your specifications
  const [student, setStudent] = useState<StudentProfileData>({
    name: "Zayed",
    id: "23-51421-1",
    email: "zayed.student@unicareer.edu",
    phone: "+880 1712-345678",
    address: "Bashundhara R/A, Dhaka, Bangladesh",
    major: "Software Engineering",
    university: "American International University-Bangladesh",
    totalResumes: 3,
    totalApplications: 12,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
  });

  // Edit mode toggle state and temporary form state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<StudentProfileData>(student);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  // Handle input changes in edit mode
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save changes handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStudent(formData);
    setIsEditing(false);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 4000);
  };

  // Cancel edit handler
  const handleCancel = () => {
    setFormData(student);
    setIsEditing(false);
  };

  // Mock profile picture change handler (simulating file upload support)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setFormData(prev => ({ ...prev, avatarUrl: uploadEvent.target!.result as string }));
          setStudent(prev => ({ ...prev, avatarUrl: uploadEvent.target!.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* ================= SIDEBAR (Matching Dashboard) ================= */}
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
              <span className="ml-auto bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-semibold">{student.interviewsScheduled}</span>
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
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Portal / Student Profile</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <img 
                src={student.avatarUrl} 
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
        </header>

        {/* Profile Body Content */}
        <div className="p-8 space-y-8 max-w-5xl w-full mx-auto">
          
          {/* Success Notification Alert */}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-xl flex items-center gap-3 animate-fade-in shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-medium">Profile successfully updated!</span>
            </div>
          )}

          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="h-36 bg-gradient-to-r from-blue-900 to-indigo-900 relative">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
            </div>
            
            <div className="px-8 pb-8 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16">
              
              {/* Avatar + Basic Details */}
              <div className="flex items-end gap-5">
                <div className="relative group">
                  <img 
                    src={student.avatarUrl} 
                    alt={student.name} 
                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                  />
                  {isEditing && (
                    <label className="absolute inset-0 bg-slate-900/50 rounded-2xl flex flex-col items-center justify-center text-white cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-semibold uppercase">Change</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>

                <div className="mb-1">
                  <h2 className="text-2xl font-extrabold text-slate-900">{student.name}</h2>
                  <p className="text-slate-500 text-sm font-medium">{student.major}</p>
                  <span className="inline-block mt-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-blue-100">
                    ID: {student.id}
                  </span>
                </div>
              </div>

              {/* Edit Mode Button Toggle */}
              <div>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleCancel}
                      className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Profile Details Form / View Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-900">Personal & Academic Information</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage your personal particulars and contact information</p>
            </div>

            {!isEditing ? (
              // VIEW MODE
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mt-0.5">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">Full Name</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{student.name}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">Phone Number</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{student.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">Email Address</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{student.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">Address</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{student.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100 md:col-span-2">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mt-0.5">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                    <div>
                      <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">University</span>
                      <span className="font-bold text-slate-900 mt-0.5 block">{student.university}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">Major</span>
                      <span className="font-bold text-slate-900 mt-0.5 block">{student.major}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">Student ID</span>
                      <span className="font-bold text-slate-900 mt-0.5 block">{student.id}</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              // EDIT MODE FORM
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-500 mb-2">Student Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-500 mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-500 mb-2">Email Address (Read-only)</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm font-medium cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-500 mb-2">Major / Program</label>
                    <input 
                      type="text" 
                      name="major" 
                      value={formData.major} 
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase font-semibold text-slate-500 mb-2">Address</label>
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                    />
                  </div>

                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}