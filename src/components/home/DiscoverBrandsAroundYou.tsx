"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Store, ArrowRight, Sparkles, Building2, ChevronRight } from "lucide-react";
import { ACTIVE_MARKETPLACE_LOCATIONS, MarketplaceLocation } from "@/data/locationMarketplaceData";

interface DiscoverBrandsAroundYouProps {
  onSelectCity?: (cityName: string) => void;
  selectedCity?: string;
  showExploreLink?: boolean;
}

export function DiscoverBrandsAroundYou({
  onSelectCity,
  selectedCity: controlledCity,
  showExploreLink = true,
}: DiscoverBrandsAroundYouProps) {
  const [activeCity, setActiveCity] = useState<string>(controlledCity || "Coimbatore");

  const currentCityData = ACTIVE_MARKETPLACE_LOCATIONS.find(
    (loc) => loc.name.toLowerCase() === (controlledCity || activeCity).toLowerCase()
  ) || ACTIVE_MARKETPLACE_LOCATIONS[0];

  const handleCityClick = (city: MarketplaceLocation) => {
    setActiveCity(city.name);
    if (onSelectCity) {
      onSelectCity(city.name);
    }
  };

  return (
    <section className="w-full bg-white py-3 sm:py-5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="w-full bg-[#FAF7F5] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-stone-200/80 shadow-2xs">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 mb-2.5">
              <MapPin size={13} className="text-[#4A1513]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A1513]">
                LOCAL MARKETPLACE DISCOVERY
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-stone-900 font-light tracking-wide">
              Discover Brands Around You
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-600 max-w-2xl font-light">
              Explore boutiques, beauty brands and unique collections available in your favourite cities.
            </p>
          </div>

          {showExploreLink && (
            <Link
              href={`/shop?location=${encodeURIComponent(currentCityData.name)}`}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#4A1513] hover:text-[#350B0A] transition-colors group shrink-0"
            >
              <span>Explore All in {currentCityData.name}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* City Selection Pills */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {ACTIVE_MARKETPLACE_LOCATIONS.map((city) => {
            const isSelected = city.name.toLowerCase() === (controlledCity || activeCity).toLowerCase();
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => handleCityClick(city)}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-[#4A1513] text-white shadow-sm ring-2 ring-[#4A1513]/20"
                    : "bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/90 shadow-2xs"
                }`}
              >
                <Building2 size={14} className={isSelected ? "text-[#E5C3A6]" : "text-stone-400"} />
                <span>{city.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {city.activeSellersCount} sellers
                </span>
              </button>
            );
          })}
        </div>

        {/* Highlighted City Card & Featured Boutiques Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-7 shadow-xs">
          
          {/* Left Column: City Spotlight Banner */}
          <div className="lg:col-span-5 relative rounded-xl overflow-hidden min-h-[260px] sm:min-h-[300px] flex flex-col justify-end p-6 text-white group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentCityData.image}
              alt={currentCityData.name}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
            
            <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E5C3A6] block mb-1">
                {currentCityData.state}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-white mb-1.5">
                {currentCityData.name}
              </h3>
              <p className="text-xs text-stone-200/90 line-clamp-2 font-light mb-4">
                {currentCityData.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {currentCityData.popularCategories.map((cat) => (
                  <span
                    key={cat}
                    className="text-[10.5px] px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs font-medium">
                <Link
                  href={`/shop?location=${encodeURIComponent(currentCityData.name)}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-stone-900 font-semibold hover:bg-[#E5C3A6] transition-colors"
                >
                  <span>Shop {currentCityData.name}</span>
                  <ArrowRight size={13} />
                </Link>
                <Link
                  href={`/brands?city=${encodeURIComponent(currentCityData.name)}`}
                  className="text-stone-200 hover:text-white underline underline-offset-4"
                >
                  View {currentCityData.activeSellersCount} Local Brands
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Local Brands from Selected City */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Store size={16} className="text-[#4A1513]" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-stone-800">
                    Active Sellers &amp; Boutiques in {currentCityData.name}
                  </h4>
                </div>
                <span className="text-xs text-stone-500 font-light">
                  {currentCityData.productCount}+ products available
                </span>
              </div>

              {/* Brands Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {currentCityData.featuredBrands.map((brand) => (
                  <div
                    key={brand.id}
                    className="p-3.5 rounded-xl border border-stone-200/80 hover:border-[#4A1513]/40 bg-[#FAF7F5]/50 hover:bg-[#FAF7F5] transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 mb-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={brand.image}
                          alt={brand.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">
                        {brand.category}
                      </span>
                      <h5 className="font-serif text-sm font-semibold text-stone-900 group-hover:text-[#4A1513] transition-colors line-clamp-1 mt-0.5">
                        {brand.name}
                      </h5>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                      <span className="font-medium text-amber-700 flex items-center gap-1">
                        ★ {brand.rating}
                      </span>
                      <Link
                        href={`/shop?brand=${encodeURIComponent(brand.name)}`}
                        className="text-[#4A1513] font-semibold hover:underline flex items-center gap-0.5"
                      >
                        <span>View</span>
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Local Delivery & Seller Guarantee Banner */}
            <div className="mt-5 p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-medium">
                <Sparkles size={15} className="text-amber-700 shrink-0" />
                <span>
                  Shopping local supports verified women artisans and boutique designers with priority express delivery.
                </span>
              </div>
              <Link
                href="/partner"
                className="text-amber-950 font-bold hover:underline shrink-0 text-[11.5px]"
              >
                Are you a {currentCityData.name} Seller? Join Us &rarr;
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  </section>
  );
}
