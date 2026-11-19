"use client";

import React, { useState, useMemo } from "react";
import {
  Store,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Edit2,
  AlertTriangle,
  Power,
  X,
  Package,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Loader2,
  Check
} from "lucide-react";

interface AdminProductVendorsProps {
  vendors: any[];
  onAction: (action: string, payload: any) => Promise<void>;
}

export function AdminProductVendors({ vendors, onAction }: AdminProductVendorsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [editingVendor, setEditingVendor] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    address: "",
    businessCategory: "Women's Wear",
    gstNumber: "",
    description: ""
  });

  // Filter vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.id.toString().includes(q) ||
        (v.businessName || "").toLowerCase().includes(q) ||
        (v.ownerName || "").toLowerCase().includes(q) ||
        (v.email || v.user?.email || "").toLowerCase().includes(q) ||
        (v.phone || "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PENDING" && (v.status === "PENDING" || v.status === "UNDER_REVIEW")) ||
        (statusFilter === "APPROVED" && v.status === "APPROVED") ||
        (statusFilter === "SUSPENDED" && v.status === "SUSPENDED") ||
        (statusFilter === "REJECTED" && v.status === "REJECTED");

      const matchesCategory =
        categoryFilter === "ALL" ||
        (v.businessCategory || "").toLowerCase().includes(categoryFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [vendors, searchQuery, statusFilter, categoryFilter]);

  const handleOpenEdit = (vendor: any) => {
    setEditingVendor(vendor);
    setEditFormData({
      businessName: vendor.businessName || "",
      ownerName: vendor.ownerName || "",
      phone: vendor.phone || "",
      address: vendor.address || "",
      businessCategory: vendor.businessCategory || "Women's Wear",
      gstNumber: vendor.gstNumber || "",
      description: vendor.description || ""
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVendor) return;
    setIsSubmitting(true);
    try {
      await onAction("UPDATE_VENDOR", {
        vendorId: editingVendor.id,
        ...editFormData
      });
      setEditingVendor(null);
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
            <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
              Women&apos;s Gallery
            </span>
            <span className="text-xs text-stone-500">&bull; External Merchant Network</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">Product Vendors Management</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Supervise registered fashion boutiques, jewellery artisans, and beauty brands selling physical products.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-center">
            <p className="text-[10px] text-stone-500 uppercase font-semibold">Total</p>
            <p className="text-base font-serif font-bold text-stone-900">{vendors.length}</p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <p className="text-[10px] text-amber-800 uppercase font-semibold">Pending</p>
            <p className="text-base font-serif font-bold text-amber-900">
              {vendors.filter(v => v.status === 'PENDING' || v.status === 'UNDER_REVIEW').length}
            </p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-[10px] text-emerald-800 uppercase font-semibold">Approved</p>
            <p className="text-base font-serif font-bold text-emerald-900">
              {vendors.filter(v => v.status === 'APPROVED').length}
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
            placeholder="Search by ID, Boutique Name, Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F5] rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-stone-800 placeholder:text-stone-400 border border-stone-200 focus:outline-none focus:border-[#4A1513]"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <Filter size={14} className="text-stone-400" />
            <span className="font-semibold text-[11px] uppercase tracking-wider">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FAF7F5] border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#4A1513]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="APPROVED">Approved / Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <span className="font-semibold text-[11px] uppercase tracking-wider">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#FAF7F5] border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#4A1513]"
            >
              <option value="ALL">All Categories</option>
              <option value="Women's Wear">Women&apos;s Wear</option>
              <option value="Beauty Care">Beauty Care</option>
              <option value="Jewellery">Jewellery &amp; Accessories</option>
              <option value="Gifts">Gifts for All Occasions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Vendors Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F5] border-b border-stone-200 text-stone-500 uppercase tracking-wider font-bold text-[10.5px]">
              <tr>
                <th className="px-5 py-4">Vendor ID</th>
                <th className="px-5 py-4">Boutique &amp; Owner</th>
                <th className="px-5 py-4">Contact Info</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4 text-center">Products</th>
                <th className="px-5 py-4">Registration</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-stone-400">
                    <Store size={36} className="mx-auto mb-2 text-stone-300 stroke-1" />
                    <p className="font-medium text-sm text-stone-600">No product vendors found</p>
                    <p className="text-xs text-stone-400 mt-0.5">Vendors who register on /seller/register will appear here.</p>
                  </td>
                </tr>
              ) : (
                filteredVendors.map((v) => {
                  const productsCount = v.user?.products?.length || 0;
                  const isApproved = v.status === "APPROVED";
                  const isPending = v.status === "PENDING" || v.status === "UNDER_REVIEW";
                  const isSuspended = v.status === "SUSPENDED";
                  const isRejected = v.status === "REJECTED";

                  return (
                    <tr key={v.id} className="hover:bg-[#FAF7F5]/50 transition">
                      
                      {/* Vendor ID */}
                      <td className="px-5 py-4 font-mono font-bold text-[#4A1513]">
                        #VN-{v.id.toString().padStart(4, "0")}
                      </td>

                      {/* Boutique & Owner */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-stone-900 text-sm">{v.businessName || "Unnamed Boutique"}</p>
                        <p className="text-stone-500 text-[11px] mt-0.5">{v.ownerName || "Boutique Representative"}</p>
                      </td>

                      {/* Contact Info */}
                      <td className="px-5 py-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <Mail size={12} className="text-stone-400 shrink-0" />
                          <span className="truncate max-w-[170px]">{v.email || v.user?.email || "N/A"}</span>
                        </div>
                        {v.phone && (
                          <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                            <Phone size={12} className="text-stone-400 shrink-0" />
                            <span>{v.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Product Category */}
                      <td className="px-5 py-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                          {v.businessCategory || "Women's Wear"}
                        </span>
                      </td>

                      {/* Total Products */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-lg text-xs">
                          <Package size={12} className="text-stone-500" />
                          {productsCount}
                        </span>
                      </td>

                      {/* Registration Date */}
                      <td className="px-5 py-4 text-stone-500 text-[11px]">
                        {new Date(v.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>

                      {/* Status Badges */}
                      <td className="px-5 py-4">
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 size={12} />
                            Approved
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                            <AlertTriangle size={12} />
                            Pending Review
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
                          
                          {/* View details drawer */}
                          <button
                            type="button"
                            onClick={() => setSelectedVendor(v)}
                            title="View Full Profile"
                            className="p-1.5 rounded-lg text-stone-500 hover:text-[#4A1513] hover:bg-stone-100 transition cursor-pointer"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Edit permitted information */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(v)}
                            title="Edit Information"
                            className="p-1.5 rounded-lg text-stone-500 hover:text-blue-700 hover:bg-stone-100 transition cursor-pointer"
                          >
                            <Edit2 size={15} />
                          </button>

                          {/* Approve (if pending or rejected) */}
                          {!isApproved && (
                            <button
                              type="button"
                              onClick={() => onAction("APPROVE_VENDOR", { vendorId: v.id })}
                              title="Approve Vendor"
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
                            >
                              <Check size={12} />
                              Approve
                            </button>
                          )}

                          {/* Reject (if pending) */}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => onAction("REJECT_VENDOR", { vendorId: v.id })}
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
                              onClick={() => onAction("SUSPEND_VENDOR", { vendorId: v.id })}
                              title="Suspend Vendor Account"
                              className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 font-bold text-[11px] transition cursor-pointer"
                            >
                              Suspend
                            </button>
                          )}

                          {isSuspended && (
                            <button
                              type="button"
                              onClick={() => onAction("ACTIVATE_VENDOR", { vendorId: v.id })}
                              title="Reactivate Vendor"
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

      {/* DETAIL DRAWER / MODAL */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#4A1513]/10 text-[#4A1513] flex items-center justify-center font-bold">
                  <Store size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">{selectedVendor.businessName}</h3>
                  <p className="text-xs text-stone-500 font-mono">Vendor #{selectedVendor.id} &bull; {selectedVendor.status}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVendor(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Owner Name</p>
                  <p className="text-sm font-bold text-stone-800 mt-0.5">{selectedVendor.ownerName || "N/A"}</p>
                </div>
                <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Product Category</p>
                  <p className="text-sm font-bold text-stone-800 mt-0.5">{selectedVendor.businessCategory || "Women's Wear"}</p>
                </div>
                <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Registered Email</p>
                  <p className="text-sm font-bold text-stone-800 mt-0.5 truncate">{selectedVendor.email || selectedVendor.user?.email}</p>
                </div>
                <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Phone Number</p>
                  <p className="text-sm font-bold text-stone-800 mt-0.5">{selectedVendor.phone || "N/A"}</p>
                </div>
              </div>

              <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                <p className="text-[10px] text-stone-400 uppercase font-semibold">Physical Address / Studio</p>
                <p className="text-xs text-stone-700 mt-0.5">{selectedVendor.address || "No address provided."}</p>
              </div>

              <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                <p className="text-[10px] text-stone-400 uppercase font-semibold">GST / Tax Identification</p>
                <p className="text-xs font-mono font-bold text-stone-800 mt-0.5">{selectedVendor.gstNumber || "Not submitted"}</p>
              </div>

              <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                <p className="text-[10px] text-stone-400 uppercase font-semibold">Boutique Description</p>
                <p className="text-xs text-stone-700 mt-0.5 leading-relaxed">{selectedVendor.description || "No description supplied."}</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-stone-500">Registered on: {new Date(selectedVendor.createdAt).toLocaleString()}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const v = selectedVendor;
                      setSelectedVendor(null);
                      handleOpenEdit(v);
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold transition"
                  >
                    Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedVendor(null)}
                    className="px-4 py-2 rounded-xl bg-[#4A1513] text-white font-bold hover:bg-[#350B0A] transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingVendor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">Edit Vendor Information</h3>
                <p className="text-xs text-stone-500">Updating permitted credentials for #{editingVendor.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingVendor(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Business / Boutique Name
                </label>
                <input
                  required
                  type="text"
                  value={editFormData.businessName}
                  onChange={(e) => setEditFormData({ ...editFormData, businessName: e.target.value })}
                  className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#4A1513]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.ownerName}
                    onChange={(e) => setEditFormData({ ...editFormData, ownerName: e.target.value })}
                    className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#4A1513]"
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Product Category
                  </label>
                  <select
                    value={editFormData.businessCategory}
                    onChange={(e) => setEditFormData({ ...editFormData, businessCategory: e.target.value })}
                    className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#4A1513]"
                  >
                    <option value="Women's Wear">Women&apos;s Wear</option>
                    <option value="Beauty Care">Beauty Care</option>
                    <option value="Jewellery & Accessories">Jewellery &amp; Accessories</option>
                    <option value="Gifts for All Occasions">Gifts for All Occasions</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.gstNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, gstNumber: e.target.value })}
                    className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#4A1513]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#4A1513]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#4A1513] resize-none"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingVendor(null)}
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
