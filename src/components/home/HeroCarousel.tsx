"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroSlide {
  id: number;
  tag: string;
  title: string;
  tagline: string;
  link: string;
  ctaText: string;
  image: string;
  align: "left" | "right";
}

const FEMAZON_HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    tag: "SPRING / FESTIVE '26",
    title: "The Royal Bridal Edit",
    tagline: "Handcrafted heritage couture for unforgettable celebrations.",
    link: "/shop",
    ctaText: "Shop Collection",
    image: "/banners/hero_bridal.jpg",
    align: "left", // Content on LEFT
  },
  {
    id: 2,
    tag: "NEW SEASON DROP",
    title: "Contemporary Co-ords",
    tagline: "Effortless linen silhouettes tailored for everyday luxury.",
    link: "/shop?category=Co-ords",
    ctaText: "Explore Edit",
    image: "/banners/hero_coords.jpg",
    align: "right", // Content on RIGHT
  },
  {
    id: 3,
    tag: "HERITAGE WEAVES",
    title: "Pure Banarasi Silks",
    tagline: "Timeless handcrafted sarees woven with pure zari.",
    link: "/shop?category=Ethnic",
    ctaText: "Discover Sarees",
    image: "/banners/hero_saree.jpg",
    align: "left", // Content on LEFT
  },
  {
    id: 4,
    tag: "RUNWAY EXCLUSIVE",
    title: "Pre-Draped Gowns",
    tagline: "Ethereal crystal-adorned evening wear made to stand out.",
    link: "/shop",
    ctaText: "Shop Runway",
    image: "/banners/hero_runway.jpg",
    align: "left", // Content on LEFT
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % FEMAZON_HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + FEMAZON_HERO_SLIDES.length) % FEMAZON_HERO_SLIDES.length);
  }, []);

  // Auto-play interval
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
    setTouchStart(null);
  };

  const currentSlide = FEMAZON_HERO_SLIDES[current];
  const isLeft = currentSlide.align === "left";

  return (
    <div className="w-full bg-white pt-2 pb-4">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <section
          aria-label="Femazon Hero Banner"
          className="relative w-full aspect-[16/10] sm:aspect-[16/7.5] md:aspect-[16/6.2] min-h-[280px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[440px] max-h-[480px] rounded-md overflow-hidden bg-neutral-900 shadow-md border border-stone-200/60 select-none group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Full Background Image Across All Sides */}
          {FEMAZON_HERO_SLIDES.map((slide, index) => {
            const isActive = index === current;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* 100% Full Image Anchored to TOP (Face/Head 100% Preserved) */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-top"
                />

                {/* Directional gradient overlay: highlights text side while leaving opposite side bright */}
                <div
                  className={`absolute inset-0 ${
                    slide.align === "left"
                      ? "bg-gradient-to-r from-black/85 via-black/40 sm:via-black/35 to-transparent"
                      : "bg-gradient-to-l from-black/85 via-black/40 sm:via-black/35 to-transparent"
                  }`}
                />
                
                {/* Bottom edge subtle shadow for dots */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
            );
          })}

          {/* Dynamic Content Positioning (Left vs Right) */}
          <div
            className={`absolute inset-0 z-20 mx-auto max-w-[1400px] px-5 sm:px-12 md:px-16 flex items-center ${
              isLeft ? "justify-start" : "justify-end"
            } pointer-events-none`}
          >
            <div className="w-[85%] sm:w-[52%] md:w-[44%] lg:w-[40%] text-left pointer-events-auto">
              
              {/* Minimal Tag */}
              <span className="inline-block font-sans text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#F3DFCA] mb-1.5 sm:mb-2 drop-shadow">
                {currentSlide.tag}
              </span>

              {/* Clean Serif Title */}
              <h1 className="font-serif text-xl sm:text-3xl md:text-4xl lg:text-[42px] text-white font-normal leading-tight sm:leading-[1.15] tracking-tight mb-2 sm:mb-2.5 drop-shadow-md">
                {currentSlide.title}
              </h1>

              {/* Simple 1-line Tagline */}
              <p className="font-sans text-[11px] sm:text-xs md:text-sm text-stone-200/95 font-light leading-relaxed mb-3.5 sm:mb-5 max-w-xs sm:max-w-sm line-clamp-2 drop-shadow">
                {currentSlide.tagline}
              </p>

              {/* Clean Luxury CTA Button: Light subtle radius matching navbar search box */}
              <div>
                <Link
                  href={currentSlide.link}
                  className="group inline-flex items-center gap-1.5 sm:gap-2 bg-white hover:bg-[#3D110F] text-[#3D110F] hover:text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-sm font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:shadow-lg transition-all duration-300 border border-white hover:border-[#3D110F] active:scale-95 cursor-pointer"
                >
                  <span>{currentSlide.ctaText}</span>
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>



          {/* Bottom Indicator Dots */}
          <div className="absolute bottom-4 inset-x-0 z-30 flex items-center justify-center gap-2 pointer-events-none">
            {FEMAZON_HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer pointer-events-auto ${
                  idx === current
                    ? "w-8 bg-white shadow-sm"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
