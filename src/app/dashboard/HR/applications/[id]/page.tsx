'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  education?: string;
  gpa?: number;
}

interface Internship {
  id: number;
  title: string;
}

interface ReferredBy {
  id: number;
  firstName: string;
  lastName: string;
}

interface Resume {
  id: number;
  title?: string;
  fileUrl: string;
  skills?: string[];
}

interface Interview {
  id: number;
  scheduledDate: string;
  meetingLink: string;
  status: string;
}

interface Application {
  id: number;
  status: string;
  createdAt: string;
  student: Student;
  internship: Internship;
  referredBy?: ReferredBy | null;
  resume?: Resume | null;
  interviews?: Interview[];
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params?.id;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [interviewType, setInterviewType] = useState<'online' | 'physical'>('online');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [meetingLink, setMeetingLink] = useState<string>('');
  const [locationDetails, setLocationDetails] = useState<string>('');

  const [showCompleteModal, setShowCompleteModal] = useState<boolean>(false);
  const [finalDecision, setFinalDecision] = useState<'accepted' | 'rejected'>('accepted');

  const getMeetingLink = (link: string) => {
    if (/^https?:\/\//i.test(link)) return link;
    return `https://${link}`;
  };

  const getErrorMessage = (err: unknown, fallback: string) => {
    if (axios.isAxiosError(err)) {
      const message = err.response?.data?.message;
      if (Array.isArray(message)) return message.join(', ');
      if (typeof message === 'string') return message;
    }
    return fallback;
  };

  const fetchApplicationDetails = useCallback(async () => {
    if (!applicationId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<Application>(
        `http://localhost:3000/application/${applicationId}`,
        { withCredentials: true }
      );
      setApplication(response.data);
    } catch (err: unknown) {
      console.error('Fetch Details Error:', err);
      setError(getErrorMessage(err, 'Failed to load application details.'));
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchApplicationDetails();
  }, [fetchApplicationDetails]);

  const handleStatusChange = async (newStatus: string) => {
    setActionLoading(true);
    try {
      await axios.patch(
        `http://localhost:3000/application/${applicationId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      await fetchApplicationDetails();
    } catch (err: unknown) {
      console.error('Update Status Error:', err);
      alert(getErrorMessage(err, 'Failed to update status.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (!scheduledDate || !scheduledTime) {
        alert('Please provide interview date and time.');
        return;
      }
      if (interviewType === 'online' && !meetingLink.trim()) {
        alert('Please provide an online meeting link.');
        return;
      }
      if (interviewType === 'physical' && !locationDetails.trim()) {
        alert('Please provide office or room location.');
        return;
      }

      const combinedDateTime = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();
      const finalLocationInfo =
        interviewType === 'online'
          ? meetingLink.trim()
          : `Physical Location: ${locationDetails.trim()}`;

      await axios.post(
        `http://localhost:3000/interviews`,
        {
          applicationId: Number(applicationId),
          scheduledDate: combinedDateTime,
          meetingLink: finalLocationInfo,
        },
        { withCredentials: true }
      );

      setShowScheduleModal(false);
      setScheduledDate('');
      setScheduledTime('');
      setMeetingLink('');
      setLocationDetails('');
      setInterviewType('online');
      await fetchApplicationDetails();
    } catch (err: unknown) {
      console.error('Schedule Interview Error:', err);
      alert(getErrorMessage(err, 'Failed to schedule interview.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application?.interviews || application.interviews.length === 0) return;

    const latestInterview = application.interviews
      .slice()
      .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())[0];

    if (!latestInterview) {
      alert('No interview found for this application.');
      return;
    }

    setActionLoading(true);
    try {
      await axios.patch(
        `http://localhost:3000/interviews/${latestInterview.id}/complete`,
        { decision: finalDecision },
        { withCredentials: true }
      );

      setShowCompleteModal(false);
      await fetchApplicationDetails();
    } catch (err: unknown) {
      console.error('Complete Interview Error:', err);
      alert(getErrorMessage(err, 'Failed to complete interview.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewResume = (fileUrl: string) => {
    if (!fileUrl) return;

    const normalizedUrl = fileUrl.replace(/\\/g, '/');
    const rawFilename = normalizedUrl.split('/').pop();
    if (!rawFilename) {
      alert('Invalid file URL');
      return;
    }

    const cleanFilename = decodeURIComponent(rawFilename);
    const encodedFilename = encodeURIComponent(cleanFilename);

    const fullUrl = `http://localhost:3000/uploads/${encodedFilename}`;
    window.open(fullUrl, '_blank');
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 text-sm">Loading details...</div>;
  }

  if (error || !application) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-4">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-gray-900 font-medium inline-flex items-center gap-1"
        >
          &larr; Back to Applications
        </button>
        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm font-medium">
          {error || 'Application not found.'}
        </div>
      </div>
    );
  }

  const statusUpper = application.status ? application.status.toUpperCase() : 'PENDING';
  const latestInterview =
    application.interviews && application.interviews.length > 0
      ? application.interviews
          .slice()
          .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())[0]
      : null;

  const isPendingDone = ['REVIEWED', 'INTERVIEW', 'ACCEPTED', 'REJECTED'].includes(statusUpper);
  const isReviewedDone = ['INTERVIEW', 'ACCEPTED', 'REJECTED'].includes(statusUpper);
  const isInterviewDone = ['ACCEPTED', 'REJECTED'].includes(statusUpper);
  const isDecisionDone = ['ACCEPTED', 'REJECTED'].includes(statusUpper);

  const isReviewedActive = statusUpper === 'REVIEWED';
  const isInterviewActive = statusUpper === 'INTERVIEW';

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <button
          onClick={() => router.back()}
          className="text-xs text-gray-500 hover:text-gray-800 font-medium inline-flex items-center gap-1 mb-2"
        >
          &larr; Back to Applications
        </button>
        <h1 className="text-xl font-bold text-gray-800">Application Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-gray-500 font-semibold text-xl border border-gray-200">
              {application.student?.firstName?.[0] || 'S'}
              {application.student?.lastName?.[0] || 'U'}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {`${application.student?.firstName || ''} ${application.student?.lastName || ''}`.trim() || 'N/A'}
              </h2>
              <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border mt-1 uppercase ${
                statusUpper === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-200' :
                statusUpper === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                {statusUpper}
              </span>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-4 text-xs">
            <div>
              <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">EMAIL</p>
              <p className="text-gray-800 font-medium mt-0.5">{application.student?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">PHONE</p>
              <p className="text-gray-800 font-medium mt-0.5">{application.student?.phone || 'N/A'}</p>
            </div>
            {application.student?.education && (
              <div>
                <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">EDUCATION</p>
                <p className="text-gray-800 font-medium mt-0.5">{application.student.education}</p>
              </div>
            )}
            {application.student?.gpa && (
              <div>
                <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">GPA</p>
                <p className="text-gray-800 font-medium mt-0.5">{application.student.gpa}</p>
              </div>
            )}
            <div>
              <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">REFERRED BY</p>
              <p className="text-gray-800 font-medium mt-0.5">
                {application.referredBy
                  ? `${application.referredBy.firstName || ''} ${application.referredBy.lastName || ''}`.trim()
                  : 'Direct Application'}
              </p>
            </div>
          </div>

          {application.resume?.skills && application.resume.skills.length > 0 && (
            <div className="space-y-2 pt-1">
              <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">SKILLS</p>
              <div className="flex flex-wrap gap-1.5">
                {application.resume.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 text-[11px] font-medium bg-gray-100 text-gray-800 rounded-full border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {application.resume?.fileUrl ? (
            <button
              onClick={() => handleViewResume(application.resume!.fileUrl)}
              className="w-full text-center py-2.5 px-4 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition shadow-xs cursor-pointer"
            >
              View Resume
            </button>
          ) : (
            <div className="w-full text-center py-2.5 px-4 border border-dashed border-gray-200 text-xs text-gray-400 rounded-xl">
              No Resume Uploaded
            </div>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">APPLIED INTERNSHIP</p>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{application.internship?.title || 'N/A'}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Applied: {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">APPLICATION PROGRESS</p>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase ${
                statusUpper === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-200' :
                statusUpper === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                {statusUpper}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium pt-2">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] ${statusUpper === 'PENDING' || isPendingDone ? 'bg-black text-white font-bold' : 'bg-gray-100 text-gray-400 border'}`}>
                  {statusUpper === 'PENDING' ? '1' : '✓'}
                </div>
                <span className={`text-[11px] ${statusUpper === 'PENDING' || isPendingDone ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>Pending</span>
              </div>
              <div className={`h-0.5 flex-1 mb-5 ${isPendingDone ? 'bg-black' : 'bg-gray-200'}`} />

              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] ${isReviewedDone ? 'bg-black text-white' : isReviewedActive ? 'bg-black text-white font-bold' : 'bg-gray-100 text-gray-400 border'}`}>
                  {isReviewedDone ? '✓' : '2'}
                </div>
                <span className={`text-[11px] ${isReviewedActive || isReviewedDone ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>Reviewed</span>
              </div>
              <div className={`h-0.5 flex-1 mb-5 ${isReviewedDone ? 'bg-black' : 'bg-gray-200'}`} />

              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] ${isInterviewDone ? 'bg-black text-white' : isInterviewActive ? 'bg-black text-white font-bold' : 'bg-gray-100 text-gray-400 border'}`}>
                  {isInterviewDone ? '✓' : '3'}
                </div>
                <span className={`text-[11px] ${isInterviewActive || isInterviewDone ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>Interview</span>
              </div>
              <div className={`h-0.5 flex-1 mb-5 ${isInterviewDone ? 'bg-black' : 'bg-gray-200'}`} />

              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${statusUpper === 'ACCEPTED' ? 'bg-emerald-600 text-white' : statusUpper === 'REJECTED' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400 border'}`}>
                  {statusUpper === 'ACCEPTED' ? '✓' : statusUpper === 'REJECTED' ? '✕' : '4'}
                </div>
                <span className={`text-[11px] ${isDecisionDone ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                  {statusUpper === 'REJECTED' ? 'Rejected' : statusUpper === 'ACCEPTED' ? 'Accepted' : 'Decision'}
                </span>
              </div>
            </div>
          </div>

          {latestInterview && (
            <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <p className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">INTERVIEW INFORMATION</p>
              <div className="text-xs text-gray-800 space-y-1.5 leading-relaxed">
                <p><strong className="text-gray-900">Date:</strong> {new Date(latestInterview.scheduledDate).toLocaleDateString()}</p>
                <p><strong className="text-gray-900">Time:</strong> {new Date(latestInterview.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>
                  <strong className="text-gray-900">Location / Link:</strong>{' '}
                  {latestInterview.meetingLink.startsWith('Physical Location:') ? (
                    <span className="font-medium text-gray-900">{latestInterview.meetingLink}</span>
                  ) : (
                    <a href={getMeetingLink(latestInterview.meetingLink)} target="_blank" rel="noopener noreferrer" className="text-gray-900 underline font-medium hover:text-black">
                      {latestInterview.meetingLink}
                    </a>
                  )}
                </p>
                <p><strong className="text-gray-900">Status:</strong> <span className="uppercase font-semibold text-gray-900">{latestInterview.status || 'SCHEDULED'}</span></p>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">HR ACTIONS</p>
            <div className="flex flex-wrap gap-3">
              {statusUpper === 'PENDING' && (
                <>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleStatusChange('reviewed')}
                    className="px-4 py-2 bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition shadow-sm cursor-pointer"
                  >
                    Review Application
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleStatusChange('rejected')}
                    className="px-4 py-2 bg-white border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 text-xs font-semibold rounded-lg transition shadow-sm cursor-pointer"
                  >
                    Reject Application
                  </button>
                </>
              )}

              {(statusUpper === 'REVIEWED' || (statusUpper === 'INTERVIEW' && !latestInterview)) && (
                <button
                  disabled={actionLoading}
                  onClick={() => setShowScheduleModal(true)}
                  className="px-4 py-2 bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition shadow-sm cursor-pointer"
                >
                  Schedule Interview
                </button>
              )}

              {statusUpper === 'INTERVIEW' && latestInterview?.status?.toUpperCase() === 'SCHEDULED' && (
                <button
                  disabled={actionLoading}
                  onClick={() => setShowCompleteModal(true)}
                  className="px-4 py-2.5 bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition shadow-sm cursor-pointer"
                >
                  Complete Interview
                </button>
              )}

              {['ACCEPTED', 'REJECTED'].includes(statusUpper) && (
                <p className="text-xs text-gray-500 italic">No further actions required. Application is {statusUpper.toLowerCase()}.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-800">Schedule Interview</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer">×</button>
            </div>
            <form onSubmit={handleScheduleInterview} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 font-medium mb-1">Interview Type</label>
                <div className="flex gap-4 border p-2 rounded-lg bg-gray-50">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-gray-700">
                    <input type="radio" name="interviewType" value="online" checked={interviewType === 'online'} onChange={() => setInterviewType('online')} />
                    Online
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-gray-700">
                    <input type="radio" name="interviewType" value="physical" checked={interviewType === 'physical'} onChange={() => setInterviewType('physical')} />
                    Physical / In-Person
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer [color-scheme:light] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:brightness-0"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer [color-scheme:light] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:brightness-0"
                  />
                </div>
              </div>

              {interviewType === 'online' ? (
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Meeting Link</label>
                  <input type="text" required placeholder="https://meet.google.com/xyz-abc-def" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-xs" />
                </div>
              ) : (
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Location Details</label>
                  <input type="text" required placeholder="Building A, Room 302" value={locationDetails} onChange={(e) => setLocationDetails(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-xs" />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowScheduleModal(false)} className="px-3 py-1.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium cursor-pointer">Cancel</button>
                <button type="submit" disabled={actionLoading} className="px-4 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 font-semibold cursor-pointer">
                  {actionLoading ? 'Scheduling...' : 'Confirm Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-800">Complete Interview</h3>
              <button onClick={() => setShowCompleteModal(false)} className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer">×</button>
            </div>
            <form onSubmit={handleCompleteInterview} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 font-medium mb-2">Final Decision for Candidate</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <input type="radio" name="finalDecision" value="accepted" checked={finalDecision === 'accepted'} onChange={() => setFinalDecision('accepted')} />
                    <div>
                      <span className="font-bold text-emerald-700 block">Accept Candidate</span>
                      <span className="text-[11px] text-gray-500">Mark application as Accepted</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <input type="radio" name="finalDecision" value="rejected" checked={finalDecision === 'rejected'} onChange={() => setFinalDecision('rejected')} />
                    <div>
                      <span className="font-bold text-red-600 block">Reject Candidate</span>
                      <span className="text-[11px] text-gray-500">Mark application as Rejected</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCompleteModal(false)} className="px-3 py-1.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium cursor-pointer">Cancel</button>
                <button type="submit" disabled={actionLoading} className="px-4 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 font-semibold cursor-pointer">
                  {actionLoading ? 'Submitting...' : 'Submit Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
