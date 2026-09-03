"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Search, 
  Menu, 
  Heart, 
  ShoppingBag, 
  UserCircle2, 
  Camera, 
  X, 
  ChevronDown, 
  ChevronRight, 
  MapPin, 
  LogOut, 
  Sparkles,
  CalendarDays
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { SearchBar } from './SearchBar';
import { useFemazonStore } from '@/context/FemazonStoreContext';
import { GlobalCartDrawer } from '@/components/cart/GlobalCartDrawer';
import { LogoutConfirmModal } from '@/components/auth/LogoutConfirmModal';
import { WhatsAppFloatingButton } from '@/components/common/WhatsAppFloatingButton';
import { FemazonAIChatDrawer } from '@/components/chat/FemazonAIChatDrawer';
import { BrandLogo } from '@/components/common/BrandLogo';

type AuthSession = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// Rich Navigation Data
const richNavigationData: Record<string, any[]> = {
  SHOP: [
    {
      title: "CHUDITHAR & SUITS",
      items: [
        { name: "Anarkali Chudithar", href: "/search?q=Anarkali%20Chudithar" },
        { name: "Straight Cut Chudithar", href: "/search?q=Straight%20Cut%20Chudithar" },
        { name: "Pakistani Style Suit", href: "/search?q=Pakistani%20Style%20Suit" },
        { name: "Palazzo & Sharara Suit", href: "/search?q=Sharara%20Suit" },
        { name: "Kurta Dupatta Sets", href: "/search?q=Kurta%20with%20Dupatta%20Set" }
      ]
    },
    {
      title: "DRESSES",
      items: [
        { name: "Midi Dresses", href: "/search?q=Midi%20Dresses" },
        { name: "Maxi Dresses", href: "/search?q=Maxi%20Dresses" },
        { name: "Mini Dresses", href: "/search?q=Mini%20Dresses" },
        { name: "Party Dresses", href: "/search?q=Party%20Dresses" }
      ]
    },
    {
      title: "ETHNIC",
      items: [
        { name: "Kurtas", href: "/search?q=Kurtas" },
        { name: "Anarkali", href: "/search?q=Anarkali" },
        { name: "Ethnic Dresses", href: "/search?q=Ethnic%20Dresses" },
        { name: "Kurta Sets", href: "/search?q=Kurta%20Sets" }
      ]
    },
    {
      title: "WESTERN",
      items: [
        { name: "Bodycon", href: "/search?q=Bodycon" },
        { name: "A-Line", href: "/search?q=A-Line" },
        { name: "Shirt Dresses", href: "/search?q=Shirt%20Dresses" },
        { name: "Maxi Dresses", href: "/search?q=Western%20Maxi" }
      ]
    },
    {
      title: "TOPS & CO-ORDS",
      items: [
        { name: "Crop Tops", href: "/search?q=Crop%20Tops" },
        { name: "Shirts & Blouses", href: "/search?q=Shirts" },
        { name: "Co-ords & Sets", href: "/search?q=Co-ords" },
        { name: "Indo-Western", href: "/search?q=Indo-Western" }
      ]
    },
    {
      title: "OCCASION",
      items: [
        { name: "Wedding Edit", href: "/search?q=Wedding" },
        { name: "Party & Festive", href: "/search?q=Party" },
        { name: "Casual Everyday", href: "/search?q=Casual" },
        { name: "Workwear / Office", href: "/search?q=Office" }
      ]
    }
  ],
  Services: [
    {
      title: "BOOK AN EXPERT",
      items: [
        { name: "Personal Styling", desc: "Find your perfect look", href: "/services/styling", dotColor: "bg-rose-400", badge: "HOT" },
        { name: "Makeup Artist", desc: "For weddings & parties", href: "/services/makeup", dotColor: "bg-pink-400", badge: "" },
        { name: "Shopping Assistant", desc: "Help while you shop", href: "/services/shopping", dotColor: "bg-purple-400", badge: "NEW" },
      ]
    }
  ],
  "AI Wardrobe": [
    {
      title: "YOUR DIGITAL CLOSET",
      items: [
        { name: "Outfit Suggestions", desc: "AI-powered daily looks", href: "/ai-wardrobe", dotColor: "bg-indigo-400", badge: "BETA" },
        { name: "My Wardrobe", desc: "Organize your pieces", href: "/ai-wardrobe/closet", dotColor: "bg-teal-400", badge: "" }
      ]
    }
  ]
};

