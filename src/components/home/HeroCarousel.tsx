"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";

interface HeroSlide {
  id: number;
  tag: string;
  title: string;
  tagline: string;
  link: string;
  ctaText: string;
  image: string;
  fallbackImage: string;
  align?: "left" | "right";
}

const AZA_HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    tag: "THE BRIDAL EDIT • COUTURE 2026",
    title: "Designer Lehengas & Royal Silhouettes",
    tagline: "Handcrafted masterworks in pure silk, zardozi embroidery, and heritage drapes from premier ateliers.",
    link: "/womens-wear?category=Lehengas",
    ctaText: "Explore Collection",
    image: "/banners/hero_bridal.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=85&w=1920",
    align: "left",
  },
  {
    id: 2,
    tag: "THE SILK LEGACY • HANDWOVEN ELEGANCE",
    title: "Pure Banarasi & Handloom Sarees",
    tagline: "Woven by generational master weavers in Varanasi, featuring authentic gold zari brocades and organza.",
    link: "/womens-wear?category=Sarees",
    ctaText: "Shop Sarees",
    image: "/banners/hero_saree.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?auto=format&fit=crop&q=85&w=1920",
    align: "left",
  },
  {
    id: 3,
    tag: "HERITAGE JEWELS • FINE CRAFTSMANSHIP",
    title: "Timeless Kundan & Polki Jewellery",
    tagline: "Curated 22K gold-plated bridal choker sets, uncut polki, emerald drops, and royal temple ornaments.",
    link: "/shop?category=Jewelry+%26+Accessories",
    ctaText: "Discover Jewellery",
    image: "/banners/hero_beauty_jewels.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=85&w=1920",
    align: "left",
  },
  {
    id: 4,
    tag: "CONTEMPORARY LUXURY • MODERN COUTURE",
    title: "Designer Co-ords & Indowestern",
    tagline: "Effortless silhouettes tailored for cocktail soirees, festive gatherings, and destination celebrations.",
    link: "/womens-wear?category=Co-ord+Sets",
    ctaText: "Explore Edit",
    image: "/banners/hero_coords.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=85&w=1920",
    align: "left",
  },
  {
    id: 5,
    tag: "CURATED CELEBRATIONS • BESPOKE SURPRISES",
    title: "Artisanal Hampers & Occasion Gifts",
    tagline: "Thoughtfully curated festive gift boxes, luxury treats, personalized tokens, and wedding favours.",
    link: "/gifts",
    ctaText: "Explore Gifting",
    image: "/banners/hero_gifts.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=85&w=1920",
    align: "left",
  },
  {
    id: 6,
    tag: "FEMAZON PRIVÉ • ATELIER STYLIST",
    title: "Personal Styling & Trousseau Curation",
    tagline: "One-on-one virtual consultations, body silhouette mapping, and complete bespoke wardrobe curation.",
    link: "/personal-styling",
    ctaText: "Book Your Stylist",
    image: "/banners/hero_runway.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=85&w=1920",
    align: "left",
  },
];

