
'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { login, ApiError } from '@/lib/auth/api';
import { storeSession, dashboardPathForRole } from '@/lib/auth/session';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const justRegistered = useSearchParams().get('registered') === '1';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const session = await login({ email, password });
      storeSession(session);
      router.push(dashboardPathForRole(session.user.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <header className="w-full bg-white border-b border-gray-100 py-4 px-8 flex justify-between items-center">

        {/* Logo with button */}
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

      {/* Main Container */}
      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 grid grid-cols-1 md:grid-cols-2">

          {/* Left */}
          <div className="p-8 md:p-12 flex flex-col justify-between">
            <div>
              {/* Tab Switcher */}
              <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                <Link href="/auth/login" className="flex-1 py-2 text-center text-sm font-semibold bg-white text-blue-600 rounded-lg shadow-sm">
                  Log In
                </Link>
                <Link href="/auth/register" className="flex-1 py-2 text-center text-sm font-semibold text-gray-500 hover:text-gray-900 rounded-lg transition">
                  Register
                </Link>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Log In to Your Account</h2>

              {justRegistered && !error && (
                <div className="mb-4 px-4 py-3 text-sm bg-green-50 border border-green-200 text-green-700 rounded-xl">
                  Account created! Log in with your new credentials.
                </div>
              )}

              {error && (
                <div className="mb-4 px-4 py-3 text-sm bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-gray-600 uppercase">Password</label>
                    <a href="#" className="text-xs font-medium text-blue-600 hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Logging In…' : 'Log In'}
                </button>
              </form>
            </div>

            {/* Bottom switch link */}
            <div className="text-center mt-8 text-sm text-gray-500">
              <p>
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="text-blue-600 font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side: Brand Banner */}
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

      {/* Footer */}
      <footer className="w-full py-4 px-8 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
        <p>© 2026 UniCareer Connect</p>
        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
      </footer>
    </div>
  );
}