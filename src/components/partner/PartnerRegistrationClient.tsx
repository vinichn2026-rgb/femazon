"use client";

import { useState } from "react";
import { CheckCircle2, FileText, Mail, MapPin, Phone, Store, User } from "lucide-react";

type ApplicantType = "SELLER" | "SERVICE_PROVIDER";

export function PartnerRegistrationClient({ initialApplicantType, initialPartnerType }: { initialApplicantType: ApplicantType; initialPartnerType?: string }) {
  const [applicantType, setApplicantType] = useState<ApplicantType>(initialApplicantType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    category: initialPartnerType === "gift-shop" ? "Gift Hampers" : initialPartnerType === "gift-creator" ? "Personalized Gifts" : initialPartnerType === "beauty-professional" ? "Beauty & Self-care" : "",
    description: "",
    experience: "",
    location: "",
    serviceInfo: "",
    pricingInfo: "",
    portfolio: "",
  });

  const categoryOptions = applicantType === "SELLER"
    ? [
        "Clothing & Apparel",
        "Jewelry & Accessories",
        "Footwear",
        "Beauty & Cosmetics",
        "Gift Hampers",
        "Florist & Flowers",
        "Bakery & Cakes",
        "Chocolates & Gourmet",
        "Personalized Gifts",
        "Plants & Decor",
        "Gifts & Lifestyle",
        "Boutique & Designer",
        "Other",
      ]
    : ["Beauty & Self-care", "Personal Styling", "Shopping Assistance"];

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/partner/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          applicantType,
          categories: [form.category],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to submit your application.");
      setSubmitted(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to submit your application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF7F5] px-4 py-16">
        <div className="w-full max-w-lg rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-sm sm:p-12">
          <CheckCircle2 size={48} className="mx-auto mb-5 text-emerald-600" />
          <h1 className="font-serif text-3xl font-bold text-stone-900">Application received</h1>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            Your application was saved and is pending review. Femazon will use the contact details you provided to follow up.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F5] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#4A1513]">Femazon Partner Network</span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">Grow with Femazon</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-stone-600">
            Tell us about your business or services. Applications are reviewed before a partnership is confirmed.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-9">
          {errorMessage && (
            <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {errorMessage}
            </p>
          )}

          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-stone-800">I am applying as</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                ["SELLER", "Product seller"],
                ["SERVICE_PROVIDER", "Service provider"],
              ] as const).map(([value, label]) => (
                <label key={value} className={`cursor-pointer rounded-xl border p-4 text-sm font-medium ${applicantType === value ? "border-[#4A1513] bg-rose-50 text-[#4A1513]" : "border-stone-200 text-stone-700"}`}>
                  <input
                    type="radio"
                    name="applicantType"
                    value={value}
                    checked={applicantType === value}
                    onChange={() => {
                      setApplicantType(value);
                      setForm((current) => ({ ...current, category: "" }));
                    }}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-stone-700">
              <span className="flex items-center gap-2"><User size={15} /> Contact name *</span>
              <input required maxLength={200} value={form.name} onChange={(event) => updateForm("name", event.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 outline-none focus:border-[#4A1513]" />
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-700">
              <span className="flex items-center gap-2"><Store size={15} /> Business / professional name</span>
              <input maxLength={200} value={form.businessName} onChange={(event) => updateForm("businessName", event.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 outline-none focus:border-[#4A1513]" />
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-700">
              <span className="flex items-center gap-2"><Mail size={15} /> Email *</span>
              <input required type="email" maxLength={200} value={form.email} onChange={(event) => updateForm("email", event.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 outline-none focus:border-[#4A1513]" />
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-700">
              <span className="flex items-center gap-2"><Phone size={15} /> Phone *</span>
              <input required type="tel" maxLength={40} value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 outline-none focus:border-[#4A1513]" />
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-700">
              <span>Category *</span>
              <select required value={form.category} onChange={(event) => updateForm("category", event.target.value)} className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 outline-none focus:border-[#4A1513]">
                <option value="" disabled>Select a category</option>
                {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-700">
              <span className="flex items-center gap-2"><MapPin size={15} /> City / service area</span>
              <input maxLength={200} value={form.location} onChange={(event) => updateForm("location", event.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 outline-none focus:border-[#4A1513]" />
            </label>
          </div>

          <label className="block space-y-2 text-sm font-medium text-stone-700">
            <span className="flex items-center gap-2"><FileText size={15} /> About your business or services</span>
            <textarea maxLength={2000} rows={4} value={form.description} onChange={(event) => updateForm("description", event.target.value)} className="w-full resize-y rounded-xl border border-stone-200 px-3 py-2.5 outline-none focus:border-[#4A1513]" />
          </label>

          {applicantType === "SERVICE_PROVIDER" && (
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-stone-700">
                <span>Experience</span>
                <input maxLength={2000} value={form.experience} onChange={(event) => updateForm("experience", event.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 outline-none focus:border-[#4A1513]" />
              </label>
              <label className="space-y-2 text-sm font-medium text-stone-700">
                <span>Services offered</span>
                <input maxLength={2000} value={form.serviceInfo} onChange={(event) => updateForm("serviceInfo", event.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 outline-none focus:border-[#4A1513]" />
              </label>
              <label className="space-y-2 text-sm font-medium text-stone-700">
                <span>Pricing information</span>
                <input maxLength={2000} value={form.pricingInfo} onChange={(event) => updateForm("pricingInfo", event.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 outline-none focus:border-[#4A1513]" />
              </label>
              <label className="space-y-2 text-sm font-medium text-stone-700">
                <span>Portfolio URL (optional)</span>
                <input type="url" maxLength={2000} value={form.portfolio} onChange={(event) => updateForm("portfolio", event.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 outline-none focus:border-[#4A1513]" />
              </label>
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#4A1513] px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#38100e] disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Submitting..." : "Submit application"}
          </button>
        </form>
      </div>
    </main>
  );
}
