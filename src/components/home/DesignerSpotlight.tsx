"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";

interface Designer {
  id: string;
  name: string;
  tagline: string;
  image: string;
  collectionSlug: string;
  badge?: string;
}

const DESIGNERS: Designer[] = [
  {
    id: "1",
    name: "Tarun Tahiliani",
    tagline: "Master of Drapes & Haute Couture",
    image:
      "https://images.unsplash.com/photo-1610047614301-13c63f00c032?q=80&w=600&h=800&auto=format&fit=crop&crop=top",
    collectionSlug: "tarun-tahiliani",
    badge: "COUTURE ICON",
  },
  {
    id: "2",
    name: "Ridhi Mehra",
    tagline: "Pre-Draped Sarees & Contemporary Charm",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&h=800&auto=format&fit=crop&crop=top",
    collectionSlug: "ridhi-mehra",
    badge: "TRENDING",
  },
  {
    id: "3",
    name: "Seema Gujral",
    tagline: "Intricate Crystal & Thread Embroideries",
    image:
      "https://images.unsplash.com/photo-1599746146388-a7ec2004b67a?q=80&w=600&h=800&auto=format&fit=crop&crop=top",
    collectionSlug: "seema-gujral",
    badge: "BRIDAL FAVORITE",
  },
  {
    id: "4",
    name: "Ekaya Banaras",
    tagline: "Heritage Handwoven Banarasi Silks",
    image:
      "https://images.unsplash.com/photo-1610189046647-7589d70081d1?q=80&w=600&h=800&auto=format&fit=crop&crop=top",
    collectionSlug: "ekaya-banaras",
    badge: "HANDLOOM",
  },
  {
    id: "5",
    name: "Paulmi and Harsh",
    tagline: "Botanical Prints & Breezy Silhouettes",
    image:
      "https://images.unsplash.com/photo-1583391733958-d15ce1711202?q=80&w=600&h=800&auto=format&fit=crop&crop=top",
    collectionSlug: "paulmi-harsh",
    badge: "NEW EDIT",
  },
  {
    id: "6",
    name: "Anita Dongre",
    tagline: "Timeless Craftsmanship & Sustainable Luxury",
    image:
      "https://images.unsplash.com/photo-1600685890506-593fdf55949b?q=80&w=600&h=800&auto=format&fit=crop&crop=top",
    collectionSlug: "anita-dongre",
    badge: "HERITAGE",
  },
];

export function DesignerSpotlight() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-white border-b border-accent/20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#4A1513]/5 text-primary text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-2.5">
              <Sparkles size={12} className="text-primary" />
              <span>Iconic Labels</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-text-main tracking-wide">
              Designers In The Spotlight
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1.5 font-sans">
              Handpicked luxury collections from India&apos;s celebrated couturiers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="text-[11px] uppercase tracking-[0.2em] font-bold text-primary hover:text-[#3D110F] transition flex items-center mr-2"
            >
              All Designers <ArrowRight size={14} className="ml-1" />
            </Link>

            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="p-2.5 rounded-full border border-stone-300 hover:border-primary hover:bg-primary hover:text-white transition hidden md:flex items-center justify-center cursor-pointer shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="p-2.5 rounded-full border border-stone-300 hover:border-primary hover:bg-primary hover:text-white transition hidden md:flex items-center justify-center cursor-pointer shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-5 md:gap-6 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar snap-x touch-pan-x"
        >
          {DESIGNERS.map((designer) => (
            <Link
              key={designer.id}
              href={`/shop?brand=${encodeURIComponent(designer.name)}`}
              className="w-[270px] sm:w-[300px] md:w-[320px] shrink-0 snap-start group flex flex-col"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-stone-100 shadow-sm mb-3.5 border border-stone-200/80">
                <img
                  src={designer.image}
                  alt={designer.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle Gradient & Badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

                {designer.badge && (
                  <span className="absolute top-3 left-3 bg-[#4A1513]/90 backdrop-blur-md text-[#E5C3A6] text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-xs border border-[#E5C3A6]/30">
                    {designer.badge}
                  </span>
                )}

                {/* Overlaid Bottom Title */}
                <div className="absolute bottom-4 inset-x-4 text-white">
                  <h3 className="font-serif text-xl sm:text-2xl font-normal tracking-wide text-[#FDFBF7] mb-1">
                    {designer.name}
                  </h3>
                  <p className="text-xs text-zinc-300 font-light truncate">
                    {designer.tagline}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone-600 group-hover:text-primary transition-colors flex items-center gap-1">
                  Explore Collection &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
