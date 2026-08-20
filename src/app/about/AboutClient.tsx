"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Scissors, ShoppingBag, Wand2, Smartphone, HeartHandshake } from 'lucide-react';

export default function AboutClient() {
  return (
    <div className="bg-surface text-text-main font-sans overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Femazon Editorial" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/80 mb-6">
            The Ultimate Destination
          </h2>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 tracking-tight drop-shadow-lg leading-tight">
            More than a store.<br />A lifestyle.
          </h1>
          <p className="text-sm md:text-lg text-zinc-100 max-w-2xl mx-auto font-light drop-shadow-md mb-10 leading-relaxed">
            Femazon is the first unified platform seamlessly blending premium fashion, beauty, home services, and AI-powered styling into one gorgeous ecosystem built exclusively for the modern woman.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shop" className="bg-white text-text-main font-bold text-xs uppercase tracking-widest px-10 py-4 rounded-full hover:bg-zinc-100 transition shadow-xl">
              Shop The Collection
            </Link>
            <Link href="/services" className="bg-transparent border border-white text-white font-bold text-xs uppercase tracking-widest px-10 py-4 rounded-full hover:bg-white/10 transition">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE VISION */}
      <section className="py-24 md:py-32 bg-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <Sparkles className="mx-auto text-primary mb-8" size={32} strokeWidth={1} />
          <h2 className="font-serif text-3xl md:text-5xl text-text-main mb-8 leading-tight">
            Redefining the way you discover your confidence.
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl font-light leading-relaxed">
            We believe that looking and feeling your best shouldn't require jumping between dozens of apps and websites. By bridging the gap between physical products and personal services, Femazon offers a holistic approach to your personal brand.
          </p>
        </div>
      </section>

      {/* 3. CORE PILLARS */}
      <section className="py-12 bg-[#fbf9f6]">
        <div className="max-w-[1400px] mx-auto px-6">
          
          {/* Pillar 1: Fashion */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 py-16 md:py-24 border-b border-accent/10">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center">
                  <ShoppingBag size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">01 / The Collection</span>
              </div>
              <h3 className="font-serif text-4xl lg:text-5xl text-text-main mb-6">Curated Fashion</h3>
              <p className="text-zinc-600 leading-relaxed mb-8 text-lg font-light">
                Discover a meticulously curated selection of apparel ranging from breathtaking ethnic wear to chic western silhouettes. We partner with top vendors to ensure quality, exclusivity, and style for every occasion.
              </p>
              <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-main hover:text-primary transition group">
                Shop Fashion <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2 h-[400px] md:h-[600px] bg-zinc-100 rounded-[2rem] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000&auto=format&fit=crop" alt="Fashion" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Pillar 2: Beauty */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 py-16 md:py-24 border-b border-accent/10">
            <div className="w-full md:w-1/2 h-[400px] md:h-[600px] bg-zinc-100 rounded-[2rem] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1596462502278-27bf85033e5a?q=80&w=1000&auto=format&fit=crop" alt="Beauty" className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-rose-500">02 / Cosmetics & Skincare</span>
              </div>
              <h3 className="font-serif text-4xl lg:text-5xl text-text-main mb-6">Premium Beauty</h3>
              <p className="text-zinc-600 leading-relaxed mb-8 text-lg font-light">
                Elevate your glow. From cruelty-free skincare essentials to high-pigment cosmetics, our beauty aisle is stocked with trusted brands that prioritize your skin's health and radiance.
              </p>
              <Link href="/shop?category=beauty" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-main hover:text-rose-500 transition group">
                Shop Beauty <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Pillar 3: Women-focused Services */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 py-16 md:py-24 border-b border-accent/10">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                  <Scissors size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-purple-500">03 / At-Home Care</span>
              </div>
              <h3 className="font-serif text-4xl lg:text-5xl text-text-main mb-6">Women-Focused Services</h3>
              <p className="text-zinc-600 leading-relaxed mb-8 text-lg font-light">
                Why step out when the salon can come to you? Book trusted, top-rated professionals for makeup, hair styling, mehndi, and spa treatments right in the comfort of your home.
              </p>
              <Link href="/services" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-main hover:text-purple-500 transition group">
                Book a Service <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2 h-[400px] md:h-[600px] bg-zinc-100 rounded-[2rem] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop" alt="Services" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Pillar 4: Personal Styling */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 py-16 md:py-24 border-b border-accent/10">
            <div className="w-full md:w-1/2 h-[400px] md:h-[600px] bg-zinc-100 rounded-[2rem] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop" alt="Styling" className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Wand2 size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">04 / Expert Advice</span>
              </div>
              <h3 className="font-serif text-4xl lg:text-5xl text-text-main mb-6">Personal Styling</h3>
              <p className="text-zinc-600 leading-relaxed mb-8 text-lg font-light">
                Not sure what to wear for that upcoming wedding or crucial interview? Consult with our verified personal stylists who will curate looks tailored exactly to your body type, preference, and budget.
              </p>
              <Link href="/services/styling" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-main hover:text-emerald-600 transition group">
                Hire a Stylist <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Pillar 5: AI Wardrobe */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 py-16 md:py-24 border-b border-accent/10">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                  <Smartphone size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-500">05 / Digital Closet</span>
              </div>
              <h3 className="font-serif text-4xl lg:text-5xl text-text-main mb-6">AI Wardrobe</h3>
              <p className="text-zinc-600 leading-relaxed mb-8 text-lg font-light">
                Welcome to the future of getting dressed. Upload pictures of your clothes and let our AI create daily outfit combinations based on weather, occasion, and your personal style. Never say "I have nothing to wear" again.
              </p>
              <Link href="/ai-wardrobe" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-main hover:text-blue-500 transition group">
                Try AI Wardrobe <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2 h-[400px] md:h-[600px] bg-zinc-100 rounded-[2rem] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1558769132-cb1fac0840c2?q=80&w=1000&auto=format&fit=crop" alt="AI Wardrobe" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Pillar 6: Shopping Assistance */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 py-16 md:py-24">
            <div className="w-full md:w-1/2 h-[400px] md:h-[600px] bg-zinc-100 rounded-[2rem] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=1000&auto=format&fit=crop" alt="Shopping Assistance" className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <HeartHandshake size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600">06 / Guided Buying</span>
              </div>
              <h3 className="font-serif text-4xl lg:text-5xl text-text-main mb-6">Shopping Assistance</h3>
              <p className="text-zinc-600 leading-relaxed mb-8 text-lg font-light">
                Overwhelmed by choices? Hire a dedicated shopping assistant. They'll browse the catalog with you in real-time, helping you find exactly what you're looking for, comparing fabrics, and ensuring the perfect fit.
              </p>
              <Link href="/services/shopping-assistant" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-main hover:text-amber-600 transition group">
                Find an Assistant <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 4. CTA */}
      <section className="bg-primary py-32 px-4 text-center">
        <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">Join the Movement</h2>
        <p className="text-zinc-400 max-w-xl mx-auto mb-10 text-lg font-light">
          Whether you're here to discover the latest trends, book a pampering session, or revolutionize your closet, Femazon is ready for you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/register" className="bg-white text-primary font-bold text-xs uppercase tracking-widest px-10 py-4 rounded-full hover:bg-zinc-100 transition shadow-xl">
            Create an Account
          </Link>
          <Link href="/vendor/register" className="bg-transparent border border-white/20 text-white font-bold text-xs uppercase tracking-widest px-10 py-4 rounded-full hover:bg-white/10 transition">
            Become a Partner
          </Link>
        </div>
      </section>
      
    </div>
  );
}
