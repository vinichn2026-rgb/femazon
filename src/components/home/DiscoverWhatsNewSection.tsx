"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";

interface WhatsNewCategory {
  id: string;
  title: string;
  description: string;
  actionText: string;
  href: string;
  image: string;
  badge?: string;
}

const CATEGORIES: WhatsNewCategory[] = [
  {
    id: "womens-wear",
    title: "Latest Women's Wear",
    description: "Discover new arrivals from boutiques, designer collections and trending fashion labels.",
    actionText: "Shop Now",
    href: "/womens-wear",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=600",
    badge: "NEW ARRIVALS",
  },
  {
    id: "beauty",
    title: "Beauty & Self-care Essentials",
    description: "Explore the latest skincare, makeup, haircare and everyday beauty products.",
    actionText: "Shop Now",
    href: "/beauty",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=85&w=600",
    badge: "CLEAN BEAUTY",
  },
  {
    id: "styling",
    title: "Personal Styling Services",
    description: "Meet professional stylists, explore their portfolios and discover personalised styling packages.",
    actionText: "Book Now",
    href: "/professionals",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=85&w=600",
    badge: "VERIFIED STYLISTS",
  },
  {
    id: "gifts",
    title: "Gifts for Every Occasion",
    description: "Find beautiful birthday gifts, anniversary surprises, wedding gifts and personalised hampers.",
    actionText: "Explore Gifts",
    href: "/gifts",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=85&w=600",
    badge: "CURATED HAMPERS",
  },
];

export function DiscoverWhatsNewSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -250 : 250;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-white py-8 sm:py-12 md:py-14 select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Outer Card Container with rich velvet-maroon gradient and subtle gold hairline border */}
      <div className="w-full bg-gradient-to-br from-[#4A1513] via-[#380E0C] to-[#4A1513] rounded-3xl p-5 sm:p-7 md:p-8 border border-[#E8C8A3]/25 shadow-xl flex flex-col lg:flex-row items-center gap-6 sm:gap-7 lg:gap-9 relative overflow-hidden">
        
        {/* Ambient Champagne & Rose Gold Lighting Shimmers */}
        <div 
          className="pointer-events-none absolute -left-20 -top-20 w-80 h-80 rounded-full bg-[#E8C8A3]/10 blur-3xl" 
          aria-hidden="true" 
        />
        <div 
          className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#4A1513]/20 blur-3xl" 
          aria-hidden="true" 
        />
        <div 
          className="pointer-events-none absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-40 bg-[#E8C8A3]/5 blur-3xl rotate-12" 
          aria-hidden="true" 
        />

        {/* Left Editorial Content Area */}
        <div className="w-full lg:w-[270px] xl:w-[300px] shrink-0 flex flex-col justify-center text-center lg:text-left z-10">
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
            <span className="w-4 h-[1px] bg-[#E8C8A3]/70 hidden sm:inline-block"></span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E8C8A3]">
              Exclusively Curated
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-[30px] font-normal text-[#FBF7F2] tracking-wide leading-tight mb-2.5">
            Discover What&apos;s New <span className="italic font-light text-[#E8C8A3]">at Femazon</span>
          </h2>

          <p className="text-[#D6C1AE] text-xs sm:text-[13px] font-sans font-light italic leading-relaxed mb-5 max-w-sm mx-auto lg:mx-0">
            Explore the latest arrivals, trending styles, beauty essentials and thoughtfully curated gifts — all in one place.
          </p>

          <div className="flex justify-center lg:justify-start">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full bg-[#FBF7F2] hover:bg-white text-[#4A1513] hover:text-[#350B0A] text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-xl w-fit cursor-pointer active:scale-95"
            >
              <span>Explore More</span>
              <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Right Carousel Track */}
        <div className="w-full lg:flex-1 relative min-w-0 z-10">
          
          {/* Previous Arrow Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous category"
              className="absolute -left-2 sm:-left-3.5 top-[40%] -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF7F2] hover:bg-white text-[#4A1513] shadow-xl border border-[#E8C8A3]/40 flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft size={16} strokeWidth={2.2} />
            </button>
          )}

          {/* Next Arrow Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next category"
              className="absolute -right-2 sm:-right-3.5 top-[40%] -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF7F2] hover:bg-white text-[#4A1513] shadow-xl border border-[#E8C8A3]/40 flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              <ChevronRight size={16} strokeWidth={2.2} />
            </button>
          )}

          {/* Cards Track: Warm Ivory Luxury Cards */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-4.5 overflow-x-auto hide-scrollbar py-2 px-1 scroll-smooth snap-x touch-pan-x"
          >
            {CATEGORIES.map((item) => (
              <div
                key={item.id}
                className="group relative w-[205px] sm:w-[220px] md:w-[230px] shrink-0 snap-start bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#E8D9C8]/80 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  {/* Card Image with Frosted Luxury Badge */}
                  <div className="relative aspect-[4/3.3] w-full overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-106"
                    />
                    {item.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-[#4A1513]/85 backdrop-blur-md text-[#F5EBE1] border border-white/20 text-[8px] font-medium tracking-[0.2em] px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5 sm:p-4">
                    <h3 className="font-serif text-sm sm:text-[14.5px] font-medium text-stone-900 group-hover:text-[#4A1513] transition-colors leading-snug tracking-wide line-clamp-1 mb-1.5">
                      {item.title}
                    </h3>
                    <p className="font-sans text-[11px] text-stone-600 font-light line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Button (Classy rounded-full pill matching all CTA buttons) */}
                <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-1 flex justify-start">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-[#4A1513] text-[#4A1513] hover:text-white border border-[#4A1513]/25 font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] transition-all duration-300 shadow-2xs hover:shadow-xs cursor-pointer active:scale-95 group/btn"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight size={11} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
      </div>
    </section>
  );
}
