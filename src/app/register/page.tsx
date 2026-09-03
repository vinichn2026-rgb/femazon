'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
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
  CheckCircle2,
  ArrowLeft,
  Smartphone
} from 'lucide-react';
import { useFemazonStore } from '@/context/FemazonStoreContext';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useFemazonStore();

  const callbackUrl = searchParams.get('callbackUrl') || searchParams.get('returnUrl') || '/shop';

  // Step: 'form' | 'transition' | 'otp' | 'success'
  const [step, setStep] = useState<'form' | 'transition' | 'otp' | 'success'>('form');

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Validation & Errors
  const [formError, setFormError] = useState('');
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // OTP Verification States
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSendStatus, setOtpSendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Mask Phone Number (e.g. +91 ******1234)
  const maskPhone = (raw: string) => {
    const cleaned = raw.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `+91 ******${cleaned.slice(-4)}`;
    }
    return `+91 ${cleaned}`;
  };

  // Mask Email (e.g. p***@gmail.com)
  const maskEmail = (raw: string) => {
    const [userPart, domain] = raw.split('@');
    if (!userPart || !domain) return raw;
    const firstChar = userPart.charAt(0);
    return `${firstChar}***@${domain}`;
  };

  // Resend Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCountdown]);

  // Focus first OTP box on entering OTP screen
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  // Handle Form Submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingForm) return;

    setFormError('');

    // Validations
    if (!firstName.trim()) {
      setFormError('Please enter your first name.');
      return;
    }
    if (!lastName.trim()) {
      setFormError('Please enter your last name.');
      return;
    }
    if (!email.trim()) {
      setFormError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password) {
      setFormError('Please enter a password.');
      return;
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please check and try again.');
      return;
    }

    setIsSubmittingForm(true);

    // Show Transition: "Let's get you started ✨"
    setStep('transition');

    try {
      // Send OTP via API
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: `+91${cleanPhone}`,
          email: email.trim(),
          name: `${firstName.trim()} ${lastName.trim()}`
        })
      });

      const data = await res.json().catch(() => ({}));

      // Short delay for fluid transition
      await new Promise(r => setTimeout(r, 700));

      setOtpSendStatus('sent');
      setResendCountdown(30);
      setCanResend(false);
      setOtpValues(['', '', '', '', '', '']);
      setOtpError('');
      setStep('otp');
    } catch (err) {
      setFormError('Unable to send verification code. Please try again.');
      setStep('form');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // OTP Input Keyboard & Navigation
  const handleOtpChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal && value !== '') return;

    const newOtp = [...otpValues];
    newOtp[index] = cleanVal.slice(-1);
    setOtpValues(newOtp);
    if (otpError) setOtpError('');

    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newOtp = [...otpValues];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtpValues(newOtp);
      if (otpError) setOtpError('');
      const target = Math.min(pasted.length, 5);
      otpInputRefs.current[target]?.focus();
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || otpSendStatus === 'sending') return;

    setOtpSendStatus('sending');
    setOtpError('');

    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: `+91${cleanPhone}`,
          email: email.trim(),
          name: `${firstName.trim()} ${lastName.trim()}`
        })
      });

      setOtpSendStatus('sent');
      setCanResend(false);
      setResendCountdown(30);
      setOtpValues(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();

      setTimeout(() => {
        setOtpSendStatus('idle');
      }, 3000);
    } catch (err) {
      setOtpError('Failed to resend code. Please try again.');
      setOtpSendStatus('idle');
    }
  };

  // Handle OTP Verification & Account Creation
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    const fullOtp = otpValues.join('');
    if (fullOtp.length < 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const cleanPhone = phone.replace(/\D/g, '');

      // 1. Verify OTP
      const verifyRes = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: `+91${cleanPhone}`,
          email: email.trim(),
          otp: fullOtp
        })
      });

      const verifyData = await verifyRes.json().catch(() => ({}));

      if (!verifyRes.ok || !verifyData.success) {
        setOtpError(verifyData.message || 'Incorrect OTP. Please try again.');
        setIsVerifyingOtp(false);
        return;
      }

      // 2. Create / Register Account
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim(),
          phone: `+91 ${cleanPhone}`,
          password,
          confirmPassword
        })
      });

      const registerData = await registerRes.json().catch(() => ({}));

      // Update Global State
      setUser({
        id: registerData?.user?.id || `usr_${Date.now()}`,
        name: `${firstName.trim()} ${lastName.trim()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: `+91 ${cleanPhone}`,
        role: 'CUSTOMER',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      });

      setIsVerifyingOtp(false);
      setStep('success');

      // Redirect to previous page or /shop
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 1400);

    } catch (err) {
      setOtpError('Something went wrong during verification. Please try again.');
      setIsVerifyingOtp(false);
    }
  };

  // 1. Transition State: "Let's get you started ✨"
  if (step === 'transition') {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-[0_8px_30px_rgba(74,21,19,0.06)] text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FAF7F5] border border-stone-200/80 mb-6 text-[#4A1513]">
          <Sparkles size={28} className="animate-spin" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 mb-2">
          Let&apos;s get you started ✨
        </h2>
        <p className="text-stone-500 text-[14px] font-normal mb-8">
          Creating your Femazon account...
        </p>
        <div className="flex justify-center items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#4A1513] animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#4A1513] animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#4A1513] animate-bounce" />
        </div>
      </div>
    );
  }

  // 2. Success State: "Account verified successfully ✓"
  if (step === 'success') {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-[0_8px_30px_rgba(74,21,19,0.06)] text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 mb-6 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 mb-2">
          Account verified successfully ✓
        </h2>
        <p className="text-stone-500 text-[14px] font-normal mb-6">
          Setting up your Femazon account...
        </p>
        <div className="flex justify-center items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#4A1513] animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#4A1513] animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#4A1513] animate-bounce" />
        </div>
      </div>
    );
  }

  // 3. OTP Verification Screen
  if (step === 'otp') {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-[0_8px_30px_rgba(74,21,19,0.05)] relative overflow-hidden animate-in fade-in duration-300">
        
        {/* Back to Form Action */}
        <button
          type="button"
          onClick={() => {
            setStep('form');
            setOtpError('');
          }}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-stone-500 hover:text-[#4A1513] transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Edit details</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FAF7F5] border border-stone-200/60 mb-3 text-[#4A1513]">
            <Smartphone size={18} strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal tracking-tight">
            Verify your account
          </h1>
          <p className="mt-2 text-[13px] text-stone-500 font-normal leading-relaxed">
            We&apos;ve sent a verification code to your phone: <strong className="text-stone-800">{maskPhone(phone)}</strong>
          </p>
          <p className="text-[12px] text-stone-400 font-normal mt-0.5">
            We&apos;ve also sent a verification code to <strong className="text-stone-600">{maskEmail(email)}</strong>
          </p>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleVerifyOtp} className="space-y-6" noValidate>
          <div>
            {/* 6-Digit Grid */}
            <div className="flex items-center justify-between gap-2 sm:gap-2.5 my-3" onPaste={handleOtpPaste}>
              {otpValues.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  aria-label={`Digit ${idx + 1} of OTP verification code`}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-serif text-xl sm:text-2xl font-semibold rounded-xl border transition-all duration-200 outline-none select-none ${
                    otpError
                      ? 'border-rose-400 bg-rose-50/20 text-rose-900'
                      : digit
                      ? 'border-[#4A1513] bg-white text-[#4A1513] shadow-xs'
                      : 'border-stone-200 bg-[#FAF7F5]/70 text-stone-900 hover:border-stone-300 focus:bg-white focus:border-[#4A1513] focus:ring-2 focus:ring-[#4A1513]/10'
                  }`}
                />
              ))}
            </div>

            {/* Inline Error */}
            {otpError && (
              <div className="flex items-center justify-center gap-1.5 mt-3 text-rose-600 text-[12.5px] font-medium text-center animate-in fade-in duration-200">
                <AlertCircle size={14} strokeWidth={2} className="shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            {/* Resend Status Notification */}
            {otpSendStatus === 'sent' && (
              <div className="flex items-center justify-center gap-1.5 mt-3 text-emerald-700 text-[12px] font-medium text-center animate-in fade-in duration-200">
                <CheckCircle2 size={13} strokeWidth={2} className="shrink-0" />
                <span>OTP sent successfully ✓</span>
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <button
            type="submit"
            disabled={isVerifyingOtp}
            className="w-full bg-[#4A1513] hover:bg-[#360D0C] active:scale-[0.99] text-white font-medium text-[13.5px] uppercase tracking-[0.14em] py-3.5 px-6 rounded-full transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            {isVerifyingOtp ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Verifying your account...</span>
              </span>
            ) : (
              <span>Verify &amp; Create Account</span>
            )}
          </button>

          {/* Resend OTP Section */}
          <div className="text-center pt-2">
            {canResend ? (
              <p className="text-[13px] text-stone-600">
                Didn&apos;t receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={otpSendStatus === 'sending'}
                  className="font-bold text-[#4A1513] hover:underline underline-offset-4 cursor-pointer transition-colors"
                >
                  {otpSendStatus === 'sending' ? 'Sending new OTP...' : 'Resend OTP'}
                </button>
              </p>
            ) : (
              <p className="text-[12.5px] text-stone-400 font-medium">
                Resend in <span className="font-semibold text-stone-700">{resendCountdown}s</span>
              </p>
            )}
          </div>
        </form>

      </div>
    );
  }

  // 4. Standard Registration Form
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-[0_8px_30px_rgba(74,21,19,0.05)] relative overflow-hidden transition-all duration-300">
      
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4A1513]/20 via-[#4A1513] to-[#4A1513]/20" />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FAF7F5] border border-stone-200/60 mb-3 text-[#4A1513]">
          <Sparkles size={18} strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal tracking-tight">
          Create your Femazon account
        </h1>
        <p className="mt-2 text-[13.5px] text-stone-500 font-normal leading-relaxed">
          Join Femazon and discover fashion, beauty and lifestyle services.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
        
        {/* Error Notification */}
        {formError && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl border border-rose-200 bg-rose-50/70 text-rose-700 text-[12.5px] font-medium animate-in fade-in duration-200">
            <AlertCircle size={15} className="shrink-0 text-rose-500" />
            <span>{formError}</span>
          </div>
        )}

        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label 
              htmlFor="firstName" 
              className="block text-[11px] font-bold uppercase tracking-[0.14em] text-stone-600 mb-1.5"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (formError) setFormError('');
              }}
              placeholder="Enter first name"
              className="w-full bg-[#FAF7F5]/60 hover:bg-[#FAF7F5] focus:bg-white rounded-xl border border-stone-200/90 focus:border-[#4A1513] px-3.5 py-3 text-stone-900 text-[14px] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A1513]/10 transition-all font-medium"
            />
          </div>

          <div>
            <label 
              htmlFor="lastName" 
              className="block text-[11px] font-bold uppercase tracking-[0.14em] text-stone-600 mb-1.5"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (formError) setFormError('');
              }}
              placeholder="Enter last name"
              className="w-full bg-[#FAF7F5]/60 hover:bg-[#FAF7F5] focus:bg-white rounded-xl border border-stone-200/90 focus:border-[#4A1513] px-3.5 py-3 text-stone-900 text-[14px] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A1513]/10 transition-all font-medium"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label 
            htmlFor="register-email" 
            className="block text-[11px] font-bold uppercase tracking-[0.14em] text-stone-600 mb-1.5"
          >
            Email Address
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (formError) setFormError('');
            }}
            placeholder="Enter email address"
            className="w-full bg-[#FAF7F5]/60 hover:bg-[#FAF7F5] focus:bg-white rounded-xl border border-stone-200/90 focus:border-[#4A1513] px-3.5 py-3 text-stone-900 text-[14px] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A1513]/10 transition-all font-medium"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label 
            htmlFor="register-phone" 
            className="block text-[11px] font-bold uppercase tracking-[0.14em] text-stone-600 mb-1.5"
          >
            Phone Number
          </label>
          <div className="flex items-center bg-[#FAF7F5]/60 hover:bg-[#FAF7F5] focus-within:bg-white rounded-xl border border-stone-200/90 focus-within:border-[#4A1513] focus-within:ring-2 focus-within:ring-[#4A1513]/10 transition-all">
            <span className="pl-3.5 pr-2 py-3 text-stone-700 text-[13.5px] font-semibold border-r border-stone-200 shrink-0">
              🇮🇳 +91
            </span>
            <input
              id="register-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                setPhone(val);
                if (formError) setFormError('');
              }}
              placeholder="Enter 10-digit phone number"
              className="w-full bg-transparent px-3 py-3 text-stone-900 text-[14px] placeholder:text-stone-400 focus:outline-none font-medium"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label 
            htmlFor="register-password" 
            className="block text-[11px] font-bold uppercase tracking-[0.14em] text-stone-600 mb-1.5"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (formError) setFormError('');
              }}
              placeholder="Enter password (min. 8 characters)"
              className="w-full bg-[#FAF7F5]/60 hover:bg-[#FAF7F5] focus:bg-white rounded-xl border border-stone-200/90 focus:border-[#4A1513] pl-3.5 pr-11 py-3 text-stone-900 text-[14px] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A1513]/10 transition-all font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 text-stone-400 hover:text-[#4A1513] transition-colors p-1 focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label 
            htmlFor="confirm-password" 
            className="block text-[11px] font-bold uppercase tracking-[0.14em] text-stone-600 mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (formError) setFormError('');
              }}
              placeholder="Confirm password"
              className="w-full bg-[#FAF7F5]/60 hover:bg-[#FAF7F5] focus:bg-white rounded-xl border border-stone-200/90 focus:border-[#4A1513] pl-3.5 pr-11 py-3 text-stone-900 text-[14px] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A1513]/10 transition-all font-medium"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              className="absolute right-3 text-stone-400 hover:text-[#4A1513] transition-colors p-1 focus:outline-none cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Primary CTA */}
        <button
          type="submit"
          disabled={isSubmittingForm}
          className="w-full bg-[#4A1513] hover:bg-[#360D0C] active:scale-[0.99] text-white font-medium text-[13.5px] uppercase tracking-[0.14em] py-3.5 px-6 rounded-full transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer !mt-6"
        >
          {isSubmittingForm ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Creating your account...</span>
            </span>
          ) : (
            <span>Create Account</span>
          )}
        </button>

      </form>

      {/* Login Link */}
      <div className="mt-8 text-center pt-5 border-t border-stone-100">
        <p className="text-[13px] text-stone-500">
          Already have an account?{' '}
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-bold text-[#4A1513] hover:text-[#360D0C] hover:underline underline-offset-4 transition-colors"
          >
            Login
          </Link>
        </p>
      </div>

    </div>
  );
}

export default function RegisterPage() {
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

      {/* 2. Main Centered Register Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 md:py-16">
        <div className="w-full max-w-[480px]">
          <Suspense fallback={
            <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 text-stone-400">
              Loading...
            </div>
          }>
            <RegisterForm />
          </Suspense>

          {/* Luxury Security Footnote */}
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
