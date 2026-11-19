import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const MOCK_INSTAGRAM_FEED = [
  { id: '1', imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600&auto=format&fit=crop', handle: '@bridal_makeup', postLink: '/professionals', serviceName: 'Makeup Artists' },
  { id: '2', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop', handle: '@mehndi_designs', postLink: '/professionals', serviceName: 'Mehndi Artists' },
  { id: '3', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop', handle: '@luxury_salon', postLink: '/professionals', serviceName: 'Hair & Salon' },
  { id: '4', imageUrl: 'https://images.unsplash.com/photo-1485231183945-fffde7cc051e?q=80&w=600&auto=format&fit=crop', handle: '@style_guru', postLink: '/professionals', serviceName: 'Personal Stylists' },
];

export function InstagramFeed() {
  return (
    <section className="w-full bg-white py-8 sm:py-12 md:py-14 select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Header Section with Uniform Typography */}
      <div className="text-center mb-8">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-1.5">
          SOCIAL &amp; EDITORIAL INSPIRATION
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-stone-900 tracking-wide leading-tight">
          Follow Our Journey
        </h2>
        <p className="mt-1.5 text-stone-500 text-xs sm:text-sm font-sans italic">
          Tag @femazon.official to be featured across our seasonal lookbooks and editorials.
        </p>
      </div>

      {/* Media Grid: 4 balanced columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 mb-6 sm:mb-8 max-w-5xl mx-auto">
        {MOCK_INSTAGRAM_FEED.map((post) => (
          <Link 
            key={post.id} 
            href={post.postLink}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl block bg-stone-100 shadow-xs hover:shadow-md border border-stone-200/70"
          >
            <img 
              src={post.imageUrl} 
              alt={`${post.serviceName} preview`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-[#4A1513]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3 text-center">
              <div className="flex flex-col items-center justify-center transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-white text-xs sm:text-sm font-serif font-normal tracking-wide mb-2 sm:mb-2.5 line-clamp-1">{post.serviceName}</span>
                <span className="inline-flex items-center gap-1 text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase border border-white/80 px-3 py-1 rounded-full hover:bg-white hover:text-[#4A1513] transition-colors">
                  <span>Explore</span>
                  <ArrowRight size={10} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Call to Action Button */}
      <div className="flex justify-center">
        <Link 
          href="/professionals" 
          className="group inline-flex items-center gap-2 bg-[#4A1513] hover:bg-[#350B0A] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <span>View All Services</span>
          <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
      </div>
    </section>
  );
}
