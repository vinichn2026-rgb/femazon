"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserCheck,
  Video,
} from "lucide-react";
import { STYLIST_SPECIALIZATIONS, type PublicStylist } from "@/lib/stylistTypes";
import { PageBanner } from "@/components/common/PageBanner";

interface StylistMarketplaceClientProps {
  stylists: PublicStylist[];
  error?: string | null;
  initialCity?: string;
  initialSpecialization?: string;
}

export function StylistMarketplaceClient({
  stylists,
  error,
  initialCity = "all",
  initialSpecialization = "all",
}: StylistMarketplaceClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedSpecialization, setSelectedSpecialization] = useState(initialSpecialization);
  const [minExperience, setMinExperience] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<string>("all");
  const [availabilityMode, setAvailabilityMode] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "rating" | "price_asc" | "experience">("featured");

  const availableCities = useMemo(() => {
    const cities = Array.from(new Set(stylists.map((s) => s.city).filter(Boolean))).sort();
    return cities;
  }, [stylists]);

  const filteredStylists = useMemo(() => {
    let list = [...stylists];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.bio.toLowerCase().includes(q) ||
          s.specializations.some((sp) => sp.toLowerCase().includes(q)) ||
          s.packages.some((pkg) => pkg.title.toLowerCase().includes(q))
      );
    }

    if (selectedCity !== "all") {
      list = list.filter(
        (s) =>
          s.city.toLowerCase() === selectedCity.toLowerCase() ||
          s.preferredLocations.some((loc) => loc.toLowerCase().includes(selectedCity.toLowerCase()))
      );
    }

    if (selectedSpecialization !== "all") {
      list = list.filter((s) =>
        s.specializations.some((sp) => sp.toLowerCase().includes(selectedSpecialization.toLowerCase()))
      );
    }

    if (minExperience > 0) {
      list = list.filter((s) => s.experienceYears >= minExperience);
    }

    if (maxPrice !== "all") {
      const cap = Number(maxPrice);
      list = list.filter((s) => s.startingPrice > 0 && s.startingPrice <= cap);
    }

    if (availabilityMode !== "all") {
      list = list.filter((s) =>
        s.consultationModes.some((m) => m.toLowerCase() === availabilityMode.toLowerCase())
      );
    }

    if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
    } else if (sortBy === "price_asc") {
      list.sort((a, b) => (a.startingPrice || 999999) - (b.startingPrice || 999999));
    } else if (sortBy === "experience") {
      list.sort((a, b) => b.experienceYears - a.experienceYears);
    } else {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
    }

    return list;
  }, [
    stylists,
    searchQuery,
    selectedCity,
    selectedSpecialization,
    minExperience,
    maxPrice,
    availabilityMode,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-[#FAF7F5] pb-24 text-stone-900">
      {/* 1. STANDARDIZED PAGE BANNER MATCHING SHOP REFERENCE */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-4">
        <PageBanner
          title="Personal Styling & Wardrobe"
          highlightText="Certified Stylists"
          description="Book 1-on-1 virtual or in-person sessions with certified fashion stylists tailored to your body type, lifestyle, and celebrations."
          ctaText="Become a Stylist"
          ctaLink="/personal-styling/register"
          imageSrc="/banners/hero_coords.jpg"
          fallbackImage="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop"
          imageAlt="Personal Styling Experts"
        />
      </div>

      {/* 2. SPECIALIZATION PILLS */}
      <section className="sticky top-[88px] md:top-[96px] z-30 border-b border-stone-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedSpecialization("all")}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              selectedSpecialization === "all"
                ? "bg-[#4A1513] text-white shadow-xs"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            All Stylists ({stylists.length})
          </button>
          {STYLIST_SPECIALIZATIONS.map((spec) => {
            const active = selectedSpecialization.toLowerCase() === spec.toLowerCase();
            return (
              <button
                key={spec}
                type="button"
                onClick={() => setSelectedSpecialization(active ? "all" : spec)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition cursor-pointer ${
                  active
                    ? "bg-[#4A1513] text-white font-bold shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {spec}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. FILTER BAR & RESULTS */}
      <section className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 lg:px-8">
        {error && (
          <div role="status" className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            {error}
          </div>
        )}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-800 focus:border-[#4A1513] focus:outline-none"
            >
              <option value="all">All Cities</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              value={minExperience}
              onChange={(e) => setMinExperience(Number(e.target.value))}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-800 focus:border-[#4A1513] focus:outline-none"
            >
              <option value={0}>Any Experience</option>
              <option value={2}>2+ Years Experience</option>
              <option value={5}>5+ Years Experience</option>
              <option value={10}>10+ Years Experience</option>
            </select>

            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-800 focus:border-[#4A1513] focus:outline-none"
            >
              <option value="all">Any Starting Price</option>
              <option value="2000">Under ₹2,000</option>
              <option value="5000">Under ₹5,000</option>
              <option value="15000">Under ₹15,000</option>
            </select>

            <select
              value={availabilityMode}
              onChange={(e) => setAvailabilityMode(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-800 focus:border-[#4A1513] focus:outline-none"
            >
              <option value="all">Online &amp; In-Person</option>
              <option value="Online">Online Consultation</option>
              <option value="In-Person">In-Person Styling</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-[#4A1513]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-800 focus:border-[#4A1513] focus:outline-none"
            >
              <option value="featured">Featured Stylists</option>
              <option value="rating">Highest Rated</option>
              <option value="price_asc">Starting Price: Low to High</option>
              <option value="experience">Most Experienced</option>
            </select>
          </div>
        </div>

        {/* STYLIST GRID */}
        {filteredStylists.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-xs">
            <Sparkles size={32} className="mx-auto mb-3 text-[#4A1513]" />
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              {stylists.length === 0
                ? "Verified Personal Stylists Coming Soon"
                : "No stylists match your filters"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">
              {stylists.length === 0
                ? "Are you a personal stylist or wardrobe consultant? Register today to showcase your portfolio and packages on Femazon."
                : "Try adjusting your city, specialization, or price filters."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {stylists.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCity("all");
                    setSelectedSpecialization("all");
                    setMinExperience(0);
                    setMaxPrice("all");
                    setAvailabilityMode("all");
                  }}
                  className="rounded-full bg-[#4A1513] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
              <Link
                href="/personal-styling/register"
                className="rounded-full border border-[#4A1513] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#4A1513] hover:bg-rose-50 transition"
              >
                Register as a Stylist
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStylists.map((stylist) => (
              <article
                key={stylist.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xs transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <div>
                  {/* Portfolio Banner Preview */}
                  <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                    <img
                      src={stylist.portfolioImages[0] || stylist.profileImage}
                      alt={`${stylist.fullName} portfolio`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {stylist.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                          <ShieldCheck size={11} /> Verified Stylist
                        </span>
                      )}
                      {stylist.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Avatar + Identity */}
                  <div className="relative px-5 pt-4">
                    <div className="-mt-12 mb-3 flex items-end justify-between">
                      <img
                        src={stylist.profileImage}
                        alt={stylist.fullName}
                        className="h-20 w-20 rounded-2xl border-4 border-white bg-stone-100 object-cover shadow-md"
                      />
                      <div className="flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-800">
                        <Star size={13} className="text-amber-500" fill="currentColor" />
                        <span>{stylist.reviewsCount > 0 ? stylist.rating.toFixed(1) : "New"}</span>
                        {stylist.reviewsCount > 0 && (
                          <span className="text-stone-500">({stylist.reviewsCount})</span>
                        )}
                      </div>
                    </div>

                    <h2 className="font-serif text-xl font-bold text-stone-900">
                      {stylist.fullName}
                    </h2>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} /> {stylist.city} · {stylist.location}
                      </span>
                      <span>• {stylist.experience}</span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-stone-600">
                      {stylist.bio}
                    </p>

                    {/* Specializations */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {stylist.specializations.slice(0, 3).map((spec) => (
                        <span
                          key={spec}
                          className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-semibold text-[#4A1513]"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Consultation Modes & Availability */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-stone-500">
                      <span className="inline-flex items-center gap-1">
                        <Video size={12} className="text-[#4A1513]" />
                        {stylist.consultationModes.join(" & ")}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} className="text-[#4A1513]" />
                        {stylist.packages.length} {stylist.packages.length === 1 ? "Package" : "Packages"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="mt-5 flex items-center justify-between border-t border-stone-100 bg-stone-50/70 px-5 py-4">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Starting from
                    </span>
                    <span className="font-serif text-lg font-bold text-[#4A1513]">
                      {stylist.startingPrice > 0
                        ? `₹${stylist.startingPrice.toLocaleString("en-IN")}`
                        : "Custom Quote"}
                    </span>
                  </div>
                  <Link
                    href={`/personal-styling/${stylist.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#4A1513] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#38100e]"
                  >
                    <span>View Profile</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
