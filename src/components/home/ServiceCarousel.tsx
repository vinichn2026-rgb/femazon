"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Service {
  title: string;
  img: string;
  desc: string;
}

export function ServiceCarousel({ services }: { services: Service[] }) {
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
        className="absolute left-0 top-[175px] -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 p-2 md:p-3 bg-white shadow-md rounded-full text-text-main hover:bg-primary hover:text-white transition hidden md:flex items-center justify-center border border-accent/20"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right Arrow */}
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-[175px] -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 p-2 md:p-3 bg-white shadow-md rounded-full text-text-main hover:bg-primary hover:text-white transition hidden md:flex items-center justify-center border border-accent/20"
      >
        <ChevronRight size={20} />
      </button>

      <div ref={scrollRef} className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 hide-scrollbar">
        {services.map((service, idx) => (
          <div key={idx} className="w-[85vw] md:w-[calc(33.333%-16px)] shrink-0 snap-start flex flex-col group/item cursor-pointer">
            <Link href={`/services/${service.title.toLowerCase().replace(' ', '-')}`} className="flex flex-col items-center text-center">
              <div className="aspect-[4/3] w-full overflow-hidden bg-accent/5 mb-6 relative rounded-2xl shadow-sm transition hover:shadow-md">
                <img 
                  src={service.img} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition duration-700 group-hover/item:scale-105"
                />
              </div>
              <h3 className="font-serif text-2xl font-normal text-text-main tracking-wide mb-2 group-hover/item:text-primary transition">
                {service.title}
              </h3>
              <p className="font-sans text-[15px] text-text-muted mb-4 leading-relaxed max-w-[90%]">
                {service.desc}
              </p>
              <span className="text-[14px] font-sans text-text-main border-b border-text-main pb-1 transition group-hover/item:text-primary group-hover/item:border-primary">
                Explore →
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
