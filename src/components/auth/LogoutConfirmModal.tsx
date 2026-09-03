"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, CheckCircle2, Sparkles, X, ShieldCheck } from 'lucide-react';
import { useFemazonStore } from '@/context/FemazonStoreContext';

export function LogoutConfirmModal() {
  const router = useRouter();
  const { isLogoutConfirmOpen, cancelLogout, setUser, user } = useFemazonStore();
  
  // Stages: 'confirm' | 'loading' | 'success'
  const [stage, setStage] = useState<'confirm' | 'loading' | 'success'>('confirm');

  useEffect(() => {
    if (isLogoutConfirmOpen) {
      setStage('confirm');
    }
  }, [isLogoutConfirmOpen]);

  if (!isLogoutConfirmOpen) return null;

  const handleStartLogout = async () => {
    // 1. Switch to Classy Loader State
    setStage('loading');

    try {
      // Call server logout to clear HttpOnly cookies
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});

      // Clear local storage and user context
      localStorage.removeItem("femazon_user_v1");
      setUser(null);

      // 800ms elegant loader animation
      await new Promise(resolve => setTimeout(resolve, 800));

      // 2. Switch to Classy Success State
      setStage('success');

      // 3. Close modal and redirect to /shop after 1200ms
      setTimeout(() => {
        cancelLogout();
        router.push('/shop');
        router.refresh();
      }, 1200);

    } catch (err) {
      setUser(null);
      cancelLogout();
      router.push('/shop');
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0"
        onClick={() => {
          if (stage === 'confirm') cancelLogout();
        }}
      />
      
      {/* Modal Box */}
      <div className="relative w-full max-w-[380px] bg-white rounded-3xl p-7 sm:p-9 shadow-2xl border border-stone-200/90 text-center animate-in zoom-in-95 duration-200 z-10 font-sans overflow-hidden">
        
        {/* Top Luxury Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4A1513]/20 via-[#4A1513] to-[#4A1513]/20" />

        {/* STAGE 1: CONFIRMATION PROMPT */}
        {stage === 'confirm' && (
          <div className="animate-in fade-in duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={cancelLogout}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition p-1.5 rounded-full hover:bg-stone-100 cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Icon Badge */}
            <div className="w-14 h-14 rounded-full bg-[#FAF7F5] border border-stone-200 text-[#4A1513] flex items-center justify-center mx-auto mb-4 shadow-2xs">
              <LogOut size={22} strokeWidth={1.75} />
            </div>

            {/* Headings */}
            <h3 className="font-serif text-2xl font-normal text-stone-900 leading-tight">
              Sign Out of Femazon?
            </h3>
            <p className="text-[13px] text-stone-500 mt-2 leading-relaxed">
              {user?.name ? `You are signed in as ${user.name}. ` : ''}
              Are you sure you want to end your current shopping session?
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleStartLogout}
                className="w-full py-3.5 rounded-full bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-[0.14em] shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
              >
                <LogOut size={14} />
                <span>Yes, Sign Out</span>
              </button>

              <button
                type="button"
                onClick={cancelLogout}
                className="w-full py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel &amp; Stay Logged In
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: CLASSY SIGNING OUT LOADER */}
        {stage === 'loading' && (
          <div className="py-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center">
            {/* Spinning Luxury Loader */}
            <div className="relative w-16 h-16 mb-5 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-stone-200 border-t-[#4A1513] animate-spin" />
              <div className="w-10 h-10 rounded-full bg-[#FAF7F5] flex items-center justify-center text-[#4A1513]">
                <Sparkles size={18} className="animate-pulse" />
              </div>
            </div>

            <h3 className="font-serif text-2xl font-normal text-stone-900 mb-1">
              Signing you out...
            </h3>
            <p className="text-[13px] text-stone-500 font-normal">
              Securing your Femazon shopping session...
            </p>

            <div className="flex justify-center items-center gap-2 mt-5">
              <div className="w-2 h-2 rounded-full bg-[#4A1513] animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 rounded-full bg-[#4A1513] animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full bg-[#4A1513] animate-bounce" />
            </div>
          </div>
        )}

        {/* STAGE 3: CLASSY LOGGED OUT SUCCESS POPUP */}
        {stage === 'success' && (
          <div className="py-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center">
            {/* Success Glowing Badge */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-5 shadow-xs">
              <CheckCircle2 size={32} />
            </div>

            <h3 className="font-serif text-2xl font-normal text-stone-900 mb-1.5">
              Logged Out Successfully ✓
            </h3>
            <p className="text-[13px] text-stone-500 font-normal leading-relaxed">
              Thank you for visiting Femazon. See you soon ✨
            </p>

            <div className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              <ShieldCheck size={13} className="text-[#4A1513]/70" />
              <span>Redirecting to shop...</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
