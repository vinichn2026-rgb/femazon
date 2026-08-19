"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, CheckCircle2, ChevronRight, UserCircle2 } from "lucide-react";

type Booking = {
  id: number;
  date: string;
  time: string;
  status: string;
  total: number;
  service: {
    name: string;
    image: string;
  };
  provider: {
    name: string;
    image: string;
    rating: number;
  };
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        if (res.status === 401) {
          setError("Please log in to view your bookings.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-surface p-8 flex justify-center items-center text-zinc-500">Loading your bookings...</div>;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-surface p-8 flex justify-center items-center">
        <div className="rounded-[2rem] border border-accent/20 bg-white p-12 shadow-sm text-center">
          <CalendarDays size={48} className="mx-auto text-zinc-300 mb-6" />
          <h2 className="font-serif text-2xl text-text-main mb-2">Sign in to view bookings</h2>
          <p className="text-zinc-500 mb-8 max-w-sm">Log in to track your service appointments.</p>
          <Link href="/login" className="rounded-full bg-text-main px-8 py-3.5 text-xs font-bold tracking-widest uppercase text-white hover:bg-primary transition-colors">
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-text-main mb-3">My Bookings</h1>
          <p className="font-sans text-[15px] text-text-muted">
            Manage your upcoming and past service appointments
          </p>
        </div>
        <Link href="/services" className="hidden md:inline-flex bg-white text-text-main text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full border border-accent/20 shadow-sm hover:border-primary/30 transition-colors">
          Book a Service
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#fbf9f6] border border-accent/10 rounded-3xl mx-auto">
          <CalendarDays size={48} className="text-zinc-300 mb-6" strokeWidth={1} />
          <h3 className="font-serif text-2xl text-text-main mb-2">No bookings yet</h3>
          <p className="text-text-muted max-w-[400px] mx-auto mb-8">
            Ready to pamper yourself? Explore our professional styling, makeup, and planning services.
          </p>
          <Link 
            href="/services"
            className="bg-text-main text-white font-bold text-[12px] uppercase tracking-widest px-8 py-3.5 rounded-full shadow-md hover:bg-primary transition-colors"
          >
            Explore Services
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const bookingDate = new Date(booking.date);
            const isPast = bookingDate < new Date(new Date().setHours(0,0,0,0));
            
            return (
              <Link href={`/bookings/${booking.id}`} key={booking.id} className={`bg-white rounded-3xl border ${isPast ? 'border-zinc-200/60 opacity-75' : 'border-accent/20 shadow-sm'} overflow-hidden relative group block hover:border-primary/30 transition-all hover:shadow-md`}>
                
                {/* Status Badge */}
                <div className="absolute top-6 right-6 flex gap-2">
                  {booking.status === 'CONFIRMED' && !isPast && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold uppercase tracking-widest">
                      <CheckCircle2 size={12} /> Confirmed
                    </span>
                  )}
                  {isPast && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200 text-[10px] font-bold uppercase tracking-widest">
                      Completed
                    </span>
                  )}
                </div>

                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8">
                  
                  {/* Date Block */}
                  <div className="flex flex-col items-center justify-center shrink-0 w-24 h-24 rounded-2xl bg-primary/5 text-primary border border-primary/10">
                    <span className="text-[10px] font-bold uppercase tracking-widest">{bookingDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="font-serif text-3xl font-bold leading-none my-1">{bookingDate.getDate()}</span>
                    <span className="text-xs font-semibold">{bookingDate.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                      Booking #BKG{String(booking.id).padStart(4, '0')}
                    </p>
                    <h3 className="font-serif text-2xl text-text-main mb-4 group-hover:text-primary transition-colors">{booking.service.name}</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-sm text-zinc-600">
                        <Clock size={16} className="text-zinc-400" />
                        <span>{booking.time} {booking.duration ? `• ${booking.duration} ${booking.duration > 1 ? 'hours' : 'hour'}` : '• 1-2 hours'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-600">
                        <MapPin size={16} className="text-zinc-400" />
                        <span>{booking.location || "At-Home Service"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-600">
                        <UserCircle2 size={16} className="text-zinc-400" />
                        <span>Professional: <strong className="text-text-main">{booking.provider.name}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="shrink-0 flex flex-col items-start md:items-end justify-center pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-zinc-100 md:pl-8">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Total</p>
                    <p className="font-serif text-2xl text-text-main mb-4">₹{booking.total.toLocaleString('en-IN')}</p>
                    
                    <span className="text-[11px] font-bold uppercase tracking-widest text-text-main group-hover:text-primary transition-colors flex items-center gap-1">
                      View Details <ChevronRight size={14} />
                    </span>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
