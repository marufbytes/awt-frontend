// src/app/dashboard/admin/internships/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Briefcase, Eye, Trash2 } from 'lucide-react';

export default function ManageInternshipsPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState<any>(null);

  const loadData = () => {
    setLoading(true);
    fetch('http://localhost:3000/internship', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        setList(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`http://localhost:3000/internship/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) setList(list.filter(i => i.id !== id));
  };

  const filtered = list.filter(item => {
    const matchSearch = item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.company?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' ? true : statusFilter === 'Active' ? item.isActive : !item.isActive;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex gap-3 bg-white p-4 rounded-xl shadow-xs">
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered input-sm w-64 bg-slate-50"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select 
          className="select select-bordered select-sm bg-slate-50" 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading internships...</div>
        ) : (
          <table className="table w-full">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs">
                <th>Title</th>
                <th>Company</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-6 text-slate-400">No data found</td></tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="font-bold flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-sky-500" /> {item.title}
                    </td>
                    <td>{item.company?.name || 'No Company'}</td>
                    <td>
                      <span className={`badge badge-sm font-semibold ${item.isActive ? 'badge-success text-white' : 'badge-warning text-white'}`}>
                        {item.isActive ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td className="text-right space-x-1">
                      <button onClick={() => setSelected(item)} className="btn btn-ghost btn-xs text-sky-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id, item.title)} className="btn btn-ghost btn-xs text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* DaisyUI Modal */}
      <div className={`modal ${selected ? 'modal-open' : ''}`}>
        <div className="modal-box rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-extrabold text-lg text-slate-900">{selected?.title}</h3>
            <button onClick={() => setSelected(null)} className="btn btn-sm btn-circle btn-ghost">✕</button>
          </div>
          <div className="text-xs space-y-2 text-slate-600">
            <p><strong className="text-slate-800">Description:</strong> {selected?.description || 'N/A'}</p>
            <p><strong className="text-slate-800">Requirements:</strong> {selected?.requirements || 'N/A'}</p>
          </div>
          <div className="modal-action">
            <button onClick={() => setSelected(null)} className="btn btn-sm btn-dark">Close</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setSelected(null)}>close</button></form>
      </div>
    </div>
  );
}