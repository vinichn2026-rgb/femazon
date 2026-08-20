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

  const images = product.images || (product.image ? [product.image] : ['https://via.placeholder.com/400x500?text=No+Image']);
  const hasSecondaryImage = images.length > 1;

  return (
    <Link href={`/product/${product.id}`} className="group flex flex-col cursor-pointer h-full">
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
          className="absolute top-4 right-4 z-10 p-2 flex items-center justify-center text-zinc-400 hover:text-[#E53E3E] transition-all duration-300 group/btn bg-white/80 hover:bg-white backdrop-blur-sm border border-zinc-200"
        >
          <Heart 
            size={16} 
            className={`transition-all duration-300 ${isWishlisted ? 'fill-[#E53E3E] text-[#E53E3E]' : 'group-hover/btn:scale-110'}`} 
          />
        </button>
      </div>

      {/* Product Details Area */}
      <div className="flex flex-col flex-1 px-1">
        <h3 className="text-[13px] md:text-[14px] text-primary font-bold leading-snug line-clamp-1 hover:text-zinc-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Vendor/Brand Display */}
        {(product as any).vendorName || product.brand ? (
          <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-widest mt-1 mb-2">
            {(product as any).vendorName || product.brand}
          </p>
        ) : null}

        <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1 mb-1.5">
          <span className="text-[14px] md:text-[15px] font-bold text-primary">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice > product.price && (
            <>
              <span className="text-[12px] text-zinc-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] font-bold text-[#E53E3E]">
                {product.discount}% OFF
              </span>
            </>
          )}
        </div>

        {/* Sizes and Color Swatches */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-100">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Sizes: XS - XXL
          </span>

          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((colorName, idx) => {
                const hex = COLOR_MAP[colorName] || "#E2E8F0";
                return (
                  <div 
                    key={idx}
                    className="w-3 h-3 rounded-full border border-zinc-200"
                    style={{ backgroundColor: hex }}
                    title={colorName}
                  />
                );
              })}
            </div>
          )}
        </div>
        
        {/* Add to Bag Button */}
        <button className="mt-4 w-full bg-transparent hover:bg-primary text-primary hover:text-white border border-primary transition-colors py-2.5 text-[11px] font-bold uppercase tracking-widest">
          Add to Bag
        </button>
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
