"use client";

import { useState, useEffect } from "react";
import { User, Lock } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

axios.defaults.withCredentials = true;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Notification State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form States
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  // Notification Helper
  const showToast = (message: string, type: "success" | "error" = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch Profile Data
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users/me`)
      .then((res) => {
        const u = res.data;
        setProfile({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          email: u.email || "",
          phone: u.phone || "",
        });
      })
      .catch((err) => {
        if (err.response?.status === 401) router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  // Input Change Handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  // Update Profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await axios.patch(`${API_BASE_URL}/users/profile`, profile);
      showToast("Profile updated successfully!", "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      return showToast("Passwords do not match!");
    }

    setSavingPassword(true);
    try {
      await axios.patch(`${API_BASE_URL}/users/change-password`, {
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });
      showToast("Password updated successfully!", "success");
      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-xs font-semibold text-gray-400 text-center">Loading settings...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-white p-6 font-sans">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg ${
            toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-xs text-gray-500 mt-1">Manage your account and password settings.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-center gap-2 border-b border-gray-100 pb-3">
            <User className="w-4 h-4 text-gray-700" />
            <h2 className="text-sm font-bold text-gray-900 text-center">Personal Information</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="max-w-xl mx-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={profile.firstName}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={profile.lastName}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-semibold transition-colors duration-200 disabled:opacity-50"
              >
                {savingProfile ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-center gap-2 border-b border-gray-100 pb-3">
            <Lock className="w-4 h-4 text-gray-700" />
            <h2 className="text-sm font-bold text-gray-900 text-center">Change Password</h2>
          </div>

          <form onSubmit={handleUpdatePassword} className="max-w-md mx-auto space-y-4">
            <div className="text-left">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Current Password *</label>
              <input
                type="password"
                name="currentPassword"
                required
                value={password.currentPassword}
                onChange={handlePasswordChange}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
              />
            </div>

            <div className="text-left">
              <label className="block text-xs font-semibold text-gray-700 mb-1">New Password *</label>
              <input
                type="password"
                name="newPassword"
                required
                minLength={8}
                value={password.newPassword}
                onChange={handlePasswordChange}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
              />
            </div>

            <div className="text-left">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm New Password *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={password.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
              />
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={savingPassword}
                className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-semibold transition-colors duration-200 disabled:opacity-50"
              >
                {savingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
