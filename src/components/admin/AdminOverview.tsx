"use client";

import React from "react";
import {
  Store,
  Sparkles,
  Users,
  Package,
  ShoppingCart,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

interface AdminOverviewProps {
  users: any[];
  vendors: any[];
  stylists: any[];
  products: any[];
  orders: any[];
  bookings: any[];
  categories: any[];
  onNavigateTab: (tabId: string) => void;
}

export function AdminOverview({
  users,
  vendors,
  stylists,
  products,
  orders,
  bookings,
  categories,
  onNavigateTab,
}: AdminOverviewProps) {
  // 1. Calculations - 100% database-driven metrics
  const totalProductVendors = vendors.length;
  const pendingVendorApprovals = vendors.filter((v) => v.status === "PENDING" || v.status === "UNDER_REVIEW").length;

  const totalServiceProviders = stylists.length;
  const pendingStylistApprovals = stylists.filter((s) => s.status === "PENDING" || s.status === "UNDER_REVIEW").length;

  const totalCustomers = users.filter((u) => u.role === "CUSTOMER").length;
  const totalProducts = products.length;
  const pendingProductApprovals = products.filter((p) => p.approvalStatus === "PENDING").length;

  const totalOrders = orders.length;
  const totalOrderRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const totalBookings = bookings.length;
  const totalBookingRevenue = bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

  // Recent lists
  const recentOrders = orders.slice(0, 5);
  const recentBookings = bookings.slice(0, 5);
  const pendingVendorsList = vendors.filter((v) => v.status === "PENDING").slice(0, 3);
  const pendingStylistsList = stylists.filter((s) => s.status === "PENDING").slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Platform Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#4A1513] via-[#3D110F] to-[#200504] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-[#4A1513]/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-xs">
            <ShieldCheck size={14} className="text-amber-300" />
            <span>Super Admin Control Centre</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-white mb-2">
            Marketplace Operations Overview
          </h2>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            Real-time platform governance across two independent divisions: the <strong className="text-amber-200">Women&apos;s Gallery Product Marketplace</strong> and the <strong className="text-amber-200">Personal Styling Services Marketplace</strong>.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none opacity-60" />
      </div>

      {/* 8 Smart KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Product Vendors */}
        <div 
          onClick={() => onNavigateTab("product-vendors")}
          className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-105 transition">
              <Store size={20} />
            </div>
            {pendingVendorApprovals > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 animate-pulse">
                {pendingVendorApprovals} Pending
              </span>
            ) : (
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          <p className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-1">Product Vendors</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-serif font-bold text-stone-900">{totalProductVendors}</p>
            <span className="text-xs text-[#4A1513] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
              Manage <ChevronRight size={14} />
            </span>
          </div>
        </div>

        {/* Total Service Providers (Stylists) */}
        <div 
          onClick={() => onNavigateTab("personal-stylists")}
          className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center group-hover:scale-105 transition">
              <Sparkles size={20} />
            </div>
            {pendingStylistApprovals > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 animate-pulse">
                {pendingStylistApprovals} Pending
              </span>
            ) : (
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Verified
              </span>
            )}
          </div>
          <p className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-1">Service Vendors</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-serif font-bold text-stone-900">{totalServiceProviders}</p>
            <span className="text-xs text-[#4A1513] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
              Manage <ChevronRight size={14} />
            </span>
          </div>
        </div>


        {/* Total Customers */}
        <div 
          onClick={() => onNavigateTab("customers")}
          className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center group-hover:scale-105 transition">
              <Users size={20} />
            </div>
            <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              Registered
            </span>
          </div>
          <p className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-1">Total Customers</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-serif font-bold text-stone-900">{totalCustomers}</p>
            <span className="text-xs text-[#4A1513] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
              View <ChevronRight size={14} />
            </span>
          </div>
        </div>

        {/* Product Orders */}
        <div 
          onClick={() => onNavigateTab("orders")}
          className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition">
              <ShoppingCart size={20} />
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
              ₹{totalOrderRevenue.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-1">Product Orders</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-serif font-bold text-stone-900">{totalOrders}</p>
            <span className="text-xs text-[#4A1513] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
              Orders Table <ChevronRight size={14} />
            </span>
          </div>
        </div>

        {/* Styling Bookings */}
        <div 
          onClick={() => onNavigateTab("bookings")}
          className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-800 flex items-center justify-center group-hover:scale-105 transition">
              <CalendarDays size={20} />
            </div>
            <span className="text-[11px] font-bold text-violet-800 bg-violet-50 px-2 py-0.5 rounded-full">
              ₹{totalBookingRevenue.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-1">Styling Bookings</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-serif font-bold text-stone-900">{totalBookings}</p>
            <span className="text-xs text-[#4A1513] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
              Bookings Table <ChevronRight size={14} />
            </span>
          </div>
        </div>

        {/* Product Approvals */}
        <div 
          onClick={() => onNavigateTab("product-approvals")}
          className={`p-5 rounded-2xl border transition cursor-pointer group ${
            pendingProductApprovals > 0 
              ? 'bg-amber-50/70 border-amber-300 shadow-2xs' 
              : 'bg-white border-stone-200/90'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#4A1513] flex items-center justify-center group-hover:scale-105 transition">
              <Package size={20} />
            </div>
            {pendingProductApprovals > 0 ? (
              <span className="text-[11px] font-bold text-amber-950 bg-amber-200 px-2 py-0.5 rounded-full animate-pulse">
                {pendingProductApprovals} Pending
              </span>
            ) : (
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                All Verified
              </span>
            )}
          </div>
          <p className="text-xs uppercase tracking-wider text-stone-600 font-bold mb-1">Product Approvals</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-serif font-bold text-stone-900">{totalProducts}</p>
            <span className="text-xs text-[#4A1513] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
              Review Listings <ChevronRight size={14} />
            </span>
          </div>
        </div>

        {/* Pending Vendor Approvals */}
        <div 
          onClick={() => onNavigateTab("product-vendors")}
          className={`p-5 rounded-2xl border transition cursor-pointer group ${
            pendingVendorApprovals > 0 
              ? 'bg-amber-50/60 border-amber-300' 
              : 'bg-white border-stone-200/90'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <span className="text-[11px] font-bold text-amber-900">Action Required</span>
          </div>
          <p className="text-xs uppercase tracking-wider text-stone-600 font-bold mb-1">Pending Vendors</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-serif font-bold text-amber-900">{pendingVendorApprovals}</p>
            <span className="text-xs text-[#4A1513] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
              Review <ChevronRight size={14} />
            </span>
          </div>
        </div>

        {/* Pending Stylist Approvals */}
        <div 
          onClick={() => onNavigateTab("personal-stylists")}
          className={`p-5 rounded-2xl border transition cursor-pointer group ${
            pendingStylistApprovals > 0 
              ? 'bg-purple-50/60 border-purple-300' 
              : 'bg-white border-stone-200/90'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <span className="text-[11px] font-bold text-purple-900">Action Required</span>
          </div>
          <p className="text-xs uppercase tracking-wider text-stone-600 font-bold mb-1">Pending Stylists</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-serif font-bold text-purple-900">{pendingStylistApprovals}</p>
            <span className="text-xs text-[#4A1513] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
              Review <ChevronRight size={14} />
            </span>
          </div>
        </div>

      </div>

      {/* Two-Division Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Division A: Product Marketplace Performance */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#4A1513]/10 text-[#4A1513] flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">Product Marketplace</h3>
                  <p className="text-xs text-stone-500">Women&apos;s Gallery External Vendors</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigateTab("orders")}
                className="text-xs font-bold text-[#4A1513] hover:underline flex items-center gap-1"
              >
                Orders <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-[#FAF7F5] p-3.5 rounded-xl border border-stone-100 text-center">
                <p className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Total GMV</p>
                <p className="text-lg font-serif font-bold text-[#4A1513] mt-0.5">₹{totalOrderRevenue.toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-[#FAF7F5] p-3.5 rounded-xl border border-stone-100 text-center">
                <p className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Live Products</p>
                <p className="text-lg font-serif font-bold text-stone-900 mt-0.5">{products.filter(p => p.approvalStatus === 'APPROVED').length}</p>
              </div>
              <div className="bg-[#FAF7F5] p-3.5 rounded-xl border border-stone-100 text-center">
                <p className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Active Vendors</p>
                <p className="text-lg font-serif font-bold text-stone-900 mt-0.5">{vendors.filter(v => v.status === 'APPROVED').length}</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Recent Orders</p>
              {recentOrders.length === 0 ? (
                <div className="text-center py-6 text-xs text-stone-400 bg-stone-50 rounded-xl">
                  No orders recorded yet. Live orders will populate automatically.
                </div>
              ) : (
                recentOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100/70 transition text-xs">
                    <div>
                      <p className="font-semibold text-stone-900">Order #{o.id}</p>
                      <p className="text-stone-500 text-[11px]">{o.user?.name || o.shippingName || o.user?.email || "Guest"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-stone-900">₹{o.total}</p>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-stone-100 flex justify-between items-center text-xs">
            <span className="text-stone-500">Categories: Women&apos;s Wear, Beauty Care, Jewellery, Gifts</span>
            <button 
              onClick={() => onNavigateTab("product-vendors")}
              className="text-[#4A1513] font-bold hover:underline"
            >
              Inspect Vendors &rarr;
            </button>
          </div>
        </div>

        {/* Division B: Service Marketplace Performance */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-xs">
                  B
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">Service Marketplace</h3>
                  <p className="text-xs text-stone-500">Personal Styling Professionals & Packages</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigateTab("bookings")}
                className="text-xs font-bold text-purple-900 hover:underline flex items-center gap-1"
              >
                Bookings <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100 text-center">
                <p className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Service GMV</p>
                <p className="text-lg font-serif font-bold text-purple-900 mt-0.5">₹{totalBookingRevenue.toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100 text-center">
                <p className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Verified Stylists</p>
                <p className="text-lg font-serif font-bold text-stone-900 mt-0.5">{stylists.filter(s => s.status === 'APPROVED' && s.verified).length}</p>
              </div>
              <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100 text-center">
                <p className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Packages</p>
                <p className="text-lg font-serif font-bold text-stone-900 mt-0.5">
                  {stylists.reduce((acc, s) => acc + (s.packages?.length || 0), 0)}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Recent Bookings</p>
              {recentBookings.length === 0 ? (
                <div className="text-center py-6 text-xs text-stone-400 bg-stone-50 rounded-xl">
                  No bookings recorded yet. Client appointments will populate automatically.
                </div>
              ) : (
                recentBookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-purple-50/40 hover:bg-purple-50/80 transition text-xs">
                    <div>
                      <p className="font-semibold text-stone-900">{b.customerName || b.user?.name || "Client"}</p>
                      <p className="text-stone-500 text-[11px]">{b.package?.title || "Styling Session"} &bull; {b.stylist?.fullName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-stone-900">₹{b.totalAmount}</p>
                      <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded">
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-stone-100 flex justify-between items-center text-xs">
            <span className="text-stone-500">Services: Wardrobe Audit, Bridal Styling, Makeover, Lookbook</span>
            <button 
              onClick={() => onNavigateTab("personal-stylists")}
              className="text-purple-900 font-bold hover:underline"
            >
              Inspect Stylists &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* Pending Approvals Quick Actions */}
      {(pendingVendorsList.length > 0 || pendingStylistsList.length > 0) && (
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={20} className="text-amber-800" />
            <h3 className="font-serif text-lg font-bold text-amber-950">Pending Registration Approvals</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingVendorsList.map((v) => (
              <div key={v.id} className="bg-white p-4 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">Vendor</span>
                    <p className="font-bold text-stone-900 text-sm">{v.businessName}</p>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{v.ownerName || "Owner"} &bull; {v.email}</p>
                </div>
                <button 
                  onClick={() => onNavigateTab("product-vendors")}
                  className="px-3 py-1.5 bg-[#4A1513] text-white text-xs font-bold rounded-lg hover:bg-[#350B0A] transition"
                >
                  Review
                </button>
              </div>
            ))}

            {pendingStylistsList.map((s) => (
              <div key={s.id} className="bg-white p-4 rounded-xl border border-purple-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded">Stylist</span>
                    <p className="font-bold text-stone-900 text-sm">{s.fullName}</p>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{s.city} &bull; {s.experience}</p>
                </div>
                <button 
                  onClick={() => onNavigateTab("personal-stylists")}
                  className="px-3 py-1.5 bg-purple-900 text-white text-xs font-bold rounded-lg hover:bg-purple-950 transition"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
