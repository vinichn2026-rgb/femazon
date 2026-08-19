import React from 'react';
import Link from 'next/link';

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
    <section className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-16 md:mt-24 mb-16 md:mb-24">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-[0.1em] text-primary uppercase">
          Our Expert Services
        </h2>
        <p className="font-sans text-sm md:text-[15px] text-text-muted mt-3">
          Book top professionals or tag <span className="font-medium text-text-main">@femazon_services</span> to be featured.
        </p>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-12">
        {MOCK_INSTAGRAM_FEED.map((post) => (
          <Link 
            key={post.id} 
            href={post.postLink}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl block bg-accent/10 shadow-sm"
          >
            <img 
              src={post.imageUrl} 
              alt={`${post.serviceName} preview`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
              <div className="flex flex-col items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-white text-sm font-bold tracking-widest uppercase mb-3">{post.serviceName}</span>
                <span className="text-white text-[10px] font-bold tracking-widest uppercase border border-white px-5 py-2 rounded-full hover:bg-white hover:text-black transition-colors">
                  Book Now
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
          className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-bold text-[12px] uppercase tracking-widest shadow-md hover:opacity-90 hover:shadow-lg transition-all"
        >
          View All Services
        </Link>
      </div>
    </section>
  );
}
