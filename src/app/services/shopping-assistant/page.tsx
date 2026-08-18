"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, MapPin, Calendar, Clock, Sparkles } from "lucide-react";
import { AssistantCard } from "@/components/AssistantCard";

export default function ShoppingAssistantPage() {
  const [hours, setHours] = useState(2);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState("");

  const mockAssistants = [
    {
      id: "a1",
      name: "Priya Sharma",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
      rating: 4.9,
      reviews: 124,
      location: "Mumbai, Maharashtra",
      languages: ["English", "Hindi", "Marathi"],
      availability: "Available Today",
    },
    {
      id: "a2",
      name: "Anjali Gupta",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
      rating: 4.8,
      reviews: 89,
      location: "Delhi, NCR",
      languages: ["English", "Hindi"],
      availability: "Available Tomorrow",
    },
    {
      id: "a3",
      name: "Riya Verma",
      photoUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1bfa82?q=80&w=600&auto=format&fit=crop",
      rating: 5.0,
      reviews: 42,
      location: "Bangalore, Karnataka",
      languages: ["English", "Hindi", "Kannada"],
      availability: "Available Today",
    },
    {
      id: "a4",
      name: "Meera Patel",
      photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
      rating: 4.7,
      reviews: 215,
      location: "Ahmedabad, Gujarat",
      languages: ["English", "Gujarati"],
      availability: "Available Next Week",
    },
  ];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
    }, 4000);
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
                <span className="text-xs text-zinc-500">Starting from</span>
                <span className="font-bold text-zinc-900 text-lg">₹100/hour</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works & Help Sections */}
      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          
          {/* How It Works */}
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-zinc-100">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900">How It Works</h2>
            <div className="space-y-6">
              {[
                { step: "1", title: "Choose Location", desc: "Select the mall or shopping street." },
                { step: "2", title: "Select Date & Time", desc: "When do you plan to go shopping?" },
                { step: "3", title: "Choose Duration", desc: "Book for 1 hour or the whole day." },
                { step: "4", title: "Select Assistant", desc: "Pick a verified shopping partner." },
                { step: "5", title: "Confirm Booking", desc: "Meet your assistant at the location!" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 font-bold text-rose-600">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900">{item.title}</h3>
                    <p className="text-sm text-zinc-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What They Help With */}
          <div className="rounded-3xl bg-rose-50 p-8 shadow-sm border border-rose-100">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900">What The Assistant Can Help With</h2>
            <div className="space-y-4">
              {[
                "Accompany you while shopping",
                "Carry shopping bags/items",
                "Help move between stores",
                "Assist with basic shopping activities",
                "Provide shopping companionship"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-rose-500 shrink-0" />
                  <span className="text-zinc-800 font-medium">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl bg-white/60 p-4 border border-rose-200">
              <p className="text-xs leading-relaxed text-zinc-600">
                <strong className="text-zinc-900">Note:</strong> This service is strictly for shopping assistance and companionship. Assistants are not permitted to provide professional medical care or engage in heavy lifting beyond standard shopping bags.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Assistants Grid */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Verified Assistants</h2>
            <p className="mt-2 text-zinc-600">Choose your perfect shopping partner.</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockAssistants.map((assistant) => (
            <AssistantCard key={assistant.id} {...assistant} />
          ))}
        </div>
      </section>

      {/* Booking Form UI & Trust Section */}
      <section id="booking-section" className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          
          {/* Booking UI */}
          <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-md border border-zinc-200 sm:p-10">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Book an Assistant</h2>
            <p className="mt-2 text-zinc-600">Fill in the details below to schedule your shopping partner.</p>

            {bookingSuccess && (
              <div className="mt-6 rounded-2xl bg-emerald-50 p-4 border border-emerald-200 flex gap-3">
                <CheckCircle2 className="text-emerald-500 h-6 w-6 shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-800">Booking Confirmed!</h4>
                  <p className="text-sm text-emerald-700 mt-1">Your request has been sent to the assistant. You will receive an email shortly.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleBooking} className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-900 flex items-center gap-2"><MapPin size={16}/> Shopping Location</label>
                  <input required type="text" placeholder="e.g. Phoenix Mall, Mumbai" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-900 flex items-center gap-2"><Calendar size={16}/> Date</label>
                  <input required type="date" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-900 flex items-center gap-2"><Clock size={16}/> Start Time</label>
                  <input required type="time" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-900">Select Assistant (Optional)</label>
                  <select 
                    value={selectedAssistant}
                    onChange={(e) => setSelectedAssistant(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  >
                    <option value="">Any Available Assistant</option>
                    {mockAssistants.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              </div>

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
                  <p className="text-3xl font-extrabold text-zinc-900">₹{hours * 100}</p>
                </div>
                <button type="submit" className="rounded-full bg-rose-500 px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-rose-600">
                  Confirm Booking
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

            <div className="rounded-3xl bg-zinc-900 p-8 text-center text-white shadow-xl">
              <h3 className="text-xl font-bold mb-2">Want to Earn?</h3>
              <p className="text-sm text-zinc-400 mb-6">Become a Shopping Assistant on Femazon and earn ₹100/hour doing what you love.</p>
              <Link href="/services/shopping-assistant/become-assistant" className="inline-block w-full rounded-full bg-white px-6 py-3 text-sm font-bold text-zinc-900 hover:bg-rose-50 transition">
                Apply Now
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
