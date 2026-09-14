"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { InternshipInput, InternshipOutput, internshipSchema } from "@/components/lib/validations";

export default function CreateInternshipPage() {
  const router = useRouter();

  const form = useForm<InternshipInput>({
    resolver: zodResolver(internshipSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  async function onSubmit(data: InternshipOutput) {
    try {
      await axios.post("http://localhost:3000/internship", data, {
        withCredentials: true,
      });

      router.push("/dashboard/HR/internships");
    } catch (error: any) {
      console.error("Error creating internship:", error.response?.data || error.message);

      if (error.response?.status === 401) {
        router.push("/login");
        return;
      }

      alert(error.response?.data?.message || "Failed to create internship");
    }
  }

  return (
    <div className="w-full space-y-4 font-sans text-xs">
      <div className="max-w-3xl mx-auto space-y-4">
        
        {/* Header Section */}
        <div className="relative text-center py-1">
          <button
            type="button"
            onClick={() => router.back()}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all cursor-pointer border border-slate-200/80 shadow-2xs active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Create Internship
          </h1>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            Post a new internship opportunity.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit(onSubmit as any)} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
          
          {/* Title */}
          <div className="relative pb-3 space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Internship Title *
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="e.g. Frontend Developer Intern"
              className={`w-full bg-slate-50/70 border ${
                errors.title ? "border-rose-500 focus:border-rose-500" : "border-slate-200/80 focus:border-black"
              } rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition-all`}
            />
            {errors.title && (
              <p className="absolute text-[10px] font-bold text-rose-500 mt-0.5">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="relative pb-3 space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Description *
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Describe the internship role, team, and what the intern will work on..."
              className={`w-full bg-slate-50/70 border ${
                errors.description ? "border-rose-500 focus:border-rose-500" : "border-slate-200/80 focus:border-black"
              } rounded-xl p-3.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition-all resize-none`}
            />
            {errors.description && (
              <p className="absolute text-[10px] font-bold text-rose-500 mt-0.5">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Requirements */}
          <div className="relative pb-3 space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Requirements *
            </label>
            <textarea
              {...register("requirements")}
              rows={3}
              placeholder="e.g. React, TypeScript, Tailwind CSS, Git"
              className={`w-full bg-slate-50/70 border ${
                errors.requirements ? "border-rose-500 focus:border-rose-500" : "border-slate-200/80 focus:border-black"
              } rounded-xl p-3.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition-all resize-none`}
            />
            {errors.requirements && (
              <p className="absolute text-[10px] font-bold text-rose-500 mt-0.5">
                {errors.requirements.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-800 transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-black hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-xs"
            >
              {isSubmitting ? "Publishing..." : "Publish Internship"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
