"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export function LuxuryPromoBanner() {
  return (
    <div className="relative overflow-hidden w-full bg-gradient-to-r from-[#2A0B09] via-[#4A1513] to-[#360D0B] text-white py-5 sm:py-6 px-4 sm:px-8 border-y border-[#7A2A27]/40 shadow-sm">
      {/* Decorative Gold & Velvet Shimmer Accents */}
      <div className="absolute -left-12 -top-12 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 -bottom-10 w-60 h-60 bg-[#E5C3A6]/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Background Subtle Radial Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative mx-auto max-w-[1400px] flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left">
        
        {/* Left Side: Editorial Typography with Gold Badges */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-[#E5C3A6]/30 text-[#E5C3A6] items-center justify-center shrink-0 shadow-inner">
            <Sparkles size={18} />
          </div>

          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E5C3A6] font-sans">
                Curated Luxury Edit
              </span>
              <span className="h-1 w-1 rounded-full bg-[#E5C3A6]" />
              <span className="text-[10px] font-semibold text-stone-300 tracking-wider font-sans">
                Festive &apos;26
              </span>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] lg:text-[28px] text-[#FDFBF7] tracking-tight font-normal leading-tight">
              Celebrate in the Season&apos;s <span className="italic font-light text-[#F3DFCA]">Finest New Arrivals</span>
            </h2>
          </div>
        </div>

        {/* Right Side: Creative Champagne-Gold CTA Button */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/shop"
            className="group relative inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#E5C3A6] to-[#D4B295] hover:from-[#F0D5BE] hover:to-[#E0C1A7] text-[#3D110F] font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <span>Explore Collection</span>
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </div>
  );
}
