"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Calendar,
  ArrowUpRight
} from "lucide-react";
import { 
  BeautyProfessional, 
  getStoredProfessionals 
} from "@/data/professionalsData";
import { ProfessionalBookingModal } from "@/components/services/ProfessionalBookingModal";

interface ShowcaseLookItem {
  id: string;
  artistSlug: string;
  artistName: string;
  subtitle?: string;
  category: "Bridal" | "Party & Glam" | "Editorial & HD" | "Hair & Style" | "Mehendi & Draping";
  lookTitle: string;
  startingPrice: number;
  location: string;
  rating: number;
  image: string;
  avatar: string;
  tag: string;
  description: string;
}

const SHOWCASE_LOOKS: ShowcaseLookItem[] = [
  // 1. Bridal
  {
    id: "look-1",
    artistSlug: "suraksha-reddy",
    artistName: "Suraksha Reddy",
    subtitle: "(Sample Artist Account)",
    category: "Bridal",
    lookTitle: "Luxury Heritage Bridal & Temple Muhurtham Makeover",
    startingPrice: 11000,
    location: "Bengaluru, RR Nagar",
    rating: 5.0,
    image: "/images/dress/lehengas/bridal-lehengas/Woman_wearing_red_bridal_lehenga_202609091646.jpeg",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop&crop=face",
    tag: "FEATURED BRIDAL",
    description: "Regal crimson lehenga drape with custom warm golden contour, kohl teardrop seal & mathapatti setting."
  },
  {
    id: "look-2",
    artistSlug: "aananya-sundaram",
    artistName: "Aananya Sundaram",
    category: "Bridal",
    lookTitle: "Traditional Tamil Muhurtham HD Airbrush Glow",
    startingPrice: 15999,
    location: "Chennai, T. Nagar",
    rating: 4.96,
    image: "/images/dress/sarees/organza-tissue/Woman_wearing_fuchsia_pink_saree_202609091713.jpeg",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop&crop=face",
    tag: "HD AIRBRUSH",
    description: "Glass skin base engineered to stay luminous under 5+ hours of sacred muhurtham lights."
  },
  {
    id: "look-3",
    artistSlug: "kavitha-krishnan",
    artistName: "Kavitha Krishnan",
    category: "Bridal",
    lookTitle: "100+ Pleats Bridal Saree Draping & Zari Align",
    startingPrice: 2499,
    location: "Chennai, Mylapore",
    rating: 5.0,
    image: "/images/dress/sarees/pure-banarasi-silk/Woman_wearing_Banarasi_silk_saree_202609091713.jpeg",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop&crop=face",
    tag: "MASTER DRAPING",
    description: "Knife-edge pallu micro-pleating with zero bulk waist contour for Kanjeevaram silks."
  },

  // 2. Party & Glam
  {
    id: "look-4",
    artistSlug: "almas-qureshi",
    artistName: "Almas Qureshi",
    category: "Party & Glam",
    lookTitle: "Rose Gold Festive Glow & Sangeet Makeover",
    startingPrice: 1800,
    location: "Bengaluru, All Locations",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1599746146388-a7ec2004b67a?q=80&w=800&h=1000&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop&crop=face",
    tag: "FESTIVE GLAM",
    description: "Soft rose gold cheek shimmer paired with luminous silk lips and natural hair waves."
  },
  {
    id: "look-5",
    artistSlug: "zoya-sheikh",
    artistName: "Zoya sheikh",
    category: "Party & Glam",
    lookTitle: "Cocktail Evening Cut Crease & Ear Cuff Styling",
    startingPrice: 3000,
    location: "Nagpur, Sitabuldi",
    rating: 4.88,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&h=1000&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop&crop=face",
    tag: "RUNWAY GLAM",
    description: "Sculpted cheekbones, statement glitter cut crease, and modern high ponytail."
  },
  {
    id: "look-6",
    artistSlug: "deepak-verma",
    artistName: "Deepak Verma",
    category: "Party & Glam",
    lookTitle: "Saree-Gown Cocktail Red Carpet Look",
    startingPrice: 3999,
    location: "Mumbai, Bandra West",
    rating: 5.0,
    image: "/images/dress/western-wear/cocktail-party-nights/Emerald_green_saree_gown_displayed_202609091724.jpeg",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop&crop=face",
    tag: "COUTURE STYLING",
    description: "Emerald green drape styling paired with jewelry alignment for cocktail reception."
  },

  // 3. Editorial & HD
  {
    id: "look-7",
    artistSlug: "zoya-sheikh",
    artistName: "Zoya sheikh",
    category: "Editorial & HD",
    lookTitle: "Golden Winged Glitter Liner & High Ponytail",
    startingPrice: 3000,
    location: "Nagpur, Sitabuldi",
    rating: 4.88,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&h=1000&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop&crop=face",
    tag: "EDITORIAL HD",
    description: "High-contrast eye architecture, matte velvet skin base, and runway texture hair."
  },
  {
    id: "look-8",
    artistSlug: "suraksha-reddy",
    artistName: "Suraksha Reddy",
    subtitle: "(Sample Artist Account)",
    category: "Editorial & HD",
    lookTitle: "High-Definition Dewy Camera Barrier Finish",
    startingPrice: 11000,
    location: "Bengaluru, RR Nagar",
    rating: 5.0,
    image: "/images/dress/lehengas/bridal-lehengas/Woman_wearing_red_bridal_lehenga_202609091646.jpeg",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop&crop=face",
    tag: "CAMERA READY",
    description: "Cryogenic skin barrier prep with micro-droplet airbrush base."
  },
  {
    id: "look-9",
    artistSlug: "deepak-verma",
    artistName: "Deepak Verma",
    category: "Editorial & HD",
    lookTitle: "Haute Couture Red Carpet Trousseau Advisory",
    startingPrice: 5999,
    location: "Mumbai, Bandra West",
    rating: 5.0,
    image: "/images/dress/western-wear/reception-glamour/Woman_modeling_black_crystal_saree_202609091720.jpeg",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop&crop=face",
    tag: "CELEBRITY STYLIST",
    description: "Complete signature look design for milestone gala events and couture shoots."
  },

  // 4. Hair & Style
  {
    id: "look-10",
    artistSlug: "rhea-sengupta",
    artistName: "Rhea Sengupta",
    category: "Hair & Style",
    lookTitle: "Textured Floral Braid & South Indian Updo",
    startingPrice: 1999,
    location: "Kolkata, Salt Lake",
    rating: 4.94,
    image: "/images/dress/kurta-sets/anarkali-kurta-sets/Woman_wearing_maroon_Anarkali_kurta_202609091540.jpeg",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop&crop=face",
    tag: "HAIR ARCHITECTURE",
    description: "Intricate floral string braid, volume crown, and long-wear hair setting spray."
  },
  {
    id: "look-11",
    artistSlug: "zoya-sheikh",
    artistName: "Zoya sheikh",
    category: "Hair & Style",
    lookTitle: "Hollywood Glam Waves & Sleek Glass Ponytail",
    startingPrice: 1999,
    location: "Nagpur, Sitabuldi",
    rating: 4.88,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&h=1000&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop&crop=face",
    tag: "SIGNATURE WAVES",
    description: "Zero frizz high-gloss Hollywood waves designed for evening cocktail lights."
  },
  {
    id: "look-12",
    artistSlug: "kavitha-krishnan",
    artistName: "Kavitha Krishnan",
    category: "Hair & Style",
    lookTitle: "Jasmine Floral Crown Setting & Drape Match",
    startingPrice: 5999,
    location: "Chennai, Mylapore",
    rating: 5.0,
    image: "/images/dress/sarees/pure-banarasi-silk/Woman_wearing_Banarasi_silk_saree_202609091713.jpeg",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop&crop=face",
    tag: "BRIDAL HAIR & DRAPE",
    description: "Complete traditional South Indian floral veni alignment with knife-edge saree pleating."
  },

  // 5. Mehendi & Draping
  {
    id: "look-13",
    artistSlug: "farhana-sheikh",
    artistName: "Farhana Sheikh",
    category: "Mehendi & Draping",
    lookTitle: "Organic Rajasthani Intricate Bridal Henna",
    startingPrice: 5999,
    location: "Delhi NCR, South Extension",
    rating: 4.98,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop&crop=face",
    tag: "ORGANIC HENNA",
    description: "Deep burgundy organic henna stain, delicate jaal lace, and custom bride-groom portrait art."
  },
  {
    id: "look-14",
    artistSlug: "kavitha-krishnan",
    artistName: "Kavitha Krishnan",
    category: "Mehendi & Draping",
    lookTitle: "Designer Box Pleat & Iron-Free Saree Draping",
    startingPrice: 1499,
    location: "Chennai, Mylapore",
    rating: 5.0,
    image: "/images/dress/sarees/organza-tissue/Woman_wearing_fuchsia_pink_saree_202609091713.jpeg",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop&crop=face",
    tag: "DESIGNER PLEATS",
    description: "Zero movement waist pin setting for chiffon, silk, tissue, and heavy banarasi sarees."
  },
  {
    id: "look-15",
    artistSlug: "farhana-sheikh",
    artistName: "Farhana Sheikh",
    category: "Mehendi & Draping",
    lookTitle: "Arabic Floral Henna & Sangeet Guest Palms",
    startingPrice: 999,
    location: "Delhi NCR, South Extension",
    rating: 4.98,
    image: "/images/dress/sarees/pure-banarasi-silk/Woman_wearing_Banarasi_silk_saree_202609091713.jpeg",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop&crop=face",
    tag: "ARABIC MOTIF",
    description: "Free-flowing shaded Arabic roses and vine tendrils with overnight dark stain infusion."
  }
];