const mainNavLinks = [
  { name: 'EXPLORE', hasMega: false, href: '/' },
  { name: 'SHOP', hasMega: false, href: '/shop' },
  { name: 'CURATED', hasMega: false, href: '/curated' },
  { name: 'SERVICES', hasMega: true, href: '/services' },
  { name: 'AI WARDROBE', hasMega: false, href: '/ai-wardrobe' },
];

const SUB_NAV_ITEMS = [
  "New", "Kurta Sets", "Lehengas", "Sarees", "Wedding", 
  "Indo-Western", "Western Wear", "Virtual Try On", "Femazon Exclusive", 
  "Dresses", "Femazon Services", "On Sale"
];

const DEFAULT_MENU_COLUMNS = [
  {
    title: "SHOP BY CATEGORY",
    items: [
      { label: "Kurta Sets", href: "/shop?category=Kurta+Sets" },
      { label: "Lehengas", href: "/shop?category=Lehengas" },
      { label: "Sarees", href: "/shop?category=Sarees" },
      { label: "Dresses", href: "/shop?category=Dresses" },
      { label: "Gowns", href: "/shop?category=Gowns" },
      { label: "Kaftans", href: "/shop?category=Kaftans" },
      { label: "Tops", href: "/shop?category=Tops" },
      { label: "Co-ord Sets", href: "/shop?category=Co-ord+Sets" },
      { label: "Indo-Western", href: "/shop?category=Indo-Western" },
      { label: "Western Wear", href: "/shop?category=Western+Wear" },
    ],
  },
  {
    title: "OCCASION",
    items: [
      { label: "Wedding Edit", href: "/shop?category=Wedding" },
      { label: "Festive Wear", href: "/shop?category=Festive" },
      { label: "Party Wear", href: "/shop?category=Party" },
      { label: "Casual Styles", href: "/shop?category=Casual" },
      { label: "Office Wear", href: "/shop?category=Workwear" },
      { label: "Vacation Edit", href: "/shop?category=Resortwear" },
      { label: "Evening Looks", href: "/shop?category=Evening" },
    ],
  },
  {
    title: "CURATED EDITS",
    items: [
      { label: "The Silk Legacy", href: "/curated" },
      { label: "Modern Indian Edit", href: "/curated" },
      { label: "The Salwar Edit", href: "/shop?category=Kurta+Sets" },
      { label: "Fusion Fever", href: "/curated" },
      { label: "Light Festive Edit", href: "/curated" },
      { label: "The Bridesmaid Edit", href: "/curated" },
      { label: "Wedding Guest Edit", href: "/curated" },
    ],
  },
];

const DEFAULT_MENU_CARDS = [
  {
    title: "Wedding Lehengas",
    subtitle: "Bridal Couture",
    image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600",
    href: "/shop?category=Lehengas",
  },
  {
    title: "Festive Sarees",
    subtitle: "Pure Silk Drapes",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=600",
    href: "/shop?category=Sarees",
  },
  {
    title: "Modern Kurta Sets",
    subtitle: "Contemporary Ethnic",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=600",
    href: "/shop?category=Kurta+Sets",
  },
  {
    title: "Evening Gowns",
    subtitle: "Couture Silhouettes",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=600",
    href: "/shop?category=Gowns",
  },
];

