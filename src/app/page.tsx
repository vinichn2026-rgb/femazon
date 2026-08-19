import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TrendingCarousel } from "@/components/home/TrendingCarousel";
import { ServiceCarousel } from "@/components/home/ServiceCarousel";
import { InstagramFeed } from "@/components/home/InstagramFeed";

export default async function Home() {
  // 1. Categories Data
  const categories = [
    { title: 'Dresses', img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&h=1000&auto=format&fit=crop&crop=top' },
    { title: 'Ethnic Wear', img: 'https://images.unsplash.com/photo-1610047614301-13c63f00c032?q=80&w=800&h=1000&auto=format&fit=crop&crop=top' },
    { title: 'Tops', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&h=1000&auto=format&fit=crop&crop=top' },
    { title: 'Bottom Wear', img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&h=1000&auto=format&fit=crop&crop=center' },
    { title: 'Co-ords', img: 'https://images.unsplash.com/photo-1485231183945-fffde7cc051e?q=80&w=800&h=1000&auto=format&fit=crop&crop=top' },
    { title: 'Accessories', img: '/categories/luxury_jewelry.png' },
  ];

  // 2. Wedding Collection Data
  const weddingCollection = [
    { title: 'Bridal Edit', desc: 'Make your special day unforgettable.', img: 'https://images.unsplash.com/photo-1610173827043-9db50e0d8ef9?q=80&w=800&h=1000&auto=format&fit=crop&crop=top' },
    { title: 'Bridesmaid Edit', desc: 'Soft & elegant styles for the squad.', img: 'https://images.unsplash.com/photo-1599746146388-a7ec2004b67a?q=80&w=800&h=1000&auto=format&fit=crop&crop=top' },
    { title: 'Wedding Guest', desc: 'Stand out in sophisticated silhouettes.', img: 'https://images.unsplash.com/photo-1600685890506-593fdf55949b?q=80&w=800&h=1000&auto=format&fit=crop&crop=top' },
    { title: 'Festive Edit', desc: 'Vibrant colors for every celebration.', img: 'https://images.unsplash.com/photo-1610047614301-13c63f00c032?q=80&w=800&h=1000&auto=format&fit=crop&crop=top' },
  ];

  // 3. Season's Best (Collections)
  const seasonsBest = [
    { title: 'New Arrivals', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&h=1000&auto=format&fit=crop&crop=top' },
    { title: 'Everyday Style', img: 'https://images.unsplash.com/photo-1485231183945-fffde7cc051e?q=80&w=800&h=1000&auto=format&fit=crop&crop=top' },
    { title: 'Workwear Edit', img: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=800&h=1000&auto=format&fit=crop&crop=center' },
    { title: 'Weekend Edit', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&h=1000&auto=format&fit=crop&crop=top' },
  ];

  // 4. Trending Products (Carousel Products)
  const trendingProducts = [
    { name: 'Floral Midi Dress', category: 'Western / Casual', price: '₹1,899', img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&h=750&auto=format&fit=crop&crop=top' },
    { name: 'Linen Co-ord Set', category: 'Casual / Summer', price: '₹2,499', img: '/categories/linen_coord.png' },
    { name: 'Chikankari Kurta Set', category: 'Ethnic', price: '₹1,799', img: '/categories/chikankari_kurta.png' },
    { name: 'Satin Blouse', category: 'Western / Party', price: '₹1,499', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&h=750&auto=format&fit=crop&crop=top' },
    { name: 'Wide-Leg Trousers', category: 'Workwear', price: '₹1,699', img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=600&h=750&auto=format&fit=crop&crop=center' },
    { name: 'Printed Saree', category: 'Ethnic / Festive', price: '₹2,299', img: 'https://images.unsplash.com/photo-1610047614301-13c63f00c032?q=80&w=600&h=750&auto=format&fit=crop&crop=top' },
    { name: 'Ribbed Everyday Top', category: 'Casual', price: '₹899', img: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=600&h=750&auto=format&fit=crop&crop=top' },
    { name: 'Structured Handbag', category: 'Accessories', price: '₹1,999', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&h=750&auto=format&fit=crop&crop=center' },
    { name: 'Pleated Maxi Skirt', category: 'Western', price: '₹1,599', img: 'https://images.unsplash.com/photo-1583391733958-d25e07fac044?q=80&w=600&h=750&auto=format&fit=crop&crop=top' },
    { name: 'Pastel Anarkali Set', category: 'Ethnic', price: '₹2,199', img: 'https://images.unsplash.com/photo-1599746146388-a7ec2004b67a?q=80&w=600&h=750&auto=format&fit=crop&crop=top' },
  ];

  // 5. Women's Services Data
  const services = [
    { title: 'Personal Styling', desc: 'Find a look that feels like you.', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop' },
    { title: 'Makeup', desc: 'Expert application for any occasion.', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop' },
    { title: 'Mehndi', desc: 'Intricate traditional henna art.', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop' },
    { title: 'Hair Styling', desc: 'From classic blowouts to bridal updos.', img: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop' },
    { title: 'Event Planning', desc: 'Curating unforgettable moments.', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop' },
    { title: 'Fashion Consultation', desc: 'Elevate your entire wardrobe.', img: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=800&auto=format&fit=crop' },
    { title: 'Shopping Assistant', desc: 'Get personal help while you shop.', img: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=800&auto=format&fit=crop' },
  ];

  return (
    <div className="bg-surface text-text-main font-sans overflow-hidden">
      
      {/* Existing Banner / Hero (UNCHANGED) */}
      <HeroCarousel />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        
        {/* Section 1: Shop by Category */}
        <section className="mt-12 md:mt-20">
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-text-main text-center tracking-wide mb-6 md:mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {categories.map((category, idx) => (
              <Link key={idx} href={`/products?category=${category.title.toLowerCase().replace(' ', '-')}`} className="group flex flex-col items-center">
                <div className="aspect-[4/5] w-full overflow-hidden bg-accent/5 mb-4 rounded-xl relative shadow-sm transition duration-500 hover:shadow-lg">
                  <img 
                    src={category.img} 
                    alt={category.title} 
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Hover overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h3 className="text-center font-sans text-[13px] font-bold tracking-[0.15em] uppercase text-text-main group-hover:text-primary transition">
                  {category.title}
                </h3>
                <div className="text-center mt-2 text-[10px] uppercase tracking-widest text-text-muted opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 font-bold">
                  Explore &rarr;
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 2: Wedding Collection */}
        <section className="mt-12 md:mt-20">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-text-main tracking-wide">
              Wedding Collection
            </h2>
            <p className="mt-3 text-text-muted text-sm md:text-base font-sans italic">
              Elegant styles for every celebration.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {weddingCollection.map((item, idx) => (
              <Link key={idx} href={`/products?category=${item.title.toLowerCase().replace(' ', '-')}`} className="group flex flex-col items-center">
                <div className="aspect-[3/4] w-full overflow-hidden bg-accent/5 mb-6 rounded-sm relative">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-text-main mb-2">
                  {item.title}
                </h3>
                <p className="text-center text-xs md:text-sm text-text-muted mb-4 px-2 font-sans">
                  {item.desc}
                </p>
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#a85b9b] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  Explore &rarr;
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3: Season's Best */}
        <section className="mt-12 md:mt-20">
          <div className="flex justify-between items-end mb-6 md:mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-text-main tracking-wide">
              Season&apos;s Best
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {seasonsBest.map((item, idx) => (
              <Link key={idx} href={`/products?category=${item.title.toLowerCase().replace(' ', '-')}`} className="group flex flex-col items-center text-center">
                <div className="aspect-[4/5] w-full overflow-hidden bg-accent/5 mb-4 rounded-xl shadow-sm transition duration-500 hover:shadow-lg relative">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h3 className="font-sans text-[15px] font-bold tracking-wider uppercase text-text-main group-hover:text-primary transition">
                  {item.title}
                </h3>
                <div className="mt-2 text-[11px] font-bold uppercase tracking-widest text-text-muted opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Explore &rarr;
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 4: Trending Products (Carousel) */}
        <section className="mt-12 md:mt-20">
          <div className="flex justify-between items-end mb-6 md:mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-text-main tracking-wide">
              Trending Products
            </h2>
            <Link href="/products?sort=trending" className="text-[11px] uppercase tracking-[0.2em] font-bold text-text-muted hover:text-[#a85b9b] transition flex items-center">
              View All <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>
          
          <TrendingCarousel products={trendingProducts} />
        </section>

      </div> {/* Close main container */}

      {/* Section 5: Women's Services Carousel (Premium Feature) */}
      <section className="w-full bg-[#fbf9f6] py-12 md:py-20 mt-12 md:mt-20 relative overflow-hidden">
        {/* Decorative label */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-10 hidden 2xl:block -rotate-90 origin-center opacity-30 select-none pointer-events-none">
          <span className="text-[120px] font-serif font-bold text-accent whitespace-nowrap uppercase tracking-tighter leading-none">
            FOR HER
          </span>
        </div>
        
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 relative z-10">
          <div className="flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-8">
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-text-main tracking-wide mb-4">
              Services Made for Her
            </h2>
            <p className="font-sans text-[16px] text-text-muted max-w-xl leading-relaxed">
              From getting ready to finding your perfect style — discover services designed around women.
            </p>
          </div>
          
          <ServiceCarousel services={services} />
        </div>
      </section>

      {/* Section 6: AI Wardrobe (Promotional Section) */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-12 md:mt-20 mb-12 md:mb-20">
        <div className="w-full relative rounded-2xl overflow-hidden bg-[#FDFBF7] flex flex-col lg:flex-row items-stretch shadow-sm border border-accent/10">
          {/* Image Side */}
          <div className="w-full lg:w-1/2 h-[40vh] sm:h-[50vh] lg:h-auto relative min-h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&h=1400&auto=format&fit=crop&crop=center" 
              alt="AI Wardrobe Experience" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Text Side */}
          <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 lg:p-24 flex flex-col justify-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-text-main tracking-wide mb-6 leading-tight">
              Your Style. <br className="hidden md:block"/>Your Wardrobe. <br className="hidden md:block"/>Your AI.
            </h2>
            <p className="font-sans text-[15px] md:text-[17px] text-text-muted leading-relaxed mb-8 max-w-md">
              Discover outfit ideas based on what you already own and find the perfect pieces to complete your look.
            </p>
            
            {/* 4-Step Visual */}
            <div className="flex flex-col gap-5 mb-10">
              <div className="flex items-center group">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#a85b9b] text-[#a85b9b] flex items-center justify-center font-bold text-xs md:text-sm mr-4 group-hover:bg-[#a85b9b] group-hover:text-white transition-colors duration-300">1</div>
                <span className="font-sans font-bold text-text-main text-[12px] md:text-[13px] uppercase tracking-widest">Upload</span>
              </div>
              <div className="flex items-center group">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#a85b9b] text-[#a85b9b] flex items-center justify-center font-bold text-xs md:text-sm mr-4 group-hover:bg-[#a85b9b] group-hover:text-white transition-colors duration-300">2</div>
                <span className="font-sans font-bold text-text-main text-[12px] md:text-[13px] uppercase tracking-widest">Organize</span>
              </div>
              <div className="flex items-center group">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#a85b9b] text-[#a85b9b] flex items-center justify-center font-bold text-xs md:text-sm mr-4 group-hover:bg-[#a85b9b] group-hover:text-white transition-colors duration-300">3</div>
                <span className="font-sans font-bold text-text-main text-[12px] md:text-[13px] uppercase tracking-widest">Get Outfit Ideas</span>
              </div>
              <div className="flex items-center group">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#a85b9b] text-[#a85b9b] flex items-center justify-center font-bold text-xs md:text-sm mr-4 group-hover:bg-[#a85b9b] group-hover:text-white transition-colors duration-300">4</div>
                <span className="font-sans font-bold text-text-main text-[12px] md:text-[13px] uppercase tracking-widest">Shop Missing Pieces</span>
              </div>
            </div>

            <div>
              <Link href="/ai-wardrobe" className="inline-block bg-text-main text-white text-[11px] font-bold uppercase tracking-[0.2em] py-4 px-10 transition hover:bg-[#a85b9b] rounded-full shadow-md hover:shadow-lg">
                Explore AI Wardrobe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Instagram / Our Beautiful Clients */}
      <InstagramFeed />

      {/* Final CTA */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 mb-16 md:mb-24 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-text-main tracking-wide mb-3 md:mb-4">
          Stay in Her Style
        </h2>
        <p className="font-sans text-[14px] md:text-[16px] text-text-muted mb-8 md:mb-10 max-w-md mx-auto">
          Discover the latest fashion, curated collections and exclusive Femazon updates.
        </p>
        <form className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="w-full sm:w-auto flex-grow bg-transparent border-b border-text-muted/40 pb-2 text-text-main placeholder-text-muted/60 focus:outline-none focus:border-text-main transition font-sans text-sm"
            required
          />
          <button 
            type="submit" 
            className="w-full sm:w-auto bg-text-main text-white text-[11px] font-bold uppercase tracking-[0.2em] py-3 px-8 transition hover:bg-[#a85b9b] rounded-full shadow-sm"
          >
            Join Femazon
          </button>
        </form>
      </section>

    </div>
  );
}
