'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function validate() {
    if (!name.trim()) return 'Full name is required';
    if (!email.trim()) return 'Email is required';
    // simple email check
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) return 'Please enter a valid email address';
    if (!phone.trim()) return 'Phone is required';
    const phoneRe = /^\d{10}$/;
    if (!phoneRe.test(phone)) return 'Please enter a valid 10-digit phone number';
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const clientValidation = validate();
    if (clientValidation) {
      setError(clientValidation);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, confirmPassword }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || 'Registration failed');
        setLoading(false);
        return;
      }

      setSuccess(data?.message || 'Account created successfully');
      setLoading(false);
      // brief delay to show success then redirect
      setTimeout(() => router.push('/login'), 1200);
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-8 shadow-sm">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-pink-600">Create account</p>
            <h1 className="mt-3 text-2xl font-semibold text-zinc-900">Join Femazon</h1>
            <p className="mt-2 text-sm text-zinc-600">Create an account to shop premium styles and book services.</p>
          </div>

          {error ? (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          ) : null}

          {success ? (
            <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{success}</div>
          ) : null}

          <div className="grid gap-4">
            <label className="flex flex-col text-sm">
              <span className="mb-2 font-medium text-zinc-700">Full Name</span>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                placeholder="Your full name"
                required
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-2 font-medium text-zinc-700">Email</span>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-2 font-medium text-zinc-700">Phone</span>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                placeholder="10-digit mobile number"
                required
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-2 font-medium text-zinc-700">Password</span>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                placeholder="Create a strong password"
                required
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-2 font-medium text-zinc-700">Confirm Password</span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                placeholder="Repeat your password"
                required
              />
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-pink-500 to-pink-400 px-5 py-3 text-sm font-medium text-white shadow-sm disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>

          <p className="text-center text-sm text-zinc-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-pink-600 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
