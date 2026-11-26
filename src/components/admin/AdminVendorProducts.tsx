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
  Store,
  Tag,
  AlertTriangle,
  X,
  ExternalLink,
  Layers,
  Check,
  Clock,
  Mail,
  Phone,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

interface AdminVendorProductsProps {
  products: any[];
  categories: any[];
  onAction: (action: string, payload: any) => Promise<void>;
}

type TabType = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

export function AdminVendorProducts({ products = [], categories = [], onAction }: AdminVendorProductsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  
  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [rejectingProduct, setRejectingProduct] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);
  const [rejectionError, setRejectionError] = useState("");
  const [activeModalImageIndex, setActiveModalImageIndex] = useState(0);

  // Status counts
  const counts = useMemo(() => {
    const all = products.length;
    const pending = products.filter((p) => p.approvalStatus === "PENDING").length;
    const approved = products.filter((p) => p.approvalStatus === "APPROVED").length;
    const rejected = products.filter((p) => p.approvalStatus === "REJECTED").length;
    return { all, pending, approved, rejected };
  }, [products]);

  // Filter products based on tab, category, and search query
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Tab filter
      if (activeTab === "PENDING" && p.approvalStatus !== "PENDING") return false;
      if (activeTab === "APPROVED" && p.approvalStatus !== "APPROVED") return false;
      if (activeTab === "REJECTED" && p.approvalStatus !== "REJECTED") return false;

      // 2. Category filter
      if (
        categoryFilter !== "ALL" &&
        (p.category || "").toLowerCase() !== categoryFilter.toLowerCase()
      ) {
        return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const vendorName = p.vendor?.vendorProfile?.businessName || p.vendor?.name || "";
        const matchesName = (p.name || "").toLowerCase().includes(q);
        const matchesId = String(p.id).includes(q);
        const matchesSku = (p.sku || "").toLowerCase().includes(q);
        const matchesVendor = vendorName.toLowerCase().includes(q);
        const matchesCategory = (p.category || "").toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesSku && !matchesVendor && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [products, activeTab, categoryFilter, searchQuery]);

  // Approve action handler
  const handleApprove = async (productId: number) => {
    await onAction("APPROVE_PRODUCT", { productId });
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
  };

  // Reject action handler
  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      setRejectionError("Please provide a rejection reason for the vendor.");
      return;
    }

    setIsSubmittingRejection(true);
    setRejectionError("");

    try {
      await onAction("REJECT_PRODUCT", {
        productId: rejectingProduct.id,
        rejectionReason: rejectionReason.trim(),
      });
      setRejectingProduct(null);
      setRejectionReason("");
      if (selectedProduct?.id === rejectingProduct.id) {
        setSelectedProduct(null);
      }
    } catch {
      setRejectionError("Failed to reject product. Please try again.");
    } finally {
      setIsSubmittingRejection(false);
    }
  };

  // Helper to extract all images from a product for preview
  const getProductImages = (prod: any): string[] => {
    if (!prod) return [];
    const imgs: string[] = [];
    if (prod.image) imgs.push(prod.image);

    if (Array.isArray(prod.colorVariants)) {
      prod.colorVariants.forEach((cv: any) => {
        if (Array.isArray(cv.images)) {
          cv.images.forEach((img: any) => {
            const url = typeof img === "string" ? img : img.imageUrl;
            if (url && !imgs.includes(url)) imgs.push(url);
          });
        }
      });
    }

    if (prod.images) {
      try {
        const parsed = typeof prod.images === "string" ? JSON.parse(prod.images) : prod.images;
        if (Array.isArray(parsed)) {
          parsed.forEach((url: string) => {
            if (url && !imgs.includes(url)) imgs.push(url);
          });
        }
      } catch {}
    }

    return imgs.length > 0 ? imgs : ["/images/placeholder.jpg"];
  };

  return (
    <div className="space-y-6">

      {/* Header & KPI Summary Cards */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-950 px-2.5 py-0.5 rounded-full">
                Platform Governance
              </span>
              <span className="text-xs text-stone-500">&bull; External Vendor Product Approvals</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Product Approval Management
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Review vendor apparel submissions, verify luxury quality standards, inspect photography &amp; inventory, and approve or reject listings before publication to the Femazon storefront.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700">
              <ShieldCheck size={14} className="text-amber-800" />
              <span>Catalog Security Active</span>
            </span>
          </div>
        </div>

        {/* 4 Metric Counter Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Pending Approvals */}
          <div
            onClick={() => setActiveTab("PENDING")}
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              activeTab === "PENDING"
                ? "bg-amber-100/70 border-amber-400 shadow-xs"
                : "bg-amber-50/50 border-amber-200 hover:bg-amber-50"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] text-amber-900 uppercase font-bold tracking-wider">
                Pending Approval
              </p>
              <Clock size={15} className="text-amber-700" />
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-serif font-bold text-amber-950">{counts.pending}</p>
              {counts.pending > 0 && (
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full animate-pulse">
                  Action Required
                </span>
              )}
            </div>
          </div>

          {/* Approved Products */}
          <div
            onClick={() => setActiveTab("APPROVED")}
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              activeTab === "APPROVED"
                ? "bg-emerald-100/70 border-emerald-400 shadow-xs"
                : "bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] text-emerald-900 uppercase font-bold tracking-wider">
                Approved &amp; Live
              </p>
              <CheckCircle2 size={15} className="text-emerald-700" />
            </div>
            <p className="text-2xl font-serif font-bold text-emerald-950">{counts.approved}</p>
          </div>

          {/* Rejected Products */}
          <div
            onClick={() => setActiveTab("REJECTED")}
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              activeTab === "REJECTED"
                ? "bg-rose-100/70 border-rose-400 shadow-xs"
                : "bg-rose-50/50 border-rose-200 hover:bg-rose-50"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] text-rose-900 uppercase font-bold tracking-wider">
                Rejected Submissions
              </p>
              <XCircle size={15} className="text-rose-700" />
            </div>
            <p className="text-2xl font-serif font-bold text-rose-950">{counts.rejected}</p>
          </div>

          {/* All Submitted Products */}
          <div
            onClick={() => setActiveTab("ALL")}
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              activeTab === "ALL"
                ? "bg-stone-200 border-stone-400 shadow-xs"
                : "bg-stone-50 border-stone-200 hover:bg-stone-100/80"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] text-stone-700 uppercase font-bold tracking-wider">
                All Products
              </p>
              <Package size={15} className="text-stone-600" />
            </div>
            <p className="text-2xl font-serif font-bold text-stone-900">{counts.all}</p>
          </div>

        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Status Tabs Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("PENDING")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "PENDING"
                ? "bg-amber-800 text-white shadow-xs"
                : "bg-stone-50 hover:bg-amber-50 text-stone-700"
            }`}
          >
            <Clock size={12} />
            <span>Pending Review ({counts.pending})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("APPROVED")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "APPROVED"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-stone-50 hover:bg-emerald-50 text-stone-700"
            }`}
          >
            <CheckCircle2 size={12} />
            <span>Approved ({counts.approved})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("REJECTED")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "REJECTED"
                ? "bg-rose-800 text-white shadow-xs"
                : "bg-stone-50 hover:bg-rose-50 text-stone-700"
            }`}
          >
            <XCircle size={12} />
            <span>Rejected ({counts.rejected})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "ALL"
                ? "bg-[#4A1513] text-white shadow-xs"
                : "bg-stone-50 hover:bg-stone-100 text-stone-700"
            }`}
          >
            <Package size={12} />
            <span>All ({counts.all})</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search product, SKU, vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F5] rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium text-stone-800 placeholder:text-stone-400 border border-stone-200 focus:outline-none focus:border-[#4A1513]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#FAF7F5] border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#4A1513]"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id || c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F5] border-b border-stone-200 text-stone-500 uppercase tracking-wider font-bold text-[10.5px]">
              <tr>
                <th className="px-5 py-4">Product Details</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Vendor Boutique</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4 text-center">Stock</th>
                <th className="px-5 py-4">Submitted</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-stone-400">
                    <Package size={36} className="mx-auto mb-2 text-stone-300 stroke-1" />
                    <p className="font-medium text-sm text-stone-700">No products found</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {activeTab === "PENDING" && "All submitted vendor products have been reviewed."}
                      {activeTab === "APPROVED" && "No vendor products approved yet."}
                      {activeTab === "REJECTED" && "No products currently marked as rejected."}
                      {activeTab === "ALL" && "No vendor listings match the search criteria."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isApproved = p.approvalStatus === "APPROVED";
                  const isPending = p.approvalStatus === "PENDING";
                  const isRejected = p.approvalStatus === "REJECTED";

                  const vendorProfile = p.vendor?.vendorProfile;
                  const vendorBoutiqueName = vendorProfile?.businessName || p.vendor?.name || `Vendor #${p.vendorId || "N/A"}`;
                  const vendorEmail = vendorProfile?.email || p.vendor?.email || "";
                  const submissionDate = new Date(p.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  });

                  const coverImage = p.image || "/images/placeholder.jpg";

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF7F5]/50 transition">
                      
                      {/* Product Thumbnail & Details */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProduct(p);
                              setActiveModalImageIndex(0);
                            }}
                            className="relative group shrink-0 cursor-pointer"
                            title="Click to view images"
                          >
                            <img
                              src={coverImage}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover border border-stone-200 bg-stone-100 group-hover:opacity-85 transition"
                              onError={(e) => {
                                (e.currentTarget as any).src = "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=150&q=80";
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-xl opacity-0 group-hover:opacity-100 transition">
                              <Eye size={14} />
                            </div>
                          </button>
                          <div className="min-w-0">
                            <p className="font-bold text-stone-900 text-sm max-w-[200px] truncate" title={p.name}>
                              {p.name}
                            </p>
                            <p className="text-stone-400 text-[11px] font-mono">
                              SKU: {p.sku || `FZ-${p.id}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category & Subcategory */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                            {p.category || "Women's Wear"}
                          </span>
                          {(p.subcategory || p.dressType) && (
                            <p className="text-[10px] text-stone-500 truncate max-w-[120px]">
                              {p.subcategory || p.dressType}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Vendor Boutique Identification */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-stone-900 font-semibold">
                            <Store size={13} className="text-amber-800 shrink-0" />
                            <span className="truncate max-w-[150px]">{vendorBoutiqueName}</span>
                          </div>
                          {vendorEmail && (
                            <p className="text-[10.5px] text-stone-400 truncate max-w-[150px]">
                              {vendorEmail}
                            </p>
                          )}
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
                      <td className="px-5 py-4 text-center font-bold text-stone-800">
                        {p.stock ?? 0}
                      </td>

                      {/* Submission Date */}
                      <td className="px-5 py-4 text-stone-500 font-medium whitespace-nowrap">
                        {submissionDate}
                      </td>

                      {/* Approval Status Badge */}
                      <td className="px-5 py-4">
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 size={12} />
                            Approved
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                            <Clock size={12} />
                            Pending Review
                          </span>
                        )}
                        {isRejected && (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                              <XCircle size={12} />
                              Rejected
                            </span>
                            {p.rejectionReason && (
                              <p className="text-[10px] text-rose-600 line-clamp-1 max-w-[120px] italic" title={p.rejectionReason}>
                                {p.rejectionReason}
                              </p>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Inspect Modal Trigger */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProduct(p);
                              setActiveModalImageIndex(0);
                            }}
                            title="Inspect Complete Details"
                            className="p-1.5 rounded-lg text-stone-500 hover:text-[#4A1513] hover:bg-stone-100 transition cursor-pointer"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Approve Action */}
                          {!isApproved && (
                            <button
                              type="button"
                              onClick={() => handleApprove(p.id)}
                              title="Approve & Publish to Storefront"
                              className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-2xs"
                            >
                              <Check size={12} />
                              <span>Approve</span>
                            </button>
                          )}

                          {/* Reject Action (triggers reason modal) */}
                          {!isRejected && (
                            <button
                              type="button"
                              onClick={() => {
                                setRejectingProduct(p);
                                setRejectionReason("");
                                setRejectionError("");
                              }}
                              title="Reject Submission with Reason"
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] border border-rose-200 transition cursor-pointer flex items-center gap-1"
                            >
                              <X size={12} />
                              <span>Reject</span>
                            </button>
                          )}

                          {/* Toggle Active / Visibility (for approved items) */}
                          {isApproved && (
                            <button
                              type="button"
                              onClick={() => onAction("TOGGLE_PRODUCT_ACTIVE", { productId: p.id })}
                              title="Suspend Listing"
                              className="p-1.5 rounded-lg text-stone-400 hover:text-amber-700 hover:bg-stone-100 transition cursor-pointer"
                            >
                              <AlertTriangle size={14} />
                            </button>
                          )}

                          {/* Delete Listing */}
                          <button
                            type="button"
                            onClick={() => onAction("DELETE_PRODUCT", { productId: p.id })}
                            title="Remove Product"
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <Trash2 size={14} />
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

      {/* DETAIL INSPECTION MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-950 px-2 py-0.5 rounded-full">
                    Product #{selectedProduct.id}
                  </span>
                  <span className="text-xs text-stone-400">&bull; {selectedProduct.category}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900">{selectedProduct.name}</h3>
                <p className="text-xs text-stone-500 font-mono">SKU: {selectedProduct.sku || `FZ-${selectedProduct.id}`}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Images Gallery */}
            {(() => {
              const modalImages = getProductImages(selectedProduct);
              const currentImg = modalImages[activeModalImageIndex] || modalImages[0];

              return (
                <div className="space-y-3">
                  <div className="aspect-16/9 bg-stone-100 rounded-2xl overflow-hidden relative border border-stone-200">
                    <img
                      src={currentImg}
                      alt={selectedProduct.name}
                      className="w-full h-full object-contain"
                    />
                    {modalImages.length > 1 && (
                      <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                        <button
                          type="button"
                          onClick={() => setActiveModalImageIndex((prev) => (prev > 0 ? prev - 1 : modalImages.length - 1))}
                          className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-auto hover:bg-black transition cursor-pointer"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveModalImageIndex((prev) => (prev < modalImages.length - 1 ? prev + 1 : 0))}
                          className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-auto hover:bg-black transition cursor-pointer"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {modalImages.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {modalImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveModalImageIndex(idx)}
                          className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                            activeModalImageIndex === idx ? "border-[#4A1513] scale-102" : "border-stone-200 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Specification Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                <p className="text-[10px] text-stone-400 uppercase font-semibold">Base Price</p>
                <p className="text-sm font-bold text-stone-900 mt-0.5">₹{selectedProduct.price}</p>
              </div>

              <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                <p className="text-[10px] text-stone-400 uppercase font-semibold">Sale / Discount</p>
                <p className="text-sm font-bold text-stone-900 mt-0.5">
                  {selectedProduct.discountPrice ? `₹${selectedProduct.discountPrice}` : "None"}
                </p>
              </div>

              <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                <p className="text-[10px] text-stone-400 uppercase font-semibold">Total Stock</p>
                <p className="text-sm font-bold text-stone-900 mt-0.5">{selectedProduct.stock ?? 0} pcs</p>
              </div>

              <div className="bg-[#FAF7F5] p-3 rounded-xl border border-stone-100">
                <p className="text-[10px] text-stone-400 uppercase font-semibold">Approval</p>
                <p className="text-xs font-bold text-stone-900 mt-1 uppercase">
                  {selectedProduct.approvalStatus}
                </p>
              </div>
            </div>

            {/* Description & Garment Care */}
            <div className="space-y-3 text-xs">
              <div className="bg-[#FAF7F5] p-4 rounded-xl border border-stone-100 space-y-1">
                <p className="text-[10px] text-stone-400 uppercase font-semibold">Product Description</p>
                <p className="text-stone-700 leading-relaxed">
                  {selectedProduct.description || "No description provided."}
                </p>
              </div>

              {selectedProduct.fabricCare && (
                <div className="bg-[#FAF7F5] p-3.5 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold mb-0.5">Fabric &amp; Care</p>
                  <p className="text-stone-700">{selectedProduct.fabricCare}</p>
                </div>
              )}
            </div>

            {/* Vendor Profile Association Card */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-stone-800 font-bold uppercase tracking-wider text-[11px]">
                <Store size={14} className="text-amber-800" />
                <span>Vendor Partner Profile</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700 pt-1">
                <div>
                  <p className="text-stone-400 text-[10px]">Business Name:</p>
                  <p className="font-semibold text-stone-900">
                    {selectedProduct.vendor?.vendorProfile?.businessName || selectedProduct.vendor?.name || "Independent Seller"}
                  </p>
                </div>
                <div>
                  <p className="text-stone-400 text-[10px]">Vendor Email:</p>
                  <p className="font-semibold text-stone-900 truncate">
                    {selectedProduct.vendor?.vendorProfile?.email || selectedProduct.vendor?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-stone-400 text-[10px]">Phone:</p>
                  <p className="font-semibold text-stone-900">
                    {selectedProduct.vendor?.vendorProfile?.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-stone-400 text-[10px]">City / Location:</p>
                  <p className="font-semibold text-stone-900">
                    {selectedProduct.vendor?.vendorProfile?.city || "India"}
                  </p>
                </div>
              </div>
            </div>

            {/* Rejection Notice if already rejected */}
            {selectedProduct.approvalStatus === "REJECTED" && selectedProduct.rejectionReason && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-1">
                <p className="font-bold uppercase tracking-wider text-[10.5px] text-rose-800 flex items-center gap-1">
                  <XCircle size={13} />
                  <span>Current Rejection Reason:</span>
                </p>
                <p className="italic bg-white/70 p-2 rounded-lg border border-rose-100">
                  &ldquo;{selectedProduct.rejectionReason}&rdquo;
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-stone-400">
                Submitted: {new Date(selectedProduct.createdAt).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-2">
                {selectedProduct.approvalStatus !== "APPROVED" && (
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedProduct.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>Approve Product</span>
                  </button>
                )}

                {selectedProduct.approvalStatus !== "REJECTED" && (
                  <button
                    type="button"
                    onClick={() => {
                      setRejectingProduct(selectedProduct);
                      setRejectionReason("");
                      setRejectionError("");
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <X size={14} />
                    <span>Reject Submission</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL (MANDATORY REASON INPUT) */}
      {rejectingProduct && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2 text-rose-900">
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center font-bold">
                  <AlertTriangle size={17} className="text-rose-700" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Reject Product Listing
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRejectingProduct(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-stone-600 space-y-2">
              <p>
                You are rejecting <strong className="text-stone-900">{rejectingProduct.name}</strong> submitted by{" "}
                <strong className="text-stone-900">
                  {rejectingProduct.vendor?.vendorProfile?.businessName || rejectingProduct.vendor?.name || "Vendor"}
                </strong>.
              </p>
              <p className="text-[11.5px] text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200/60 leading-relaxed">
                Please specify the exact reason for rejection. This feedback will be sent directly to the vendor so they can correct the listing and resubmit it.
              </p>
            </div>

            {/* Mandatory Reason Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Rejection Reason / Required Modifications <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={4}
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  if (rejectionError) setRejectionError("");
                }}
                placeholder="e.g. Photography resolution does not meet catalog standards, or price exceeds MRP guidelines..."
                className="w-full p-3 bg-[#FAF7F5] rounded-xl border border-stone-200 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-rose-600 focus:outline-none transition"
              />
              {rejectionError && (
                <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                  <AlertCircle size={13} />
                  <span>{rejectionError}</span>
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isSubmittingRejection}
                onClick={() => setRejectingProduct(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSubmittingRejection || !rejectionReason.trim()}
                onClick={handleConfirmReject}
                className={`px-5 py-2 rounded-xl font-bold text-xs text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                  !rejectionReason.trim() || isSubmittingRejection
                    ? "bg-rose-300 cursor-not-allowed"
                    : "bg-rose-700 hover:bg-rose-800"
                }`}
              >
                {isSubmittingRejection ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
