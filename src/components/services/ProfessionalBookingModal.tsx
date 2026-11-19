"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  User,
  Phone,
  FileText
} from "lucide-react";
import { BeautyProfessional, ServicePackage } from "@/data/professionalsData";
import { useFemazonStore } from "@/context/FemazonStoreContext";

interface ProfessionalBookingModalProps {
  professional: BeautyProfessional;
  initialPackage?: ServicePackage;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfessionalBookingModal({
  professional,
  initialPackage,
  isOpen,
  onClose,
}: ProfessionalBookingModalProps) {
  const { addBooking, user } = useFemazonStore();

  const [selectedPackage, setSelectedPackage] = useState<ServicePackage>(
    initialPackage || professional.packages[0]
  );

  // Generate next 10 dates
  const today = new Date();
  const dateOptions = Array.from({ length: 10 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().split("T")[0];
    const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-IN", { weekday: "short" });
    const formatted = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    return { iso, dayName, formatted };
  });

  const [selectedDate, setSelectedDate] = useState(dateOptions[0].iso);
  const [selectedSlot, setSelectedSlot] = useState(professional.availableSlots[0] || "10:00 AM");
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [serviceLocation, setServiceLocation] = useState(professional.city || "Chennai");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingId = `BKG-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBookingData = {
      serviceName: `${professional.name} — ${selectedPackage.name}`,
      providerName: professional.name,
      providerImage: professional.profileImage,
      customerName: customerName || "Customer",
      customerPhone: customerPhone || "9876543210",
      date: selectedDate,
      time: selectedSlot,
      location: serviceLocation,
      notes: notes || undefined,
      total: selectedPackage.price,
      status: "CONFIRMED" as const,
      serviceImage: professional.coverImage || professional.profileImage,
      createdAt: new Date().toISOString(),
    };

    // 1. Add to Femazon Global Client Store (persisted to LocalStorage)
    addBooking(newBookingData);

    // 2. Attempt optional server sync if logged in
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: professional.id,
          date: selectedDate,
          time: selectedSlot,
          location: serviceLocation,
          customerName,
          customerPhone,
          notes,
          total: selectedPackage.price,
          status: "CONFIRMED",
        }),
      }).catch(() => {});
    } catch {}

    setConfirmedBookingId(bookingId);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleModalClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#4A1513] to-[#2B1311] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] shrink-0 bg-stone-100">
              <img
                src={professional.profileImage}
                alt={professional.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide">
                  {professional.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37]/25 text-[#F5E6B3] border border-[#D4AF37]/40 uppercase">
                  <ShieldCheck size={11} /> Verified Pro
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                {professional.speciality} • {professional.location}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleModalClose}
            className="p-2 text-stone-300 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 size={36} />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full mb-2">
                Appointment Confirmed
              </span>
              <h4 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                Your Booking is Scheduled!
              </h4>
              <p className="text-sm text-stone-600 max-w-md mx-auto mb-6">
                Thank you! <strong>{professional.name}</strong> has received your booking for <strong>{selectedPackage.name}</strong> on <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong>.
              </p>

              <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-stone-200/80 w-full max-w-md text-left mb-6 text-xs text-stone-700 space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-sans">Booking ID:</span>
                  <span className="font-bold text-[#4A1513]">{confirmedBookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-sans">Package:</span>
                  <span className="font-medium text-stone-900">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-sans">Date &amp; Slot:</span>
                  <span className="font-medium text-stone-900">{selectedDate} ({selectedSlot})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-sans">Amount to Pay:</span>
                  <span className="font-bold text-base text-[#4A1513]">₹{selectedPackage.price.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/bookings"
                  onClick={handleModalClose}
                  className="px-6 py-3 rounded-xl bg-[#4A1513] hover:bg-[#380E0C] text-white font-bold text-xs uppercase tracking-wider transition shadow-sm"
                >
                  View in My Bookings
                </Link>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-5 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-medium text-xs transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Select Package */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A1513] mb-2.5">
                  1. Select Service Package
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {professional.packages.map((pkg) => {
                    const isSelected = selectedPackage.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-[#4A1513] bg-[#FAF7F5] shadow-sm"
                            : "border-stone-200 hover:border-stone-300 bg-white"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <h5 className="font-serif text-sm font-bold text-stone-900">
                              {pkg.name}
                            </h5>
                            {pkg.isPopular && (
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 line-clamp-2 mb-2 leading-relaxed">
                            {pkg.description}
                          </p>
                        </div>
                        <div className="flex items-baseline justify-between pt-2 border-t border-stone-100">
                          <span className="text-[10px] text-stone-400 font-medium">
                            ⏱ {pkg.duration}
                          </span>
                          <span className="font-serif text-base font-bold text-[#4A1513]">
                            ₹{pkg.price.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Package Inclusions Preview */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70">
                <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-2">
                  ✨ What&apos;s Included in {selectedPackage.name}:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {selectedPackage.inclusions.map((inc, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-xs text-stone-600">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. Select Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A1513] mb-2">
                  2. Choose Appointment Date
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {dateOptions.map((opt) => {
                    const isSelected = selectedDate === opt.iso;
                    return (
                      <button
                        key={opt.iso}
                        type="button"
                        onClick={() => setSelectedDate(opt.iso)}
                        className={`flex flex-col items-center justify-center min-w-[76px] py-2.5 px-2 rounded-xl border transition cursor-pointer shrink-0 ${
                          isSelected
                            ? "bg-[#4A1513] text-white border-[#4A1513] shadow-xs"
                            : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? "text-[#D4AF37]" : "text-stone-400"}`}>
                          {opt.dayName}
                        </span>
                        <span className="text-xs font-semibold mt-0.5">
                          {opt.formatted}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Select Available Slot */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A1513] mb-2">
                  3. Select Available Time Slot
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {professional.availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition cursor-pointer text-center ${
                          isSelected
                            ? "bg-[#4A1513] text-white border-[#4A1513] shadow-xs"
                            : "bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-3 text-stone-400" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Service Address / Venue Location *
                  </label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={serviceLocation}
                      onChange={(e) => setServiceLocation(e.target.value)}
                      placeholder="e.g. Door 14, 2nd Main Road, T. Nagar, Chennai"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Special Notes / Event Details (Optional)
                  </label>
                  <div className="relative">
                    <FileText size={14} className="absolute left-3 top-3 text-stone-400" />
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Morning Muhurtham saree drape with Kanjeevaram silk, need artist by 6:00 AM."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#4A1513] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Strip */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest block">
                    Total Amount
                  </span>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#4A1513]">
                    ₹{selectedPackage.price.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-xl bg-[#4A1513] hover:bg-[#380E0C] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Securing Slot...</span>
                  ) : (
                    <>
                      <span>Confirm &amp; Book Appointment</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
