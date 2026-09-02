"use client";

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  variant?: 'navbar' | 'footer' | 'emblem';
}

export function BrandLogo({ className = "", variant = 'navbar' }: BrandLogoProps) {
  if (variant === 'footer') {
    return (
      <Link href="/" className={`inline-flex flex-col items-start select-none group ${className}`}>
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/femazon-logo.png"
            alt="Femazon Luxury Couture"
            className="h-12 sm:h-14 w-auto object-contain brightness-0 invert opacity-95"
          />
        </div>
      </Link>
    );
  }

  return (
    <Link href="/" className={`flex items-center shrink-0 select-none group ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/femazon-logo.png"
        alt="Femazon Luxury Couture"
        className="h-16 sm:h-20 md:h-[84px] lg:h-[94px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
      />
    </Link>
  );
}
