"use client";

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  variant?: 'navbar' | 'footer' | 'emblem' | 'light' | 'dark';
}

export function BrandLogo({ className = "", variant = 'navbar' }: BrandLogoProps) {
  if (variant === 'footer' || variant === 'light') {
    return (
      <Link href="/" className={`inline-flex items-center select-none group ${className}`} aria-label="Femazon Home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/femazon-logo-light.png"
          alt="Femazon Luxury Couture"
          className="h-9 sm:h-10 w-auto object-contain brightness-105 opacity-95 transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </Link>
    );
  }

  // Default navbar logo for white background: gold emblem + dark maroon text, 100% transparent background, perfectly sized
  return (
    <Link 
      href="/" 
      className={`inline-flex items-center shrink-0 select-none group focus:outline-none ${className}`}
      aria-label="Femazon Home"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/femazon-logo-transparent.png"
        alt="Femazon"
        className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
        style={{ maxHeight: '38px', height: '36px', width: 'auto' }}
      />
    </Link>
  );
}
