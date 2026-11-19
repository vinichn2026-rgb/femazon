import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BoutiqueSpotlightSection() {
  return (
    <section className="w-full bg-white py-8 sm:py-12 md:py-14 select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FDFBF7] flex flex-col lg:flex-row items-stretch shadow-sm border border-stone-200/80">
        {/* Image Side */}
        <div className="w-full lg:w-1/2 h-[240px] sm:h-[360px] lg:h-auto relative min-h-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&h=1400&auto=format&fit=crop&crop=center" 
            alt="Femazon Women's Wear Boutiques" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-[#4A1513] uppercase tracking-wider shadow-xs">
            Verified Boutiques &amp; Sellers
          </div>
        </div>
        
        {/* Text Side */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-12 lg:p-14 flex flex-col justify-center">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-1.5 sm:mb-2">
            Everything Women Love, All in One Place
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-stone-900 tracking-wide mb-3 sm:mb-4 leading-tight">
            Curated Women&apos;s Wear <br className="hidden sm:block"/><span className="italic font-light text-[#4A1513]">From 100+ Boutiques</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed mb-5 max-w-md">
            From pure Kanjeevaram weaves and handcrafted Lucknowi Chikankari to contemporary power blazers and inclusive curve fashion — discover garments tailored for every moment of a woman&apos;s life.
          </p>
          
          {/* 4 Pillars Visual */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 bg-white rounded-xl border border-stone-200/70 shadow-2xs">
              <span className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider block mb-0.5">14 Categories</span>
              <span className="text-[11px] text-stone-500">Sarees to Activewear</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200/70 shadow-2xs">
              <span className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider block mb-0.5">Direct Sellers</span>
              <span className="text-[11px] text-stone-500">Verified Artisans &amp; Boutiques</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200/70 shadow-2xs">
              <span className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider block mb-0.5">Inclusive Sizing</span>
              <span className="text-[11px] text-stone-500">XS to 6XL &amp; Maternity</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200/70 shadow-2xs">
              <span className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider block mb-0.5">Express Dispatch</span>
              <span className="text-[11px] text-stone-500">Ships within 24-48 Hours</span>
            </div>
          </div>

          <div>
            <Link href="/womens-wear" className="group inline-flex items-center gap-2 bg-[#4A1513] hover:bg-[#350B0A] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] py-3 px-8 transition-all duration-300 rounded-full shadow-md hover:shadow-lg active:scale-95">
              <span>Explore Women&apos;s Wear Collection</span>
              <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
