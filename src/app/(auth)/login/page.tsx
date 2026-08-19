'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password
      });

      if (res?.error) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      // NextAuth automatically sets the session cookie.
      // We can redirect to the home page or fetch the session to route correctly.
      // A simple redirect to a routing endpoint or fetching the session here is needed.
      // But NextAuth doesn't return the user object directly from signIn.
      // So we can hit /api/auth/session to get the role, or just router.refresh() and let middleware handle it.
      // Let's manually fetch the session role to route dynamically:
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      
      const role = sessionData?.user?.role;
      setLoading(false);

      if (role === 'VENDOR') return router.push('/seller/dashboard');
      if (role === 'ADMIN') return router.push('/admin');
      
      // Default customer fallback
      router.push('/');
      router.refresh();
      
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 md:grid-cols-2">
        <div className="relative hidden overflow-hidden md:block">
          <div className="absolute inset-0 bg-[url('/login_bg.png')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent mix-blend-multiply" />
          <div className="relative z-10 flex h-full flex-col items-start justify-end p-16 text-white pb-24">
            <h2 className="font-serif text-6xl tracking-tight text-white mb-6">FEMAZON</h2>
            <div className="w-16 h-1 bg-white/50 mb-6"></div>
            <p className="mt-4 max-w-sm text-2xl font-serif text-white/90 leading-snug">
              Premium styles and curated services for modern women.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-xs font-bold uppercase tracking-widest text-primary">FEMAZON</h1>
              <h2 className="mt-2 font-serif text-3xl text-text-main">Welcome Back</h2>
              <p className="mt-2 text-sm text-text-muted">Sign in to continue shopping and booking services.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">{error}</div> : null}

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-text-muted">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-text-muted">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                />
              </label>

              <div className="flex flex-col gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-text-main text-white font-bold text-sm uppercase tracking-widest py-4 rounded-full transition shadow-md hover:bg-primary disabled:opacity-60"
                >
                  {loading ? 'Signing in...' : 'Login'}
                </button>

                <div className="flex justify-between items-center text-sm">
                  <a href="#" className="font-semibold text-primary hover:text-text-main transition">
                    Forgot Password?
                  </a>
                  <p className="text-zinc-500">
                    New here?{' '}
                    <Link href="/register" className="font-bold text-text-main hover:text-primary transition">
                      Create Account
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
