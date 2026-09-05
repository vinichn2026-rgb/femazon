'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShoppingBag, 
  Eye, 
  EyeOff, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  Lock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useFemazonStore } from '@/context/FemazonStoreContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, refreshAuth } = useFemazonStore();

  const callbackUrl = searchParams.get('callbackUrl') || searchParams.get('returnUrl') || '/shop';

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // UI & Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Post-Login Success Transition State
  const [isSuccessTransition, setIsSuccessTransition] = useState(false);
  const [authenticatedUserName, setAuthenticatedUserName] = useState('');

  // Register Navigation Transition
  const [isNavigatingToRegister, setIsNavigatingToRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSuccessTransition) return;

    setErrorMessage('');

    // Client-side Validation
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }

      // Extract User Role & Name
      const role = data?.user?.role || 'CUSTOMER';
      const userName = data?.user?.name || cleanEmail.split('@')[0] || 'Member';
      const firstName = userName.split(' ')[0] || 'Member';
      setAuthenticatedUserName(firstName);

      // Determine smart target URL
      let targetUrl = callbackUrl;
      if (role === 'ADMIN' && (callbackUrl === '/shop' || callbackUrl === '/' || callbackUrl === '/admin' || callbackUrl.startsWith('/admin'))) {
        targetUrl = '/admin/dashboard';
      } else if (role === 'VENDOR' && (callbackUrl === '/shop' || callbackUrl === '/' || callbackUrl === '/vendor' || callbackUrl.startsWith('/vendor'))) {
        targetUrl = '/vendor/dashboard';
      }

      // Update Global State
      setUser({
        id: String(data.user.id),
        name: data.user.name || userName,
        firstName,
        lastName: userName.split(' ').slice(1).join(' '),
        email: data.user.email,
        phone: data.user.phone || '+91 98765 43210',
        role: role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      });

      // Show Smooth Transition Screen
      setIsLoading(false);
      setIsSuccessTransition(true);

      // Refresh auth state and hard redirect to targetUrl
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 900);

    } catch (err) {
      setErrorMessage('Something went wrong. Please check your connection and try again.');
      setIsLoading(false);
    }
  };

  const handleCreateAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigatingToRegister(true);
    setTimeout(() => {
      router.push(`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }, 600);
  };

  // 1. Success Transition Screen (Welcome back, Priya ✨)
  if (isSuccessTransition) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-[0_8px_30px_rgba(74,21,19,0.06)] text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FAF7F5] border border-stone-200/80 mb-6 text-[#4A1513]">
          <Sparkles size={28} className="animate-pulse" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 mb-2">
          Welcome back, {authenticatedUserName} ✨
        </h2>
        <p className="text-stone-500 text-[14px] font-normal mb-8">
          Preparing your Femazon experience...
        </p>
        <div className="flex justify-center items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#4A1513] animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#4A1513] animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#4A1513] animate-bounce" />
        </div>
      </div>
    );
  }

  // 2. Navigation to Register Screen Transition
  if (isNavigatingToRegister) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-[0_8px_30px_rgba(74,21,19,0.06)] text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FAF7F5] border border-stone-200/80 mb-6 text-[#4A1513]">
          <Sparkles size={28} className="animate-spin" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 mb-2">
          Let&apos;s get you started ✨
        </h2>
        <p className="text-stone-500 text-[14px] font-normal">
          Creating your Femazon account...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-[0_8px_30px_rgba(74,21,19,0.05)] relative overflow-hidden transition-all duration-300">
      
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4A1513]/20 via-[#4A1513] to-[#4A1513]/20" />

      {/* Card Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FAF7F5] border border-stone-200/60 mb-3 text-[#4A1513]">
          <Lock size={18} strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal tracking-tight">
          Welcome back to Femazon
        </h1>
        <p className="mt-2 text-[13.5px] text-stone-500 font-normal leading-relaxed">
          Sign in to continue your shopping and services journey.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        
        {/* Inline Error Display */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl border border-rose-200 bg-rose-50/70 text-rose-700 text-[12.5px] font-medium animate-in fade-in duration-200">
            <AlertCircle size={15} className="shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Email Address */}
        <div>
          <label 
            htmlFor="email" 
            className="block text-[11px] font-bold uppercase tracking-[0.14em] text-stone-600 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Enter your email address"
              disabled={isLoading}
              className="w-full bg-[#FAF7F5]/60 hover:bg-[#FAF7F5] focus:bg-white rounded-xl border border-stone-200/90 focus:border-[#4A1513] px-4 py-3.5 text-stone-900 text-[14px] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A1513]/10 transition-all font-medium"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label 
              htmlFor="password" 
              className="block text-[11px] font-bold uppercase tracking-[0.14em] text-stone-600"
            >
              Password
            </label>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset link will be sent to your registered email address.');
              }}
              className="text-[12px] font-medium text-[#4A1513] hover:underline underline-offset-4 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <div className="relative flex items-center">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Enter your password"
              disabled={isLoading}
              className="w-full bg-[#FAF7F5]/60 hover:bg-[#FAF7F5] focus:bg-white rounded-xl border border-stone-200/90 focus:border-[#4A1513] pl-4 pr-11 py-3.5 text-stone-900 text-[14px] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A1513]/10 transition-all font-medium"
            />
            
            {/* Show / Hide Password Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 text-stone-400 hover:text-[#4A1513] transition-colors p-1.5 focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* Primary CTA: Login */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#4A1513] hover:bg-[#360D0C] active:scale-[0.99] text-white font-medium text-[13.5px] uppercase tracking-[0.14em] py-3.5 px-6 rounded-full transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer mt-2"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Signing you in...</span>
            </span>
          ) : (
            <span>Login</span>
          )}
        </button>
      </form>

      {/* Create Account Link */}
      <div className="mt-8 text-center pt-6 border-t border-stone-100">
        <p className="text-[13px] text-stone-500">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={handleCreateAccountClick}
            className="font-bold text-[#4A1513] hover:text-[#360D0C] hover:underline underline-offset-4 transition-colors cursor-pointer"
          >
            Create Account
          </button>
        </p>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col justify-between selection:bg-[#4A1513] selection:text-white">
      
      {/* 1. Minimal Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-stone-200/70 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center group select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/femazon-logo.png"
              alt="Femazon Luxury Couture"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Subtle Continue Shopping Option */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[12.5px] sm:text-[13px] font-medium tracking-wide text-stone-600 hover:text-[#4A1513] transition-colors py-1.5 px-3 rounded-full hover:bg-stone-100/70"
          >
            <span className="hidden sm:inline">Continue Shopping</span>
            <span className="sm:hidden">Shop</span>
            <ShoppingBag size={15} strokeWidth={1.75} className="text-[#4A1513]" />
          </Link>
        </div>
      </header>

      {/* 2. Main Centered Login Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 md:py-16">
        <div className="w-full max-w-[440px]">
          <Suspense fallback={
            <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 text-stone-400">
              Loading...
            </div>
          }>
            <LoginForm />
          </Suspense>

          {/* Luxury Security & Trust Footnote */}
          <div className="mt-6 flex items-center justify-center gap-2 text-stone-400 text-[11px] uppercase tracking-wider font-semibold text-center">
            <ShieldCheck size={14} className="text-[#4A1513]/70" />
            <span>256-Bit Encrypted &amp; Secure Authentication</span>
          </div>
        </div>
      </main>

      {/* 3. Minimal Luxury Footer */}
      <footer className="w-full border-t border-stone-200/70 bg-white/50 backdrop-blur-xs py-5 px-4 sm:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11.5px] text-stone-500 font-medium">
          <p>© {new Date().getFullYear()} Femazon. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#4A1513] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#4A1513] transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/contact" className="hover:text-[#4A1513] transition-colors">
              Need Help?
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
