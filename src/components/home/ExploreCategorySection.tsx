"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SampleItem {
  id: string;
  title: string;
  badge?: string;
  image: string;
  href: string;
}

interface CategorySection {
  id: string;
  title: string;
  tagline: string;
  href: string;
  samples: SampleItem[];
}

const SECTIONS: CategorySection[] = [
  {
    id: "womens-wear",
    title: "Women's Wear",
    tagline: "Indian Wear, Designer Sarees, Western Dresses & Boutiques",
    href: "/womens-wear",
    samples: [
      {
        id: "ww-1",
        title: "Kurtas & Sets",
        badge: "TRENDING",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=500&auto=format&fit=crop",
        href: "/womens-wear?category=Kurtas+%26+Kurta+Sets",
      },
      {
        id: "ww-2",
        title: "Designer Sarees",
        badge: "UP TO 20% OFF",
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=500&auto=format&fit=crop",
        href: "/womens-wear?category=Sarees",
      },
      {
        id: "ww-3",
        title: "Western Dresses",
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=500&auto=format&fit=crop",
        href: "/womens-wear?category=Western+Dresses",
      },
      {
        id: "ww-4",
        title: "Co-ord Sets",
        badge: "POPULAR",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500&auto=format&fit=crop",
        href: "/womens-wear?category=Co-ord+Sets",
      },
      {
        id: "ww-5",
        title: "Festive Lehengas",
        badge: "HANDCRAFTED",
        image: "https://images.unsplash.com/photo-1583391733958-d15ce1711202?q=80&w=500&auto=format&fit=crop",
        href: "/womens-wear?category=Lehengas",
      },
    ],
  },
  {
    id: "beauty-products",
    title: "Beauty Products",
    tagline: "Natural Skincare, Pure Oils, Clean Makeup & Self-care",
    href: "/beauty",
    samples: [
      {
        id: "bp-1",
        title: "Glow Face Oils",
        badge: "UP TO 20% OFF",
        image: "https://images.unsplash.com/photo-1608248597359-0520281b95ff?q=80&w=500&auto=format&fit=crop",
        href: "/beauty?view=products&sub=skincare",
      },
      {
        id: "bp-2",
        title: "Rosewater Mists",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500&auto=format&fit=crop",
        href: "/beauty?view=products&sub=skincare",
      },
      {
        id: "bp-3",
        title: "Herbal Hair Care",
        badge: "BESTSELLER",
        image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500&auto=format&fit=crop",
        href: "/beauty?view=products&sub=haircare",
      },
      {
        id: "bp-4",
        title: "Lip & Cheek Tints",
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=500&auto=format&fit=crop",
        href: "/beauty?view=products&sub=makeup",
      },
      {
        id: "bp-5",
        title: "Bath & Body Spa",
        badge: "PURE CARE",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=500&auto=format&fit=crop",
        href: "/beauty?view=products&sub=personal-hygiene",
      },
    ],
  },
  {
    id: "personal-styling",
    title: "Personal Styling",
    tagline: "1-on-1 Certified Stylists, Wardrobe Audits & Occasion Looks",
    href: "/personal-styling",
    samples: [
      {
        id: "ps-1",
        title: "Wardrobe Revamp",
        badge: "1-ON-1 ONLINE",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500&auto=format&fit=crop",
        href: "/personal-styling",
      },
      {
        id: "ps-2",
        title: "Bridal Styling",
        badge: "BRIDAL EDIT",
        image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=500&auto=format&fit=crop",
        href: "/personal-styling",
      },
      {
        id: "ps-3",
        title: "Personal Shopper",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=500&auto=format&fit=crop",
        href: "/personal-styling",
      },
      {
        id: "ps-4",
        title: "Executive Workwear",
        badge: "WORKWEAR",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop",
        href: "/personal-styling",
      },
      {
        id: "ps-5",
        title: "Color Analysis",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=500&auto=format&fit=crop",
        href: "/personal-styling",
      },
    ],
  },
  {
    id: "gifts",
    title: "Gifts for Every Occasion",
    tagline: "Curated Hampers, Handmade Keepsakes, Flowers & Sweet Treats",
    href: "/gifts",
    samples: [
      {
        id: "gf-1",
        title: "Gourmet Hampers",
        badge: "UP TO 20% OFF",
        image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=500&auto=format&fit=crop",
        href: "/gifts?occasion=Birthday",
      },
      {
        id: "gf-2",
        title: "Brass Keepsakes",
        badge: "HANDCRAFTED",
        image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=500&auto=format&fit=crop",
        href: "/gifts?occasion=Anniversary",
      },
      {
        id: "gf-3",
        title: "Pamper Boxes",
        badge: "BESTSELLER",
        image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=500&auto=format&fit=crop",
        href: "/gifts?occasion=Birthday",
      },
      {
        id: "gf-4",
        title: "Festive Gift Boxes",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=500&auto=format&fit=crop",
        href: "/gifts?occasion=Festivals",
      },
      {
        id: "gf-5",
        title: "Scented Candle Sets",
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=500&auto=format&fit=crop",
        href: "/gifts",
      },
    ],
  },
  {
    id: "jewellery-accessories",
    title: "Jewellery & Accessories",
    tagline: "Temple Kundan Sets, Statement Jhumkas, Potlis & Mojaris",
    href: "/womens-wear?category=Jewellery",
    samples: [
      {
        id: "ja-1",
        title: "Temple Chokers",
        badge: "UP TO 15% OFF",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=500&auto=format&fit=crop",
        href: "/womens-wear?category=Jewellery",
      },
      {
        id: "ja-2",
        title: "Polki Jhumkas",
        badge: "HANDMADE",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500&auto=format&fit=crop",
        href: "/womens-wear?category=Jewellery",
      },
      {
        id: "ja-3",
        title: "Silk Potlis & Bags",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500&auto=format&fit=crop",
        href: "/womens-wear?category=Handbags",
      },
      {
        id: "ja-4",
        title: "Leather Mojaris",
        badge: "COMFORT LUXE",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=500&auto=format&fit=crop",
        href: "/womens-wear?category=Footwear",
      },
      {
        id: "ja-5",
        title: "Silver Bangles",
        image: "https://images.unsplash.com/photo-1611591475152-4c83136ab5b6?q=80&w=500&auto=format&fit=crop",
        href: "/womens-wear?category=Jewellery",
      },
    ],
  },
];

