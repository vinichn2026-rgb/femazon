"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Wand2, 
  Layers, 
  Palette
} from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  discount?: number;
  img: string;
  badge: string;
  slug?: string;
}

interface CuratedPageProps {
  trendingProducts: ProductItem[];
}

export function CuratedPageClient({ trendingProducts }: CuratedPageProps) {
  const trendingScrollRef = useRef<HTMLDivElement>(null);
  const [activeMoment, setActiveMoment] = useState<string>("All");

  const scrollTrending = (dir: "left" | "right") => {
    if (trendingScrollRef.current) {
      const scrollAmt = dir === "left" ? -340 : 340;
      trendingScrollRef.current.scrollBy({ left: scrollAmt, behavior: "smooth" });
    }
  };

  // 1. Shop By Moment (6 Core Curated Collections)
  const moments = [
    {
      id: "wedding",
      title: "Wedding Edit",
      emoji: "💍",
      subtitle: "Bridal grandeur, reception glam & celebratory weaves",
      tag: "BRIDAL & COUTURE",
      img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?q=80&w=800&h=1100&auto=format&fit=crop&crop=top",
      link: "/shop?category=Occasions&subcategory=Wedding%20Wear",
      color: "from-amber-950/70 to-black/80"
    },
    {
      id: "festive",
      title: "Festive Edit",
      emoji: "🌸",
      subtitle: "Vibrant jewel tones, rich brocades & heirloom zari",
      tag: "FESTIVE '26",
      img: "https://images.unsplash.com/photo-1583391733958-d15ce1711202?q=80&w=800&h=1100&auto=format&fit=crop&crop=top",
      link: "/shop?category=Occasions&subcategory=Festive%20Wear",
      color: "from-rose-950/70 to-black/80"
    },
    {
      id: "party",
      title: "Party Edit",
      emoji: "✨",
      subtitle: "Cocktail shimmer, evening silks & statement drapes",
      tag: "EVENING GLAM",
      img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&h=1100&auto=format&fit=crop&crop=top",
      link: "/shop?category=Occasions&subcategory=Party%20Wear",
      color: "from-purple-950/70 to-black/80"
    },
    {
      id: "office",
      title: "Office Edit",
      emoji: "💼",
      subtitle: "Smart tunics, clean cottons & sophisticated workwear",
      tag: "POWER CASUAL",
      img: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=800&h=1100&auto=format&fit=crop&crop=top",
      link: "/shop?category=Occasions&subcategory=Office%20Wear",
      color: "from-slate-900/70 to-black/80"
    },
    {
      id: "datenight",
      title: "Date Night Edit",
      emoji: "❤️",
      subtitle: "Romantic contemporary silhouettes & effortless elegance",
      tag: "CHIC ROMANCE",
      img: "https://images.unsplash.com/photo-1599746146388-a7ec2004b67a?q=80&w=800&h=1100&auto=format&fit=crop&crop=top",
      link: "/shop?category=Occasions&subcategory=Reception%20Wear",
      color: "from-red-950/70 to-black/80"
    },
    {
      id: "everyday",
      title: "Everyday Edit",
      emoji: "☀️",
      subtitle: "Relaxed linen sets, lightweight kurtas & breezy summer fits",
      tag: "DAILY ESSENTIALS",
      img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&h=1100&auto=format&fit=crop&crop=top",
      link: "/shop?category=Occasions&subcategory=Casual%20Wear",
      color: "from-stone-900/70 to-black/80"
    }
  ];

  // 2. Style Personalities
  const personalities = [
    {
      name: "Minimalist",
      desc: "Understated elegance, neutral tones & clean lines",
      badge: "SUBTLE LUXURY",
      img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&h=800&auto=format&fit=crop",
      link: "/shop?category=Dresses"
    },
    {
      name: "Glamorous",
      desc: "Opulent embroideries, rich metallics & spotlight outfits",
      badge: "HIGH DRAMA",
      img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&h=800&auto=format&fit=crop",
      link: "/shop?category=Saree"
    },
    {
      name: "Heritage Ethnic",
      desc: "Authentic Kanchipuram, Banarasi & regal Anarkalis",
      badge: "TIMELESS ROYAL",
      img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?q=80&w=600&h=800&auto=format&fit=crop",
      link: "/shop?category=Anarkali"
    },
    {
      name: "Modern Fusion",
      desc: "Dhoti suits, cape lehengas & Indo-western co-ords",
      badge: "CONTEMPORARY",
      img: "https://images.unsplash.com/photo-1583391733958-d15ce1711202?q=80&w=600&h=800&auto=format&fit=crop",
      link: "/shop?category=Co-ords"
    },
    {
      name: "Soft Feminine",
      desc: "Pastel organza, delicate floral prints & flowy kaftans",
      badge: "POETIC PASTEL",
      img: "https://images.unsplash.com/photo-1599746146388-a7ec2004b67a?q=80&w=600&h=800&auto=format&fit=crop",
      link: "/shop?category=Kurti"
    },
    {
      name: "Bold & Confident",
      desc: "Sharp power silhouettes, deep jewel tones & dramatic jackets",
      badge: "SIGNATURE EDIT",
      img: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=600&h=800&auto=format&fit=crop",
      link: "/shop?category=Chudithar"
    }
  ];

  // 3. Color Stories
  const colorStories = [
    {
      name: "Pretty in Pink",
      palette: "Blush, Rose & Magenta",
      hex: "#E07A9A",
      bgClass: "bg-pink-100 border-pink-200 text-pink-950",
      dot: "bg-pink-500",
      link: "/shop?color=Pink"
    },
    {
      name: "Classic Black",
      palette: "Obsidian & Midnight Noir",
      hex: "#1A1A1A",
      bgClass: "bg-stone-900 border-stone-800 text-white",
      dot: "bg-black border border-white/40",
      link: "/shop?color=Black"
    },
    {
      name: "Royal Red",
      palette: "Crimson, Ruby & Deep Maroon",
      hex: "#4A1513",
      bgClass: "bg-[#4A1513]/10 border-[#4A1513]/30 text-[#4A1513]",
      dot: "bg-[#4A1513]",
      link: "/shop?color=Red"
    },
    {
      name: "Pastel Sky",
      palette: "Lavender, Powder Blue & Mint",
      hex: "#A7BFE8",
      bgClass: "bg-indigo-50 border-indigo-200 text-indigo-950",
      dot: "bg-indigo-400",
      link: "/shop?color=Lavender"
    },
    {
      name: "Earth Tones",
      palette: "Sandstone, Rust & Warm Ochre",
      hex: "#B58A63",
      bgClass: "bg-amber-50 border-amber-200 text-amber-950",
      dot: "bg-amber-600",
      link: "/shop?color=Mustard"
    },
    {
      name: "Timeless White",
      palette: "Ivory, Pearl & Soft Ecru",
      hex: "#FFFFFF",
      bgClass: "bg-stone-100 border-stone-300 text-stone-900",
      dot: "bg-white border border-stone-400",
      link: "/shop?color=White"
    }
  ];

  const defaultTrending: ProductItem[] = trendingProducts.length > 0 ? trendingProducts : [
    {
      id: "1",
      name: "Banarasi Zari Tissue Saree",
      category: "Viral Sarees",
      price: "₹4,899",
      originalPrice: "₹7,499",
      discount: 35,
      img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?q=80&w=600&h=800&auto=format&fit=crop",
      badge: "VIRAL SAREE",
      slug: "banarasi-zari-tissue-saree"
    },
    {
      id: "2",
      name: "Layered Angrakha Anarkali Set",
      category: "Trending Kurtis",
      price: "₹3,499",
      originalPrice: "₹4,999",
      discount: 30,
      img: "https://images.unsplash.com/photo-1583391733958-d15ce1711202?q=80&w=600&h=800&auto=format&fit=crop",
      badge: "BESTSELLER",
      slug: "layered-angrakha-anarkali-set"
    },
    {
      id: "3",
      name: "Embroidered Cape Co-ord Set",
      category: "Popular Co-ords",
      price: "₹2,899",
      originalPrice: "₹3,899",
      discount: 25,
      img: "/categories/linen_coord.png",
      badge: "TRENDING NOW",
      slug: "embroidered-cape-coord-set"
    },
    {
      id: "4",
      name: "Satin Evening Cocktail Gown",
      category: "Statement Dresses",
      price: "₹3,999",
      originalPrice: "₹5,499",
      discount: 27,
      img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&h=800&auto=format&fit=crop",
      badge: "CELEB STYLE",
      slug: "satin-evening-cocktail-gown"
    },
    {
      id: "5",
      name: "Chikankari Kurta with Dupatta",
      category: "Trending Kurtis",
      price: "₹2,299",
      originalPrice: "₹3,199",
      discount: 28,
      img: "/categories/chikankari_kurta.png",
      badge: "STAFF PICK",
      slug: "chikankari-kurta-dupatta"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-[#4A1513] selection:text-white">
      
      {/* 1. Clean Editorial Header (No dark hero banner) */}
      <div className="pt-8 sm:pt-12 pb-4 text-center border-b border-stone-200/60 bg-white">
        <div className="mx-auto max-w-4xl px-4 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#4A1513]/5 border border-[#4A1513]/15 mb-3">
            <Sparkles size={12} className="text-[#4A1513]" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-[#4A1513]">
              FEMAZON EDITS
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#3D110F] font-normal tracking-tight mb-2">
            Curated For Every Moment
          </h1>

          <p className="text-stone-500 text-xs sm:text-sm md:text-base max-w-xl font-light leading-relaxed">
            Discover handpicked styles designed for every occasion, mood, and version of you.
          </p>
        </div>
      </div>

      {/* 2. Step 3: Main Category - Shop By Moment */}
      <section id="moments" className="py-12 sm:py-16 md:py-20 border-b border-stone-200/70 scroll-mt-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.28em] text-[#4A1513] block mb-2">
              OCCASION EDITS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#3D110F] font-normal tracking-tight">
              Shop By Moment
            </h2>
            <p className="mt-2 text-stone-500 text-xs sm:text-sm font-light">
              Select your upcoming event to explore strictly handpicked and curated outfits.
            </p>
          </div>

          {/* 6 Visual Moment Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5">
            {moments.map((m) => (
              <Link
                key={m.id}
                href={m.link}
                className="group relative flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-200/80 bg-white aspect-[3/4.2]"
              >
                <img
                  src={m.img}
                  alt={m.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${m.color} opacity-75 group-hover:opacity-85 transition-opacity duration-500`}></div>

                {/* Top Badge */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#E5C3A6] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                    {m.tag}
                  </span>
                  <span className="text-base">{m.emoji}</span>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-3 sm:bottom-4 inset-x-3 text-white">
                  <h3 className="font-serif text-base sm:text-lg font-normal text-white mb-1 group-hover:text-[#F3DFCA] transition-colors line-clamp-1">
                    {m.title}
                  </h3>
                  <p className="text-[10px] text-stone-200/80 line-clamp-2 leading-relaxed font-light hidden sm:block">
                    {m.subtitle}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#E5C3A6] group-hover:translate-x-1 transition-transform">
                    <span>Shop Edit</span>
                    <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Step 4: Trending Edit (Horizontal Swipe Carousel) */}
      <section className="py-12 sm:py-16 md:py-20 bg-white border-b border-stone-200/70">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.28em] text-[#4A1513] block mb-1.5">
                HANDPICKED HIGHLIGHTS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#3D110F] font-normal tracking-tight">
                Trending Now
              </h2>
              <p className="mt-1 text-stone-500 text-xs sm:text-sm font-light">
                The styles everyone is loving and wearing right now.
              </p>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => scrollTrending("left")}
                aria-label="Previous Slide"
                className="w-10 h-10 rounded-full border border-stone-200 bg-white hover:bg-[#4A1513] text-stone-800 hover:text-white shadow-sm flex items-center justify-center transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollTrending("right")}
                aria-label="Next Slide"
                className="w-10 h-10 rounded-full border border-stone-200 bg-white hover:bg-[#4A1513] text-stone-800 hover:text-white shadow-sm flex items-center justify-center transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Swipe Container */}
          <div
            ref={trendingScrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar scroll-smooth pb-4 pt-1"
          >
            {defaultTrending.map((item) => (
              <div
                key={item.id}
                className="group relative flex-none w-[200px] sm:w-[240px] md:w-[270px] bg-[#FDFBF7] rounded-2xl p-3 border border-stone-200/70 hover:shadow-xl hover:border-[#4A1513]/30 transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-stone-100 mb-3">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Badge */}
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-wider text-white bg-[#4A1513] px-2.5 py-0.5 rounded-full shadow-sm">
                    {item.badge}
                  </span>

                  {/* Wishlist Icon */}
                  <button className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-rose-600 flex items-center justify-center shadow-sm transition-colors">
                    <Heart size={14} />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#4A1513] block mb-1">
                      {item.category}
                    </span>
                    <h4 className="font-serif text-sm sm:text-base font-normal text-stone-900 line-clamp-1 group-hover:text-[#4A1513] transition-colors">
                      {item.name}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[#3D110F]">{item.price}</span>
                      {item.originalPrice && (
                        <span className="ml-2 text-xs text-stone-400 line-through font-normal">{item.originalPrice}</span>
                      )}
                    </div>

                    <Link
                      href={item.slug ? `/products/${item.slug}` : `/shop`}
                      className="w-8 h-8 rounded-full bg-[#4A1513] hover:bg-[#3D110F] text-white flex items-center justify-center transition-colors shadow-sm"
                      title="View Details"
                    >
                      <ShoppingBag size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Step 5: Style Personality Section (Find Your Style) */}
      <section className="py-12 sm:py-16 md:py-20 border-b border-stone-200/70">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.28em] text-[#4A1513] block mb-2">
              EXPRESS YOUR ESSENCE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#3D110F] font-normal tracking-tight">
              Find Your Style Personality
            </h2>
            <p className="mt-2 text-stone-500 text-xs sm:text-sm font-light">
              Tailored edits crafted specifically for the unique aesthetics you adore.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5">
            {personalities.map((p, idx) => (
              <Link
                key={idx}
                href={p.link}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 aspect-[3/4.4]"
              >
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

                <div className="absolute top-3 left-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#E5C3A6] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                    {p.badge}
                  </span>
                </div>

                <div className="absolute bottom-3.5 inset-x-3 text-white">
                  <h3 className="font-serif text-base sm:text-lg font-normal text-white group-hover:text-[#F3DFCA] transition-colors mb-1">
                    {p.name}
                  </h3>
                  <p className="text-[10px] text-stone-300 font-light line-clamp-2 leading-relaxed hidden sm:block">
                    {p.desc}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#E5C3A6]">
                    <span>Explore Aesthetic</span>
                    <ChevronRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Step 6: Color Stories (Shop By Color) */}
      <section className="py-12 sm:py-16 md:py-20 bg-white border-b border-stone-200/70">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.28em] text-[#4A1513] block mb-2">
              CHROMATIC CURATIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#3D110F] font-normal tracking-tight flex items-center justify-center gap-2">
              <Palette size={24} className="text-[#4A1513]" />
              Shop By Color Stories
            </h2>
            <p className="mt-2 text-stone-500 text-xs sm:text-sm font-light">
              Dive into our curated color edits tailored for every mood and seasonal shade.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5">
            {colorStories.map((c, idx) => (
              <Link
                key={idx}
                href={c.link}
                className={`group p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg flex flex-col justify-between aspect-[1/1.1] ${c.bgClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-5 h-5 rounded-full ${c.dot} shadow-sm`}></span>
                  <ArrowRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>

                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold tracking-tight mb-1">
                    {c.name}
                  </h3>
                  <p className="text-[11px] opacity-75 font-sans leading-tight">
                    {c.palette}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* 7. Step 8: AI Integration (Your Personal AI Edit) */}
      <section className="py-14 sm:py-18 bg-gradient-to-b from-white to-[#F9F5F0] border-t border-stone-200/70">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A1513]/10 border border-[#4A1513]/20 mb-4">
            <Wand2 size={14} className="text-[#4A1513]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513]">
              YOUR PERSONAL AI EDIT
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#3D110F] font-normal tracking-tight mb-4">
            Not Sure What To Wear?
          </h2>

          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed mb-8">
            Let Femazon AI analyze your style, body type, and occasion to curate bespoke outfit combinations instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/services/styling"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#4A1513] hover:bg-[#3D110F] text-white font-bold text-[12px] uppercase tracking-[0.2em] shadow-md hover:shadow-xl transition-all duration-300"
            >
              <Sparkles size={14} />
              <span>TRY AI STYLING</span>
            </Link>

            <Link
              href="/ai-wardrobe"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-stone-100 text-[#4A1513] border border-stone-300 font-bold text-[12px] uppercase tracking-[0.2em] shadow-sm transition-all duration-300"
            >
              <Layers size={14} />
              <span>BUILD MY WARDROBE</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
