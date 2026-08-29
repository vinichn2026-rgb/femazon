"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface SpotlightCard {
  id: string;
  name: string;
  image: string;
  link: string;
}

const SPOTLIGHT_CARDS: SpotlightCard[] = [
  {
    id: "1",
    name: "Artisanal Drapes",
    image: "/spotlight/shawl.jpg",
    link: "/shop?category=Ethnic",
  },
  {
    id: "2",
    name: "Structured Handbags",
    image: "/spotlight/bag.jpg",
    link: "/shop?category=Accessories",
  },
  {
    id: "3",
    name: "Embroidered Clutches",
    image: "/spotlight/clutch.jpg",
    link: "/shop?category=Accessories",
  },
  {
    id: "4",
    name: "Jeweled Belts",
    image: "/spotlight/belt.jpg",
    link: "/shop?category=Accessories",
  },
  {
    id: "5",
    name: "Signature Footwear",
    image: "/spotlight/footwear.jpg",
    link: "/shop?category=Footwear",
  },
  {
    id: "6",
    name: "Festive Co-ords",
    image: "/banners/hero_coords.jpg",
    link: "/shop?category=Co-ords",
  },
  {
    id: "7",
    name: "Royal Silks",
    image: "/banners/hero_saree.jpg",
    link: "/shop?category=Ethnic",
  },
];

export function NewArrivalsSpotlight() {
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
      const scrollAmount = direction === "left" ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="pt-5 lg:pt-7 pb-5 lg:pb-7 bg-white border-b border-stone-100 select-none">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        
        {/* Title & View All Link in Maroon & White Theme */}
        <div className="flex items-end justify-between mb-3.5 sm:mb-4">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-[30px] text-[#3D110F] font-normal tracking-tight">
            New Arrivals & Everyday Style
          </h2>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-bold text-[#4A1513] hover:text-[#2B0E0D] transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Carousel Container with Aza-Style Overlapping Arrows */}
        <div className="relative group">
          
          {/* Left Arrow Button (Aza Overlapping Style) */}
          <button
            onClick={() => scroll("left")}
            aria-label="Previous items"
            disabled={!canScrollLeft}
            className={`absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-[0px_2px_8px_rgba(74,21,19,0.15)] hover:shadow-lg border border-stone-200/60 flex items-center justify-center text-[#4A1513] hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${
              canScrollLeft
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Right Arrow Button (Aza Overlapping Style) */}
          <button
            onClick={() => scroll("right")}
            aria-label="Next items"
            disabled={!canScrollRight}
            className={`absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-[0px_2px_8px_rgba(74,21,19,0.15)] hover:shadow-lg border border-stone-200/60 flex items-center justify-center text-[#4A1513] hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${
              canScrollRight
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronRight size={18} />
          </button>

          {/* Reduced-size Cards Scroll Row (Aza Dimensions & Styling) */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-3 sm:gap-4 md:gap-5 pb-2 hide-scrollbar snap-x touch-pan-x scroll-smooth"
          >
            {SPOTLIGHT_CARDS.map((card) => (
              <div
                key={card.id}
                className="w-[140px] sm:w-[185px] md:w-[215px] lg:w-[235px] xl:w-[245px] shrink-0 snap-start"
              >
                <Link
                  href={card.link}
                  className="group block relative aspect-[3/4] w-full rounded-xl sm:rounded-2xl md:rounded-[22px] overflow-hidden bg-stone-100 shadow-[0px_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0px_6px_16px_rgba(0,0,0,0.14)] transition-all duration-300 border border-stone-200/40"
                >
                  {/* Card Image */}
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Soft bottom vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />

                  {/* Centered Name at the Bottom */}
                  <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-4 z-10 text-center">
                    <h3 className="font-serif text-[13px] sm:text-base md:text-lg text-white font-normal leading-snug tracking-wide drop-shadow-md group-hover:text-[#F3DFCA] transition-colors line-clamp-1">
                      {card.name}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
