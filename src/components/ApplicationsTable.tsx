"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useApplicationFilters } from "./hooks/useApplicationFilters";

export interface Student {
  id: number;
  firstName: string;
  email: string;
  phone?: string;
}

export interface Company {
  id: number;
  name: string;
}

export interface Internship {
  id: number;
  title: string;
  company?: Company;
}

export interface ReferredBy {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Application {
  id: number;
  status: string;
  type?: string;
  createdAt: string;
  updatedAt?: string;
  student: Student;
  internship: Internship;
  referredBy?: ReferredBy | null;
  resume?: {
    id: number;
    fileUrl: string;
  } | null;
}

interface ApplicationsTableProps {
  applications: Application[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  search?: string;
  status?: string;
  internshipId?: string;
  showAction?: boolean;
  showFilters?: boolean;
  onPageChange?: (page: number) => void;
}

export default function ApplicationsTable({
  applications,
  currentPage,
  itemsPerPage,
  totalItems,
  search = "",
  status = "All",
  internshipId = "",
  showAction = true,
  showFilters = true,
  onPageChange,
}: ApplicationsTableProps) {
  const router = useRouter();

  const {
    searchInput,
    setSearchInput,
    selectedStatus,
    isPending,
    handleStatusChange,
    handleResetFilters,
    handlePagination,
  } = useApplicationFilters({
    initialSearch: search,
    initialStatus: status,
    internshipId,
    itemsPerPage,
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + applications.length, totalItems);

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
          
          <div className="relative w-full sm:w-auto flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by candidate name or intership..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-full bg-slate-100 py-2 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:bg-slate-200/70 focus:ring-1 focus:ring-slate-300 border-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white font-medium text-slate-700 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>

            {(searchInput || selectedStatus !== "All") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-rose-600 font-semibold hover:underline px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      <div
        className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-opacity ${
          isPending ? "opacity-50" : "opacity-100"
        }`}
      >
        {applications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm font-medium">
            No applications found matching the criteria.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-black tracking-wider">
                    <th className="px-6 py-4">Applicant</th>
                    <th className="px-6 py-4">Internship</th>
                    <th className="px-6 py-4">Applied Date</th>
                    <th className="px-6 py-4">Referred By</th>
                    <th className="px-6 py-4">Status</th>
                    {showAction && <th className="px-6 py-4 text-center">Action</th>}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm">
                  {applications.map((app) => {
                    const statusLower = (app.status || "pending").toLowerCase();
                    const firstName = app.student?.firstName || "";
                    const fullName = firstName || "N/A";

                    let badgeStyle = "bg-amber-50 text-amber-600 border border-amber-200";

                    if (statusLower === "accepted") {
                      badgeStyle = "bg-emerald-50 text-emerald-600 border border-emerald-200";
                    } else if (statusLower === "interview" || statusLower === "reviewed") {
                      badgeStyle = "bg-purple-50 text-purple-600 border border-purple-200";
                    } else if (statusLower === "rejected") {
                      badgeStyle = "bg-rose-50 text-rose-600 border border-rose-200";
                    }

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-slate-700 font-normal">{fullName}</td>
                        <td className="px-6 py-4 text-slate-700 font-normal">
                          {app.internship?.title || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-normal">
                          {app.createdAt
                            ? new Date(app.createdAt).toISOString().split("T")[0]
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-normal">
                          {app.referredBy
                            ? `${app.referredBy.firstName || ""} ${
                                app.referredBy.lastName || ""
                              }`.trim() || "Direct"
                            : "Direct"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold capitalize ${badgeStyle}`}
                          >
                            {statusLower}
                          </span>
                        </td>
                        {showAction && (
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => router.push(`/dashboard/HR/applications/${app.id}`)}
                              className="inline-block px-4 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium text-xs hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
                            >
                              View
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-sm text-slate-500">
              <div>
                Showing {startIndex + 1} to {endIndex} of {totalItems} applications
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handlePagination(currentPage - 1, onPageChange)}
                  disabled={currentPage <= 1 || isPending}
                  className="px-4 py-1.5 border border-slate-200 rounded-xl font-medium text-xs text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  &lt; Prev
                </button>

                <button
                  type="button"
                  onClick={() => handlePagination(currentPage + 1, onPageChange)}
                  disabled={currentPage >= totalPages || isPending}
                  className="px-4 py-1.5 border border-slate-200 rounded-xl font-medium text-xs text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
