"use client";
import { useState, useEffect } from "react";
import { Eye, Trash2, Building2, CheckCircle } from "lucide-react";

export default function ManageCompaniesPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      fetch("http://localhost:3000/company", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          setList(Array.isArray(data) ? data : data.companies || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    loadData();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete company "${name}"?`)) return;
    const res = await fetch(`http://localhost:3000/company/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) setList(list.filter((c) => c.id !== id));
  };

  const handleVerify = async (id: number, name: string) => {
    if (!confirm(`Verify company "${name}"?`)) return;
    const res = await fetch(`http://localhost:3000/company/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVerified: true }),
      credentials: "include",
    });
    if (res.ok) {
      setList(list.map((c) => (c.id === id ? { ...c, isVerified: true } : c)));
      if (selected && selected.id === id) {
        setSelected({ ...selected, isVerified: true });
      }
    }
  };

  const filtered = list.filter((item) => {
  const query = search.toLowerCase();
  
  const matchSearch =
    (item.name || "").toLowerCase().includes(query) ||
    (item.industry || "").toLowerCase().includes(query);

  const matchStatus =
    statusFilter === "All" ||
    (statusFilter === "Verified" && item.isVerified) ||
    (statusFilter === "Unverified" && !item.isVerified);

  return matchSearch && matchStatus;
});

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-xs">
        <input
          type="text"
          placeholder="Search name or industry..."
          className="input input-bordered input-sm w-72 bg-slate-50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select select-bordered select-sm bg-slate-50"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Verified">Verified</option>
          <option value="Unverified">Unverified</option>
        </select>
      </div>


      <div className="bg-white rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading companies...
          </div>
        ) : (
          <table className="table w-full">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs">
                <th>Company Name</th>
                <th>Industry</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-slate-400">
                    No companies found
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-sky-500" /> {item.name}
                    </td>
                    <td className="text-slate-600 text-xs">
                      {item.industry}
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm font-semibold ${item.isVerified ? "badge-success text-white" : "badge-warning text-white"}`}
                      >
                        {item.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="text-right space-x-1">
                      {!item.isVerified && (
                        <button
                          onClick={() => handleVerify(item.id, item.name)}
                          className="btn btn-ghost btn-xs text-emerald-600"
                          title="Verify Company"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setSelected(item)}
                        className="btn btn-ghost btn-xs text-sky-600"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="btn btn-ghost btn-xs text-red-500"
                        title="Delete"
                      >
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


      <div className={`modal ${selected ? "modal-open" : ""}`}>
        <div className="modal-box rounded-2xl space-y-4 max-w-md">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-extrabold text-lg text-slate-900">
              {selected?.name}
            </h3>
            <button
              onClick={() => setSelected(null)}
              className="btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
          </div>
          {selected && (
            <div className="text-xs space-y-2 text-slate-600">
              <p>
                <strong className="text-slate-800">Industry:</strong>
                {selected.industry || "N/A"}
              </p>
              <p>
                <strong className="text-slate-800">Email:</strong>
                {selected.email || "N/A"}
              </p>
              <p>
                <strong className="text-slate-800">Phone:</strong>
                {selected.phone || "N/A"}
              </p>
              <p>
                <strong className="text-slate-800">Location:</strong>
                {selected.location || "N/A"}
              </p>
              <p>
                <strong className="text-slate-800">Description:</strong>
                {selected.description || "N/A"}
              </p>
              <div className="pt-2 border-t">
                <strong className="text-slate-800 block mb-1">
                  Associated Internships ({selected.internships?.length || 0}):
                </strong>
                {selected.internships?.length > 0 ? (
                  <ul className="list-disc pl-4 space-y-1">
                    {selected.internships.map((int: any) => (
                      <li key={int.id}>
                        {int.title}{" "}
                        <span className="text-slate-400">
                          ({int.isActive ? "Active" : "Closed"})
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400">No internships found</p>
                )}
              </div>
            </div>
          )}
          <div className="modal-action flex justify-between">
            {selected && !selected.isVerified ? (
              <button
                onClick={() => handleVerify(selected.id, selected.name)}
                className="btn btn-sm btn-success text-white"
              >
                Verify Company Now
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={() => setSelected(null)}
              className="btn btn-sm btn-dark"
            >
              Close
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setSelected(null)}>close</button>
        </form>
      </div>
    </div>
  );
}
