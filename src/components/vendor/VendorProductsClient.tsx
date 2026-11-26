'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Package,
  Plus,
  Truck,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Edit3,
  RotateCcw,
  Sparkles,
  Layers,
  Store
} from 'lucide-react';
import { AddProductWithVariants } from './AddProductWithVariants';
import { VendorPortalHeader } from './VendorPortalHeader';

type StatusTab = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

interface VendorProductsClientProps {
  initialProducts?: any[];
  initialCounts?: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  vendorId?: number | null;
}

export function VendorProductsClient({
  initialProducts = [],
  initialCounts = { all: 0, pending: 0, approved: 0, rejected: 0 },
  vendorId
}: VendorProductsClientProps) {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<StatusTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Compute live counts
  const counts = useMemo(() => {
    const all = products.length;
    const pending = products.filter(p => p.approvalStatus === 'PENDING').length;
    const approved = products.filter(p => p.approvalStatus === 'APPROVED').length;
    const rejected = products.filter(p => p.approvalStatus === 'REJECTED').length;
    return { all, pending, approved, rejected };
  }, [products]);

  // Handle product creation
  const handleProductCreated = (newProd: any) => {
    setProducts(prev => [newProd, ...prev]);
    setActiveTab('PENDING'); // Switch to pending approval tab to see submission
    setViewMode('list');
  };

  // Handle product update / resubmission
  const handleProductUpdated = (updatedProd: any) => {
    setProducts(prev => prev.map(p => (p.id === updatedProd.id ? updatedProd : p)));
    setEditingProduct(null);
    setActiveTab('PENDING'); // Resubmitted item is now pending review
    setViewMode('list');
  };

  // Filter products by active tab, search query, and category
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Tab status filter
      if (activeTab === 'PENDING' && p.approvalStatus !== 'PENDING') return false;
      if (activeTab === 'APPROVED' && p.approvalStatus !== 'APPROVED') return false;
      if (activeTab === 'REJECTED' && p.approvalStatus !== 'REJECTED') return false;

      // 2. Category filter
      if (categoryFilter !== 'ALL' && (p.category || '').toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (p.name || '').toLowerCase().includes(q);
        const matchesSku = (p.sku || '').toLowerCase().includes(q);
        const matchesCategory = (p.category || '').toLowerCase().includes(q);
        const matchesSubcategory = (p.subcategory || p.dressType || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesCategory && !matchesSubcategory) {
          return false;
        }
      }

      return true;
    });
  }, [products, activeTab, categoryFilter, searchQuery]);

  // Extract unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [products]);

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col font-sans">
      <VendorPortalHeader storeHref="/shop" />

      <div className="flex-1 py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-6">

          {/* Navigation & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/vendor/dashboard"
                className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition shadow-2xs"
              >
                <ArrowLeft size={18} />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-950 px-2 py-0.5 rounded-full">
                    Vendor Partner Portal
                  </span>
                  <span className="text-xs text-stone-500">&bull; Product Management &amp; Approvals</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-serif text-stone-900 font-normal mt-0.5">
                  My Products Catalog
                </h1>
                <p className="text-xs text-stone-500">
                  Track listing review statuses, manage inventories, and resubmit rejected items.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setViewMode('list');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#4A1513] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Package size={15} />
                <span>My Products ({products.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setViewMode('create');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                  viewMode === 'create'
                    ? 'bg-[#4A1513] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Plus size={15} />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* VIEW: CREATE PRODUCT */}
          {viewMode === 'create' && (
            <AddProductWithVariants
              onProductCreated={handleProductCreated}
              onCancel={() => setViewMode('list')}
            />
          )}

          {/* VIEW: EDIT PRODUCT */}
          {viewMode === 'edit' && editingProduct && (
            <AddProductWithVariants
              editingProduct={editingProduct}
              onProductCreated={handleProductUpdated}
              onCancel={() => {
                setEditingProduct(null);
                setViewMode('list');
              }}
            />
          )}

          {/* VIEW: LIST PRODUCTS WITH STATUS TABS */}
          {viewMode === 'list' && (
            <div className="space-y-6">

              {/* Status Tabs Navigation */}
              <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  
                  {/* All Products */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('ALL')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                      activeTab === 'ALL'
                        ? 'bg-[#4A1513] text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    <span>All Products</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      activeTab === 'ALL' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {counts.all}
                    </span>
                  </button>

                  {/* Pending Approval */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('PENDING')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                      activeTab === 'PENDING'
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'text-amber-800 hover:bg-amber-50'
                    }`}
                  >
                    <Clock size={13} />
                    <span>Pending Approval</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      activeTab === 'PENDING' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {counts.pending}
                    </span>
                  </button>

                  {/* Approved */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('APPROVED')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                      activeTab === 'APPROVED'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-emerald-800 hover:bg-emerald-50'
                    }`}
                  >
                    <CheckCircle2 size={13} />
                    <span>Approved</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      activeTab === 'APPROVED' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {counts.approved}
                    </span>
                  </button>

                  {/* Rejected */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('REJECTED')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                      activeTab === 'REJECTED'
                        ? 'bg-rose-700 text-white shadow-xs'
                        : 'text-rose-800 hover:bg-rose-50'
                    }`}
                  >
                    <XCircle size={13} />
                    <span>Rejected</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      activeTab === 'REJECTED' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-900'
                    }`}>
                      {counts.rejected}
                    </span>
                  </button>

                </div>

                {/* Quick Add Product Button */}
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setViewMode('create');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-[#4A1513] text-stone-800 hover:text-white transition font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>New Product</span>
                </button>
              </div>

              {/* Filters Bar: Search & Category */}
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                
                {/* Search */}
                <div className="relative w-full sm:w-80">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search by name, category, SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FAF7F5] rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-stone-800 placeholder:text-stone-400 border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter size={14} className="text-stone-400 shrink-0" />
                  <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider text-[11px]">
                    Category:
                  </span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-[#FAF7F5] border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#4A1513]"
                  >
                    <option value="ALL">All Categories</option>
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Products Grid / Cards */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-[#FAF7F5] border border-stone-200 flex items-center justify-center text-stone-400 mx-auto">
                    <Package size={28} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-800">
                      {activeTab === 'PENDING' && 'No products pending approval'}
                      {activeTab === 'APPROVED' && 'No approved products yet'}
                      {activeTab === 'REJECTED' && 'No rejected products'}
                      {activeTab === 'ALL' && 'No products found'}
                    </h3>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                      {activeTab === 'PENDING' && 'Products you submit will appear here while awaiting administrator review.'}
                      {activeTab === 'APPROVED' && 'Once approved by the admin team, your products will be active here and live on the storefront.'}
                      {activeTab === 'REJECTED' && 'Products requiring revisions will appear here with admin feedback.'}
                      {activeTab === 'ALL' && 'Start listing luxury garments with color varieties and real-time physical inventory.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setViewMode('create');
                    }}
                    className="px-6 py-2.5 bg-[#4A1513] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:bg-[#350B0A] transition cursor-pointer"
                  >
                    Add Product
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(p => {
                    const variants = p.colorVariants || [];
                    const coverImage = p.image || (variants[0]?.images?.[0]?.imageUrl) || '/images/placeholder.jpg';
                    const isApproved = p.approvalStatus === 'APPROVED';
                    const isPending = p.approvalStatus === 'PENDING';
                    const isRejected = p.approvalStatus === 'REJECTED';
                    const submissionDate = new Date(p.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    });

                    return (
                      <div
                        key={p.id}
                        className={`group rounded-3xl border bg-white shadow-2xs hover:shadow-md transition overflow-hidden flex flex-col ${
                          isRejected
                            ? 'border-rose-200/90'
                            : isPending
                              ? 'border-amber-200/90'
                              : 'border-stone-200 hover:border-[#4A1513]/40'
                        }`}
                      >
                        {/* Thumbnail & Badges */}
                        <div className="aspect-4/3 bg-stone-100 relative overflow-hidden">
                          <img
                            src={coverImage}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                            onError={(e) => {
                              (e.currentTarget as any).src = 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=300&q=80';
                            }}
                          />

                          {/* Approval Status Badge on Image */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1">
                            {isApproved && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600/95 backdrop-blur-xs text-white text-[10.5px] font-bold tracking-wider uppercase shadow-xs">
                                <CheckCircle2 size={11} />
                                <span>Approved &amp; Live</span>
                              </span>
                            )}
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-600/95 backdrop-blur-xs text-white text-[10.5px] font-bold tracking-wider uppercase shadow-xs animate-pulse">
                                <Clock size={11} />
                                <span>Pending Approval</span>
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-600/95 backdrop-blur-xs text-white text-[10.5px] font-bold tracking-wider uppercase shadow-xs">
                                <XCircle size={11} />
                                <span>Action Required</span>
                              </span>
                            )}
                          </div>

                          {/* Price Tag Badge */}
                          <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-xl">
                            ₹{p.price}
                            {p.discountPrice && (
                              <span className="text-[10px] text-stone-300 line-through ml-1.5 font-normal">
                                ₹{p.discountPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] text-stone-400 font-semibold uppercase tracking-wider">
                              <span className="truncate max-w-[180px]">{p.category} &bull; {p.subcategory || p.dressType || 'Couture'}</span>
                              <span className="font-mono text-[10px]">SKU: {p.sku || `FZ-${p.id}`}</span>
                            </div>

                            <h3 className="text-base font-serif font-bold text-stone-900 line-clamp-1">
                              {p.name}
                            </h3>

                            <div className="flex items-center gap-3 text-xs text-stone-500 pt-1">
                              <span>Stock: <strong className="text-stone-800">{p.stock ?? 0} pcs</strong></span>
                              <span>&bull;</span>
                              <span>Submitted: <strong className="text-stone-700">{submissionDate}</strong></span>
                            </div>
                          </div>

                          {/* Color Swatches if present */}
                          {variants.length > 0 && (
                            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                              <span className="text-stone-500 text-[11px]">{variants.length} Color Options:</span>
                              <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                                {variants.map((v: any) => (
                                  <div
                                    key={v.id}
                                    className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs shrink-0"
                                    style={{ backgroundColor: v.colorHexCode || '#722F37' }}
                                    title={v.colorName}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* REJECTION REASON CALLOUT & EDIT ACTION */}
                          {isRejected && (
                            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-2.5">
                              <div className="flex items-center gap-1.5 text-rose-900 font-bold text-[11px] uppercase tracking-wider">
                                <AlertTriangle size={13} className="text-rose-600 shrink-0" />
                                <span>Admin Rejection Reason:</span>
                              </div>
                              <p className="text-rose-950 bg-white/80 p-2.5 rounded-xl border border-rose-100 italic leading-relaxed text-[11.5px]">
                                &ldquo;{p.rejectionReason || 'Please review your product details and resubmit.'}&rdquo;
                              </p>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProduct(p);
                                  setViewMode('edit');
                                }}
                                className="w-full py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                              >
                                <RotateCcw size={13} />
                                <span>Edit &amp; Resubmit Product</span>
                              </button>
                            </div>
                          )}

                          {/* PENDING NOTICE */}
                          {isPending && (
                            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                              <p className="text-amber-900 text-[11.5px] leading-relaxed">
                                Under review by the Femazon curation team. Once approved, this product will automatically appear in the public Shop.
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProduct(p);
                                  setViewMode('edit');
                                }}
                                className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1"
                              >
                                <Edit3 size={11} />
                                <span>Modify submission</span>
                              </button>
                            </div>
                          )}

                          {/* APPROVED ACTIONS */}
                          {isApproved && (
                            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                              <Link
                                href={`/products/${p.slug}`}
                                target="_blank"
                                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                              >
                                <span>View on Live Store</span>
                                <ExternalLink size={12} />
                              </Link>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProduct(p);
                                  setViewMode('edit');
                                }}
                                className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 size={12} />
                                <span>Edit Listing</span>
                              </button>
                            </div>
                          )}

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
