"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, MapPin, Calendar, Clock, Sparkles, Star } from "lucide-react";

export default function ShoppingAssistantClient({ service }: { service: any }) {
  const router = useRouter();
  
  const [hours, setHours] = useState(2);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedAssistant, setSelectedAssistant] = useState(
    service.providers.length > 0 ? service.providers[0].id.toString() : ""
  );
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssistant || !location || !date || !time) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          providerId: Number(selectedAssistant),
          date,
          time,
          location,
          duration: hours
        })
      });

      if (res.status === 401) {
        setError("Please log in to book a shopping assistant.");
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
    <div className="min-h-screen bg-zinc-50 pb-20">
      
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="relative flex min-h-[400px] w-full items-center overflow-hidden rounded-3xl bg-gradient-to-br from-pink-100 to-rose-50 shadow-sm">
          <div className="absolute right-0 top-0 hidden h-full w-1/2 bg-[url('https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-70 mix-blend-multiply lg:block" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-transparent lg:w-2/3" />
          
          <div className="relative z-10 flex flex-col items-start px-8 py-16 lg:w-2/3 lg:px-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/60 px-4 py-1.5 text-xs font-bold text-rose-600 shadow-sm backdrop-blur">
              <Sparkles size={14} /> New Premium Service
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              Your Personal <br/><span className="text-rose-500">Shopping Partner</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-zinc-600">
              Shop comfortably with a helping hand by your side. Book a verified shopping assistant to accompany you and carry your bags.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <button 
                onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-full bg-zinc-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-rose-500 hover:shadow-rose-500/25"
              >
                Book Now
              </button>
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500">Fixed rate</span>
                <span className="font-bold text-zinc-900 text-lg">₹{service.basePrice}/hour</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form UI & Trust Section */}
      <section id="booking-section" className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          
          {/* Booking UI */}
          <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-md border border-zinc-200 sm:p-10">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Book an Assistant</h2>
            <p className="mt-2 text-zinc-600">Fill in the details below to schedule your shopping partner.</p>

            {error && (
              <div className="mt-6 rounded-2xl bg-red-50 p-4 border border-red-200">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleBooking} className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-900 flex items-center gap-2"><MapPin size={16}/> Shopping Location</label>
                  <input required type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Phoenix Mall, Mumbai" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-900 flex items-center gap-2"><Calendar size={16}/> Date</label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-900 flex items-center gap-2"><Clock size={16}/> Start Time</label>
                  <input required type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-900">Select Assistant</label>
                  <select 
                    required
                    value={selectedAssistant}
                    onChange={(e) => setSelectedAssistant(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  >
                    {service.providers.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Display Selected Assistant Profile Briefly */}
              {selectedAssistant && (
                <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 flex gap-4 items-center">
                  {(() => {
                    const assistant = service.providers.find((p: any) => p.id.toString() === selectedAssistant);
                    return assistant ? (
                      <>
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-zinc-200">
                          <img src={assistant.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200"} alt={assistant.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-900 text-sm">{assistant.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                            <Star size={12} fill="currentColor" /> {assistant.rating} ({assistant.reviewCount} reviews)
                          </div>
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
              )}

              <div className="space-y-4 rounded-2xl bg-zinc-50 p-6 border border-zinc-100">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-zinc-900">Duration (Hours)</label>
                  <span className="font-bold text-rose-600">{hours} {hours > 1 ? 'hours' : 'hour'}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="8" 
                  value={hours} 
                  onChange={(e) => setHours(parseInt(e.target.value))}
                  className="w-full accent-rose-500" 
                />
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>1 hr</span>
                  <span>4 hrs</span>
                  <span>8 hrs</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Estimated Total</p>
                  <p className="text-3xl font-extrabold text-zinc-900">₹{(hours * service.basePrice).toLocaleString('en-IN')}</p>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="rounded-full bg-rose-500 px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-rose-600 disabled:opacity-50"
                >
                  {loading ? "Confirming..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>

          {/* Safety & Trust UI */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-200">
              <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900 mb-4">
                <ShieldCheck className="text-blue-500" /> Trust & Safety
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-zinc-900">Identity Verified</strong>
                    <span className="text-zinc-500">Govt ID verified for all assistants.</span>
                  </div>
                </li>
                <li className="flex gap-3 text-sm">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-zinc-900">Profile Verified</strong>
                    <span className="text-zinc-500">In-person interviews completed.</span>
                  </div>
                </li>
                <li className="flex gap-3 text-sm">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-zinc-900">Ratings & Reviews</strong>
                    <span className="text-zinc-500">Only highly rated partners stay on board.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
