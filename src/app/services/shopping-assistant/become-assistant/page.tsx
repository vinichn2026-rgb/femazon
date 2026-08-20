"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, Briefcase, IndianRupee } from "lucide-react";

export default function BecomeAssistantPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 pt-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        <Link href="/services/shopping-assistant" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-primary transition">
          <ArrowLeft size={16} /> Back to Shopping Assistant
        </Link>

        {submitted ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-zinc-200">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="mb-4 text-3xl font-extrabold text-primary">Application Submitted!</h1>
            <p className="mx-auto max-w-md text-lg text-zinc-600">
              Thank you for applying to be a Femazon Shopping Assistant. Our team will review your profile and contact you within 48 hours for the verification process.
            </p>
            <div className="mt-8">
              <Link href="/profile" className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-rose-500">
                Go to Profile
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-200 sm:p-10">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-500">
                <Briefcase size={32} />
              </div>
              <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">Become a Shopping Assistant</h1>
              <p className="mt-3 text-lg text-zinc-600">Join our verified network and earn while you shop.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Personal Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary border-b border-zinc-100 pb-3">Personal Information</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary">Full Name</label>
                    <input required type="text" placeholder="Jane Doe" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary">Phone Number</label>
                    <input required type="tel" placeholder="+91 98765 43210" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary">Profile Photo URL</label>
                  <input required type="url" placeholder="https://example.com/your-photo.jpg" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                  <p className="text-xs text-zinc-500">A clear, well-lit headshot increases booking rates.</p>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary border-b border-zinc-100 pb-3">Service Details</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary">Primary Location / City</label>
                    <input required type="text" placeholder="Mumbai, Maharashtra" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary">Languages Spoken</label>
                    <input required type="text" placeholder="English, Hindi, Marathi" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary">Available Days</label>
                    <input required type="text" placeholder="e.g. Weekends, Mon-Fri" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary">Available Time</label>
                    <input required type="text" placeholder="e.g. 10 AM - 6 PM" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary">Shopping Experience / Why you?</label>
                  <textarea required rows={3} placeholder="Tell us about your fashion sense and how you can help others shop better..." className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary">Short Bio (Publicly visible)</label>
                  <input required type="text" placeholder="Friendly shopping companion with a great eye for deals." className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                </div>
              </div>

              {/* Rate & Submit */}
              <div className="rounded-2xl bg-zinc-50 p-6 border border-zinc-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-primary">Hourly Rate</h4>
                  <p className="text-xs text-zinc-500">Standard rate for all assistants.</p>
                </div>
                <div className="flex items-center gap-1 font-extrabold text-2xl text-rose-500">
                  <IndianRupee size={24} /> 100<span className="text-sm text-rose-300 font-medium">/hr</span>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full rounded-full bg-rose-500 py-4 text-base font-bold text-white shadow-lg transition hover:bg-rose-600">
                  Submit Application
                </button>
                <p className="mt-4 text-center text-xs text-zinc-500">
                  By submitting, you agree to Femazon's Terms of Service and Background Check policies.
                </p>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}
