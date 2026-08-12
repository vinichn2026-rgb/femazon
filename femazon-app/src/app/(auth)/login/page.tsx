'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Client-side validation
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || 'Invalid email or password');
        setLoading(false);
        return;
      }

      // Server returns the authenticated user (id, name, email, role)
      const role = data?.user?.role;
      setLoading(false);

      if (role === 'VENDOR') return router.push('/vendor/dashboard');
      if (role === 'ADMIN') return router.push('/admin/dashboard');
      return router.push('/');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 md:grid-cols-2">
        <div className="relative hidden overflow-hidden md:block">
          <div className="absolute inset-0 bg-[url('/branding-fashion.jpg')] bg-cover bg-center opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-600/30 via-transparent to-pink-200/10" />
          <div className="relative z-10 flex h-full flex-col items-start justify-center p-16 text-white">
            <h2 className="text-4xl font-extrabold tracking-tight">FEMAZON</h2>
            <p className="mt-4 max-w-xs text-lg">Premium styles and curated services for modern women.</p>
          </div>
        </div>

        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="mb-6 text-center">
              <h1 className="text-sm font-semibold text-pink-600">FEMAZON</h1>
              <h2 className="mt-3 text-2xl font-bold text-zinc-900">Welcome Back 💕</h2>
              <p className="mt-2 text-sm text-zinc-600">Sign in to continue shopping and booking services.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow">
              {error ? <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

              <label className="block text-sm">
                <span className="mb-2 block font-medium text-zinc-700">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block font-medium text-zinc-700">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </label>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 to-pink-400 px-5 py-3 text-sm font-medium text-white shadow-sm disabled:opacity-60"
                >
                  {loading ? 'Signing in...' : 'Login'}
                </button>

                <a href="#" className="text-sm font-medium text-pink-600 hover:underline">
                  Forgot Password?
                </a>
              </div>
            </form>

            <p className="mt-4 text-center text-sm text-zinc-600">
              Don't have an account?{' '}
              <a href="/register" className="font-medium text-pink-600 hover:underline">
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
