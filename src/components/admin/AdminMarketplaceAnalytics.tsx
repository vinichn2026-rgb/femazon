"use client";

import React, { useMemo } from "react";
import {
  TrendingUp,
  ShoppingCart,
  CalendarDays,
  Store,
  Sparkles,
  Package,
  Layers,
  Award
} from "lucide-react";

interface AdminMarketplaceAnalyticsProps {
  orders: any[];
  bookings: any[];
  vendors: any[];
  stylists: any[];
  products: any[];
  categories: any[];
}

export function AdminMarketplaceAnalytics({
  orders,
  bookings,
  vendors,
  stylists,
  products,
  categories,
}: AdminMarketplaceAnalyticsProps) {
  
  // 1. PRODUCT MARKETPLACE ANALYTICS (100% DB DRIVEN)
  const productAnalytics = useMemo(() => {
    const totalOrders = orders.length;
    const totalGMV = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalGMV / totalOrders) : 0;

    // Status distribution
    const statusCounts: Record<string, number> = {
      PLACED: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };
    orders.forEach((o) => {
      const st = o.status || "PLACED";
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    });

    // Vendor performance
    const vendorSales: Record<string, { name: string; totalRevenue: number; ordersCount: number }> = {};
    orders.forEach((o) => {
      (o.items || []).forEach((it: any) => {
        const vId = it.product?.vendorId || "Unknown";
        const vName = it.product?.vendor?.vendorProfile?.businessName || it.product?.vendor?.name || `Vendor #${vId}`;
        if (!vendorSales[vName]) {
          vendorSales[vName] = { name: vName, totalRevenue: 0, ordersCount: 0 };
        }
        vendorSales[vName].totalRevenue += (Number(it.price) || 0) * (Number(it.quantity) || 1);
        vendorSales[vName].ordersCount += 1;
      });
    });

    const topVendors = Object.values(vendorSales)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    return {
      totalOrders,
      totalGMV,
      avgOrderValue,
      statusCounts,
      topVendors,
    };
  }, [orders]);

  // 2. SERVICE MARKETPLACE ANALYTICS (100% DB DRIVEN)
  const serviceAnalytics = useMemo(() => {
    const totalBookings = bookings.length;
    const totalGMV = bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
    const avgBookingValue = totalBookings > 0 ? Math.round(totalGMV / totalBookings) : 0;
    const totalCommission = bookings.reduce((sum, b) => sum + (Number(b.commissionAmount) || 0), 0);

    // Status distribution
    const statusCounts: Record<string, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    bookings.forEach((b) => {
      const st = b.status || "PENDING";
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    });

    // Stylist performance
    const stylistSales: Record<string, { name: string; revenue: number; bookingsCount: number }> = {};
    bookings.forEach((b) => {
      const sName = b.stylist?.fullName || `Stylist #${b.stylistId}`;
      if (!stylistSales[sName]) {
        stylistSales[sName] = { name: sName, revenue: 0, bookingsCount: 0 };
      }
      stylistSales[sName].revenue += Number(b.totalAmount) || 0;
      stylistSales[sName].bookingsCount += 1;
    });

    const topStylists = Object.values(stylistSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalBookings,
      totalGMV,
      avgBookingValue,
      totalCommission,
      statusCounts,
      topStylists,
    };
  }, [bookings]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
              Live Database Metrics
            </span>
            <span className="text-xs text-stone-500">&bull; Zero Synthetic Data</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">Marketplace Analytics</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Strict division breakdown separating the physical Product Marketplace from Personal Styling Services.
          </p>
        </div>
      </div>

      {/* DIVISION A: PRODUCT MARKETPLACE */}
      <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
          <div className="w-8 h-8 rounded-lg bg-[#4A1513]/10 text-[#4A1513] flex items-center justify-center font-bold text-xs">
            A
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Product Marketplace Division</h3>
            <p className="text-xs text-stone-500">Physical merchandise orders across Women&apos;s Gallery</p>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#FAF7F5] p-5 rounded-2xl border border-stone-100">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Total Product GMV</p>
            <p className="text-2xl font-serif font-bold text-[#4A1513] mt-1">₹{productAnalytics.totalGMV.toLocaleString("en-IN")}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Total recorded order volume</p>
          </div>
          <div className="bg-[#FAF7F5] p-5 rounded-2xl border border-stone-100">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Total Orders</p>
            <p className="text-2xl font-serif font-bold text-stone-900 mt-1">{productAnalytics.totalOrders}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Processed checkout orders</p>
          </div>
          <div className="bg-[#FAF7F5] p-5 rounded-2xl border border-stone-100">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Average Order Value (AOV)</p>
            <p className="text-2xl font-serif font-bold text-stone-900 mt-1">₹{productAnalytics.avgOrderValue.toLocaleString("en-IN")}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Average ticket size</p>
          </div>
        </div>

        {/* Status Breakdown & Top Vendors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Order Status Distribution */}
          <div className="border border-stone-100 rounded-2xl p-5 bg-stone-50/50">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">Order Status Pipeline</p>
            <div className="space-y-2.5 text-xs">
              {Object.entries(productAnalytics.statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-100">
                  <span className="font-semibold text-stone-700">{status}</span>
                  <span className="font-bold text-stone-900 font-mono">{count} orders</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Vendors */}
          <div className="border border-stone-100 rounded-2xl p-5 bg-stone-50/50">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">Top Product Vendors</p>
            {productAnalytics.topVendors.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No vendor transactions recorded yet.</p>
            ) : (
              <div className="space-y-2.5 text-xs">
                {productAnalytics.topVendors.map((v, i) => (
                  <div key={v.name} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-600 font-bold text-[10px] flex items-center justify-center">
                        #{i + 1}
                      </span>
                      <span className="font-bold text-stone-900">{v.name}</span>
                    </div>
                    <span className="font-serif font-bold text-[#4A1513]">₹{v.totalRevenue.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* DIVISION B: SERVICE MARKETPLACE */}
      <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-xs">
            B
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Service Marketplace Division</h3>
            <p className="text-xs text-stone-500">Personal Styling consultations &amp; wardrobe packages</p>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Total Styling GMV</p>
            <p className="text-2xl font-serif font-bold text-purple-900 mt-1">₹{serviceAnalytics.totalGMV.toLocaleString("en-IN")}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Total booked sessions value</p>
          </div>
          <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Total Bookings</p>
            <p className="text-2xl font-serif font-bold text-stone-900 mt-1">{serviceAnalytics.totalBookings}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Appointment reservations</p>
          </div>
          <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Average Session Rate</p>
            <p className="text-2xl font-serif font-bold text-stone-900 mt-1">₹{serviceAnalytics.avgBookingValue.toLocaleString("en-IN")}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Mean package booking value</p>
          </div>
          <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Commission Accrued</p>
            <p className="text-2xl font-serif font-bold text-purple-950 mt-1">₹{serviceAnalytics.totalCommission.toLocaleString("en-IN")}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Platform service fees</p>
          </div>
        </div>

        {/* Status Breakdown & Top Stylists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Booking Status Pipeline */}
          <div className="border border-purple-100 rounded-2xl p-5 bg-purple-50/30">
            <p className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-3">Booking Status Pipeline</p>
            <div className="space-y-2.5 text-xs">
              {Object.entries(serviceAnalytics.statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between p-2 rounded-xl bg-white border border-purple-100">
                  <span className="font-semibold text-stone-700">{status}</span>
                  <span className="font-bold text-purple-900 font-mono">{count} sessions</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Stylists */}
          <div className="border border-purple-100 rounded-2xl p-5 bg-purple-50/30">
            <p className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-3">Top Personal Stylists</p>
            {serviceAnalytics.topStylists.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No styling sessions booked yet.</p>
            ) : (
              <div className="space-y-2.5 text-xs">
                {serviceAnalytics.topStylists.map((s, i) => (
                  <div key={s.name} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-purple-100">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-900 font-bold text-[10px] flex items-center justify-center">
                        #{i + 1}
                      </span>
                      <span className="font-bold text-stone-900">{s.name}</span>
                    </div>
                    <span className="font-serif font-bold text-purple-900">₹{s.revenue.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
