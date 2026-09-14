'use client';

import React, { useState, useEffect } from 'react';

interface Interview {
  id: number;
  scheduledDate: string;
  meetingLink: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  candidateName?: string;
  internshipTitle?: string;
  application?: {
    id: number;
    student?: {
      firstName?: string;
      lastName?: string;
      email?: string;
    };
    internship?: {
      title?: string;
    };
  };
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'] as const;
const API_BASE_URL = 'http://localhost:3000/interviews/company';

export default function InterviewsContent() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('All');
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Edit Modal States
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [editDate, setEditDate] = useState<string>('');
  const [editLink, setEditLink] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Helper for Notifications
  const showToast = (message: string, type: 'success' | 'error' = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch Interviews
  const fetchInterviews = async (statusFilter: string) => {
    setLoading(true);
    try {
      let filterParam = statusFilter.toLowerCase();
      if (statusFilter === 'Upcoming') filterParam = 'scheduled';

      const url = statusFilter === 'All' ? API_BASE_URL : `${API_BASE_URL}?status=${filterParam}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const result = await response.json();

      if (response.ok && Array.isArray(result)) {
        setInterviews(result);
      } else {
        setInterviews([]);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews(activeTab);
  }, [activeTab]);

  // Handle Edit Click
  const handleEditClick = (interview: Interview) => {
    setEditingInterview(interview);
    const dateObj = new Date(interview.scheduledDate);
    if (!isNaN(dateObj.getTime())) {
      const tzOffset = dateObj.getTimezoneOffset() * 60000;
      setEditDate(new Date(dateObj.getTime() - tzOffset).toISOString().slice(0, 16));
    } else {
      setEditDate('');
    }
    setEditLink(interview.meetingLink || '');
  };

  // Save Edited Schedule
  const handleSaveEdit = async () => {
    if (!editingInterview) return;
    setIsUpdating(true);

    try {
      const payload: { meetingLink: string; scheduledDate?: string } = {
        meetingLink: editLink,
      };

      if (editDate) {
        payload.scheduledDate = new Date(editDate).toISOString();
      }

      const response = await fetch(`${API_BASE_URL}/${editingInterview.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setEditingInterview(null);
        showToast('Interview updated successfully!', 'success');
        fetchInterviews(activeTab);
      } else {
        const errData = await response.json();
        showToast(`Failed to update: ${errData.message || 'Server Error'}`, 'error');
      }
    } catch (error) {
      showToast('Error connecting to backend server', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Cancel Interview
  const handleCancelClick = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (response.ok) {
        showToast('Interview cancelled successfully', 'success');
        fetchInterviews(activeTab);
      } else {
        const errData = await response.json();
        showToast(`Failed to cancel: ${errData.message || 'Server Error'}`, 'error');
      }
    } catch (error) {
      showToast('Error connecting to backend server', 'error');
    }
  };

  // Helper for Status Pills Styling (Matching image design)
  const renderStatusBadge = (status: string) => {
    if (status === 'scheduled') {
      return (
        <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-100 inline-block">
          Interview
        </span>
      );
    }
    if (status === 'completed') {
      return (
        <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 inline-block">
          Accepted
        </span>
      );
    }
    return (
      <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-500 border border-rose-100 inline-block">
        Cancelled
      </span>
    );
  };

  return (
    <div className="w-full min-h-screen bg-white p-6 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-600 border-emerald-500 text-white'
              : 'bg-rose-600 border-rose-500 text-white'
          }`}
        >
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Interviews</h1>
        <p className="text-xs text-gray-500 mt-1">Manage and monitor candidate interview schedules.</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex items-center">
        <div className="inline-flex bg-gray-100/80 p-1 rounded-xl gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-xs font-semibold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container - Custom Card Style matching Image */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm font-bold text-gray-900 bg-white">
                <th className="py-4 px-6 font-bold">Applicant</th>
                <th className="py-4 px-6 font-bold">Internship</th>
                <th className="py-4 px-6 font-bold">Scheduled Date</th>
                <th className="py-4 px-6 font-bold">Meeting Link</th>
                <th className="py-4 px-6 font-bold">Status</th>
                <th className="py-4 px-6 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Loading interviews...
                  </td>
                </tr>
              ) : interviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No interviews found.
                  </td>
                </tr>
              ) : (
                interviews.map((item) => {
                  const dateObj = new Date(item.scheduledDate);
                  const isValidDate = !isNaN(dateObj.getTime());
                  const formattedDate = isValidDate
                    ? dateObj.toISOString().split('T')[0]
                    : item.scheduledDate;

                  // Dynamic Candidate Name & Internship Title Extraction
                  const candidateName =
                    item.candidateName ||
                    (item.application?.student
                      ? `${item.application.student.firstName || ''} ${item.application.student.lastName || ''}`.trim()
                      : null) ||
                    `Candidate #${item.id}`;

                  const internshipTitle =
                    item.internshipTitle ||
                    item.application?.internship?.title ||
                    'N/A';

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-800">
                        {candidateName}
                      </td>

                      <td className="py-4 px-6 font-normal text-gray-700">
                        {internshipTitle}
                      </td>

                      <td className="py-4 px-6 text-gray-400 font-normal">
                        {formattedDate}
                      </td>

                      <td className="py-4 px-6">
                        {item.meetingLink ? (
                          <a
                            href={
                              item.meetingLink.startsWith('http')
                                ? item.meetingLink
                                : `https://${item.meetingLink}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline max-w-[150px] truncate block"
                          >
                            {item.meetingLink}
                          </a>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {renderStatusBadge(item.status)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {item.status === 'scheduled' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(item)}
                              className="px-4 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleCancelClick(item.id)}
                              className="px-4 py-1.5 border border-rose-200 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50/50 hover:bg-rose-100 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            disabled
                            className="px-4 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-400 bg-gray-50 cursor-not-allowed"
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingInterview && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Interview Schedule</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Meeting Link
                </label>
                <input
                  type="text"
                  value={editLink}
                  onChange={(e) => setEditLink(e.target.value)}
                  placeholder="meet.google.com/..."
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingInterview(null)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isUpdating}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 transition disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
