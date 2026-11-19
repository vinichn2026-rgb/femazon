"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingCart, Eye, ArrowUpRight } from "lucide-react";

interface OccasionCard {
  id: string;
  title: string;
  shortName: string;
  badge: string;
  subBadge?: string;
  price: string;
  originalPrice: string;
  image: string;
  href: string;
  buttonType: "cart" | "view";
  buttonText: string;
}

const OCCASIONS: OccasionCard[] = [
  {
    id: "celebration-suits",
    title: "Celebration Suits | Elegant Embroidered Festive Anarkalis",
    shortName: "Celebration Suits",
    badge: "20% off",
    price: "₹2,499",
    originalPrice: "₹3,999",
    image: "/occasions/celebration_suits.jpg",
    href: "/shop?category=Kurta+Sets&occasion=Festive",
    buttonType: "cart",
    buttonText: "Add to Cart",
  },
  {
    id: "bridesmaid-collective",
    title: "The Bridesmaid Collective | Pastel Florals & Cape Drapes",
    shortName: "The Bridesmaid Collective",
    badge: "15% off",
    price: "₹4,890",
    originalPrice: "₹5,750",
    image: "/occasions/bridesmaid_collective.jpg",
    href: "/shop?category=Lehengas&occasion=Wedding&style=Bridesmaid",
    buttonType: "cart",
    buttonText: "Add to Cart",
  },
  {
    id: "shades-of-celebration",
    title: "The Shades of Celebration | Jewel Tones & Emerald Lehengas",
    shortName: "The Shades of Celebration",
    badge: "17% off",
    price: "₹3,999",
    originalPrice: "₹4,800",
    image: "/occasions/shades_of_celebration.jpg",
    href: "/shop?category=Lehengas&occasion=Sangeet",
    buttonType: "cart",
    buttonText: "Add to Cart",
  },
  {
    id: "wedding",
    title: "Wedding | Heritage Royal Zardozi & Bridal Grandeur",
    shortName: "Wedding",
    badge: "33% off",
    subBadge: "Min. order: 2 pcs",
    price: "₹8,999",
    originalPrice: "₹13,500",
    image: "/occasions/wedding.jpg",
    href: "/shop?category=Lehengas&occasion=Wedding",
    buttonType: "view",
    buttonText: "View Product",
  },
  {
    id: "reception",
    title: "Reception | Contemporary Silk Gowns & Haute Sherwanis",
    shortName: "Reception",
    badge: "50% off",
    price: "₹5,499",
    originalPrice: "₹10,999",
    image: "/occasions/reception.jpg",
    href: "/shop?category=Western+Wear&occasion=Reception",
    buttonType: "cart",
    buttonText: "Add to Cart",
  },
  {
    id: "sangeet",
    title: "Sangeet | High Glam Mirror Work & Twirling Silhouettes",
    shortName: "Sangeet",
    badge: "25% off",
    price: "₹4,299",
    originalPrice: "₹5,750",
    image: "/occasions/sangeet.jpg",
    href: "/shop?category=Lehengas&occasion=Sangeet",
    buttonType: "cart",
    buttonText: "Add to Cart",
  },
];

