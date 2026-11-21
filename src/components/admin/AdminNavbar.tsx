"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ExternalLink,
  LogOut,
  Sparkles,
  Menu,
  X,
  Package,
  ShoppingCart,
  Store,
  Grid,
  Truck,
  Users,
  CalendarDays,
  Loader2,
  User,
  ChevronDown,
} from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";

export interface AdminNavbarProps {
  currentSection?: string;
  adminName?: string;
  adminEmail?: string;
  stats?: {
    productsCount?: number;
    ordersCount?: number;
    vendorsCount?: number;
    usersCount?: number;
    bookingsCount?: number;
  };
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  onToggleMobileSidebar?: () => void;
  navMenuItems?: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    href?: string;
  }>;
}

export function AdminNavbar({
  currentSection,
  adminName = "Super Admin",
  adminEmail = "admin@femazon.com",
  stats,
  activeTab,
  onTabChange,
  onToggleMobileSidebar,
  navMenuItems = []
}: AdminNavbarProps) {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [navigatingHref, setNavigatingHref] = useState<string | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isProfileMenuOpen]);

  const handleAdminLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
      try {
        sessionStorage.clear();
      } catch (e) {}
      router.push("/admin");
      router.refresh();
    } catch {
      router.push("/admin");
    }
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-2xs px-4 sm:px-8 py-3.5 flex items-center justify-between">
        
        {/* Left: Mobile Toggle + Brand Logo (Clean & Minimal) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => {
              if (onToggleMobileSidebar) {
                onToggleMobileSidebar();
              } else {
                setIsMobileDrawerOpen(true);
              }
            }}
            className="md:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu size={22} />
          </button>

          {/* Luxury Brand Logo */}
          <BrandLogo />
        </div>

        {/* Right: Live Store + Admin Profile/Avatar Menu with Logout & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Live Storefront Link */}
          <Link
            href="/shop"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#4A1513] transition py-2 px-3 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200"
          >
            <span>Live Store</span>
            <ExternalLink size={13} />
          </Link>

          {/* Admin Profile & Avatar Menu Button with Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-full py-1.5 pl-2 pr-3 transition cursor-pointer select-none group shadow-2xs"
              aria-label="Open Admin Menu"
              aria-expanded={isProfileMenuOpen}
            >
              <div className="w-7 h-7 rounded-full bg-[#4A1513] text-white flex items-center justify-center text-xs font-bold shadow-2xs group-hover:scale-105 transition-transform">
                A
              </div>
              <span className="text-xs font-bold text-stone-800 leading-none hidden sm:inline">
                Admin
              </span>
              <ChevronDown
                size={12}
                className={`text-stone-400 transition-transform duration-200 ${
                  isProfileMenuOpen ? "rotate-180 text-[#4A1513]" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-stone-200 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Admin Details Header */}
                <div className="px-4 py-3 border-b border-stone-100 bg-[#FAF7F5] rounded-t-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#4A1513] text-white flex items-center justify-center text-xs font-bold shadow-2xs shrink-0">
                      A
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-stone-900 truncate">{adminName}</p>
                      <p className="text-[11px] text-stone-500 truncate">{adminEmail}</p>
                    </div>
                  </div>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[9.5px] font-bold tracking-wider uppercase border border-emerald-200/60">
                    <ShieldCheck size={10} /> Super Admin
                  </span>
                </div>

                {/* Menu Options: Logout on top, Profile directly below Logout */}
                <div className="p-1.5 space-y-1">
                  {/* Option 1: Admin Logout */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-100 transition shrink-0">
                      <LogOut size={14} />
                    </div>
                    <div>
                      <span className="font-bold block">Admin Logout</span>
                      <span className="text-[10px] text-rose-400 font-normal">Sign out of session</span>
                    </div>
                  </button>

                  {/* Option 2: Profile (Directly Below Logout) */}
                  <Link
                    href="/admin/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-[#4A1513] transition cursor-pointer text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-stone-100 text-[#4A1513] flex items-center justify-center group-hover:bg-[#4A1513] group-hover:text-white transition shrink-0">
                      <User size={14} />
                    </div>
                    <div>
                      <span className="font-bold block">Admin Profile</span>
                      <span className="text-[10px] text-stone-400 font-normal">View account & credentials</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ADMIN LOGOUT BUTTON (Direct action button) */}
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-600 text-xs font-bold uppercase tracking-wider transition-all border border-stone-200 hover:border-rose-200 cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Admin Logout</span>
            <span className="sm:hidden">Logout</span>
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER (For navigation on smaller devices) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-xs flex">
          <div className="w-72 bg-white h-full flex flex-col justify-between shadow-2xl p-5 animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#4A1513]/10 text-[#4A1513] flex items-center justify-center">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 leading-tight">Admin Console</h3>
                    <p className="text-[10px] text-stone-500">Platform Operations</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-4 space-y-1">
                {navMenuItems.map((item) => {
                  if (item.href) {
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => {
                          setNavigatingHref(item.href || null);
                          setIsMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                          navigatingHref === item.href
                            ? "bg-[#4A1513] text-white"
                            : "text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {navigatingHref === item.href && (
                          <Loader2 size={13} className="animate-spin text-white" />
                        )}
                      </Link>
                    );
                  }

                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onTabChange?.(item.id);
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                        isActive
                          ? "bg-[#4A1513] text-white font-bold"
                          : "text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Live Store Link */}
              <div className="mt-6 pt-4 border-t border-stone-100">
                <Link
                  href="/shop"
                  target="_blank"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <ExternalLink size={15} />
                    <span>View Live Store</span>
                  </div>
                  <span className="text-[10px] text-stone-400">↗</span>
                </Link>
              </div>
            </div>

            {/* Mobile Drawer Footer: Logout with Profile directly below it */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                <LogOut size={14} />
                <span>Admin Logout</span>
              </button>

              <Link
                href="/admin/profile"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition"
              >
                <User size={14} className="text-[#4A1513]" />
                <span>Admin Profile Details</span>
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileDrawerOpen(false)} />
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
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
              Your administrative session and control privileges will be securely closed. You can sign back in anytime from /admin.
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
    </>
  );
}
