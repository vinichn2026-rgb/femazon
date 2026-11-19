import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { 
  Sparkles, 
  MapPin, 
  Store, 
  Scissors, 
  Heart, 
  Gift, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Gem, 
  Crown,
  CheckCircle2,
  Building2
} from "lucide-react";
import { DiscoverBrandsAroundYou } from "@/components/home/DiscoverBrandsAroundYou";
import { ACTIVE_MARKETPLACE_LOCATIONS } from "@/data/locationMarketplaceData";
import { getApprovedPartnerDirectory } from "@/lib/partnerDirectory";
import { getApprovedStylists } from "@/lib/stylists";

export const metadata: Metadata = {
  title: "Discover Femazon | Local Marketplace, Independent Brands & Personal Stylists",
  description:
    "Explore curated women's wear, beauty, fine jewellery, gifting, local boutiques across Coimbatore, Chennai and independent personal styling professionals on Femazon.",
};

const DISCOVERY_CATEGORIES = [
  {
    title: "Women's Collections",
    subtitle: "Sarees, Lehengas, Kurtis, Co-ords & Dresses",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=800",
    href: "/shop?category=Women%27s+Wear",
    badge: "150+ ATELIERS",
    tags: ["Pure Silk Sarees", "Bridal Lehengas", "Designer Kurtas", "Party Dresses", "Co-ords"],
  },
  {
    title: "Beauty & Self-Care",
    subtitle: "Botanical Skincare, Hair Essentials & Makeup",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=85&w=800",
    href: "/shop?category=Beauty",
    badge: "CLEAN BEAUTY",
    tags: ["Facial Serums", "Organic Hair Oils", "Luminous Makeup", "Bath & Body", "Gift Sets"],
  },
  {
    title: "Jewellery & Accessories",
    subtitle: "22K Kundan, Uncut Polki & Designer Handbags",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=85&w=800",
    href: "/shop?category=Jewelry+%26+Accessories",
    badge: "HERITAGE & MODERN",
    tags: ["Bridal Chokers", "Temple Ornaments", "Potlis & Clutches", "Bangles", "Earrings"],
  },
  {
    title: "Gifts for Every Occasion",
    subtitle: "Artisanal Hampers, Bespoke Keepsakes & Celebration Boxes",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=85&w=800",
    href: "/shop?category=Gifts+for+All+Occasions",
    badge: "CELEBRATIONS",
    tags: ["Birthday Hampers", "Wedding Favours", "Anniversary Gifts", "Festival Sweets", "Gifts for Her"],
  },
];

