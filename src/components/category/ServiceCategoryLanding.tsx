"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  SlidersHorizontal, 
  Search, 
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
} from 'lucide-react';
import { 
  MarketplaceCategory, 
  MarketplaceProfessional
} from '@/data/marketplaceData';
import { ServiceBookingModal } from '@/components/services/ServiceBookingModal';

interface ServiceCategoryLandingProps {
  category: MarketplaceCategory;
  professionals: MarketplaceProfessional[];
  directoryError?: string | null;
  initialSubcategory?: string;
}

export function ServiceCategoryLanding({
  category,
  professionals,
  directoryError,
  initialSubcategory,
}: ServiceCategoryLandingProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc' | 'popular'>('popular');
  const [bookingTarget, setBookingTarget] = useState<MarketplaceProfessional | null>(null);

  const availableLocations = useMemo(
    () => Array.from(new Set(
      professionals.map((professional) => professional.location).filter((location): location is string => Boolean(location))
    )),
    [professionals]
  );

  // Filtered & Sorted list
  const filteredProfessionals = useMemo(() => {
    let list = [...professionals];

    if (selectedSubcategory !== 'all') {
      const subObj = category.subcategories.find(s => s.slug === selectedSubcategory);
      if (subObj) {
        list = list.filter(p => 
          p.subcategory.toLowerCase().includes(subObj.name.toLowerCase()) ||
          subObj.name.toLowerCase().includes(p.subcategory.toLowerCase())
        );
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        (p.businessName && p.businessName.toLowerCase().includes(q)) ||
        p.bio.toLowerCase().includes(q) ||
        p.servicesOffered.some(s => s.name.toLowerCase().includes(q))
      );
    }

    if (selectedLocation !== 'all') {
      list = list.filter(p => p.location?.toLowerCase().includes(selectedLocation.toLowerCase()));
    }

    // Sort
    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price_asc') {
      list.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.startingPrice - a.startingPrice);
    } else {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return list;
  }, [professionals, selectedSubcategory, searchQuery, selectedLocation, sortBy, category]);

  return (
    <div className="bg-[#FAF7F5] min-h-screen pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full bg-[#4A1513] text-white overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
          <img 
            src={category.heroImage} 
            alt={category.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#38100e] via-[#4A1513]/90 to-transparent z-0" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-xs">
              <Sparkles size={14} /> FEMAZON SERVICES MARKETPLACE
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              {category.name}
            </h1>
            <p className="font-serif text-lg sm:text-xl text-rose-100 font-light italic mb-3">
              &quot;{category.tagline}&quot;
            </p>
            <p className="text-sm sm:text-base text-stone-200 leading-relaxed max-w-xl mb-6">
              {category.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-rose-100/90">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-xs">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Provider details shown as listed on Femazon</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-xs">
                <CheckCircle2 size={16} className="text-amber-400" />
                <span>Send a booking request to confirm details</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SUBCATEGORY PILLS STRIP */}
      <section className="bg-white border-b border-stone-200 sticky top-[88px] md:top-[96px] z-30 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition cursor-pointer ${
                selectedSubcategory === 'all'
                  ? 'bg-[#4A1513] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              All {category.name}
            </button>
            {category.subcategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => setSelectedSubcategory(sub.slug)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition cursor-pointer ${
                  selectedSubcategory === sub.slug
                    ? 'bg-[#4A1513] text-white font-bold shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{sub.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedSubcategory === sub.slug ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {professionals.filter((professional) => professional.subcategory === sub.name).length}
                  </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SUBCATEGORY VISUAL CAROUSEL/GRID (When "all" is active) */}
      {selectedSubcategory === 'all' && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Explore by Specialization
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">Explore the services and providers currently listed in this category</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {category.subcategories.map((sub) => (
              <div 
                key={sub.slug}
                onClick={() => setSelectedSubcategory(sub.slug)}
                className="group relative rounded-2xl overflow-hidden bg-white shadow-xs border border-stone-200 cursor-pointer hover:shadow-md hover:-translate-y-1 transition duration-300 flex flex-col"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100 relative">
                  <img 
                    src={sub.image} 
                    alt={sub.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {professionals.filter((professional) => professional.subcategory === sub.name).length} listed
                  </span>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="font-serif text-xs font-bold text-stone-900 group-hover:text-[#4A1513] transition line-clamp-1">
                    {sub.name}
                  </h3>
                  <p className="text-[10px] text-stone-500 line-clamp-2 mt-1">
                    {sub.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. MAIN LISTINGS & CONTROLS SECTION */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Controls Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Search bar within category */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${category.name}...`}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#4A1513]"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-stone-400" />
          </div>

          <div className="flex flex-wrap items-center gap-3 ml-auto text-xs">
            {/* Location selector */}
            {availableLocations.length > 0 && (
              <div className="flex items-center gap-1.5 text-stone-600 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                <MapPin size={14} className="text-[#4A1513]" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-transparent focus:outline-none text-xs text-stone-800"
                >
                  <option value="all">All Locations</option>
                  {availableLocations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort selector */}
            <div className="flex items-center gap-1.5 text-stone-600 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
              <SlidersHorizontal size={14} className="text-[#4A1513]" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-transparent focus:outline-none text-xs text-stone-800"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
            Professionals & Services
            <span className="text-xs font-sans font-normal text-stone-500 ml-2">
              ({filteredProfessionals.length} available)
            </span>
          </h2>
        </div>

        {filteredProfessionals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
            <div className="w-16 h-16 bg-rose-50 text-[#4A1513] rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">
              {directoryError ? "Directory unavailable" : "No professionals found"}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6" role={directoryError ? "alert" : undefined}>
              {directoryError || (professionals.length === 0
                ? "No providers are listed in this category yet. Please check back soon."
                : "We couldn't find matching specialists for your current search or filters. Try resetting filters.")}
            </p>
            <button
              onClick={() => {
                setSelectedSubcategory('all');
                setSearchQuery('');
                setSelectedLocation('all');
              }}
              className="px-6 py-2.5 bg-[#4A1513] text-white rounded-xl text-xs font-bold tracking-wider uppercase hover:bg-[#38100e] transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((prof) => (
              <div 
                key={prof.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-xl hover:border-stone-300 transition duration-300 flex flex-col justify-between"
              >
                {/* Top: Photo & Basic Details */}
                <div>
                  <div className="p-5 pb-0 flex items-start gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                      <img 
                        src={prof.image} 
                        alt={prof.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#4A1513] bg-rose-50 px-2 py-0.5 rounded-md">
                          {prof.subcategory}
                        </span>
                        {prof.verified && (
                          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                            <ShieldCheck size={11} /> Verified
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-base font-bold text-stone-900 truncate">
                        {prof.name}
                      </h3>
                      {prof.businessName && (
                        <p className="text-xs font-medium text-stone-600 truncate">{prof.businessName}</p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-1.5 text-xs">
                        {prof.reviewsCount > 0 ? (
                          <>
                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                              <Star size={13} fill="currentColor" />
                              <span>{prof.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-stone-300">•</span>
                            <span className="text-stone-500 text-[11px]">{prof.reviewsCount} reviews</span>
                          </>
                        ) : (
                          <span className="text-stone-500 text-[11px]">No reviews yet</span>
                        )}
                        <span className="text-stone-300">•</span>
                        <span className="text-stone-500 text-[11px]">{prof.experience || "Experience not listed"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location & Availability */}
                  <div className="px-5 pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
                      <MapPin size={13} className="text-stone-400 shrink-0" />
                      <span className="truncate">{prof.location || "Service area not provided"}</span>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {prof.bio || "Provider profile details have not been added yet."}
                    </p>
                    {prof.portfolioUrl && (
                      <a
                        href={prof.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex text-xs font-semibold text-[#4A1513] underline underline-offset-2"
                      >
                        View portfolio
                      </a>
                    )}
                  </div>

                  {/* Services offered sneak peek */}
                  <div className="px-5 pt-4 pb-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                      Popular Services
                    </div>
                    {prof.pricingDetails && (
                      <p className="mb-2 text-xs text-stone-600">{prof.pricingDetails}</p>
                    )}
                    <div className="space-y-1.5">
                      {prof.servicesOffered.map((serv, sIdx) => (
                        <div 
                          key={sIdx}
                          className="flex items-center justify-between text-xs p-2 rounded-xl bg-stone-50/80 border border-stone-100"
                        >
                          <span className="text-stone-800 font-medium truncate pr-2">{serv.name}</span>
                          <span className="font-bold text-[#4A1513] shrink-0">
                            {serv.price > 0 ? `₹${serv.price.toLocaleString('en-IN')}` : "Pricing on request"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="p-5 pt-3 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Starts from</span>
                    <span className="font-serif text-lg font-bold text-[#4A1513]">
                      {prof.startingPrice > 0
                        ? `₹${prof.startingPrice.toLocaleString('en-IN')}`
                        : "Enquire"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {prof.contactPhone && (
                      <a
                        href={`tel:${prof.contactPhone}`}
                        className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:border-[#4A1513] hover:text-[#4A1513] transition"
                        title={`Call ${prof.businessName || prof.name}`}
                      >
                        <Phone size={12} />
                        <span>Call</span>
                      </a>
                    )}
                    {prof.contactEmail && (
                      <a
                        href={`mailto:${prof.contactEmail}?subject=${encodeURIComponent(`Femazon booking enquiry for ${prof.businessName || prof.name}`)}`}
                        className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:border-[#4A1513] hover:text-[#4A1513] transition"
                        title={`Email ${prof.businessName || prof.name}`}
                      >
                        <Mail size={12} />
                        <span>Contact</span>
                      </a>
                    )}
                    {prof.providerId && prof.serviceId ? (
                      <button
                        onClick={() => setBookingTarget(prof)}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-[#4A1513] text-white rounded-xl text-xs font-bold tracking-wider uppercase hover:bg-[#38100e] transition shadow-xs cursor-pointer"
                      >
                        <Calendar size={13} />
                        <span>Book Appointment</span>
                      </button>
                    ) : (
                      <a
                        href={`mailto:${prof.contactEmail || "support@femazon.com"}?subject=${encodeURIComponent(`Femazon booking enquiry for ${prof.businessName || prof.name}`)}`}
                        className="flex items-center gap-1.5 rounded-xl bg-[#4A1513] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#38100e]"
                      >
                        <Calendar size={13} />
                        <span>Book / Enquire</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* 5. BECOME A PROVIDER BANNER */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#4A1513] to-[#2E0B0A] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-rose-200 bg-white/10 px-3 py-1 rounded-full inline-block mb-3">
              WOMEN ENTREPRENEURS & PROFESSIONALS
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
              Are you a salon owner, makeup artist or lifestyle specialist?
            </h3>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              Join Femazon as a service provider to share your services and receive booking requests from customers.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              href="/partner/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#4A1513] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-rose-50 transition"
            >
              <span>Apply to Join as a Partner</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {bookingTarget && (
        <ServiceBookingModal 
          professional={bookingTarget} 
          onClose={() => setBookingTarget(null)} 
        />
      )}

    </div>
  );
}
