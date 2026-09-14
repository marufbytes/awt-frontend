"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Layers, 
  Briefcase 
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Internship {
  id: number | string;
  title: string;
  description?: string;
  isActive: boolean;
  company?: {
    name: string;
  };
}

export default function InternshipsPage() {
  const router = useRouter();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axios.get("http://localhost:3000/internship/company", {
          withCredentials: true,
        });

        setInternships(response.data);
      } catch (error: any) {
        console.error("Error fetching internships:", error);
        if (error.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [router]);

  const filteredInternships = internships.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] pt-8 px-8 flex justify-center text-xs font-semibold text-slate-500">
        লোডিং হচ্ছে...
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 font-sans text-xs">
      
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Internships</h1>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">Create and manage your internship opportunities.</p>
        </div>
        
        <button 
          onClick={() => router.push("/dashboard/HR/internships/create")}
          className="px-3.5 py-1.5 bg-black hover:bg-slate-800 text-white rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95"
        >
          Create Internship
        </button>
      </div>

      {/* Filter & Search Bar Card */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search internships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50/70 border border-slate-200/60 rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-black focus:outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Internships List */}
      <div className="space-y-2.5">
        {filteredInternships.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center text-xs font-semibold text-slate-500">
            কোনো ইন্টার্নশিপ পাওয়া যায়নি।
          </div>
        ) : (
          filteredInternships.map((item) => (
            <div 
              key={item.id} 
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all duration-200 hover:shadow-xs hover:border-slate-200"
            >
              {/* Left Info Details */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">{item.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${
                    item.isActive
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-rose-50 text-rose-600 border-rose-100"
                  }`}>
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" /> {item.company?.name || "Company"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Internship
                  </span>
                </div>
              </div>

              {/* Right Action Button */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button 
                  onClick={() => router.push(`/dashboard/HR/internships/${item.id}`)}
                  className="px-4 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-black transition-all cursor-pointer active:scale-95 shadow-xs"   
                >
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
