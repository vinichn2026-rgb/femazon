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
    <main className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] bg-white p-8 shadow-sm border border-accent/20">
          <div className="text-center mb-8">
            <h1 className="text-xs font-bold uppercase tracking-widest text-primary">FEMAZON</h1>
            <h2 className="mt-2 font-serif text-3xl text-text-main">Create Account</h2>
            <p className="mt-2 text-sm text-text-muted">Join Femazon to shop premium styles and book services.</p>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">{error}</div>
          ) : null}

          {success ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-600">{success}</div>
          ) : null}

          <div className="grid gap-4">
            <label className="flex flex-col text-sm">
              <span className="mb-2 text-xs font-bold uppercase tracking-widest text-text-muted">Full Name</span>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                placeholder="Your full name"
                required
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-2 text-xs font-bold uppercase tracking-widest text-text-muted">Email</span>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-2 text-xs font-bold uppercase tracking-widest text-text-muted">Phone</span>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                placeholder="10-digit mobile number"
                required
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-2 text-xs font-bold uppercase tracking-widest text-text-muted">Password</span>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                placeholder="Create a strong password"
                required
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-2 text-xs font-bold uppercase tracking-widest text-text-muted">Confirm Password</span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                placeholder="Repeat your password"
                required
              />
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-text-main text-white font-bold text-sm uppercase tracking-widest py-4 rounded-full transition shadow-md hover:bg-primary disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>

          <p className="text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <a href="/login" className="font-bold text-text-main hover:text-primary transition">
              Login
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
