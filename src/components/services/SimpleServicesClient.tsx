"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  PhoneCall, 
  ArrowRight, 
  X, 
  HeartHandshake, 
  AlertCircle,
  HelpCircle,
  Info
} from "lucide-react";
import { useFemazonStore, BookingItem } from "@/context/FemazonStoreContext";

interface ManagedService {
  id: number;
  slug: string;
  name: string;
  tamilTitle?: string;
  description: string;
  basePrice: number;
  image: string;
  tag: string;
  whatIncluded: string[];
}

const MANAGED_SERVICES: ManagedService[] = [
  {
    id: 1,
    slug: "mehndi",
    name: "Mehendi (Henna Art)",
    tamilTitle: "மெஹந்தி சேவை",
    description: "Traditional and bridal henna art created for family celebrations, festivals, and weddings. Our verified artist visits your home with natural, high-stain henna cones.",
    basePrice: 2000,
    image: "https://images.unsplash.com/photo-1598305015383-7d727b11c97a?q=80&w=800&auto=format&fit=crop",
    tag: "Most Popular for Festivals",
    whatIncluded: ["Natural organic henna cones", "Both hands front & back designs", "Doorstep home visit", "Aftercare tips for dark stain"]
  },
  {
    id: 2,
    slug: "makeup",
    name: "Makeup & Beauty",
    tamilTitle: "அலங்காரம் & மேக்கப்",
    description: "Elegant party and bridal makeup for family events, weddings, and special milestones. Femazon arranges trusted beauty professionals at your doorstep.",
    basePrice: 3500,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop",
    tag: "Flawless & Long Lasting",
    whatIncluded: ["HD makeup foundation & contour", "Subtle eye makeup & lashes", "Skin prep & primer", "Touch-up kit guidance"]
  },
  {
    id: 3,
    slug: "hair-styling",
    name: "Hair Styling & Saree Draping",
    tamilTitle: "ஹேர் ஸ்டைலிங் & புடவை கட்டுதல்",
    description: "Comfortable saree draping in any traditional or modern pleat style, along with graceful hairstyles, floral braids, or party blowouts.",
    basePrice: 1500,
    image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop",
    tag: "Quick & Stress-Free",
    whatIncluded: ["Pin-perfect saree draping", "Hair styling (braid / curls / bun)", "Real flower (mallipoo) setting", "Comfort safety pins provided"]
  },
  {
    id: 4,
    slug: "styling",
    name: "Personal Styling & Wardrobe Help",
    tamilTitle: "ஆடை வடிவமைப்பு & ஸ்டைலிங்",
    description: "Friendly personal assistance to match your jewellery, pair matching blouses with sarees, and plan complete family outfits for upcoming events.",
    basePrice: 2500,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
    tag: "Wardrobe Consultation",
    whatIncluded: ["Review existing wardrobe pieces", "Jewellery & accessory matching", "Color palette recommendations", "Custom styling lookbook"]
  },
  {
    id: 5,
    slug: "event-planning",
    name: "Celebration & Function Planning",
    tamilTitle: "குடும்ப விழா ஒருங்கிணைப்பு",
    description: "Complete, peaceful coordination for housewarmings, birthdays, baby showers, and family gatherings. We handle decor and setup with care.",
    basePrice: 5000,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop",
    tag: "End-to-End Coordination",
    whatIncluded: ["Initial consultation & budget plan", "Stage & home flower decor help", "On-day timeline coordination", "Vendor supervision"]
  },
  {
    id: 6,
    slug: "shopping-assistant",
    name: "Personal Shopping Assistant",
    tamilTitle: "ஷாப்பிங் வழிகாட்டி",
    description: "A patient shopping companion to help you navigate bridal markets, choose authentic silk sarees, and select matching materials for the entire family.",
    basePrice: 1200,
    image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=800&auto=format&fit=crop",
    tag: "Stress-Free Shopping",
    whatIncluded: ["Silk & fabric authenticity checks", "Store visits or curated online picks", "Color & size coordination", "Best price guidance"]
  }
];

const TIME_SLOTS = [
  "Morning (09:00 AM - 12:00 PM)",
  "Afternoon (12:00 PM - 03:00 PM)",
  "Evening (03:00 PM - 06:00 PM)",
  "Late Evening (06:00 PM - 09:00 PM)"
];

