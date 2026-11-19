"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Share2, 
  Heart, 
  Sparkles, 
  Award, 
  Check, 
  Phone, 
  MessageSquare,
  ThumbsUp,
  Image as ImageIcon
} from "lucide-react";
import { BeautyProfessional, ServicePackage, PortfolioItem } from "@/data/professionalsData";
import { ProfessionalBookingModal } from "@/components/services/ProfessionalBookingModal";

interface ProfessionalProfileClientProps {
  professional: BeautyProfessional;
}

export function ProfessionalProfileClient({ professional }: ProfessionalProfileClientProps) {
  const [selectedPackageForModal, setSelectedPackageForModal] = useState<ServicePackage | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"packages" | "portfolio" | "reviews">("packages");
  const [activePortfolioCategory, setActivePortfolioCategory] = useState<string>("All");
  const [zoomedImage, setZoomedImage] = useState<PortfolioItem | null>(null);

  // Available portfolio categories
  const portfolioCategories = ["All", ...Array.from(new Set(professional.portfolio.map(p => p.category)))];

  const filteredPortfolio = activePortfolioCategory === "All"
    ? professional.portfolio
    : professional.portfolio.filter(p => p.category === activePortfolioCategory);

  const handleOpenBooking = (pkg?: ServicePackage) => {
    setSelectedPackageForModal(pkg || professional.packages[0]);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-stone-900 pb-16">
      
      {/* Top Breadcrumb Nav */}
      <div className="bg-white border-b border-stone-200/80">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-[#4A1513] transition">Home</Link>
            <span>/</span>
            <Link href="/#stylists" className="hover:text-[#4A1513] transition">Beauty Professionals</Link>
            <span>/</span>
            <span className="text-stone-700 font-medium">{professional.category}</span>
            <span>/</span>
            <span className="text-[#4A1513] font-bold">{professional.name}</span>
          </div>

          <Link 
            href="/#stylists" 
            className="inline-flex items-center gap-1 text-[#4A1513] hover:underline font-semibold"
          >
            <ArrowLeft size={13} />
            <span>All Artists</span>
          </Link>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        
        {/* Profile Hero Header Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden mb-8">
          {/* Top Banner Cover */}
          <div className="h-44 sm:h-60 w-full bg-gradient-to-r from-[#4A1513] via-[#380E0C] to-[#200806] relative">
            {professional.coverImage && (
              <img
                src={professional.coverImage}
                alt={professional.name}
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Profile Identity Bar */}
          <div className="px-6 sm:px-10 pb-8 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            {/* Left: Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl bg-stone-100 shrink-0 relative">
                <img
                  src={professional.profileImage}
                  alt={professional.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="pt-2 sm:pt-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">
                    {professional.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                    <ShieldCheck size={13} className="text-emerald-700" /> Verified Specialist
                  </span>
                </div>

                <p className="text-sm font-medium text-stone-700 mb-2">
                  {professional.speciality}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-stone-500">
                  <span className="flex items-center gap-1 text-stone-600">
                    <MapPin size={14} className="text-[#4A1513]" />
                    {professional.location}
                  </span>

                  <span className="flex items-center gap-1 text-stone-600">
                    <Award size={14} className="text-amber-700" />
                    {professional.experienceYears}+ Years Experience
                  </span>

                  <div className="flex items-center gap-1 font-bold text-stone-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span>{professional.rating.toFixed(2)}</span>
                    <span className="font-normal text-stone-500">({professional.reviewCount} Reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Booking Action Box */}
            <div className="flex flex-col sm:flex-row md:flex-col items-center sm:items-end justify-center shrink-0 gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-stone-100">
              <div className="text-center sm:text-right">
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block">
                  Starting Package
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#4A1513]">
                  ₹{professional.startingPrice.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleOpenBooking()}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#4A1513] hover:bg-[#380E0C] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <Calendar size={14} />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>

          {/* Bio Description Box */}
          <div className="px-6 sm:px-10 py-5 bg-[#FAF7F5] border-t border-stone-200/70 text-xs sm:text-sm text-stone-600 leading-relaxed">
            <span className="font-bold text-[#4A1513] uppercase tracking-wider text-[11px] block mb-1">
              About the Specialist
            </span>
            <p>{professional.bio}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 mb-8 bg-white rounded-2xl p-1.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab("packages")}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition cursor-pointer text-center ${
              activeTab === "packages"
                ? "bg-[#4A1513] text-white shadow-xs"
                : "text-stone-600 hover:text-[#4A1513]"
            }`}
          >
            Service Packages ({professional.packages.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("portfolio")}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition cursor-pointer text-center ${
              activeTab === "portfolio"
                ? "bg-[#4A1513] text-white shadow-xs"
                : "text-stone-600 hover:text-[#4A1513]"
            }`}
          >
            Portfolio Showcase ({professional.portfolio.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition cursor-pointer text-center ${
              activeTab === "reviews"
                ? "bg-[#4A1513] text-white shadow-xs"
                : "text-stone-600 hover:text-[#4A1513]"
            }`}
          >
            Customer Reviews ({professional.reviewCount})
          </button>
        </div>

        {/* TAB 1: SERVICE PACKAGES */}
        {activeTab === "packages" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Available Service Packages
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  Transparent, all-inclusive pricing with verified doorstep service.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full font-medium">
                <Clock size={13} className="text-[#4A1513]" />
                <span>Instant Confirmation</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {professional.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-3xl border transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between relative shadow-sm hover:shadow-xl ${
                    pkg.isPopular 
                      ? "border-[#4A1513] ring-2 ring-[#4A1513]/10" 
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {pkg.isPopular && (
                    <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#4A1513] text-[#D4AF37] font-bold text-[10px] uppercase tracking-widest shadow-xs">
                      ★ Most Popular
                    </span>
                  )}

                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xs font-semibold text-stone-400 flex items-center gap-1">
                        <Clock size={13} />
                        {pkg.duration}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                      {pkg.name}
                    </h3>

                    <p className="text-xs text-stone-500 leading-relaxed mb-6">
                      {pkg.description}
                    </p>

                    {/* Price Tag */}
                    <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-stone-200/60 mb-6">
                      <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                        Package Price
                      </span>
                      <span className="font-serif text-3xl font-bold text-[#4A1513]">
                        ₹{pkg.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] text-stone-500 block mt-0.5">
                        Taxes &amp; Doorstep Visit Included
                      </span>
                    </div>

                    {/* Inclusions Checklist */}
                    <div className="mb-6">
                      <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-3">
                        Package Inclusions:
                      </span>
                      <ul className="space-y-2.5">
                        {pkg.inclusions.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-stone-600">
                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenBooking(pkg)}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                      pkg.isPopular
                        ? "bg-[#4A1513] hover:bg-[#380E0C] text-white shadow-md hover:shadow-lg"
                        : "bg-stone-900 hover:bg-[#4A1513] text-white"
                    }`}
                  >
                    <span>Book This Package</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Available Booking Slots Quick View */}
            <div className="mt-8 p-6 bg-white rounded-3xl border border-stone-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={18} className="text-[#4A1513]" />
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Standard Daily Booking Slots
                </h3>
              </div>
              <p className="text-xs text-stone-500 mb-4">
                {professional.name} accepts bookings across morning and evening timings. Choose your preferred slot when confirming your appointment.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {professional.availableSlots.map((slot) => (
                  <span
                    key={slot}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF7F5] border border-stone-200/90 text-stone-700 text-xs font-semibold"
                  >
                    ⏱ {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PORTFOLIO SHOWCASE */}
        {activeTab === "portfolio" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Actual Client Portfolio
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  High-resolution editorial and bridal photography of completed looks.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
                {portfolioCategories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setActivePortfolioCategory(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                      activePortfolioCategory === c
                        ? "bg-[#4A1513] text-white"
                        : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolio.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setZoomedImage(item)}
                  className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-xs text-white font-medium bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-xs">
                        Click to Zoom
                      </span>
                    </div>

                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-white/90 text-[#4A1513] text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-4 bg-white flex-1 flex flex-col justify-between border-t border-stone-100">
                    <h4 className="font-serif text-sm font-bold text-stone-900 group-hover:text-[#4A1513] transition-colors">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER REVIEWS */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 text-center sm:text-left">
                <div className="w-20 h-20 rounded-2xl bg-[#FAF7F5] border border-stone-200 text-[#4A1513] flex flex-col items-center justify-center">
                  <span className="font-serif text-3xl font-bold leading-none">
                    {professional.rating.toFixed(1)}
                  </span>
                  <div className="flex items-center text-amber-400 mt-1">
                    <Star size={11} className="fill-amber-400" />
                    <Star size={11} className="fill-amber-400" />
                    <Star size={11} className="fill-amber-400" />
                    <Star size={11} className="fill-amber-400" />
                    <Star size={11} className="fill-amber-400" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Client Satisfaction Rating
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Based on {professional.reviewCount} verified appointments coordinated by Femazon.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenBooking()}
                className="px-6 py-3 rounded-xl bg-[#4A1513] hover:bg-[#380E0C] text-white font-bold text-xs uppercase tracking-wider transition"
              >
                Experience {professional.name}&apos;s Service
              </button>
            </div>

            {/* Review Cards */}
            <div className="space-y-4">
              {professional.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-stone-900">
                        {rev.author}
                      </span>
                      <span className="text-xs text-stone-400">• {rev.location}</span>
                      {rev.verifiedBooking && (
                        <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                          <Check size={10} /> Verified Appointment
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-400">{rev.date}</span>
                  </div>

                  <div className="flex items-center text-amber-400 mb-2">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={13} className="fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Portfolio Lightbox Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <div 
            className="max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition cursor-pointer"
            >
              ✕
            </button>
            <div className="aspect-[3/4] max-h-[70vh] w-full bg-stone-900">
              <img
                src={zoomedImage.image}
                alt={zoomedImage.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6 bg-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A1513] block mb-1">
                {zoomedImage.category}
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {zoomedImage.title}
              </h3>
              {zoomedImage.description && (
                <p className="text-xs text-stone-600 mt-1">
                  {zoomedImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Booking Modal */}
      <ProfessionalBookingModal
        professional={professional}
        initialPackage={selectedPackageForModal || undefined}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}
