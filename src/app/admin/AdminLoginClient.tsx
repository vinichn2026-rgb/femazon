"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShieldAlert, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";

export default function AdminLoginClient() {
  const router = useRouter();

  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessTransition, setIsSuccessTransition] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSuccessTransition) return;

    setErrorMessage("");

    const cleanInput = emailOrId.trim();
    if (!cleanInput) {
      setErrorMessage("Please enter your Admin Email or ID.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrId: cleanInput,
          password
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Invalid Admin ID or Password");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setIsSuccessTransition(true);

      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 700);

    } catch (err) {
      setErrorMessage("Connection error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col justify-between selection:bg-[#4A1513] selection:text-white font-sans">
      
      {/* Top Header */}
      <header className="w-full bg-white border-b border-stone-200/80 py-4 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <div className="h-5 w-[1px] bg-stone-300 hidden sm:block" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4A1513] bg-[#FAF7F5] px-2.5 py-1 rounded-full border border-stone-200 hidden sm:inline-block">
              Admin Portal
            </span>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#4A1513] transition"
          >
            <ChevronLeft size={14} />
            <span>Return to Store</span>
          </Link>
        </div>
      </header>

      {/* Main Login Box */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[440px]">
          
          {isSuccessTransition ? (
            <div className="bg-[#4A1513] rounded-3xl p-10 sm:p-14 text-center text-white shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200">
              <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-white/20 border-t-white animate-spin" />
                <div className="absolute w-12 h-12 rounded-full border-2 border-white/10 border-b-white animate-spin [animation-direction:reverse] [animation-duration:1.2s]" />
              </div>
              <h2 className="font-serif text-3xl text-white mb-2 font-light tracking-[0.25em]">
                FEMAZON
              </h2>
              <p className="text-xs uppercase tracking-[0.35em] text-white/80 font-medium">
                ADMIN CONSOLE
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-7 sm:p-10 border border-stone-200/90 shadow-[0_12px_40px_rgba(74,21,19,0.06)] relative overflow-hidden transition-all duration-300">
              
              {/* Top Luxury Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4A1513]/30 via-[#4A1513] to-[#4A1513]/30" />

              {/* Portal Header */}
              <div className="text-center mb-8 pt-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FAF7F5] border border-stone-200 text-[#4A1513] mb-4 shadow-2xs">
                  <ShieldAlert size={22} strokeWidth={1.75} />
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal tracking-tight">
                  Admin Portal Login
                </h1>
                <p className="mt-2 text-[13.5px] text-stone-500 leading-relaxed max-w-sm mx-auto">
                  Sign in with authorized administrator credentials to manage platform operations.
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="flex items-center gap-2.5 p-3.5 mb-6 rounded-xl border border-rose-200 bg-rose-50/80 text-rose-700 text-[13px] font-medium animate-in fade-in duration-200">
                  <AlertCircle size={17} className="shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                
                {/* Admin ID / Email Input */}
                <div>
                  <label 
                    htmlFor="admin-email" 
                    className="block text-[11px] font-bold uppercase tracking-[0.14em] text-stone-600 mb-2"
                  >
                    Admin Email or ID
                  </label>
                  <div className="relative">
                    <input
                      id="admin-email"
                      type="text"
                      autoComplete="username"
                      value={emailOrId}
                      onChange={(e) => {
                        setEmailOrId(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      placeholder="admin@femazon.com"
                      disabled={isLoading}
                      className="w-full bg-[#FAF7F5]/70 hover:bg-[#FAF7F5] focus:bg-white rounded-xl border border-stone-200/90 focus:border-[#4A1513] px-4 py-3.5 text-stone-900 text-[14px] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A1513]/10 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label 
                      htmlFor="admin-password" 
                      className="block text-[11px] font-bold uppercase tracking-[0.14em] text-stone-600"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      placeholder="Enter administrator password"
                      disabled={isLoading}
                      className="w-full bg-[#FAF7F5]/70 hover:bg-[#FAF7F5] focus:bg-white rounded-xl border border-stone-200/90 focus:border-[#4A1513] pl-4 pr-12 py-3.5 text-stone-900 text-[14px] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A1513]/10 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-stone-400 hover:text-stone-700 p-1 transition cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={isLoading || isSuccessTransition}
                  className="w-full mt-2 py-4 px-6 rounded-xl bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-[0.16em] shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading || isSuccessTransition ? (
                    <>
                      <Loader2 size={18} className="animate-spin text-white" />
                      <span>Entering Console...</span>
                    </>
                  ) : (
                    <>
                      <span>Login to Admin Dashboard</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

              </form>

            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-5 text-xs text-stone-400">
        &copy; {new Date().getFullYear()} Femazon Luxury Couture. Restricted Admin Access.
      </footer>

    </div>
  );
}
