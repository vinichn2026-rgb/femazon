"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, Heart, ShoppingBag, UserCircle2, Camera, X, ChevronDown, ChevronRight, MapPin, MessageCircle, LogOut, Sparkles } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { SearchBar } from './SearchBar';
import { useFemazonStore } from '@/context/FemazonStoreContext';
import { GlobalCartDrawer } from '@/components/cart/GlobalCartDrawer';
import { LogoutConfirmModal } from '@/components/auth/LogoutConfirmModal';
import { WhatsAppFloatingButton } from '@/components/common/WhatsAppFloatingButton';
import { FemazonAIChatDrawer } from '@/components/chat/FemazonAIChatDrawer';
import { BrandLogo } from '@/components/common/BrandLogo';
import { generateWhatsAppLink } from '@/lib/whatsapp';

type AuthSession = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// Rich Navigation Data replacing the old structure
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

interface MegaMenuConfig {
  columns: {
    title: string;
    items: { label: string; href: string }[];
  }[];
  cards: {
    title: string;
    subtitle: string;
    image: string;
    href: string;
  }[];
}

const CATEGORY_MENU_CONFIGS: Record<string, MegaMenuConfig> = {};

export function SiteLayout({
  children,
  authSession,
}: {
  children: React.ReactNode;
  authSession?: AuthSession | null;
}) {
  const isLoggedIn = Boolean(authSession);
  const role = authSession?.role;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Global Real-time Store State
  const { cartCount, openCart, wishlistCount, user, requestLogout } = useFemazonStore();

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

  return (
    <div className="min-h-screen bg-background text-text-main font-sans overflow-x-hidden">
      
      {/* 1. Top Banner (Evara Style) */}
      <div className="w-full bg-[#4A1513] py-2 px-6">
        <div className="mx-auto flex max-w-[1400px] items-center justify-center text-[11px] font-bold uppercase tracking-widest text-white/90">
          Prepaid orders get priority shipping 🚚
        </div>
      </div>

      {/* 2. Main Navigation */}
      <header className="sticky top-0 z-50 w-full bg-white transition-all shadow-sm border-b border-stone-200">
        {/* Tier 1: Logo, Search, Actions */}
        <div className="mx-auto flex h-[92px] md:h-[102px] max-w-[1400px] items-center px-4 sm:px-6 relative gap-4 sm:gap-8">
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex md:hidden text-text-main transition hover:text-primary"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Left: Brand Logo (Trendy Luxury Couture Wordmark) */}
          <BrandLogo />

          {/* Center: Search Bar (Luxury Maroon Shade & Subtle Minimal Radius) */}
          <div className="flex-1 max-w-2xl mx-auto hidden md:block">
             <form onSubmit={handleSearchSubmit} className="group relative w-full border border-[#4A1513]/25 hover:border-[#4A1513]/50 rounded-sm h-[44px] flex items-center px-4 bg-[#4A1513]/[0.02] hover:bg-[#4A1513]/[0.04] transition-all duration-200 focus-within:bg-white focus-within:border-[#4A1513] focus-within:ring-2 focus-within:ring-[#4A1513]/15 focus-within:shadow-xs shadow-[0_1px_4px_rgba(74,21,19,0.04)]">
               <Search size={17} className="text-[#4A1513]/60 group-focus-within:text-[#4A1513] shrink-0 transition-colors" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search for products, brands and more" 
                 className="w-full bg-transparent border-none focus:outline-none text-[13.5px] text-[#4A1513] px-3 placeholder:text-stone-400 focus:placeholder:text-stone-300 font-normal"
               />
               <div className="h-5 w-[1px] bg-[#4A1513]/20 mx-3"></div>
               <button type="button" onClick={() => router.push('/search')} className="flex items-center gap-2 text-[#4A1513]/80 hover:text-[#4A1513] hover:bg-[#4A1513]/10 px-2.5 py-1 rounded-sm transition-colors shrink-0 text-[12px] font-medium whitespace-nowrap cursor-pointer">
                 <Camera size={16} className="text-[#4A1513]" /> Image Search
               </button>
             </form>
          </div>

          {/* Right: Actions (Store, User, Wishlist, Cart, WhatsApp) */}
          <div className="flex shrink-0 items-center justify-end gap-5 lg:gap-7 ml-auto">
            <Link href="/stores" className="hidden xl:flex items-center gap-2 text-text-main hover:text-primary transition-colors">
              <MapPin size={20} strokeWidth={1.5} />
              <span className="text-[13px] font-medium">Find a store</span>
            </Link>
            
            {/* User Account Dropdown (Aza Style with Minimal Radius) */}
            <div className="group relative hidden items-center md:flex h-full py-6">
              <Link 
                href={isLoggedIn ? "/profile" : "/login"} 
                className="text-stone-800 transition hover:text-[#4A1513]"
              >
                <UserCircle2 size={23} strokeWidth={1.5} />
              </Link>
              
              <div className="absolute right-0 top-full -mt-1 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 flex w-68 flex-col bg-white rounded-sm border border-stone-200/90 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.12)] transition-all duration-200 z-50">
                
                {/* Header Row: Hi {Name} | 💎 Ruby */}
                <div className="flex items-center justify-between px-4 pb-3 pt-1 border-b border-stone-100">
                  <div className="truncate min-w-0 pr-2">
                    <span className="text-[13px] font-bold text-stone-900 truncate block">
                      Hi {user?.name ? user.name.split(' ')[0] : 'Guest'}
                    </span>
                    {user?.email && (
                      <span className="text-[10px] text-stone-400 truncate block">
                        {user.email}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 pl-2.5 border-l border-stone-200 shrink-0">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs border border-rose-300 bg-rose-50/80 text-stone-900 text-[10.5px] font-bold">
                      <span>💎</span>
                      <span>{user?.tier || 'Ruby'}</span>
                    </span>
                  </div>
                </div>

                {!isLoggedIn && (
                  <div className="p-3 border-b border-stone-100">
                    <Link
                      href="/login"
                      className="block w-full py-2 px-3 bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-wider text-center rounded-sm transition shadow-xs"
                    >
                      Login / Sign Up
                    </Link>
                  </div>
                )}

                {/* Clean Navigation Links */}
                <div className="py-1 text-[13px] text-stone-800 font-normal">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-stone-50 hover:text-[#4A1513] transition-colors">
                    Account Details
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 hover:bg-stone-50 hover:text-[#4A1513] transition-colors">
                    Orders and Returns
                  </Link>
                  <Link href="/wallet" className="block px-4 py-2 hover:bg-stone-50 hover:text-[#4A1513] transition-colors">
                    Femazon Wallet / Gift Cards
                  </Link>
                  <Link href="/addresses" className="block px-4 py-2 hover:bg-stone-50 hover:text-[#4A1513] transition-colors">
                    Saved Addresses
                  </Link>
                  <Link href="/bookings" className="block px-4 py-2 hover:bg-stone-50 hover:text-[#4A1513] transition-colors">
                    My Bookings
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 hover:bg-stone-50 hover:text-[#4A1513] transition-colors">
                    Settings
                  </Link>
                  
                  {role === 'VENDOR' && (
                    <Link href="/seller/dashboard" className="block px-4 py-2 text-[#4A1513] font-semibold hover:bg-stone-50 transition-colors">
                      Vendor Dashboard
                    </Link>
                  )}
                  {role === 'ADMIN' && (
                    <Link href="/admin/dashboard" className="block px-4 py-2 text-[#4A1513] font-semibold hover:bg-stone-50 transition-colors">
                      Admin Dashboard
                    </Link>
                  )}

                  {isLoggedIn && (
                    <>
                      <div className="my-1.5 border-t border-stone-100" />
                      <button
                        type="button"
                        onClick={requestLogout}
                        className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 font-semibold transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span>Logout</span>
                        <LogOut size={13} />
                      </button>
                    </>
                  )}
                </div>

              </div>
            </div>

            {/* Live Wishlist Counter */}
            <Link href="/wishlist" className="relative text-stone-800 transition hover:text-[#4A1513]">
              <Heart size={22} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#4A1513] text-[10px] font-bold text-white shadow-sm animate-in zoom-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Live Cart Trigger Button */}
            <button 
              type="button"
              onClick={openCart}
              className="relative text-stone-800 transition hover:text-[#4A1513] cursor-pointer"
              title="Shopping Bag"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#4A1513] text-[10px] font-bold text-white shadow-sm animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Direct WhatsApp Concierge Trigger */}
            <a 
              href={generateWhatsAppLink({ type: 'general' })}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block text-[#25D366] hover:scale-110 transition-transform"
              title="Chat with Concierge on WhatsApp"
            >
              <MessageCircle size={24} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Tier 2: Horizontal Category Navigation (with Mega Menu) */}
        <div className="w-full border-t border-stone-100 bg-white hidden md:block">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between h-[48px] relative">
            {SUB_NAV_ITEMS.map((item) => {
              const activeMenuData = CATEGORY_MENU_CONFIGS[item] || {
                columns: DEFAULT_MENU_COLUMNS,
                cards: DEFAULT_MENU_CARDS,
              };

              return (
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

                {/* Mega Menu Dropdown (Sleek, Compact & Classy Half-Height) */}
                <div className="absolute left-0 right-0 top-full z-50 invisible opacity-0 translate-y-1 bg-white shadow-xl border-t border-stone-200/90 transition-all duration-300 ease-out group-hover:visible group-hover:opacity-100 group-hover:translate-y-0">
                  <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-4 flex gap-8 items-stretch bg-white">
                    
                    {/* LEFT SIDE (around 42% width): Clean 3-Column Text Navigation (No Designers) */}
                    <div className="w-[42%] grid grid-cols-3 gap-5 py-1">
                      {activeMenuData.columns.map((col, idx) => (
                        <div key={col.title} className={`flex flex-col ${idx !== activeMenuData.columns.length - 1 ? 'border-r border-stone-100 pr-4' : ''}`}>
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

                    {/* Subtle Vertical Divider */}
                    <div className="w-[1px] bg-stone-200/70 my-1 self-stretch" />

                    {/* RIGHT SIDE (around 60% width): 4 Full-View Fashion Cards Horizontally */}
                    <div className="w-[60%] flex flex-col justify-stretch py-1">
                      <div className="grid grid-cols-4 gap-3.5 h-full">
                        {activeMenuData.cards.map((card) => (
                          <Link
                            key={card.title}
                            href={card.href}
                            className="group/card flex flex-col h-full bg-white rounded-xl overflow-hidden border border-stone-200/80 hover:border-[#4A1513]/50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 cursor-pointer"
                          >
                            {/* Full-View Image Container */}
                            <div className="relative w-full flex-1 min-h-[145px] overflow-hidden bg-stone-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={card.image}
                                alt={card.title}
                                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover/card:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Content Below Image: Side-by-side row */}
                            <div className="px-2.5 py-2.5 bg-white flex items-center justify-between gap-1 shrink-0 border-t border-stone-100">
                              <h5 className="font-serif text-[11px] font-semibold text-stone-900 group-hover/card:text-[#4A1513] transition-colors leading-tight truncate">
                                {card.title}
                              </h5>
                              <div className="flex items-center gap-0.5 text-[8.5px] font-bold tracking-[0.1em] uppercase text-[#4A1513] shrink-0 transition-colors">
                                <span>SHOP NOW</span>
                                <span className="group-hover/card:translate-x-0.5 transition-transform duration-200">→</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </header>

      {/* Mobile Sliding Menu (Accordion) */}
      <div 
        className={`fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-[320px] bg-surface shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between border-b border-accent/20 px-6 py-3.5">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/femazon-logo.png" 
                alt="Femazon" 
                className="h-10 sm:h-11 w-auto object-contain" 
              />
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-text-muted hover:text-text-main p-1">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="px-6 pt-4 pb-1">
            <SearchBar className="!max-w-full" />
          </div>

          {/* Mobile Nav Links */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ul className="flex flex-col space-y-1">
              {mainNavLinks.map((link) => (
                <li key={link.name} className="border-b border-accent/10 last:border-0">
                  {link.hasMega ? (
                    <div className="flex flex-col">
                      <button 
                        onClick={() => toggleAccordion(link.name)}
                        className="flex items-center justify-between py-4 text-sm font-bold uppercase tracking-widest text-text-main"
                      >
                        {link.name}
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-200 ${activeAccordion === link.name ? 'rotate-180' : ''}`}
                        />
                      </button>
                      
                      {/* Accordion Content */}
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeAccordion === link.name ? 'max-h-[1000px] pb-4' : 'max-h-0'}`}>
                        {richNavigationData[link.name]?.map((col, idx) => (
                          <div key={idx} className="mb-4 last:mb-0 pl-2 border-l border-accent/20 ml-2 mt-2">
                            <h4 className="mb-3 font-serif text-sm font-bold text-primary">{col.title}</h4>
                            <ul className="space-y-3">
                              {col.items.map((item: any) => (
                                <li key={item.name}>
                                  <Link 
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center text-xs font-medium tracking-wide text-text-muted transition-colors hover:text-primary gap-2"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-4 text-sm font-bold uppercase tracking-widest text-text-main"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Footer Actions */}
          <div className="border-t border-accent/20 p-6">
            <div className="grid grid-cols-2 gap-4">
              {isLoggedIn ? (
                <Link href="/profile" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-main">
                  <UserCircle2 size={18} /> Account
                </Link>
              ) : (
                <Link href="/login" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-main">
                  <UserCircle2 size={18} /> Sign In
                </Link>
              )}
              <Link href="/wishlist" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-main">
                <Heart size={18} /> Wishlist
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main>{children}</main>

      <footer className="bg-surface border-t border-accent/20 pt-16 pb-8 text-text-main">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-primary mb-2">Shop</h4>
              <Link href="/shop?sort=newest" className="text-xs font-medium text-text-muted hover:text-primary transition">New Arrivals</Link>
              <Link href="/shop?category=clothing" className="text-xs font-medium text-text-muted hover:text-primary transition">Clothing</Link>
              <Link href="/shop?category=shoes" className="text-xs font-medium text-text-muted hover:text-primary transition">Shoes</Link>
              <Link href="/shop?category=accessories" className="text-xs font-medium text-text-muted hover:text-primary transition">Accessories</Link>
              <Link href="/shop?category=beauty" className="text-xs font-medium text-text-muted hover:text-primary transition">Beauty</Link>
              <Link href="/shop?category=offers" className="text-xs font-medium text-primary hover:underline transition">Offers</Link>
            </div>

            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-primary mb-2">Services</h4>
              <Link href="/services/makeup" className="text-xs font-medium text-text-muted hover:text-primary transition">Makeup</Link>
              <Link href="/services/mehndi" className="text-xs font-medium text-text-muted hover:text-primary transition">Mehndi</Link>
              <Link href="/services/salon" className="text-xs font-medium text-text-muted hover:text-primary transition">Salon</Link>
              <Link href="/services/styling" className="text-xs font-medium text-text-muted hover:text-primary transition">Personal Styling</Link>
              <Link href="/services/shopping-assistant" className="text-xs font-medium text-text-muted hover:text-primary transition">Shopping Assistant</Link>
            </div>

            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-primary mb-2">AI</h4>
              <Link href="/ai-wardrobe" className="text-xs font-medium text-text-muted hover:text-primary transition">AI Wardrobe</Link>
              <Link href="/ai-wardrobe/suggestions" className="text-xs font-medium text-text-muted hover:text-primary transition">Outfit Suggestions</Link>
            </div>

            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-primary mb-2">Customer Care</h4>
              <Link href="/contact" className="text-xs font-medium text-text-muted hover:text-primary transition">Contact Us</Link>
              <Link href="/track-order" className="text-xs font-medium text-text-muted hover:text-primary transition">Track Order</Link>
              <Link href="/shipping" className="text-xs font-medium text-text-muted hover:text-primary transition">Shipping</Link>
              <Link href="/returns" className="text-xs font-medium text-text-muted hover:text-primary transition">Returns</Link>
              <Link href="/faqs" className="text-xs font-medium text-text-muted hover:text-primary transition">FAQs</Link>
            </div>

            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-primary mb-2">Company</h4>
              <Link href="/about" className="text-xs font-medium text-text-muted hover:text-primary transition">About Femazon</Link>
              <Link href="/vendor/register" className="text-xs font-medium text-text-muted hover:text-primary transition">Become a Seller</Link>
              <Link href="/services/provider/register" className="text-xs font-medium text-text-muted hover:text-primary transition">Become a Service Provider</Link>
              <Link href="/services/shopping-assistant/become-assistant" className="text-xs font-medium text-text-muted hover:text-primary transition">Become a Shopping Assistant</Link>
            </div>

          </div>

          <div className="border-t border-accent/20 pt-8 pb-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 text-text-muted">
              {/* Social Media Icons (Mock) */}
              <a href="#" className="hover:text-primary transition"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg></a>
              <a href="#" className="hover:text-primary transition"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path></svg></a>
              <a href="#" className="hover:text-primary transition"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg></a>
            </div>

            <div className="flex gap-4 items-center">
              <span className="text-xs font-bold text-text-muted">SECURE CHECKOUT</span>
              <div className="flex gap-2">
                <div className="h-6 w-10 bg-accent/20 rounded border border-accent/30 flex items-center justify-center text-[8px] font-bold">VISA</div>
                <div className="h-6 w-10 bg-accent/20 rounded border border-accent/30 flex items-center justify-center text-[8px] font-bold">MC</div>
                <div className="h-6 w-10 bg-accent/20 rounded border border-accent/30 flex items-center justify-center text-[8px] font-bold">AMEX</div>
              </div>
            </div>
          </div>

          <div className="border-t border-accent/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-text-muted font-bold uppercase tracking-widest">
            <p>© 2026 Femazon. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-primary transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary transition">Terms & Conditions</Link>
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

      {/* WedMeGood Style AI Wedding & Couture Stylist Concierge */}
      <Suspense fallback={null}>
        <FemazonAIChatDrawer />
      </Suspense>
    </div>
  );
}
