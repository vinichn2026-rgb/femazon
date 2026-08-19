"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { Heart, ChevronRight, ChevronLeft } from 'lucide-react';

interface Product {
  name: string;
  price: string;
  img: string;
  category?: string;
}

export function TrendingCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 lg:-translate-x-6 z-10 p-2 md:p-3 bg-white shadow-md rounded-full text-text-main hover:bg-primary hover:text-white transition hidden md:flex items-center justify-center border border-accent/20"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right Arrow */}
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 lg:translate-x-6 z-10 p-2 md:p-3 bg-white shadow-md rounded-full text-text-main hover:bg-primary hover:text-white transition hidden md:flex items-center justify-center border border-accent/20"
      >
        <ChevronRight size={20} />
      </button>

      <div ref={scrollRef} className="flex snap-x snap-mandatory gap-4 md:gap-6 overflow-x-auto pb-6 hide-scrollbar touch-pan-x">
        {products.map((product, idx) => (
          <div key={idx} className="w-[60%] sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] shrink-0 snap-start relative group/item flex flex-col">
            <Link href="/product/sample" className="block relative aspect-[4/5] w-full overflow-hidden bg-accent/5 mb-4 rounded-xl shadow-sm transition hover:shadow-md">
              <img 
                src={product.img} 
                alt={product.name} 
                className="w-full h-full object-cover transition duration-700 group-hover/item:scale-105"
              />
              {/* Hover Add to Cart overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-y-0">
                <button className="w-full bg-white/95 backdrop-blur-sm rounded-full text-text-main text-xs font-bold uppercase tracking-wider py-3 hover:bg-primary hover:text-white transition shadow-sm">
                  Add to Cart
                </button>
              </div>
            </Link>
            {/* Wishlist Button */}
            <button className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-md rounded-full text-text-main hover:text-primary transition z-10 shadow-sm hover:scale-110">
              <Heart size={16} strokeWidth={1.5} />
            </button>
            <Link href="/product/sample" className="px-1 mt-1">
              <h3 className="font-sans text-[14px] text-text-main group-hover/item:text-primary transition truncate">
                {product.name}
              </h3>
              <p className="font-sans text-[14px] font-bold text-text-main mt-1">
                {product.price}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
