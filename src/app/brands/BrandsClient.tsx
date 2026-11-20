"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  Search, 
  Store, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  Filter,
  CheckCircle2,
  X
} from "lucide-react";
import { ACTIVE_MARKETPLACE_LOCATIONS } from "@/data/locationMarketplaceData";
import { PageBanner } from "@/components/common/PageBanner";

export interface BrandListing {
  id: string | number;
  name: string;
  brandName?: string;
  category: string;
  city?: string;
  rating?: number;
  featured?: boolean;
  image?: string;
  logo?: string;
  badge?: string;
  description?: string;
  productCount?: number;
  storeUrl?: string;
}

interface BrandsClientProps {
  initialBrands: BrandListing[];
  initialCity?: string;
}

const CATEGORIES = [
  "All Categories",
  "Women's Wear",
  "Beauty & Self-care",
  "Jewellery & Accessories",
  "Gifts for All Occasions",
];

export function BrandsClient({ initialBrands, initialCity = "all" }: BrandsClientProps) {
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredBrands = useMemo(() => {
    return initialBrands.filter((brand) => {
      // City filter
      if (selectedCity !== "all") {
        const brandCity = (brand.city || "").toLowerCase();
        if (!brandCity.includes(selectedCity.toLowerCase())) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "All Categories") {
        const brandCat = (brand.category || "").toLowerCase();
        if (!brandCat.includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (brand.name || "").toLowerCase().includes(q);
        const matchesBrand = (brand.brandName || "").toLowerCase().includes(q);
        const matchesDesc = (brand.description || "").toLowerCase().includes(q);
        const matchesCity = (brand.city || "").toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesDesc && !matchesCity) {
          return false;
        }
      }

      return true;
    });
  }, [initialBrands, selectedCity, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-stone-900 font-sans">
      
      {/* Standardized Page Banner matching Shop reference */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <PageBanner
          title="Our Brands & Boutiques"
          highlightText="Verified Ateliers"
          description="Discover independent women's fashion ateliers, generational master weavers, beauty formulators and handcrafted gift makers across India."
          ctaText="Explore Boutiques"
          ctaLink="#brands-list"
          imageSrc="/banners/hero_runway.jpg"
          fallbackImage="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800"
          imageAlt="Our Brands and Boutiques"
        />
      </div>

      {/* Main Container */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Search & Location Filter Controls */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-6 shadow-xs mb-8">
          
          {/* Top Bar: Search Input */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-5 pb-5 border-b border-stone-100">
            <div className="relative w-full flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brands by name, city or specialty..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#4A1513] focus:ring-1 focus:ring-[#4A1513]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <span className="text-xs text-stone-500 font-medium">
                Showing {filteredBrands.length} Verified Brands
              </span>
            </div>
          </div>

          {/* City Selection Pills */}
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
              FILTER BY CITY / LOCATION:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCity("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCity === "all"
                    ? "bg-[#4A1513] text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                All Cities
              </button>
              {ACTIVE_MARKETPLACE_LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setSelectedCity(loc.name)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCity.toLowerCase() === loc.name.toLowerCase()
                      ? "bg-[#4A1513] text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  {loc.name} ({loc.activeSellersCount})
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
              FILTER BY CATEGORY:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#4A1513] text-white"
                      : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Brands Grid */}
        {filteredBrands.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/90 p-8">
            <Building2 size={40} className="mx-auto text-stone-300 mb-3" />
            <h3 className="font-serif text-xl font-semibold text-stone-800 mb-2">
              No brands found in {selectedCity !== "all" ? selectedCity : "this category"}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-6 font-light">
              We are actively onboarding verified boutiques and independent sellers in this location. Are you a seller here?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => { setSelectedCity("all"); setSelectedCategory("All Categories"); setSearchQuery(""); }}
                className="px-5 py-2.5 rounded-full border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Clear Filters
              </button>
              <Link
                href="/partner"
                className="px-5 py-2.5 rounded-full bg-[#4A1513] text-white text-xs font-semibold hover:bg-[#350B0A]"
              >
                Partner With Femazon
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Brand Cover Image */}
                  <div className="aspect-[16/9] rounded-xl overflow-hidden bg-stone-100 mb-4 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.image || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=600"}
                      alt={brand.name}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    />
                    {brand.badge && (
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#4A1513] text-white text-[9px] font-bold tracking-wider">
                        {brand.badge}
                      </span>
                    )}
                  </div>

                  {/* Brand Details */}
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                    <MapPin size={13} className="text-[#4A1513]" />
                    <span className="font-medium text-stone-700">{brand.city || "India"}</span>
                    <span>&bull;</span>
                    <span className="text-stone-600">{brand.category}</span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-stone-900 group-hover:text-[#4A1513] transition-colors">
                    {brand.name}
                  </h3>

                  <p className="text-xs text-stone-600 font-light mt-1.5 line-clamp-2 leading-relaxed">
                    {brand.description ||
                      "Curated women's fashion, ethnic wear and lifestyle essentials crafted with artisanal care."}
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-700">
                    <span>★ {brand.rating || 4.9}</span>
                    <CheckCircle2 size={13} className="text-emerald-600 ml-1" />
                    <span className="text-[10px] text-emerald-800 font-medium">Verified</span>
                  </div>

                  <Link
                    href={brand.storeUrl || `/shop?brand=${encodeURIComponent(brand.name)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4A1513] text-white text-xs font-semibold hover:bg-[#350B0A] transition-colors"
                  >
                    <span>View Collection</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
