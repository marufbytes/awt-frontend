"use client";
import { useState, useEffect } from "react";
import { Trash2, Eye, User } from "lucide-react";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
  const fetchUsers = () => {
    setLoading(true);
    fetch("http://localhost:3000/users", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : data.users || []);
        setLoading(false);
      });
  };

  fetchUsers();
}, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete user ${name}?`)) return;
    const res = await fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) setUsers(users.filter((u) => u.id !== id));
  };

  const filtered = users.filter((u) => {
    const fullName = `${u.firstName || ""} ${u.lastName || ""}`
      .trim()
      .toLowerCase();
    const matchSearch =
      fullName.includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All Roles" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-xs">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search name or email..."
            className="input input-bordered input-sm w-64 bg-slate-50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="select select-bordered select-sm bg-slate-50"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All Roles">All Roles</option>
            <option value="STUDENT">STUDENT</option>
            <option value="ALUMNI">ALUMNI</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </div>


      <div className="bg-white rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading users...
          </div>
        ) : (
          <table className="table w-full">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs">
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-slate-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const fullName =
                    `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                    "Unnamed";
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <User className="w-4 h-4 text-sky-500" />
                        {fullName}
                      </td>
                      <td className="text-sm text-slate-600">
                        {u.email}
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm font-semibold ${
                            u.role === "ADMIN"
                              ? "badge-error text-white"
                              : u.role === "STUDENT"
                              ? "badge-primary text-white"
                              : u.role === "ALUMNI"
                              ? "badge-success text-white"
                              : u.role === "HR"
                              ? "badge-info text-white"
                              : "badge-ghost"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="text-right space-x-1">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="btn btn-ghost btn-xs text-sky-600"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, fullName)}
                          className="btn btn-ghost btn-xs text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
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


      <div className={`modal ${selectedUser ? "modal-open" : ""}`}>
        <div className="modal-box rounded-2xl space-y-4 max-w-md">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-extrabold text-lg text-slate-900">
              {`${selectedUser?.firstName || ""} ${
                selectedUser?.lastName || ""
              }`.trim() || `User #${selectedUser?.id}`}
            </h3>
            <button
              onClick={() => setSelectedUser(null)}
              className="btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
          </div>
          {selectedUser && (
            <div className="text-xs space-y-2 text-slate-600">
              <p>
                <strong className="text-slate-800">ID:</strong> #
                {selectedUser.id}
              </p>
              <p>
                <strong className="text-slate-800">Email:</strong>{" "}
                {selectedUser.email || "N/A"}
              </p>
              <p>
                <strong className="text-slate-800">Phone:</strong>{" "}
                {selectedUser.phone || "N/A"}
              </p>
              <p>
                <strong className="text-slate-800">Role:</strong>{" "}
                {selectedUser.role}
              </p>
              <p>
                <strong className="text-slate-800">Created At:</strong>{" "}
                {selectedUser.createdAt
                  ? new Date(selectedUser.createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          )}
          <div className="modal-action">
            <button
              onClick={() => setSelectedUser(null)}
              className="btn btn-sm btn-dark"
            >
              Close
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setSelectedUser(null)}>close</button>
        </form>
      </div>
    </div>
  );
}