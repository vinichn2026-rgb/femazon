"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ImagePlus, Loader2, Plus, Sparkles, Trash2, Upload } from "lucide-react";
import { useFemazonStore } from "@/context/FemazonStoreContext";
import { STYLIST_SPECIALIZATIONS } from "@/lib/stylistTypes";

export function StylistRegisterClient() {
  const { user, openAuthModal } = useFemazonStore();
  const [form, setForm] = useState({
    fullName: "",
    profileImage: "",
    email: "",
    phone: "",
    city: "",
    location: "",
    experience: "",
    bio: "",
    qualifications: "",
    preferredLocations: "",
    availabilitySchedule: "Mon - Sat, 10:00 AM - 7:00 PM",
    instagram: "",
    linkedin: "",
    website: "",
  });

  const [specializations, setSpecializations] = useState<string[]>(["Personal Styling"]);
  const [consultationModes, setConsultationModes] = useState<string[]>(["Online", "In-Person"]);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [portfolioUrlInput, setPortfolioUrlInput] = useState("");
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedResult, setSubmittedResult] = useState<{ slug: string; status: string } | null>(null);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  const toggleItem = (list: string[], setList: (v: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter((i) => i !== value) : [...list, value]);
  };

  const handleImageUpload = async (file: File, target: "profile" | "portfolio") => {
    setUploadingField(target);
    setErrorMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          openAuthModal();
        }
        throw new Error(data.error || "Upload failed");
      }
      if (target === "profile") {
        setForm((prev) => ({ ...prev, profileImage: data.url }));
      } else {
        setPortfolioImages((prev) => [...prev, data.url]);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/stylists/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          specializations,
          consultationModes,
          portfolioImages,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }
      setSubmittedResult(data.stylist);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unable to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedResult) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] py-16 px-4">
        <div className="mx-auto max-w-2xl rounded-3xl border border-stone-200 bg-white p-8 sm:p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <CheckCircle2 size={34} />
          </div>
          <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800 border border-amber-200 mb-3">
            Status: {submittedResult.status}
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Stylist Application Submitted
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            Thank you for applying to become a Femazon Personal Stylist. Our curation team will review your portfolio and qualifications. Once approved, your public profile will go live at{" "}
            <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs text-[#4A1513]">
              /personal-styling/{submittedResult.slug}
            </code>.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/stylist/dashboard"
              className="rounded-full bg-[#4A1513] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#38100e] transition"
            >
              Go to Stylist Dashboard
            </Link>
            <Link
              href="/personal-styling"
              className="rounded-full border border-stone-300 px-6 py-3 text-xs font-bold uppercase tracking-wider text-stone-700 hover:border-[#4A1513] transition"
            >
              Browse Personal Stylists
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#4A1513]">
            <Sparkles size={13} /> FEMAZON STYLIST NETWORK
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
            Become a Personal Stylist on Femazon
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-stone-600">
            Showcase your styling portfolio, create custom consultation packages, and connect with women seeking personal styling, wardrobe makeovers, and shopping assistance.
          </p>
          {!user && (
            <div className="mt-4 inline-flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
              <span>Sign in to upload photos directly and manage your Stylist Dashboard later.</span>
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="font-bold underline cursor-pointer"
              >
                Sign In / Register
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm">
          {errorMsg && (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {errorMsg}
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-2 mb-4">
              1. Stylist Identity &amp; Contact
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="e.g., Meera Krishnan"
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm focus:border-[#4A1513] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="stylist@example.com"
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm focus:border-[#4A1513] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Phone Number *
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm focus:border-[#4A1513] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Professional Experience *
                </label>
                <input
                  required
                  type="text"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  placeholder="e.g., 6+ Years"
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm focus:border-[#4A1513] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  City *
                </label>
                <input
                  required
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g., Chennai"
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm focus:border-[#4A1513] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Neighborhood / Location *
                </label>
                <input
                  required
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g., Alwarpet, Chennai"
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm focus:border-[#4A1513] focus:outline-none"
                />
              </div>
            </div>

            {/* Profile Photo */}
            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Profile Photograph
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {form.profileImage && (
                  <img
                    src={form.profileImage}
                    alt="Profile preview"
                    className="h-14 w-14 rounded-2xl object-cover border border-stone-200"
                  />
                )}
                <input
                  type="url"
                  value={form.profileImage}
                  onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
                  placeholder="Paste profile image URL or upload"
                  className="flex-1 min-w-[200px] rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm focus:border-[#4A1513] focus:outline-none"
                />
                <label className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-xs font-bold text-stone-700 hover:border-[#4A1513] cursor-pointer">
                  {uploadingField === "profile" ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, "profile");
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Expertise & Bio */}
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-2 mb-4">
              2. Expertise, Bio &amp; Qualifications
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Short Biography *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Describe your styling philosophy, signature aesthetic, and client experience..."
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm focus:border-[#4A1513] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Styling Specializations
                </label>
                <div className="flex flex-wrap gap-2">
                  {STYLIST_SPECIALIZATIONS.map((spec) => {
                    const active = specializations.includes(spec);
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleItem(specializations, setSpecializations, spec)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                          active
                            ? "bg-[#4A1513] text-white"
                            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        {spec}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Qualifications / Certifications
                  </label>
                  <input
                    type="text"
                    value={form.qualifications}
                    onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                    placeholder="e.g., NIFT Fashion Styling Diploma, Image Consulting"
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm focus:border-[#4A1513] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Preferred Working Locations
                  </label>
                  <input
                    type="text"
                    value={form.preferredLocations}
                    onChange={(e) => setForm({ ...form, preferredLocations: e.target.value })}
                    placeholder="e.g., Chennai, Bengaluru, Pan-India Online"
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm focus:border-[#4A1513] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Consultation Availability
                  </label>
                  <div className="flex gap-3">
                    {["Online", "In-Person"].map((mode) => {
                      const active = consultationModes.includes(mode);
                      return (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => toggleItem(consultationModes, setConsultationModes, mode)}
                          className={`rounded-xl border px-4 py-2 text-xs font-bold cursor-pointer ${
                            active
                              ? "border-[#4A1513] bg-rose-50 text-[#4A1513]"
                              : "border-stone-200 bg-white text-stone-600"
                          }`}
                        >
                          {mode}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Weekly Availability Schedule
                  </label>
                  <input
                    type="text"
                    value={form.availabilitySchedule}
                    onChange={(e) => setForm({ ...form, availabilitySchedule: e.target.value })}
                    placeholder="e.g., Mon - Sat, 10:00 AM - 7:00 PM"
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm focus:border-[#4A1513] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio & Social Links */}
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-2 mb-4">
              3. Portfolio Gallery &amp; Professional Links
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Portfolio Images
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  <input
                    type="url"
                    value={portfolioUrlInput}
                    onChange={(e) => setPortfolioUrlInput(e.target.value)}
                    placeholder="Paste portfolio image URL"
                    className="flex-1 min-w-[200px] rounded-xl border border-stone-200 px-3.5 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (portfolioUrlInput.trim()) {
                        setPortfolioImages((prev) => [...prev, portfolioUrlInput.trim()]);
                        setPortfolioUrlInput("");
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-xl bg-stone-900 px-4 py-2 text-xs font-bold text-white cursor-pointer"
                  >
                    <Plus size={14} /> Add URL
                  </button>
                  <label className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-stone-50 px-4 py-2 text-xs font-bold text-stone-700 hover:border-[#4A1513] cursor-pointer">
                    {uploadingField === "portfolio" ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, "portfolio");
                      }}
                    />
                  </label>
                </div>

                {portfolioImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {portfolioImages.map((img, idx) => (
                      <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-stone-200">
                        <img src={img} alt={`Portfolio ${idx + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPortfolioImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1.5 right-1.5 rounded-full bg-black/70 p-1 text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={form.instagram}
                    onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={form.linkedin}
                    onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Website / Portfolio Link
                  </label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="https://yourstudio.com"
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-4">
            <Link
              href="/personal-styling"
              className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-[#4A1513] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#38100e] disabled:opacity-60 cursor-pointer"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              <span>{submitting ? "Submitting..." : "Submit Stylist Application"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
