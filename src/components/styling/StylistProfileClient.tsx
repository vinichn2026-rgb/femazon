"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Video,
  X,
} from "lucide-react";
import { useFemazonStore } from "@/context/FemazonStoreContext";
import type { PublicStylist, StylistPackageItem } from "@/lib/stylistTypes";

const TIME_SLOTS = [
  "10:00 AM - 11:00 AM",
  "11:30 AM - 12:30 PM",
  "02:00 PM - 03:00 PM",
  "04:00 PM - 05:00 PM",
  "06:00 PM - 07:00 PM",
];

export function StylistProfileClient({ stylist }: { stylist: PublicStylist }) {
  const { user } = useFemazonStore();
  const [selectedPackage, setSelectedPackage] = useState<StylistPackageItem | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState(TIME_SLOTS[0]);
  const [deliveryMode, setDeliveryMode] = useState("Online");
  const [location, setLocation] = useState(stylist.city);
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE_PAID" | "REQUEST">("REQUEST");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState<{ id: number; status: string; message: string } | null>(null);

  // Review state
  const [reviews, setReviews] = useState(stylist.reviews);
  const [reviewName, setReviewName] = useState(user?.name || "");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isComplaint, setIsComplaint] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState("");

  const openBookingForPackage = (pkg: StylistPackageItem) => {
    setSelectedPackage(pkg);
    setSelectedAddOns([]);
    setDeliveryMode(pkg.deliveryMode === "Offline" ? "In-Person" : "Online");
    setLocation(pkg.location || stylist.city);
    setBookingError("");
    setBookingSuccess(null);
  };

  const bookingTotal = useMemo(() => {
    if (!selectedPackage) return 0;
    const addOnsPrice = selectedPackage.addOns
      .filter((a) => selectedAddOns.includes(a.name))
      .reduce((sum, a) => sum + a.price, 0);
    return selectedPackage.price + addOnsPrice;
  }, [selectedPackage, selectedAddOns]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    setBookingSubmitting(true);
    setBookingError("");
    try {
      const res = await fetch("/api/stylists/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stylistId: stylist.id,
          packageId: selectedPackage.id,
          customerName,
          customerEmail,
          customerPhone,
          bookingDate,
          bookingTime,
          deliveryMode,
          location,
          selectedAddOns,
          notes,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setBookingSuccess({
        id: data.booking.id,
        status: data.booking.status,
        message: data.message,
      });
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Unable to submit booking.");
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewFeedback("");
    try {
      const res = await fetch("/api/stylists/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stylistId: stylist.id,
          customerName: reviewName,
          rating: reviewRating,
          comment: reviewComment,
          isComplaint,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      if (!isComplaint) {
        setReviews((prev) => [
          {
            id: data.review.id,
            customerName: data.review.customerName,
            rating: data.review.rating,
            comment: data.review.comment || "",
            isComplaint: false,
            complaintStatus: "NONE",
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
      setReviewComment("");
      setIsComplaint(false);
      setReviewFeedback(data.message);
    } catch (err) {
      setReviewFeedback(err instanceof Error ? err.message : "Failed to submit feedback.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] pb-24 text-stone-900">
      {/* Top Breadcrumb */}
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-[1300px] items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link
            href="/personal-styling"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-[#4A1513]"
          >
            <ArrowLeft size={14} /> Back to Personal Stylists
          </Link>
          <span className="text-xs text-stone-400">
            /personal-styling/{stylist.slug}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1300px] px-4 pt-8 sm:px-6 lg:px-8 space-y-10">
        {/* 1. PROFILE HEADER CARD */}
        <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <img
              src={stylist.profileImage}
              alt={stylist.fullName}
              className="h-32 w-32 sm:h-40 sm:w-40 rounded-3xl object-cover border border-stone-200 shrink-0 bg-stone-100"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {stylist.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                    <ShieldCheck size={13} /> Verified Stylist
                  </span>
                )}
                {stylist.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                    <Sparkles size={13} /> Featured Stylist
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                    {stylist.fullName}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-stone-600">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#4A1513]" /> {stylist.location}, {stylist.city}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} className="text-[#4A1513]" /> {stylist.experience} Experience
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Video size={14} className="text-[#4A1513]" /> {stylist.consultationModes.join(" & ")}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#FAF7F5] border border-stone-200 px-5 py-3 text-left lg:text-right shrink-0">
                  <div className="flex items-center gap-1.5 lg:justify-end text-sm font-bold text-stone-900">
                    <Star size={15} className="text-amber-500" fill="currentColor" />
                    <span>{reviews.length > 0 ? stylist.rating.toFixed(1) : "New"}</span>
                    <span className="text-xs font-normal text-stone-500">
                      ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-stone-500">Starting from</div>
                  <div className="font-serif text-2xl font-bold text-[#4A1513]">
                    {stylist.startingPrice > 0
                      ? `₹${stylist.startingPrice.toLocaleString("en-IN")}`
                      : "Custom Quote"}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-stone-700">{stylist.bio}</p>

              {stylist.qualifications && (
                <p className="mt-2 text-xs text-stone-500">
                  <strong className="text-stone-700">Qualifications:</strong> {stylist.qualifications}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {stylist.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-[#4A1513]"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-stone-600">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#4A1513]" />
                  <strong>Availability:</strong> {stylist.availabilitySchedule}
                </span>
                {stylist.preferredLocations.length > 0 && (
                  <span>
                    <strong>Preferred Locations:</strong> {stylist.preferredLocations.join(", ")}
                  </span>
                )}
                {stylist.socialLinks.instagram && (
                  <a
                    href={stylist.socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#4A1513] font-semibold hover:underline"
                  >
                    Instagram <ExternalLink size={11} />
                  </a>
                )}
                {stylist.socialLinks.website && (
                  <a
                    href={stylist.socialLinks.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#4A1513] font-semibold hover:underline"
                  >
                    <Globe size={11} /> Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2. PORTFOLIO GALLERY */}
        {stylist.portfolioImages.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">
              Styling Portfolio
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {stylist.portfolioImages.map((img, idx) => (
                <div key={idx} className="aspect-[3/4] overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                  <img
                    src={img}
                    alt={`${stylist.fullName} portfolio ${idx + 1}`}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. SERVICES & PACKAGES */}
        <section id="packages">
          <div className="mb-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4A1513] block">
              Dynamic Packages
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Styling Services &amp; Packages
            </h2>
          </div>

          {stylist.packages.length === 0 ? (
            <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-500">
              This stylist has not published packages yet. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stylist.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex flex-col justify-between rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-xs hover:shadow-lg transition"
                >
                  <div>
                    {pkg.images.length > 0 && (
                      <div className="h-44 w-full overflow-hidden bg-stone-100">
                        <img
                          src={pkg.images[0]}
                          alt={pkg.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="rounded-full bg-rose-50 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#4A1513]">
                          {pkg.packageType}
                        </span>
                        <span className="text-xs font-semibold text-stone-500">
                          {pkg.sessionsCount} {pkg.sessionsCount === 1 ? "Session" : "Sessions"} · {pkg.duration}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-stone-900">{pkg.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-stone-600">{pkg.description}</p>

                      {pkg.includedServices.length > 0 && (
                        <div className="mt-4">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                            What&apos;s Included
                          </div>
                          <ul className="space-y-1.5 text-xs text-stone-700">
                            {pkg.includedServices.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-stone-500">
                        <span>Mode: <strong className="text-stone-700">{pkg.deliveryMode}</strong></span>
                        {pkg.location && <span>Location: <strong className="text-stone-700">{pkg.location}</strong></span>}
                        {pkg.availability && <span>Availability: <strong className="text-stone-700">{pkg.availability}</strong></span>}
                      </div>

                      {pkg.addOns.length > 0 && (
                        <div className="mt-3 rounded-xl bg-stone-50 p-3 text-xs">
                          <span className="font-bold text-stone-700 block mb-1">Optional Add-ons:</span>
                          <div className="flex flex-wrap gap-2">
                            {pkg.addOns.map((addon) => (
                              <span key={addon.name} className="rounded-full bg-white border border-stone-200 px-2.5 py-0.5 text-stone-700">
                                {addon.name} (+₹{addon.price.toLocaleString("en-IN")})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-stone-100 bg-stone-50/70 px-6 py-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        Package Price
                      </span>
                      <span className="font-serif text-2xl font-bold text-[#4A1513]">
                        ₹{pkg.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openBookingForPackage(pkg)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#4A1513] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#38100e] cursor-pointer"
                    >
                      <Calendar size={14} />
                      <span>Book Package</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. CUSTOMER RATINGS & REVIEWS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Client Reviews ({reviews.length})
            </h2>
            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500">
                No reviews yet. Be the first to review {stylist.fullName}!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="rounded-2xl border border-stone-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-stone-900">{rev.customerName}</span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star size={13} fill="currentColor" />
                      <span>{rev.rating}/5</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-stone-600">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleReviewSubmit} className="rounded-3xl border border-stone-200 bg-white p-6 space-y-4 h-fit">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Leave a Review or Feedback
            </h3>
            {reviewFeedback && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800">
                {reviewFeedback}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Your Name *
              </label>
              <input
                required
                type="text"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Rating
              </label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Comment *
              </label>
              <textarea
                required
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your styling experience..."
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isComplaint}
                onChange={(e) => setIsComplaint(e.target.checked)}
                className="accent-[#4A1513]"
              />
              <span>Flag as a complaint for Admin review</span>
            </label>
            <button
              type="submit"
              disabled={reviewSubmitting}
              className="w-full rounded-xl bg-[#4A1513] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#38100e] transition cursor-pointer"
            >
              {reviewSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </section>
      </div>

      {/* BOOKING MODAL */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedPackage(null)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
            >
              <X size={20} />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 size={44} className="mx-auto mb-3 text-emerald-600" />
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Booking #{bookingSuccess.id} {bookingSuccess.status}
                </h3>
                <p className="mt-2 text-sm text-stone-600">{bookingSuccess.message}</p>
                <button
                  type="button"
                  onClick={() => setSelectedPackage(null)}
                  className="mt-6 rounded-full bg-[#4A1513] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A1513]">
                    Book with {stylist.fullName}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">
                    {selectedPackage.title}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {selectedPackage.duration} · {selectedPackage.sessionsCount} session(s)
                  </p>
                </div>

                {bookingError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-800">
                    {bookingError}
                  </div>
                )}

                {selectedPackage.addOns.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                      Add-on Services
                    </label>
                    <div className="space-y-2">
                      {selectedPackage.addOns.map((addon) => {
                        const checked = selectedAddOns.includes(addon.name);
                        return (
                          <label
                            key={addon.name}
                            className="flex items-center justify-between rounded-xl border border-stone-200 px-3 py-2 text-xs cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  setSelectedAddOns((prev) =>
                                    checked ? prev.filter((i) => i !== addon.name) : [...prev, addon.name]
                                  )
                                }
                                className="accent-[#4A1513]"
                              />
                              <span>{addon.name}</span>
                            </span>
                            <span className="font-bold text-[#4A1513]">+₹{addon.price.toLocaleString("en-IN")}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Preferred Date *
                    </label>
                    <input
                      required
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Time Slot *
                    </label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Delivery Mode
                    </label>
                    <select
                      value={deliveryMode}
                      onChange={(e) => setDeliveryMode(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
                    >
                      <option value="Online">Online Video Consultation</option>
                      <option value="In-Person">In-Person Styling</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      City / Address
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    required
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Name *"
                    className="rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
                  />
                  <input
                    required
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Your Email *"
                    className="rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
                  />
                  <input
                    required
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Phone *"
                    className="rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
                  />
                </div>

                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share occasion, style preferences, or wardrobe goals..."
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
                />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Booking &amp; Payment Option
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("REQUEST")}
                      className={`rounded-xl border px-3 py-2 text-xs font-bold cursor-pointer ${
                        paymentMethod === "REQUEST"
                          ? "border-[#4A1513] bg-rose-50 text-[#4A1513]"
                          : "border-stone-200 text-stone-600"
                      }`}
                    >
                      Submit Booking Request
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("ONLINE_PAID")}
                      className={`rounded-xl border px-3 py-2 text-xs font-bold cursor-pointer ${
                        paymentMethod === "ONLINE_PAID"
                          ? "border-[#4A1513] bg-rose-50 text-[#4A1513]"
                          : "border-stone-200 text-stone-600"
                      }`}
                    >
                      Confirm &amp; Pay Now
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-4">
                  <div>
                    <span className="text-xs text-stone-500 block">Total Amount</span>
                    <span className="font-serif text-2xl font-bold text-[#4A1513]">
                      ₹{bookingTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#4A1513] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#38100e] transition cursor-pointer"
                  >
                    {bookingSubmitting && <Loader2 size={14} className="animate-spin" />}
                    <span>{paymentMethod === "ONLINE_PAID" ? "Confirm Booking" : "Send Request"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
