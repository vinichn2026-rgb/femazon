import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: "Featured Collections | Curated Luxury Edits | Femazon",
  description: "Explore curated occasion capsules, generational silk edits, Indo-Western fusion, and bespoke gifting suites on Femazon.",
};

const FEATURED_COLLECTIONS = [
  {
    id: "silk-legacy",
    title: "The Royal Silk Legacy",
    subtitle: "Pure Kanjeevarams, Heritage Banarasi & Handloom Weaves",
    description: "Generational zari craftsmanship woven from pure mulberry silk, honoring timeless Indian grandeur.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=800",
    href: "/womens-wear?category=Sarees",
    tag: "HERITAGE COUTURE",
    count: "45+ Masterpieces",
  },
  {
    id: "summer-wedding",
    title: "Summer Wedding 2026",
    subtitle: "Pastel Lehengas, Organza Dupattas & Cocktail Gowns",
    description: "Ethereal silhouettes tailored for sun-drenched pheras, sangeet celebrations, and destination receptions.",
    image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=800",
    href: "/womens-wear?category=Lehengas",
    tag: "BRIDAL CAPSULE",
    count: "38+ Designs",
  },
  {
    id: "indo-western",
    title: "Indo-Western & Modern Couture",
    subtitle: "Pre-Draped Sarees, Sculpted Capes & Co-ord Sets",
    description: "Contemporary cuts meeting regal embroidery for effortless transition from cocktail to gala evening.",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=800",
    href: "/womens-wear?category=Indo-Western",
    tag: "CONTEMPORARY",
    count: "29+ Silhouettes",
  },
  {
    id: "minimalist-chic",
    title: "Minimalist Everyday Luxury",
    subtitle: "Pure Breathable Cotton, Chanderi & Straight Cut Kurtas",
    description: "Featherweight hand-block prints and tailored trousers designed for effortless daylight elegance.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=85&w=800",
    href: "/womens-wear?category=Kurta+Sets",
    tag: "EVERYDAY LUXE",
    count: "52+ Essentials",
  },
  {
    id: "girls-princess",
    title: "Little Diva Couture",
    subtitle: "Girls' Velvet Lehengas, Silk Pattu Pavadais & Party Frocks",
    description: "Heirloom festive outfits for little princesses, crafted with pure gentle fabrics and intricate detailing.",
    image: "https://images.unsplash.com/photo-1621784563330-caee0b138a00?auto=format&fit=crop&q=85&w=800",
    href: "/girls-wear",
    tag: "GIRLS' FESTIVE",
    count: "24+ Styles",
  },
  {
    id: "gifting-suite",
    title: "Artisanal Gifting Suite",
    subtitle: "Velvet Gift Boxes, Pure Brass Keepsakes & Luxury Fragrances",
    description: "Handcrafted celebration hampers curated to express heartfelt warmth across festivals, weddings, and milestones.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=85&w=800",
    href: "/gifts",
    tag: "CURATED GIFTS",
    count: "35+ Hampers",
  },
];

export default function FeaturedCollectionsPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F5] pb-24 text-stone-900">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#3D1412] via-[#4A1513] to-[#5C1B19] text-white pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF0E6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-amber-200 mb-3 border border-white/15">
            <Sparkles size={13} className="text-amber-300" />
            <span>Curated Thematic Capsules</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-3">
            Featured Collections
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
            Immerse yourself in handpicked luxury capsules designed for life&apos;s grand celebrations, intimate gatherings, and mindful daily rituals.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURED_COLLECTIONS.map((collection) => (
            <div 
              key={collection.id}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-xl transition-all duration-300"
            >
              {/* Media Container */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-stone-100">
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                
                {/* Tag Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-[#4A1513] text-white text-[9.5px] font-bold tracking-wider uppercase shadow-xs">
                    {collection.tag}
                  </span>
                </div>

                {/* Count Pill */}
                <div className="absolute bottom-3 right-3 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-900 text-[10px] font-bold shadow-xs">
                    {collection.count}
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-[#4A1513] transition-colors mb-1">
                  {collection.title}
                </h3>
                <p className="text-xs font-semibold text-[#4A1513] mb-2">
                  {collection.subtitle}
                </p>
                <p className="text-xs text-stone-500 leading-relaxed mb-6 flex-1">
                  {collection.description}
                </p>

                <Link
                  href={collection.href}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4A1513] hover:text-[#2B0E0D] transition group/link mt-auto"
                >
                  <span>Explore Collection</span>
                  <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
