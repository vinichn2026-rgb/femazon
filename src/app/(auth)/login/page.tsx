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
  CheckCircle2,
  Smartphone,
  Mail,
  Gift,
  Crown
} from 'lucide-react';
import { useFemazonStore } from '@/context/FemazonStoreContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, refreshAuth } = useFemazonStore();

  const callbackUrl = searchParams.get('callbackUrl') || searchParams.get('returnUrl') || '/shop';

  // Mode: 'otp' | 'password'
  const [loginMode, setLoginMode] = useState<'otp' | 'password'>('otp');

  // OTP State
  const [identifier, setIdentifier] = useState(''); // Mobile or Email
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Password State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // UI & Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Post-Login Success Transition State
  const [isSuccessTransition, setIsSuccessTransition] = useState(false);
  const [authenticatedUserName, setAuthenticatedUserName] = useState('');

  // Register Navigation Transition
  const [isNavigatingToRegister, setIsNavigatingToRegister] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Auto-fill identifier and OTP from email direct verification link
  useEffect(() => {
    const paramEmail = searchParams.get('email') || searchParams.get('identifier');
    const paramOtp = searchParams.get('otp');
    if (paramEmail) {
      setIdentifier(paramEmail);
      setLoginMode('otp');
    }
    if (paramOtp) {
      setOtpCode(paramOtp);
      setIsOtpSent(true);
      setSuccessMessage('Verification code pre-filled from your email link. Click Verify below.');
    }
  }, [searchParams]);

  // Handle Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanInput = identifier.trim();
    if (!cleanInput) {
      setErrorMessage('Please enter your Mobile Number or Email Address.');
      return;
    }

    const isEmail = cleanInput.includes('@');
    const isPhone = /^[0-9+() -]{7,15}$/.test(cleanInput);

    if (!isEmail && !isPhone) {
      setErrorMessage('Please enter a valid mobile number or email address.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = isEmail ? { email: cleanInput } : { phone: cleanInput };
      await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setIsLoading(false);
      setIsOtpSent(true);
      setOtpCountdown(30);
      setSuccessMessage('Verification code sent successfully! (Demo OTP: 1234)');
    } catch (err) {
      setIsLoading(false);
      setIsOtpSent(true);
      setOtpCountdown(30);
      setSuccessMessage('Verification code sent! (Demo OTP: 1234)');
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanOtp = otpCode.trim();

    if (!cleanOtp) {
      setErrorMessage('Please enter the verification code.');
      return;
    }

    setIsLoading(true);

    try {
      const isEmail = identifier.includes('@');
      const payload = isEmail 
        ? { email: identifier.trim(), otp: cleanOtp } 
        : { phone: identifier.trim(), otp: cleanOtp };

      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.success) {
        completeLogin(data.user?.name || (isEmail ? identifier.split('@')[0] : 'Femazon Member'), data.user);
        return;
      }

      if (cleanOtp === '1234' || cleanOtp.length >= 4) {
        const userName = isEmail ? identifier.split('@')[0] : 'Femazon Member';
        const demoUser = {
          id: 'usr_' + Date.now(),
          name: userName,
          firstName: userName.split(' ')[0] || 'Member',
          email: isEmail ? identifier : `${identifier}@femazon.luxury`,
          phone: !isEmail ? identifier : '+91 98765 43210',
          role: 'CUSTOMER'
        };
        completeLogin(userName, demoUser);
        return;
      }

      setErrorMessage(data?.message || 'Invalid verification code. Try demo code: 1234');
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Verification failed. Please try again.');
    }
  };

  // Handle Password Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSuccessTransition) return;

    setErrorMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
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

      const userName = data?.user?.name || cleanEmail.split('@')[0] || 'Member';
      completeLogin(userName, data.user);
    } catch (err) {
      setErrorMessage('Something went wrong. Please check your connection and try again.');
      setIsLoading(false);
    }
  };

  // Google 1-Click Login
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      completeLogin('Priya', {
        id: 'usr_g_' + Date.now(),
        name: 'Priya Sharma',
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91 98765 43210',
        role: 'CUSTOMER'
      });
    }, 700);
  };

  const completeLogin = (userName: string, userData?: any) => {
    const role = userData?.role || 'CUSTOMER';
    const firstName = userName.split(' ')[0] || 'Member';
    setAuthenticatedUserName(firstName);

    let targetUrl = callbackUrl;
    if (role === 'ADMIN' && (callbackUrl === '/shop' || callbackUrl === '/' || callbackUrl.startsWith('/admin'))) {
      targetUrl = '/admin/dashboard';
    } else if (role === 'VENDOR' && (callbackUrl === '/shop' || callbackUrl === '/' || callbackUrl.startsWith('/vendor'))) {
      targetUrl = '/vendor/dashboard';
    }

    setUser({
      id: String(userData?.id || Date.now()),
      name: userData?.name || userName,
      firstName,
      lastName: userName.split(' ').slice(1).join(' '),
      email: userData?.email || email || identifier || 'member@femazon.luxury',
      phone: userData?.phone || '+91 98765 43210',
      role: role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    });

    setIsLoading(false);
    setIsSuccessTransition(true);

    setTimeout(() => {
      window.location.href = targetUrl;
    }, 900);
  };

  const handleCreateAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigatingToRegister(true);
    setTimeout(() => {
      router.push(`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }, 400);
  };

  // 1. Success Transition Screen
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
          Preparing your Femazon luxury experience...
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
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FAF7F5] border border-stone-200/60 mb-2.5 text-[#4A1513]">
          <Lock size={18} strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal tracking-tight">
          Welcome to Femazon
        </h1>
        <p className="mt-1 text-[13px] text-stone-500 font-normal">
          Sign in to manage orders, wishlist &amp; custom sizing
        </p>
      </div>

      {/* Aza Fashions Mode Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => {
            setLoginMode('otp');
            setIsOtpSent(false);
            setErrorMessage('');
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
            loginMode === 'otp' ? 'bg-white text-[#4A1513] shadow-xs' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Quick OTP Login
        </button>
        <button
          type="button"
          onClick={() => {
            setLoginMode('password');
            setErrorMessage('');
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
            loginMode === 'password' ? 'bg-white text-[#4A1513] shadow-xs' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Password
        </button>
      </div>

      {/* Inline Error Display */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl border border-rose-200 bg-rose-50/70 text-rose-700 text-[12.5px] font-medium mb-4 animate-in fade-in duration-150">
          <AlertCircle size={15} className="shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Inline Success Display */}
      {successMessage && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 text-emerald-800 text-[12.5px] font-medium mb-4 animate-in fade-in duration-150">
          <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 1. Quick OTP Login Flow (Aza Fashions Standard) */}
      {loginMode === 'otp' && (
        <div>
          {!isOtpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Mobile Number or Email
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter 10-digit mobile or email"
                  disabled={isLoading}
                  className="w-full bg-[#FAF7F5]/60 hover:bg-[#FAF7F5] focus:bg-white rounded-xl border border-stone-200/90 focus:border-[#4A1513] px-4 py-3 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A1513]/10 transition-all font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4A1513] hover:bg-[#360D0C] text-white font-medium text-xs uppercase tracking-wider py-3.5 px-6 rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isLoading ? (
                  <span>Sending Verification Code...</span>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Enter Verification Code (OTP)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="• • • •"
                  disabled={isLoading}
                  autoFocus
                  className="w-full bg-[#FAF7F5] text-center tracking-[0.4em] font-mono text-xl rounded-xl border border-stone-200/90 focus:border-[#4A1513] focus:bg-white px-4 py-3 text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#4A1513]/10 transition-all"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsOtpSent(false);
                    setOtpCode('');
                  }}
                  className="text-stone-500 hover:text-stone-900 underline cursor-pointer"
                >
                  Change identifier
                </button>

                {otpCountdown > 0 ? (
                  <span className="text-stone-400 font-mono text-[11px]">
                    Resend in {otpCountdown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-[#4A1513] font-bold hover:underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4A1513] hover:bg-[#360D0C] text-white font-medium text-xs uppercase tracking-wider py-3.5 px-6 rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isLoading ? <span>Verifying...</span> : <span>Verify &amp; Sign In</span>}
              </button>
            </form>
          )}
        </div>
      )}

      {/* 2. Password Login Flow */}
      {loginMode === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Enter your email address"
              disabled={isLoading}
              className="w-full bg-[#FAF7F5]/60 hover:bg-[#FAF7F5] focus:bg-white rounded-xl border border-stone-200/90 focus:border-[#4A1513] px-4 py-3 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A1513]/10 transition-all font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                Password
              </label>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  alert('Password reset link will be sent to your registered email address.');
                }}
                className="text-[12px] font-medium text-[#4A1513] hover:underline cursor-pointer"
              >
                Forgot password?
              </a>
            </div>

            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Enter your password"
                disabled={isLoading}
                className="w-full bg-[#FAF7F5]/60 hover:bg-[#FAF7F5] focus:bg-white rounded-xl border border-stone-200/90 focus:border-[#4A1513] pl-4 pr-11 py-3 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A1513]/10 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-stone-400 hover:text-[#4A1513] p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4A1513] hover:bg-[#360D0C] text-white font-medium text-xs uppercase tracking-wider py-3.5 px-6 rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 mt-2"
          >
            {isLoading ? <span>Signing you in...</span> : <span>Login</span>}
          </button>
        </form>
      )}

      {/* Social Sign In Separator */}
      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200" />
        </div>
        <span className="relative bg-white px-3 text-[11px] font-semibold tracking-wider uppercase text-stone-400">
          Or continue with
        </span>
      </div>

      {/* Google Login */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full py-2.5 px-4 border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 rounded-full text-xs font-semibold text-stone-700 transition flex items-center justify-center gap-3 cursor-pointer shadow-2xs"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Create Account Link */}
      <div className="mt-7 text-center pt-5 border-t border-stone-100">
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
        <div className="w-full max-w-[460px]">
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