export function ShopByOccasion() {
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
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FDF7EF] via-[#FAF2E8] to-[#F5ECE0] py-6 sm:py-8 select-none border-b border-[#EEDFCF]">
      
      {/* Decorative ambient glow matching the reference image */}
      <div
        className="pointer-events-none absolute -left-20 top-10 w-96 h-96 rounded-full bg-[#FFFBF5]/70 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 top-0 w-[520px] h-[520px] rounded-full bg-[#F6E5D3]/60 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        
        {/* Header Section: Title and subtitle */}
        <div className="mb-4 sm:mb-6 max-w-2xl">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-1.5">
            CELEBRATION &amp; FESTIVE EDITS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-stone-900 tracking-wide leading-tight">
            Shop by Occasion
          </h2>
          <p className="mt-1.5 text-stone-500 text-xs sm:text-sm font-sans italic">
            Curated festive ensembles, celebration suits, cape drapes &amp; modern sarees.
          </p>
        </div>

        {/* Cards Carousel Container with Floating Next Arrow Button */}
        <div className="relative">
          
          {/* Floating Left Arrow (shows when scrolled right) */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] border border-stone-200/80 items-center justify-center text-stone-700 hover:text-black hover:scale-108 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
          )}

          {/* Floating Right Arrow Button matching the exact circular button in the screenshot */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-stone-200/90 items-center justify-center text-stone-700 hover:text-black hover:scale-108 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <ChevronRight size={17} strokeWidth={2.5} />
            </button>
          )}

          {/* Cards Track: horizontal scrollable row with exact card styling from the screenshot */}
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-3.5 overflow-x-auto hide-scrollbar pb-2.5 pt-0.5 px-0.5 scroll-smooth snap-x touch-pan-x"
          >
            {OCCASIONS.map((occ) => (
              <div
                key={occ.id}
                className="group relative shrink-0 w-[180px] sm:w-[195px] md:w-[205px] snap-start bg-white rounded-xl sm:rounded-2xl border border-stone-200/80 p-2 sm:p-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(42,15,20,0.12)] hover:border-stone-400/80 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Rounded Inside Corners & Corner Badges */}
                  <div className="relative aspect-square w-full rounded-lg sm:rounded-xl overflow-hidden bg-stone-100 mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={occ.image}
                      alt={occ.shortName}
                      loading="eager"
                      className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-106"
                    />

                    {/* Top-Left Dark Maroon Corner Badge (e.g. 20% off) */}
                    <span className="absolute top-1.5 left-1.5 bg-[#4A1513] text-white text-[8.5px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-xs shadow-xs uppercase tracking-wide">
                      {occ.badge}
                    </span>

                    {/* Optional Bottom-Left Secondary Badge (like "Min. order: 2 pcs" in Card 4) */}
                    {occ.subBadge && (
                      <span className="absolute bottom-1.5 left-1.5 bg-[#4A1513]/90 backdrop-blur-xs text-white text-[8px] font-medium px-1.5 py-0.5 rounded-xs shadow-xs">
                        {occ.subBadge}
                      </span>
                    )}
                  </div>

                  {/* Card Title (2-line clamp with exact font and hover color) */}
                  <h3 className="font-sans text-[11px] sm:text-[12px] font-medium text-stone-900 group-hover:text-[#4A1513] transition-colors leading-snug line-clamp-2 h-[28px] sm:h-[30px]">
                    {occ.title}
                  </h3>

                  {/* Price Row: Bold current price in crimson maroon + strikethrough original price */}
                  <div className="flex items-center gap-1.5 mt-1 font-sans">
                    <span className="font-bold text-[#4A1513] text-[11.5px] sm:text-xs">
                      {occ.price}
                    </span>
                    <span className="text-[10px] text-stone-400 line-through">
                      {occ.originalPrice}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Button matching the reference (Add to Cart / View Product) */}
                <Link
                  href={occ.href}
                  className="mt-2.5 w-full py-2 px-3 bg-white border border-[#4A1513]/40 hover:border-[#4A1513] hover:bg-[#4A1513] hover:text-white rounded-full text-[11px] font-bold text-[#4A1513] text-center transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs group/btn active:scale-95"
                >
                  {occ.buttonType === "view" ? (
                    <Eye size={12} className="text-[#4A1513] group-hover/btn:text-white transition-colors" />
                  ) : (
                    <ShoppingCart size={12} className="text-[#4A1513] group-hover/btn:text-white transition-colors" />
                  )}
                  <span>{occ.buttonText}</span>
                </Link>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Right "View all products" Pill Button matching the reference image */}
        <div className="mt-3.5 sm:mt-4 flex justify-end">
          <Link
            href="/shop?occasion=Wedding"
            className="group inline-flex items-center gap-1.5 bg-[#4A1513] hover:bg-[#350B0A] active:scale-98 text-white text-[11px] sm:text-xs font-semibold px-4 sm:px-5 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
          >
            <span>View all products</span>
            <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
