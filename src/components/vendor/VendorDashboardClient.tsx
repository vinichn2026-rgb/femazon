"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Store, 
  Package, 
  ShoppingCart, 
  Plus, 
  Edit2, 
  Trash2, 
  Grid, 
  User, 
  LogOut, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertCircle,
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  RefreshCw,
  X
} from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";

interface VendorDashboardClientProps {
  vendorProfile: any;
  user: {
    id: number | string;
    name: string | null;
    email: string;
    role: string;
  };
}

export default function VendorDashboardClient({ vendorProfile, user }: VendorDashboardClientProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "settings">("overview");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [productFormError, setProductFormError] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "Chudithar & Suits",
    subcategory: "Anarkali Chudithar",
    stock: "10",
    image: "",
    images: "",
    sizes: "XS, S, M, L, XL",
    colors: "Maroon, Gold",
    sku: ""
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/seller/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch {}
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/seller/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch {}
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchOrders()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Logout
  const handleVendorLogout = async () => {
    setIsLoggingOut(true);
    setShowLogoutConfirm(false);

    try {
      await fetch("/api/vendor/logout", { method: "POST" }).catch(() => {});
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
      
      // Clear sensitive local storage
      try {
        localStorage.removeItem("femazon_user_v1");
        localStorage.removeItem("femazon_bookings_v1");
        sessionStorage.clear();
      } catch (e) {}

      await new Promise(r => setTimeout(r, 600));

      router.push("/vendor");
      router.refresh();
    } catch (err) {
      router.push("/vendor");
    }
  };

  // Handle Add/Edit Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductFormError("");

    if (!formData.name.trim() || !formData.price) {
      setProductFormError("Please enter product title and price.");
      return;
    }

    setIsSubmittingProduct(true);

    try {
      const imageArray = formData.images
        .split("\n")
        .map(u => u.trim())
        .filter(Boolean);
      
      const mainImage = formData.image || imageArray[0] || "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600";

      const method = editingProductId ? "PUT" : "POST";
      const url = editingProductId ? `/api/seller/products/${editingProductId}` : "/api/seller/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: Math.round(Number(formData.price)),
          discountPrice: formData.discountPrice ? Math.round(Number(formData.discountPrice)) : null,
          category: formData.category,
          subcategory: formData.subcategory,
          stock: Math.max(0, parseInt(formData.stock, 10) || 0),
          image: mainImage,
          images: imageArray.length > 0 ? imageArray : null,
          sizes: formData.sizes,
          colors: formData.colors,
          sku: formData.sku || `FMZ-V-${Date.now().toString().slice(-6)}`,
          status: "APPROVED"
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setProductFormError(errorData.error || "Failed to save product.");
        setIsSubmittingProduct(false);
        return;
      }

      await fetchProducts();
      setShowAddForm(false);
      setEditingProductId(null);
      setIsSubmittingProduct(false);
      resetForm();
    } catch (err) {
      setProductFormError("Error submitting product. Please try again.");
      setIsSubmittingProduct(false);
    }
  };

  const handleEditProduct = (prod: any) => {
    setEditingProductId(prod.id);
    setFormData({
      name: prod.name || "",
      description: prod.description || "",
      price: String(prod.price || ""),
      discountPrice: prod.discountPrice ? String(prod.discountPrice) : "",
      category: prod.category || "Chudithar & Suits",
      subcategory: prod.subcategory || "",
      stock: String(prod.stock || "10"),
      image: prod.image || "",
      images: Array.isArray(prod.images) ? prod.images.join("\n") : (prod.images || ""),
      sizes: prod.sizes || "S, M, L, XL",
      colors: prod.colors || "Maroon",
      sku: prod.sku || ""
    });
    setShowAddForm(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product listing?")) return;
    try {
      const res = await fetch(`/api/seller/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      alert("Could not delete product.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      discountPrice: "",
      category: "Chudithar & Suits",
      subcategory: "Anarkali Chudithar",
      stock: "10",
      image: "",
      images: "",
      sizes: "XS, S, M, L, XL",
      colors: "Maroon, Gold",
      sku: ""
    });
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalStockCount = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'PLACED' || o.status === 'PENDING').length;

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku?.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col font-sans text-stone-900">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-2xs px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BrandLogo />
          <div className="h-5 w-[1px] bg-stone-300 hidden md:block" />
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4A1513] bg-[#FAF7F5] px-3 py-1 rounded-full border border-stone-200">
              Vendor Dashboard
            </span>
            <span className="text-xs text-stone-500 font-medium">
              {vendorProfile?.businessName || user.name || "Femazon Boutique Partner"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/shop"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#4A1513] transition py-2 px-3 rounded-lg hover:bg-stone-50"
          >
            <span>Live Store</span>
            <ExternalLink size={13} />
          </Link>

          {/* VENDOR LOGOUT BUTTON */}
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-600 text-xs font-bold uppercase tracking-wider transition-all border border-stone-200 hover:border-rose-200 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Vendor Logout</span>
          </button>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        
        {/* Sidebar Nav */}
        <aside className="w-56 shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl border border-stone-200/90 p-3 shadow-2xs sticky top-24 space-y-1">
            
            <div className="px-3 py-3 border-b border-stone-100 mb-2">
              <p className="text-xs font-bold text-[#4A1513] uppercase tracking-wider">
                {vendorProfile?.businessName || "My Boutique"}
              </p>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Verified Partner</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === "overview" 
                  ? "bg-[#4A1513] text-white shadow-xs" 
                  : "text-stone-600 hover:bg-[#FAF7F5] hover:text-[#4A1513]"
              }`}
            >
              <Grid size={16} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === "products" 
                  ? "bg-[#4A1513] text-white shadow-xs" 
                  : "text-stone-600 hover:bg-[#FAF7F5] hover:text-[#4A1513]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Package size={16} />
                <span>Products</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === "products" ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
              }`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === "orders" 
                  ? "bg-[#4A1513] text-white shadow-xs" 
                  : "text-stone-600 hover:bg-[#FAF7F5] hover:text-[#4A1513]"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={16} />
                <span>Orders</span>
              </div>
              {pendingOrders > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                  {pendingOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === "settings" 
                  ? "bg-[#4A1513] text-white shadow-xs" 
                  : "text-stone-600 hover:bg-[#FAF7F5] hover:text-[#4A1513]"
              }`}
            >
              <Building2 size={16} />
              <span>Store Profile</span>
            </button>

            <div className="pt-4 border-t border-stone-100 mt-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>

          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          
          {/* Mobile Tabs */}
          <div className="flex md:hidden gap-2 overflow-x-auto pb-4 mb-2">
            {[
              { id: "overview", label: "Overview" },
              { id: "products", label: `Products (${products.length})` },
              { id: "orders", label: `Orders (${orders.length})` },
              { id: "settings", label: "Profile" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition ${
                  activeTab === t.id 
                    ? "bg-[#4A1513] text-white" 
                    : "bg-white text-stone-600 border border-stone-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              
              {/* Welcome Banner */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#4A1513]/5 to-transparent rounded-bl-full pointer-events-none" />
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider mb-3">
                    <ShieldCheck size={13} />
                    <span>Active Partner Session</span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 leading-tight">
                    Welcome, {vendorProfile?.businessName || user.name || "Partner"} ✨
                  </h1>
                  <p className="text-[13.5px] text-stone-500 mt-2 leading-relaxed">
                    Manage your catalog, fulfill customer orders, and maintain your luxury brand presence on Femazon Couture.
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-stone-400 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Active Products</span>
                    <Package size={20} className="text-[#4A1513]" />
                  </div>
                  <p className="font-serif text-3xl font-normal text-stone-900">{products.length}</p>
                  <p className="text-xs text-stone-500 mt-1">{totalStockCount} total units in stock</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-stone-400 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
                    <ShoppingCart size={20} className="text-[#4A1513]" />
                  </div>
                  <p className="font-serif text-3xl font-normal text-stone-900">{orders.length}</p>
                  <p className="text-xs text-amber-600 font-medium mt-1">{pendingOrders} pending shipment</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-stone-400 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Gross Sales</span>
                    <TrendingUp size={20} className="text-emerald-600" />
                  </div>
                  <p className="font-serif text-3xl font-normal text-stone-900">₹{totalRevenue.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">Paid & COD Orders</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-stone-400 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Store Status</span>
                    <Store size={20} className="text-[#4A1513]" />
                  </div>
                  <p className="font-serif text-xl font-normal text-emerald-700">Verified</p>
                  <p className="text-xs text-stone-500 mt-1">Direct Brand Partner</p>
                </div>

              </div>

              {/* Quick Actions & Recent Items */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Products Card */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-serif text-xl font-normal text-stone-900">Your Catalog</h3>
                    <button
                      onClick={() => {
                        resetForm();
                        setEditingProductId(null);
                        setShowAddForm(true);
                        setActiveTab("products");
                      }}
                      className="text-xs font-bold uppercase tracking-wider text-[#4A1513] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} /> Add Product
                    </button>
                  </div>

                  {products.length === 0 ? (
                    <div className="text-center py-10 text-stone-400 text-sm">
                      No products added yet. Click &quot;Add Product&quot; to publish your first collection.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {products.slice(0, 4).map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F5] border border-stone-200/60">
                          <div className="flex items-center gap-3">
                            <img src={p.image || "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=200"} alt={p.name} className="w-12 h-12 object-cover rounded-lg border border-stone-200" />
                            <div>
                              <p className="text-sm font-semibold text-stone-900 truncate max-w-[200px]">{p.name}</p>
                              <p className="text-xs text-stone-500">₹{p.price?.toLocaleString("en-IN")} &bull; Stock: {p.stock}</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700">
                            {p.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Orders Card */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-serif text-xl font-normal text-stone-900">Recent Customer Orders</h3>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-xs font-bold uppercase tracking-wider text-[#4A1513] hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-10 text-stone-400 text-sm">
                      No orders received yet. Once customers purchase your designs, they will appear here.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 4).map((o) => (
                        <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F5] border border-stone-200/60 text-sm">
                          <div>
                            <p className="font-semibold text-stone-900">Order #{o.id}</p>
                            <p className="text-xs text-stone-500">Total: ₹{o.total?.toLocaleString("en-IN")} &bull; {o.items?.length || 1} item(s)</p>
                          </div>
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                            {o.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-6">
              
              {/* Header Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
                <div>
                  <h2 className="font-serif text-2xl font-normal text-stone-900">Product Listings</h2>
                  <p className="text-xs text-stone-500 mt-1">Manage your boutique items, pricing, variants, and inventory</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search listings..."
                      className="pl-9 pr-4 py-2 rounded-xl bg-[#FAF7F5] border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#4A1513] w-48 sm:w-60"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setEditingProductId(null);
                      setShowAddForm(true);
                    }}
                    className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-wider transition shadow-xs cursor-pointer whitespace-nowrap"
                  >
                    <Plus size={15} />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Add/Edit Product Modal */}
              {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
                  <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                    
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 transition rounded-full hover:bg-stone-100 cursor-pointer"
                    >
                      <X size={20} />
                    </button>

                    <div className="mb-6">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#4A1513]">
                        {editingProductId ? "Update Product" : "New Collection Item"}
                      </span>
                      <h2 className="font-serif text-2xl text-stone-900 mt-1">
                        {editingProductId ? "Edit Product Details" : "Add Luxury Product"}
                      </h2>
                    </div>

                    {productFormError && (
                      <div className="flex items-center gap-2 p-3.5 mb-5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-medium">
                        <AlertCircle size={16} />
                        <span>{productFormError}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveProduct} className="space-y-4">
                      
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                          Product Name / Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Royal Maroon Velvet Embroidered Bridal Lehenga"
                          className="w-full bg-[#FAF7F5] rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4A1513]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                            Category *
                          </label>
                          <select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-[#FAF7F5] rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4A1513]"
                          >
                            <option value="Chudithar & Suits">Chudithar &amp; Suits</option>
                            <option value="Dresses">Dresses</option>
                            <option value="Ethnic">Ethnic &amp; Sarees</option>
                            <option value="Wedding & Party">Wedding &amp; Party</option>
                            <option value="Western Wear">Western Wear</option>
                            <option value="Footwear">Footwear</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                            Subcategory
                          </label>
                          <input
                            type="text"
                            value={formData.subcategory}
                            onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                            placeholder="e.g. Anarkali, Lehenga, Gown"
                            className="w-full bg-[#FAF7F5] rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4A1513]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                            Price (₹) *
                          </label>
                          <input
                            type="number"
                            required
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            placeholder="45000"
                            className="w-full bg-[#FAF7F5] rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4A1513]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                            Discount Price (₹)
                          </label>
                          <input
                            type="number"
                            value={formData.discountPrice}
                            onChange={e => setFormData({ ...formData, discountPrice: e.target.value })}
                            placeholder="39999"
                            className="w-full bg-[#FAF7F5] rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4A1513]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                            Stock Quantity *
                          </label>
                          <input
                            type="number"
                            required
                            value={formData.stock}
                            onChange={e => setFormData({ ...formData, stock: e.target.value })}
                            placeholder="10"
                            className="w-full bg-[#FAF7F5] rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4A1513]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={formData.image}
                          onChange={e => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-[#FAF7F5] rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4A1513]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={formData.description}
                          onChange={e => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Handcrafted bridal couture featuring intricate zardozi embroidery and pure silk fabric..."
                          className="w-full bg-[#FAF7F5] rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4A1513]"
                        />
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-stone-100">
                        <button
                          type="submit"
                          disabled={isSubmittingProduct}
                          className="flex-1 py-3.5 rounded-full bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer disabled:opacity-60"
                        >
                          {isSubmittingProduct ? "Saving Product..." : (editingProductId ? "Update Listing" : "Publish to Store")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="py-3.5 px-6 rounded-full border border-stone-300 text-stone-700 text-xs font-bold uppercase tracking-wider hover:bg-stone-50 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                    </form>

                  </div>
                </div>
              )}

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <Package size={36} className="mx-auto text-stone-300 mb-3" />
                    <h3 className="font-serif text-lg text-stone-800">No products found</h3>
                    <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                      Add your designs to make them available for shoppers across India on Femazon.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#FAF7F5] border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        <tr>
                          <th className="p-4 pl-6">Product</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Stock</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-[#FAF7F5]/50 transition">
                            <td className="p-4 pl-6">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image || "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=200"}
                                  alt={p.name}
                                  className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                                />
                                <div>
                                  <p className="font-semibold text-stone-900">{p.name}</p>
                                  <span className="text-xs text-stone-400">SKU: {p.sku || `#${p.id}`}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-xs font-medium text-stone-600">{p.category}</td>
                            <td className="p-4 font-semibold text-stone-900">₹{p.price?.toLocaleString("en-IN")}</td>
                            <td className="p-4">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                p.stock > 5 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                              }`}>
                                {p.stock} in stock
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                                <CheckCircle2 size={13} /> Active
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditProduct(p)}
                                  className="p-1.5 rounded-lg text-stone-600 hover:text-[#4A1513] hover:bg-stone-100 transition cursor-pointer"
                                  title="Edit Product"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                  title="Delete Listing"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
                <h2 className="font-serif text-2xl font-normal text-stone-900">Customer Orders</h2>
                <p className="text-xs text-stone-500 mt-1">Review orders placed by shoppers for your brand creations</p>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
                {orders.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <ShoppingCart size={36} className="mx-auto text-stone-300 mb-3" />
                    <h3 className="font-serif text-lg text-stone-800">No orders received yet</h3>
                    <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                      Incoming orders with buyer shipping addresses and payment confirmation will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {orders.map((o) => (
                      <div key={o.id} className="p-5 sm:p-6 hover:bg-[#FAF7F5]/40 transition">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                          <div>
                            <span className="text-xs font-bold text-[#4A1513] uppercase tracking-wider">Order #{o.id}</span>
                            <p className="text-xs text-stone-500 mt-0.5">Placed on {new Date(o.createdAt || Date.now()).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-stone-900">₹{o.total?.toLocaleString("en-IN")}</span>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {o.status}
                            </span>
                          </div>
                        </div>

                        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600">
                          <div>
                            <p className="font-bold text-stone-700 uppercase tracking-wider mb-1">Customer &amp; Shipping</p>
                            <p className="font-medium text-stone-900">{o.shippingName || o.user?.name || "Customer"}</p>
                            <p>{o.shippingPhone || o.user?.phone || "+91 98765 43210"}</p>
                            <p>{o.shippingAddr ? `${o.shippingAddr}, ${o.shippingCity || ''}` : "Bangalore, Karnataka"}</p>
                          </div>
                          <div>
                            <p className="font-bold text-stone-700 uppercase tracking-wider mb-1">Payment Method</p>
                            <p className="font-medium text-stone-900">{o.paymentMethod || "Prepaid (Razorpay / UPI)"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: STORE SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-2xs">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-stone-100">
                  <div className="w-14 h-14 rounded-2xl bg-[#FAF7F5] border border-stone-200 text-[#4A1513] flex items-center justify-center font-serif text-2xl font-bold">
                    {(vendorProfile?.businessName || user.name || "F")[0]}
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl text-stone-900 font-normal">
                      {vendorProfile?.businessName || user.name || "Femazon Partner Boutique"}
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">Vendor Account ID: #{vendorProfile?.id || user.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-stone-200/60">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Registered Email</span>
                    <p className="font-medium text-stone-900">{vendorProfile?.email || user.email}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-stone-200/60">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Contact Phone</span>
                    <p className="font-medium text-stone-900">{vendorProfile?.phone || "+91 98765 43210"}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-stone-200/60">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Boutique Category</span>
                    <p className="font-medium text-stone-900">{vendorProfile?.businessCategory || "Luxury Bridal Couture & Designer Ethnic"}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-stone-200/60">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Partner Tier</span>
                    <p className="font-medium text-emerald-700">Verified Designer Partner ✓</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F5] border border-stone-200 text-[#4A1513] flex items-center justify-center mx-auto mb-4 shadow-2xs">
              <LogOut size={22} strokeWidth={1.75} />
            </div>

            <h3 className="font-serif text-2xl font-normal text-stone-900">Sign Out of Vendor Portal?</h3>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Your vendor workspace session will be securely terminated. You can log back in at any time from /vendor.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleVendorLogout}
                disabled={isLoggingOut}
                className="w-full py-3.5 rounded-full bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <Sparkles size={14} className="animate-spin" />
                    <span>Signing out...</span>
                  </>
                ) : (
                  <>
                    <LogOut size={14} />
                    <span>Yes, Sign Out</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
