"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface LuxuryPromoBannerProps {
  title?: string;
  highlightText?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  imageSrc?: string;
  imageAlt?: string;
  objectPosition?: string;
}

export function LuxuryPromoBanner({
  title = "Shop Our",
  highlightText = "Latest Collection",
  description = "Discover elegance in every detail across our four curated departments",
  ctaText = "Shop Now",
  ctaLink = "/shop",
  imageSrc = "/banners/shop_banner_woman.jpg",
  imageAlt = "Shop Our Latest Collection",
  objectPosition = "object-right md:object-center",
}: LuxuryPromoBannerProps = {}) {
  return (
    <div className="w-full bg-[#F5ECE5] rounded-2xl md:rounded-3xl overflow-hidden mb-3 sm:mb-4 border border-stone-200/70 shadow-2xs">
      <div className="grid grid-cols-1 md:grid-cols-12 items-stretch min-h-[170px] sm:min-h-[190px] md:h-[220px]">
        {/* Left Side: Editorial Typography & CTA */}
        <div className="md:col-span-7 lg:col-span-8 px-6 py-5 sm:px-10 sm:py-6 lg:px-12 lg:py-6 flex flex-col justify-center items-start text-left z-10">
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-stone-900 font-semibold leading-tight tracking-tight">
            {title} <br className="hidden sm:inline" />
            <span className="font-normal italic">{highlightText}</span>
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 mt-2 font-sans max-w-md line-clamp-2 leading-relaxed">
            {description}
          </p>

          {ctaText && ctaLink && (
            <Link
              href={ctaLink}
              className="mt-3.5 sm:mt-4 inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-md bg-[#4A1513] hover:bg-[#380E0C] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs active:scale-95 cursor-pointer"
            >
              <span>{ctaText}</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* Right Side: Page / Category Specific Lifestyle Banner Image */}
        <div className="md:col-span-5 lg:col-span-4 h-[160px] md:h-full relative overflow-hidden flex justify-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt || title}
            className={`w-full h-full object-cover ${objectPosition} absolute inset-0`}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=800";
            }}
          />
          {/* Subtle gradient blending */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#F5ECE5] to-transparent pointer-events-none hidden md:block z-10" />
        </div>
      </div>
    </div>
  );
}