export default async function DiscoverPage() {
  const [boutiques, stylistResult] = await Promise.all([
    getApprovedPartnerDirectory().catch(() => []),
    getApprovedStylists().catch(() => ({ stylists: [], error: null })),
  ]);

  const featuredStylists = (stylistResult.stylists || []).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-stone-900 font-sans selection:bg-[#4A1513] selection:text-white">
      
      {/* 1. Discover Hero Banner */}
      <section className="relative bg-[#4A1513] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E5C3A6_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-[1440px] mx-auto relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#E5C3A6] text-xs font-semibold uppercase tracking-[0.25em] mb-4 shadow-sm">
            <Sparkles size={13} />
            <span>HELLO THOZHI × FEMAZON MARKETPLACE</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-light tracking-tight leading-[1.15] mb-4">
            Discover Everything Women Love
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-white/85 font-light leading-relaxed max-w-2xl mx-auto mb-8">
            Your curated marketplace connecting you with independent boutiques, local women-led brands, fine jewellery, artisanal gifting, and certified personal stylists.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/shop"
              className="px-7 py-3 rounded-full bg-white text-stone-900 font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#E5C3A6] transition-all shadow-md active:scale-95"
            >
              Start Exploring Products
            </Link>
            <Link
              href="/brands"
              className="px-7 py-3 rounded-full bg-transparent hover:bg-white/10 text-white border border-white/30 text-xs font-semibold uppercase tracking-[0.2em] transition-all"
            >
              Browse Independent Brands
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Four Pillars of Discovery (Women's Wear, Beauty, Jewellery, Gifting) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-1.5">
              CURATED CATEGORY HUBS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-stone-900 tracking-wide">
              Explore by Department
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#4A1513] hover:underline"
          >
            <span>View All Categories</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DISCOVERY_CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative rounded-2xl overflow-hidden bg-white border border-stone-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white tracking-wider">
                  {cat.badge}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-stone-900 group-hover:text-[#4A1513] transition-colors mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed mb-4">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex flex-wrap gap-1">
                  {cat.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Shop by Location – Discover Brands Around You (Coimbatore, Chennai, etc.) */}
      <DiscoverBrandsAroundYou />

      {/* 4. Meet Independent Brands & Boutiques */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-1.5">
              FEMAZON OUR BRANDS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-stone-900 tracking-wide">
              Meet Independent Sellers &amp; Boutiques
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 font-light max-w-xl">
              Authentic Indian fashion ateliers, master weavers, and independent beauty makers verified by Femazon.
            </p>
          </div>
          <Link
            href="/brands"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#4A1513] hover:underline"
          >
            <span>Explore All Brands</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boutiques.map((brand: any) => (
            <div
              key={brand.id}
              className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-stone-100 mb-4 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brand.portfolioUrl || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=600"}
                    alt={brand.businessName || brand.name}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />
                  {(true) && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#4A1513] text-white text-[9px] font-bold tracking-wider">
                      VERIFIED
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                  <MapPin size={13} className="text-[#4A1513]" />
                  <span>{brand.location || "India"}</span>
                  <span>&bull;</span>
                  <span className="font-medium text-stone-700">{brand.categories}</span>
                </div>

                <h3 className="font-serif text-lg font-semibold text-stone-900 group-hover:text-[#4A1513] transition-colors">
                  {brand.businessName || brand.name}
                </h3>
                <p className="text-xs text-stone-600 font-light mt-1 line-clamp-2">
                  Specialized in premium collections, verified artisan quality, and direct boutique delivery.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-medium text-amber-700 flex items-center gap-1">
                  ★ 4.9 Verified Boutique
                </span>
                <Link
                  href={`/shop?brand=${encodeURIComponent(brand.businessName || brand.name)}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#4A1513] hover:underline"
                >
                  <span>View Collection</span>
                  <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Discover Personal Styling Professionals */}
      <section className="bg-white py-14 sm:py-18 border-y border-stone-200/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 mb-2">
                <Scissors size={13} className="text-[#4A1513]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A1513]">
                  BESPOKE FASHION EXPERTISE
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-stone-900 tracking-wide">
                Discover Certified Personal Stylists
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-stone-600 font-light max-w-xl">
                Book one-on-one wardrobe consultations, bridal trousseau curation, and virtual fashion styling sessions.
              </p>
            </div>
            <Link
              href="/personal-styling"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#4A1513] hover:underline"
            >
              <span>Explore All Stylists</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredStylists.map((stylist: any) => (
              <div
                key={stylist.id}
                className="rounded-2xl border border-stone-200/80 p-5 bg-[#FAF7F5] flex flex-col justify-between group hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-200 mb-4 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={stylist.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"}
                      alt={stylist.fullName}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    />
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white">
                      {stylist.city}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-0.5">
                    {stylist.specializations?.[0] || "Personal Styling"}
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-stone-900 group-hover:text-[#4A1513] transition-colors">
                    {stylist.fullName}
                  </h3>
                  <p className="text-xs text-stone-600 font-light mt-1 line-clamp-2">
                    {stylist.bio || "Personalized body silhouette mapping, color coordination, and custom wardrobe curation."}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-200/70 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block">Starting from</span>
                    <span className="font-mono text-sm font-bold text-[#4A1513]">
                      ₹{stylist.startingPrice?.toLocaleString("en-IN") || "1,999"}
                    </span>
                  </div>
                  <Link
                    href={`/personal-styling/${stylist.slug}`}
                    className="px-4 py-2 rounded-full bg-[#4A1513] text-white text-xs font-semibold hover:bg-[#350B0A] transition-colors"
                  >
                    View &amp; Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Partner With Femazon Promotion Banner */}
      <section className="bg-gradient-to-r from-[#4A1513] to-[#2E0B0A] text-white py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E5C3A6] block mb-2">
              JOIN THE FEMAZON ECOSYSTEM
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-white leading-tight">
              Grow Your Business With Femazon
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/80 font-light leading-relaxed">
              Are you a boutique owner, beauty brand, jewellery designer, gift artisan, or independent stylist? Expand your reach to thousands of shoppers looking for quality women&apos;s products.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/partner"
              className="px-8 py-3.5 rounded-full bg-white text-stone-900 font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#E5C3A6] transition-all shadow-lg active:scale-95"
            >
              Partner With Us
            </Link>
            <Link
              href="/personal-styling/register"
              className="px-6 py-3.5 rounded-full bg-transparent hover:bg-white/10 text-white border border-white/30 text-xs font-semibold uppercase tracking-[0.15em] transition-all"
            >
              Register as Stylist
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