// Luxury category pills matching Aza Fashions category strip
const AZA_CATEGORY_PILLS = [
  { label: "Women's Wear", href: "/womens-wear", badge: "COUTURE" },
  { label: "Bridal Lehengas", href: "/womens-wear?category=Lehengas", badge: "TRENDING" },
  { label: "Heritage Sarees", href: "/womens-wear?category=Sarees" },
  { label: "Beauty & Wellness", href: "/beauty" },
  { label: "Fine Jewellery", href: "/shop?category=Jewelry+%26+Accessories" },
  { label: "Gifts & Hampers", href: "/gifts", badge: "OCCASIONS" },
  { label: "Personal Stylist", href: "/personal-styling", badge: "HOT" },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % AZA_HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + AZA_HERO_SLIDES.length) % AZA_HERO_SLIDES.length);
  }, []);

  // Smooth auto-play rotation (every 6 seconds, paused on hover)
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(nextSlide, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
    setTouchStart(null);
  };

  const currentSlide = AZA_HERO_SLIDES[current];

  return (
    <div className="w-full bg-white select-none py-1.5 sm:py-2.5">
      {/* Container with even classy whitespace on left and right - Aza Fashions Benchmark */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Main Hero Slider Card with Rounded Luxury Corners */}
        <section
          aria-label="Femazon Luxury Hero Banner"
          className="relative w-full h-[250px] sm:h-[300px] md:h-[340px] lg:h-[380px] xl:h-[410px] rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 group shadow-[0_10px_35px_rgba(0,0,0,0.1)] border border-stone-200/60"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Full-bleed Slides with Cinematic Fade Transition */}
          {AZA_HERO_SLIDES.map((slide, index) => {
            const isActive = index === current;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  isActive
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* High-Resolution Editorial Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading={index === 0 ? "eager" : "lazy"}
                  onError={(e) => {
                    if (slide.fallbackImage && e.currentTarget.src !== slide.fallbackImage) {
                      e.currentTarget.src = slide.fallbackImage;
                    }
                  }}
                  className="w-full h-full object-cover object-center"
                />

                {/* Aza-Inspired Multi-Layer Gradient Overlays: Text legibility while keeping couture vivid */}
                {/* Left-to-right soft scrim */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 sm:via-black/20 to-transparent" />
                {/* Mobile bottom-to-top scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 sm:hidden" />
                {/* Bottom subtle vignette for indicators */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
            );
          })}

          {/* Floating Side Navigation Arrows (Aza Benchmark Style) */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-5 md:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-900 shadow-[0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer border border-white/70"
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-5 md:right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-900 shadow-[0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer border border-white/70"
          >
            <ChevronRight size={18} strokeWidth={2} />
          </button>

          {/* Editorial Text Content Block (Left-Aligned Aza Layout) */}
          <div className="absolute inset-0 z-20 px-6 sm:px-10 md:px-12 lg:px-14 flex items-center justify-start pointer-events-none">
            <div className="w-full sm:w-[62%] md:w-[54%] lg:w-[48%] text-left pointer-events-auto py-2 sm:py-3">
              
              {/* Subtle Luxury Pre-Header Ribbon */}
              <div className="inline-flex items-center gap-1.5 mb-1.5 sm:mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-sans text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#F3DFCA] drop-shadow">
                  {currentSlide.tag}
                </span>
              </div>

              {/* Grand Couture Headline (Vogue / Aza Serif Typography) */}
              <h1 className="font-serif text-lg sm:text-2xl md:text-3xl lg:text-[34px] text-white font-normal leading-[1.12] tracking-tight mb-1 sm:mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                {currentSlide.title}
              </h1>

              {/* Sub-tagline description */}
              <p className="font-sans text-[11.5px] sm:text-xs md:text-[13px] text-stone-200/90 font-light leading-relaxed mb-2.5 sm:mb-4 max-w-md line-clamp-2 drop-shadow">
                {currentSlide.tagline}
              </p>

              {/* Aza Benchmark Call-To-Action Button */}
              <div>
                <Link
                  href={currentSlide.link}
                  className="group/btn inline-flex items-center gap-2 bg-white hover:bg-[#4A1513] text-stone-950 hover:text-white px-5 sm:px-7 py-2 sm:py-2.5 rounded-full font-sans text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer border border-white hover:border-[#4A1513]"
                >
                  <span>{currentSlide.ctaText}</span>
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                  />
                </Link>
              </div>

            </div>
          </div>

          {/* Bottom Pagination & Slide Counter (Aza Fashions Benchmark) */}
          <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-30 px-6 sm:px-10 flex items-center justify-between pointer-events-none">
            
            {/* Left/Center: Sleek Indicator Dashes */}
            <div className="flex items-center gap-2 pointer-events-auto">
              {AZA_HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1 sm:h-1.5 transition-all duration-500 rounded-full cursor-pointer ${
                    idx === current
                      ? "w-8 sm:w-10 bg-white shadow-md"
                      : "w-2.5 sm:w-3 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Right: Modern Slide Counter (e.g. 01 / 06) */}
            <div className="hidden sm:flex items-center gap-1.5 text-white/90 font-mono text-[11px] tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <span className="font-bold text-white">0{current + 1}</span>
              <span className="text-white/40">/</span>
              <span>0{AZA_HERO_SLIDES.length}</span>
            </div>

          </div>
        </section>

        {/* 2. Aza-Style Trending Luxury Category Strip (Directly Below Hero Banner inside same container) */}
        <div className="mt-3.5 sm:mt-4 w-full bg-[#FAF7F5] rounded-2xl border border-stone-200/70 py-2.5 px-4 sm:px-6 hidden md:flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A1513] shrink-0">
            <Sparkles size={14} className="text-amber-600" />
            <span>EXPLORE CURATIONS:</span>
          </div>
          
          <div className="flex items-center gap-2 xl:gap-3 overflow-x-auto scrollbar-none py-1">
            {AZA_CATEGORY_PILLS.map((pill) => (
              <Link
                key={pill.label}
                href={pill.href}
                className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#4A1513] border border-stone-200/90 hover:border-[#4A1513] text-stone-700 hover:text-white text-[12px] font-medium transition-all duration-200 shadow-2xs whitespace-nowrap cursor-pointer"
              >
                <span>{pill.label}</span>
                {pill.badge && (
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full bg-rose-50 group-hover:bg-white/20 text-[#4A1513] group-hover:text-amber-200 transition-colors">
                    {pill.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