export function SimpleServicesClient({ dbServices }: { dbServices?: any[] }) {
  const { user, openAuthModal, refreshBookings } = useFemazonStore();

  const servicesList: ManagedService[] = React.useMemo(() => {
    if (!dbServices || dbServices.length === 0) {
      return MANAGED_SERVICES;
    }
    return dbServices.map((dbs, idx) => {
      const match = MANAGED_SERVICES.find(m => m.slug === dbs.slug || m.id === dbs.id);
      return {
        id: dbs.id || match?.id || idx + 1,
        slug: dbs.slug || match?.slug || `service-${idx + 1}`,
        name: dbs.name || match?.name || "Managed Service",
        tamilTitle: match?.tamilTitle,
        description: dbs.description || match?.description || "",
        basePrice: dbs.basePrice || match?.basePrice || 1000,
        image: dbs.image || match?.image || "https://images.unsplash.com/photo-1598305015383-7d727b11c97a?q=80&w=800&auto=format&fit=crop",
        tag: match?.tag || "Femazon Verified",
        whatIncluded: match?.whatIncluded || [
          "Doorstep home visit",
          "Verified specialist",
          "Safe & hygienic kit",
          "Personalized care"
        ]
      };
    });
  }, [dbServices]);

  // Active selected service for booking modal
  const [activeService, setActiveService] = useState<ManagedService | null>(null);

  // Form State
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Chennai");
  const [notes, setNotes] = useState("");
  
  // Modal step & status
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Schedule & Details, 2: Review, 3: Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedBookingId, setConfirmedBookingId] = useState<number | string | null>(null);

  // Quick Open Modal
  const handleOpenBooking = (service: ManagedService) => {
    setActiveService(service);
    setStep(1);
    setErrorMsg(null);
    if (user) {
      if (!customerName) setCustomerName(user.name || "");
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
    }
  };

  const handleCloseModal = () => {
    setActiveService(null);
    setStep(1);
    setErrorMsg(null);
  };

  const handleNextToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      setErrorMsg("Please select your preferred date.");
      return;
    }
    if (!customerName.trim()) {
      setErrorMsg("Please enter your name so our team knows who to ask for.");
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      setErrorMsg("Please provide a valid 10-digit mobile number for confirmation calls.");
      return;
    }
    if (!address.trim()) {
      setErrorMsg("Please provide your home address or location.");
      return;
    }

    setErrorMsg(null);
    setStep(2);
  };

  const handleConfirmBooking = async () => {
    if (!activeService) return;

    if (!user) {
      // Need login first
      openAuthModal('otp');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const fullLocation = `${address.trim()}, ${city.trim()}`;
      const payload = {
        serviceId: activeService.id,
        date: selectedDate,
        time: selectedTime,
        location: fullLocation,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        notes: notes.trim(),
        duration: 1
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit booking request");
      }

      setConfirmedBookingId(data.id || "FMZ-" + Date.now().toString().slice(-4));
      setStep(3);
      await refreshBookings();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred while confirming your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date formatted as YYYY-MM-DD for min date picker
  const tomorrowStr = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#2D2A26] pb-24">
      {/* 1. Header / Discovery Hero */}
      <div className="bg-[#FAF6F0] border-b border-[#E8DFD5] pt-12 pb-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE4D6] text-[#4A1513] text-xs font-bold uppercase tracking-wider mb-4">
            <HeartHandshake size={14} />
            Femazon Managed Services
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#2B1810] font-normal leading-tight mb-4">
            How Can Femazon Help You?
          </h1>
          <p className="text-base sm:text-lg text-[#6B5E55] max-w-2xl mx-auto leading-relaxed">
            Find the right service for your special family moments and everyday needs. Book easily — we’ll help arrange the rest.
          </p>
        </div>
      </div>

      {/* 2. Reassurance Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-2xl border border-[#E8DFD5] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F4ECE1] text-[#4A1513] flex items-center justify-center shrink-0">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h2 className="font-semibold text-[#2B1810] text-base sm:text-lg">
                You book with Femazon. Our team coordinates everything for you.
              </h2>
              <p className="text-xs sm:text-sm text-[#736357] mt-0.5">
                No dealing with unverified freelance workers or random phone calls. Our verified staff visits your doorstep.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
            <Link
              href="/bookings"
              className="w-full md:w-auto text-center text-xs font-bold uppercase tracking-wider bg-[#FAF6F0] hover:bg-[#EFE4D6] text-[#4A1513] border border-[#E0D5C7] px-5 py-3 rounded-full transition"
            >
              Track My Bookings
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Simple Services Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2B1810]">
              Available Services
            </h2>
            <p className="text-sm text-[#736357] mt-1">
              Select any service below to schedule your preferred date and time.
            </p>
          </div>
          <span className="text-xs text-[#8A796D] bg-[#F4ECE1] px-3 py-1.5 rounded-lg w-fit">
            Transparent Pricing • Verified Specialists
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {servicesList.map((srv) => (
            <div 
              key={srv.id}
              className="bg-white rounded-3xl border border-[#E8DFD5] overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
            >
              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                <img 
                  src={srv.image} 
                  alt={srv.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                />
                <div className="absolute top-3 left-3 bg-[#2B1810]/80 backdrop-blur-xs text-white text-[11px] font-medium px-3 py-1 rounded-full">
                  {srv.tag}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <h3 className="font-serif text-xl sm:text-2xl text-[#2B1810] font-normal">
                      {srv.name}
                    </h3>
                  </div>
                  {srv.tamilTitle && (
                    <p className="text-xs font-medium text-[#8C5D39] mb-3">
                      {srv.tamilTitle}
                    </p>
                  )}
                  <p className="text-sm text-[#6B5E55] leading-relaxed mb-5">
                    {srv.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 mb-6 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EFEAE2]">
                    <span className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider block mb-1">
                      Included with Service:
                    </span>
                    {srv.whatIncluded.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#524842]">
                        <CheckCircle2 size={13} className="text-[#3E7B52] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer with Price and Book Button */}
                <div className="pt-4 border-t border-[#F0E8DC] flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A796D] block">
                      Starting From
                    </span>
                    <span className="font-serif text-xl sm:text-2xl font-bold text-[#2B1810]">
                      ₹{srv.basePrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenBooking(srv)}
                    className="inline-flex items-center gap-2 bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-5 py-3 rounded-full transition shadow-xs cursor-pointer active:scale-98"
                  >
                    <span>Book Now</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Trust & Support Help Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-16 text-center">
        <div className="bg-[#FAF6F0] rounded-3xl p-8 border border-[#E8DFD5]">
          <h3 className="font-serif text-2xl text-[#2B1810] mb-2">
            Prefer to talk to someone first?
          </h3>
          <p className="text-sm text-[#6B5E55] max-w-lg mx-auto mb-6">
            If you have questions about custom timing, group family bookings, or special event requirements, our friendly care team is here to assist.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <span className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-[#E0D5C7] text-[#4A1513]">
              <PhoneCall size={14} />
              Call Support: 1800-420-FEMAZON
            </span>
            <span className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-[#E0D5C7] text-[#3E7B52]">
              <CheckCircle2 size={14} />
              No Hidden Charges • Pay after Confirmation
            </span>
          </div>
        </div>
      </div>

      {/* 5. Booking Modal Flow */}
      {activeService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition p-1 cursor-pointer rounded-full"
            >
              <X size={22} />
            </button>

            {/* STEP 1: Details and Date */}
            {step === 1 && (
              <form onSubmit={handleNextToReview} className="space-y-5">
                <div>
                  <span className="text-[11px] font-bold text-[#8C5D39] uppercase tracking-wider block mb-1">
                    Step 1 of 2 • Scheduling
                  </span>
                  <h3 className="font-serif text-2xl text-[#2B1810]">
                    Book {activeService.name}
                  </h3>
                  <p className="text-xs text-[#736357] mt-1">
                    Starting at ₹{activeService.basePrice.toLocaleString("en-IN")}. Femazon arranges everything for your comfort.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-bold text-[#4A1513] uppercase tracking-wider mb-1.5">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    min={tomorrowStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4A1513] text-sm text-[#2B1810]"
                  />
                  <span className="text-[11px] text-[#8A796D] mt-1 block">
                    Please select tomorrow or any upcoming date.
                  </span>
                </div>

                {/* Time Slot */}
                <div>
                  <label className="block text-xs font-bold text-[#4A1513] uppercase tracking-wider mb-1.5">
                    Preferred Time Slot *
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4A1513] text-sm text-[#2B1810] bg-white"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Customer Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4A1513] uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priya Sundaram"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4A1513] text-sm text-[#2B1810]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A1513] uppercase tracking-wider mb-1.5">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4A1513] text-sm text-[#2B1810]"
                    />
                  </div>
                </div>

                {/* Address & City */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#4A1513] uppercase tracking-wider mb-1.5">
                      Service Address / Apartment *
                    </label>
                    <input
                      type="text"
                      placeholder="Flat No, Street, Landmark"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4A1513] text-sm text-[#2B1810]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A1513] uppercase tracking-wider mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4A1513] text-sm text-[#2B1810]"
                    />
                  </div>
                </div>

                {/* Optional Instructions */}
                <div>
                  <label className="block text-xs font-bold text-[#4A1513] uppercase tracking-wider mb-1.5">
                    Special Requests or Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Saree draping for mother and daughter, or specific mehendi style..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4A1513] text-sm text-[#2B1810]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#4A1513] hover:bg-[#350B0A] text-white font-bold text-xs uppercase tracking-wider py-4 rounded-full transition shadow-sm cursor-pointer"
                  >
                    Continue to Review Booking
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Review & Submit */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <span className="text-[11px] font-bold text-[#8C5D39] uppercase tracking-wider block mb-1">
                    Step 2 of 2 • Review & Confirm
                  </span>
                  <h3 className="font-serif text-2xl text-[#2B1810]">
                    Review Your Service Request
                  </h3>
                  <p className="text-xs text-[#736357] mt-1">
                    Please confirm the details below. Our team coordinates the visit directly.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 border border-[#EFEAE2] space-y-3 text-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                    <span className="text-stone-500">Service</span>
                    <span className="font-semibold text-stone-900">{activeService.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                    <span className="text-stone-500">Date</span>
                    <span className="font-semibold text-stone-900">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                    <span className="text-stone-500">Time Window</span>
                    <span className="font-semibold text-stone-900">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                    <span className="text-stone-500">Contact Person</span>
                    <span className="font-semibold text-stone-900">{customerName} ({customerPhone})</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                    <span className="text-stone-500">Address</span>
                    <span className="font-semibold text-stone-900 text-right max-w-[200px] truncate">
                      {address}, {city}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-stone-500 font-medium">Estimated Base Price</span>
                    <span className="font-serif text-xl font-bold text-[#4A1513]">
                      ₹{activeService.basePrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <Info size={16} className="shrink-0 mt-0.5 text-amber-700" />
                  <span>
                    <strong>No advance payment required now:</strong> Femazon reviews your address and timing, assigns an internal supporter, and contacts you to confirm before service day.
                  </span>
                </div>

                {!user && (
                  <div className="p-3 rounded-xl bg-stone-100 text-stone-700 text-xs">
                    Please note: You will be asked to sign in or verify your mobile number when you click confirm.
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3.5 px-6 rounded-full border border-stone-300 text-stone-700 text-xs font-bold uppercase tracking-wider hover:bg-stone-50 transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleConfirmBooking}
                    className="flex-1 bg-[#4A1513] hover:bg-[#350B0A] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-full transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting Request..." : "Confirm & Book Service"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Success Confirmation */}
            {step === 3 && (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 size={32} />
                </div>

                <h3 className="font-serif text-2xl text-[#2B1810]">
                  Booking Request Received!
                </h3>
                <p className="text-sm text-[#6B5E55] max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{customerName}</strong>! Your service request has been placed with Femazon.
                </p>

                <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#EFEAE2] text-xs text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Booking Reference:</span>
                    <span className="font-bold text-[#4A1513]">#{confirmedBookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Service:</span>
                    <span className="font-medium text-stone-800">{activeService.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Scheduled Date:</span>
                    <span className="font-medium text-stone-800">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Current Status:</span>
                    <span className="font-bold text-amber-700 uppercase tracking-wide">
                      Request Received (Under Review)
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs text-left">
                  <strong>What Happens Next?</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-blue-800">
                    <li>Our Femazon operations team verifies specialist availability.</li>
                    <li>We will call or message your phone number ({customerPhone}) to confirm.</li>
                    <li>You can monitor progress at any time under <strong>My Bookings</strong>.</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <Link
                    href="/bookings"
                    onClick={handleCloseModal}
                    className="flex-1 bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-full text-center transition"
                  >
                    View in My Bookings
                  </Link>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="py-3.5 px-6 rounded-full border border-stone-300 text-stone-700 text-xs font-bold uppercase tracking-wider hover:bg-stone-50 transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
