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

        {/* Top-Left Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isNew && (
            <span className="bg-white text-primary text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 w-fit border border-zinc-200">NEW</span>
          )}
          {product.isTrending && (
            <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 w-fit">TRENDING</span>
          )}
          {!product.isTrending && product.rating > 4.5 && (
            <span className="bg-[#E78A7A] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 w-fit">BESTSELLER</span>
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
        {/* Size Selection Overlay on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20 bg-white/90 backdrop-blur-sm border-t border-zinc-200">
          <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted mb-2 text-center">Select Size</p>
          <div className="flex flex-wrap justify-center gap-2">
            {(product.sizes || ["S", "M", "L"]).map((size) => (
              <button 
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onQuickAdd) onQuickAdd({...product, sizes: [size]});
                }}
                className="w-8 h-8 rounded-full border border-zinc-300 bg-white flex items-center justify-center text-[10px] font-bold text-text-main hover:border-text-main hover:bg-text-main hover:text-white transition-colors"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Area */}
      <div className="flex flex-col flex-1 px-1">
        {/* Brand Display */}
        {(product as any).vendorName || product.brand ? (
          <h2 className="text-[12px] text-text-main font-bold uppercase tracking-widest mt-2 mb-1">
            {(product as any).vendorName || product.brand}
          </h2>
        ) : null}

        <h3 className="text-[12px] text-text-muted font-normal leading-snug line-clamp-1 mb-1">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-x-2 mt-auto">
          <span className="text-[12px] font-normal text-text-main">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-[12px] text-text-muted/60 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
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
