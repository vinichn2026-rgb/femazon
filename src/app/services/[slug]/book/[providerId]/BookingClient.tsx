"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar as CalendarIcon, Clock, ChevronLeft, Star, Info } from "lucide-react";

type BookingClientProps = {
  service: any;
  provider: any;
};

export default function BookingClient({ service, provider }: BookingClientProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mock available dates (next 7 days)
  const getNextDays = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };
  const availableDates = getNextDays();

  // Mock available times
  const availableTimes = ["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"];

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          providerId: provider.id,
          date: selectedDate,
          time: selectedTime
        })
      });

      if (res.status === 401) {
        setError("Please log in to book a service.");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Failed to book");

      // Redirect to user's bookings page
      router.push("/bookings");
      
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link href={`/services/${service.slug}`} className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-text-muted hover:text-primary transition mb-8">
          <ChevronLeft size={14} className="mr-1" /> Back to Providers
        </Link>

        <h1 className="font-serif text-3xl md:text-4xl text-text-main mb-8">Book your session</h1>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Date Selection */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-accent/20 shadow-sm">
              <h3 className="font-serif text-xl text-text-main flex items-center gap-2 mb-6">
                <CalendarIcon size={20} className="text-primary" /> Select a Date
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {availableDates.map(date => {
                  const dateObj = new Date(date);
                  const isSelected = selectedDate === date;
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`py-3 px-2 rounded-2xl border text-center transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary text-white shadow-md' 
                          : 'border-accent/30 bg-zinc-50 hover:border-primary/50 text-text-main'
                      }`}
                    >
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isSelected ? 'text-white/80' : 'text-zinc-500'}`}>
                        {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                      <p className="text-lg font-bold">
                        {dateObj.getDate()}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-accent/20 shadow-sm">
              <h3 className="font-serif text-xl text-text-main flex items-center gap-2 mb-6">
                <Clock size={20} className="text-primary" /> Select a Time
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableTimes.map(time => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 rounded-xl border text-sm font-bold tracking-wide transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-accent/30 bg-white hover:border-primary/50 text-text-main'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Summary */}
          <div className="md:col-span-5">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-accent/20 shadow-sm sticky top-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-6">Booking Summary</h3>
              
              {/* Provider Info */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-accent/20">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                  <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-text-main">{provider.name}</h4>
                  <p className="text-xs text-primary font-medium mt-1 uppercase tracking-wider">{service.name}</p>
                  <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1">
                    <Star size={12} className="text-amber-500" fill="currentColor" /> {provider.rating} ({provider.reviewCount} reviews)
                  </div>
                </div>
              </div>

              {/* Appointment Info */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Date</span>
                  <span className="font-medium text-text-main">{selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Not selected"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Time</span>
                  <span className="font-medium text-text-main">{selectedTime || "Not selected"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Duration</span>
                  <span className="font-medium text-text-main">60-120 mins</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-zinc-50 rounded-2xl p-4 mb-6 flex justify-between items-center">
                <span className="font-bold text-text-main">Total Amount</span>
                <span className="font-serif text-xl text-primary">₹{service.basePrice.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-start gap-2 text-xs text-zinc-400 mb-6 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                <p>Payment is collected directly by the provider after the service is completed.</p>
              </div>

              <button
                disabled={!selectedDate || !selectedTime || loading}
                onClick={handleBooking}
                className="w-full bg-text-main text-white font-bold text-[12px] uppercase tracking-[0.15em] py-4 rounded-full disabled:opacity-50 hover:bg-primary transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