const CATEGORY_TABS = [
  "Bridal",
  "Party & Glam",
  "Editorial & HD",
  "Hair & Style",
  "Mehendi & Draping"
] as const;

export function PersonalStylistSection() {
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORY_TABS[number]>("Bridal");
  const [selectedLookIndex, setSelectedLookIndex] = useState<number>(0);
  const [selectedProfessionalForBooking, setSelectedProfessionalForBooking] = useState<BeautyProfessional | null>(null);

  const allProfessionals = getStoredProfessionals();

  // Filter looks by active category
  const categoryLooks = useMemo(() => {
    return SHOWCASE_LOOKS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  // Current active featured look
  const currentLook = categoryLooks[selectedLookIndex] || categoryLooks[0];

  // Matched professional from store
  const matchedPro = allProfessionals.find((p: any) => p.slug === currentLook.artistSlug) || allProfessionals[0];

  // Other looks in this category (for the right-side 3-card stack)
  const sideCards = categoryLooks;

  // Handle Category Switch
  const handleCategoryChange = (cat: typeof CATEGORY_TABS[number]) => {
    setActiveCategory(cat);
    setSelectedLookIndex(0);
  };

  // Previous & Next navigation
  const handlePrev = () => {
    setSelectedLookIndex((prev) => (prev > 0 ? prev - 1 : categoryLooks.length - 1));
  };

  const handleNext = () => {
    setSelectedLookIndex((prev) => (prev < categoryLooks.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="w-full bg-white text-stone-900 pt-3 sm:pt-5 pb-10 sm:pb-14 border-b border-stone-100 select-none relative overflow-hidden">
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10">

        {/* 1. Header (Compact two-tone title without excessive white space) */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-6">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-1.5">
            LATEST CURATED ARTISTS
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-stone-900 tracking-wide leading-tight">
            <span>Discover </span>
            <span className="text-[#4A1513]">Your Personal Stylist</span>
          </h2>

          <p className="mt-1.5 text-stone-500 text-xs sm:text-sm font-sans italic max-w-md mx-auto">
            Discover professionals, explore their work and choose a package that suits your occasion.
          </p>
        </div>

        {/* 2. Category Selector Pills (Bridal, Party & Glam, Editorial & HD, etc.) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 sm:mb-7 scrollbar-none justify-start sm:justify-center">
          {CATEGORY_TABS.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
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

        {/* 3. The Layout Matching Reference Screenshot:
            Left/Center: Large Full Makeover Showcase Image with Floating Info Card & Prev/Next Arrows
            Right: 3 Stacked Horizontal Cards with Thumbnail & Link
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full mx-auto">
          
          {/* Left/Center Showcase Area (8 Cols on LG) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col md:flex-row items-center gap-4 sm:gap-6 relative">
            
            {/* Main Full Makeover Square/Portrait Image */}
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-100 shadow-sm border border-stone-200/80 shrink-0 group">
              <img
                src={currentLook.image}
                alt={currentLook.lookTitle}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/dress/lehengas/bridal-lehengas/Woman_wearing_red_bridal_lehenga_202609091646.jpeg";
                }}
              />

              {/* Verified Shield on top-right */}
              <div className="absolute top-3 right-3 z-10">
                <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-sm">
                  <ShieldCheck size={14} className="text-[#F3E5AB] stroke-[2.2]" />
                </div>
              </div>

              {/* Navigation Arrow: Previous (<) */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous look"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-800 hover:text-[#4A1513] shadow-md border border-stone-200/80 flex items-center justify-center transition-all cursor-pointer z-10 active:scale-95"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Navigation Arrow: Next (>) */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next look"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-800 hover:text-[#4A1513] shadow-md border border-stone-200/80 flex items-center justify-center transition-all cursor-pointer z-10 active:scale-95"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Floating Info Card (Matches reference screenshot's white floating card) */}
            <div className="w-full md:max-w-[280px] lg:max-w-[300px] bg-white rounded-2xl p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-stone-100 flex flex-col justify-between shrink-0 md:-ml-8 z-20 relative">
              <div>
                <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#4A1513] block mb-1.5">
                  {currentLook.tag}
                </span>

                <h3 className="font-serif text-base sm:text-lg font-bold text-[#2B1311] leading-snug mb-2 line-clamp-2">
                  {currentLook.lookTitle}
                </h3>

                <p className="text-xs text-stone-500 font-sans leading-relaxed line-clamp-2 mb-3">
                  {currentLook.description}
                </p>

                {/* Stylist Identity Row */}
                <div className="flex items-center gap-2.5 pt-2 border-t border-stone-100 mb-3">
                  <img
                    src={currentLook.avatar}
                    alt={currentLook.artistName}
                    className="w-9 h-9 rounded-full border border-stone-200 object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-stone-900 block truncate">
                      {currentLook.artistName}
                    </span>
                    <span className="text-[10.5px] text-stone-500 block truncate">
                      {currentLook.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                    Starting from
                  </span>
                  <span className="font-serif text-lg font-bold text-[#4A1513]">
                    ₹{currentLook.startingPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/professionals/${currentLook.artistSlug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#4A1513] hover:text-[#350B0A] transition-colors py-1 group/btn"
                >
                  <span>Explore Artist</span>
                  <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-1" />
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedProfessionalForBooking(matchedPro)}
                  className="ml-auto px-3.5 py-1.5 rounded-full bg-[#4A1513] hover:bg-[#350E0C] text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  Book
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: 3 Stacked Horizontal Cards (Matches reference screenshot) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-3.5 w-full">
            {sideCards.slice(0, 3).map((item, index) => {
              const isSelected = item.id === currentLook.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedLookIndex(index)}
                  className={`bg-white rounded-2xl p-3 border transition-all duration-200 flex items-center gap-3.5 cursor-pointer group shadow-2xs ${
                    isSelected
                      ? "border-[#4A1513] ring-1 ring-[#4A1513]/20 shadow-md bg-stone-50/50"
                      : "border-stone-200/80 hover:border-stone-300 hover:shadow-xs"
                  }`}
                >
                  {/* Square Thumbnail Image on Left */}
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                    <img
                      src={item.image}
                      alt={item.lookTitle}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/dress/lehengas/bridal-lehengas/Woman_wearing_red_bridal_lehenga_202609091646.jpeg";
                      }}
                    />
                  </div>

                  {/* Title & View Link on Right */}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-stone-900 leading-snug line-clamp-1 mb-1 group-hover:text-[#4A1513] transition-colors">
                      {item.lookTitle}
                    </h4>

                    <span className="text-[11px] font-semibold text-[#4A1513] block mb-1">
                      From ₹{item.startingPrice.toLocaleString("en-IN")} • {item.artistName}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-stone-500 group-hover:text-[#4A1513] transition-colors">
                      <span>View Look</span>
                      <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* 4. Bottom Sleek Action Bar leading to the Separate Detailed Page */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500 font-sans text-center sm:text-left">
            Explore 100+ verified bridal artists, master saree drapers, and personal styling assistants across India.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="/professionals"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4A1513] hover:bg-[#350E0C] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap"
            >
              <span>Explore All Stylists &amp; Packages</span>
              <ArrowRight size={13} />
            </Link>

            <Link
              href="/vendor/services"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-stone-300 hover:border-[#4A1513] text-stone-700 hover:text-[#4A1513] text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap"
            >
              <span>Join as Artist</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Interactive Booking Modal */}
      {selectedProfessionalForBooking && (
        <ProfessionalBookingModal
          professional={selectedProfessionalForBooking}
          isOpen={!!selectedProfessionalForBooking}
          onClose={() => setSelectedProfessionalForBooking(null)}
        />
      )}
    </section>
  );
}
