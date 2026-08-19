"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, ShoppingBag } from 'lucide-react';

import { ProductType } from '@/data/products';

const COLOR_MAP: Record<string, string> = {
  "Black": "#000000",
  "White": "#FFFFFF",
  "Red": "#E53E3E",
  "Navy": "#2C5282",
  "Emerald Green": "#38A169",
  "Mustard": "#D69E2E",
  "Blush Pink": "#F687B3",
  "Lavender": "#B794F4"
};

interface ProductCardProps {
  product: ProductType;
  onQuickAdd?: (product: ProductType) => void;
  onToggleWishlist?: (productId: string) => void;
}

export function ProductCard({ product, onQuickAdd, onToggleWishlist }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onToggleWishlist?.(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickAdd?.(product);
  };

  const hasSecondaryImage = product.images.length > 1;

  return (
    <Link href={`/product/${product.id}`} className="group flex flex-col cursor-pointer h-full">
      {/* Media Area */}
      <div className="relative w-full aspect-[4/5] bg-accent/5 rounded-xl overflow-hidden mb-4">
        {/* Images with cross-fade hover */}
        <div className="w-full h-full relative">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${hasSecondaryImage ? 'group-hover:opacity-0' : ''}`}
          />
          {hasSecondaryImage && (
            <img 
              src={product.images[1]} 
              alt={`${product.name} Alternate`} 
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
            />
          )}
        </div>

        {/* Top-Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-white text-text-main text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-sm">New</span>
          )}
          {product.isTrending && (
            <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-sm">Trending</span>
          )}
        </div>

        {/* Top-Right Wishlist */}
        <button 
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-text-muted hover:text-primary hover:bg-white transition-all duration-300 group/btn"
        >
          <Heart 
            size={16} 
            className={`transition-all duration-300 ${isWishlisted ? 'fill-primary text-primary scale-110' : 'group-hover/btn:scale-110'}`} 
          />
        </button>

        {/* Bottom Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button 
            onClick={handleQuickAdd}
            className="w-full bg-white/95 backdrop-blur-sm text-text-main font-bold text-[12px] uppercase tracking-widest py-3.5 rounded-full shadow-lg hover:bg-text-main hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} /> Quick Add
          </button>
        </div>
      </div>

      {/* Product Details Area */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted truncate mr-2">
            {product.brand}
          </span>
          <div className="flex items-center gap-1 shrink-0 bg-[#fbf9f6] px-1.5 py-0.5 rounded text-[10px] font-bold text-text-main">
            <Star size={10} className="fill-current text-[#D69E2E]" />
            <span>{product.rating}</span>
            <span className="text-text-muted">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="text-[13px] md:text-[14px] text-text-main font-medium leading-snug line-clamp-2 mb-2 hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-3 mt-auto">
          <span className="text-[14px] md:text-[15px] font-bold text-text-main">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice > product.price && (
            <>
              <span className="text-[12px] text-text-muted line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-[#E53E3E] tracking-wider">
                ({product.discount}% OFF)
              </span>
            </>
          )}
        </div>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-auto">
            {product.colors.map((colorName, idx) => {
              const hex = COLOR_MAP[colorName] || "#E2E8F0";
              return (
                <div 
                  key={idx}
                  className="w-3.5 h-3.5 rounded-full border border-accent/20 transition-transform hover:scale-110 shadow-sm"
                  style={{ backgroundColor: hex }}
                  title={colorName}
                />
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col animate-pulse h-full">
      <div className="aspect-[4/5] w-full bg-accent/10 rounded-xl mb-4"></div>
      <div className="h-3 bg-accent/10 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-accent/10 rounded w-full mb-1"></div>
      <div className="h-4 bg-accent/10 rounded w-2/3 mb-4"></div>
      <div className="h-4 bg-accent/10 rounded w-1/2 mt-auto"></div>
    </div>
  );
}
