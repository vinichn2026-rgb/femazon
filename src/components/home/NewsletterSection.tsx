"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export function NewsletterSection() {
  return (
    <section className="w-full bg-white py-3 sm:py-5 text-center select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="w-full bg-[#FAF7F5] rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-2xs">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-1.5">
        BE THE FIRST TO KNOW
      </span>
      <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-stone-900 tracking-wide leading-tight">
        Stay in Her Style
      </h2>
      <p className="mt-1.5 text-stone-500 text-xs sm:text-sm font-sans italic mb-6 max-w-md mx-auto">
        Discover the latest fashion, curated designer collections and exclusive Femazon updates.
      </p>
      <form 
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col sm:flex-row justify-center items-center gap-3.5 max-w-md mx-auto"
      >
        <input 
          type="email" 
          placeholder="Enter your email" 
          className="w-full sm:w-auto flex-grow bg-transparent border-b border-text-muted/40 pb-2 text-text-main placeholder-text-muted/60 focus:outline-none focus:border-text-main transition font-sans text-sm"
          required
        />
        <button 
          type="submit" 
          className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4A1513] hover:bg-[#350B0A] text-white text-[11px] font-bold uppercase tracking-[0.2em] py-2.5 px-7 transition-all duration-300 rounded-full shadow-sm hover:shadow-md cursor-pointer active:scale-95"
        >
          <span>Join Femazon</span>
          <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </form>
      </div>
        </div>
      </div>
    </section>
  );
}
