"use client";

import { useState } from 'react';
import Link from 'next/link';

const categories = ["All Services", "Beauty", "Styling", "Wedding", "Events", "Shopping"];

const allServices = [
  { 
    id: 1, 
    title: 'Bridal Makeup', 
    category: 'Wedding', 
    desc: 'Expert bridal artistry with luxury finishes for your special day.', 
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop', 
    size: 'large' 
  },
  { 
    id: 2, 
    title: 'Personal Styling', 
    category: 'Styling', 
    desc: 'Find a look that feels authentically you with our expert stylists.', 
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop', 
    size: 'medium' 
  },
  { 
    id: 3, 
    title: 'Mehndi Artistry', 
    category: 'Beauty', 
    desc: 'Handcrafted designs featuring intricate traditional florals.', 
    img: 'https://images.unsplash.com/photo-1560031802-9a741366b26c?q=80&w=800&auto=format&fit=crop', 
    size: 'medium' 
  },
  { 
    id: 4, 
    title: 'Event Photography', 
    category: 'Events', 
    desc: 'Professional editorial coverage for your special moments.', 
    img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop', 
    size: 'large' 
  },
  { 
    id: 5, 
    title: 'Shopping Assistant', 
    category: 'Shopping', 
    desc: 'Get personal help while you shop for the perfect outfit.', 
    img: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=800&auto=format&fit=crop', 
    size: 'medium' 
  },
  { 
    id: 6, 
    title: 'Salon & Hair', 
    category: 'Beauty', 
    desc: 'Relax and rejuvenate with our premium treatments.', 
    img: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop', 
    size: 'medium' 
  },
];

export function FeaturedServices() {
  const [activeTab, setActiveTab] = useState("All Services");

  const filtered = activeTab === "All Services" 
    ? allServices 
    : allServices.filter(s => s.category === activeTab || (activeTab === 'Beauty' && s.title.includes('Makeup')));

  return (
    <div className="w-full">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-6 py-2.5 rounded-full text-[12px] font-bold uppercase tracking-wider transition ${
              activeTab === cat 
                ? 'bg-text-main text-white shadow-md' 
                : 'bg-transparent text-text-muted hover:text-text-main hover:bg-accent/10 border border-transparent hover:border-accent/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[300px]">
        {filtered.map((service) => {
          let colSpan = 'md:col-span-4';
          let rowSpan = 'row-span-1';
          
          if (service.size === 'large') {
            colSpan = 'md:col-span-8';
            rowSpan = 'row-span-2';
          } else if (service.size === 'medium') {
            colSpan = 'md:col-span-4';
            rowSpan = 'row-span-2';
          }

          if (filtered.length <= 2) {
             colSpan = 'md:col-span-6';
             rowSpan = 'row-span-2';
          }

          return (
            <Link 
              href={`/services/${service.title.toLowerCase().replace(/ /g, '-')}`} 
              key={service.id}
              className={`${colSpan} ${rowSpan} group relative rounded-3xl overflow-hidden bg-accent/5 flex flex-col justify-end shadow-sm hover:shadow-lg transition-all duration-500`}
            >
              <img 
                src={service.img} 
                alt={service.title} 
                className="absolute inset-0 w-full h-full object-cover transition duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6D5B8] mb-3 block">
                  {service.category}
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-white mb-3">{service.title}</h3>
                <p className="font-sans text-[15px] text-white/90 mb-5 max-w-md leading-relaxed">{service.desc}</p>
                <span className="inline-flex items-center text-[13px] font-bold uppercase tracking-widest text-white group-hover:text-[#DCAE96] transition-colors">
                  Explore Service <span className="ml-2 text-lg leading-none">→</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-20 text-text-muted">
          No featured services found for this category. Please check "Explore All Services" below.
        </div>
      )}
    </div>
  );
}
