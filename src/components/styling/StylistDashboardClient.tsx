"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  ExternalLink,
  ImagePlus,
  Loader2,
  Package,
  Plus,
  Sparkles,
  Trash2,
  UserCheck,
  Wallet,
  XCircle,
} from "lucide-react";
import { useFemazonStore } from "@/context/FemazonStoreContext";
import { STYLIST_PACKAGE_TYPES, STYLIST_SPECIALIZATIONS } from "@/lib/stylistTypes";

export function StylistDashboardClient() {
  const { user, openAuthModal } = useFemazonStore();
  const [loading, setLoading] = useState(true);
  const [stylist, setStylist] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"bookings" | "packages" | "profile" | "earnings">("bookings");
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Package form state
  const [showPkgForm, setShowPkgForm] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState<number | null>(null);
  const [pkgForm, setPkgForm] = useState({
    title: "",
    packageType: STYLIST_PACKAGE_TYPES[0] as string,
    description: "",
    price: "2500",
    duration: "60 mins",
    sessionsCount: "1",
    deliveryMode: "Online & Offline",
    location: "",
    availability: "Mon - Sat, 10:00 AM - 7:00 PM",
    includedServicesText: "Style Assessment, Personalized Lookbook, 1-on-1 Consultation",
    addOnsText: "Extra Wardrobe Audit: 1000, Shopping Companion (2 hrs): 2000",
    imageUrl: "",
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    location: "",
    experience: "",
    bio: "",
    availabilitySchedule: "",
    profileImage: "",
  });
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stylists/me");
      if (res.status === 401) {
        setStylist(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setStylist(data.stylist || null);
      if (data.stylist) {
        setProfileForm({
          fullName: data.stylist.fullName || "",
          phone: data.stylist.phone || "",
          city: data.stylist.city || "",
          location: data.stylist.location || "",
          experience: data.stylist.experience || "",
          bio: data.stylist.bio || "",
          availabilitySchedule: data.stylist.availabilitySchedule || "",
          profileImage: data.stylist.profileImage || "",
        });
        setPortfolioImages(data.stylist.portfolioImages || []);
      }
    } catch {
      setErrorMsg("Unable to load your stylist dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard, user]);

  const handleBookingStatus = async (bookingId: number, status: string) => {
    setStatusMsg("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/stylists/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setStatusMsg(`Booking #${bookingId} marked as ${status}.`);
      await loadDashboard();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update booking.");
    }
  };

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setStatusMsg("");
    try {
      const includedServices = pkgForm.includedServicesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const addOns = pkgForm.addOnsText
        .split(",")
        .map((entry) => {
          const [name, priceStr] = entry.split(":");
          return { name: (name || "").trim(), price: Number(priceStr) || 0 };
        })
        .filter((a) => a.name);

      const method = editingPkgId ? "PATCH" : "POST";
      const res = await fetch("/api/stylists/packages", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingPkgId ? { id: editingPkgId } : {}),
          title: pkgForm.title,
          packageType: pkgForm.packageType,
          description: pkgForm.description,
          price: Number(pkgForm.price),
          duration: pkgForm.duration,
          sessionsCount: Number(pkgForm.sessionsCount),
          deliveryMode: pkgForm.deliveryMode,
          location: pkgForm.location,
          availability: pkgForm.availability,
          includedServices,
          addOns,
          images: pkgForm.imageUrl.trim() ? [pkgForm.imageUrl.trim()] : [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save package");
      setShowPkgForm(false);
      setEditingPkgId(null);
      setStatusMsg(editingPkgId ? "Package updated." : "Package created.");
      await loadDashboard();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save package.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePackage = async (id: number) => {
    if (!confirm("Delete this package?")) return;
    const res = await fetch(`/api/stylists/packages?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setStatusMsg("Package deleted.");
      await loadDashboard();
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setStatusMsg("");
    try {
      const res = await fetch("/api/stylists/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profileForm,
          portfolioImages,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save profile");
      setStatusMsg("Profile and portfolio updated.");
      await loadDashboard();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePortfolioUpload = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok && data.url) {
      setPortfolioImages((prev) => [...prev, data.url]);
    } else {
      setErrorMsg(data.error || "Failed to upload portfolio image.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FAF7F5]">
        <Loader2 className="animate-spin text-[#4A1513]" size={28} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-[#FAF7F5] py-20 px-4 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <Sparkles size={32} className="mx-auto mb-3 text-[#4A1513]" />
          <h1 className="font-serif text-2xl font-bold text-stone-900">Stylist Dashboard</h1>
          <p className="mt-2 text-sm text-stone-600">
            Sign in with your Femazon account to manage your personal styling packages, bookings, and earnings.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal()}
            className="mt-6 rounded-full bg-[#4A1513] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  if (!stylist) {
    return (
      <div className="min-h-[70vh] bg-[#FAF7F5] py-20 px-4 text-center">
        <div className="mx-auto max-w-lg rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <UserCheck size={34} className="mx-auto mb-3 text-[#4A1513]" />
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            You haven&apos;t registered as a Personal Stylist yet
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Submit your stylist profile and portfolio to start offering personalized styling packages on Femazon.
          </p>
          <Link
            href="/personal-styling/register"
            className="mt-6 inline-block rounded-full bg-[#4A1513] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white"
          >
            Become a Stylist
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F5] py-10 px-4 sm:px-6 lg:px-8 text-stone-900">
      <div className="mx-auto max-w-[1300px] space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between shadow-xs">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#4A1513]">
                Personal Stylist Portal
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                  stylist.status === "APPROVED"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : stylist.status === "REJECTED"
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}
              >
                {stylist.status}
              </span>
            </div>
            <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Welcome, {stylist.fullName}
            </h1>
            {stylist.rejectionReason && (
              <p className="mt-1 text-xs text-red-700">Note: {stylist.rejectionReason}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {stylist.status === "APPROVED" && (
              <Link
                href={`/personal-styling/${stylist.slug}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#4A1513] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#4A1513] hover:bg-rose-50 transition"
              >
                <span>View Public Profile</span>
                <ExternalLink size={13} />
              </Link>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <span className="text-xs text-stone-500 block">Total Bookings</span>
            <span className="font-serif text-2xl font-bold text-stone-900">
              {stylist.earnings?.totalBookings || 0}
            </span>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <span className="text-xs text-stone-500 block">Gross Revenue</span>
            <span className="font-serif text-2xl font-bold text-stone-900">
              ₹{(stylist.earnings?.grossEarnings || 0).toLocaleString("en-IN")}
            </span>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <span className="text-xs text-stone-500 block">
              Platform Commission ({stylist.earnings?.commissionRate || 15}%)
            </span>
            <span className="font-serif text-2xl font-bold text-amber-700">
              ₹{(stylist.earnings?.totalCommission || 0).toLocaleString("en-IN")}
            </span>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <span className="text-xs text-stone-500 block">Net Earnings</span>
            <span className="font-serif text-2xl font-bold text-emerald-700">
              ₹{(stylist.earnings?.netEarnings || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {statusMsg && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {statusMsg}
          </div>
        )}
        {errorMsg && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
          {[
            { id: "bookings", label: "Bookings", icon: Calendar },
            { id: "packages", label: "My Packages", icon: Package },
            { id: "profile", label: "Profile & Portfolio", icon: UserCheck },
            { id: "earnings", label: "Earnings & Commission", icon: Wallet },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id as any)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === id
                  ? "bg-[#4A1513] text-white"
                  : "bg-white text-stone-700 border border-stone-200 hover:border-[#4A1513]"
              }`}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            {(stylist.bookings || []).length === 0 ? (
              <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
                No booking requests yet.
              </div>
            ) : (
              stylist.bookings.map((b: any) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-stone-200 bg-white p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-lg font-bold text-stone-900">
                        #{b.id} · {b.customerName}
                      </span>
                      <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-stone-700">
                        {b.status}
                      </span>
                      <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-[#4A1513]">
                        {b.deliveryMode}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-stone-500">
                      {b.bookingDate} · {b.bookingTime} · {b.customerPhone} · {b.customerEmail}
                    </p>
                    {b.notes && <p className="mt-2 text-xs text-stone-600">Notes: {b.notes}</p>}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-serif text-lg font-bold text-[#4A1513] mr-2">
                      ₹{b.totalAmount.toLocaleString("en-IN")}
                    </span>
                    {b.status === "PENDING" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleBookingStatus(b.id, "ACCEPTED")}
                          className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white cursor-pointer"
                        >
                          <CheckCircle2 size={13} /> Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBookingStatus(b.id, "REJECTED")}
                          className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white cursor-pointer"
                        >
                          <XCircle size={13} /> Reject
                        </button>
                      </>
                    )}
                    {["ACCEPTED", "CONFIRMED"].includes(b.status) && (
                      <button
                        type="button"
                        onClick={() => handleBookingStatus(b.id, "COMPLETED")}
                        className="rounded-xl bg-[#4A1513] px-3 py-2 text-xs font-bold text-white cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: PACKAGES */}
        {activeTab === "packages" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Your Styling Packages ({stylist.allPackages?.length || 0})
              </h2>
              <button
                type="button"
                onClick={() => {
                  setEditingPkgId(null);
                  setShowPkgForm(!showPkgForm);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#4A1513] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
              >
                <Plus size={14} /> Create Package
              </button>
            </div>

            {showPkgForm && (
              <form
                onSubmit={handlePackageSubmit}
                className="rounded-3xl border border-stone-200 bg-white p-6 space-y-4"
              >
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {editingPkgId ? "Edit Package" : "New Styling Package"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    value={pkgForm.title}
                    onChange={(e) => setPkgForm({ ...pkgForm, title: e.target.value })}
                    placeholder="Package Title *"
                    className="rounded-xl border border-stone-200 px-3 py-2 text-sm"
                  />
                  <select
                    value={pkgForm.packageType}
                    onChange={(e) => setPkgForm({ ...pkgForm, packageType: e.target.value })}
                    className="rounded-xl border border-stone-200 px-3 py-2 text-sm"
                  >
                    {STYLIST_PACKAGE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <input
                    required
                    type="number"
                    min={100}
                    value={pkgForm.price}
                    onChange={(e) => setPkgForm({ ...pkgForm, price: e.target.value })}
                    placeholder="Price (₹) *"
                    className="rounded-xl border border-stone-200 px-3 py-2 text-sm"
                  />
                  <input
                    required
                    type="text"
                    value={pkgForm.duration}
                    onChange={(e) => setPkgForm({ ...pkgForm, duration: e.target.value })}
                    placeholder="Duration (e.g., 90 mins)"
                    className="rounded-xl border border-stone-200 px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    min={1}
                    value={pkgForm.sessionsCount}
                    onChange={(e) => setPkgForm({ ...pkgForm, sessionsCount: e.target.value })}
                    placeholder="Number of sessions"
                    className="rounded-xl border border-stone-200 px-3 py-2 text-sm"
                  />
                  <select
                    value={pkgForm.deliveryMode}
                    onChange={(e) => setPkgForm({ ...pkgForm, deliveryMode: e.target.value })}
                    className="rounded-xl border border-stone-200 px-3 py-2 text-sm"
                  >
                    <option value="Online & Offline">Online &amp; Offline</option>
                    <option value="Online">Online Only</option>
                    <option value="Offline">In-Person Only</option>
                  </select>
                  <input
                    type="text"
                    value={pkgForm.location}
                    onChange={(e) => setPkgForm({ ...pkgForm, location: e.target.value })}
                    placeholder="Location (e.g., Chennai / Online)"
                    className="rounded-xl border border-stone-200 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={pkgForm.availability}
                    onChange={(e) => setPkgForm({ ...pkgForm, availability: e.target.value })}
                    placeholder="Booking availability"
                    className="rounded-xl border border-stone-200 px-3 py-2 text-sm"
                  />
                </div>
                <textarea
                  required
                  rows={3}
                  value={pkgForm.description}
                  onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })}
                  placeholder="Package description *"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={pkgForm.includedServicesText}
                  onChange={(e) => setPkgForm({ ...pkgForm, includedServicesText: e.target.value })}
                  placeholder="Included services (comma-separated)"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={pkgForm.addOnsText}
                  onChange={(e) => setPkgForm({ ...pkgForm, addOnsText: e.target.value })}
                  placeholder="Add-ons (Name: Price, comma-separated)"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
                />
                <input
                  type="url"
                  value={pkgForm.imageUrl}
                  onChange={(e) => setPkgForm({ ...pkgForm, imageUrl: e.target.value })}
                  placeholder="Package cover image URL (optional)"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPkgForm(false)}
                    className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-bold text-stone-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-[#4A1513] px-5 py-2 text-xs font-bold text-white cursor-pointer"
                  >
                    {saving ? "Saving..." : "Save Package"}
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(stylist.allPackages || []).map((pkg: any) => (
                <div key={pkg.id} className="rounded-2xl border border-stone-200 bg-white p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A1513] bg-rose-50 px-2.5 py-0.5 rounded-full">
                        {pkg.packageType}
                      </span>
                      <span className="font-serif text-lg font-bold text-[#4A1513]">
                        ₹{pkg.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif text-lg font-bold text-stone-900">{pkg.title}</h3>
                    <p className="mt-1 text-xs text-stone-600 line-clamp-2">{pkg.description}</p>
                    <p className="mt-2 text-[11px] text-stone-500">
                      {pkg.duration} · {pkg.sessionsCount} session(s) · {pkg.deliveryMode}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPkgId(pkg.id);
                        setPkgForm({
                          title: pkg.title,
                          packageType: pkg.packageType,
                          description: pkg.description,
                          price: String(pkg.price),
                          duration: pkg.duration,
                          sessionsCount: String(pkg.sessionsCount),
                          deliveryMode: pkg.deliveryMode,
                          location: pkg.location || "",
                          availability: pkg.availability || "",
                          includedServicesText: (pkg.includedServices || []).join(", "),
                          addOnsText: (pkg.addOns || []).map((a: any) => `${a.name}: ${a.price}`).join(", "),
                          imageUrl: pkg.images?.[0] || "",
                        });
                        setShowPkgForm(true);
                      }}
                      className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROFILE & PORTFOLIO */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSave} className="rounded-3xl border border-stone-200 bg-white p-6 space-y-4">
            <h2 className="font-serif text-xl font-bold text-stone-900">Manage Profile &amp; Portfolio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                placeholder="Full Name"
                className="rounded-xl border border-stone-200 px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="Phone"
                className="rounded-xl border border-stone-200 px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={profileForm.city}
                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                placeholder="City"
                className="rounded-xl border border-stone-200 px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={profileForm.location}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                placeholder="Neighborhood / Location"
                className="rounded-xl border border-stone-200 px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={profileForm.experience}
                onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                placeholder="Experience"
                className="rounded-xl border border-stone-200 px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={profileForm.availabilitySchedule}
                onChange={(e) => setProfileForm({ ...profileForm, availabilitySchedule: e.target.value })}
                placeholder="Availability Schedule"
                className="rounded-xl border border-stone-200 px-3 py-2 text-sm"
              />
            </div>
            <textarea
              rows={3}
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              placeholder="Biography"
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
            />

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Portfolio Images
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="Paste portfolio image URL"
                  className="flex-1 min-w-[200px] rounded-xl border border-stone-200 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (portfolioUrl.trim()) {
                      setPortfolioImages((prev) => [...prev, portfolioUrl.trim()]);
                      setPortfolioUrl("");
                    }
                  }}
                  className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-bold text-white cursor-pointer"
                >
                  Add URL
                </button>
                <label className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-stone-50 px-4 py-2 text-xs font-bold text-stone-700 cursor-pointer">
                  <ImagePlus size={14} /> Upload
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handlePortfolioUpload(f);
                    }}
                  />
                </label>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {portfolioImages.map((img, idx) => (
                  <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-stone-200">
                    <img src={img} alt="Portfolio" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPortfolioImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#4A1513] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        )}

        {/* TAB 4: EARNINGS */}
        {activeTab === "earnings" && (
          <div className="rounded-3xl border border-stone-200 bg-white p-6 space-y-4">
            <h2 className="font-serif text-xl font-bold text-stone-900">Earnings &amp; Commission Breakdown</h2>
            <p className="text-sm text-stone-600">
              Your current Femazon platform commission rate is{" "}
              <strong className="text-[#4A1513]">{stylist.earnings?.commissionRate || 15}%</strong>.
              Net earnings are calculated automatically on accepted, confirmed, and completed bookings.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 uppercase">
                    <th className="py-2 pr-4">Booking</th>
                    <th className="py-2 pr-4">Client</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Total</th>
                    <th className="py-2 pr-4">Commission</th>
                    <th className="py-2">Your Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {(stylist.bookings || []).map((b: any) => (
                    <tr key={b.id} className="border-b border-stone-100">
                      <td className="py-2.5 pr-4 font-medium">#{b.id} ({b.bookingDate})</td>
                      <td className="py-2.5 pr-4">{b.customerName}</td>
                      <td className="py-2.5 pr-4">{b.status}</td>
                      <td className="py-2.5 pr-4">₹{b.totalAmount.toLocaleString("en-IN")}</td>
                      <td className="py-2.5 pr-4 text-amber-700">-₹{b.commissionAmount.toLocaleString("en-IN")}</td>
                      <td className="py-2.5 font-bold text-emerald-700">₹{b.stylistEarnings.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
