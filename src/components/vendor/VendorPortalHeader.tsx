"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Store } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";

interface VendorPortalHeaderProps {
  showLogout?: boolean;
  onLogout?: () => void;
  subTitle?: string;
  storeHref?: string;
}

export function VendorPortalHeader({
  showLogout = false,
  onLogout,
  subTitle,
  storeHref = "/shop",
}: VendorPortalHeaderProps) {
  return (
    <header className="w-full bg-white border-b border-stone-200/80 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 sm:h-[70px] flex items-center justify-between gap-4">
        {/* Left: Femazon Logo + Vendor Portal Label */}
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
          <BrandLogo />
          <div className="h-5 w-[1px] bg-stone-200 shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#4A1513] bg-[#FAF7F5] px-2.5 sm:px-3 py-1 rounded-full border border-stone-200/90 shadow-2xs shrink-0">
              <Store size={12} className="text-[#4A1513]" />
              <span>Vendor Portal</span>
            </span>
            {subTitle && (
              <span className="text-xs text-stone-500 font-medium truncate hidden md:inline">
                • {subTitle}
              </span>
            )}
          </div>
        </div>

        {/* Right: Return to Store (+ optional Logout) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href={storeHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-[#4A1513] bg-white hover:bg-stone-50 border border-stone-200/80 hover:border-stone-300 transition py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-full shadow-2xs"
            title="Return to customer storefront"
          >
            <ChevronLeft size={14} className="text-[#4A1513]" />
            <span>Return to Store</span>
          </Link>

          {showLogout && onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-full bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-600 text-xs font-bold uppercase tracking-wider transition-all border border-stone-200 hover:border-rose-200 cursor-pointer shadow-2xs"
            >
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
