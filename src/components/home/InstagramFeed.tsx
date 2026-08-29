import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const MOCK_INSTAGRAM_FEED = [
  { id: '1', imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600&auto=format&fit=crop', handle: '@bridal_makeup', postLink: '/services/makeup', serviceName: 'Makeup Artists' },
  { id: '2', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop', handle: '@mehndi_designs', postLink: '/services/mehndi', serviceName: 'Mehndi Artists' },
  { id: '3', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop', handle: '@luxury_salon', postLink: '/services/salon', serviceName: 'Salon & Beauty' },
  { id: '4', imageUrl: 'https://images.unsplash.com/photo-1485231183945-fffde7cc051e?q=80&w=600&auto=format&fit=crop', handle: '@style_guru', postLink: '/services/styling', serviceName: 'Personal Stylists' },
  { id: '5', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop', handle: '@pro_photography', postLink: '/services/photographers', serviceName: 'Photographers' },
  { id: '6', imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop', handle: '@dream_events', postLink: '/services/events', serviceName: 'Event Planners' },
];

export function InstagramFeed() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-6 my-8 md:my-12">
      {/* Header Section */}
      <div className="text-center mb-8">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-1.5">
          Verified Professionals
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-wide text-[#3D110F]">
          Our Expert Services
        </h2>
        <p className="font-sans text-xs sm:text-sm text-text-muted mt-2">
          Book top bridal specialists or tag <span className="font-medium text-[#3D110F]">@femazon_services</span> to be featured.
        </p>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
        {MOCK_INSTAGRAM_FEED.map((post) => (
          <Link 
            key={post.id} 
            href={post.postLink}
            className="group relative aspect-[4/5] overflow-hidden rounded-xl sm:rounded-2xl block bg-accent/10 shadow-sm border border-stone-200/50"
          >
            <img 
              src={post.imageUrl} 
              alt={`${post.serviceName} preview`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-[#3D110F]/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2.5 sm:p-3 text-center">
              <div className="flex flex-col items-center justify-center transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-white text-[11px] sm:text-sm font-serif font-normal tracking-wide mb-2 sm:mb-2.5 line-clamp-1">{post.serviceName}</span>
                <span className="inline-flex items-center gap-1 text-white text-[8.5px] sm:text-[10px] font-bold tracking-widest uppercase border border-white/80 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full hover:bg-white hover:text-[#3D110F] transition-colors">
                  <span>Book Now</span>
                  <ArrowRight size={9} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Call to Action Button */}
      <div className="flex justify-center">
        <Link 
          href="/services" 
          className="group inline-flex items-center gap-2 bg-[#3D110F] hover:bg-[#2A0B09] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <span>View All Services</span>
          <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
