import Link from 'next/link';
import { FeaturedServices } from '@/components/services/FeaturedServices';
import { ServiceCarousel } from '@/components/home/ServiceCarousel';
import { CheckCircle2, Calendar, Sparkles, MapPin, Search, ShieldCheck } from 'lucide-react';

export default function ServicesPage() {
  const allCarouselServices = [
    { title: 'Makeup Artists', desc: 'Expert makeup for weddings and events.', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop' },
    { title: 'Mehndi Artists', desc: 'Intricate and beautiful mehndi designs.', img: 'https://images.unsplash.com/photo-1560031802-9a741366b26c?q=80&w=800&auto=format&fit=crop' },
    { title: 'Salon & Beauty', desc: 'Premium salon and spa treatments.', img: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop' },
    { title: 'Personal Stylists', desc: 'Professional wardrobe consultation.', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop' },
    { title: 'Photographers', desc: 'Editorial coverage for your memories.', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop' },
    { title: 'Event Planners', desc: 'Seamless event and wedding planning.', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop' },
    { title: 'Shopping Assistant', desc: 'In-person help finding the right style.', img: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=800&auto=format&fit=crop' },
    { title: 'Fashion Consultation', desc: 'Expert advice on the latest trends.', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop' },
  ];

  return (
    <main className="min-h-screen bg-bg-main">
      
      {/* 1. SERVICES HERO */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512496015851-a1dc8b41cd83?q=80&w=2000&auto=format&fit=crop" 
            alt="Women's beauty and lifestyle" 
            className="w-full h-full object-cover object-top"
          />
          {/* Elegant soft overlay to ensure text readability without making it too dark */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg-main/90 via-bg-main/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-start justify-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent mb-6 block">
            Femazon Services
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-text-main mb-6 max-w-2xl leading-[1.1]">
            Everything She Needs, All in One Place
          </h1>
          <p className="font-sans text-lg md:text-xl text-text-muted mb-10 max-w-xl leading-relaxed">
            Discover trusted beauty, styling, wedding, and lifestyle services designed exclusively around women.
          </p>
          <a 
            href="#categories"
            className="inline-flex items-center justify-center px-8 py-4 bg-text-main text-white text-[13px] font-bold uppercase tracking-widest rounded-full hover:bg-accent hover:text-text-main transition-colors duration-300"
          >
            Explore Services
          </a>
        </div>
      </section>

      {/* 2 & 3. SERVICE CATEGORIES & FEATURED SERVICES */}
      <section id="categories" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-text-main mb-4">Popular Services</h2>
          <p className="font-sans text-text-muted max-w-2xl mx-auto">
            Browse our most requested editorial and lifestyle experiences.
          </p>
        </div>
        <FeaturedServices />
      </section>

      {/* 4. EXPLORE ALL SERVICES (CAROUSEL) */}
      <section className="py-24 bg-accent/5">
        <div className="max-w-7xl mx-auto px-6 w-full mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-text-main">Find the Right Service for You</h2>
          <p className="font-sans text-text-muted mt-4 text-lg">
            Swipe through our complete directory of professional service providers.
          </p>
        </div>
        <div className="pl-6 md:pl-[calc((100vw-80rem)/2+1.5rem)]">
          <ServiceCarousel services={allCarouselServices} />
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="py-32 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent mb-4 block">
            Simple Process
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-text-main">How It Works</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 relative">
          {/* Subtle connecting line for desktop */}
          <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-[1px] bg-border-main/50 z-0"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white border border-accent/30 flex items-center justify-center text-accent mb-6 shadow-sm">
              <Search size={24} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-2xl text-text-main mb-3">01 — Choose</h3>
            <p className="font-sans text-text-muted leading-relaxed max-w-xs">
              Browse our curated directory and select the editorial or beauty service that matches your vision.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white border border-accent/30 flex items-center justify-center text-accent mb-6 shadow-sm">
              <Calendar size={24} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-2xl text-text-main mb-3">02 — Book</h3>
            <p className="font-sans text-text-muted leading-relaxed max-w-xs">
              Choose your preferred professional provider, and secure your perfect date and time instantly.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-accent text-bg-main flex items-center justify-center mb-6 shadow-md">
              <Sparkles size={24} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-2xl text-text-main mb-3">03 — Enjoy</h3>
            <p className="font-sans text-text-muted leading-relaxed max-w-xs">
              Relax and experience a premium, seamless service designed entirely around your needs.
            </p>
          </div>
        </div>
      </section>

      {/* 6. SPECIAL FEATURE — SHOPPING ASSISTANT */}
      <section className="py-24 px-6 w-full bg-white">
        <div className="max-w-7xl mx-auto rounded-[2.5rem] overflow-hidden bg-accent/5 border border-accent/10 flex flex-col lg:flex-row shadow-sm">
          <div className="lg:w-1/2 p-12 md:p-20 flex flex-col justify-center">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-6">
              <MapPin size={14} /> Available in select cities
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-text-main mb-6 leading-tight">
              Need a Little Help While You Shop?
            </h2>
            <p className="font-sans text-lg text-text-muted mb-8 leading-relaxed max-w-md">
              Book a nearby Shopping Assistant to accompany you, help you choose outfits, and make your shopping experience easier and more fun.
            </p>
            
            <div className="flex items-center gap-6 mb-10">
              <div className="flex flex-col">
                <span className="text-3xl font-serif text-text-main">₹100</span>
                <span className="text-sm font-sans text-text-muted">per hour</span>
              </div>
              <div className="w-[1px] h-10 bg-border-main"></div>
              <p className="text-sm font-sans text-text-muted max-w-[200px]">
                Professional fashion advice in real-time.
              </p>
            </div>
            
            <Link 
              href="/services/shopping-assistant"
              className="inline-flex items-center justify-center px-8 py-4 bg-text-main text-white text-[13px] font-bold uppercase tracking-widest rounded-full hover:bg-accent hover:text-text-main transition-colors duration-300 w-fit"
            >
              Book a Shopping Assistant
            </Link>
          </div>
          
          <div className="lg:w-1/2 min-h-[400px] lg:min-h-full relative">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop" 
              alt="Two women shopping together" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 7. WHY FEMAZON SERVICES? */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full border-t border-border-main/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="flex flex-col items-start">
            <ShieldCheck size={28} className="text-accent mb-5" strokeWidth={1.5} />
            <h4 className="font-serif text-xl text-text-main mb-2">Verified Providers</h4>
            <p className="font-sans text-sm text-text-muted leading-relaxed">
              Every professional is thoroughly vetted to ensure you receive only trusted, high-quality service.
            </p>
          </div>
          
          <div className="flex flex-col items-start">
            <Calendar size={28} className="text-accent mb-5" strokeWidth={1.5} />
            <h4 className="font-serif text-xl text-text-main mb-2">Easy Booking</h4>
            <p className="font-sans text-sm text-text-muted leading-relaxed">
              Our streamlined platform lets you choose your exact service, date, and time with zero friction.
            </p>
          </div>
          
          <div className="flex flex-col items-start">
            <Sparkles size={28} className="text-accent mb-5" strokeWidth={1.5} />
            <h4 className="font-serif text-xl text-text-main mb-2">Women-Focused</h4>
            <p className="font-sans text-sm text-text-muted leading-relaxed">
              Every service on our platform is carefully curated and designed around women's specific needs.
            </p>
          </div>
          
          <div className="flex flex-col items-start">
            <CheckCircle2 size={28} className="text-accent mb-5" strokeWidth={1.5} />
            <h4 className="font-serif text-xl text-text-main mb-2">Secure Payments</h4>
            <p className="font-sans text-sm text-text-muted leading-relaxed">
              Enjoy peace of mind with our safe, transparent, and convenient platform payment system.
            </p>
          </div>
          
        </div>
      </section>

      {/* 8. BECOME A SERVICE PROVIDER CTA */}
      <section className="py-32 px-6 bg-accent text-bg-main text-center flex flex-col items-center justify-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Have a Skill? Grow With Femazon.</h2>
          <p className="font-sans text-lg opacity-90 mb-10 max-w-lg leading-relaxed">
            Join the Femazon professional network and connect your services with women looking for trusted professionals like you.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              href="/vendor/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-bg-main text-text-main text-[13px] font-bold uppercase tracking-widest rounded-full hover:bg-white transition-colors duration-300"
            >
              Become a Provider
            </Link>
            <Link 
              href="/vendor/about"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-bg-main border border-bg-main/30 text-[13px] font-bold uppercase tracking-widest rounded-full hover:bg-bg-main/10 transition-colors duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
