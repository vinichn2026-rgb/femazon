"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock, MapPin, CheckCircle2, XCircle, User, Briefcase, RefreshCw, AlertCircle } from "lucide-react";

export default function BookingDetailsClient({ bookingId }: { bookingId: string }) {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (!res.ok) throw new Error("Failed to load booking");
      const data = await res.json();
      setBooking(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: "POST" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to cancel booking");
      }
      alert("Booking successfully cancelled.");
      fetchBooking(); // Refresh data
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <RefreshCw className="animate-spin text-zinc-300" size={32} />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center text-center">
        <AlertCircle className="mb-4 text-red-400" size={48} />
        <h2 className="text-xl font-bold text-text-main">Oops, something went wrong</h2>
        <p className="mt-2 text-text-muted">{error || "Booking not found."}</p>
        <Link href="/bookings" className="mt-6 text-sm font-bold text-primary hover:underline">
          Return to My Bookings
        </Link>
      </div>
    );
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "CONFIRMED": return { color: "text-emerald-600", bg: "bg-emerald-50", icon: <CheckCircle2 size={16} /> };
      case "COMPLETED": return { color: "text-blue-600", bg: "bg-blue-50", icon: <CheckCircle2 size={16} /> };
      case "CANCELLED": return { color: "text-red-600", bg: "bg-red-50", icon: <XCircle size={16} /> };
      default: return { color: "text-zinc-600", bg: "bg-zinc-50", icon: <Clock size={16} /> };
    }
  };

  const statusDisplay = getStatusDisplay(booking.status);

  return (
    <div>
      <Link href="/bookings" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-text-muted transition-colors hover:text-primary mb-8">
        <ChevronLeft size={16} />
        Back to Bookings
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl text-text-main">Booking #{bookingId.padStart(4, '0')}</h1>
          <p className="text-text-muted text-sm mt-1">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest ${statusDisplay.bg} ${statusDisplay.color}`}>
          {statusDisplay.icon}
          {booking.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          {/* Service Info */}
          <div className="bg-white border border-accent/10 rounded-2xl p-6">
            <h2 className="font-bold text-xs uppercase tracking-widest text-text-muted mb-6 flex items-center gap-2">
              <Briefcase size={16} /> Service Details
            </h2>
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-zinc-100 rounded-lg overflow-hidden shrink-0">
                <img src={booking.service.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=200&auto=format&fit=crop"} alt={booking.service.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-text-main mb-1">{booking.service.name}</h3>
                <p className="text-sm text-text-muted max-w-md line-clamp-2 mb-3">{booking.service.description}</p>
                <div className="text-sm font-medium">₹{booking.service.price.toLocaleString()} {booking.service.priceUnit && `/ ${booking.service.priceUnit}`}</div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-white border border-accent/10 rounded-2xl p-6">
            <h2 className="font-bold text-xs uppercase tracking-widest text-text-muted mb-6">Appointment Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Date</div>
                  <div className="font-medium text-text-main">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Time</div>
                  <div className="font-medium text-text-main">{booking.time} {booking.duration && `(${booking.duration} hrs)`}</div>
                </div>
              </div>

              <div className="flex gap-3 items-start sm:col-span-2">
                <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Location</div>
                  <div className="font-medium text-text-main">{booking.location || "Online / At Home (Check with provider)"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          {/* Provider Info */}
          <div className="bg-white border border-accent/10 rounded-2xl p-6">
            <h2 className="font-bold text-xs uppercase tracking-widest text-text-muted mb-6 flex items-center gap-2">
              <User size={16} /> Provider
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-zinc-100 overflow-hidden shrink-0">
                <img src={booking.provider.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"} alt={booking.provider.businessName} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-text-main">{booking.provider.businessName}</h3>
                <p className="text-xs text-text-muted">⭐ {booking.provider.rating} Rating</p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-[#fbf9f6] border border-accent/10 rounded-2xl p-6">
            <h2 className="font-bold text-xs uppercase tracking-widest text-text-muted mb-6">Payment Summary</h2>
            <div className="space-y-3 text-sm text-zinc-600 mb-4 pb-4 border-b border-zinc-200">
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>₹{booking.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹0</span>
              </div>
            </div>
            <div className="flex justify-between font-serif text-xl text-text-main mb-6">
              <span>Total</span>
              <span>₹{booking.total.toLocaleString()}</span>
            </div>

            {booking.status === 'CONFIRMED' && (
              <button 
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="w-full py-3.5 border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-widest rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelling ? <RefreshCw size={16} className="animate-spin" /> : <XCircle size={16} />}
                Cancel Booking
              </button>
            )}

            {booking.status === 'CANCELLED' && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-medium text-center">
                This booking has been cancelled. No charges applied.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
