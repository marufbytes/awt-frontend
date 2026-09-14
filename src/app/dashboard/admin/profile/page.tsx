"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:3000/users/1", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setProfile({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phone || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, []);


  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm("Are you sure? You want to update?")) return;

    const updatedPayload: Record<string, string> = {};
    if (form.firstName.trim()) updatedPayload.firstName = form.firstName.trim();
    if (form.lastName.trim()) updatedPayload.lastName = form.lastName.trim();
    if (form.email.trim()) updatedPayload.email = form.email.trim();
    if (form.phone.trim()) updatedPayload.phone = form.phone.trim();

    if (Object.keys(updatedPayload).length === 0) {
      alert("Must update at least 1 field!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/users/1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedPayload),
      });

      if (res.ok) {
        alert("Successfully updated!");

        setForm({ firstName: "", lastName: "", email: "", phone: "" });

        await fetchProfile();
      } else {
        const errData = await res.json().catch(() => null);
        console.log("Server error response:", errData);
        alert(`Failed!`);
      }
    } catch (err) {
      console.error("Error");
      alert("Error!");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwd.currentPassword || !pwd.newPassword) {
      alert("Fill up the password");
      return;
    }
    if (!window.confirm("Change password?")) return;

    try {
      const res = await fetch("http://localhost:3000/users/1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(pwd),
      });
      if (res.ok) {
        setPwd({ currentPassword: "", newPassword: "" });
        alert("Successfully changed the password!");
      } else {
        alert("Failed to change the password!");
      }
    } catch {
      alert("Error!");
    }
  };

  const currentFullName = `${profile.firstName} ${profile.lastName}`.trim();

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

        <div className="card bg-base-100 shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center justify-center">
          <div className="avatar mb-3">
            <div className="w-24 rounded-full relative overflow-hidden ring ring-primary/20">
              <Image src="/admin.avif" alt="Admin" fill className="object-cover" />
            </div>
          </div>
          <h3 className="font-bold text-lg text-slate-900">
            {currentFullName}
          </h3>
          <span className="badge badge-primary badge-sm mt-1">Super Admin</span>
          <div className="text-xs text-slate-500 mt-3 space-y-1 w-full break-all">
            <p>{profile.email}</p>
            {profile.phone && <p>{profile.phone}</p>}
          </div>
        </div>


        <div className="md:col-span-2 space-y-6">

          <form
            onSubmit={handleUpdateProfile}
            className="card bg-base-100 shadow-sm border border-slate-100 p-6 space-y-4"
          >
            <h3 className="font-bold text-sm text-slate-800">
              General Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className="input input-bordered w-full rounded-xl text-sm"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="input input-bordered w-full rounded-xl text-sm"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input input-bordered w-full rounded-xl text-sm"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input input-bordered w-full rounded-xl text-sm"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary btn-sm rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </form>


          <form
            onSubmit={handleUpdatePassword}
            className="card bg-base-100 shadow-sm border border-slate-100 p-6 space-y-4"
          >
            <h3 className="font-bold text-sm text-slate-800">
              Security & Password
            </h3>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current Password"
                value={pwd.currentPassword}
                onChange={(e) =>
                  setPwd({ ...pwd, currentPassword: e.target.value })
                }
                className="input input-bordered w-full rounded-xl text-sm"
              />
              <input
                type="password"
                placeholder="New Password"
                value={pwd.newPassword}
                onChange={(e) =>
                  setPwd({ ...pwd, newPassword: e.target.value })
                }
                className="input input-bordered w-full rounded-xl text-sm"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-neutral btn-sm rounded-xl"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
