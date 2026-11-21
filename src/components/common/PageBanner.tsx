"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface PageBannerProps {
  title: string;
  highlightText?: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  imageSrc: string;
  imageAlt?: string;
  fallbackImage?: string;
  className?: string;
  imagePosition?: string;
}

export function PageBanner({
  title,
  highlightText,
  description,
  ctaText,
  ctaLink,
  imageSrc,
  imageAlt,
  fallbackImage = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=800",
  className = "",
  imagePosition = "",
}: PageBannerProps) {
  const marginClass = className.includes('mb-') ? '' : 'mb-3 sm:mb-4';
  return (
    <div
      className={`w-full bg-[#F5ECE5] rounded-2xl md:rounded-3xl overflow-hidden ${marginClass} border border-stone-200/70 shadow-2xs ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 items-center min-h-[180px] sm:min-h-[200px] md:h-[225px]">
        {/* Left Side: Editorial Typography & CTA */}
        <div className="md:col-span-7 lg:col-span-8 px-6 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-6 flex flex-col justify-center items-start text-left h-full">
          <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-semibold leading-tight tracking-tight">
            {title}{" "}
            {highlightText && (
              <>
                <br className="hidden sm:inline" />
                <span className="font-normal italic">{highlightText}</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 mt-1.5 font-sans max-w-md line-clamp-2 leading-relaxed">
            {description}
          </p>

          {ctaText && ctaLink && (
            <Link
              href={ctaLink}
              className="mt-3 sm:mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#4A1513] hover:bg-[#380E0C] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs active:scale-95 cursor-pointer"
            >
              <span>{ctaText}</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* Right Side: Page-Specific Lifestyle Image */}
        <div className="md:col-span-5 lg:col-span-4 h-[160px] md:h-full relative overflow-hidden flex justify-end self-stretch">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt || title}
            className={`absolute inset-0 h-full w-full object-cover ${
              imagePosition || "object-right md:object-center"
            }`}
            onError={(e) => {
              if (fallbackImage) {
                (e.target as HTMLImageElement).src = fallbackImage;
              }
            }}
          />
          {/* Subtle gradient blending matching Shop page reference */}
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#F5ECE5] to-transparent pointer-events-none hidden md:block z-10" />
        </div>
      </div>
    </div>
  );
}
