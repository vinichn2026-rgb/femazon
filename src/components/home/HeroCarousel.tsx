"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2070&auto=format&fit=crop",
    title: "The Festive Edit",
    subtitle: "Up to 50% Off",
    link: "/products?category=festive"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
    title: "New Arrivals",
    subtitle: "Discover the latest trends",
    link: "/products?sort=newest"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070&auto=format&fit=crop",
    title: "Luxury Collection",
    subtitle: "Exclusive Designer Wear",
    link: "/products?category=luxury"
  }
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  return (
    <section className="w-full relative px-0 mt-0 mb-12 h-[40vh] min-h-[350px] overflow-hidden group">
      {slides.map((slide, idx) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <Link href={slide.link} className="block w-full h-full relative">
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
            />
            {/* Subtle gradient fading in from the right to make text readable */}
            <div className="absolute inset-0 bg-gradient-to-l from-surface/95 via-surface/60 to-transparent"></div>
            
            {/* Elegant Offer Text overlay on the right side */}
            <div className="absolute right-0 top-0 h-full w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a85b9b] mb-4 drop-shadow-sm">Limited Time</span>
              <h1 className="font-serif text-3xl md:text-5xl font-normal text-text-main tracking-widest uppercase mb-2">
                {slide.title}
              </h1>
              <h2 className="font-sans text-xl md:text-2xl font-light text-text-main mb-8 tracking-wide">
                {slide.subtitle}
              </h2>
              <span className="inline-block border-b border-text-main pb-1 text-[11px] uppercase tracking-[0.2em] font-bold text-text-main transition hover:text-[#a85b9b] hover:border-[#a85b9b]">
                Shop Now
              </span>
            </div>
          </Link>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/30 hover:bg-white text-text-main rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/30 hover:bg-white text-text-main rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={20} strokeWidth={1.5} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === current ? 'bg-[#a85b9b] w-6' : 'bg-text-main/20 hover:bg-text-main/50'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
