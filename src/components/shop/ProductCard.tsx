"use client";

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

import { ProductType } from '@/data/products';

const COLOR_MAP: Record<string, string> = {
  "Black": "#4A1513",
  "White": "#FFFFFF",
  "Red": "#E53E3E",
  "Navy": "#2C5282",
  "Emerald Green": "#38A169",
  "Mustard": "#D69E2E",
  "Blush Pink": "#F687B3",
  "Lavender": "#B794F4",
  "Light Blue": "#A7C7E7"
};

interface ProductCardProps {
  product: ProductType;
  isWishlisted?: boolean;
  onQuickAdd?: (product: ProductType) => void;
  onToggleWishlist?: (productId: string, isCurrentlyWishlisted: boolean) => void;
}

export function ProductCard({ product, isWishlisted = false, onQuickAdd, onToggleWishlist }: ProductCardProps) {
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist?.(product.id, isWishlisted);
  };

  const images = product.images || ((product as any).image ? [(product as any).image] : ['https://via.placeholder.com/400x500?text=No+Image']);
  const hasSecondaryImage = images.length > 1;

  return (
    <Link href={`/products/${(product as any).slug || product.id}`} className="group flex flex-col cursor-pointer h-full">
      {/* Media Area */}
      <div className="relative w-full aspect-[3/4] bg-zinc-50 overflow-hidden mb-4">
        {/* Images with cross-fade hover */}
        <div className="w-full h-full relative">
          <img 
            src={images[0]} 
            alt={product.name} 
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 ${hasSecondaryImage ? 'group-hover:opacity-0' : ''}`}
          />
          {hasSecondaryImage && (
            <img 
              src={images[1]} 
              alt={`${product.name} Alternate`} 
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100 group-hover:scale-105"
            />
          )}
        </div>


        {/* Top-Right Wishlist */}
        <button 
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 p-1 flex items-center justify-center text-zinc-400 hover:text-[#E53E3E] transition-all duration-300 group/btn"
        >
          <Heart 
            size={18} 
            className={`transition-all duration-300 drop-shadow-sm ${isWishlisted ? 'fill-[#E53E3E] text-[#E53E3E]' : 'fill-white/30 hover:fill-white group-hover/btn:scale-110'}`} 
          />
        </button>
        {/* Size Selection Overlay on Hover (Including XL, XXL) */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20 bg-white/95 backdrop-blur-xs border-t border-stone-200 shadow-lg">
          <p className="text-[9.5px] uppercase font-bold tracking-widest text-[#4A1513] mb-1.5 text-center">Select Size</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {Array.from(new Set([...(product.sizes || ["XS", "S", "M", "L"]), "XL", "XXL"])).map((size) => (
              <button 
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onQuickAdd) onQuickAdd({...product, sizes: [size]});
                }}
                className="w-7 h-7 rounded-full border border-stone-300 bg-white flex items-center justify-center text-[9.5px] font-bold text-stone-800 hover:border-[#4A1513] hover:bg-[#4A1513] hover:text-white transition-colors cursor-pointer"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Area */}
      <div className="flex flex-col flex-1 px-0.5">
        {/* Aza-style Classy Pills below Image */}
        <div className="flex flex-col gap-1 mt-2.5 mb-1.5">
          {/* Row 1: Virtual Try-On & Shipping Info */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Virtual Try-On Pill */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-[#FAF3EC] text-[#2A2522] text-[11px] font-normal">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4A1513" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
              <span>Virtual Try-On</span>
            </span>

            {/* Ships in X Days / Ready to Ship Pill */}
            {product.readyToShip ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-[#FAF3EC] text-[#2A2522] text-[11px] font-normal">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4A1513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span>Ships in {product.deliveryDays || 3} days</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-[#FAF3EC] text-[#2A2522] text-[11px] font-normal">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4A1513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span>Ships in 7-10 days</span>
              </span>
            )}
          </div>

          {/* Row 2: Femazon Exclusive Pill */}
          {(product.isTrending || product.rating > 4.5 || (product as any).isExclusive) && (
            <div className="flex items-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded-[3px] bg-[#FAF3EC] text-[#4A1513] text-[11px] font-semibold tracking-normal">
                Femazon Exclusive
              </span>
            </div>
          )}
        </div>

        {/* Brand Display */}
        {(product as any).vendorName || product.brand ? (
          <h2 className="text-[12px] text-text-main font-bold uppercase tracking-widest mt-1 mb-0.5">
            {(product as any).vendorName || product.brand}
          </h2>
        ) : null}

        <h3 className="text-[12px] text-text-muted font-normal leading-snug line-clamp-1 mb-1">
          {product.name}
        </h3>
        
        <div className="flex flex-col gap-0.5 mt-auto pt-0.5">
          <div className="flex items-center gap-x-2">
            <span className="font-sans text-[12.5px] font-bold text-stone-900 tracking-tight tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="font-sans text-[11.5px] text-stone-400 line-through tabular-nums font-normal">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col animate-pulse h-full px-1">
      <div className="aspect-[3/4] w-full bg-zinc-100 rounded-[24px] mb-4"></div>
      <div className="h-4 bg-zinc-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-zinc-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-zinc-200 rounded w-1/4 mb-4"></div>
      <div className="flex justify-between items-center mt-auto">
        <div className="h-3 bg-zinc-200 rounded w-1/3"></div>
        <div className="flex gap-1.5">
          <div className="w-3.5 h-3.5 rounded-full bg-zinc-200"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-zinc-200"></div>
        </div>
      </div>
    </div>
  );
}
