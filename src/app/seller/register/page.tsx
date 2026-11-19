"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Store, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  HeartHandshake, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown, 
  X,
  Plus,
  ArrowLeft, 
  ArrowRight, 
  Building, 
  AlertCircle, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  Tag, 
  FileText, 
  Gift, 
  Scissors, 
  Headphones,
  Eye,
  TrendingUp,
  PackageCheck,
  Check,
  Globe
} from "lucide-react";

// 1. SELLER BENEFITS DATA (Matching Yuukke Frame 00:00)
const SELLER_BENEFITS = [
  {
    num: "01",
    badge: "24/7 CARE",
    title: "Seller Support",
    desc: "A dedicated seller success concierge to assist with catalogue uploads, photography guidelines, order queries, and store growth.",
    icon: Headphones,
    iconColor: "text-rose-700 bg-rose-50 border-rose-200",
  },
  {
    num: "02",
    badge: "HIGH VISIBILITY",
    title: "Reach the Right Buyers",
    desc: "Direct access to over 100,000+ discerning fashion enthusiasts, bridal clients, and gifting connoisseurs across India.",
    icon: Eye,
    iconColor: "text-amber-800 bg-amber-50 border-amber-200",
  },
  {
    num: "03",
    badge: "0% TO START",
    title: "Low Platform Charges",
    desc: "Zero upfront listing fee and transparent competitive commission structure. No hidden subscription charges or setup penalties.",
    icon: TrendingUp,
    iconColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    num: "04",
    badge: "20,000+ PIN CODES",
    title: "Doorstep Express Pickup",
    desc: "Automated air waybills and doorstep courier collection from your boutique or studio with real-time transit insurance.",
    icon: Truck,
    iconColor: "text-blue-700 bg-blue-50 border-blue-200",
  },
  {
    num: "05",
    badge: "7-DAY CYCLE",
    title: "Guaranteed Weekly Settlements",
    desc: "Transparent and automated direct bank deposits every 7 days following successful deliveries, with comprehensive ledgers.",
    icon: CreditCard,
    iconColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
  },
  {
    num: "06",
    badge: "EXCLUSIVE",
    title: "Stylist & Bridal Spotlight",
    desc: "Verified personal stylists feature your apparel, jewellery, and gift hampers in customized bridal consultations and editorial lookbooks.",
    icon: Sparkles,
    iconColor: "text-[#4A1513] bg-rose-50 border-rose-200",
  },
];

// 2. TIMELINE / PROCESS STEPS (Matching Yuukke Frame 00:01)
const PROCESS_STEPS = [
  {
    step: "STEP 01",
    num: "01",
    title: "Register Your Brand",
    desc: "Complete our simple 3-minute application with your brand name, category focus, and studio pickup location.",
    highlight: "Instant 3-Min Form",
    icon: Store,
  },
  {
    step: "STEP 02",
    num: "02",
    title: "Curation & Store Setup",
    desc: "Our curation team reviews your details within 24–48 hours and helps configure your branded luxury storefront.",
    highlight: "24–48h Review",
    icon: ShieldCheck,
  },
  {
    step: "STEP 03",
    num: "03",
    title: "Setup Payment Gateway",
    desc: "Setup your payment gateway with your bank account details to receive automated weekly payouts seamlessly.",
    highlight: "Weekly Direct Payouts",
    icon: CreditCard,
  },
  {
    step: "STEP 04",
    num: "04",
    title: "Add Products & Go Live",
    desc: "Upload high-resolution photos of your sarees, dresses, beauty products, or gift hampers. Start receiving orders immediately!",
    highlight: "Live Orders & Express Pickup",
    icon: PackageCheck,
  },
];

