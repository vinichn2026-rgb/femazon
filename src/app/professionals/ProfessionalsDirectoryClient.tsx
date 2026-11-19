"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  ArrowUpRight, 
  Sparkles, 
  SlidersHorizontal,
  ChevronDown,
  X,
  ArrowRight,
  UserCheck,
  Camera,
  Layers,
  BadgeCheck,
  CheckCircle2,
  CalendarCheck2
} from "lucide-react";
import { 
  BeautyProfessional, 
  ROOP_OCCASION_CATEGORIES,
  ROOP_CITIES,
  ROOP_BUDGET_RANGES,
  getStoredProfessionals 
} from "@/data/professionalsData";
import { ProfessionalBookingModal } from "@/components/services/ProfessionalBookingModal";

interface ServicePricingSummary {
  category: string;
  startingPrice: number;
  packages: { name: string; price: number }[];
}

const SERVICE_PRICING_GUIDE: ServicePricingSummary[] = [
  {
    category: "Makeup Artists",
    startingPrice: 2999,
    packages: [
      { name: "Party Makeup", price: 2999 },
      { name: "Engagement Makeup", price: 5999 },
      { name: "Bridal Makeup", price: 15999 },
      { name: "HD Bridal Makeup", price: 24999 }
    ]
  },
  {
    category: "Hair Stylists",
    startingPrice: 999,
    packages: [
      { name: "Basic Hairstyling", price: 999 },
      { name: "Party Hairstyling", price: 1999 },
      { name: "Bridal Hairstyling", price: 4999 },
      { name: "Hair Styling + Saree Draping", price: 5999 }
    ]
  },
  {
    category: "Mehendi / Henna Artists",
    startingPrice: 499,
    packages: [
      { name: "Simple Mehendi", price: 499 },
      { name: "Arabic Mehendi", price: 999 },
      { name: "Bridal Mehendi", price: 5999 },
      { name: "Full Hand Bridal Mehendi", price: 9999 }
    ]
  },
  {
    category: "Saree Draping Specialists",
    startingPrice: 799,
    packages: [
      { name: "Basic Saree Draping", price: 799 },
      { name: "Designer Draping", price: 1499 },
      { name: "Bridal Saree Draping", price: 2499 }
    ]
  },
  {
    category: "Personal Stylists",
    startingPrice: 1999,
    packages: [
      { name: "Personal Styling Consultation", price: 1999 },
      { name: "Occasion Styling", price: 3999 },
      { name: "Complete Look Styling", price: 5999 }
    ]
  }
];

export function ProfessionalsDirectoryClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [selectedBudget, setSelectedBudget] = useState<string>("Any budget");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProfessionalForBooking, setSelectedProfessionalForBooking] = useState<BeautyProfessional | null>(null);

  const allProfessionals = getStoredProfessionals();

  const filteredProfessionals = useMemo(() => {
    return allProfessionals.filter((pro) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = pro.name.toLowerCase().includes(q);
        const matchesSpec = pro.speciality.toLowerCase().includes(q);
        const matchesLoc = pro.location.toLowerCase().includes(q);
        if (!matchesName && !matchesSpec && !matchesLoc) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== "All") {
        const matchesOccasion = pro.occasionTags && pro.occasionTags.includes(selectedCategory);
        const matchesCategory = 
          (selectedCategory === "Bridal" && (pro.speciality.toLowerCase().includes("bridal") || pro.category === "Makeup Artists" || pro.category === "Saree Draping Specialists")) ||
          (selectedCategory === "Party & Glam" && (pro.speciality.toLowerCase().includes("glam") || pro.speciality.toLowerCase().includes("cocktail") || pro.category === "Makeup Artists")) ||
          (selectedCategory === "Editorial & HD" && (pro.speciality.toLowerCase().includes("hd") || pro.speciality.toLowerCase().includes("editorial") || pro.speciality.toLowerCase().includes("airbrush"))) ||
          (selectedCategory === "Men's Grooming" && (pro.speciality.toLowerCase().includes("groom") || pro.category === "Personal Stylists")) ||
          (selectedCategory === "Hair & Style" && (pro.category === "Hair Stylists" || pro.speciality.toLowerCase().includes("hair"))) ||
          (selectedCategory === "SFX & Artistic" && (pro.category === "Mehendi/Henna Artists" || pro.speciality.toLowerCase().includes("artistic") || pro.speciality.toLowerCase().includes("henna")));

        if (!matchesOccasion && !matchesCategory) return false;
      }

      // 3. City Filter
      if (selectedCity !== "All Cities") {
        const matchesCity = pro.city.toLowerCase() === selectedCity.toLowerCase() || 
          pro.location.toLowerCase().includes(selectedCity.toLowerCase());
        if (!matchesCity) return false;
      }

      // 4. Budget Filter
      if (selectedBudget !== "Any budget") {
        const price = pro.startingPrice;
        if (selectedBudget === "Under ₹3,000" && price >= 3000) return false;
        if (selectedBudget === "₹3,000 - ₹8,000" && (price < 3000 || price > 8000)) return false;
        if (selectedBudget === "₹8,000 - ₹15,000" && (price < 8000 || price > 15000)) return false;
        if (selectedBudget === "Above ₹15,000" && price <= 15000) return false;
      }

      return true;
    });
  }, [allProfessionals, selectedCategory, selectedCity, selectedBudget, searchQuery]);

  const hasActiveFilters = selectedCategory !== "All" || selectedCity !== "All Cities" || selectedBudget !== "Any budget" || searchQuery.trim() !== "";

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedCity("All Cities");
    setSelectedBudget("Any budget");
    setSearchQuery("");
  };

  return (
    <div className="w-full bg-white min-h-screen text-stone-900 pb-20 select-none">
      
      {/* 1. Page Hero Banner */}
      <div className="border-b border-stone-200/80 bg-[#FAF7F5] py-12 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#4A1513]/5 border border-[#4A1513]/15 text-[#4A1513] text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase mb-3">
            <Sparkles size={12} className="text-[#D4AF37]" />
            <span>Femazon Beauty Atelier</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2B1311] tracking-wide leading-tight">
            Discover Your Personal Stylist
          </h1>

          <p className="mt-3 text-sm sm:text-base font-serif italic text-[#4A1513] font-medium max-w-2xl mx-auto">
            Discover professionals, explore their work and choose a package that suits your occasion.
          </p>

          <p className="mt-2 text-xs sm:text-sm text-stone-600 font-sans leading-relaxed max-w-xl mx-auto">
            Find trusted makeup artists, hairstylists, henna artists and personal styling professionals — all in one place.
          </p>

          {/* Quick Search Input */}
          <div className="mt-6 max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by specialist name, city, or look..."
              className="w-full px-5 py-3 rounded-full border border-stone-300 bg-white text-stone-900 text-xs sm:text-sm shadow-sm focus:outline-none focus:border-[#4A1513] transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-10">

        {/* 2. Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none justify-start sm:justify-center">
          {ROOP_OCCASION_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? "bg-[#4A1513] text-white shadow-md shadow-[#4A1513]/25 scale-[1.02]"
                    : "bg-white border border-stone-200 text-stone-700 hover:text-[#4A1513] hover:border-[#4A1513] shadow-2xs"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 3. Secondary Filter Row (Cities, Budget, Reset) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 bg-stone-50/90 p-4 rounded-2xl border border-stone-200/70">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-stone-300 bg-white text-stone-700">
              <SlidersHorizontal size={13} className="text-[#4A1513]" />
              <span>Filters</span>
            </span>

            {/* City */}
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="appearance-none bg-white border border-stone-300 hover:border-[#4A1513] text-stone-800 text-xs font-semibold rounded-full pl-4 pr-8 py-1.5 focus:outline-none focus:border-[#4A1513] cursor-pointer shadow-2xs"
              >
                {ROOP_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
            </div>

            {/* Budget */}
            <div className="relative">
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="appearance-none bg-white border border-stone-300 hover:border-[#4A1513] text-stone-800 text-xs font-semibold rounded-full pl-4 pr-8 py-1.5 focus:outline-none focus:border-[#4A1513] cursor-pointer shadow-2xs"
              >
                {ROOP_BUDGET_RANGES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#4A1513] hover:text-[#7A2320] transition-colors cursor-pointer ml-1"
              >
                <X size={12} />
                <span>Reset All</span>
              </button>
            )}
          </div>

          <div className="text-xs sm:text-sm text-stone-500 font-medium">
            Showing <strong className="text-stone-900 font-bold">{filteredProfessionals.length}</strong> of {allProfessionals.length} Artists
          </div>
        </div>

        {/* 4. Complete Packages & Pricing Guide (Full 5 Categories) */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-stone-50 border border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A1513] block">
                Official Directory Guide
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2B1311]">
                Explore Our Professionals — Pricing &amp; Packages
              </h2>
            </div>
            <p className="text-[11px] text-stone-500 italic max-w-sm">
              *Note: All prices are illustrative sample prices. Actual packages and pricing will be set by registered professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SERVICE_PRICING_GUIDE.map((item, idx) => (
              <div key={idx} className="bg-white p-4.5 rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-[10px] font-bold text-[#D4AF37] block mb-1">
                  0{idx + 1}
                </span>
                <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 mb-1">
                  {item.category}
                </h3>
                <span className="text-xs font-bold text-[#4A1513] block mb-3">
                  Starting from ₹{item.startingPrice.toLocaleString("en-IN")}
                </span>
                <ul className="space-y-1.5 border-t border-stone-100 pt-2.5">
                  {item.packages.map((pkg, pIdx) => (
                    <li key={pIdx} className="text-[11px] text-stone-600 flex items-center justify-between">
                      <span className="truncate pr-1">• {pkg.name}</span>
                      <strong className="text-stone-900 font-semibold shrink-0">
                        ₹{pkg.price.toLocaleString("en-IN")}
                      </strong>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Artists Grid (Full Makeover Image + Stylist Profile Below) */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl font-bold text-[#2B1311] mb-6">
            Available Verified Specialists ({filteredProfessionals.length})
          </h2>

          {filteredProfessionals.length === 0 ? (
            <div className="p-12 text-center bg-stone-50 rounded-3xl border border-stone-200 max-w-md mx-auto my-8">
              <p className="text-stone-600 text-sm mb-3">No artists found matching your criteria.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2 rounded-full bg-[#4A1513] text-white text-xs font-bold hover:bg-[#350E0C] cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredProfessionals.map((pro) => {
                const displayMakeoverImage = pro.heroLookImage || pro.portfolio[0]?.image || pro.coverImage || pro.profileImage;

                return (
                  <div
                    key={pro.id}
                    className="group bg-white rounded-[26px] border border-stone-200 hover:border-[#4A1513]/40 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.05)] hover:shadow-2xl overflow-hidden flex flex-col justify-between"
                  >
                    {/* Top: Full Makeover Main Image */}
                    <Link
                      href={`/professionals/${pro.slug}`}
                      className="relative aspect-[4/4.9] w-full overflow-hidden bg-stone-100 block cursor-pointer"
                    >
                      <img
                        src={displayMakeoverImage}
                        alt={`${pro.name} - Full Makeover`}
                        loading="lazy"
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/dress/lehengas/bridal-lehengas/Woman_wearing_red_bridal_lehenga_202609091646.jpeg";
                        }}
                      />

                      {/* Verified Badge */}
                      <div className="absolute top-3.5 right-3.5 z-10">
                        <div className="w-8 h-8 rounded-full bg-black/45 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-sm">
                          <ShieldCheck size={16} className="text-[#F3E5AB] stroke-[2.2]" />
                        </div>
                      </div>

                      {/* Photo Bottom Gradient Fade */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                      {/* Stylist Profile Identity Overlay */}
                      <div className="absolute bottom-3.5 inset-x-3.5 flex items-center justify-between gap-2.5 z-10">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative shrink-0">
                            <img
                              src={pro.profileImage}
                              alt={pro.name}
                              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-white object-cover shadow-md"
                            />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-tight truncate drop-shadow-sm group-hover:text-[#F3E5AB] transition-colors">
                              {pro.name}
                            </h3>
                            {pro.subtitle && (
                              <span className="text-[10px] text-[#F3E5AB] block -mt-0.5 truncate font-sans font-medium">
                                {pro.subtitle}
                              </span>
                            )}
                            <div className="flex items-center gap-1 text-[11px] text-stone-200 mt-0.5 truncate">
                              <MapPin size={11} className="text-[#D4AF37] shrink-0" />
                              <span className="truncate">{pro.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1 text-[#F5C06B] font-bold text-xs bg-black/55 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 shadow-sm">
                          <Star size={11} className="fill-[#F5C06B] text-[#F5C06B]" />
                          <span>{pro.tag || "New"}</span>
                        </div>
                      </div>
                    </Link>

                    {/* Card Bottom Strip */}
                    <div className="bg-stone-50/80 px-5 py-4 sm:px-6 sm:py-4.5 flex items-center justify-between border-t border-stone-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block leading-none mb-1">
                          Starting from
                        </span>
                        <span className="font-serif text-xl sm:text-2xl font-bold text-[#4A1513] tracking-tight">
                          ₹{pro.startingPrice.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setSelectedProfessionalForBooking(pro)}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#4A1513] hover:bg-[#350E0C] text-white text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
                        >
                          <Calendar size={12} className="text-[#D4AF37]" />
                          <span>Book</span>
                        </button>

                        <Link
                          href={`/professionals/${pro.slug}`}
                          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#4A1513] hover:text-[#7A2320] transition-colors duration-200 group-hover:translate-x-0.5"
                        >
                          <span>View profile</span>
                          <ArrowUpRight size={14} className="stroke-[2.4]" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. Why Choose Femazon? (5 Trust Highlights) */}
        <div className="pt-12 border-t border-stone-200 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-1">
              Guaranteed Luxury Experience
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#2B1311]">
              Why Choose Femazon?
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2 font-sans">
              We curate only the finest beauty and styling talent with transparent service standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="w-11 h-11 rounded-2xl bg-[#4A1513]/10 text-[#4A1513] flex items-center justify-center mb-3">
                <UserCheck size={20} />
              </div>
              <h3 className="font-serif text-sm font-bold text-stone-900 mb-1">Verified Profiles</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-sans">Hand-screened certified beauty experts and stylists.</p>
            </div>

            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="w-11 h-11 rounded-2xl bg-[#4A1513]/10 text-[#4A1513] flex items-center justify-center mb-3">
                <Camera size={20} />
              </div>
              <h3 className="font-serif text-sm font-bold text-stone-900 mb-1">Real Portfolios &amp; Reviews</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-sans">Authentic makeover photos &amp; verified client ratings.</p>
            </div>

            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="w-11 h-11 rounded-2xl bg-[#4A1513]/10 text-[#4A1513] flex items-center justify-center mb-3">
                <Layers size={20} />
              </div>
              <h3 className="font-serif text-sm font-bold text-stone-900 mb-1">Transparent Pricing</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-sans">Clear multi-tier package inclusions with no hidden costs.</p>
            </div>

            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="w-11 h-11 rounded-2xl bg-[#4A1513]/10 text-[#4A1513] flex items-center justify-center mb-3">
                <Calendar size={20} />
              </div>
              <h3 className="font-serif text-sm font-bold text-stone-900 mb-1">Easy Online Booking</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-sans">Reserve your preferred specialist in minutes.</p>
            </div>

            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="w-11 h-11 rounded-2xl bg-[#4A1513]/10 text-[#4A1513] flex items-center justify-center mb-3">
                <BadgeCheck size={20} />
              </div>
              <h3 className="font-serif text-sm font-bold text-stone-900 mb-1">Confirmed Slots</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-sans">Instant confirmation and doorstep punctuality.</p>
            </div>
          </div>
        </div>

        {/* 7. Become a Professional Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#4A1513] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block mb-1">
              Join Femazon Partner Network
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white">
              Are You a Certified Stylist or Beauty Artist?
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 font-sans mt-2">
              Register your profile, showcase your portfolio, create custom packages, and accept confirmed appointments from elite clients across India.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/vendor/services"
              className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#C29B27] text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow-md active:scale-95"
            >
              Professional Dashboard
            </Link>
            <Link
              href="/seller/register"
              className="px-5 py-3 rounded-full border border-white/30 hover:bg-white/10 text-white font-medium text-xs uppercase tracking-wider transition"
            >
              Register as Specialist
            </Link>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      {selectedProfessionalForBooking && (
        <ProfessionalBookingModal
          professional={selectedProfessionalForBooking}
          isOpen={!!selectedProfessionalForBooking}
          onClose={() => setSelectedProfessionalForBooking(null)}
        />
      )}
    </div>
  );
}