export function ExploreCategorySection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Automatically rotates title and section every 5 seconds (just like shop.yuukke.com)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SECTIONS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const currentSection = SECTIONS[activeIdx];

  // Quadruple the 5 samples for seamless infinite leftward scroll
  const movingItems = [
    ...currentSection.samples,
    ...currentSection.samples,
    ...currentSection.samples,
    ...currentSection.samples,
  ];

  return (
    <section className="w-full bg-white py-3 sm:py-5 select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative overflow-hidden bg-[#FCF9F6] rounded-2xl sm:rounded-3xl border border-stone-200/60 py-8 sm:py-10 px-4 sm:px-8 md:px-10 shadow-2xs"
        >
          {/* Decorative ambient background curves */}
          <div
            className="pointer-events-none absolute -left-24 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#F5ECE5]/60 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-24 top-1/3 w-96 h-96 rounded-full bg-[#FAECE8]/50 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative w-full">
        {/* Header Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-7">
          <div>
            {/* Tag / Eyebrow */}
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-1.5">
                SHOP BY CATEGORY
              </span>
            </div>

            {/* Dynamic Headline: Changes every 5 seconds (e.g. "Explore our Women's Wear") */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] text-stone-900 font-normal tracking-tight leading-tight transition-all duration-500">
              Explore our{" "}
              <span
                key={currentSection.id}
                className="italic font-serif font-normal text-[#4A1513] inline-block animate-in fade-in slide-in-from-bottom-1 duration-500"
              >
                {currentSection.title}
              </span>
            </h2>

            <p className="mt-1.5 text-xs sm:text-sm text-stone-500 font-sans max-w-xl">
              Discover curated collections crafted with elegance and care
            </p>
          </div>

          {/* Action on Right: Clean "Discover All Categories" pill button */}
          <div className="flex items-center self-start md:self-end">
            <Link
              href={currentSection.href}
              className="group inline-flex items-center gap-2.5 rounded-full border border-stone-300/90 bg-white px-5 py-2.5 text-xs sm:text-sm font-medium text-stone-800 shadow-2xs hover:border-[#4A1513] hover:text-[#4A1513] hover:shadow-xs transition-all duration-200"
            >
              <span>Discover All Categories</span>
              <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border border-stone-300 group-hover:border-[#4A1513] group-hover:bg-[#4A1513] group-hover:text-white transition-all duration-200 text-stone-600">
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Category Navigation Pills (Shows current active section running every 5s) */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto hide-scrollbar pb-2 mb-6">
          {SECTIONS.map((sec, idx) => {
            const isActive = idx === activeIdx;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`group relative shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-[#4A1513] text-white shadow-sm scale-102"
                    : "bg-white text-stone-600 border border-stone-200/90 hover:border-stone-400 hover:text-stone-900"
                }`}
              >
                <span>{sec.title}</span>

                {/* 5-second animated progress line on the active category */}
                {isActive && !isPaused && (
                  <span
                    key={`progress-${idx}`}
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-rose-200/80 rounded-full animate-[progress_5s_linear]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* LEFT-MOVING ELITE COMPACT SQUIRCLE CAROUSEL (Yuukke Style) */}
        <div className="relative overflow-hidden w-full py-2">
          {/* Subtle soft edge gradient masks */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#FCF9F6] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#FCF9F6] to-transparent z-10" />

          {/* Continuous Left-moving animated track */}
          <div
            key={currentSection.id}
            className="animate-marquee-left flex gap-3.5 sm:gap-4.5"
          >
            {movingItems.map((sample, index) => (
              <Link
                key={`${sample.id}-${index}`}
                href={sample.href}
                className="group shrink-0 w-[150px] sm:w-[170px] md:w-[185px] rounded-[22px] sm:rounded-[26px] bg-white p-2.5 sm:p-3 border border-stone-200/80 shadow-2xs hover:border-[#4A1513]/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Square Sample Picture with Rounded Corners (Yuukke Style) */}
                <div>
                  <div className="relative aspect-square w-full rounded-[16px] sm:rounded-[20px] overflow-hidden bg-stone-100 mb-2.5">
                    <img
                      src={sample.image}
                      alt={sample.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />

                    {/* Gradient overlay for hover polish */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Minimal Badge on Sample Pic (e.g. "UP TO 20% OFF") */}
                    {sample.badge && (
                      <span className="absolute top-2 right-2 rounded-full bg-[#4A1513] px-2 py-0.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
                        {sample.badge}
                      </span>
                    )}
                  </div>

                  {/* Clean Elite Centered Title - Just like the reference image */}
                  <div className="text-center px-1 pb-1">
                    <h3 className="font-sans text-xs sm:text-[13px] font-medium text-stone-700 group-hover:text-[#4A1513] transition-colors leading-tight line-clamp-1">
                      {sample.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

          </div>
        </div>
      </div>
    </section>
  );
}