// 3. PRICING & PLANS (Matching Yuukke Frame 00:02)
const PRICING_PLANS = [
  {
    id: "basic",
    name: "Basic Plan",
    badge: "FREE FOREVER",
    badgeStyle: "bg-stone-100 text-stone-700 border-stone-200",
    price: "₹0",
    period: "forever",
    desc: "Ideal for home-based creators, indie artisans & emerging boutique labels.",
    features: [
      "Unlimited product listings",
      "Standard doorstep pickup logistics",
      "Weekly automated bank payouts",
      "Access to seller analytics dashboard",
      "Email support within 24 hours",
    ],
    buttonText: "Start Free",
    buttonStyle: "bg-stone-900 text-white hover:bg-stone-800",
    isPopular: false,
  },
  {
    id: "verified",
    name: "Verified Plan",
    badge: "MOST POPULAR",
    badgeStyle: "bg-amber-400 text-stone-900 border-amber-300 font-bold",
    price: "₹2,499",
    period: "/ year",
    desc: "For boutique studios, fashion designers & established labels seeking premium discovery.",
    features: [
      "Everything in Basic Plan",
      "Verified Blue Brand Badge on store & products",
      "Priority search & category placement",
      "Personal stylist lookbook feature",
      "Dedicated WhatsApp seller concierge",
      "Eligibility for corporate & bulk gifting orders",
    ],
    buttonText: "Apply For Verified Plan",
    buttonStyle: "bg-white text-[#4A1513] hover:bg-stone-100 font-bold shadow-md",
    isPopular: true,
  },
  {
    id: "premium",
    name: "Premium Plan",
    badge: "BEST VALUE",
    badgeStyle: "bg-stone-100 text-stone-700 border-stone-200",
    price: "₹4,999",
    period: "/ year",
    desc: "For flagship designer boutiques, couture houses & premier luxury brands.",
    features: [
      "Everything in Verified Plan",
      "Dedicated senior account executive",
      "Homepage editorial banner feature",
      "Direct bridal consultation integration",
      "Assisted product photography guidance",
      "0% platform commission on first 50 orders",
    ],
    buttonText: "Join Premium Tier",
    buttonStyle: "bg-[#4A1513] text-white hover:bg-[#380E0C]",
    isPopular: false,
  },
];

// 4. CATEGORY SELECTION OPTIONS
const CATEGORY_CHOICES = [
  { id: "Sarees & Handlooms", label: "Sarees & Handlooms", icon: "🥻", desc: "Kanchipuram, Banarasi, Chanderi, Organza & Festive silks" },
  { id: "Kurtas & Indo-Western", label: "Kurtas & Indo-Western", icon: "✨", desc: "Anarkalis, straight sets, shararas, drapes & co-ords" },
  { id: "Bridal & Lehengas", label: "Bridal & Party Lehengas", icon: "👑", desc: "Heritage bridal couture, reception & sangeet lehengas" },
  { id: "Western & Contemporary", label: "Western Wear & Dresses", icon: "👗", desc: "Maxi dresses, evening gowns, shirts & linen sets" },
  { id: "Clean Beauty & Skincare", label: "Clean Beauty & Skincare", icon: "💄", desc: "Artisanal soaps, botanical serums, hair oils & clean makeup" },
  { id: "Jewellery & Potlis", label: "Jewellery & Accessories", icon: "💍", desc: "Temple jewelry, Kundan, silver chokers & embroidered bags" },
  { id: "Curated Gift Hampers", label: "Curated Gift Hampers", icon: "🎁", desc: "Festive hampers, wedding favors, baby shower & gourmet boxes" },
  { id: "Personalised & Crafts", label: "Personalised & Artisanal Gifts", icon: "🌸", desc: "Handcrafted keepsakes, custom mugs, art frames & scented candles" },
  { id: "Boutique & Tailoring", label: "Boutique & Custom Tailoring", icon: "✂️", desc: "Made-to-measure bridal blouses, custom embroidery & stitching" },
];

// 5. FREQUENTLY ASKED QUESTIONS (Matching Yuukke Frame 00:03)
const FAQS = [
  {
    q: "What can I sell on Femazon Marketplace?",
    a: "You can sell women's ethnic wear (sarees, lehengas, kurta sets), western and contemporary dresses, clean botanical beauty and skincare, handcrafted jewellery, celebratory gift hampers, fresh flowers, and personalised artisanal gifts. We also welcome boutique tailoring and bridal trousseau specialists.",
  },
  {
    q: "How long does seller approval take?",
    a: "Our seller curation team reviews every application within 24 to 48 business hours. Once verified, you will receive an onboarding call/message to upload your catalogue and go live immediately.",
  },
  {
    q: "Do I need a GST number to sell on Femazon?",
    a: "Not necessarily! If you are a homepreneur, independent artisan, or small maker whose annual turnover is below the statutory threshold of ₹40 Lakhs (or ₹20 Lakhs for services), you can register under the exempted category. Registered business entities can provide their GSTIN.",
  },
  {
    q: "How does doorstep pickup work across India?",
    a: "Our integrated logistics network covers 20,000+ PIN codes across India. When an order is received, our courier partner arrives directly at your studio, boutique, or workshop with automated air waybills to collect the packed item.",
  },
  {
    q: "How and when do I receive payouts?",
    a: "Payouts are settled directly to your registered bank account on a predictable 7-day cycle following order delivery. You receive a complete digital ledger on your dashboard showing orders, fees, and net payouts.",
  },
  {
    q: "Can personal stylists help promote my collections?",
    a: "Yes! Femazon connects vetted stylists and bridal consultants directly with boutique collections, featuring partner creations in bridal capsules, lookbooks, and customized client styling consultations.",
  },
];

