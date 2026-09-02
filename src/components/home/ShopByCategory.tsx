"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategoryItem {
  title: string;
  slug: string;
  img: string;
}

const CATEGORIES_DATA: CategoryItem[] = [
  {
    title: "Footwear",
    slug: "footwear",
    img: "/categories/footwear.jpg",
  },
  {
    title: "Handbags",
    slug: "handbags",
    img: "/categories/handbags.jpg",
  },
  {
    title: "Potlis",
    slug: "potlis",
    img: "/categories/potlis.jpg",
  },
  {
    title: "Shawls",
    slug: "shawls",
    img: "/categories/shawls.jpg",
  },
  {
    title: "Hair Accessories",
    slug: "hair-accessories",
    img: "/categories/hair_accessories.jpg",
  },
  {
    title: "Stoles & Scarves",
    slug: "stoles-scarves",
    img: "/categories/stoles_scarves.jpg",
  },
  {
    title: "Belts",
    slug: "belts",
    img: "/categories/belts.jpg",
  },
];

export function ShopByCategory() {
  return (
    <section className="pt-5 lg:pt-7 pb-5 lg:pb-7 bg-white border-b border-stone-100 select-none">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        
        {/* Centered Title matching the reference */}
        <div className="flex items-center justify-center mb-4 sm:mb-5">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-[32px] text-[#2B1311] font-normal tracking-tight text-center">
            Shop By Category
          </h2>
        </div>

        {/* 7 Circular Category Avatars Row */}
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto gap-3.5 sm:gap-5 md:gap-6 lg:gap-7 pb-2 hide-scrollbar snap-x touch-pan-x px-1">
          {CATEGORIES_DATA.map((cat, idx) => (
            <Link
              key={idx}
              href={`/shop?category=${encodeURIComponent(cat.title)}`}
              className="group flex flex-col items-center shrink-0 snap-start w-[85px] sm:w-[105px] md:w-[125px] lg:w-[135px]"
            >
              {/* Circular Avatar Container with soft shadow */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 rounded-full overflow-hidden shadow-[0px_3px_10px_rgba(0,0,0,0.10)] border border-stone-200/60 bg-stone-50 p-0.5 transition-shadow duration-300 group-hover:shadow-[0px_6px_18px_rgba(74,21,19,0.18)]">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Category Title Below */}
              <h3 className="font-sans text-[11px] sm:text-xs md:text-[13.5px] text-stone-800 group-hover:text-primary transition-colors font-normal tracking-normal text-center mt-2 leading-snug line-clamp-1">
                {cat.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* Centered "View All" Button at the bottom */}
        <div className="mt-3.5 sm:mt-5 flex justify-center">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-1.5 border border-[#3D110F]/30 hover:border-[#3D110F] text-[#3D110F] hover:text-white hover:bg-[#3D110F] px-5 sm:px-8 py-2 sm:py-2.5 rounded-sm font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-sm active:scale-95 text-center cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
