"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Gift, Sparkles } from "lucide-react";

interface OccasionCard {
  id: string;
  name: string;
  badge?: string;
  bgClass: string;
  borderColor: string;
  image: string;
  href: string;
}

const OCCASIONS: OccasionCard[] = [
  {
    id: "birthday",
    name: "Birthday",
    badge: "POPULAR",
    bgClass: "bg-[#FFF2EA]",
    borderColor: "border-[#FAD9C3]",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop",
    href: "/gifts?occasion=Birthday",
  },
  {
    id: "anniversary",
    name: "Anniversary",
    badge: "ROMANTIC",
    bgClass: "bg-[#FDF0F3]",
    borderColor: "border-[#F8D2DB]",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop",
    href: "/gifts?occasion=Anniversary",
  },
  {
    id: "wedding",
    name: "Wedding Gifts",
    badge: "CURATED",
    bgClass: "bg-[#FDF9EE]",
    borderColor: "border-[#F6E9CD]",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop",
    href: "/gifts?occasion=Wedding+Gifts",
  },
  {
    id: "congratulations",
    name: "Congratulations",
    bgClass: "bg-[#EFF6FC]",
    borderColor: "border-[#D6E6F5]",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
    href: "/gifts?occasion=Congratulations",
  },
  {
    id: "new-born",
    name: "New Born & Baby",
    badge: "SWEET",
    bgClass: "bg-[#FEF9EA]",
    borderColor: "border-[#F8ECC9]",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=600&auto=format&fit=crop",
    href: "/gifts?occasion=Baby+Shower",
  },
  {
    id: "festivals",
    name: "Festivals & Pooja",
    badge: "CELEBRATION",
    bgClass: "bg-[#FFF4E5]",
    borderColor: "border-[#FCE0BF]",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b5ab8?q=80&w=600&auto=format&fit=crop",
    href: "/gifts?occasion=Festivals",
  },
  {
    id: "housewarming",
    name: "Housewarming",
    bgClass: "bg-[#F2F7F2]",
    borderColor: "border-[#DCE9DC]",
    image: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=600&auto=format&fit=crop",
    href: "/gifts?occasion=Housewarming",
  },
  {
    id: "best-wishes",
    name: "Best Wishes & Plants",
    bgClass: "bg-[#F7F2FD]",
    borderColor: "border-[#E8DAF8]",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop",
    href: "/gifts?occasion=Friendship",
  },
];

interface FeaturedBanner {
  id: string;
  title: string;
  tagline: string;
  ctaText: string;
  href: string;
  image: string;
}

const FEATURED_BANNERS: FeaturedBanner[] = [
  {
    id: "birthday-joy",
    title: "Birthday Joy, Gift-wrapped",
    tagline: "Curated blooms, gourmet cakes & bespoke treats for thoughtful celebrations.",
    ctaText: "Order Now",
    href: "/gifts?occasion=Birthday",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "anniversary-special",
    title: "Anniversaries Made Special",
    tagline: "Find timeless surprises crafted with love for an unforgettable romantic story.",
    ctaText: "Order Now",
    href: "/gifts?occasion=Anniversary",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "blooming-love",
    title: "Blooming Love, Wrapped in Flowers",
    tagline: "Send freshly-sourced blooms & floral arrangements to brighten their special day.",
    ctaText: "Order Now",
    href: "/gifts?category=Flowers",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "gourmet-cakes",
    title: "Gourmet Cakes for Your Celebration",
    tagline: "Find the sweetest handcrafted delights for your most cherished moments.",
    ctaText: "Order Now",
    href: "/gifts?category=Cakes",
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800&auto=format&fit=crop",
  },
];

export function GiftsOccasionsSection() {
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  // Auto-scroll banner fast every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % FEATURED_BANNERS.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-white py-10 sm:py-14 border-b border-stone-100 select-none relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">

        {/* 1. Header with View All */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-1.5">
              CURATED HAMPERS &amp; SURPRISES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-stone-900 tracking-wide leading-tight">
              Gifts For Every Occasion
            </h2>
            <p className="mt-1.5 text-stone-500 text-xs sm:text-sm font-sans italic">
              Thoughtful gift hampers, fresh blooms, artisanal sweets &amp; personalized keepsakes.
            </p>
          </div>

          <Link
            href="/gifts"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#4A1513] hover:text-[#350B0A] transition-colors self-start sm:self-end"
          >
            <span>Explore Gift Studio</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3. Wide Interactive Feature Banner Slider with Smooth Horizontal Scrolling Motion */}
        <div className="relative rounded-3xl overflow-hidden shadow-xs border border-stone-200/90 bg-white select-none">
          {/* Horizontal Sliding Track */}
          <div 
            className="flex transition-transform duration-700 ease-in-out w-full"
            style={{ transform: `translateX(-${activeBannerIdx * 100}%)` }}
          >
            {FEATURED_BANNERS.map((banner) => (
              <div 
                key={banner.id}
                className="w-full shrink-0 bg-gradient-to-r from-white via-[#FAF7F5] to-[#FDFBF7] p-6 sm:p-10 md:p-12 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 min-h-[260px] sm:min-h-[300px] relative"
              >
                {/* Ambient Subtle Accent Glow */}
                <div className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-rose-50/60 blur-3xl" />
                <div className="pointer-events-none absolute -left-20 -top-20 w-80 h-80 rounded-full bg-amber-50/40 blur-3xl" />

                {/* Left Content */}
                <div className="w-full md:w-3/5 z-10 text-center md:text-left">
                  <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-2 font-sans">
                    SPECIAL CURATION
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-normal tracking-tight text-stone-900 leading-tight mb-2 sm:mb-3">
                    {banner.title}
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm font-sans max-w-md mx-auto md:mx-0 leading-relaxed mb-5 sm:mb-6">
                    {banner.tagline}
                  </p>

                  <div>
                    <Link
                      href={banner.href}
                      className="inline-flex items-center gap-2 bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-2.5 sm:py-3.5 px-6 sm:px-8 rounded-full shadow-sm hover:shadow-md transition-all duration-300 active:scale-95 cursor-pointer"
                    >
                      <span>{banner.ctaText}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Right Showcase Image Card */}
                <div className="w-full md:w-2/5 flex justify-center md:justify-end z-10">
                  <div className="relative w-56 sm:w-68 md:w-80 aspect-4/3 rounded-2xl overflow-hidden shadow-md border border-stone-200/80 transform transition-transform duration-500 hover:scale-102 bg-stone-100">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {FEATURED_BANNERS.map((banner, idx) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => setActiveBannerIdx(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeBannerIdx === idx
                    ? "w-6 h-2 bg-[#4A1513]"
                    : "w-2 h-2 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
