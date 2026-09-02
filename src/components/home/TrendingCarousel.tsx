"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";

interface CuratedItem {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  image: string;
  link: string;
}

const CURATED_EDITS: CuratedItem[] = [
  {
    id: "1",
    title: "Festive in Brocade",
    tagline: "Regal handwoven textures & opulent zari silhouettes",
    badge: "HERITAGE EDIT",
    image: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?q=80&w=800&h=1200&auto=format&fit=crop&crop=top",
    link: "/shop?category=Ethnic",
  },
  {
    id: "2",
    title: "Shades of Celebration",
    tagline: "Vibrant jewel tones crafted for joyous evenings",
    badge: "FESTIVE '26",
    image: "https://images.unsplash.com/photo-1583391733958-d15ce1711202?q=80&w=800&h=1200&auto=format&fit=crop&crop=top",
    link: "/shop?category=Ethnic",
  },
  {
    id: "3",
    title: "The New Age Desi",
    tagline: "Modern Indo-western fusion for effortless charm",
    badge: "TRENDING",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&h=1200&auto=format&fit=crop&crop=top",
    link: "/shop?category=Co-ords",
  },
  {
    id: "4",
    title: "The Wedding Guest Edit",
    tagline: "Sophisticated pre-draped drapes & sharara sets",
    badge: "WEDDING FAVORITE",
    image: "https://images.unsplash.com/photo-1599746146388-a7ec2004b67a?q=80&w=800&h=1200&auto=format&fit=crop&crop=top",
    link: "/collections/wedding-edit",
  },
  {
    id: "5",
    title: "Cotton & Linen Classics",
    tagline: "Breezy breathable couture tailored for every day",
    badge: "DAILY LUXE",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&h=1200&auto=format&fit=crop&crop=top",
    link: "/shop",
  },
  {
    id: "6",
    title: "Easy-Breezy Kaftans",
    tagline: "Flowy printed resort silhouettes & statement drapes",
    badge: "RESORT GLAM",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&h=1200&auto=format&fit=crop&crop=top",
    link: "/shop?category=Dresses",
  },
];

export function TrendingCarousel({ products }: { products?: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group/carousel">
      
      {/* Left Overlapping Navigation Arrow */}
      <button
        onClick={() => scroll("left")}
        aria-label="Previous curated edits"
        disabled={!canScrollLeft}
        className={`absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.18)] hover:shadow-lg border border-stone-200/50 flex items-center justify-center text-stone-700 hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${
          canScrollLeft
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right Overlapping Navigation Arrow */}
      <button
        onClick={() => scroll("right")}
        aria-label="Next curated edits"
        disabled={!canScrollRight}
        className={`absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.18)] hover:shadow-lg border border-stone-200/50 flex items-center justify-center text-stone-700 hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${
          canScrollRight
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronRight size={20} />
      </button>

      {/* Curated By Aza Style Horizontal Scroll Row */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 sm:gap-5 md:gap-6 pb-2 hide-scrollbar snap-x touch-pan-x scroll-smooth"
      >
        {CURATED_EDITS.map((item) => (
          <div
            key={item.id}
            className="w-[200px] sm:w-[230px] md:w-[260px] lg:w-[280px] shrink-0 snap-start"
          >
            <Link
              href={item.link}
              className="group/card block relative aspect-[2/3] w-full rounded-md overflow-hidden bg-stone-100 shadow-[0px_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.16)] transition-all duration-500 border border-stone-200/50 cursor-pointer"
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover/card:scale-108"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-85 group-hover/card:opacity-95 transition-opacity duration-500" />

              {/* Top Luxury Badge */}
              <div className="absolute top-3.5 left-3.5 z-10">
                <span className="inline-block px-2.5 py-1 rounded-xs bg-white/20 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-[0.18em] border border-white/25 shadow-sm">
                  {item.badge}
                </span>
              </div>

              {/* Bottom Editorial Content Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 text-white flex flex-col justify-end">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E5C3A6] mb-1 block">
                  Curated Collection
                </span>
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-white font-normal leading-snug tracking-tight mb-1 group-hover:text-[#F3DFCA] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-300/90 line-clamp-1 font-light mb-3 leading-relaxed">
                  {item.tagline}
                </p>

                {/* Elegant "SHOP NOW" CTA Button */}
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#E5C3A6] group-hover:translate-x-1 transition-transform">
                  <span>Shop Now</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}
