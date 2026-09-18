'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function AdminPageTransitionBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  // Reset loading once new page path/query arrives
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  // Intercept navigation clicks
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (
        href &&
        !href.startsWith('#') &&
        !href.startsWith('javascript:') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        target.getAttribute('target') !== '_blank'
      ) {
        const currentUrl = window.location.pathname + window.location.search;
        if (href !== currentUrl) {
          setIsNavigating(true);
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  if (!isNavigating) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#4A1513] flex flex-col items-center justify-center p-6 text-white animate-in fade-in duration-150 pointer-events-auto">
      {/* Prominent Maroon & White Spinner */}
      <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-4 border-white/20 border-t-white animate-spin" />
        <div className="absolute w-12 h-12 rounded-full border-2 border-white/10 border-b-white animate-spin [animation-direction:reverse] [animation-duration:1.2s]" />
      </div>

      {/* Brand Title in White */}
      <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-[0.3em] text-white mb-2">
        FEMAZON
      </h2>
      
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
        ADMIN
      </p>
    </div>
  );
}
