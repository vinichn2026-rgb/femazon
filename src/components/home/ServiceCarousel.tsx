"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";

export interface FavouriteItem {
  id?: string;
  category?: string;
  title: string;
  desc: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  badge?: string;
  img: string;
  actionText?: string;
  href?: string;
}

export function ServiceCarousel({ services }: { services: FavouriteItem[] }) {
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
    <div className="relative group select-none">
      
      {/* Left Navigation Arrow */}
      {canScrollLeft && (
        <button 
          type="button"
          onClick={() => scroll("left")}
          aria-label="Previous item"
          className="absolute -left-2 sm:-left-3.5 top-[95px] -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-md hover:shadow-xl border border-stone-200/90 flex items-center justify-center text-[#4A1513] hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <ChevronLeft size={16} strokeWidth={2.2} />
        </button>
      )}

      {/* Right Navigation Arrow */}
      {canScrollRight && (
        <button 
          type="button"
          onClick={() => scroll("right")}
          aria-label="Next item"
          className="absolute -right-2 sm:-right-3.5 top-[95px] -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-md hover:shadow-xl border border-stone-200/90 flex items-center justify-center text-[#4A1513] hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <ChevronRight size={16} strokeWidth={2.2} />
        </button>
      )}

      {/* Compact Cards Track */}
      <div ref={scrollRef} className="flex snap-x snap-mandatory gap-3.5 sm:gap-4 overflow-x-auto pb-3 hide-scrollbar touch-pan-x scroll-smooth px-1">
        {services.map((item, idx) => {
          const itemHref = item.href || `/services/${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          const actionLabel = item.actionText || "Explore";

          return (
            <div 
              key={idx} 
              className="w-[220px] sm:w-[240px] md:w-[250px] shrink-0 snap-start bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-stone-200/70 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group/card"
            >
              <div>
                {/* Compact Image Container with Badges */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition duration-700 ease-out group-hover/card:scale-106"
                  />
                  {item.badge && (
                    <span className="absolute top-2 left-2 bg-[#4A1513]/90 backdrop-blur-xs text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Compact Content Section */}
                <div className="p-3 sm:p-3.5 pb-1.5">
                  {item.category && (
                    <span className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-[#4A1513] block mb-0.5">
                      {item.category}
                    </span>
                  )}

                  <h3 className="font-serif text-sm sm:text-[15px] font-normal text-stone-900 group-hover/card:text-[#4A1513] transition-colors leading-snug line-clamp-1 mb-1">
                    {item.title}
                  </h3>

                  <p className="font-sans text-[10.5px] sm:text-[11px] text-stone-500 line-clamp-2 leading-relaxed mb-2">
                    {item.desc}
                  </p>

                  {/* Compact Price Row */}
                  {item.price && (
                    <div className="flex items-baseline gap-1.5 mb-1.5">
                      <span className="font-serif text-sm sm:text-base font-bold text-stone-900">
                        {item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="text-[11px] text-stone-400 line-through">
                          {item.originalPrice}
                        </span>
                      )}
                      {item.discount && (
                        <span className="text-[8.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1 py-0.2 rounded-xs">
                          {item.discount}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Classy Proportional Action Button (balanced width & height, same rounded-full radius) */}
              <div className="p-3.5 sm:p-4 pt-1 flex justify-center">
                <Link
                  href={itemHref}
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-2 sm:py-2.5 rounded-full bg-[#4A1513] hover:bg-[#350B0A] text-white font-sans text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  <span>{actionLabel}</span>
                  <ArrowRight size={12} className="transition-transform duration-300 group-hover/card:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
