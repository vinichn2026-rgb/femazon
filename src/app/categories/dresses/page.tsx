import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/shop/ProductCard';

export const metadata = {
  title: 'Dresses | Femazon',
  description: 'Find the dress that feels like you. From effortless everyday styles to statement party looks — discover your perfect fit.',
};

const dressStyles = [
  { name: 'CASUAL DRESSES', desc: 'Easy styles for everyday moments', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop/dresses?type=casual' },
  { name: 'PARTY DRESSES', desc: 'Make every entrance count', image: 'https://images.unsplash.com/photo-1568252542512-9fe8ee9c6a78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop/dresses?type=party' },
  { name: 'MAXI DRESSES', desc: 'Effortless, elegant and flowing', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop/dresses?type=maxi' },
  { name: 'MIDI DRESSES', desc: 'The perfect balance of chic and versatile', image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop/dresses?type=midi' },
  { name: 'BODYCON DRESSES', desc: 'Confident silhouettes made to stand out', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop/dresses?type=bodycon' },
  { name: 'A-LINE DRESSES', desc: 'Classic shapes that never go out of style', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop/dresses?type=a-line' },
  { name: 'FIT & FLARE DRESSES', desc: 'Playful movement with a flattering fit', image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop/dresses?type=fit-and-flare' },
  { name: 'WRAP DRESSES', desc: 'Effortless elegance with a timeless finish', image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop/dresses?type=wrap' },
];

const occasions = [
  { title: 'EVERYDAY', subtitle: 'Easy dresses for your everyday wardrobe.', cta: 'SHOP EVERYDAY', image: 'https://images.unsplash.com/photo-1550614000-4b95dd247563?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop/dresses?occasion=everyday' },
  { title: 'WORKWEAR', subtitle: 'Polished styles made for your 9-to-5.', cta: 'SHOP WORKWEAR', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop/dresses?occasion=workwear' },
  { title: 'PARTY', subtitle: 'Statement styles for nights worth remembering.', cta: 'SHOP PARTY', image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop/dresses?occasion=party' },
  { title: 'VACATION', subtitle: 'Light, effortless looks made for getaways.', cta: 'SHOP VACATION', image: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop/dresses?occasion=vacation' },
  { title: 'SPECIAL OCCASIONS', subtitle: 'Dress up for the moments that matter.', cta: 'SHOP SPECIAL OCCASIONS', image: 'https://images.unsplash.com/photo-1566938959664-98c47f3dbf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop/dresses?occasion=special-occasions' },
];

export default async function DressesCategoryPage() {
  const dbProducts = await prisma.product.findMany({
    where: { 
      approvalStatus: 'APPROVED',
      category: { equals: 'Dresses', mode: 'insensitive' }
    },
    include: {
      vendor: {
        include: {
          vendorProfile: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 8
  });

  const trendingProducts = dbProducts.map(p => {
    const isSale = p.discountPrice && p.discountPrice < p.price;
    const discountPercent = isSale && p.discountPrice ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 0;
    
    let sizes = ["S", "M", "L"];
    let colors = ["Black", "Red"];
    try {
      if (p.sizes) sizes = JSON.parse(p.sizes as string);
      if (p.colors) colors = JSON.parse(p.colors as string);
    } catch (e) {}

    const vendorName = p.vendor?.vendorProfile?.businessName || "Femazon Exclusive";

    let images: string[] = [];
    try {
      if (p.images) images = JSON.parse(p.images as string);
    } catch (e) {}

    return {
      id: p.id.toString(),
      name: p.name,
      brand: vendorName, 
      category: p.category || "Dresses",
      subCategory: p.category || "Dresses",
      price: p.discountPrice ? p.discountPrice : p.price,
      originalPrice: p.price,
      discount: discountPercent,
      images: images.length > 0 ? images : (p.image ? [p.image] : []),
      sizes,
      colors,
      rating: 4.5, 
      reviewCount: Math.floor(Math.random() * 200) + 10,
      isTrending: true,
      isNew: false,
      inStock: p.stock > 0,
      createdAt: new Date().toISOString()
    };
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-neutral-900">
        {/* Large Editorial Fashion Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1515347619362-7dd35e726b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Editorial fashion model wearing a dress"
            fill
            className="object-cover object-top opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-black/20" /> {/* Subtle overlay for better text readability */}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-4 drop-shadow-sm uppercase">
            Dresses
          </h1>
          
          <h2 className="text-2xl md:text-3xl text-white font-medium mb-6 drop-shadow-sm">
            Find the dress that feels like you.
          </h2>
          
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-10 font-light drop-shadow-sm leading-relaxed">
            From effortless everyday styles to statement party looks — discover dresses made for every moment.
          </p>
          
          <Link 
            href="/shop/dresses" 
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors duration-300"
          >
            Shop All Dresses
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Shop by Dress Style Section */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-4">
            Shop by Dress Style
          </h3>
          <p className="text-neutral-500 font-medium">
            Find your perfect silhouette, from everyday favourites to statement looks.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {dressStyles.map((style) => (
            <Link key={style.name} href={style.link} className="group flex flex-col cursor-pointer">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 mb-4">
                <Image
                  src={style.image}
                  alt={style.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="flex flex-col px-1">
                <h4 className="text-sm md:text-base font-bold uppercase tracking-wider mb-1">{style.name}</h4>
                <p className="text-sm text-neutral-500 mb-3 line-clamp-2">{style.desc}</p>
                <span className="text-xs font-semibold uppercase tracking-widest flex items-center gap-1 group-hover:text-black transition-colors">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Explore More Styles Section */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto border-t border-neutral-100">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-4">
            Explore More Styles
          </h3>
          <p className="text-neutral-500 font-medium">
            A style for every mood, personality and occasion.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {[
            { name: 'SHIRT DRESSES', desc: 'Relaxed. Polished. Effortless.', image: 'https://images.unsplash.com/photo-1516656911681-420a89d71c43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop/dresses?type=shirt' },
            { name: 'SLIP DRESSES', desc: 'Minimal silhouettes with maximum impact.', image: 'https://images.unsplash.com/photo-1590330297626-d7aff25a0431?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop/dresses?type=slip' },
            { name: 'OFF-SHOULDER DRESSES', desc: 'A little bold, beautifully feminine.', image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop/dresses?type=off-shoulder' },
            { name: 'HALTER NECK DRESSES', desc: 'Make a statement with a confident neckline.', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop/dresses?type=halter-neck' },
          ].map((style) => (
            <Link key={style.name} href={style.link} className="group flex flex-col cursor-pointer">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 mb-4">
                <Image
                  src={style.image}
                  alt={style.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="flex flex-col px-1">
                <h4 className="text-sm md:text-base font-bold uppercase tracking-wider mb-1">{style.name}</h4>
                <p className="text-sm text-neutral-500 mb-3 line-clamp-2">{style.desc}</p>
                <span className="text-xs font-semibold uppercase tracking-widest flex items-center gap-1 group-hover:text-black transition-colors">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Wide Card: Sequin & Embellished */}
        <div className="mt-16 md:mt-24">
          <Link href="/shop/dresses?type=sequin-and-embellished" className="group relative block w-full h-[60vh] min-h-[400px] overflow-hidden bg-neutral-900 cursor-pointer">
            <Image
              src="https://images.unsplash.com/photo-1596455607563-ad6193f76b17?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="Sequin and Embellished Dresses"
              fill
              className="object-cover object-center opacity-70 group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h3 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-wider mb-4 drop-shadow-sm">
                SEQUIN & EMBELLISHED
              </h3>
              <p className="text-lg md:text-xl text-white/90 font-light mb-8 drop-shadow-sm">
                Shine bright when the moment calls for it.
              </p>
              <span className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-sm font-bold uppercase tracking-wider group-hover:bg-neutral-100 transition-colors duration-300">
                Explore Collection <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Shop by Occasion Section */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto border-t border-neutral-100">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-4">
            Shop by Occasion
          </h3>
          <p className="text-neutral-500 font-medium">
            Whatever the moment, there's a dress for it.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {occasions.map((occasion) => (
            <Link key={occasion.title} href={occasion.link} className="group flex flex-col text-center cursor-pointer">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 mb-6">
                <Image
                  src={occasion.image}
                  alt={occasion.title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <h4 className="text-sm md:text-base font-bold uppercase tracking-wider mb-2">{occasion.title}</h4>
              <p className="text-xs font-medium text-neutral-500 mb-4 line-clamp-2 px-2">
                {occasion.subtitle}
              </p>
              <span className="text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1 group-hover:text-black transition-colors">
                {occasion.cta} <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* The Dress Edit Section */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto border-t border-neutral-100">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-4">
            The Dress Edit
          </h3>
          <p className="text-neutral-500 font-medium">
            Curated looks for every version of you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { title: 'THE EVERYDAY EDIT', desc: "Effortless dresses you'll reach for again and again.", image: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', link: '/shop/dresses?type=everyday' },
            { title: 'THE PARTY EDIT', desc: "Turn heads with styles made for the spotlight.", image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', link: '/shop/dresses?type=party' },
            { title: 'THE ELEGANT EDIT', desc: "Timeless silhouettes for unforgettable moments.", image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', link: '/shop/dresses?type=elegant' }
          ].map((edit) => (
            <Link key={edit.title} href={edit.link} className="group relative block w-full aspect-[4/5] overflow-hidden bg-neutral-900 cursor-pointer">
              <Image
                src={edit.image}
                alt={edit.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h4 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider mb-2 drop-shadow-sm">
                  {edit.title}
                </h4>
                <p className="text-sm md:text-base text-white/90 font-light mb-6 drop-shadow-sm line-clamp-2">
                  {edit.desc}
                </p>
                <span className="inline-flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest group-hover:pl-2 transition-all duration-300">
                  EXPLORE <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Dresses Section */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto border-t border-neutral-100">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-2">
            Trending Dresses
          </h3>
          <p className="text-neutral-500 font-medium">
            The styles everyone is loving right now.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map(product => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </section>

      {/* Explore All Dresses Section */}
      <section className="relative py-24 md:py-32 px-4 mt-8 flex flex-col items-center justify-center text-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Explore all dresses"
          fill
          className="object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <h3 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-wider mb-6 drop-shadow-md">
            Your Next Favourite Dress Is Waiting
          </h3>
          <p className="text-lg text-white/90 font-medium mb-10 max-w-xl mx-auto drop-shadow-sm leading-relaxed">
            Explore our complete collection of women's dresses, from effortless everyday styles to statement occasion wear.
          </p>
          <Link 
            href="/shop/dresses" 
            className="inline-flex items-center gap-2 bg-white text-black px-10 py-4 text-sm font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors duration-300 shadow-xl"
          >
            Explore All Dresses
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
