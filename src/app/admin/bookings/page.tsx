"use client";

import React, { useEffect, useState } from "react";
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  UserCircle2, 
  ShieldCheck, 
  Search, 
  Filter,
  Sparkles,
  PhoneCall,
  Save,
  Check
} from "lucide-react";

interface AdminBooking {
  id: number;
  date: string;
  time: string;
  location: string;
  total: number;
  status: string;
  customerName?: string;
  customerPhone?: string;
  supporterName?: string;
  notes?: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  service: {
    id: number;
    name: string;
    basePrice: number;
  };
}

const STATUS_OPTIONS = [
  { value: "REQUEST_RECEIVED", label: "Request Received" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "SUPPORTER_ASSIGNED", label: "Supporter Assigned" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" }
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editSupporter, setEditSupporter] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<number | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error("Error loading admin bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStartEdit = (b: AdminBooking) => {
    setEditingId(b.id);
    setEditStatus(b.status);
    setEditSupporter(b.supporterName || "");
    setEditPrice(String(b.total));
  };

  const handleSaveEdit = async (bookingId: number) => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          supporterName: editSupporter,
          total: Number(editPrice)
        })
      });

      if (res.ok) {
        setSaveSuccess(bookingId);
        setTimeout(() => setSaveSuccess(null), 2500);
        setEditingId(null);
        await fetchBookings();
      } else {
        alert("Failed to update booking status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving updates.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      (b.customerName || b.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.customerPhone || b.user?.phone || "").includes(searchTerm) ||
      (b.service?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(b.id).includes(searchTerm);
    
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-stone-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4A1513] mb-1">
              <ShieldCheck size={16} />
              <span>Femazon Operations Center</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-stone-900">
              Managed Service Bookings
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              Review incoming customer requests, assign internal supporters, and confirm schedules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-white border border-stone-200 px-4 py-2 rounded-full text-xs font-bold text-stone-700 shadow-xs">
              Total Requests: {bookings.length}
            </span>
            <button
              onClick={fetchBookings}
              className="bg-[#4A1513] hover:bg-[#350B0A] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-6 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by customer, phone, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#4A1513]"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter size={16} className="text-stone-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 py-2 px-3.5 rounded-xl focus:outline-none focus:border-[#4A1513]"
            >
              <option value="ALL">All Statuses</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bookings Table / Cards */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200">
            <p className="text-stone-500 text-sm">Loading bookings from database...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200">
            <p className="text-stone-500 text-sm">No service bookings match your filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const isEditing = editingId === b.id;

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs hover:shadow-sm transition space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-bold text-xs uppercase tracking-wider text-[#4A1513] bg-[#FAF6F0] px-3 py-1 rounded-full border border-[#E8DFD5]">
                        #{b.id}
                      </span>
                      <h3 className="text-lg font-serif font-bold text-stone-900">
                        {b.service?.name}
                      </h3>
                      <span className="text-xs text-stone-400">
                        Received: {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <button
                            disabled={isSaving}
                            onClick={() => handleSaveEdit(b.id)}
                            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition cursor-pointer"
                          >
                            <Save size={13} />
                            <span>{isSaving ? "Saving..." : "Save"}</span>
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(b)}
                          className="bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition cursor-pointer"
                        >
                          Manage Request
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600">
                    {/* Customer Info */}
                    <div className="space-y-1.5 bg-[#FAF8F5] p-3.5 rounded-xl border border-stone-200/60">
                      <span className="font-bold text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                        Customer Details
                      </span>
                      <p className="font-semibold text-stone-900 text-sm">
                        {b.customerName || b.user?.name || "Customer"}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <PhoneCall size={12} className="text-[#4A1513]" />
                        <span>{b.customerPhone || b.user?.phone || "No phone provided"}</span>
                      </p>
                      <p className="text-stone-500 truncate">{b.user?.email}</p>
                    </div>

                    {/* Schedule & Location */}
                    <div className="space-y-1.5 bg-[#FAF8F5] p-3.5 rounded-xl border border-stone-200/60">
                      <span className="font-bold text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                        Schedule & Address
                      </span>
                      <p className="flex items-center gap-1.5 font-semibold text-stone-800">
                        <CalendarDays size={13} className="text-[#4A1513]" />
                        <span>{b.date} • {b.time}</span>
                      </p>
                      <p className="flex items-start gap-1.5">
                        <MapPin size={13} className="text-[#4A1513] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{b.location}</span>
                      </p>
                      {b.notes && (
                        <p className="text-stone-500 italic mt-1 line-clamp-2">
                          Note: "{b.notes}"
                        </p>
                      )}
                    </div>

                    {/* Assignment & Management Status */}
                    <div className="space-y-2.5 bg-[#FAF8F5] p-3.5 rounded-xl border border-stone-200/60">
                      <span className="font-bold text-[11px] uppercase tracking-wider text-stone-400 block">
                        Assignment & Status
                      </span>

                      {isEditing ? (
                        <div className="space-y-2">
                          <div>
                            <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                              Status
                            </label>
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded-lg p-1.5 text-xs font-semibold"
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                              Assign Internal Specialist
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Meera S. (Senior Artist)"
                              value={editSupporter}
                              onChange={(e) => setEditSupporter(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded-lg p-1.5 text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                              Confirmed Amount (₹)
                            </label>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded-lg p-1.5 text-xs font-bold"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-stone-500">Status:</span>
                            <span className="font-bold text-stone-900 bg-white px-2.5 py-0.5 rounded-md border border-stone-200">
                              {b.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-stone-500">Assigned To:</span>
                            <span className="font-semibold text-stone-800">
                              {b.supporterName || "Pending Assignment"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-stone-200/50">
                            <span className="text-stone-500">Total Price:</span>
                            <span className="font-serif font-bold text-sm text-[#4A1513]">
                              ₹{b.total.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {saveSuccess === b.id && (
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5">
                      <Check size={14} />
                      <span>Booking status and supporter details updated successfully!</span>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
