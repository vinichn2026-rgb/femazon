"use client";

import React, { useState, useMemo } from "react";
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Power,
  Store,
  Tag,
  AlertTriangle,
  X,
  ExternalLink,
  Layers,
  Check
} from "lucide-react";

interface AdminVendorProductsProps {
  products: any[];
  categories: any[];
  onAction: (action: string, payload: any) => Promise<void>;
}

export function AdminVendorProducts({ products, categories, onAction }: AdminVendorProductsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [approvalFilter, setApprovalFilter] = useState("ALL");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.id.toString().includes(q) ||
        (p.name || "").toLowerCase().includes(q) ||
        (p.sku || "").toLowerCase().includes(q) ||
        (p.vendor?.vendorProfile?.businessName || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "ALL" ||
        (p.category || "").toLowerCase() === categoryFilter.toLowerCase();

      const matchesApproval =
        approvalFilter === "ALL" ||
        (approvalFilter === "PENDING"
          ? (p.approvalStatus === "PENDING" || p.approvalStatus === "SUBMITTED")
          : (p.approvalStatus || "APPROVED") === approvalFilter);

      return matchesSearch && matchesCategory && matchesApproval;
    });
  }, [products, searchQuery, categoryFilter, approvalFilter]);

  return (
    <div className="space-y-6">
      
      {/* Header & Notice */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-900 px-2 py-0.5 rounded-full">
              Catalog Governance
            </span>
            <span className="text-xs text-stone-500">&bull; External Vendor Submissions</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">Vendor Products Catalog</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor, approve and moderate merchandise listed by independent sellers. (Femazon operator policy: Admin products are prohibited).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-center">
            <p className="text-[10px] text-stone-500 uppercase font-semibold">Total</p>
            <p className="text-base font-serif font-bold text-stone-900">{products.length}</p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <p className="text-[10px] text-amber-800 uppercase font-semibold">Pending Review</p>
            <p className="text-base font-serif font-bold text-amber-900">
              {products.filter(p => p.approvalStatus === 'PENDING' || p.approvalStatus === 'SUBMITTED').length}
            </p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-[10px] text-emerald-800 uppercase font-semibold">Approved</p>
            <p className="text-base font-serif font-bold text-emerald-900">
              {products.filter(p => p.approvalStatus === 'APPROVED').length}
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
            placeholder="Search by Product, SKU, Vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F5] rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-stone-800 placeholder:text-stone-400 border border-stone-200 focus:outline-none focus:border-[#4A1513]"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Approval Filter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <Filter size={14} className="text-stone-400" />
            <span className="font-semibold text-[11px] uppercase tracking-wider">Approval:</span>
            <select
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value)}
              className="bg-[#FAF7F5] border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#4A1513]"
            >
              <option value="ALL">All Items</option>
              <option value="PENDING">Pending Review</option>
              <option value="APPROVED">Approved</option>
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
              <option value="Jewellery & Accessories">Jewellery &amp; Accessories</option>
              <option value="Gifts for All Occasions">Gifts for All Occasions</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F5] border-b border-stone-200 text-stone-500 uppercase tracking-wider font-bold text-[10.5px]">
              <tr>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Vendor Boutique</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4 text-center">Stock</th>
                <th className="px-5 py-4">Approval Status</th>
                <th className="px-5 py-4 text-center">Visibility</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-stone-400">
                    <Package size={36} className="mx-auto mb-2 text-stone-300 stroke-1" />
                    <p className="font-medium text-sm text-stone-600">No vendor products found</p>
                    <p className="text-xs text-stone-400 mt-0.5">Approved vendor listings will populate automatically.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isApproved = p.approvalStatus === "APPROVED";
                  const isPending = p.approvalStatus === "PENDING" || p.approvalStatus === "SUBMITTED";
                  const isRejected = p.approvalStatus === "REJECTED";
                  const isDraft = p.approvalStatus === "DRAFT";
                  const vendorName = p.vendor?.vendorProfile?.businessName || p.vendor?.name || `Vendor #${p.vendorId || "N/A"}`;

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF7F5]/50 transition">
                      
                      {/* Product Thumbnail & Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image || "/images/placeholder.jpg"}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200 bg-stone-100 shrink-0"
                            onError={(e) => {
                              (e.currentTarget as any).src = "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=150&q=80";
                            }}
                          />
                          <div>
                            <p className="font-bold text-stone-900 text-sm max-w-[200px] truncate">{p.name}</p>
                            <p className="text-stone-400 text-[11px] font-mono">SKU: {p.sku || `FZ-${p.id}`}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                          {p.category || "Women's Wear"}
                        </span>
                      </td>

                      {/* Vendor Boutique */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-stone-800 font-semibold">
                          <Store size={13} className="text-amber-800 shrink-0" />
                          <span className="truncate max-w-[150px]">{vendorName}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-stone-900 text-sm">₹{p.price}</p>
                        {p.discountPrice && (
                          <p className="text-[11px] text-stone-400 line-through">₹{p.discountPrice}</p>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4 text-center font-bold text-stone-700">
                        {p.stock ?? 25}
                      </td>

                      {/* Approval Status */}
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
                            {p.approvalStatus === "SUBMITTED" ? "Submitted" : "Pending"}
                          </span>
                        )}
                        {isDraft && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                            Draft
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                            <XCircle size={12} />
                            Rejected
                          </span>
                        )}
                      </td>

                      {/* Visibility Toggle */}
                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => onAction("TOGGLE_PRODUCT_ACTIVE", { productId: p.id })}
                          title={p.approvalStatus === 'APPROVED' ? "Suspend from Storefront" : "Activate on Storefront"}
                          className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border transition cursor-pointer ${
                            p.approvalStatus === 'APPROVED'
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-stone-100 text-stone-500 border-stone-200"
                          }`}
                        >
                          {p.approvalStatus === 'APPROVED' ? "Active" : "Suspended"}
                        </button>
                      </td>

                      {/* Admin Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* View details drawer */}
                          <button
                            type="button"
                            onClick={() => setSelectedProduct(p)}
                            title="Inspect Product"
                            className="p-1.5 rounded-lg text-stone-500 hover:text-[#4A1513] hover:bg-stone-100 transition cursor-pointer"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Approve (if not approved) */}
                          {!isApproved && (
                            <button
                              type="button"
                              onClick={() => onAction("APPROVE_PRODUCT", { productId: p.id })}
                              title="Approve Product"
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
                              onClick={() => onAction("REJECT_PRODUCT", { productId: p.id })}
                              title="Reject Product"
                              className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] border border-rose-200 transition cursor-pointer"
                            >
                              Reject
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => onAction("DELETE_PRODUCT", { productId: p.id })}
                            title="Remove Listing"
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>

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

      {/* DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProduct.image || "/images/placeholder.jpg"}
                  alt={selectedProduct.name}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                />
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">{selectedProduct.name}</h3>
                  <p className="text-xs text-stone-500 font-mono">Product #{selectedProduct.id} &bull; {selectedProduct.category}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Vendor Boutique</p>
                  <p className="text-sm font-bold text-stone-800 mt-0.5">
                    {selectedProduct.vendor?.vendorProfile?.businessName || selectedProduct.vendor?.name || "Independent Seller"}
                  </p>
                </div>
                <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Pricing</p>
                  <p className="text-sm font-bold text-stone-800 mt-0.5">
                    ₹{selectedProduct.price} {selectedProduct.discountPrice && `(Orig: ₹${selectedProduct.discountPrice})`}
                  </p>
                </div>
                <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">SKU</p>
                  <p className="text-sm font-mono font-bold text-stone-800 mt-0.5">{selectedProduct.sku || "N/A"}</p>
                </div>
                <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Stock Quantity</p>
                  <p className="text-sm font-bold text-stone-800 mt-0.5">{selectedProduct.stock ?? 25} units</p>
                </div>
              </div>

              <div className="bg-[#FAF7F5] p-3.5 rounded-xl border border-stone-100">
                <p className="text-[10px] text-stone-400 uppercase font-semibold mb-1">Product Description</p>
                <p className="text-xs text-stone-700 leading-relaxed">{selectedProduct.description || "No description provided."}</p>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <span className="text-stone-400 text-[11px]">Submitted: {new Date(selectedProduct.createdAt).toLocaleDateString()}</span>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-xl bg-[#4A1513] text-white font-bold hover:bg-[#350B0A] transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
