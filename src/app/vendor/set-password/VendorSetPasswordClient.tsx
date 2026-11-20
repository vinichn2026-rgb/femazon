"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Store,
  Sparkles,
} from "lucide-react";
import { VendorPortalHeader } from "@/components/vendor/VendorPortalHeader";

interface VendorSetPasswordClientProps {
  token: string;
  shopName: string;
  vendorId: number;
  email: string;
}

export default function VendorSetPasswordClient({
  token,
  shopName,
  vendorId,
  email,
}: VendorSetPasswordClientProps) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Password rules validation
  const hasMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isFormValid = hasMinLength && hasLetter && hasNumber && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSuccess) return;

    setErrorMessage("");

    if (!hasMinLength) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    if (!hasLetter || !hasNumber) {
      setErrorMessage("Password must contain at least one letter and one number.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/vendor/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to set password. Please try again.");
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setErrorMessage("Network error occurred. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col justify-between selection:bg-[#4A1513] selection:text-white font-sans">
      <VendorPortalHeader subTitle="Password Activation" storeHref="/shop" />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[500px]">
          {isSuccess ? (
            /* Success Card */
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-[0_12px_40px_rgba(74,21,19,0.06)] text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 mb-6 text-emerald-600 shadow-2xs">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 mb-2 font-normal">
                Password Created Successfully!
              </h2>
              <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                Your vendor account for <strong className="text-stone-900 font-semibold">{shopName}</strong> is now fully active.
              </p>

              <div className="bg-[#FAF7F5] border border-stone-200 rounded-2xl p-4 mb-6 text-left text-xs text-stone-700 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Login ID:</span>
                  <span className="font-semibold text-stone-900">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Registration ID:</span>
                  <span className="font-mono font-semibold text-[#4A1513]">#{vendorId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Status:</span>
                  <span className="font-semibold text-emerald-700">Active &amp; Ready ✓</span>
                </div>
              </div>

              <Link
                href="/vendor/login"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#4A1513] hover:bg-[#380E0C] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <span>Proceed to Vendor Login</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            /* Set Password Form Card */
            <div className="bg-white rounded-3xl p-7 sm:p-9 border border-stone-200/90 shadow-[0_12px_40px_rgba(74,21,19,0.06)]">
              {/* Top Banner Tag */}
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-4">
                <ShieldCheck size={13} />
                <span>Account Approved • Set Your Password</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal tracking-tight mb-2">
                Create Your Password
              </h1>
              <p className="text-stone-500 text-xs sm:text-[13px] leading-relaxed mb-5">
                Welcome to Femazon, <strong className="text-stone-800 font-semibold">{shopName}</strong>. Please set a secure password to activate your Vendor Portal login.
              </p>

              {/* Vendor Verified Summary Card */}
              <div className="bg-[#FAF7F5] border border-stone-200/80 rounded-2xl p-4 mb-6 text-xs text-stone-700 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Vendor / Shop Name:</span>
                  <span className="font-semibold text-stone-900">{shopName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Registration ID:</span>
                  <span className="font-mono font-semibold text-[#4A1513]">#{vendorId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Login ID:</span>
                  <span className="font-semibold text-stone-900">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Account Status:</span>
                  <span className="font-semibold text-emerald-700">Approved ✓</span>
                </div>
              </div>

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200/90 flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in duration-200">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-600" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock size={15} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      required
                      autoComplete="new-password"
                      className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white border border-stone-200 focus:border-[#4A1513] focus:ring-1 focus:ring-[#4A1513] rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 transition outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock size={15} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type your password"
                      required
                      autoComplete="new-password"
                      className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white border border-stone-200 focus:border-[#4A1513] focus:ring-1 focus:ring-[#4A1513] rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 transition outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Guidelines */}
                <div className="bg-stone-50 border border-stone-200/70 rounded-xl p-3 text-[11px] space-y-1">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-700 font-semibold" : "text-stone-500"}`}>
                    <span>{hasMinLength ? "✓" : "•"}</span>
                    <span>At least 8 characters long</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasLetter ? "text-emerald-700 font-semibold" : "text-stone-500"}`}>
                    <span>{hasLetter ? "✓" : "•"}</span>
                    <span>Contains at least one letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-700 font-semibold" : "text-stone-500"}`}>
                    <span>{hasNumber ? "✓" : "•"}</span>
                    <span>Contains at least one number</span>
                  </div>
                  {confirmPassword.length > 0 && (
                    <div className={`flex items-center gap-1.5 ${passwordsMatch ? "text-emerald-700 font-semibold" : "text-rose-600 font-medium"}`}>
                      <span>{passwordsMatch ? "✓" : "✗"}</span>
                      <span>Passwords match</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className={`w-full py-3.5 px-6 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    isFormValid && !isLoading
                      ? "bg-[#4A1513] hover:bg-[#380E0C] text-white active:scale-98"
                      : "bg-stone-300 text-stone-500 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving Password...
                    </span>
                  ) : (
                    <>
                      <span>Set Password &amp; Activate Login</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 sm:p-6 text-center border-t border-stone-200/60 bg-white">
        <p className="text-xs text-stone-500">
          Already set your password?{" "}
          <Link href="/vendor/login" className="text-[#4A1513] font-bold hover:underline">
            Go to Vendor Login
          </Link>
        </p>
      </footer>
    </div>
  );
}
