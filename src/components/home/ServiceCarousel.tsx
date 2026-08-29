"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";

interface Service {
  title: string;
  img: string;
  desc: string;
}

export function ServiceCarousel({ services }: { services: Service[] }) {
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
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      
      {/* Left Navigation Arrow */}
      <button 
        onClick={() => scroll("left")}
        aria-label="Previous service"
        disabled={!canScrollLeft}
        className={`absolute -left-2 sm:-left-4 top-[150px] -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-[0px_2px_8px_rgba(74,21,19,0.15)] hover:shadow-lg border border-stone-200/60 flex items-center justify-center text-[#4A1513] hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${
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
        aria-label="Next service"
        disabled={!canScrollRight}
        className={`absolute -right-2 sm:-right-4 top-[150px] -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-[0px_2px_8px_rgba(74,21,19,0.15)] hover:shadow-lg border border-stone-200/60 flex items-center justify-center text-[#4A1513] hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${
          canScrollRight
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronRight size={18} />
      </button>

      <div ref={scrollRef} className="flex snap-x snap-mandatory gap-4 sm:gap-6 overflow-x-auto pb-3 hide-scrollbar touch-pan-x scroll-smooth px-1">
        {services.map((service, idx) => (
          <div key={idx} className="w-[72vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] shrink-0 snap-start flex flex-col group/item cursor-pointer">
            <Link href={`/services/${service.title.toLowerCase().replace(' ', '-')}`} className="flex flex-col items-center text-center">
              <div className="aspect-[4/3] w-full overflow-hidden bg-accent/5 mb-3 sm:mb-4 relative rounded-xl sm:rounded-2xl shadow-sm transition-all duration-500 hover:shadow-md border border-stone-200/50">
                <img 
                  src={service.img} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition duration-700 group-hover/item:scale-105"
                />
              </div>
              <h3 className="font-serif text-lg sm:text-2xl font-normal text-text-main tracking-wide mb-1 group-hover/item:text-[#4A1513] transition-colors line-clamp-1">
                {service.title}
              </h3>
              <p className="font-sans text-[11px] sm:text-[13px] text-text-muted mb-2.5 sm:mb-3.5 leading-relaxed max-w-[90%] line-clamp-2">
                {service.desc}
              </p>
              
              {/* Unified Classy Pill Button */}
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[#4A1513]/30 group-hover/item:border-[#4A1513] text-[#4A1513] group-hover/item:text-white group-hover/item:bg-[#4A1513] font-sans text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 shadow-sm">
                <span>Explore</span>
                <ArrowRight size={11} className="transition-transform duration-300 group-hover/item:translate-x-1" />
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
