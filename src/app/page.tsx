import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TrendingCarousel } from "@/components/home/TrendingCarousel";
import { ServiceCarousel } from "@/components/home/ServiceCarousel";

export default async function Home() {
  // 1. Categories Data
  const categories = [
    { title: 'Dresses', img: 'https://images.unsplash.com/photo-1503160865267-af4660ce7bf2?q=80&w=600&auto=format&fit=crop' },
    { title: 'Sarees', img: 'https://images.unsplash.com/photo-1619516388835-2b60acc4049e?q=80&w=600&auto=format&fit=crop' },
    { title: 'Ethnic Wear', img: 'https://images.unsplash.com/photo-1599746146388-a7ec2004b67a?q=80&w=600&auto=format&fit=crop' },
    { title: 'Tops', img: 'https://images.unsplash.com/photo-1571587289339-cb7da03fb5a6?q=80&w=600&auto=format&fit=crop' },
    { title: 'Accessories', img: 'https://images.unsplash.com/photo-1571908599407-cdb918ed83bf?q=80&w=600&auto=format&fit=crop' },
    { title: 'Beauty', img: 'https://images.unsplash.com/photo-1569810020669-aa9d38003ea7?q=80&w=600&auto=format&fit=crop' },
  ];

  // 2. Wedding Collection Data
  const weddingCollection = [
    { title: 'Bridal Wear', img: 'https://images.unsplash.com/photo-1610173827043-9db50e0d8ef9?q=80&w=800&auto=format&fit=crop' },
    { title: 'Bridesmaid', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop' },
    { title: 'Wedding Guest', img: 'https://images.unsplash.com/photo-1600685890506-593fdf55949b?q=80&w=800&auto=format&fit=crop' },
    { title: 'Wedding Accessories', img: 'https://images.unsplash.com/photo-1587271315307-eaebc181c749?q=80&w=800&auto=format&fit=crop' },
  ];

  // 3. Season's Best (Collections)
  const seasonsBest = [
    { title: 'New Arrivals', img: 'https://images.unsplash.com/photo-1665960213508-48f07086d49c?q=80&w=800&auto=format&fit=crop' },
    { title: 'Trending Now', img: 'https://images.unsplash.com/photo-1610047614301-13c63f00c032?q=80&w=800&auto=format&fit=crop' },
    { title: 'Festive Edit', img: 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?q=80&w=800&auto=format&fit=crop' },
    { title: 'Everyday Style', img: 'https://images.unsplash.com/photo-1597157639073-69284dc0fdaf?q=80&w=800&auto=format&fit=crop' },
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
    { name: 'Structured Handbag', category: 'Accessories', price: '₹1,999', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&h=750&auto=format&fit=crop&crop=center' },
    { name: 'Pleated Maxi Skirt', category: 'Western', price: '₹1,599', img: 'https://images.unsplash.com/photo-1583391733958-d25e07fac044?q=80&w=600&h=750&auto=format&fit=crop&crop=top' },
    { name: 'Pastel Anarkali Set', category: 'Ethnic', price: '₹2,199', img: 'https://images.unsplash.com/photo-1599746146388-a7ec2004b67a?q=80&w=600&h=750&auto=format&fit=crop&crop=top' },
  ];

  // 5. Women's Services Data
  const services = [
    { title: 'Personal Styling', desc: 'Find a look that feels like you.', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop' },
    { title: 'Makeup', desc: 'Expert application for any occasion.', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop' },
    { title: 'Mehndi', desc: 'Intricate traditional henna art.', img: 'https://images.unsplash.com/photo-1560031802-9a741366b26c?q=80&w=800&auto=format&fit=crop' },
    { title: 'Hair Styling', desc: 'From classic blowouts to bridal updos.', img: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop' },
    { title: 'Event Planning', desc: 'Curating unforgettable moments.', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop' },
    { title: 'Fashion Consultation', desc: 'Elevate your entire wardrobe.', img: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=800&auto=format&fit=crop' },
    { title: 'Shopping Assistant', desc: 'Get personal help while you shop.', img: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=800&auto=format&fit=crop' },
  ];

  return (
    <main className="min-h-screen bg-surface text-text-main font-sans pb-24 overflow-hidden">
      
      {/* Existing Banner / Hero (UNCHANGED) */}
      <HeroCarousel />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        
        {/* Section 1: Shop by Category */}
        <section className="mt-12 md:mt-16">
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-text-main text-center tracking-wide mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-6">
            {categories.map((category, idx) => (
              <Link key={idx} href={`/products?category=${category.title.toLowerCase().replace(' ', '-')}`} className="group flex flex-col items-center">
                <div className="aspect-[3/4] w-full overflow-hidden bg-accent/5 mb-3 rounded-2xl relative shadow-sm transition hover:shadow-md">
                  <img 
                    src={category.img} 
                    alt={category.title} 
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  {/* Hover "Shop" overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold uppercase tracking-widest border border-white/80 px-4 py-2 backdrop-blur-sm rounded-full hover:bg-white hover:text-black transition">
                      Shop
                    </span>
                  </div>
                </div>
                <h3 className="text-center font-sans text-[13px] tracking-widest uppercase text-text-main group-hover:text-[#a85b9b] transition">
                  {category.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 2: Wedding Collection */}
        <section className="mt-16 md:mt-20">
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-text-main text-center tracking-wide mb-10">
            Wedding Collection
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {weddingCollection.map((item, idx) => (
              <Link key={idx} href={`/products?category=${item.title.toLowerCase().replace(' ', '-')}`} className="group block">
                <div className="aspect-[4/5] w-full overflow-hidden bg-accent/5 mb-4 rounded-2xl shadow-sm transition hover:shadow-md">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-center font-sans text-[14px] tracking-widest uppercase text-text-main group-hover:text-[#a85b9b] transition">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3: Season's Best */}
        <section className="mt-16 md:mt-20">
          <div className="flex justify-between items-end mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-text-main tracking-wide">
              Season&apos;s Best
            </h2>
            <Link href="/products" className="text-[11px] uppercase tracking-[0.2em] font-bold text-text-muted hover:text-[#a85b9b] transition flex items-center">
              View All <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {seasonsBest.map((item, idx) => (
              <Link key={idx} href={`/products?category=${item.title.toLowerCase().replace(' ', '-')}`} className="group block">
                <div className="aspect-[4/5] w-full overflow-hidden bg-accent/5 mb-4 rounded-2xl shadow-sm transition hover:shadow-md relative">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <button className="w-full bg-white/90 backdrop-blur rounded-full text-text-main text-xs font-bold uppercase tracking-wider py-3 hover:bg-text-main hover:text-white transition">
                      Shop Collection
                    </button>
                  </div>
                </div>
                <h3 className="text-center font-sans text-[14px] tracking-widest uppercase text-text-main group-hover:text-[#a85b9b] transition">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 4: Trending Products (Carousel) */}
        <section className="mt-16 md:mt-20">
          <div className="flex justify-between items-end mb-10">
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
      <section className="w-full bg-[#fbf9f6] py-16 md:py-24 mt-16 md:mt-24 relative overflow-hidden">
        {/* Decorative label */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-10 hidden 2xl:block -rotate-90 origin-center opacity-30 select-none pointer-events-none">
          <span className="text-[120px] font-serif font-bold text-accent whitespace-nowrap uppercase tracking-tighter leading-none">
            FOR HER
          </span>
        </div>
        
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 relative z-10">
          <div className="flex flex-col items-center md:items-start text-center md:text-left mb-12">
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
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-16 md:mt-24 mb-16">
        <div className="w-full relative rounded-3xl overflow-hidden bg-[#FDFBF7] flex flex-col md:flex-row items-center shadow-sm">
          {/* Image Side */}
          <div className="w-full md:w-1/2 h-[40vh] md:h-[500px] relative">
            <img 
              src="https://images.unsplash.com/photo-1654764746225-e63f5e90facd?q=80&w=1600&auto=format&fit=crop" 
              alt="AI Wardrobe Experience" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Text Side */}
          <div className="w-full md:w-1/2 p-10 md:p-16 text-center md:text-left flex flex-col justify-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a85b9b] mb-4 block">Innovation</span>
            <h2 className="font-serif text-3xl md:text-5xl font-normal text-text-main tracking-wide mb-6">
              Your Style, Your Wardrobe, Your AI
            </h2>
            <p className="font-sans text-[16px] text-text-muted leading-relaxed mb-10 max-w-md mx-auto md:mx-0">
              Discover outfit ideas based on your wardrobe and personal style.
            </p>
            <div>
              <Link href="/ai-wardrobe" className="inline-block bg-text-main text-white text-[11px] font-bold uppercase tracking-[0.2em] py-4 px-10 transition hover:bg-[#a85b9b] rounded-full shadow-md">
                Explore AI Wardrobe
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
