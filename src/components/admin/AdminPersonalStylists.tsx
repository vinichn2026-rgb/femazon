"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Edit2,
  Star,
  Power,
  X,
  Package,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Award,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";

interface AdminPersonalStylistsProps {
  stylists: any[];
  onAction: (action: string, payload: any) => Promise<void>;
}

export function AdminPersonalStylists({ stylists, onAction }: AdminPersonalStylistsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedStylist, setSelectedStylist] = useState<any | null>(null);
  const [editingStylist, setEditingStylist] = useState<any | null>(null);
  const [rejectingStylist, setRejectingStylist] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    location: "",
    experience: "",
    experienceYears: 0,
    bio: "",
    specializations: "",
    availabilitySchedule: "",
    commissionRate: 15,
  });

  // Filter stylists
  const filteredStylists = useMemo(() => {
    return stylists.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.id.toString().includes(q) ||
        (s.fullName || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q) ||
        (s.phone || "").toLowerCase().includes(q) ||
        (s.city || "").toLowerCase().includes(q) ||
        (s.specializations || "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PENDING" && (s.status === "PENDING" || s.status === "UNDER_REVIEW")) ||
        (statusFilter === "APPROVED" && s.status === "APPROVED") ||
        (statusFilter === "SUSPENDED" && (s.status === "SUSPENDED" || !s.isActive)) ||
        (statusFilter === "REJECTED" && s.status === "REJECTED");

      return matchesSearch && matchesStatus;
    });
  }, [stylists, searchQuery, statusFilter]);

  const handleOpenEdit = (stylist: any) => {
    setEditingStylist(stylist);
    let specs = stylist.specializations || "";
    try {
      const parsed = JSON.parse(specs);
      if (Array.isArray(parsed)) specs = parsed.join(", ");
    } catch {}

    setEditFormData({
      fullName: stylist.fullName || "",
      email: stylist.email || "",
      phone: stylist.phone || "",
      city: stylist.city || "",
      location: stylist.location || "",
      experience: stylist.experience || "",
      experienceYears: stylist.experienceYears || 0,
      bio: stylist.bio || "",
      specializations: specs,
      availabilitySchedule: stylist.availabilitySchedule || "",
      commissionRate: stylist.commissionRate ?? 15,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStylist) return;
    setIsSubmitting(true);
    try {
      const specializationsArray = editFormData.specializations
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await onAction("UPDATE_STYLIST", {
        stylistId: editingStylist.id,
        ...editFormData,
        specializations: JSON.stringify(specializationsArray),
      });
      setEditingStylist(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingStylist) return;
    setIsSubmitting(true);
    try {
      await onAction("REJECT_STYLIST", {
        stylistId: rejectingStylist.id,
        rejectionReason: rejectionReason.trim() || "Application does not meet platform criteria",
      });
      setRejectingStylist(null);
      setRejectionReason("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Stats Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">
              Service Marketplace
            </span>
            <span className="text-xs text-stone-500">&bull; Certified Personal Stylists</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">Personal Stylists Management</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Oversee professional wardrobe consultants, bridal stylists, makeover artists and their curated service packages.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-center">
            <p className="text-[10px] text-stone-500 uppercase font-semibold">Total</p>
            <p className="text-base font-serif font-bold text-stone-900">{stylists.length}</p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 text-center">
            <p className="text-[10px] text-purple-800 uppercase font-semibold">Pending</p>
            <p className="text-base font-serif font-bold text-purple-900">
              {stylists.filter(s => s.status === 'PENDING' || s.status === 'UNDER_REVIEW').length}
            </p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-[10px] text-emerald-800 uppercase font-semibold">Verified</p>
            <p className="text-base font-serif font-bold text-emerald-900">
              {stylists.filter(s => s.status === 'APPROVED' && s.verified).length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by ID, Stylist Name, City, Specialisation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F5] rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-stone-800 placeholder:text-stone-400 border border-stone-200 focus:outline-none focus:border-[#4A1513]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 text-xs text-stone-600">
          <Filter size={14} className="text-stone-400" />
          <span className="font-semibold text-[11px] uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF7F5] border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#4A1513]"
          >
            <option value="ALL">All Stylists</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Verified &amp; Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Personal Stylists Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F5] border-b border-stone-200 text-stone-500 uppercase tracking-wider font-bold text-[10.5px]">
              <tr>
                <th className="px-5 py-4">Stylist ID</th>
                <th className="px-5 py-4">Professional</th>
                <th className="px-5 py-4">Contact &amp; Location</th>
                <th className="px-5 py-4">Specialisation</th>
                <th className="px-5 py-4 text-center">Packages</th>
                <th className="px-5 py-4 text-center">Bookings</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredStylists.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-stone-400">
                    <Sparkles size={36} className="mx-auto mb-2 text-stone-300 stroke-1" />
                    <p className="font-medium text-sm text-stone-600">No personal stylists found</p>
                    <p className="text-xs text-stone-400 mt-0.5">Stylists registered through the service portal will appear here.</p>
                  </td>
                </tr>
              ) : (
                filteredStylists.map((s) => {
                  const packagesCount = s.packages?.length || 0;
                  const bookingsCount = s.bookings?.length || 0;
                  const isApproved = s.status === "APPROVED";
                  const isPending = s.status === "PENDING" || s.status === "UNDER_REVIEW";
                  const isSuspended = s.status === "SUSPENDED" || !s.isActive;
                  const isRejected = s.status === "REJECTED";

                  let specializationsText = s.specializations;
                  try {
                    const parsed = JSON.parse(s.specializations);
                    if (Array.isArray(parsed)) specializationsText = parsed.slice(0, 2).join(", ");
                  } catch {}

                  return (
                    <tr key={s.id} className="hover:bg-[#FAF7F5]/50 transition">
                      
                      {/* Stylist ID */}
                      <td className="px-5 py-4 font-mono font-bold text-purple-900">
                        #ST-{s.id.toString().padStart(4, "0")}
                      </td>

                      {/* Professional Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.profileImage || "/images/placeholder.jpg"}
                            alt={s.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-purple-200 bg-stone-100 shrink-0"
                            onError={(e) => {
                              (e.currentTarget as any).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
                            }}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-stone-900 text-sm">{s.fullName}</p>
                              {s.featured && (
                                <span title="Featured Stylist">
                                  <Star size={12} className="text-amber-500 fill-amber-500" />
                                </span>
                              )}
                            </div>
                            <p className="text-stone-500 text-[11px]">{s.experience} experience</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact & Location */}
                      <td className="px-5 py-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <Mail size={12} className="text-stone-400 shrink-0" />
                          <span className="truncate max-w-[150px]">{s.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                          <MapPin size={12} className="text-stone-400 shrink-0" />
                          <span>{s.city || s.location || "Online"}</span>
                        </div>
                      </td>

                      {/* Specialisation */}
                      <td className="px-5 py-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-900 border border-purple-200 truncate max-w-[160px]">
                          {specializationsText || "Personal Styling"}
                        </span>
                      </td>

                      {/* Number of Packages */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-lg text-xs">
                          <Package size={12} className="text-stone-500" />
                          {packagesCount}
                        </span>
                      </td>

                      {/* Total Bookings */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-lg text-xs">
                          <Calendar size={12} className="text-stone-500" />
                          {bookingsCount}
                        </span>
                      </td>

                      {/* Status Badges */}
                      <td className="px-5 py-4">
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 size={12} />
                            Verified
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200 animate-pulse">
                            <AlertCircle size={12} />
                            Pending
                          </span>
                        )}
                        {isSuspended && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-600 border border-stone-300">
                            <Power size={12} />
                            Suspended
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                            <XCircle size={12} />
                            Rejected
                          </span>
                        )}
                      </td>

                      {/* Admin Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* View profile & review portfolio */}
                          <button
                            type="button"
                            onClick={() => setSelectedStylist(s)}
                            title="Review Profile & Portfolio"
                            className="p-1.5 rounded-lg text-stone-500 hover:text-purple-900 hover:bg-stone-100 transition cursor-pointer"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Toggle featured */}
                          <button
                            type="button"
                            onClick={() => onAction("TOGGLE_STYLIST_FEATURED", { stylistId: s.id })}
                            title={s.featured ? "Unfeature Stylist" : "Feature on Homepage"}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              s.featured
                                ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                                : "text-stone-400 hover:text-amber-600 hover:bg-stone-100"
                            }`}
                          >
                            <Star size={15} className={s.featured ? "fill-amber-500" : ""} />
                          </button>

                          {/* Edit permitted information */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(s)}
                            title="Edit Information"
                            className="p-1.5 rounded-lg text-stone-500 hover:text-blue-700 hover:bg-stone-100 transition cursor-pointer"
                          >
                            <Edit2 size={15} />
                          </button>

                          {/* Approve (if pending or rejected) */}
                          {!isApproved && (
                            <button
                              type="button"
                              onClick={() => onAction("APPROVE_STYLIST", { stylistId: s.id })}
                              title="Approve & Verify Stylist"
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
                            >
                              <Check size={12} />
                              Approve
                            </button>
                          )}

                          {/* Reject modal (if pending) */}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => {
                                setRejectingStylist(s);
                                setRejectionReason("");
                              }}
                              title="Reject Application"
                              className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] border border-rose-200 transition cursor-pointer"
                            >
                              Reject
                            </button>
                          )}

                          {/* Suspend / Activate toggle */}
                          {isApproved && (
                            <button
                              type="button"
                              onClick={() => onAction("SUSPEND_STYLIST", { stylistId: s.id })}
                              title="Suspend Stylist Account"
                              className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 font-bold text-[11px] transition cursor-pointer"
                            >
                              Suspend
                            </button>
                          )}

                          {isSuspended && (
                            <button
                              type="button"
                              onClick={() => onAction("ACTIVATE_STYLIST", { stylistId: s.id })}
                              title="Reactivate Stylist"
                              className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200 transition cursor-pointer"
                            >
                              Activate
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL DRAWER / PORTFOLIO REVIEW MODAL */}
      {selectedStylist && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStylist.profileImage || "/images/placeholder.jpg"}
                  alt={selectedStylist.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 shrink-0"
                />
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">{selectedStylist.fullName}</h3>
                  <p className="text-xs text-purple-900 font-mono">
                    Stylist #{selectedStylist.id} &bull; {selectedStylist.experience} Experience &bull; {selectedStylist.status}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStylist(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Content */}
            <div className="mt-6 space-y-5 text-xs">
              
              {/* Bio */}
              <div className="bg-[#FAF7F5] p-4 rounded-2xl border border-stone-100">
                <p className="text-[10px] text-stone-400 uppercase font-semibold mb-1">Professional Bio</p>
                <p className="text-xs text-stone-700 leading-relaxed">{selectedStylist.bio || "No biography submitted."}</p>
              </div>

              {/* Grid Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">City / Base</p>
                  <p className="text-xs font-bold text-stone-800 mt-0.5">{selectedStylist.city || selectedStylist.location || "N/A"}</p>
                </div>
                <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Contact Email</p>
                  <p className="text-xs font-bold text-stone-800 mt-0.5 truncate">{selectedStylist.email}</p>
                </div>
                <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Phone Number</p>
                  <p className="text-xs font-bold text-stone-800 mt-0.5">{selectedStylist.phone}</p>
                </div>
                <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Consultation Modes</p>
                  <p className="text-xs font-bold text-stone-800 mt-0.5">{selectedStylist.consultationModes || "Online & In-Person"}</p>
                </div>
                <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Availability</p>
                  <p className="text-xs font-bold text-stone-800 mt-0.5">{selectedStylist.availabilitySchedule || "Standard Hours"}</p>
                </div>
                <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Platform Commission</p>
                  <p className="text-xs font-bold text-stone-800 mt-0.5">{selectedStylist.commissionRate || 15}%</p>
                </div>
              </div>

              {/* Service Packages */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                  Service Packages ({selectedStylist.packages?.length || 0})
                </p>
                {(!selectedStylist.packages || selectedStylist.packages.length === 0) ? (
                  <p className="text-stone-400 italic">No packages published yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedStylist.packages.map((pkg: any) => (
                      <div key={pkg.id} className="p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-stone-900 text-xs">{pkg.title}</p>
                          <span className="font-bold text-purple-900">₹{pkg.price}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{pkg.description}</p>
                        <p className="text-[10px] text-stone-400 mt-1.5">{pkg.duration} &bull; {pkg.deliveryMode}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Portfolio Review / Gallery */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5 flex items-center gap-1.5">
                  <ImageIcon size={14} />
                  <span>Portfolio &amp; Lookbook Showcase</span>
                </p>
                {(!selectedStylist.portfolios || selectedStylist.portfolios.length === 0) ? (
                  <p className="text-stone-400 italic">No portfolio lookbook images uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {selectedStylist.portfolios.map((item: any) => (
                      <div key={item.id} className="group relative rounded-xl overflow-hidden border border-stone-200 aspect-square bg-stone-100">
                        <img
                          src={item.imageUrl}
                          alt={item.caption || "Portfolio item"}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        {item.caption && (
                          <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/60 text-white text-[10px] truncate">
                            {item.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  {selectedStylist.rejectionReason && (
                    <p className="text-[11px] text-rose-600">Rejection: {selectedStylist.rejectionReason}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const s = selectedStylist;
                      setSelectedStylist(null);
                      handleOpenEdit(s);
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold transition"
                  >
                    Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStylist(null)}
                    className="px-4 py-2 rounded-xl bg-[#4A1513] text-white font-bold hover:bg-[#350B0A] transition"
                  >
                    Done
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* REJECT WITH REASON MODAL */}
      {rejectingStylist && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleConfirmReject} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="font-serif text-lg font-bold text-stone-900">Reject Stylist Application</h3>
              <button
                type="button"
                onClick={() => setRejectingStylist(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-stone-600 mb-3">
              Please specify a reason for rejecting <strong className="text-stone-900">{rejectingStylist.fullName}</strong>. This note will help the stylist understand what documentation or portfolio requirements were missing.
            </p>

            <textarea
              required
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Portfolio does not contain verifiable client lookbooks. Please attach authentic work samples and reapply."
              className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-[#4A1513] resize-none"
            />

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingStylist(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                {isSubmitting && <Loader2 size={13} className="animate-spin" />}
                <span>Confirm Rejection</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingStylist && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">Edit Stylist Profile</h3>
                <p className="text-xs text-stone-500">Updating verified credentials for #{editingStylist.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingStylist(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={editFormData.fullName}
                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#4A1513]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#4A1513]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#4A1513]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    City / Base Location
                  </label>
                  <input
                    type="text"
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value, location: e.target.value })}
                    className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#4A1513]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Experience (e.g. 5+ Years)
                  </label>
                  <input
                    type="text"
                    value={editFormData.experience}
                    onChange={(e) => setEditFormData({ ...editFormData, experience: e.target.value })}
                    className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#4A1513]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    value={editFormData.commissionRate}
                    onChange={(e) => setEditFormData({ ...editFormData, commissionRate: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#4A1513]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Specialisations (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Bridal Styling, Wardrobe Audit, Color Analysis"
                  value={editFormData.specializations}
                  onChange={(e) => setEditFormData({ ...editFormData, specializations: e.target.value })}
                  className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#4A1513]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Bio / Overview
                </label>
                <textarea
                  rows={2}
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                  className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#4A1513] resize-none"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingStylist(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#4A1513] hover:bg-[#350B0A] text-white font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
