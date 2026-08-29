import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { NewArrivalsSpotlight } from "@/components/home/NewArrivalsSpotlight";
import { CuratedTrendingSection } from "@/components/home/CuratedTrendingSection";
import { ServiceCarousel } from "@/components/home/ServiceCarousel";
import { HomeReviewsSection } from "@/components/home/HomeReviewsSection";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { prisma } from "@/lib/prisma";

export default async function Home() {

  // 2. Wedding Collection Data
  const weddingCollection = [
    { title: 'Bridal Edit', desc: 'Make your special day unforgettable.', img: 'https://images.unsplash.com/photo-1610047614301-13c63f00c032?q=80&w=800&h=1000&auto=format&fit=crop&crop=top' },
    { title: 'Bridesmaid Edit', desc: 'Soft & elegant styles for the squad.', img: 'https://images.unsplash.com/photo-1599746146388-a7ec2004b67a?q=80&w=800&h=1000&auto=format&fit=crop&crop=top' },
    { title: 'Wedding Guest', desc: 'Stand out in sophisticated silhouettes.', img: 'https://images.unsplash.com/photo-1600685890506-593fdf55949b?q=80&w=800&h=1000&auto=format&fit=crop&crop=top' },
    { title: 'Festive Edit', desc: 'Vibrant colors for every celebration.', img: 'https://images.unsplash.com/photo-1610047614301-13c63f00c032?q=80&w=800&h=1000&auto=format&fit=crop&crop=top' },
  ];

  // 4. Trending Products (Carousel Products) - Fetched from Database
  const dbProducts = await prisma.product.findMany({
    where: { approvalStatus: 'APPROVED' },
    take: 10,
    orderBy: { createdAt: 'desc' },
  });

  const trendingProducts = dbProducts.length > 0 ? dbProducts.map(p => ({
    name: p.name,
    category: p.category || 'Casual',
    price: `₹${p.price.toLocaleString('en-IN')}`,
    img: p.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&h=750&auto=format&fit=crop&crop=top',
    slug: p.slug
  })) : [
    // Fallback if DB is empty
    { name: 'Floral Midi Dress', category: 'Western / Casual', price: '₹1,899', img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&h=750&auto=format&fit=crop&crop=top' },
    { name: 'Linen Co-ord Set', category: 'Casual / Summer', price: '₹2,499', img: '/categories/linen_coord.png' },
    { name: 'Chikankari Kurta Set', category: 'Ethnic', price: '₹1,799', img: '/categories/chikankari_kurta.png' },
    { name: 'Satin Blouse', category: 'Western / Party', price: '₹1,499', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&h=750&auto=format&fit=crop&crop=top' }
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
      
      {/* 1. Hero Banner Carousel */}
      <HeroCarousel />

      {/* 2. Shop by Category */}
      <ShopByCategory />

      {/* 3. New Arrivals & Everyday Style (Styled exactly matching reference screenshot) */}
      <NewArrivalsSpotlight />

      {/* 4. Curated by Aza Style -> Curated For You / Trending Now Section */}
      <CuratedTrendingSection />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">

        {/* 5. Wedding Stories & Celebration Edits */}
        <section className="py-8 md:py-12 border-b border-stone-100">
          <div className="text-center mb-6 md:mb-8">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-primary block mb-1.5">
              The Grand Celebration
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-text-main tracking-wide">
              Wedding Stories by Femazon
            </h2>
            <p className="mt-1.5 text-text-muted text-xs sm:text-sm font-sans italic">
              From bridal grandeur to reception chic — explore regal silhouettes.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 md:gap-7">
            {weddingCollection.map((item, idx) => (
              <Link key={idx} href={`/collections/${item.title.toLowerCase().replace(' ', '-')}`} className="group flex flex-col items-center">
                <div className="aspect-[3/4] w-full overflow-hidden bg-accent/5 mb-2.5 sm:mb-4 rounded-xl sm:rounded-2xl shadow-sm relative border border-stone-200/60">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700"></div>
                  <div className="absolute bottom-3 sm:bottom-4 inset-x-2 sm:inset-x-4 text-white text-center">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#E5C3A6] block mb-0.5 sm:mb-1">
                      Explore Edit
                    </span>
                    <h4 className="font-serif text-sm sm:text-lg text-white font-normal line-clamp-1">{item.title}</h4>
                  </div>
                </div>
                <h3 className="font-serif text-sm sm:text-lg md:text-xl text-text-main mb-0.5 sm:mb-1 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-center text-[10.5px] sm:text-xs text-text-muted mb-1.5 sm:mb-2 px-1 font-sans line-clamp-2">
                  {item.desc}
                </p>
                <div className="mt-0.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full border border-[#4A1513]/30 text-[#4A1513] group-hover:bg-[#4A1513] group-hover:text-white font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] transition-all">
                    <span>Explore</span>
                    <ArrowRight size={10} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div> {/* Close container */}

      {/* 6. Women's Exclusive Services Carousel */}
      <section className="w-full bg-[#fbf9f6] py-8 sm:py-10 md:py-14 my-3 sm:my-4 md:my-6 relative overflow-hidden border-y border-accent/20">
        <div className="absolute top-1/2 -translate-y-1/2 -left-10 hidden 2xl:block -rotate-90 origin-center opacity-25 select-none pointer-events-none">
          <span className="text-[120px] font-serif font-bold text-accent whitespace-nowrap uppercase tracking-tighter leading-none">
            FOR HER
          </span>
        </div>
        
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 relative z-10">
          <div className="flex flex-col items-center text-center mb-6 sm:mb-8 mx-auto">
            <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-primary block mb-1">
              At-Home Glamour & Styling
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-text-main tracking-wide mb-1.5 sm:mb-2">
              Services Made for Her
            </h2>
            <p className="font-sans text-xs sm:text-sm text-text-muted max-w-xl leading-relaxed px-2">
              Book verified makeup artists, mehndi specialists, and personal styling assistants at your convenience.
            </p>
          </div>
          
          <ServiceCarousel services={services} />
        </div>
      </section>

      {/* 7. AI Smart Wardrobe Experience */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 my-6 sm:my-8 md:my-12">
        <div className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FDFBF7] flex flex-col lg:flex-row items-stretch shadow-sm border border-accent/20">
          {/* Image Side */}
          <div className="w-full lg:w-1/2 h-[220px] sm:h-[340px] lg:h-auto relative min-h-0">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&h=1400&auto=format&fit=crop&crop=center" 
              alt="AI Wardrobe Experience" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Text Side */}
          <div className="w-full lg:w-1/2 p-5 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-primary block mb-1.5 sm:mb-2">
              Digital Closet Intelligence
            </span>
            <h2 className="font-serif text-xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-text-main tracking-wide mb-3 sm:mb-4 leading-tight">
              Your Style. Your Wardrobe. <br className="hidden sm:block"/><span className="italic font-light text-primary">Powered by AI.</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-text-muted leading-relaxed mb-4 sm:mb-6 max-w-md">
              Discover curated daily outfit ideas based on what you already own and find the missing designer pieces to complete your signature look.
            </p>
            
            {/* 4-Step Visual */}
            <div className="flex flex-col gap-2.5 sm:gap-3 mb-5 sm:mb-6">
              <div className="flex items-center group">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-primary text-primary flex items-center justify-center font-bold text-[11px] sm:text-xs mr-2.5 sm:mr-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">1</div>
                <span className="font-sans font-bold text-text-main text-[10px] sm:text-xs uppercase tracking-widest">Upload Your Outfits</span>
              </div>
              <div className="flex items-center group">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-primary text-primary flex items-center justify-center font-bold text-[11px] sm:text-xs mr-2.5 sm:mr-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">2</div>
                <span className="font-sans font-bold text-text-main text-[10px] sm:text-xs uppercase tracking-widest">Organize Digital Closet</span>
              </div>
              <div className="flex items-center group">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-primary text-primary flex items-center justify-center font-bold text-[11px] sm:text-xs mr-2.5 sm:mr-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">3</div>
                <span className="font-sans font-bold text-text-main text-[10px] sm:text-xs uppercase tracking-widest">Get Daily AI Recommendations</span>
              </div>
              <div className="flex items-center group">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-primary text-primary flex items-center justify-center font-bold text-[11px] sm:text-xs mr-2.5 sm:mr-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">4</div>
                <span className="font-sans font-bold text-text-main text-[10px] sm:text-xs uppercase tracking-widest">Shop Missing Designer Pieces</span>
              </div>
            </div>

            <div>
              <Link href="/ai-wardrobe" className="group inline-flex items-center gap-2 bg-[#3D110F] hover:bg-[#2A0B09] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] py-2.5 sm:py-3 px-6 sm:px-8 transition-all duration-300 rounded-full shadow-md hover:shadow-lg active:scale-95">
                <span>Explore AI Wardrobe</span>
                <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Instagram / Social Editorial Feed */}
      <InstagramFeed />

      {/* 9. Stay in Her Style - Newsletter Section */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 my-8 md:my-12 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-text-main tracking-wide mb-2.5">
          Stay in Her Style
        </h2>
        <p className="font-sans text-xs sm:text-sm text-text-muted mb-6 max-w-md mx-auto">
          Discover the latest fashion, curated designer collections and exclusive Femazon updates.
        </p>
        <form className="flex flex-col sm:flex-row justify-center items-center gap-3.5 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="w-full sm:w-auto flex-grow bg-transparent border-b border-text-muted/40 pb-2 text-text-main placeholder-text-muted/60 focus:outline-none focus:border-text-main transition font-sans text-sm"
            required
          />
          <button 
            type="submit" 
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#3D110F] hover:bg-[#2A0B09] text-white text-[11px] font-bold uppercase tracking-[0.2em] py-2.5 px-7 transition-all duration-300 rounded-full shadow-sm hover:shadow-md cursor-pointer active:scale-95"
          >
            <span>Join Femazon</span>
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </form>
      </section>

      {/* 11. Rate & Review Section (Client Love & Verified Testimonials) - Placed after Stay in Her Style */}
      <HomeReviewsSection />

    </div>
  );
}
