"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Upload,
  Plus,
  Trash2,
  Edit,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Loader2,
  Truck
} from 'lucide-react';

const CATEGORIES = [
  "Chudithar",
  "Kurti",
  "Saree",
  "Anarkali",
  "Dresses",
  "Ethnic",
  "Co-ords",
  "Tops"
];

const PATTERNS = [
  "A-Line Pattern",
  "Floral Pattern",
  "Printed Pattern",
  "Embroidered Pattern",
  "Straight Pattern",
  "Woven Pattern",
  "Gown Pattern"
];

const COLORS = [
  "Green",
  "Pink",
  "Blue",
  "Yellow",
  "Purple",
  "Maroon",
  "Peach",
  "Black",
  "Sky Blue",
  "Wine",
  "Teal",
  "Beige",
  "Olive",
  "Mustard",
  "Lavender",
  "Red",
  "Orange",
  "Mint Green",
  "Royal Blue",
  "Coral Pink",
  "Emerald Green",
  "Magenta"
];

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "Free Size"];

export function AdminProductsClient({ initialProducts }: { initialProducts: any[] }) {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [navigatingHref, setNavigatingHref] = useState<string | null>(null);
  const itemsPerPage = 10;

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage || isPageLoading) return;
    setIsPageLoading(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsPageLoading(false);
    }, 250);
  };

  // Form State
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Chudithar');
  const [pattern, setPattern] = useState('A-Line Pattern');
  const [color, setColor] = useState('Green');
  const [sizes, setSizes] = useState<string[]>(["M", "L", "XL", "XXL"]);
  const [stock, setStock] = useState<string>('25');
  const [price, setPrice] = useState<string>('999');
  const [discountPrice, setDiscountPrice] = useState<string>('799');
  const [description, setDescription] = useState('Beautiful green aline chudithar with printed design.');
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop"
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle Size
  const toggleSize = (s: string) => {
    if (sizes.includes(s)) {
      setSizes(sizes.filter(x => x !== s));
    } else {
      setSizes([...sizes, s]);
    }
  };

  // Remove Image
  const handleRemoveImage = (indexToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  // Add Image via URL or prompt
  const handleAddImagePrompt = () => {
    if (images.length >= 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    const url = prompt("Enter Image URL (or upload below):", "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=800&q=80&auto=format&fit=crop");
    if (url && url.trim()) {
      setImages([...images, url.trim()]);
    }
  };

  // Reset Form
  const handleResetForm = () => {
    setEditingProductId(null);
    setProductName('');
    setCategory('Chudithar');
    setPattern('A-Line Pattern');
    setColor('Green');
    setSizes(["M", "L", "XL", "XXL"]);
    setStock('25');
    setPrice('999');
    setDiscountPrice('799');
    setDescription('');
    setImages([]);
    setSuccessMessage('');
  };

  // Edit Product
  const handleEditClick = (p: any) => {
    setEditingProductId(Number(p.id));
    setProductName(p.name || '');
    setCategory(p.category || 'Chudithar');
    setPattern(p.subcategory || p.dressType || 'A-Line Pattern');
    
    let parsedColors: string[] = ["Green"];
    try {
      if (p.colors) parsedColors = typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors;
    } catch (e) {}
    setColor(parsedColors[0] || 'Green');

    let parsedSizes: string[] = ["M", "L", "XL"];
    try {
      if (p.sizes) parsedSizes = typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes;
    } catch (e) {}
    setSizes(parsedSizes);

    setStock(String(p.stock ?? 25));
    setPrice(String(p.price ?? 999));
    setDiscountPrice(p.discountPrice ? String(p.discountPrice) : '');
    setDescription(p.description || '');

    let parsedImages: string[] = [];
    try {
      if (p.images) parsedImages = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
    } catch (e) {}
    if (parsedImages.length === 0 && p.image) parsedImages = [p.image];
    setImages(parsedImages);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Form (Create or Update)
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      alert("Product Name is required");
      return;
    }
    if (!price || Number(price) <= 0) {
      alert("Valid Price is required");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    const payload = {
      productId: editingProductId,
      name: productName.trim(),
      category,
      pattern,
      color,
      sizes,
      stock: Number(stock) || 0,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      description: description.trim(),
      image: images[0] || "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop",
      images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop"]
    };

    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: editingProductId ? "UPDATE_PRODUCT" : "CREATE_PRODUCT",
          payload
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to save product");
        setIsSubmitting(false);
        return;
      }

      const saved = await res.json();
      setSuccessMessage(editingProductId ? "Product updated successfully!" : "Product published to shop successfully!");

      if (editingProductId) {
        setProducts(prev => prev.map(item => Number(item.id) === editingProductId ? { ...item, ...payload, id: editingProductId } : item));
      } else {
        setProducts(prev => [{ ...saved, id: saved.id || Date.now(), ...payload }, ...prev]);
      }

      setTimeout(() => {
        handleResetForm();
        setIsSubmitting(false);
        router.refresh();
      }, 1000);
    } catch (err) {
      alert("Network error saving product.");
      setIsSubmitting(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE_PRODUCT",
          payload: { productId: id }
        })
      });

      if (res.ok) {
        setProducts(prev => prev.filter(p => Number(p.id) !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (e) {
      alert("Error deleting product");
    }
  };

  // Filtered & Paginated Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategoryFilter !== 'All' && p.category !== selectedCategoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const combined = `${p.name} ${p.category} ${p.subcategory || p.dressType || ''} ${p.colors || ''}`.toLowerCase();
        if (!combined.includes(q)) return false;
      }
      return true;
    });
  }, [products, searchQuery, selectedCategoryFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const navMenuItems = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
    { label: "Products", href: "/admin/products", icon: <Package size={18} />, active: true },
    { label: "Ready to Ship", href: "/vendor/products", icon: <Truck size={18} /> },
    { label: "Categories", href: "/admin", icon: <Layers size={18} /> },
    { label: "Orders", href: "/admin", icon: <ShoppingBag size={18} /> },
    { label: "Customers", href: "/admin", icon: <Users size={18} /> },
    { label: "Coupons", href: "/admin", icon: <Tag size={18} /> },
    { label: "Reports", href: "/admin", icon: <BarChart3 size={18} /> },
    { label: "Settings", href: "/admin", icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-stone-800 font-sans flex flex-col">
      {/* Top Admin Navbar */}
      <AdminNavbar
        currentSection="Products & Inventory"
        stats={{ productsCount: products.length }}
        onToggleMobileSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex relative">
        {/* Left Sidebar */}
        <aside
          className={`fixed md:sticky top-16 z-30 h-[calc(100vh-64px)] w-60 bg-white border-r border-stone-200 flex flex-col transition-transform duration-200 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navMenuItems.map((item, idx) => {
              const isTargetLoading = navigatingHref === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => {
                    if (item.href !== '/admin/products') {
                      setNavigatingHref(item.href);
                    }
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    item.active
                      ? 'bg-[#4A1513] text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {isTargetLoading && (
                    <Loader2 size={13} className={`animate-spin ${item.active ? 'text-white' : 'text-[#4A1513]'}`} />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-stone-200">
            <Link
              href="/api/auth/logout"
              onClick={() => setNavigatingHref('/api/auth/logout')}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
            >
              <div className="flex items-center gap-3">
                <LogOut size={18} />
                <span>Logout</span>
              </div>
              {navigatingHref === '/api/auth/logout' && (
                <Loader2 size={13} className="animate-spin text-rose-600" />
              )}
            </Link>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Success Banner */}
          {successMessage && (
            <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Top Form: Upload New Product */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 sm:p-7">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-lg font-bold text-stone-900 font-sans">
                  {editingProductId ? 'Edit Product' : 'Upload New Product'}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {editingProductId
                    ? 'Update product details, pricing, colors, and images'
                    : 'Add a new product with multiple images and variants to your store'}
                </p>
              </div>

              {editingProductId && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg hover:bg-stone-200 transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitProduct}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Left Sub-panel: Product Images */}
                <div className="lg:col-span-4 flex flex-col">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                    Product Images <span className="text-rose-500">*</span>
                  </label>

                  {/* Main Large Image Preview Box */}
                  <div className="relative w-full h-64 sm:h-72 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/70 overflow-hidden flex items-center justify-center group">
                    {images[0] ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={images[0]}
                          alt="Main preview"
                          className="w-full h-full object-cover object-center"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(0)}
                          className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-white/90 shadow-md text-stone-600 hover:text-rose-600 hover:bg-white flex items-center justify-center transition"
                          title="Remove main image"
                        >
                          <X size={15} />
                        </button>
                      </>
                    ) : (
                      <div
                        onClick={handleAddImagePrompt}
                        className="flex flex-col items-center justify-center p-4 text-center cursor-pointer"
                      >
                        <div className="h-10 w-10 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center text-stone-400 mb-2">
                          <Upload size={18} />
                        </div>
                        <span className="text-xs font-semibold text-stone-700">Click to add main image</span>
                        <span className="text-[10px] text-stone-400 mt-0.5">Supports JPG, PNG, WebP</span>
                      </div>
                    )}
                  </div>

                  {/* 4 Thumbnails strip + Add button */}
                  <div className="grid grid-cols-5 gap-2 mt-3">
                    {[1, 2, 3, 4].map((slotIdx) => {
                      const img = images[slotIdx];
                      return (
                        <div
                          key={slotIdx}
                          className="relative h-14 rounded-xl border border-stone-200 bg-stone-50 overflow-hidden flex items-center justify-center"
                        >
                          {img ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img} alt={`Thumb ${slotIdx}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(slotIdx)}
                                className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-rose-600"
                              >
                                <X size={10} />
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-stone-300 font-medium">#{slotIdx + 1}</span>
                          )}
                        </div>
                      );
                    })}

                    {/* Plus / Add Image Button */}
                    <button
                      type="button"
                      onClick={handleAddImagePrompt}
                      className="h-14 rounded-xl border-2 border-dashed border-stone-300 bg-white hover:border-[#4A1513] hover:bg-[#4A1513]/5 text-stone-500 hover:text-[#4A1513] flex items-center justify-center transition cursor-pointer"
                      title="Add Image URL"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <span className="text-[11px] text-stone-400 mt-2 font-medium">(Max 5 Images)</span>
                </div>

                {/* Right Sub-panel: Product Details Grid */}
                <div className="lg:col-span-8 flex flex-col justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Product Name */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Product Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="e.g. Chudithar - Product 1"
                        className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#4A1513] focus:ring-2 focus:ring-[#4A1513]/10 outline-none transition"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 focus:bg-white focus:border-[#4A1513] focus:ring-2 focus:ring-[#4A1513]/10 outline-none transition cursor-pointer"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Pattern */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Pattern <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 focus:bg-white focus:border-[#4A1513] focus:ring-2 focus:ring-[#4A1513]/10 outline-none transition cursor-pointer"
                      >
                        {PATTERNS.map((pat) => (
                          <option key={pat} value={pat}>{pat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Color <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 focus:bg-white focus:border-[#4A1513] focus:ring-2 focus:ring-[#4A1513]/10 outline-none transition cursor-pointer"
                      >
                        {COLORS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Size Multi-Select Pills */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Size <span className="text-rose-500">*</span>
                      </label>
                      <div className="min-h-10 p-1.5 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-wrap items-center gap-1.5">
                        {sizes.map((s) => (
                          <span
                            key={s}
                            onClick={() => toggleSize(s)}
                            className="inline-flex items-center gap-1 rounded-md bg-stone-200 px-2 py-1 text-[11px] font-semibold text-stone-700 cursor-pointer hover:bg-stone-300 transition"
                          >
                            <span>{s}</span>
                            <X size={11} />
                          </span>
                        ))}
                        {AVAILABLE_SIZES.filter(sz => !sizes.includes(sz)).slice(0, 3).map(sz => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => toggleSize(sz)}
                            className="text-[10px] font-medium text-stone-400 hover:text-stone-700 border border-dashed border-stone-300 rounded px-1.5 py-0.5"
                          >
                            + {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Stock Quantity */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Stock Quantity <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="25"
                        className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#4A1513] focus:ring-2 focus:ring-[#4A1513]/10 outline-none transition"
                      />
                    </div>

                    {/* Price (₹) */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Price (₹) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="999"
                        className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#4A1513] focus:ring-2 focus:ring-[#4A1513]/10 outline-none transition"
                      />
                    </div>

                    {/* Discount Price (₹) */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Discount Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                        placeholder="799"
                        className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#4A1513] focus:ring-2 focus:ring-[#4A1513]/10 outline-none transition"
                      />
                    </div>

                    {/* Description (Full width) */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Description <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Beautiful green aline chudithar with printed design."
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#4A1513] focus:ring-2 focus:ring-[#4A1513]/10 outline-none transition resize-none"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-600 hover:bg-stone-50 transition cursor-pointer"
                    >
                      Reset
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-[#4A1513] hover:bg-[#3D110F] text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting && <RefreshCw size={14} className="animate-spin" />}
                      <span>{editingProductId ? 'Update Product' : 'Add Product'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Bottom Table: Product List */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-stone-900 font-sans">Product List</h2>

              <div className="flex items-center gap-3">
                {/* Search Input */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search products..."
                    className="h-9 pl-9 pr-3 w-44 sm:w-56 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[#4A1513] outline-none transition"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => {
                    setSelectedCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-9 px-3 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-700 focus:bg-white focus:border-[#4A1513] outline-none transition cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-stone-100 relative min-h-[300px]">
              {isPageLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-10 animate-in fade-in duration-150">
                  <div className="w-12 h-12 rounded-full border-3 border-[#4A1513]/20 border-t-[#4A1513] animate-spin" />
                </div>
              )}
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="px-4 py-3.5">Image</th>
                    <th className="px-4 py-3.5">Product Name</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Pattern</th>
                    <th className="px-4 py-3.5">Color</th>
                    <th className="px-4 py-3.5">Size</th>
                    <th className="px-4 py-3.5">Stock</th>
                    <th className="px-4 py-3.5">Price</th>
                    <th className="px-4 py-3.5">Discount Price</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-stone-400 font-medium">
                        No products found matching the criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((p) => {
                      let parsedSizes: string[] = [];
                      try {
                        parsedSizes = typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes;
                      } catch (e) {}
                      const displaySizes = Array.isArray(parsedSizes) && parsedSizes.length > 0 ? parsedSizes.join(', ') : 'M, L, XL';

                      let parsedColors: string[] = [];
                      try {
                        parsedColors = typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors;
                      } catch (e) {}
                      const displayColor = Array.isArray(parsedColors) && parsedColors.length > 0 ? parsedColors[0] : (p.colors || 'Green');

                      return (
                        <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                          {/* Image */}
                          <td className="px-4 py-3">
                            <div className="h-11 w-9 rounded-md overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.image || "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop"}
                                alt={p.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </td>

                          {/* Product Name */}
                          <td className="px-4 py-3 font-semibold text-stone-900 max-w-[180px] truncate">
                            {p.name}
                          </td>

                          {/* Category */}
                          <td className="px-4 py-3 text-stone-600">{p.category || 'Chudithar'}</td>

                          {/* Pattern */}
                          <td className="px-4 py-3 text-stone-600">{p.subcategory || p.dressType || 'A-Line Pattern'}</td>

                          {/* Color */}
                          <td className="px-4 py-3 text-stone-700 font-medium">{displayColor}</td>

                          {/* Size */}
                          <td className="px-4 py-3 text-stone-600">{displaySizes}</td>

                          {/* Stock */}
                          <td className="px-4 py-3 font-bold text-emerald-600">{p.stock ?? 25}</td>

                          {/* Price */}
                          <td className="px-4 py-3 text-stone-700 font-medium">₹{p.price}</td>

                          {/* Discount Price */}
                          <td className="px-4 py-3 text-rose-600 font-bold">
                            {p.discountPrice ? `₹${p.discountPrice}` : '-'}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleEditClick(p)}
                                className="h-7 w-7 rounded-lg border border-stone-200 text-stone-600 hover:text-[#4A1513] hover:border-[#4A1513] flex items-center justify-center transition cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(Number(p.id))}
                                className="h-7 w-7 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 size={13} />
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

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500">
              <span>
                Showing {filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1 || isPageLoading}
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  className="h-8 w-8 rounded-lg border border-stone-200 flex items-center justify-center disabled:opacity-40 hover:bg-stone-50 transition cursor-pointer"
                  title="Previous page"
                >
                  <ChevronLeft size={14} />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isPageLoading}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`h-8 w-8 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                      currentPage === idx + 1
                        ? 'bg-[#4A1513] text-white shadow-xs'
                        : 'border border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    {isPageLoading && currentPage === idx + 1 ? (
                      <Loader2 size={12} className="animate-spin text-white" />
                    ) : (
                      idx + 1
                    )}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages || isPageLoading}
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  className="h-8 w-8 rounded-lg border border-stone-200 flex items-center justify-center disabled:opacity-40 hover:bg-stone-50 transition cursor-pointer"
                  title="Next page"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
