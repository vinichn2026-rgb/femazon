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
  ExternalLink,
  X
} from "lucide-react";
import { useFemazonStore, BookingItem } from "@/context/FemazonStoreContext";

export default function MyBookingsPage() {
  const { bookings, user } = useFemazonStore();
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);

  const getStatusBadge = (status: BookingItem['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider">
            <CheckCircle2 size={13} /> Confirmed
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold uppercase tracking-wider">
            <Clock size={13} /> Pending
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200 text-[11px] font-bold uppercase tracking-wider">
            Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold uppercase tracking-wider">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200 text-[11px] font-bold uppercase tracking-wider">
            {status}
          </span>
        );
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
      return { month: 'SEP', day: 18, weekday: 'Fri', full: dateStr };
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-stone-900 mb-2">
            My Bookings
          </h1>
          <p className="font-sans text-[14.5px] text-stone-500">
            Manage your personal styling, makeup, and bespoke couture appointments
          </p>
        </div>

        <Link 
          href="/services" 
          className="inline-flex items-center justify-center gap-2 bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition shadow-xs self-start sm:self-auto"
        >
          <Sparkles size={14} />
          <span>Book New Service</span>
        </Link>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white border border-stone-200 rounded-3xl">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F5] border border-stone-200 flex items-center justify-center text-[#4A1513] mb-4">
            <CalendarDays size={28} strokeWidth={1.5} />
          </div>
          <h3 className="font-serif text-2xl text-stone-900 mb-2">No bookings found</h3>
          <p className="text-stone-500 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            You don&apos;t have any appointments scheduled yet. Discover our verified fashion stylists, makeup artists, and event planners.
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
                className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
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
                        #{booking.id}
                      </span>
                      {getStatusBadge(booking.status)}
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-stone-900 group-hover:text-[#4A1513] transition-colors leading-tight mb-2 truncate">
                      {booking.serviceName}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[13px] text-stone-600">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#4A1513]/70 shrink-0" />
                        <span>{booking.time} ({booking.duration ? `${booking.duration} hr${booking.duration > 1 ? 's' : ''}` : '1-2 hrs'})</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#4A1513]/70 shrink-0" />
                        <span className="truncate">{booking.location || 'At-Home Service'}</span>
                      </div>

                      <div className="flex items-center gap-2 sm:col-span-2 mt-0.5">
                        <UserCircle2 size={14} className="text-[#4A1513]/70 shrink-0" />
                        <span>Specialist: <strong className="text-stone-800 font-semibold">{booking.providerName}</strong></span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right: Total Price & View Details Action */}
                <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between md:justify-center pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-stone-100 md:pl-6 shrink-0 gap-3">
                  <div className="text-left md:text-right">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider text-stone-400 block">Total Amount</span>
                    <span className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                      ₹{booking.total.toLocaleString('en-IN')}
                    </span>
                  </div>

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
            );
          })}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-200 font-sans">
            
            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition p-1 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Booking Details</span>
              {getStatusBadge(selectedBooking.status)}
            </div>

            <h2 className="font-serif text-2xl text-stone-900 mb-4">
              {selectedBooking.serviceName}
            </h2>

            <div className="space-y-4 bg-[#FAF7F5] rounded-2xl p-5 border border-stone-200/80 mb-6 text-[13.5px]">
              <div className="flex justify-between items-center pb-3 border-b border-stone-200/60">
                <span className="text-stone-500">Service Specialist</span>
                <span className="font-semibold text-stone-900">{selectedBooking.providerName}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-stone-200/60">
                <span className="text-stone-500">Date</span>
                <span className="font-semibold text-stone-900">{formatDate(selectedBooking.date).full}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-stone-200/60">
                <span className="text-stone-500">Time</span>
                <span className="font-semibold text-stone-900">{selectedBooking.time}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-stone-200/60">
                <span className="text-stone-500">Location</span>
                <span className="font-semibold text-stone-900">{selectedBooking.location || 'At-Home Service'}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-stone-500 font-medium">Total Paid</span>
                <span className="font-serif text-lg font-bold text-[#4A1513]">₹{selectedBooking.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/services"
                onClick={() => setSelectedBooking(null)}
                className="flex-1 py-3 text-center rounded-full bg-[#4A1513] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#350B0A] transition"
              >
                Book Another Service
              </Link>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="py-3 px-6 rounded-full border border-stone-300 text-stone-700 text-xs font-bold uppercase tracking-wider hover:bg-stone-50 transition cursor-pointer"
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
