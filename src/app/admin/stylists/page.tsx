"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  XCircle,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { STYLIST_APPLICATION_STATUSES } from "@/lib/stylistTypes";

export default function AdminStylistsPage() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"stylists" | "packages" | "bookings" | "reviews">("stylists");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [data, setData] = useState<{
    stylists: any[];
    packages: any[];
    bookings: any[];
    reviews: any[];
  }>({ stylists: [], packages: [], bookings: [], reviews: [] });

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/stylists");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unauthorized or failed to load");
      setData(json);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unable to load stylists.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const runAdminAction = async (action: string, payload: Record<string, unknown>) => {
    try {
      const res = await fetch("/api/admin/stylists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Action failed");
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action failed");
    }
  };

  const filteredStylists = data.stylists.filter(
    (s) => statusFilter === "ALL" || s.status === statusFilter
  );

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-stone-900">
      <AdminNavbar currentSection="Personal Stylists" />

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#4A1513]">
              Admin Marketplace Control
            </span>
            <h1 className="font-serif text-3xl font-bold text-stone-900">
              Personal Stylists Management
            </h1>
          </div>
          <Link
            href="/admin"
            className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-700 hover:border-[#4A1513]"
          >
            Back to Admin Overview
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
          {[
            { id: "stylists", label: `Stylists (${data.stylists.length})`, icon: Sparkles },
            { id: "packages", label: `Packages (${data.packages.length})`, icon: Package },
            { id: "bookings", label: `Bookings (${data.bookings.length})`, icon: Calendar },
            { id: "reviews", label: `Reviews & Complaints (${data.reviews.length})`, icon: Star },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id as any)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                activeTab === id
                  ? "bg-[#4A1513] text-white"
                  : "bg-white text-stone-700 border border-stone-200"
              }`}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#4A1513]" size={28} />
          </div>
        ) : errorMsg ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
            {errorMsg}
          </div>
        ) : (
          <>
            {/* TAB 1: STYLIST REGISTRATIONS & ACCOUNTS */}
            {activeTab === "stylists" && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {["ALL", ...STYLIST_APPLICATION_STATUSES].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-bold cursor-pointer ${
                        statusFilter === st
                          ? "bg-[#4A1513] text-white"
                          : "bg-white border border-stone-200 text-stone-700"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {filteredStylists.length === 0 ? (
                  <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
                    No stylist applications in this status.
                  </div>
                ) : (
                  filteredStylists.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 shadow-2xs"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-4">
                          <img
                            src={s.profileImage || "/femazon-emblem.png"}
                            alt={s.fullName}
                            className="h-16 w-16 rounded-2xl object-cover border border-stone-200 bg-stone-100 shrink-0"
                          />
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="font-serif text-xl font-bold text-stone-900">
                                {s.fullName}
                              </h2>
                              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-stone-700">
                                {s.status}
                              </span>
                              {s.verified && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                                  <ShieldCheck size={11} /> Verified
                                </span>
                              )}
                              {s.featured && (
                                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                                  Featured Homepage
                                </span>
                              )}
                              {!s.isActive && (
                                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700">
                                  Disabled
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-500 mt-1">
                              {s.email} · {s.phone} · {s.city} ({s.location}) · {s.experience}
                            </p>
                            <p className="text-xs text-stone-600 mt-2 max-w-3xl">{s.bio}</p>
                            <p className="text-[11px] text-stone-500 mt-1">
                              Packages: {s._count?.packages || 0} · Bookings: {s._count?.bookings || 0} · Reviews: {s._count?.reviews || 0}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => runAdminAction("UPDATE_STATUS", { stylistId: s.id, status: "UNDER_REVIEW" })}
                            className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 cursor-pointer"
                          >
                            Under Review
                          </button>
                          <button
                            type="button"
                            onClick={() => runAdminAction("UPDATE_STATUS", { stylistId: s.id, status: "APPROVED", verified: true })}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                          >
                            <CheckCircle2 size={12} /> Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const reason = prompt("Reason for rejection (optional):") || "";
                              runAdminAction("UPDATE_STATUS", { stylistId: s.id, status: "REJECTED", rejectionReason: reason });
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                          >
                            <XCircle size={12} /> Reject
                          </button>
                        </div>
                      </div>

                      {/* Controls Row */}
                      <div className="flex flex-wrap items-center gap-3 border-t border-stone-100 pt-3 text-xs">
                        <button
                          type="button"
                          onClick={() => runAdminAction("TOGGLE_VERIFY", { stylistId: s.id, verified: !s.verified })}
                          className="rounded-lg border border-stone-200 px-3 py-1.5 font-semibold text-stone-700 hover:border-[#4A1513] cursor-pointer"
                        >
                          {s.verified ? "Remove Verification" : "Mark Verified"}
                        </button>
                        <button
                          type="button"
                          onClick={() => runAdminAction("TOGGLE_FEATURED", { stylistId: s.id, featured: !s.featured })}
                          className="rounded-lg border border-stone-200 px-3 py-1.5 font-semibold text-stone-700 hover:border-[#4A1513] cursor-pointer"
                        >
                          {s.featured ? "Unfeature from Homepage" : "Feature on Homepage"}
                        </button>
                        <button
                          type="button"
                          onClick={() => runAdminAction("TOGGLE_ACTIVE", { stylistId: s.id, isActive: !s.isActive })}
                          className="rounded-lg border border-stone-200 px-3 py-1.5 font-semibold text-stone-700 hover:border-[#4A1513] cursor-pointer"
                        >
                          {s.isActive ? "Disable Account" : "Enable Account"}
                        </button>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <span className="text-stone-500">Commission %:</span>
                          <input
                            type="number"
                            min={0}
                            max={50}
                            defaultValue={s.commissionRate}
                            onBlur={(e) =>
                              runAdminAction("UPDATE_COMMISSION", {
                                stylistId: s.id,
                                commissionRate: Number(e.target.value),
                              })
                            }
                            className="w-16 rounded-lg border border-stone-200 px-2 py-1 text-xs font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: PACKAGES */}
            {activeTab === "packages" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.packages.map((pkg) => (
                  <div key={pkg.id} className="rounded-2xl border border-stone-200 bg-white p-5 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#4A1513]">
                        {pkg.stylist?.fullName} ({pkg.stylist?.city})
                      </span>
                      <h3 className="font-serif text-lg font-bold text-stone-900">{pkg.title}</h3>
                      <p className="text-xs text-stone-500">
                        {pkg.packageType} · ₹{pkg.price.toLocaleString("en-IN")} · {pkg.duration}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => runAdminAction("TOGGLE_PACKAGE_ACTIVE", { packageId: pkg.id, isActive: !pkg.isActive })}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer ${
                        pkg.isActive ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {pkg.isActive ? "Active" : "Paused"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: BOOKINGS */}
            {activeTab === "bookings" && (
              <div className="rounded-2xl border border-stone-200 bg-white p-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-500 uppercase">
                      <th className="py-2 pr-4">ID</th>
                      <th className="py-2 pr-4">Stylist</th>
                      <th className="py-2 pr-4">Customer</th>
                      <th className="py-2 pr-4">Package</th>
                      <th className="py-2 pr-4">Schedule</th>
                      <th className="py-2 pr-4">Total</th>
                      <th className="py-2 pr-4">Commission</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.bookings.map((b) => (
                      <tr key={b.id} className="border-b border-stone-100">
                        <td className="py-2.5 pr-4 font-bold">#{b.id}</td>
                        <td className="py-2.5 pr-4">{b.stylist?.fullName}</td>
                        <td className="py-2.5 pr-4">{b.customerName} ({b.customerPhone})</td>
                        <td className="py-2.5 pr-4">{b.package?.title || "Session"}</td>
                        <td className="py-2.5 pr-4">{b.bookingDate} · {b.bookingTime}</td>
                        <td className="py-2.5 pr-4 font-bold">₹{b.totalAmount.toLocaleString("en-IN")}</td>
                        <td className="py-2.5 pr-4 text-emerald-700">₹{b.commissionAmount.toLocaleString("en-IN")}</td>
                        <td className="py-2.5 font-semibold">{b.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 4: REVIEWS & COMPLAINTS */}
            {activeTab === "reviews" && (
              <div className="space-y-3">
                {data.reviews.map((rev) => (
                  <div key={rev.id} className="rounded-2xl border border-stone-200 bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-stone-900">{rev.customerName}</span>
                        <span className="text-xs text-stone-500">for {rev.stylist?.fullName}</span>
                        <span className="text-xs font-bold text-amber-600">{rev.rating}/5</span>
                        {rev.isComplaint && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700">
                            <AlertTriangle size={11} /> Complaint ({rev.complaintStatus})
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-stone-600">{rev.comment}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => runAdminAction("MODERATE_REVIEW", { reviewId: rev.id, isVisible: !rev.isVisible })}
                        className="inline-flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold cursor-pointer"
                      >
                        {rev.isVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                        <span>{rev.isVisible ? "Hide" : "Show"}</span>
                      </button>
                      {rev.isComplaint && rev.complaintStatus === "OPEN" && (
                        <button
                          type="button"
                          onClick={() => runAdminAction("MODERATE_REVIEW", { reviewId: rev.id, complaintStatus: "RESOLVED" })}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                        >
                          Resolve Complaint
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
