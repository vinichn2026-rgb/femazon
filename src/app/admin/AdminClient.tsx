"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Grid, 
  Store, 
  Package, 
  ShoppingCart, 
  Sparkles, 
  CalendarDays, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Loader2,
  Layers
} from "lucide-react";
import { useRouter } from "next/navigation";

import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminProductVendors } from "@/components/admin/AdminProductVendors";
import { AdminVendorProducts } from "@/components/admin/AdminVendorProducts";
import { AdminCategoryManagement } from "@/components/admin/AdminCategoryManagement";
import { AdminOrdersManagement } from "@/components/admin/AdminOrdersManagement";
import { AdminPersonalStylists } from "@/components/admin/AdminPersonalStylists";
import { AdminStylistBookings } from "@/components/admin/AdminStylistBookings";
import { AdminCustomers } from "@/components/admin/AdminCustomers";
import { AdminMarketplaceAnalytics } from "@/components/admin/AdminMarketplaceAnalytics";

export default function AdminClient({ 
  user, 
  users = [], 
  vendors = [], 
  stylists = [], 
  products = [], 
  categories = [], 
  orders = [], 
  bookings = [],
  initialTab = "overview"
}: any) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (action: string, payload: any) => {
    if (action.includes("DELETE") && !confirm("Are you sure you want to proceed with this permanent deletion?")) {
      return;
    }
    
    setIsActionLoading(true);
    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload })
      });
      
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        alert(data.error || "Action failed. Please try again.");
        return;
      }
      
      router.refresh(); // Refresh server component data
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const pendingProductsCount = products.filter((p: any) => p.approvalStatus === 'PENDING').length;

  const navMenuItems = [
    { id: 'overview', icon: <Grid size={18}/>, label: 'Overview', group: 'DASHBOARD' },
    
    // Division A: Product Marketplace
    { id: 'product-approvals', icon: <Package size={18}/>, label: 'Product Approvals', group: "PRODUCT MARKETPLACE" },
    { id: 'categories', icon: <Layers size={18}/>, label: 'Categories & Taxonomy', group: "PRODUCT MARKETPLACE" },
    { id: 'product-vendors', icon: <Store size={18}/>, label: 'Product Vendors', group: "PRODUCT MARKETPLACE" },
    { id: 'orders', icon: <ShoppingCart size={18}/>, label: 'Orders Management', group: "PRODUCT MARKETPLACE" },
    
    // Division B: Service Marketplace
    { id: 'personal-stylists', icon: <Sparkles size={18}/>, label: 'Personal Stylists', group: "SERVICE MARKETPLACE" },
    { id: 'bookings', icon: <CalendarDays size={18}/>, label: 'Bookings Management', group: "SERVICE MARKETPLACE" },
    
    // Platform Governance
    { id: 'customers', icon: <Users size={18}/>, label: 'Customers', group: "PLATFORM GOVERNANCE" },
    { id: 'analytics', icon: <TrendingUp size={18}/>, label: 'Marketplace Analytics', group: "PLATFORM GOVERNANCE" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col font-sans text-stone-900 selection:bg-[#4A1513] selection:text-white">
      
      {/* Top Sticky Admin Navbar */}
      <AdminNavbar
        currentSection="Super Admin Control Centre"
        adminName={user?.name || "Super Admin"}
        adminEmail={user?.email || "admin@femazon.com"}
        stats={{
          productsCount: products?.length,
          ordersCount: orders?.length,
          vendorsCount: vendors?.length,
          usersCount: users?.length,
          bookingsCount: bookings?.length,
        }}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId)}
        navMenuItems={navMenuItems}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-7">
        
        {/* Left Sidebar Nav */}
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="bg-white rounded-3xl border border-stone-200/90 p-4 shadow-2xs sticky top-24 space-y-4">
            
            {/* Header info */}
            <div className="px-3 py-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#4A1513]/10 text-[#4A1513] flex items-center justify-center">
                  <ShieldCheck size={14} />
                </div>
                <p className="text-xs font-bold text-[#4A1513] uppercase tracking-wider">
                  Super Admin
                </p>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Platform Control Centre</p>
            </div>

            {/* Navigation grouped by division */}
            <div className="space-y-4">
              
              {/* Group 1: Core */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition cursor-pointer text-left ${
                    activeTab === 'overview'
                      ? 'bg-[#4A1513] text-white shadow-xs'
                      : 'text-stone-700 hover:bg-[#FAF7F5] hover:text-[#4A1513]'
                  }`}
                >
                  <Grid size={17} />
                  <span>Overview</span>
                </button>
              </div>

              {/* Group 2: Division A - Product Marketplace */}
              <div className="space-y-1">
                <div className="px-3 pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Product Marketplace
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('product-approvals')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer text-left ${
                    activeTab === 'product-approvals'
                      ? 'bg-[#4A1513] text-white shadow-xs font-bold'
                      : 'text-stone-700 hover:bg-[#FAF7F5] hover:text-[#4A1513]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package size={17} />
                    <span>Product Approvals</span>
                  </div>
                  {pendingProductsCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-500 text-white animate-pulse">
                      {pendingProductsCount}
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-400 font-mono">
                      {products.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('categories')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer text-left ${
                    activeTab === 'categories'
                      ? 'bg-[#4A1513] text-white shadow-xs font-bold'
                      : 'text-stone-700 hover:bg-[#FAF7F5] hover:text-[#4A1513]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Layers size={17} />
                    <span>Categories & Taxonomy</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {categories.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('product-vendors')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer text-left ${
                    activeTab === 'product-vendors'
                      ? 'bg-[#4A1513] text-white shadow-xs font-bold'
                      : 'text-stone-700 hover:bg-[#FAF7F5] hover:text-[#4A1513]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Store size={17} />
                    <span>Product Vendors</span>
                  </div>
                  {vendors.filter((v: any) => v.status === 'PENDING').length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer text-left ${
                    activeTab === 'orders'
                      ? 'bg-[#4A1513] text-white shadow-xs font-bold'
                      : 'text-stone-700 hover:bg-[#FAF7F5] hover:text-[#4A1513]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={17} />
                    <span>Orders Table</span>
                  </div>
                </button>
              </div>

              {/* Group 3: Division B - Service Marketplace */}
              <div className="space-y-1">
                <div className="px-3 pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-900/60">
                    Service Marketplace
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('personal-stylists')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer text-left ${
                    activeTab === 'personal-stylists'
                      ? 'bg-[#4A1513] text-white shadow-xs font-bold'
                      : 'text-stone-700 hover:bg-[#FAF7F5] hover:text-[#4A1513]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles size={17} />
                    <span>Personal Stylists</span>
                  </div>
                  {stylists.filter((s: any) => s.status === 'PENDING').length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer text-left ${
                    activeTab === 'bookings'
                      ? 'bg-[#4A1513] text-white shadow-xs font-bold'
                      : 'text-stone-700 hover:bg-[#FAF7F5] hover:text-[#4A1513]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CalendarDays size={17} />
                    <span>Bookings Table</span>
                  </div>
                </button>
              </div>

              {/* Group 4: Platform Governance */}
              <div className="space-y-1 pt-1">
                <div className="px-3 pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Platform Governance
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('customers')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer text-left ${
                    activeTab === 'customers'
                      ? 'bg-[#4A1513] text-white shadow-xs font-bold'
                      : 'text-stone-700 hover:bg-[#FAF7F5] hover:text-[#4A1513]'
                  }`}
                >
                  <Users size={17} />
                  <span>Customers</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer text-left ${
                    activeTab === 'analytics'
                      ? 'bg-[#4A1513] text-white shadow-xs font-bold'
                      : 'text-stone-700 hover:bg-[#FAF7F5] hover:text-[#4A1513]'
                  }`}
                >
                  <TrendingUp size={17} />
                  <span>Marketplace Analytics</span>
                </button>
              </div>

            </div>

          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <AdminOverview
              users={users}
              vendors={vendors}
              stylists={stylists}
              products={products}
              orders={orders}
              bookings={bookings}
              categories={categories}
              onNavigateTab={(tabId) => setActiveTab(tabId)}
            />
          )}

          {/* TAB: PRODUCT APPROVALS */}
          {activeTab === 'product-approvals' && (
            <AdminVendorProducts
              products={products}
              categories={categories}
              onAction={handleAction}
            />
          )}

          {/* TAB: CATEGORIES & TAXONOMY MANAGEMENT */}
          {activeTab === 'categories' && (
            <AdminCategoryManagement
              categories={categories}
              onAction={handleAction}
            />
          )}

          {/* TAB 2: PRODUCT VENDORS */}
          {activeTab === 'product-vendors' && (
            <AdminProductVendors
              vendors={vendors}
              onAction={handleAction}
            />
          )}


          {/* TAB 4: ORDERS MANAGEMENT (ADVANCED TABLE) */}
          {activeTab === 'orders' && (
            <AdminOrdersManagement
              orders={orders}
              onAction={handleAction}
            />
          )}

          {/* TAB 5: PERSONAL STYLISTS */}
          {(activeTab === 'personal-stylists' || activeTab === 'service-vendors') && (
            <AdminPersonalStylists
              stylists={stylists}
              onAction={handleAction}
            />
          )}

          {/* TAB 6: STYLIST BOOKINGS (ADVANCED TABLE) */}
          {activeTab === 'bookings' && (
            <AdminStylistBookings
              bookings={bookings}
              onAction={handleAction}
            />
          )}

          {/* TAB 7: CUSTOMERS */}
          {activeTab === 'customers' && (
            <AdminCustomers
              users={users}
              orders={orders}
              bookings={bookings}
              onAction={handleAction}
            />
          )}

          {/* TAB 8: MARKETPLACE ANALYTICS */}
          {activeTab === 'analytics' && (
            <AdminMarketplaceAnalytics
              orders={orders}
              bookings={bookings}
              vendors={vendors}
              stylists={stylists}
              products={products}
              categories={categories}
            />
          )}

        </main>
      </div>

    </div>
  );
}
