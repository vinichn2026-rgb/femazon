"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, Heart, ShoppingBag, UserCircle2, Camera, X, ChevronDown, ChevronRight } from 'lucide-react';

type AuthSession = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// Rich Navigation Data replacing the old structure
const richNavigationData: Record<string, any[]> = {
  Women: [
    {
      title: "TRENDING CATEGORIES",
      items: [
        { name: "Dresses", desc: "Maxi, Midi & Mini styles", href: "/products?category=dresses", dotColor: "bg-rose-400", badge: "HOT" },
        { name: "Tops & Shirts", desc: "Everyday & party wear", href: "/products?category=tops", dotColor: "bg-purple-400", badge: "" },
        { name: "Ethnic Wear", desc: "Kurti, Sarees & Lehengas", href: "/products?category=ethnic", dotColor: "bg-orange-400", badge: "NEW" },
        { name: "Co-ords", desc: "Matching sets for ease", href: "/products?category=coords", dotColor: "bg-emerald-400", badge: "" }
      ]
    },
    {
      title: "ESSENTIALS",
      items: [
        { name: "Bottom Wear", desc: "Jeans, Trousers & Skirts", href: "/products?category=bottoms", dotColor: "bg-blue-400", badge: "" },
        { name: "Activewear", desc: "Gym & yoga fits", href: "/products?category=activewear", dotColor: "bg-rose-400", badge: "30% OFF" },
        { name: "Accessories", desc: "Jewelry, Bags & Belts", href: "/products?category=accessories", dotColor: "bg-amber-400", badge: "" },
        { name: "Shoes", desc: "Heels, Flats & Sneakers", href: "/products?category=shoes", dotColor: "bg-indigo-400", badge: "" }
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
  { name: 'Women', hasMega: true, href: '/products?category=women' },
  { name: 'New In', hasMega: false, href: '/products?sort=newest' },
  { name: 'Beauty', hasMega: false, href: '/products?category=beauty' },
  { name: 'Services', hasMega: true, href: '/services' },
  { name: 'AI Wardrobe', hasMega: true, href: '/ai-wardrobe' },
];

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

  const toggleAccordion = (name: string) => {
    setActiveAccordion(prev => prev === name ? null : name);
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
      <header className="sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-md transition-all shadow-sm border-b border-accent/10">
        <div className="mx-auto flex h-[88px] max-w-[1400px] items-center justify-between px-6">
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex md:hidden text-text-main transition hover:text-primary mr-4"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Left: Logo */}
          <Link href="/" className="group flex items-center shrink-0">
            <span className="font-serif text-[32px] font-light tracking-widest text-primary transition group-hover:opacity-80">
              FEMAZON<span className="text-secondary text-lg">.</span>
            </span>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden h-full flex-1 items-center justify-center gap-6 md:flex lg:gap-8">
            {mainNavLinks.map((link) => (
              <div key={link.name} className="group flex h-full items-center relative">
                <Link 
                  href={link.href} 
                  className="flex h-full items-center text-[13px] font-bold tracking-widest uppercase transition border-b-2 border-transparent hover:text-primary text-text-main group-hover:text-primary gap-1"
                >
                  {link.name}
                  {link.hasMega && <ChevronDown size={14} className="transition-transform duration-300 group-hover:-rotate-180" />}
                </Link>

                {/* Desktop Rich Dropdown / Mega Menu */}
                {link.hasMega && richNavigationData[link.name] && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full z-50 w-max min-w-[500px] invisible opacity-0 translate-y-2 bg-white shadow-xl shadow-slate-200/40 border border-slate-100 rounded-2xl transition-all duration-300 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 p-6 flex gap-8">
                    {richNavigationData[link.name]?.map((col, idx) => (
                      <div key={idx} className="flex flex-col flex-1">
                        <h4 className="mb-3 px-3 text-[11px] font-semibold tracking-wider text-primary uppercase">
                          {col.title}
                        </h4>
                        <ul className="flex flex-col gap-1">
                          {col.items.map((item: any, i: number) => (
                            <li key={i}>
                              <Link 
                                href={item.href} 
                                className="group/item flex items-center px-3 py-2.5 rounded-xl hover:bg-slate-50/80 transition-all duration-150"
                              >
                                {/* Center: Text */}
                                <div className="flex flex-col flex-1">
                                  <span className="font-medium text-sm text-slate-800 group-hover/item:text-primary transition-colors">
                                    {item.name}
                                  </span>
                                  <span className="text-xs text-slate-400 group-hover/item:text-slate-500 font-normal mt-0.5">
                                    {item.desc}
                                  </span>
                                </div>

                                {/* Right: Badge or Arrow */}
                                <div className="flex items-center justify-end shrink-0 ml-4">
                                  {item.badge ? (
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                      item.badge === 'HOT' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                      item.badge === 'NEW' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                      'bg-amber-50 text-amber-600 border border-amber-100'
                                    }`}>
                                      {item.badge}
                                    </span>
                                  ) : (
                                    <ChevronRight size={16} className="text-slate-300 opacity-0 -translate-x-1 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-x-1" />
                                  )}
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right: Actions (Search, User, Cart) */}
          <div className="flex shrink-0 items-center justify-end gap-5 lg:gap-6">
            <button className="flex items-center text-text-main transition hover:text-primary">
              <Search size={22} strokeWidth={1.5} />
              <span className="sr-only">Search</span>
            </button>
            
            {isLoggedIn ? (
              <div className="group relative hidden items-center md:flex h-full py-6">
                <Link href="/profile" className="text-text-main transition hover:text-primary">
                  <UserCircle2 size={22} strokeWidth={1.5} />
                </Link>
                <div className="absolute right-0 top-full -mt-2 invisible opacity-0 flex w-48 flex-col bg-surface border border-accent/20 p-2 shadow-xl transition-all group-hover:visible group-hover:opacity-100 z-50">
                  <Link href="/profile" className="px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-accent/10 hover:text-primary">My Account</Link>
                  <Link href="/orders" className="px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-accent/10 hover:text-primary">Orders</Link>
                  {role === 'VENDOR' && <Link href="/vendor/dashboard" className="px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-accent/10 hover:text-primary">Vendor Dashboard</Link>}
                  {role === 'ADMIN' && <Link href="/admin/dashboard" className="px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-accent/10 hover:text-primary">Admin Dashboard</Link>}
                  <div className="my-1 border-t border-accent/10"></div>
                  <Link href="/api/auth/logout" className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5">Logout</Link>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hidden text-text-main transition hover:text-primary md:block">
                <UserCircle2 size={22} strokeWidth={1.5} />
              </Link>
            )}

            <Link href="/cart" className="relative text-text-main transition hover:text-primary">
              <ShoppingBag size={22} strokeWidth={1.5} />
              <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-white shadow-sm">0</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Sliding Menu (Accordion) */}
      <div 
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
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
          <div className="flex items-center justify-between border-b border-accent/20 px-6 py-4">
            <span className="font-serif text-xl font-black text-primary">Femazon.</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-text-muted hover:text-text-main">
              <X size={24} strokeWidth={1.5} />
            </button>
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
            
            <div className="flex flex-col gap-4">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-primary mb-2">Shop</h4>
              <Link href="/products?sort=newest" className="text-xs font-medium text-text-muted hover:text-primary transition">New Arrivals</Link>
              <Link href="/products?category=clothing" className="text-xs font-medium text-text-muted hover:text-primary transition">Clothing</Link>
              <Link href="/products?category=shoes" className="text-xs font-medium text-text-muted hover:text-primary transition">Shoes</Link>
              <Link href="/products?category=accessories" className="text-xs font-medium text-text-muted hover:text-primary transition">Accessories</Link>
              <Link href="/products?category=beauty" className="text-xs font-medium text-text-muted hover:text-primary transition">Beauty</Link>
              <Link href="/products?category=offers" className="text-xs font-medium text-primary hover:underline transition">Offers</Link>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-primary mb-2">Services</h4>
              <Link href="/services/makeup" className="text-xs font-medium text-text-muted hover:text-primary transition">Makeup</Link>
              <Link href="/services/mehndi" className="text-xs font-medium text-text-muted hover:text-primary transition">Mehndi</Link>
              <Link href="/services/salon" className="text-xs font-medium text-text-muted hover:text-primary transition">Salon</Link>
              <Link href="/services/styling" className="text-xs font-medium text-text-muted hover:text-primary transition">Personal Styling</Link>
              <Link href="/services/shopping-assistant" className="text-xs font-medium text-text-muted hover:text-primary transition">Shopping Assistant</Link>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-primary mb-2">AI</h4>
              <Link href="/ai-wardrobe" className="text-xs font-medium text-text-muted hover:text-primary transition">AI Wardrobe</Link>
              <Link href="/ai-wardrobe/suggestions" className="text-xs font-medium text-text-muted hover:text-primary transition">Outfit Suggestions</Link>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-primary mb-2">Customer Care</h4>
              <Link href="/contact" className="text-xs font-medium text-text-muted hover:text-primary transition">Contact Us</Link>
              <Link href="/track-order" className="text-xs font-medium text-text-muted hover:text-primary transition">Track Order</Link>
              <Link href="/shipping" className="text-xs font-medium text-text-muted hover:text-primary transition">Shipping</Link>
              <Link href="/returns" className="text-xs font-medium text-text-muted hover:text-primary transition">Returns</Link>
              <Link href="/faqs" className="text-xs font-medium text-text-muted hover:text-primary transition">FAQs</Link>
            </div>

            <div className="flex flex-col gap-4">
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
    </div>
  );
}
