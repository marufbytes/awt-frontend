"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [role, setRole] = useState("student");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <header className="w-full bg-white border-b border-gray-100 py-4 px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-blue-600">
              <Image
                src="/logo.jpg"
                alt="UniCareer Connect Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold text-gray-900 leading-tight">
              InternNova{" "}
              <span className="block text-xs font-normal text-gray-500">
                Connect
              </span>
            </span>
          </div>
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
        >
          ← Back to Home
        </Link>
      </header>

      {/* Main Container */}
      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 grid grid-cols-1 md:grid-cols-2">
          {/* Left Section */}
          <div className="p-8 md:p-12 flex flex-col justify-between">
            <div>
              {/* Tab Switcher */}
              <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <Link
                  href="/auth/login"
                  className="flex-1 py-2 text-center text-sm font-semibold text-gray-500 hover:text-gray-900 rounded-lg transition"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="flex-1 py-2 text-center text-sm font-semibold bg-white text-blue-600 rounded-lg shadow-sm"
                >
                  Register
                </Link>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Create an Account
              </h2>

              {/* Form */}
              <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="student">Student</option>
                    <option value="employer">Company</option>
                    <option value="alumni">Alumni</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition mt-2"
                >
                  Sign Up
                </button>
              </form>
            </div>

            {/* Bottom switch link */}
            <div className="text-center mt-6 text-sm text-gray-500">
              <p>
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side Banner */}
          <div className="hidden md:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-blue-400 to-blue-600 text-white text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 relative overflow-hidden">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <h3 className="text-3xl font-extrabold mb-3 leading-tight">
              Start Your Journey
              <br />
              With Us!
            </h3>
            <p className="text-blue-100 text-sm max-w-sm leading-relaxed">
              Create your profile to unlock career opportunities, connect with
              top employers, and grow your professional network.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 px-8 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
        <p>© 2026 UniCareer Connect</p>
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}
