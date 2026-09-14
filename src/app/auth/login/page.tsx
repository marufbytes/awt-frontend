'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Footer from '@/components/common/Footer';
import { login, ApiError } from '@/lib/auth/api';
import { storeSession, dashboardPathForRole } from '@/lib/auth/session';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [resetErr, setResetErr] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const session = await login({ email, password });
      storeSession(session);
      router.push(dashboardPathForRole(session.user.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetErr(null);
    setResetMsg(null);
    setResetLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, newPassword }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setResetMsg('Password updated successfully!');
        setNewPassword('');
        setResetEmail('');
        setTimeout(() => setShowForgot(false), 2000);
      } else {
        if (data.message) {
          setResetErr(data.message);
        } else {
          setResetErr('Email not found or reset failed.');
        }
      }
    } catch (err) {
      setResetErr('Network error. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };


  let errorBox = null;
  if (error) {
    errorBox = (
      <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
        {error}
      </div>
    );
  }

  let resetErrorBox = null;
  if (resetErr) {
    resetErrorBox = (
      <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
        {resetErr}
      </div>
    );
  }

  let resetSuccessBox = null;
  if (resetMsg) {
    resetSuccessBox = (
      <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-xs rounded-xl font-medium">
        {resetMsg}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">

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
              InternNova <span className="block text-xs font-normal text-gray-500">Connect</span>
            </span>
          </div>
        </Link>

        <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
          ← Back to Home
        </Link>
      </header>


      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 grid grid-cols-1 md:grid-cols-2">
          

          <div className="p-8 md:p-12 flex flex-col justify-between">
            <div>

              <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                <Link href="/auth/login" className="flex-1 py-2 text-center text-sm font-semibold bg-white text-blue-600 rounded-lg shadow-sm">
                  Log In
                </Link>
                <Link href="/auth/register" className="flex-1 py-2 text-center text-sm font-semibold text-gray-500 hover:text-gray-900 rounded-lg transition">
                  Register
                </Link>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Log In to Your Account</h2>


              {errorBox}


              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-gray-600 uppercase">Password</label>
                    <button 
                      type="button" 
                      onClick={() => { setShowForgot(true); setResetErr(null); setResetMsg(null); }}
                      className="text-xs font-medium text-blue-600 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••" 
                    className="w-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-md transition mt-2 cursor-pointer"
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
              </form>
            </div>


            <div className="text-center mt-8 text-sm text-gray-500">
              <p>
                Don't have an account?
                <Link href="/auth/register" className="text-blue-600 font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>


          <div className="hidden md:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-blue-400 to-blue-600 text-white text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 relative overflow-hidden">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <h3 className="text-3xl font-extrabold mb-3 leading-tight">
              Welcome Back!<br />Join Our Network!
            </h3>
            <p className="text-blue-100 text-sm max-w-sm leading-relaxed">
              Access exclusive job opportunities, connect with mentors, and manage your career journey seamlessly.
            </p>
          </div>

        </div>
      </div>


      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Reset Password</h3>
              <button 
                type="button" 
                onClick={() => setShowForgot(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-semibold"
              >
                X
              </button>
            </div>

            {resetErrorBox}
            {resetSuccessBox}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowForgot(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={resetLoading}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl shadow-md transition cursor-pointer"
                >
                  {resetLoading ? 'Updating...' : 'Set New Pass'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}