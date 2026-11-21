"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Calendar,
  KeyRound,
  ArrowLeft,
  Store,
  Sparkles,
  Lock,
  LogOut,
  CheckCircle2
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

export function AdminProfileClient({ user }: { user: any }) {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleAdminLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
      sessionStorage.clear();
      router.push("/admin");
      router.refresh();
    } catch {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col font-sans text-stone-900 selection:bg-[#4A1513] selection:text-white">
      {/* Top Admin Header */}
      <AdminNavbar
        adminName={user?.name || "Super Admin"}
        adminEmail={user?.email || "admin@femazon.com"}
      />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#4A1513] transition"
          >
            <ArrowLeft size={14} />
            <span>Back to Admin Dashboard</span>
          </Link>
        </div>

        {/* Profile Hero Header Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#4A1513] text-white flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-sm shrink-0">
                A
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                    {user?.name || "Femazon Administrator"}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <CheckCircle2 size={11} /> Verified Super Admin
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Primary Administrative Account · Platform Governance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Account Information */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-stone-100">
              <div className="w-8 h-8 rounded-lg bg-[#4A1513]/10 text-[#4A1513] flex items-center justify-center">
                <User size={16} />
              </div>
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Account Details
              </h2>
            </div>

            <dl className="space-y-4 text-xs">
              <div>
                <dt className="text-stone-400 font-medium">Administrator Name</dt>
                <dd className="font-semibold text-stone-900 text-sm mt-0.5">
                  {user?.name || "Femazon Administrator"}
                </dd>
              </div>

              <div>
                <dt className="text-stone-400 font-medium">Official Admin Email</dt>
                <dd className="font-semibold text-stone-900 text-sm mt-0.5 flex items-center gap-1.5">
                  <Mail size={13} className="text-stone-400" />
                  <span>{user?.email || "admin@femazon.com"}</span>
                </dd>
              </div>

              <div>
                <dt className="text-stone-400 font-medium">Admin ID</dt>
                <dd className="font-semibold text-stone-900 text-sm mt-0.5">
                  #{user?.id || 1}
                </dd>
              </div>

              <div>
                <dt className="text-stone-400 font-medium">Assigned Role</dt>
                <dd className="font-semibold text-[#4A1513] text-sm mt-0.5 flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>ADMIN (Full Governance Privileges)</span>
                </dd>
              </div>

              {user?.phone && (
                <div>
                  <dt className="text-stone-400 font-medium">Contact Phone</dt>
                  <dd className="font-semibold text-stone-900 text-sm mt-0.5 flex items-center gap-1.5">
                    <Phone size={13} className="text-stone-400" />
                    <span>{user.phone}</span>
                  </dd>
                </div>
              )}

              {user?.createdAt && (
                <div>
                  <dt className="text-stone-400 font-medium">Account Established</dt>
                  <dd className="font-semibold text-stone-900 text-sm mt-0.5 flex items-center gap-1.5">
                    <Calendar size={13} className="text-stone-400" />
                    <span>{new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Card 2: Security & Privileges */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-stone-100">
                <div className="w-8 h-8 rounded-lg bg-[#4A1513]/10 text-[#4A1513] flex items-center justify-center">
                  <KeyRound size={16} />
                </div>
                <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Governance & Privileges
                </h2>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start gap-3">
                  <Store size={16} className="text-[#4A1513] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-stone-900">Women&apos;s Gallery Product Marketplace</h3>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Vendor approvals, brand onboarding, product moderation, and order lifecycle oversight.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start gap-3">
                  <Sparkles size={16} className="text-[#4A1513] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-stone-900">Personal Styling Services Division</h3>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Stylist verification, package management, service booking control, and portfolio review.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start gap-3">
                  <Lock size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-stone-900">Active Security Protocol</h3>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Protected with encrypted dual session tokens (<code>femazon_session</code>), HMAC signatures, and strict role guards.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Security Level: Tier 1 (Master)</span>
              <span className="text-emerald-700 font-semibold">● Session Active</span>
            </div>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F5] border border-stone-200 text-[#4A1513] flex items-center justify-center mx-auto mb-4 shadow-2xs">
              <ShieldCheck size={24} strokeWidth={1.75} />
            </div>

            <h3 className="font-serif text-2xl font-normal text-stone-900">
              Sign Out of Admin Portal?
            </h3>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Your administrative session and control privileges will be securely closed.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleAdminLogout}
                disabled={isLoggingOut}
                className="w-full py-3.5 rounded-full bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <Sparkles size={14} className="animate-spin" />
                    <span>Signing out...</span>
                  </>
                ) : (
                  <>
                    <LogOut size={14} />
                    <span>Yes, Sign Out</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
