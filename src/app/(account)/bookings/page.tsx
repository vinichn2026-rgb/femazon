"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  UserCircle2, 
  AlertCircle,
  Calendar,
  Sparkles,
  PhoneCall,
  X,
  ShieldCheck,
  RefreshCw,
  HelpCircle
} from "lucide-react";
import { useFemazonStore, BookingItem } from "@/context/FemazonStoreContext";

export default function MyBookingsPage() {
  const { bookings, user, refreshBookings } = useFemazonStore();
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [cancelPrompt, setCancelPrompt] = useState<number | string | null>(null);

  useEffect(() => {
    refreshBookings();
  }, [refreshBookings]);

  // Plain language status badges for homemakers & seniors
  const getStatusBadge = (status: BookingItem['status']) => {
    switch (status) {
      case 'REQUEST_RECEIVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
            <Clock size={13} /> Request Received
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold">
            <RefreshCw size={13} className="animate-spin" /> Our Team is Reviewing
          </span>
        );
      case 'SUPPORTER_ASSIGNED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-semibold">
            <UserCircle2 size={13} /> Specialist Assigned
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <CheckCircle2 size={13} /> Confirmed by Femazon
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-semibold">
            <Sparkles size={13} /> Service In Progress
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200 text-xs font-semibold">
            <CheckCircle2 size={13} /> Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200 text-xs font-semibold">
            {status || 'In Process'}
          </span>
        );
    }
  };

  const getStatusExplanation = (status: BookingItem['status']) => {
    switch (status) {
      case 'REQUEST_RECEIVED':
        return 'We have safely received your request. Our Femazon team will verify dates and contact you.';
      case 'UNDER_REVIEW':
        return 'Our coordination team is matching an experienced specialist for your location.';
      case 'SUPPORTER_ASSIGNED':
        return 'A verified specialist has been assigned for your appointment.';
      case 'CONFIRMED':
        return 'Your booking is locked in. Our specialist will arrive at your address on the scheduled time.';
      case 'IN_PROGRESS':
        return 'Your service is currently underway today.';
      case 'COMPLETED':
        return 'Thank you for choosing Femazon! We hope you loved the experience.';
      case 'CANCELLED':
        return 'This booking request was cancelled. You can place a new request anytime.';
      default:
        return 'Managed directly by Femazon Operations.';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return {
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        day: d.getDate(),
        weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
        full: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      };
    } catch {
      return { month: 'DATE', day: '—', weekday: '', full: dateStr };
    }
  };

  const handleCancelBooking = async (bookingId: number | string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' })
      });
      if (res.ok) {
        await refreshBookings();
        setCancelPrompt(null);
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking(prev => prev ? { ...prev, status: 'CANCELLED' } : null);
        }
      } else {
        alert('Could not cancel booking at this time. Please contact Femazon support.');
      }
    } catch (e) {
      console.error(e);
      alert('Could not cancel booking at this time. Please contact Femazon support.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-stone-900 mb-2">
            My Service Bookings
          </h1>
          <p className="font-sans text-[14.5px] text-stone-600">
            Track your mehendi, makeup, styling, and celebration appointments arranged by Femazon
          </p>
        </div>

        <Link 
          href="/services" 
          className="inline-flex items-center justify-center gap-2 bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-full transition shadow-xs self-start sm:self-auto"
        >
          <Sparkles size={14} />
          <span>Book Another Service</span>
        </Link>
      </div>

      {/* Trust Notice for Homemakers */}
      <div className="bg-[#FAF6F0] rounded-2xl p-4 sm:p-5 border border-[#E8DFD5] flex items-center justify-between gap-4 text-xs sm:text-sm text-[#5C4D42]">
        <div className="flex items-center gap-3">
          <ShieldCheck size={22} className="text-[#4A1513] shrink-0" />
          <span>
            <strong>Need help with your booking?</strong> Call our care line at <strong>1800-420-FEMAZON</strong> anytime.
          </span>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white border border-stone-200 rounded-3xl">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F5] border border-stone-200 flex items-center justify-center text-[#4A1513] mb-4">
            <CalendarDays size={28} strokeWidth={1.5} />
          </div>
          <h3 className="font-serif text-2xl text-stone-900 mb-2">No Service Bookings Yet</h3>
          <p className="text-stone-500 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            You don&apos;t have any appointments scheduled yet. Choose from our verified mehendi artists, party makeup experts, and saree draping specialists.
          </p>
          <Link 
            href="/services"
            className="bg-[#4A1513] hover:bg-[#350B0A] text-white font-medium text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-sm transition"
          >
            Explore Services
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          {bookings.map((booking) => {
            const formatted = formatDate(booking.date);

            return (
              <div 
                key={booking.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left: Date Block + Service Details */}
                <div className="flex items-start gap-4 sm:gap-6 flex-1 min-w-0">
                  
                  {/* Calendar Date Block */}
                  <div className="flex flex-col items-center justify-center shrink-0 w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#FAF7F5] border border-stone-200 text-[#4A1513] select-none">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      {formatted.month}
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold leading-none my-1">
                      {formatted.day}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-600">
                      {formatted.weekday}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                        Booking #{booking.id}
                      </span>
                      {getStatusBadge(booking.status)}
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-stone-900 leading-tight mb-2 truncate">
                      {booking.serviceName}
                    </h3>

                    {/* Status helper text */}
                    <p className="text-xs text-stone-500 mb-3 italic">
                      {getStatusExplanation(booking.status)}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[13px] text-stone-600">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#4A1513]/70 shrink-0" />
                        <span>{booking.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#4A1513]/70 shrink-0" />
                        <span className="truncate">{booking.location || 'At-Home Service'}</span>
                      </div>

                      <div className="flex items-center gap-2 sm:col-span-2 mt-0.5">
                        <UserCircle2 size={14} className="text-[#4A1513]/70 shrink-0" />
                        <span>
                          Assigned Specialist: <strong className="text-stone-800 font-semibold">{booking.supporterName || 'Femazon Internal Team (Assigning)'}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right: Total Price & View Details Action */}
                <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between md:justify-center pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-stone-100 md:pl-6 shrink-0 gap-3">
                  <div className="text-left md:text-right">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider text-stone-400 block">Estimated Amount</span>
                    <span className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                      ₹{booking.total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(booking)}
                      className="inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-wider text-[#4A1513] hover:text-[#350B0A] hover:underline underline-offset-4 transition cursor-pointer py-1"
                    >
                      <span>View Details</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-200 font-sans max-h-[90vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => {
                setSelectedBooking(null);
                setCancelPrompt(null);
              }}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition p-1 cursor-pointer rounded-full"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                Booking #{selectedBooking.id}
              </span>
              {getStatusBadge(selectedBooking.status)}
            </div>

            <h2 className="font-serif text-2xl text-stone-900 mb-2">
              {selectedBooking.serviceName}
            </h2>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-stone-700 mb-5">
              {getStatusExplanation(selectedBooking.status)}
            </div>

            <div className="space-y-3.5 bg-[#FAF7F5] rounded-2xl p-5 border border-stone-200/80 mb-6 text-[13.5px]">
              <div className="flex justify-between items-center pb-2.5 border-b border-stone-200/60">
                <span className="text-stone-500">Service Assigned To</span>
                <span className="font-semibold text-stone-900">
                  {selectedBooking.supporterName || 'Femazon Internal Operations'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-stone-200/60">
                <span className="text-stone-500">Preferred Date</span>
                <span className="font-semibold text-stone-900">{formatDate(selectedBooking.date).full}</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-stone-200/60">
                <span className="text-stone-500">Time Window</span>
                <span className="font-semibold text-stone-900">{selectedBooking.time}</span>
              </div>
              <div className="flex justify-between items-start pb-2.5 border-b border-stone-200/60">
                <span className="text-stone-500">Location</span>
                <span className="font-semibold text-stone-900 text-right max-w-[220px]">
                  {selectedBooking.location || 'At-Home Service'}
                </span>
              </div>
              {selectedBooking.customerName && (
                <div className="flex justify-between items-center pb-2.5 border-b border-stone-200/60">
                  <span className="text-stone-500">Customer Name</span>
                  <span className="font-semibold text-stone-900">{selectedBooking.customerName}</span>
                </div>
              )}
              {selectedBooking.customerPhone && (
                <div className="flex justify-between items-center pb-2.5 border-b border-stone-200/60">
                  <span className="text-stone-500">Contact Number</span>
                  <span className="font-semibold text-stone-900">{selectedBooking.customerPhone}</span>
                </div>
              )}
              {selectedBooking.notes && (
                <div className="flex flex-col gap-1 pb-2.5 border-b border-stone-200/60 text-xs">
                  <span className="text-stone-500">Special Notes:</span>
                  <span className="text-stone-800 bg-white p-2.5 rounded-lg border border-stone-200">
                    {selectedBooking.notes}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1">
                <span className="text-stone-500 font-medium">Estimated Amount</span>
                <span className="font-serif text-lg font-bold text-[#4A1513]">
                  ₹{selectedBooking.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Support Call Reassurance */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 mb-6 flex items-center justify-between text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <PhoneCall size={16} className="text-[#4A1513]" />
                <span>Need to reschedule or speak with us?</span>
              </div>
              <a 
                href="tel:18004203362" 
                className="font-bold text-[#4A1513] hover:underline"
              >
                1800-420-FEMAZON
              </a>
            </div>

            {/* Cancel booking option */}
            {selectedBooking.status !== 'CANCELLED' && selectedBooking.status !== 'COMPLETED' && (
              <div className="mb-6">
                {cancelPrompt === selectedBooking.id ? (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3 text-xs">
                    <p className="font-semibold text-rose-900">
                      Are you sure you want to cancel this booking?
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleCancelBooking(selectedBooking.id)}
                        className="py-2 px-4 rounded-full bg-rose-600 text-white font-bold hover:bg-rose-700 transition"
                      >
                        {isUpdating ? 'Cancelling...' : 'Yes, Cancel Booking'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCancelPrompt(null)}
                        className="py-2 px-4 rounded-full border border-stone-300 bg-white text-stone-700 font-semibold"
                      >
                        Keep Booking
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCancelPrompt(selectedBooking.id)}
                    className="text-xs text-rose-600 hover:text-rose-800 underline font-medium cursor-pointer"
                  >
                    Request cancellation of this booking
                  </button>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Link
                href="/services"
                onClick={() => setSelectedBooking(null)}
                className="flex-1 py-3.5 text-center rounded-full bg-[#4A1513] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#350B0A] transition"
              >
                Book Another Service
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSelectedBooking(null);
                  setCancelPrompt(null);
                }}
                className="py-3.5 px-6 rounded-full border border-stone-300 text-stone-700 text-xs font-bold uppercase tracking-wider hover:bg-stone-50 transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
