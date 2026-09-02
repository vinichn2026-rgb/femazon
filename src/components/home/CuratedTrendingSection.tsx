"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface CuratedStory {
  id: string;
  headingText: string;
  subText: string;
  badge: string;
  image: string;
  buttonText: string;
  link: string;
}

const CURATED_STORIES: CuratedStory[] = [
  {
    id: "1",
    headingText: "Festive in Brocade",
    subText: "Opulent handwoven Banarasi weaves & regal zari silhouettes",
    badge: "HERITAGE COUTURE",
    image: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?q=80&w=800&h=1200&auto=format&fit=crop&crop=top",
    buttonText: "Shop Now",
    link: "/shop?category=Ethnic",
  },
  {
    id: "2",
    headingText: "Shades of Celebration",
    subText: "Vibrant emeralds, rubies & jewel tones for festive nights",
    badge: "FESTIVE '26",
    image: "https://images.unsplash.com/photo-1583391733958-d15ce1711202?q=80&w=800&h=1200&auto=format&fit=crop&crop=top",
    buttonText: "Shop Now",
    link: "/shop?category=Ethnic",
  },
  {
    id: "3",
    headingText: "The New Age Desi",
    subText: "Effortless contemporary co-ords and modern Indo-western fusion",
    badge: "TRENDING",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&h=1200&auto=format&fit=crop&crop=top",
    buttonText: "Shop Now",
    link: "/shop?category=Co-ords",
  },
  {
    id: "4",
    headingText: "The Wedding Guest Edit",
    subText: "Pre-draped sarees, statement shararas & celebratory anarkalis",
    badge: "WEDDING EDIT",
    image: "https://images.unsplash.com/photo-1599746146388-a7ec2004b67a?q=80&w=800&h=1200&auto=format&fit=crop&crop=top",
    buttonText: "Shop Now",
    link: "/collections/wedding-edit",
  },
  {
    id: "5",
    headingText: "Cotton Classics",
    subText: "Breezy artisanal kurtas & lightweight luxury everyday fits",
    badge: "SUMMER ESSENTIALS",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&h=1200&auto=format&fit=crop&crop=top",
    buttonText: "Shop Now",
    link: "/shop",
  },
  {
    id: "6",
    headingText: "Easy-Breezy Kaftans",
    subText: "Flowy printed resort drapes crafted for luxurious comfort",
    badge: "RESORT GLAM",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&h=1200&auto=format&fit=crop&crop=top",
    buttonText: "Shop Now",
    link: "/shop?category=Dresses",
  },
];

export function CuratedTrendingSection() {
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
    <section id="curated" className="pt-5 lg:pt-7 pb-5 lg:pb-7 bg-white border-b border-stone-100 select-none scroll-mt-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        
        {/* Section Header: "Curated For You" Tag + "Trending Now" Title in Maroon */}
        <div className="flex items-end justify-between mb-3.5 sm:mb-4">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-1">
              Curated For You
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-[30px] text-[#3D110F] font-normal tracking-tight">
              Trending Now
            </h2>
          </div>

          <Link
            href="/shop"
            className="group inline-flex items-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-bold text-[#4A1513] hover:text-[#2B0E0D] transition-colors"
          >
            <span>View All</span>
            <ChevronRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Carousel Container with Overlapping Navigation Arrows */}
        <div className="relative group/carousel">
          
          {/* Left Navigation Arrow */}
          <button
            onClick={() => scroll("left")}
            aria-label="Previous story"
            disabled={!canScrollLeft}
            className={`absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-[0px_2px_8px_rgba(74,21,19,0.15)] hover:shadow-lg border border-stone-200/60 flex items-center justify-center text-[#4A1513] hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${
              canScrollLeft
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Right Navigation Arrow */}
          <button
            onClick={() => scroll("right")}
            aria-label="Next story"
            disabled={!canScrollRight}
            className={`absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-[0px_2px_8px_rgba(74,21,19,0.15)] hover:shadow-lg border border-stone-200/60 flex items-center justify-center text-[#4A1513] hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${
              canScrollRight
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronRight size={18} />
          </button>

          {/* Editorial Cards Carousel in White & Maroon Theme */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-3 sm:gap-4 md:gap-5 pb-2 hide-scrollbar snap-x touch-pan-x scroll-smooth"
          >
            {CURATED_STORIES.map((story) => (
              <div
                key={story.id}
                className="w-[145px] sm:w-[195px] md:w-[225px] lg:w-[245px] xl:w-[255px] shrink-0 snap-start"
              >
                <Link
                  href={story.link}
                  className="group/card block relative aspect-[3/4] w-full rounded-md overflow-hidden bg-stone-100 shadow-[0px_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0px_8px_22px_rgba(74,21,19,0.2)] transition-all duration-500 border border-stone-200/50 cursor-pointer"
                >
                  {/* Campaign Image */}
                  <img
                    src={story.image}
                    alt={story.headingText}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover/card:scale-108"
                  />

                  {/* Soft Royal Maroon-Black Vignette Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#230908]/95 via-[#230908]/40 to-transparent opacity-85 group-hover/card:opacity-95 transition-opacity duration-500" />

                  {/* Top Badge in White & Maroon */}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
                    <span className="inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xs bg-white/95 text-[#4A1513] text-[7.5px] sm:text-[9px] font-bold uppercase tracking-[0.18em] shadow-sm border border-stone-100">
                      {story.badge}
                    </span>
                  </div>

                  {/* Bottom Editorial Content */}
                  <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-4 z-10 text-white flex flex-col justify-end">
                    <h3 className="font-serif text-[13.5px] sm:text-lg md:text-xl text-white font-normal leading-tight tracking-tight mb-0.5 sm:mb-1 group-hover/card:text-[#F8EAE1] transition-colors line-clamp-1">
                      {story.headingText}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-stone-200/90 line-clamp-1 font-light mb-2 sm:mb-3 leading-relaxed">
                      {story.subText}
                    </p>

                    {/* Classy Pill "Shop Now" Button with consistent light rounded-sm */}
                    <div className="pt-0.5">
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/95 text-[#3D110F] px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-sm font-sans text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.18em] shadow-sm transition-all duration-300 group-hover/card:bg-[#3D110F] group-hover/card:text-white group-hover/card:border-white/50 border border-white/80">
                        <span>{story.buttonText}</span>
                        <ArrowRight size={11} className="transition-transform duration-300 group-hover/card:translate-x-1" />
                      </span>
                    </div>
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
