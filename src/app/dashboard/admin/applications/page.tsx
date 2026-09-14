// src/app/dashboard/admin/applications/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

export default function ManageApplicationsPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Stages');
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/application', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setList(Array.isArray(data) ? data : (data.applications || data.data || []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = list.filter(item => {
    const studentName = item.student ? `${item.student.firstName || ''} ${item.student.lastName || ''}`.trim() : `Student #${item.studentId || item.id}`;
    const position = item.internship?.title || '';
    const company = item.internship?.company?.name || '';
    const matchSearch = 
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      position.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All Stages' || item.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-xs">
        <input 
          type="text" 
          placeholder="Filter by student, position, or company..." 
          className="input input-bordered input-sm w-72 bg-slate-50"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select 
          className="select select-bordered select-sm bg-slate-50"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="All Stages">All Stages</option>
          <option value="pending">Pending</option>
          <option value="interviewing">Interviewing</option>
          <option value="offered">Offered</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading applications...</div>
        ) : (
          <table className="table w-full">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs">
                <th>Student</th>
                <th>Position & Company</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-6 text-slate-400">No applications found</td></tr>
              ) : (
                filtered.map(app => {
                  const studentName = app.student ? `${app.student.firstName || ''} ${app.student.lastName || ''}`.trim() : `Applicant #${app.id}`;
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/50">
                      <td className="font-bold text-slate-900 text-sm">{studentName}</td>
                      <td>
                        <div className="text-slate-800 text-sm font-medium">{app.internship?.title || 'N/A'}</div>
                        <div className="text-xs text-slate-400">{app.internship?.company?.name || 'No Company'}</div>
                      </td>
                      <td className="text-xs text-slate-500">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <span className={`badge badge-sm font-semibold capitalize ${
                          app.status === 'offered' ? 'badge-success text-white' : 
                          app.status === 'interviewing' ? 'badge-info text-white' : 'badge-ghost'
                        }`}>
                          {app.status || 'Pending'}
                        </span>
                      </td>
                      <td className="text-right">
                        <button onClick={() => setSelected(app)} className="btn btn-ghost btn-xs text-sky-600 gap-1">
                          <Eye className="w-4 h-4" /> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* DaisyUI View Details Modal */}
      <div className={`modal ${selected ? 'modal-open' : ''}`}>
        <div className="modal-box rounded-2xl space-y-4 max-w-md">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-extrabold text-lg text-slate-900">Application #{selected?.id}</h3>
            <button onClick={() => setSelected(null)} className="btn btn-sm btn-circle btn-ghost">✕</button>
          </div>
          {selected && (
            <div className="text-xs space-y-2 text-slate-600">
              <p><strong className="text-slate-800">Status:</strong> <span className="capitalize">{selected.status}</span></p>
              <p><strong className="text-slate-800">Type:</strong> {selected.type}</p>
              <p><strong className="text-slate-800">Position:</strong> {selected.internship?.title || 'N/A'}</p>
              <p><strong className="text-slate-800">Requirements:</strong> {selected.internship?.requirements || 'N/A'}</p>
              <p><strong className="text-slate-800">Applied Date:</strong> {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : 'N/A'}</p>
            </div>
          )}
          <div className="modal-action">
            <button onClick={() => setSelected(null)} className="btn btn-sm btn-dark">Close</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setSelected(null)}>close</button></form>
      </div>
    </div>
  );
}