export default function SellerRegistrationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("verified");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  // First FAQ open by default like Yuukke frame 00:03
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Form State
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    businessType: "Independent Boutique",
    businessCategory: "Sarees & Handlooms",
    description: "",
    address: "",
    city: "Chennai",
    pincode: "",
    hasGst: "no",
    gstNumber: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankIfsc: "",
    portfolioUrl: "",
  });

  const scrollToRegistration = (planId?: string) => {
    if (planId) setSelectedPlan(planId);
    const formElem = document.getElementById("seller-registration-form");
    if (formElem) {
      formElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const validateStep = (step: number) => {
    setError("");
    if (step === 1) {
      if (!formData.businessName.trim()) {
        setError("Please enter your brand or business name.");
        return false;
      }
      if (!formData.ownerName.trim()) {
        setError("Please enter the founder or owner's name.");
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes("@")) {
        setError("Please provide a valid contact email.");
        return false;
      }
      const digits = formData.phone.replace(/\D/g, "");
      if (digits.length < 10) {
        setError("Please enter a valid 10-digit mobile number.");
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!formData.businessCategory) {
        setError("Please select a primary category for your brand.");
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!formData.address.trim()) {
        setError("Please provide your workshop, boutique, or studio address for doorstep pickup.");
        return false;
      }
      if (!formData.city.trim()) {
        setError("Please enter your city.");
        return false;
      }
      if (!formData.pincode.trim() || formData.pincode.length < 6) {
        setError("Please enter a valid 6-digit PIN code.");
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setError("");
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);
    setError("");

    try {
      const payload = {
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        businessCategory: formData.businessCategory,
        description: `Plan: ${selectedPlan.toUpperCase()} | ${formData.description}`,
        gstNumber: formData.hasGst === "yes" ? formData.gstNumber : "",
        businessType: formData.businessType,
        city: formData.city,
        pincode: formData.pincode,
        portfolioUrl: formData.portfolioUrl,
        bankAccountName: formData.bankAccountName,
        bankAccountNumber: formData.bankAccountNumber,
        bankIfsc: formData.bankIfsc,
      };

      const res = await fetch("/api/seller/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Unable to submit your registration. Please check your details.");
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[#FAF7F5] py-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-stone-200 text-center">
          <div className="w-20 h-20 bg-rose-50 text-[#4A1513] rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-200/60 shadow-2xs">
            <CheckCircle2 size={44} className="stroke-[1.75]" />
          </div>
          
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A1513] bg-[#FAF7F5] px-3.5 py-1 rounded-full border border-[#4A1513]/15">
            Application Received
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-4 mb-3 font-semibold">
            Welcome to Femazon
          </h1>

          <p className="text-stone-600 text-sm leading-relaxed mb-6">
            Thank you, <strong className="text-stone-900">{formData.ownerName}</strong>! Your application to register <strong className="text-stone-900">{formData.businessName}</strong> under the <strong className="text-[#4A1513] uppercase">{selectedPlan} Plan</strong> has been submitted.
          </p>

          <div className="bg-[#FAF7F5] border border-stone-200/80 rounded-2xl p-5 mb-8 text-left space-y-3 text-xs sm:text-[13px] text-stone-700">
            <div className="flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-[#4A1513] shrink-0 mt-0.5" />
              <span><strong>Status:</strong> Pending Curation Review</span>
            </div>
            <div className="flex items-start gap-2.5">
              <HeartHandshake size={18} className="text-[#4A1513] shrink-0 mt-0.5" />
              <span><strong>Next Step:</strong> Our seller onboarding manager will reach out to you via WhatsApp / Phone at <strong>{formData.phone}</strong> within 24 to 48 hours to complete your catalogue upload.</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-[#4A1513] text-white font-medium text-xs uppercase tracking-widest py-3.5 rounded-full hover:bg-[#380E0C] transition shadow-xs cursor-pointer"
            >
              Explore Femazon
            </button>
            <Link
              href="/womens-wear"
              className="flex-1 bg-white border border-stone-300 text-stone-800 font-medium text-xs uppercase tracking-widest py-3.5 rounded-full hover:bg-stone-50 transition text-center"
            >
              Discover Boutiques
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F5] text-stone-900 antialiased selection:bg-[#4A1513] selection:text-white">
      
      {/* 1. TOP HERO SECTION (Adapted to Femazon luxury) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#4A1513] via-[#380E0C] to-[#4A1513] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FAF7F5_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-white text-[11px] font-semibold tracking-widest uppercase mb-5">
            <Sparkles size={13} className="text-amber-300" />
            <span>Empowering Women-Led Labels &amp; Boutiques</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight mb-4">
            Sell with Femazon
          </h1>

          <p className="max-w-2xl mx-auto text-stone-200 text-sm sm:text-base leading-relaxed mb-8">
            India&apos;s premier luxury lifestyle marketplace connecting independent boutiques, designers, clean beauty makers, and artisanal gift creators with thousands of discerning shoppers nationwide.
          </p>

          <button
            onClick={() => scrollToRegistration()}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#4A1513] hover:bg-stone-100 text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer group"
          >
            <span>Become a Seller</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 2. SELLER BENEFITS SECTION (Exact Concept from Yuukke Frame 00:00) */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-2">
            Seller Benefits
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 uppercase">
            Why Sell With Us
          </h2>
          <div className="w-16 h-1 bg-[#4A1513] mx-auto mt-4 mb-3 rounded-full" />
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto">
            Everything you need to launch, grow, and thrive — built into one powerful luxury marketplace.
          </p>
        </div>

        {/* Benefits Grid (Matching Yuukke Cards with top badges and numbered IDs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SELLER_BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div 
                key={b.num} 
                className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${b.iconColor} transition-transform group-hover:scale-105`}>
                      <Icon size={26} strokeWidth={1.75} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-50 text-[#4A1513] border border-rose-200/60">
                        {b.badge}
                      </span>
                      <span className="font-mono text-xs font-bold text-stone-300">
                        {b.num}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-2.5">
                    {b.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. HOW IT WORKS / HORIZONTAL CLASSY PROGRESSION */}
      <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-stone-200/80 relative overflow-hidden">
        {/* Subtle Luxury Gradient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4A1513]/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4AF37]/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F5] border border-stone-200/80 mb-3.5 shadow-2xs">
              <Sparkles size={13} className="text-[#D4AF37]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513]">
                How It Works
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
              Four Simple Steps to Start Selling
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#4A1513] to-transparent mx-auto mt-4 mb-4" />
            <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
              From instant registration to weekly direct payouts, our seamless process supports your boutique at every milestone.
            </p>
          </div>

          {/* Horizontal Stepper Grid */}
          <div className="relative">
            {/* Desktop Horizontal Connecting Line */}
            <div 
              className="hidden lg:block absolute top-[52px] left-[12%] right-[12%] h-[2px] -z-0 bg-gradient-to-r from-[#4A1513]/15 via-[#D4AF37]/40 to-[#4A1513]/15" 
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 relative z-10">
              {PROCESS_STEPS.map((s, idx) => {
                const Icon = s.icon;
                const isLast = idx === PROCESS_STEPS.length - 1;

                return (
                  <div
                    key={s.step}
                    className="group relative flex flex-col justify-between bg-[#FAF7F5] hover:bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 hover:border-[#4A1513]/30 shadow-[0_4px_20px_rgba(74,21,19,0.02)] hover:shadow-[0_16px_36px_rgba(74,21,19,0.08)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                  >
                    {/* Top Accent Gradient on Hover */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4A1513] via-[#D4AF37] to-[#4A1513] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Faint Watermark Step Numeral */}
                    <span 
                      className="absolute right-4 top-3 font-serif text-6xl font-bold text-stone-900/[0.04] group-hover:text-[#4A1513]/[0.08] transition-colors select-none pointer-events-none"
                      aria-hidden="true"
                    >
                      {s.num}
                    </span>

                    <div>
                      {/* Top Step Icon Node & Step Pill */}
                      <div className="flex items-center justify-between mb-6">
                        {/* Elegant Icon Badge */}
                        <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-center text-[#4A1513] group-hover:bg-[#4A1513] group-hover:text-white group-hover:border-[#4A1513] group-hover:shadow-md transition-all duration-300 shrink-0">
                          <Icon size={24} className="stroke-[1.8]" />
                        </div>

                        {/* Step Pill */}
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4A1513] bg-white px-2.5 py-1 rounded-full border border-stone-200/90 shadow-2xs font-mono">
                          {s.step}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-[#4A1513] transition-colors mb-2.5 leading-snug">
                        {s.title}
                      </h3>

                      <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed font-normal">
                        {s.desc}
                      </p>
                    </div>

                    {/* Bottom Micro Highlight Tag */}
                    <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center justify-between">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#D4AF37] group-hover:text-[#4A1513] transition-colors">
                        {s.highlight || "Step Milestone"}
                      </span>
                      {!isLast && (
                        <div className="hidden lg:flex items-center text-stone-300 group-hover:text-[#4A1513] transition-colors">
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Trust Assurance Strip */}
          <div className="mt-14 pt-8 border-t border-stone-100 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Zero Upfront Onboarding Fee
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              24–48 Hour Application Approval
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Automated 7-Day Bank Payouts
            </span>
          </div>
        </div>
      </section>

      {/* 4. PRICING & PLANS SECTION (Exact Concept from Yuukke Frame 00:02) */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-2">
            Choose Your Plan
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 uppercase">
            Pricing &amp; Plans
          </h2>
          <div className="w-16 h-1 bg-[#4A1513] mx-auto mt-4 mb-3 rounded-full" />
          <p className="text-base font-semibold text-stone-900">
            Grow Your Business
          </p>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            By Unlocking this Opportunity — Stand Out Among Sellers &amp; Apply For Your Badge Today!
          </p>
        </div>

        {/* 3 Pricing Cards (Center card highlighted in solid Royal Maroon like Yuukke) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const isCenter = plan.isPopular;

            return (
              <div 
                key={plan.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  isCenter 
                    ? "bg-[#4A1513] text-white shadow-xl lg:-translate-y-2 border-2 border-[#380E0C]" 
                    : "bg-white text-stone-900 border border-stone-200 shadow-2xs hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${plan.badgeStyle}`}>
                      {plan.badge}
                    </span>
                    {isCenter && (
                      <span className="text-xs text-amber-200 font-serif italic">Curated Choice</span>
                    )}
                  </div>

                  <h3 className={`font-serif text-2xl font-bold mb-2 ${isCenter ? "text-white" : "text-stone-900"}`}>
                    {plan.name}
                  </h3>

                  <p className={`text-xs sm:text-[13px] mb-6 leading-relaxed ${isCenter ? "text-stone-200" : "text-stone-500"}`}>
                    {plan.desc}
                  </p>

                  <div className="flex items-baseline gap-1.5 mb-8 pb-6 border-b border-stone-200/20">
                    <span className={`font-serif text-4xl sm:text-5xl font-bold ${isCenter ? "text-amber-200" : "text-stone-900"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-xs ${isCenter ? "text-stone-300" : "text-stone-500"}`}>
                      {plan.period}
                    </span>
                  </div>

                  {/* Feature List */}
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-[13px]">
                        <Check 
                          size={16} 
                          className={`shrink-0 mt-0.5 ${isCenter ? "text-amber-300" : "text-[#4A1513]"}`} 
                        />
                        <span className={isCenter ? "text-stone-100" : "text-stone-700"}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => scrollToRegistration(plan.id)}
                  className={`w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition cursor-pointer text-center ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. INTERACTIVE REGISTRATION FORM SECTION */}
      <section id="seller-registration-form" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto scroll-mt-20">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10">
          
          {/* Stepper Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A1513]">Step {currentStep} of 4</span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                  {currentStep === 1 && "Brand & Founder Identity"}
                  {currentStep === 2 && "Product Category & Specialization"}
                  {currentStep === 3 && "Location & Pickup Logistics"}
                  {currentStep === 4 && "Banking & Verification Details"}
                </h3>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-600 font-medium bg-rose-50 border border-rose-200/60 px-3 py-1.5 rounded-full">
                <ShieldCheck size={16} className="text-[#4A1513]" />
                <span>Selected: <strong className="uppercase text-[#4A1513]">{selectedPlan} Plan</strong></span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[1, 2, 3, 4].map((step) => (
                <div 
                  key={step} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentStep >= step ? "bg-[#4A1513]" : "bg-stone-200"
                  }`} 
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* STEP 1: Brand & Founder Identity */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                      <Store size={14} className="text-[#4A1513]" /> Brand / Business Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="e.g. Malar Silks & Couture"
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4A1513] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                      <User size={14} className="text-[#4A1513]" /> Founder / Owner Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="e.g. Ananya Raman"
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4A1513] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                      <Mail size={14} className="text-[#4A1513]" /> Business Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@yourbrand.com"
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4A1513] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                      <Phone size={14} className="text-[#4A1513]" /> WhatsApp / Mobile Number *
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9840012345"
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4A1513] transition"
                    />
                    <p className="text-[11px] text-stone-400">Used for courier pickup coordination &amp; onboarding.</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <Building size={14} className="text-[#4A1513]" /> Business Type *
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#4A1513] transition"
                  >
                    <option value="Independent Boutique">Independent Boutique Studio</option>
                    <option value="Fashion Designer / Label">Fashion Designer &amp; Label</option>
                    <option value="Home-based Creator / Artisan">Home-based Creator / Artisan</option>
                    <option value="Clean Beauty & Skincare Maker">Clean Beauty &amp; Skincare Brand</option>
                    <option value="Gift Hamper Specialist">Curated Gift &amp; Hamper Studio</option>
                    <option value="Custom Tailor & Master Craftsman">Custom Tailoring &amp; Embroidery Unit</option>
                    <option value="Registered Private Limited / LLP">Registered Private Limited / LLP</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2: Category & Specialization */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-2">
                    Primary Category * (Select your core specialty)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {CATEGORY_CHOICES.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => setFormData({ ...formData, businessCategory: cat.id })}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                          formData.businessCategory === cat.id
                            ? "border-[#4A1513] bg-rose-50/50 shadow-2xs"
                            : "border-stone-200 hover:border-stone-300 bg-white"
                        }`}
                      >
                        <div className="text-xl mb-1">{cat.icon}</div>
                        <div className="font-semibold text-xs text-stone-900">{cat.label}</div>
                        <div className="text-[11px] text-stone-500 mt-1 leading-snug line-clamp-2">{cat.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <FileText size={14} className="text-[#4A1513]" /> Brand Story &amp; Craftsmanship
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell us what makes your creations special (fabrics used, handloom weaves, organic formulations, etc.)..."
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4A1513] transition resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <Globe size={14} className="text-[#4A1513]" /> Instagram / Portfolio / Website Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="e.g. @yourbrandname or https://instagram.com/yourbrand"
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4A1513] transition"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Location & Pickup Logistics */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                  <Truck size={18} className="shrink-0 mt-0.5 text-amber-800" />
                  <span>
                    <strong>Doorstep Pickup Address:</strong> This is where our courier associates will arrive with order labels to pick up your packages.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#4A1513]" /> Pickup / Studio Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Door No, Street Name, Landmark, Area"
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4A1513] transition resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">City / District *</label>
                    <input
                      required
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Chennai"
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4A1513] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">6-Digit PIN Code *</label>
                    <input
                      required
                      type="text"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "") })}
                      placeholder="e.g. 600028"
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4A1513] transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Banking & Verification Details */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-700 block">
                    GST Registration Status *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition ${
                      formData.hasGst === "no" ? "border-[#4A1513] bg-rose-50/40 text-[#4A1513] font-medium" : "border-stone-200 text-stone-700"
                    }`}>
                      <input
                        type="radio"
                        name="hasGst"
                        value="no"
                        checked={formData.hasGst === "no"}
                        onChange={() => setFormData({ ...formData, hasGst: "no", gstNumber: "" })}
                        className="accent-[#4A1513]"
                      />
                      <div className="text-xs">
                        <span className="font-semibold block text-stone-900">Homepreneur / Artisan</span>
                        <span className="text-[11px] text-stone-500">Turnover under ₹40L (GST Exempt)</span>
                      </div>
                    </label>

                    <label className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition ${
                      formData.hasGst === "yes" ? "border-[#4A1513] bg-rose-50/40 text-[#4A1513] font-medium" : "border-stone-200 text-stone-700"
                    }`}>
                      <input
                        type="radio"
                        name="hasGst"
                        value="yes"
                        checked={formData.hasGst === "yes"}
                        onChange={() => setFormData({ ...formData, hasGst: "yes" })}
                        className="accent-[#4A1513]"
                      />
                      <div className="text-xs">
                        <span className="font-semibold block text-stone-900">Registered Business</span>
                        <span className="text-[11px] text-stone-500">I have an active GSTIN</span>
                      </div>
                    </label>
                  </div>
                </div>

                {formData.hasGst === "yes" && (
                  <div className="space-y-1.5 animate-in fade-in duration-150">
                    <label className="text-xs font-semibold text-stone-700">GSTIN Number *</label>
                    <input
                      type="text"
                      maxLength={15}
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                      placeholder="e.g. 33AAAAA0000A1Z5"
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm font-mono outline-none focus:border-[#4A1513] uppercase transition"
                    />
                  </div>
                )}

                <div className="pt-2 border-t border-stone-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <CreditCard size={15} className="text-[#4A1513]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      Bank Account for Weekly Direct Settlements (Step 03)
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">Account Holder Name</label>
                    <input
                      type="text"
                      value={formData.bankAccountName}
                      onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                      placeholder="Name as printed in bank record"
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#4A1513] transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700">Bank Account Number</label>
                      <input
                        type="text"
                        value={formData.bankAccountNumber}
                        onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value.trim() })}
                        placeholder="Account number"
                        className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm font-mono outline-none focus:border-[#4A1513] transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700">IFSC Code</label>
                      <input
                        type="text"
                        maxLength={11}
                        value={formData.bankIfsc}
                        onChange={(e) => setFormData({ ...formData, bankIfsc: e.target.value.toUpperCase().trim() })}
                        placeholder="e.g. HDFC0001234"
                        className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm font-mono uppercase outline-none focus:border-[#4A1513] transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-stone-200">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold tracking-wider uppercase transition cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#4A1513] hover:bg-[#380E0C] text-white text-xs font-bold tracking-widest uppercase transition shadow-xs cursor-pointer"
                >
                  Continue <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#4A1513] hover:bg-[#380E0C] text-white text-xs font-bold tracking-widest uppercase transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Submitting Application..." : "Submit Seller Registration"}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS (Exact Concept from Yuukke Frame 00:03) */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-2">
            Questions &amp; Answers
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 uppercase">
            Frequently Asked
          </h2>
          <div className="w-16 h-1 bg-[#4A1513] mx-auto mt-4 mb-3 rounded-full" />
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Everything you need to know before registering as a Femazon seller.
          </p>
        </div>

        {/* Yuukke-style Accordion with Red Circle +/- Toggle Icon */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            const itemNum = `0${idx + 1}`;

            return (
              <div 
                key={idx} 
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen ? "border-[#4A1513] shadow-xs" : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer group gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#4A1513]">
                      {itemNum}
                    </span>
                    <span className={`text-sm sm:text-base font-semibold transition ${
                      isOpen ? "text-[#4A1513]" : "text-stone-900 group-hover:text-[#4A1513]"
                    }`}>
                      {faq.q}
                    </span>
                  </div>

                  {/* Circular Red Toggle Icon (Matching Yuukke +/- round badge) */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                    isOpen 
                      ? "bg-[#4A1513] text-white rotate-90" 
                      : "bg-rose-50 text-[#4A1513] group-hover:bg-[#4A1513] group-hover:text-white"
                  }`}>
                    {isOpen ? <X size={15} strokeWidth={2.5} /> : <Plus size={15} strokeWidth={2.5} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-[13px] text-stone-600 leading-relaxed border-t border-stone-100 animate-in fade-in duration-200">
                    <p className="pl-6">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. ACCEPTING PAYMENT METHODS STRIP (Matching Yuukke Frame 00:05) */}
      <section className="bg-stone-900 text-stone-300 py-12 px-4 sm:px-6 border-t border-stone-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-1">
              Accepting Payment Methods
            </h4>
            <p className="text-[12px] text-stone-400">
              Direct weekly payouts supported via all major Indian banking networks.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="px-3.5 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-xs font-bold font-mono text-amber-200">
              UPI
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-xs font-bold font-mono text-blue-300">
              VISA
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-xs font-bold font-mono text-rose-300">
              MasterCard
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-xs font-bold font-mono text-cyan-300">
              American Express
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-xs font-bold font-mono text-emerald-300">
              RuPay
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-xs font-bold font-mono text-purple-300">
              Net Banking
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
