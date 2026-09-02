"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  ShieldCheck,
  Award,
  Zap,
  ArrowRight,
  Upload,
  Camera,
  X,
  SlidersHorizontal,
  ChevronRight,
  Heart,
  Eye,
  Video,
  Home,
  Store,
  ChevronDown,
  ChevronUp,
  Percent,
  Check,
  Flame,
  Search,
  MessageCircle,
  Users,
  Timer
} from 'lucide-react';

// ============================================================================
// TYPES & DATA DEFINITIONS
// ============================================================================

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: 'Bridal & Glamour' | 'Style & Wardrobe' | 'Concierge & Lifestyle';
  rating: number;
  reviewsCount: number;
  basePrice: number;
  startingPrice: number;
  image: string;
  badge: string;
  isAiPowered?: boolean;
  isInstantBooking?: boolean;
  description: string;
  highlights: string[];
  packages: ServicePackage[];
  modes: ('Home' | 'Salon' | 'Virtual')[];
  expertName: string;
  expertRole: string;
  expertImage: string;
  portfolio: string[];
}

const MOCK_SERVICES: ServiceItem[] = [
  {
    id: 's1',
    slug: 'bridal-glamour-makeup',
    title: 'Bridal & Glamour Makeup Artist',
    tagline: 'HD & Airbrush Couture Bridal Glamour with Skin-Tone Matching',
    category: 'Bridal & Glamour',
    rating: 4.98,
    reviewsCount: 342,
    basePrice: 14999,
    startingPrice: 14999,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=85&w=1000',
    badge: 'Bestseller',
    isInstantBooking: true,
    description: 'Bespoke bridal makeovers curated by master celebrity artists. Includes HD/Airbrush draping, lash extensions, hair sculpting, and pre-event skincare consultation.',
    highlights: ['HD / Airbrush Waterproof Finish', 'Skin-Tone Pigment Matching', 'Sanitized Luxury Kits (Dior/Huda)', 'Free Trial Session with VIP Tier'],
    modes: ['Home', 'Salon', 'Virtual'],
    expertName: 'Ananya Sharma',
    expertRole: 'Celebrity Bridal Stylist (Vogue Featured)',
    expertImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    packages: [
      { id: 'p1_1', name: 'Essential Glam', price: 14999, duration: '2 Hours', features: ['HD Party Makeup', 'Hair Styling & Draping', 'Standard Lashes', 'At-Venue Service'] },
      { id: 'p1_2', name: 'Signature Bridal', price: 24999, duration: '3.5 Hours', features: ['Ultra HD Waterproof Bridal Base', '3D Silk Lashes & Hair Sculpting', 'Dupatta & Jewelry Setting', 'Touch-up Kit Included'], popular: true },
      { id: 'p1_3', name: 'VIP Royal Trousseau', price: 44999, duration: 'Full Day', features: ['Full Airbrush Waterproof Base', 'Pre-Wedding Trial Session', 'Personal Assistant on Venue', 'Groom Glow Touch-up Complimentary'] }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1512496015851-a1dc8b41cd83?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 's2',
    slug: 'personal-ai-stylist',
    title: 'Personal AI & Human Stylist',
    tagline: 'Virtual Wardrobe Audit, Color Analysis & Curated Moodboards',
    category: 'Style & Wardrobe',
    rating: 4.95,
    reviewsCount: 218,
    basePrice: 4999,
    startingPrice: 4999,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=85&w=1000',
    badge: 'AI Powered',
    isAiPowered: true,
    isInstantBooking: true,
    description: 'Transform your personal aesthetic with a high-fashion stylist backed by Femazon’s AI Wardrobe Vision. Receive seasonal lookbooks, body-shape guides, and live shopping sync.',
    highlights: ['Digital Closet Audit & Gap Analysis', 'Personal Color Season Palette', '3 Complete Curated Event Moodboards', 'Direct Femazon Cart Sync'],
    modes: ['Virtual', 'Home', 'Salon'],
    expertName: 'Rhea Kapoor',
    expertRole: 'Senior Fashion Director',
    expertImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    packages: [
      { id: 'p2_1', name: 'Virtual Style Audit', price: 4999, duration: '60 Mins', features: ['AI Body Shape & Color Mapping', '10 Outfit Combinations from your closet', 'PDF Moodboard Export'] },
      { id: 'p2_2', name: 'Signature Wardrobe Refresh', price: 9999, duration: '2 Hours', features: ['Full Closet Audit (Virtual/In-Person)', '25 Curated Links for Femazon Store', '1-on-1 Video Styling Session', '30 Days Style Chat Support'], popular: true },
      { id: 'p2_3', name: 'VIP Couture Retainer', price: 19999, duration: '1 Month', features: ['Unlimited Event Outfit Planning', 'Direct WhatsApp Access to Stylist', 'VIP Fitting Room Reservations', 'Personal Shopping Escort in City'] }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 's3',
    slug: 'mehndi-henna-artistry',
    title: 'Mehndi & Henna Artistry',
    tagline: '100% Organic Henna, Royal Arabic & Intricate Bridal Motifs',
    category: 'Bridal & Glamour',
    rating: 4.97,
    reviewsCount: 189,
    basePrice: 5999,
    startingPrice: 5999,
    image: 'https://images.unsplash.com/photo-1560031802-9a741366b26c?auto=format&fit=crop&q=85&w=1000',
    badge: 'Organic Assured',
    isInstantBooking: true,
    description: 'Heritage henna artistry using organically cultivated, chemical-free henna leaves for a deep mahogany stain. Custom storytelling bridal motifs with portrait detailing.',
    highlights: ['100% Chemical-Free Organic Henna', 'Intricate Portrait & Motif Customization', 'Post-Application Essential Oil Sealant', 'Hourly Guest Packages Available'],
    modes: ['Home', 'Salon'],
    expertName: 'Zainab Qureshi',
    expertRole: 'Master Henna Artisan (12+ Yrs Exp)',
    expertImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    packages: [
      { id: 'p3_1', name: 'Party / Arabic Palms', price: 5999, duration: '1.5 Hours', features: ['Both Hands (Palms & Back)', 'Contemporary Arabic Floral Design', 'Natural Aftercare Clove Oil Balm'] },
      { id: 'p3_2', name: 'Bridal Royal Heritage', price: 11999, duration: '3.5 Hours', features: ['Elbow Length Both Hands + Feet to Ankles', 'Personalized Wedding Hashtag / Motif', 'Dark Stain Guarantee', '1 Assistant Included for Fast Draping'], popular: true },
      { id: 'p3_3', name: 'VIP Grand Sangeet Suite', price: 21999, duration: '5 Hours', features: ['Full Royal Bridal Henna', 'Mehndi for up to 10 Wedding Guests', 'Team of 3 Certified Artists', 'Complimentary Nilgiri Oil Gift Pack'] }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 's4',
    slug: 'ai-shopping-assistant',
    title: 'AI Shopping Assistant & Store Companion',
    tagline: 'Live Budget Tracker, Store Companion & Curated Cart Sync',
    category: 'Concierge & Lifestyle',
    rating: 4.92,
    reviewsCount: 164,
    basePrice: 3499,
    startingPrice: 3499,
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=85&w=1000',
    badge: 'Smart Sync',
    isAiPowered: true,
    isInstantBooking: true,
    description: 'Shop smarter with an AI-assisted personal shopper. Receive real-time discount optimization, companion in-store navigation, and instant size-match verification.',
    highlights: ['Live Budget & Discount Optimization', 'In-Store Physical Companion Booking', 'Direct Curated Cart Sync', 'Zero Unwanted Buys Guarantee'],
    modes: ['Virtual', 'Salon', 'Home'],
    expertName: 'Mira Sen',
    expertRole: 'Luxury Retail Specialist',
    expertImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    packages: [
      { id: 'p4_1', name: 'Virtual Cart Curator', price: 3499, duration: '45 Mins', features: ['AI Size & Fitting Validation', 'Curated 1-Click Buy List', 'Coupon & Bundle Optimizer'] },
      { id: 'p4_2', name: 'Live Video Shopper', price: 6499, duration: '90 Mins', features: ['Real-time Boutique Walkthrough', 'Fabric & Drape Video Verification', 'Instant Cart Synchronization', 'Priority Shipping Upgrade'], popular: true },
      { id: 'p4_3', name: 'VIP City Mall Companion', price: 12999, duration: '4 Hours', features: ['In-Person Shopping Escort', 'Reserved Fitting Rooms in Flagship Stores', 'Chauffeur Booking Assistance', 'Styling on Spot'] }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 's5',
    slug: 'image-consultation',
    title: '1-on-1 Fashion & Image Consultation',
    tagline: 'Posture, Capsule Wardrobe & Executive Event Styling',
    category: 'Style & Wardrobe',
    rating: 4.96,
    reviewsCount: 142,
    basePrice: 6999,
    startingPrice: 6999,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=85&w=1000',
    badge: 'Executive',
    isInstantBooking: true,
    description: 'Elevate your visual presence for galas, red carpet events, corporate leadership, and media appearances. Tailored posture, etiquette, and signature look curation.',
    highlights: ['Posture & Poise Assessment', 'Custom Capsule Wardrobe Blueprint', 'Jewelry & Accessory Harmonization', 'Camera-Ready Appearance Guide'],
    modes: ['Virtual', 'Salon', 'Home'],
    expertName: 'Dr. Kavita Menon',
    expertRole: 'Master Image Strategist',
    expertImage: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300',
    packages: [
      { id: 'p5_1', name: 'Event Presence Strategy', price: 6999, duration: '75 Mins', features: ['Event-Specific Silhouette Selection', 'Accessory & Jewelry Pairing', 'High-Res Lookbook PDF'] },
      { id: 'p5_2', name: 'Executive Capsule Blueprint', price: 12999, duration: '2.5 Hours', features: ['30-Piece Capsule Wardrobe Plan', 'Color Contrast & Psychology Guide', 'Shoe & Bag Harmonization', 'Seasonal Updates'], popular: true },
      { id: 'p5_3', name: 'Complete Image Transformation', price: 24999, duration: 'Full Day', features: ['Full Physical Makeover Audit', 'Hairstyle & Makeup Harmony Session', 'Media & Gala Poise Coaching', 'Annual Style Concierge'] }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1512496015851-a1dc8b41cd83?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 's6',
    slug: 'trousseau-event-planning',
    title: 'End-to-End Trousseau & Wedding Planning',
    tagline: 'Milestone Timeline Tracker, Designer Concierge & Theme Styling',
    category: 'Concierge & Lifestyle',
    rating: 4.99,
    reviewsCount: 98,
    basePrice: 29999,
    startingPrice: 29999,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=85&w=1000',
    badge: 'Luxury Concierge',
    isInstantBooking: false,
    description: 'A seamless, white-glove wedding trousseau and event styling service. From Haldi hues to Reception regal drapes, our concierges orchestrate every designer ensemble.',
    highlights: ['Full Milestone Timeline Tracker', 'Bridesmaid & Family Theme Harmonization', 'Direct Couture Atelier Access', 'Packing & Box Trunk Styling'],
    modes: ['Home', 'Virtual', 'Salon'],
    expertName: 'Natasha Singhal',
    expertRole: 'Luxury Trousseau Curator',
    expertImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=300',
    packages: [
      { id: 'p6_1', name: 'Trousseau Box Curation', price: 29999, duration: '2 Weeks', features: ['Curated Outfits for 5 Pre-wedding Events', 'Jewelry Matching & Trunk Packaging Guide', 'Direct Brand Discounts'] },
      { id: 'p6_2', name: 'Grand Bridal Concierge', price: 49999, duration: '1 Month', features: ['Full Wedding Week Ensemble Management', 'Family & Bridesmaid Theme Coordination', 'Fittings Supervision with Ateliers', 'Dedicated On-Ground Stylist on Wedding Day'], popular: true },
      { id: 'p6_3', name: 'Royal Destination Royale', price: 99999, duration: 'Full Wedding', features: ['End-to-End Trousseau & Bridal Team Coordination', 'Travel Wardrobe Planning for Destination', '2 Stylists on Venue for 3 Days', 'Unlimited Design Alterations Support'] }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=80&w=600'
    ]
  }
];

const LIVE_BOOKINGS = [
  'Priya K. just booked Bridal Mehndi Artistry in Chennai · 3 mins ago',
  'Ananya R. reserved a Personal AI Stylist Session in Mumbai · 7 mins ago',
  'Deepika M. scheduled HD Airbrush Bridal Glamour in Delhi · 12 mins ago',
  'Sneha V. confirmed 1-on-1 Image Consultation in Bangalore · 18 mins ago',
  'Tara G. booked Wedding Trousseau Planning in Hyderabad · 25 mins ago'
];

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Shreya Narayanan',
    event: 'Bridal Makeover & Henna',
    quote: 'The AI trial matched my undertones flawlessly, and Ananya created the exact ethereal look I envisioned for my wedding morning. Absolute perfection!',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    location: 'Chennai, TN',
    rating: 5
  },
  {
    id: 2,
    name: 'Aishwarya Roy',
    event: 'Wardrobe Refresh & AI Audit',
    quote: 'I saved over ₹40,000 on wedding shopping because my Femazon stylist filtered exactly what suited my frame and synced my cart directly. Incredible tech!',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    location: 'Mumbai, MH',
    rating: 5
  },
  {
    id: 3,
    name: 'Meera Chidambaram',
    event: 'Trousseau Event Concierge',
    quote: 'From Sangeet pastels to Reception zardozi, Natasha organized our entire family styling without a single hiccup. Truly a white-glove experience.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    location: 'Bangalore, KA',
    rating: 5
  }
];

export function LuxuryServicesClient() {
  // Category state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Smart Match AI Finder Modal / Drawer state
  const [isAiQuizOpen, setIsAiQuizOpen] = useState(false);
  const [quizOccasion, setQuizOccasion] = useState<string>('Wedding');
  const [quizBudget, setQuizBudget] = useState<string>('₹10,000 - ₹25,000');
  const [quizMode, setQuizMode] = useState<string>('At-Home Service');
  const [matchedServiceId, setMatchedServiceId] = useState<string | null>(null);

  // Booking Flow Modal State
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-15');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM');
  const [selectedMode, setSelectedMode] = useState<'Home' | 'Salon' | 'Virtual'>('Home');
  const [inspirationNote, setInspirationNote] = useState<string>('');
  const [inspirationImage, setInspirationImage] = useState<string | null>(null);
  const [holdCountdown, setHoldCountdown] = useState<number>(600); // 10 minutes slot hold
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  // Live Booking Ticker index
  const [tickerIndex, setTickerIndex] = useState(0);

  // File input ref for inspiration upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ticker rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % LIVE_BOOKINGS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Slot hold countdown timer effect
  useEffect(() => {
    if (selectedService && bookingStep >= 4 && holdCountdown > 0) {
      const timer = setInterval(() => setHoldCountdown(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [selectedService, bookingStep, holdCountdown]);

  // Open booking modal for a service
  const handleOpenBooking = (service: ServiceItem, pkg?: ServicePackage) => {
    setSelectedService(service);
    setSelectedPackage(pkg || service.packages[1] || service.packages[0]);
    setSelectedMode(service.modes[0] || 'Home');
    setBookingStep(1);
    setIsBookingConfirmed(false);
    setHoldCountdown(600);
  };

  // Close booking modal
  const handleCloseBooking = () => {
    setSelectedService(null);
    setSelectedPackage(null);
    setBookingStep(1);
    setIsBookingConfirmed(false);
  };

  // Run Smart Match AI Quiz calculation
  const handleRunAiQuiz = () => {
    if (quizOccasion === 'Wedding') {
      setMatchedServiceId('s1'); // Bridal & Glamour
    } else if (quizOccasion === 'Party' || quizOccasion === 'Casual') {
      setMatchedServiceId('s2'); // Personal Stylist
    } else if (quizOccasion === 'Sangeet / Festive') {
      setMatchedServiceId('s3'); // Mehndi
    } else {
      setMatchedServiceId('s6'); // Trousseau
    }
    setIsAiQuizOpen(false);

    // Scroll to services grid
    const el = document.getElementById('services-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter services
  const filteredServices = MOCK_SERVICES.filter(service => {
    if (selectedCategory === 'All') return true;
    return service.category === selectedCategory;
  });

  // Calculate prices
  const currentPackagePrice = selectedPackage?.price || selectedService?.basePrice || 0;
  const advanceDeposit = Math.round(currentPackagePrice * 0.25); // 25% advance to hold slot
  const taxAmount = Math.round(currentPackagePrice * 0.18); // 18% GST
  const totalAmount = currentPackagePrice + taxAmount;

  // Format countdown string
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4] text-stone-900 font-sans pb-24 selection:bg-[#4A1513] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. LIVE BOOKING REAL-TIME TICKER STRIP */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#4A1513] text-white py-2 px-4 border-b border-[#360D0C] overflow-hidden">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold tracking-wider uppercase text-[10px] text-rose-200">LIVE CONCIERGE:</span>
            <span className="text-stone-100 font-medium transition-all duration-500 line-clamp-1">
              {LIVE_BOOKINGS[tickerIndex]}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-rose-200 font-semibold">
            <span>🛡️ 100% Sanitized Kits</span>
            <span>⭐ 4.98/5 Rated Artists</span>
            <span>🔒 Verified ID Professionals</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION: ULTRA LUXURY EDITORIAL HEADER */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-stone-200/80 bg-gradient-to-b from-white via-[#FAF7F4] to-[#FAF7F4]">
        
        {/* Glow ambient background accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-rose-200/30 via-amber-100/30 to-[#4A1513]/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Left Text Column */}
          <div className="w-full lg:max-w-2xl text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#4A1513]/20 shadow-xs mb-4">
              <Sparkles size={13} className="text-[#4A1513] animate-pulse" />
              <span className="font-sans text-[11px] font-bold tracking-[0.16em] uppercase text-[#4A1513]">
                Couture Lifestyle &amp; Beauty Concierge
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-stone-900 leading-[1.12] tracking-tight">
              Curated Beauty, Artistry &amp; <br />
              <span className="italic font-normal bg-gradient-to-r from-[#4A1513] via-[#7B241C] to-[#4A1513] bg-clip-text text-transparent">
                Personal Fashion Styling.
              </span>
            </h1>

            <p className="font-sans text-sm sm:text-base text-stone-600 font-normal mt-5 leading-relaxed max-w-xl">
              Elevate your bridal, festive, and everyday signature look. Book vetted celebrity makeup artists, AI-powered wardrobe stylists, organic henna masters, and bridal trousseau planners.
            </p>

            {/* Direct Action Triggers */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              
              <button
                type="button"
                onClick={() => setIsAiQuizOpen(true)}
                className="px-6 py-3.5 rounded-full bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-[0.18em] shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles size={15} />
                <span>Smart Match AI Finder</span>
              </button>

              <a
                href="#services-grid"
                className="px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold uppercase tracking-[0.16em] shadow-2xs hover:border-[#4A1513] transition-all cursor-pointer"
              >
                Browse All Services
              </a>

            </div>

            {/* Micro Trust Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-stone-200/80">
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">4,800+</div>
                <div className="text-[11px] text-stone-500 uppercase tracking-wider mt-0.5">Events Styled</div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">4.98★</div>
                <div className="text-[11px] text-stone-500 uppercase tracking-wider mt-0.5">Client Rating</div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">100%</div>
                <div className="text-[11px] text-stone-500 uppercase tracking-wider mt-0.5">Vetted Artists</div>
              </div>
            </div>

          </div>

          {/* Right Featured Hero Visual / Quick Match Card */}
          <div className="w-full lg:max-w-lg">
            <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xl">
              
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#4A1513] text-white flex items-center justify-center shadow-xs">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-stone-900">AI Concierge Match</h3>
                    <p className="text-xs text-stone-500">Need help deciding the right expert?</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase rounded-full">
                  Instant
                </span>
              </div>

              {/* Fast 3-question Selector */}
              <div className="space-y-3.5 mt-5 text-left">
                
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                    1. Select Occasion
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Wedding', 'Sangeet / Festive', 'Party'].map(occ => (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => setQuizOccasion(occ)}
                        className={`py-2 px-2 text-xs font-semibold rounded-xl border transition cursor-pointer text-center truncate ${
                          quizOccasion === occ 
                            ? 'border-[#4A1513] bg-[#FAF5F2] text-[#4A1513] shadow-xs' 
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                    2. Planned Budget Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['₹5,000 - ₹15,000', '₹15,000 - ₹50,000+'].map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setQuizBudget(b)}
                        className={`py-2 px-2 text-xs font-semibold rounded-xl border transition cursor-pointer text-center ${
                          quizBudget === b 
                            ? 'border-[#4A1513] bg-[#FAF5F2] text-[#4A1513] shadow-xs' 
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                    3. Service Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'At Home', icon: Home },
                      { label: 'Studio/Salon', icon: Store },
                      { label: 'Virtual Video', icon: Video }
                    ].map(m => (
                      <button
                        key={m.label}
                        type="button"
                        onClick={() => setQuizMode(m.label)}
                        className={`py-2 px-1.5 text-xs font-semibold rounded-xl border transition cursor-pointer flex items-center justify-center gap-1 ${
                          quizMode === m.label 
                            ? 'border-[#4A1513] bg-[#FAF5F2] text-[#4A1513] shadow-xs' 
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        <m.icon size={13} />
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunAiQuiz}
                  className="w-full mt-2 py-3.5 rounded-xl bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-[0.16em] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap size={14} />
                  <span>Show Recommended Services →</span>
                </button>

              </div>

            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. STICKY CATEGORY PILLS & SEARCH BAR */}
      {/* ========================================================================= */}
      <section id="services-grid" className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs with Micro-Counters */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full sm:w-auto py-0.5">
            {[
              { label: 'All', count: 6 },
              { label: 'Bridal & Glamour', count: 2 },
              { label: 'Style & Wardrobe', count: 2 },
              { label: 'Concierge & Lifestyle', count: 2 }
            ].map(tab => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setSelectedCategory(tab.label)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === tab.label
                    ? 'bg-[#4A1513] text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200/70 text-stone-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === tab.label ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Trust Guarantees */}
          <div className="hidden lg:flex items-center gap-5 text-xs text-stone-600 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-[#4A1513]" />
              <span>Verified Professionals</span>
            </span>
            <span className="flex items-center gap-1">
              <Award size={14} className="text-[#4A1513]" />
              <span>100% Satisfaction Guarantee</span>
            </span>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CORE SERVICES LIST & INTERACTIVE CARDS */}
      {/* ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {filteredServices.map(service => {
            const isMatched = matchedServiceId === service.id;

            return (
              <div
                key={service.id}
                className={`group relative bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col ${
                  isMatched 
                    ? 'border-[#4A1513] shadow-2xl ring-4 ring-[#4A1513]/15' 
                    : 'border-stone-200/90 shadow-sm hover:shadow-xl hover:border-[#4A1513]/40'
                }`}
              >
                
                {/* AI Match Highlight Banner */}
                {isMatched && (
                  <div className="bg-[#4A1513] text-white text-[11px] font-bold uppercase tracking-widest py-1.5 px-4 text-center flex items-center justify-center gap-1.5">
                    <Sparkles size={12} className="animate-spin" />
                    <span>AI Recommended Match for Your Occasion</span>
                  </div>
                )}

                {/* Service Card Image Banner */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-[#4A1513] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      {service.badge}
                    </span>
                    {service.isAiPowered && (
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-stone-900 text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Sparkles size={10} className="text-[#4A1513]" />
                        <span>AI Powered</span>
                      </span>
                    )}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 text-[11px] font-bold text-stone-900">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span>{service.rating}</span>
                    <span className="text-stone-400 font-normal">({service.reviewsCount})</span>
                  </div>

                  {/* Bottom Image Info: Title & Modes */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-rose-200 block">
                      {service.category}
                    </span>
                    <h3 className="font-serif text-lg font-bold leading-snug line-clamp-1">
                      {service.title}
                    </h3>
                  </div>

                </div>

                {/* Service Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  
                  <div>
                    {/* Tagline */}
                    <p className="text-xs text-stone-600 font-medium leading-relaxed mb-4">
                      {service.tagline}
                    </p>

                    {/* Features Highlights Checklist */}
                    <div className="space-y-2 mb-5">
                      {service.highlights.slice(0, 3).map((hl, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                          <Check size={14} className="text-[#4A1513] shrink-0 mt-0.5" />
                          <span className="leading-snug">{hl}</span>
                        </div>
                      ))}
                    </div>

                    {/* Verified Expert Lead */}
                    <div className="flex items-center gap-3 p-3 bg-[#FAF7F4] rounded-2xl border border-stone-200/80 mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={service.expertImage}
                        alt={service.expertName}
                        className="w-10 h-10 rounded-full object-cover border border-stone-300 shadow-2xs shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-stone-900 truncate">{service.expertName}</span>
                          <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                        </div>
                        <p className="text-[10.5px] text-stone-500 truncate">{service.expertRole}</p>
                      </div>
                    </div>

                    {/* Mode Availability Pill Badges */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-[10.5px] text-stone-400 font-semibold uppercase">Modes:</span>
                      {service.modes.map(mode => (
                        <span key={mode} className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-medium rounded-md">
                          {mode === 'Home' ? '🏠 At Home' : mode === 'Salon' ? '🏬 Salon/Studio' : '📹 Virtual Video'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Primary CTA */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                    
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Starting from</span>
                      <span className="font-sans text-xl font-bold text-stone-900 tabular-nums">
                        ₹{service.startingPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenBooking(service)}
                      className="px-5 py-3 rounded-xl bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-[0.14em] shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar size={14} />
                      <span>Book Now</span>
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. SOCIAL PROOF & TESTIMONIALS */}
      {/* ========================================================================= */}
      <section className="bg-white border-y border-stone-200/80 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A1513] mb-2 block">
              Verified Client Stories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900">
              Trusted by 4,800+ Women Across India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.id} className="p-6 bg-[#FAF7F4] rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-stone-200/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border border-stone-300"
                  />
                  <div>
                    <h4 className="font-serif text-xs font-bold text-stone-900">{t.name}</h4>
                    <p className="text-[11px] text-[#4A1513] font-semibold">{t.event}</p>
                    <span className="text-[10px] text-stone-400 font-normal">{t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. MULTI-STEP INTERACTIVE BOOKING DRAWER / MODAL */}
      {/* ========================================================================= */}
      {selectedService && (
        <div className="fixed inset-0 z-[9999] overflow-hidden animate-in fade-in duration-300">
          
          {/* Backdrop Scrim */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={handleCloseBooking}
          />

          {/* Right Sliding Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-full flex z-10">
            <div className="w-screen max-w-lg sm:max-w-xl bg-white shadow-2xl border-l border-stone-200 flex flex-col h-full animate-in slide-in-from-right duration-300 ease-out">
              
              {/* Drawer Header */}
              <div className="px-6 py-4 bg-[#FAF7F4] border-b border-stone-200/80 flex items-center justify-between shrink-0">
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#4A1513]">
                      Step {bookingStep} of 5 · Smart Booking
                    </span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-tight mt-0.5">
                    {selectedService.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleCloseBooking}
                  className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-500 hover:text-stone-900 flex items-center justify-center transition shadow-2xs cursor-pointer"
                >
                  <X size={16} />
                </button>

              </div>

              {/* Drawer Body Scrollable Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* ------------------------------------------------------------- */}
                {/* STEP 1: PACKAGE / TIER SELECTION */}
                {/* ------------------------------------------------------------- */}
                {bookingStep === 1 && (
                  <div className="space-y-4">
                    
                    <div className="text-left">
                      <h4 className="font-serif text-lg font-bold text-stone-900">Select Your Experience Package</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Transparent base pricing. 100% sanitized tools guaranteed.</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {selectedService.packages.map(pkg => {
                        const isSelected = selectedPackage?.id === pkg.id;

                        return (
                          <div
                            key={pkg.id}
                            onClick={() => setSelectedPackage(pkg)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                              isSelected
                                ? 'border-[#4A1513] bg-[#FAF5F2] shadow-md ring-2 ring-[#4A1513]/10'
                                : 'border-stone-200 bg-white hover:border-stone-400'
                            }`}
                          >
                            {pkg.popular && (
                              <span className="absolute -top-2.5 right-4 bg-[#4A1513] text-white text-[9.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                                Most Booked
                              </span>
                            )}

                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  isSelected ? 'border-[#4A1513] bg-[#4A1513]' : 'border-stone-300'
                                }`}>
                                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </span>
                                <h5 className="font-serif text-sm font-bold text-stone-900">{pkg.name}</h5>
                              </div>
                              <div className="text-right">
                                <span className="font-sans text-base font-bold text-stone-900 tabular-nums">
                                  ₹{pkg.price.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-stone-400 block">{pkg.duration}</span>
                              </div>
                            </div>

                            <ul className="space-y-1 mt-2 pl-6">
                              {pkg.features.map((f, i) => (
                                <li key={i} className="text-xs text-stone-600 flex items-center gap-1.5">
                                  <span className="text-[#4A1513] font-bold text-xs">✓</span>
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STEP 2: DATE, TIME & SERVICE MODE */}
                {/* ------------------------------------------------------------- */}
                {bookingStep === 2 && (
                  <div className="space-y-5 text-left">
                    
                    <div>
                      <h4 className="font-serif text-lg font-bold text-stone-900">Choose Mode &amp; Schedule</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Select where and when you would like the expert service.</p>
                    </div>

                    {/* Service Mode Selector */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-2">
                        Service Delivery Mode
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedService.modes.map(mode => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setSelectedMode(mode)}
                            className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                              selectedMode === mode
                                ? 'border-[#4A1513] bg-[#FAF5F2] text-[#4A1513] font-bold shadow-xs'
                                : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400 font-medium'
                            }`}
                          >
                            {mode === 'Home' && <Home size={18} />}
                            {mode === 'Salon' && <Store size={18} />}
                            {mode === 'Virtual' && <Video size={18} />}
                            <span className="text-xs">{mode === 'Home' ? 'At Home' : mode === 'Salon' ? 'At Salon' : 'Virtual Call'}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date Picker */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-2">
                        Select Appointment Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 bg-white focus:outline-none focus:border-[#4A1513]"
                      />
                    </div>

                    {/* Time Slot Picker */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-2">
                        Available Time Slot
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['08:00 AM', '10:00 AM', '01:30 PM', '04:00 PM', '06:30 PM', '08:00 PM'].map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`py-2 px-2 text-xs rounded-xl border transition cursor-pointer text-center ${
                              selectedTimeSlot === slot
                                ? 'border-[#4A1513] bg-[#4A1513] text-white font-bold'
                                : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STEP 3: CUSTOM ADD-ONS & MOODBOARD UPLOAD */}
                {/* ------------------------------------------------------------- */}
                {bookingStep === 3 && (
                  <div className="space-y-5 text-left">
                    
                    <div>
                      <h4 className="font-serif text-lg font-bold text-stone-900">Custom Notes &amp; Inspiration</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Upload outfit references or hair/makeup moodboards for the artist.</p>
                    </div>

                    {/* Drag and Drop Inspiration Box */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-2">
                        Reference Photo / Lookbook (Optional)
                      </label>
                      
                      {inspirationImage ? (
                        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={inspirationImage} alt="Inspiration" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setInspirationImage(null)}
                            className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full hover:bg-black"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-stone-300 hover:border-[#4A1513] bg-[#FAF7F4] hover:bg-white rounded-2xl p-6 text-center cursor-pointer transition"
                        >
                          <Upload size={24} className="mx-auto text-stone-500 mb-2" />
                          <p className="text-xs font-semibold text-stone-800">Upload Reference Image</p>
                          <p className="text-[10px] text-stone-400 mt-0.5">PNG, JPG or Screenshot (Max 10MB)</p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const r = new FileReader();
                                r.onload = ev => setInspirationImage(ev.target?.result as string);
                                r.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Specific Notes Input */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-2">
                        Special Requests / Skin Concerns / Theme Notes
                      </label>
                      <textarea
                        rows={3}
                        value={inspirationNote}
                        onChange={(e) => setInspirationNote(e.target.value)}
                        placeholder="E.g., Pastel floral saree theme, sensitive skin, gold jewelry pairing needed..."
                        className="w-full p-3.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white focus:outline-none focus:border-[#4A1513]"
                      />
                    </div>

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STEP 4: LIVE PRICE CALCULATOR & SLOT HOLD */}
                {/* ------------------------------------------------------------- */}
                {bookingStep === 4 && (
                  <div className="space-y-5 text-left">
                    
                    {/* Live Slot Hold Countdown Banner */}
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Timer size={18} className="text-amber-700 animate-pulse" />
                        <div>
                          <span className="text-xs font-bold text-amber-900 block">Slot Reserved For You</span>
                          <span className="text-[10.5px] text-amber-700">Holding artist schedule for:</span>
                        </div>
                      </div>
                      <span className="font-mono text-base font-bold text-amber-900 px-3 py-1 bg-white rounded-lg border border-amber-300 shadow-2xs">
                        {formatCountdown(holdCountdown)}
                      </span>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-[#FAF7F4] p-5 rounded-2xl border border-stone-200/80 space-y-3">
                      
                      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                        <div>
                          <h5 className="font-serif text-sm font-bold text-stone-900">{selectedService.title}</h5>
                          <span className="text-xs text-[#4A1513] font-semibold">{selectedPackage?.name}</span>
                        </div>
                        <span className="font-sans text-sm font-bold text-stone-900 tabular-nums">
                          ₹{currentPackagePrice.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-stone-600">
                        <div className="flex justify-between">
                          <span>Scheduled Date &amp; Time:</span>
                          <span className="font-semibold text-stone-900">{selectedDate} at {selectedTimeSlot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Service Delivery Mode:</span>
                          <span className="font-semibold text-stone-900">{selectedMode} Mode</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Assigned Lead Expert:</span>
                          <span className="font-semibold text-stone-900">{selectedService.expertName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Applicable GST (18%):</span>
                          <span className="font-semibold text-stone-900">₹{taxAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                        <span className="font-bold text-xs uppercase tracking-wider text-stone-900">Total Service Value:</span>
                        <span className="font-sans text-xl font-bold text-stone-900">₹{totalAmount.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-emerald-800 block">Advance Deposit to Confirm:</span>
                          <span className="text-[10px] text-stone-400">Balance payable post-service</span>
                        </div>
                        <span className="font-sans text-base font-bold text-[#4A1513]">
                          ₹{advanceDeposit.toLocaleString('en-IN')}
                        </span>
                      </div>

                    </div>

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STEP 5: SECURE CHECKOUT / CONFIRMATION */}
                {/* ------------------------------------------------------------- */}
                {bookingStep === 5 && (
                  <div className="py-8 flex flex-col items-center text-center space-y-4">
                    
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-lg animate-bounce">
                      <CheckCircle2 size={32} />
                    </div>

                    <h4 className="font-serif text-2xl font-bold text-stone-900">
                      Booking Confirmed! 🎉
                    </h4>

                    <p className="text-xs text-stone-600 max-w-sm leading-relaxed">
                      Your slot for <span className="font-bold text-stone-900">{selectedService.title}</span> ({selectedPackage?.name}) on <span className="font-bold text-stone-900">{selectedDate}</span> has been confirmed.
                    </p>

                    <div className="w-full bg-[#FAF7F4] p-4 rounded-2xl border border-stone-200 text-left text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Booking Reference:</span>
                        <span className="font-mono font-bold text-stone-900">FEM-SRV-{Math.floor(100000 + Math.random() * 900000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Artist Contact:</span>
                        <span className="font-semibold text-stone-900">{selectedService.expertName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Advance Paid:</span>
                        <span className="font-bold text-emerald-700">₹{advanceDeposit.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCloseBooking}
                      className="w-full py-3.5 rounded-xl bg-[#4A1513] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#350B0A]"
                    >
                      Done &amp; Return to Concierge
                    </button>

                  </div>
                )}

              </div>

              {/* Drawer Sticky Footer Navigation */}
              {bookingStep < 5 && (
                <div className="px-6 py-4 bg-white border-t border-stone-200 flex items-center justify-between shrink-0">
                  
                  {bookingStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setBookingStep(prev => prev - 1)}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold uppercase tracking-wider hover:border-stone-500 transition cursor-pointer"
                    >
                      Back
                    </button>
                  ) : <div />}

                  <button
                    type="button"
                    onClick={() => {
                      if (bookingStep === 4) {
                        setBookingStep(5);
                        setIsBookingConfirmed(true);
                      } else {
                        setBookingStep(prev => prev + 1);
                      }
                    }}
                    className="px-6 py-3 rounded-xl bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-[0.16em] shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{bookingStep === 4 ? `Pay Deposit ₹${advanceDeposit.toLocaleString('en-IN')}` : 'Continue →'}</span>
                  </button>

                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. SMART MATCH AI FINDER FULLSCREEN QUIZ MODAL */}
      {/* ========================================================================= */}
      {isAiQuizOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
            
            <button
              type="button"
              onClick={() => setIsAiQuizOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#4A1513] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                <Sparkles size={24} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">Smart Match AI Finder</h3>
              <p className="text-xs text-stone-500 mt-1">Answer 2 quick questions to find your personalized concierge experience.</p>
            </div>

            <div className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">1. What is the occasion?</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Wedding', 'Sangeet / Festive', 'Party', 'Executive / Daily'].map(occ => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setQuizOccasion(occ)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition text-center ${
                        quizOccasion === occ ? 'border-[#4A1513] bg-[#FAF5F2] text-[#4A1513]' : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">2. What is your primary styling goal?</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Full Bridal Glamour', 'Wardrobe & Color Audit', 'Henna Artistry', 'Shopping Assistant'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setQuizOccasion(g.includes('Bridal') ? 'Wedding' : g.includes('Henna') ? 'Sangeet / Festive' : 'Party')}
                      className="p-3 rounded-xl border border-stone-200 hover:border-[#4A1513] text-xs font-semibold text-stone-700 bg-white"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunAiQuiz}
                className="w-full mt-4 py-3.5 rounded-xl bg-[#4A1513] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-[#350B0A]"
              >
                Match Me With Expert →
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