export function SiteLayout({
  children,
  authSession,
}: {
  children: React.ReactNode;
  authSession?: AuthSession | null;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Profile Dropdown Controlled State
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Global Real-time Store State
  const { cartCount, openCart, wishlistCount, user, bookingCount, requestLogout } = useFemazonStore();

  const isLoggedIn = Boolean(user || authSession);
  const role = user?.role || authSession?.role;
  const userFirstName = user?.firstName || (user?.name ? user.name.split(' ')[0] : 'Member');

  // Handle Click Outside Profile Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle ESC Key to Close Profile Dropdown
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleAccordion = (name: string) => {
    setActiveAccordion(prev => prev === name ? null : name);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Check if current route is dedicated auth page (/login or /register)
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] text-stone-900 font-sans flex flex-col justify-between antialiased selection:bg-[#4A1513] selection:text-white">
        {children}
        {/* Global Shopping Cart Drawer */}
        <GlobalCartDrawer />
        {/* Verified Logout Confirmation Modal */}
        <LogoutConfirmModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-main font-sans overflow-x-hidden">
      
      {/* 1. Top Announcement Banner */}
      <div className="w-full bg-[#4A1513] py-2 px-6">
        <div className="mx-auto flex max-w-[1400px] items-center justify-center text-[11px] font-bold uppercase tracking-widest text-white/90">
          Prepaid orders get priority shipping 🚚
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-white transition-all shadow-xs border-b border-stone-200">
        {/* Tier 1: Logo, Search, Actions */}
        <div className="mx-auto flex h-[88px] md:h-[96px] max-w-[1400px] items-center px-4 sm:px-6 relative gap-4 sm:gap-8">
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex md:hidden text-text-main transition hover:text-primary cursor-pointer p-1"
            aria-label="Open Navigation Menu"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Left: Brand Logo */}
          <BrandLogo />

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-2xl mx-auto hidden md:block">
             <form onSubmit={handleSearchSubmit} className="group relative w-full border border-[#4A1513]/25 hover:border-[#4A1513]/50 rounded-sm h-[44px] flex items-center px-4 bg-[#4A1513]/[0.02] hover:bg-[#4A1513]/[0.04] transition-all duration-200 focus-within:bg-white focus-within:border-[#4A1513] focus-within:ring-2 focus-within:ring-[#4A1513]/15 shadow-[0_1px_4px_rgba(74,21,19,0.04)]">
               <Search size={17} className="text-[#4A1513]/60 group-focus-within:text-[#4A1513] shrink-0 transition-colors" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search for products, brands, and styling services" 
                 className="w-full bg-transparent border-none focus:outline-none text-[13.5px] text-[#4A1513] px-3 placeholder:text-stone-400 focus:placeholder:text-stone-300 font-normal"
               />
               <div className="h-5 w-[1px] bg-[#4A1513]/20 mx-3"></div>
               <button type="button" onClick={() => router.push('/search')} className="flex items-center gap-2 text-[#4A1513]/80 hover:text-[#4A1513] hover:bg-[#4A1513]/10 px-2.5 py-1 rounded-sm transition-colors shrink-0 text-[12px] font-medium whitespace-nowrap cursor-pointer">
                 <Camera size={16} className="text-[#4A1513]" /> Image Search
               </button>
             </form>
          </div>

          {/* Right: Actions (Store, Bookings, Wishlist, Cart, Profile) */}
          <div className="flex shrink-0 items-center justify-end gap-4 sm:gap-6 lg:gap-7 ml-auto">
            
            {/* Find a Store */}
            <Link href="/stores" className="hidden xl:flex items-center gap-2 text-stone-700 hover:text-[#4A1513] transition-colors">
              <MapPin size={19} strokeWidth={1.5} />
              <span className="text-[13px] font-medium">Find a store</span>
            </Link>

            {/* DEDICATED BOOKING ICON WITH LIVE BADGE */}
            <Link 
              href="/bookings" 
              className="relative text-stone-800 hover:text-[#4A1513] transition-colors group cursor-pointer"
              title="My Bookings"
            >
              <CalendarDays size={22} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
              {bookingCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-[18px] min-w-[18px] px-1 items-center justify-center rounded-full bg-[#4A1513] text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
                  {bookingCount}
                </span>
              )}
            </Link>

            {/* Wishlist Counter */}
            <Link 
              href="/wishlist" 
              className="relative text-stone-800 hover:text-[#4A1513] transition-colors group"
              title="Wishlist"
            >
              <Heart size={22} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#4A1513] text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link (Full View Page) */}
            <Link 
              href="/cart"
              className="relative text-stone-800 hover:text-[#4A1513] transition-colors group cursor-pointer"
              title="Shopping Bag"
            >
              <ShoppingBag size={22} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#4A1513] text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* PROFILE DROPDOWN (Click-Controlled Bug Free) */}
            <div className="relative flex items-center" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="relative text-stone-800 hover:text-[#4A1513] transition-colors focus:outline-none cursor-pointer group p-1"
                aria-label="Account Menu"
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="true"
                title={isLoggedIn ? `Account (${userFirstName})` : "Account Login"}
              >
                {isLoggedIn ? (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FAF7F5] border border-stone-300 group-hover:border-[#4A1513] text-[#4A1513] flex items-center justify-center font-semibold text-xs transition-colors shadow-2xs">
                    {userFirstName.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <UserCircle2 size={23} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
                )}
              </button>

              {/* Clean Controlled Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-stone-200/90 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                  
                  {/* Dropdown Header */}
                  <div className="px-4 py-3 border-b border-stone-100">
                    <p className="text-[13.5px] font-bold text-stone-900">
                      {isLoggedIn ? `Hi, ${userFirstName} 👋` : 'Welcome to Femazon'}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {isLoggedIn ? 'Luxury Couture & Services' : 'Sign in to access your orders & wishlist'}
                    </p>
                  </div>

                  {/* Logged-Out Primary CTA */}
                  {!isLoggedIn && (
                    <div className="p-3 border-b border-stone-100 flex flex-col gap-2">
                      <Link
                        href="/login"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block w-full py-2.5 px-4 bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-wider text-center rounded-full transition shadow-xs"
                      >
                        Login / Sign Up
                      </Link>
                    </div>
                  )}

                  {/* Clean Links */}
                  <div className="py-1 text-[13px] text-stone-700">
                    <Link 
                      href="/profile" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-[#FAF7F5] hover:text-[#4A1513] transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link 
                      href="/orders" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-[#FAF7F5] hover:text-[#4A1513] transition-colors"
                    >
                      My Orders
                    </Link>
                    <Link 
                      href="/wishlist" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-[#FAF7F5] hover:text-[#4A1513] transition-colors"
                    >
                      Wishlist
                    </Link>
                    <Link 
                      href="/addresses" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-[#FAF7F5] hover:text-[#4A1513] transition-colors"
                    >
                      Saved Addresses
                    </Link>
                    <Link 
                      href="/settings" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-[#FAF7F5] hover:text-[#4A1513] transition-colors"
                    >
                      Settings
                    </Link>

                    {role === 'VENDOR' && (
                      <Link 
                        href="/seller/dashboard" 
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-2 text-[#4A1513] font-semibold hover:bg-[#FAF7F5] transition-colors"
                      >
                        Vendor Dashboard
                      </Link>
                    )}
                    {role === 'ADMIN' && (
                      <Link 
                        href="/admin/dashboard" 
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-2 text-[#4A1513] font-semibold hover:bg-[#FAF7F5] transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    {/* Logout Button */}
                    {isLoggedIn && (
                      <>
                        <div className="my-1.5 border-t border-stone-100" />
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            requestLogout();
                          }}
                          className="w-full text-left px-4 py-2.5 text-rose-600 hover:bg-rose-50 font-semibold transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>Logout</span>
                          <LogOut size={14} />
                        </button>
                      </>
                    )}
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>

        {/* Tier 2: Category Navigation Menu */}
        <div className="w-full border-t border-stone-100 bg-white hidden md:block">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between h-[46px] relative">
            {SUB_NAV_ITEMS.map((item) => (
              <div key={item} className="group flex h-full items-center">
                <Link 
                  href={
                    item === 'Virtual Try On'
                      ? '/virtual-try-on'
                      : item === 'Femazon Services'
                      ? '/services'
                      : `/shop?category=${encodeURIComponent(item)}`
                  } 
                  className={`flex h-full items-center text-[13px] tracking-wide transition-colors border-b-[3px] border-transparent group-hover:border-[#4A1513] ${
                    item === 'On Sale'
                      ? 'text-[#4A1513] font-semibold'
                      : 'text-stone-600 hover:text-[#4A1513] hover:font-medium'
                  }`}
                >
                  {item}
                </Link>

                {/* Mega Menu Dropdown */}
                <div className="absolute left-0 right-0 top-full z-50 invisible opacity-0 translate-y-1 bg-white shadow-xl border-t border-stone-200/90 transition-all duration-300 ease-out group-hover:visible group-hover:opacity-100 group-hover:translate-y-0">
                  <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-4 flex gap-8 items-stretch bg-white">
                    
                    {/* Left Columns */}
                    <div className="w-[42%] grid grid-cols-3 gap-5 py-1">
                      {DEFAULT_MENU_COLUMNS.map((col, idx) => (
                        <div key={col.title} className={`flex flex-col ${idx !== DEFAULT_MENU_COLUMNS.length - 1 ? 'border-r border-stone-100 pr-4' : ''}`}>
                          <h4 className="font-serif text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#4A1513] mb-2 pb-1 border-b border-stone-200/60 whitespace-nowrap">
                            {col.title}
                          </h4>
                          <ul className="flex flex-col gap-1">
                            {col.items.map((linkItem) => (
                              <li key={linkItem.label}>
                                <Link
                                  href={linkItem.href}
                                  className="text-[12px] text-stone-700 hover:text-[#4A1513] hover:font-medium hover:translate-x-1 transition-all duration-200 block py-0.5 leading-snug line-clamp-1"
                                >
                                  {linkItem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="w-[1px] bg-stone-200/70 my-1 self-stretch" />

                    {/* Right Cards */}
                    <div className="w-[60%] flex flex-col justify-stretch py-1">
                      <div className="grid grid-cols-4 gap-3.5 h-full">
                        {DEFAULT_MENU_CARDS.map((card) => (
                          <Link
                            key={card.title}
                            href={card.href}
                            className="group/card flex flex-col h-full bg-white rounded-xl overflow-hidden border border-stone-200/80 hover:border-[#4A1513]/50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 cursor-pointer"
                          >
                            <div className="relative w-full flex-1 min-h-[145px] overflow-hidden bg-stone-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={card.image}
                                alt={card.title}
                                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover/card:scale-105"
                              />
                            </div>
                            <div className="px-2.5 py-2.5 bg-white flex items-center justify-between gap-1 shrink-0 border-t border-stone-100">
                              <h5 className="font-serif text-[11px] font-semibold text-stone-900 group-hover/card:text-[#4A1513] transition-colors leading-tight truncate">
                                {card.title}
                              </h5>
                              <div className="flex items-center gap-0.5 text-[8.5px] font-bold tracking-[0.1em] uppercase text-[#4A1513] shrink-0">
                                <span>SHOP</span>
                                <span>→</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile Sliding Drawer */}
      <div 
        className={`fixed inset-0 z-50 bg-[#4A1513]/60 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-[320px] bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/femazon-logo.png" 
              alt="Femazon" 
              className="h-10 w-auto object-contain" 
            />
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-stone-500 hover:text-stone-900 p-1 cursor-pointer">
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="px-6 pt-4 pb-2">
          <SearchBar className="!max-w-full" />
        </div>

        {/* Mobile Nav Links */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <ul className="flex flex-col space-y-1">
            {mainNavLinks.map((link) => (
              <li key={link.name} className="border-b border-stone-100 last:border-0">
                <Link 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-sm font-bold uppercase tracking-widest text-stone-900 hover:text-[#4A1513]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Bottom Actions */}
        <div className="border-t border-stone-200 p-6 bg-[#FAF7F5]/50 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Link 
              href="/bookings" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-[#4A1513]"
            >
              <CalendarDays size={16} /> 
              <span>Bookings {bookingCount > 0 ? `(${bookingCount})` : ''}</span>
            </Link>

            <Link 
              href="/wishlist" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-[#4A1513]"
            >
              <Heart size={16} /> 
              <span>Wishlist</span>
            </Link>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
              <span className="text-xs font-semibold text-stone-700">Hi, {userFirstName} 👋</span>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  requestLogout();
                }}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 bg-[#4A1513] text-white text-xs font-bold uppercase tracking-widest text-center rounded-full transition shadow-xs"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>

      <main>{children}</main>

      {/* 5-Column Luxury Footer */}
      <footer className="bg-white border-t border-stone-200 pt-16 pb-8 text-stone-900">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-[#4A1513] mb-2">Shop</h4>
              <Link href="/shop?sort=newest" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">New Arrivals</Link>
              <Link href="/shop?category=clothing" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Clothing</Link>
              <Link href="/shop?category=shoes" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Shoes</Link>
              <Link href="/shop?category=accessories" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Accessories</Link>
              <Link href="/shop?category=beauty" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Beauty</Link>
              <Link href="/shop?category=offers" className="text-xs font-medium text-[#4A1513] hover:underline transition">Offers</Link>
            </div>

            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-[#4A1513] mb-2">Services</h4>
              <Link href="/services/makeup" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Makeup</Link>
              <Link href="/services/mehndi" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Mehndi</Link>
              <Link href="/services/salon" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Salon</Link>
              <Link href="/services/styling" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Personal Styling</Link>
              <Link href="/services/shopping-assistant" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Shopping Assistant</Link>
            </div>

            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-[#4A1513] mb-2">AI</h4>
              <Link href="/ai-wardrobe" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">AI Wardrobe</Link>
              <Link href="/ai-wardrobe/suggestions" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Outfit Suggestions</Link>
            </div>

            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-[#4A1513] mb-2">Customer Care</h4>
              <Link href="/contact" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Contact Us</Link>
              <Link href="/track-order" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Track Order</Link>
              <Link href="/shipping" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Shipping</Link>
              <Link href="/returns" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Returns</Link>
              <Link href="/faqs" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">FAQs</Link>
            </div>

            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-[#4A1513] mb-2">Company</h4>
              <Link href="/about" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">About Femazon</Link>
              <Link href="/vendor/register" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Become a Seller</Link>
              <Link href="/services/provider/register" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Become a Service Provider</Link>
              <Link href="/services/shopping-assistant/become-assistant" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Become a Shopping Assistant</Link>
            </div>

          </div>

          <div className="border-t border-stone-200 pt-8 pb-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 text-stone-500">
              <a href="#" className="hover:text-[#4A1513] transition"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg></a>
              <a href="#" className="hover:text-[#4A1513] transition"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path></svg></a>
            </div>

            <div className="flex gap-4 items-center">
              <span className="text-xs font-bold text-stone-500">SECURE CHECKOUT</span>
              <div className="flex gap-2">
                <div className="h-6 w-10 bg-stone-100 rounded border border-stone-200 flex items-center justify-center text-[8px] font-bold">VISA</div>
                <div className="h-6 w-10 bg-stone-100 rounded border border-stone-200 flex items-center justify-center text-[8px] font-bold">MC</div>
                <div className="h-6 w-10 bg-stone-100 rounded border border-stone-200 flex items-center justify-center text-[8px] font-bold">AMEX</div>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-stone-500 font-bold uppercase tracking-widest">
            <p>© {new Date().getFullYear()} Femazon. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-[#4A1513] transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#4A1513] transition">Terms &amp; Conditions</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Shopping Cart Drawer */}
      <GlobalCartDrawer />

      {/* Verified Logout Confirmation Modal */}
      <LogoutConfirmModal />

      {/* Branded Pulse WhatsApp FAB */}
      <WhatsAppFloatingButton />

      {/* AI Concierge Drawer */}
      <Suspense fallback={null}>
        <FemazonAIChatDrawer />
      </Suspense>
    </div>
  );
}
