"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/* =========================================================================
   1. SHOP DROPDOWN: Minimal & Elegant 4 Main Categories
   ========================================================================= */
const SHOP_MAIN_CATEGORIES = [
  {
    title: "Women's Wear",
    href: "/womens-wear",
    description: "Sarees, Kurtas, Lehengas, Dresses & Western Wear",
    accent: "bg-[#4A1513]",
  },
  {
    title: "Beauty & Self-care",
    href: "/beauty",
    description: "Skincare, Haircare, Makeup, Fragrances & Botanical Rituals",
    accent: "bg-[#8B5E3C]",
  },
  {
    title: "Jewellery & Accessories",
    href: "/jewellery",
    description: "Regal Kundan, Handbags, Potlis, Footwear & Shawls",
    accent: "bg-[#C5A059]",
  },
  {
    title: "Gifts for Every Occasion",
    href: "/gifts",
    description: "Curated Hampers, Celebration Boxes & Thoughtful Surprises",
    accent: "bg-[#6B2D5C]",
  },
];

export function ShopDropdown({ isOpen, onClose, onMouseEnter, onMouseLeave }: DropdownProps) {
  const [categories, setCategories] = useState(SHOP_MAIN_CATEGORIES);

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.categories) && data.categories.length > 0 && isMounted) {
            const mapped = data.categories.map((c: any) => {
              let href = `/shop?dept=${encodeURIComponent(c.slug)}`;
              if (c.slug === "womens-wear") href = "/womens-wear";
              else if (c.slug === "beauty") href = "/beauty?view=products";
              else if (c.slug === "jewellery") href = "/jewellery";
              else if (c.slug === "gifts") href = "/gifts";

              const subSummary = (c.subcategories || [])
                .slice(0, 5)
                .map((s: any) => s.name)
                .join(", ");

              return {
                title: c.name,
                href,
                description: c.description || (subSummary ? `${subSummary}...` : "Curated collections"),
                accent: "bg-[#4A1513]",
              };
            });
            setCategories(mapped);
          }
        }
      } catch {
        // Fallback to static SHOP_MAIN_CATEGORIES on error
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute top-full left-0 mt-1 w-[380px] bg-white rounded-2xl shadow-[0_16px_40px_rgba(74,21,19,0.12)] border border-stone-200/90 p-3.5 z-50 transition-all duration-180 ease-out select-none ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto visible"
          : "opacity-0 -translate-y-1 pointer-events-none invisible"
      }`}
    >
      {/* Invisible hover bridge to eliminate any gap between nav link and dropdown */}
      <div className="absolute -top-3 left-0 right-0 h-3" />

      {/* Header Label */}
      <div className="px-3 pt-2 pb-2.5 border-b border-stone-100 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
          Shop by Category
        </span>
        <span className="text-[10px] text-stone-400 font-medium">{categories.length} Categories</span>
      </div>

      {/* Main Categories List - Dynamically synced from database */}
      <div className="py-2 space-y-1">
        {categories.map((cat, idx) => (
          <Link
            key={cat.title}
            href={cat.href}
            onClick={onClose}
            className="group flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF7F5] border border-transparent hover:border-[#C5A059]/35 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#4A1513]/5 text-[#4A1513] group-hover:bg-[#4A1513] group-hover:text-white transition-all flex items-center justify-center shrink-0 font-serif font-bold text-xs shadow-2xs">
                {idx + 1}
              </div>
              <div className="min-w-0">
                <h4 className="text-[13px] font-semibold text-stone-900 group-hover:text-[#4A1513] transition-colors leading-tight">
                  {cat.title}
                </h4>
                <p className="text-[11px] text-stone-500 truncate mt-0.5 group-hover:text-stone-700 transition-colors">
                  {cat.description}
                </p>
              </div>
            </div>
            <ArrowRight
              size={14}
              className="text-stone-300 group-hover:text-[#4A1513] group-hover:translate-x-1 transition-all shrink-0 ml-2"
            />
          </Link>
        ))}
      </div>

      {/* Bottom Direct Link to All Products */}
      <div className="pt-2.5 px-3 border-t border-stone-100 flex items-center justify-between">
        <span className="text-[11px] text-stone-400">Authentic luxury collections</span>
        <Link
          href="/shop"
          onClick={onClose}
          className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider hover:text-[#C5A059] inline-flex items-center gap-1 transition-colors"
        >
          <span>View All Products</span>
          <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  );
}

/* =========================================================================
   2. DISCOVER DROPDOWN: Clean List
   ========================================================================= */
export function DiscoverDropdown({ isOpen, onClose, onMouseEnter, onMouseLeave }: DropdownProps) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute top-full left-0 mt-1 w-[220px] bg-white rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-stone-200/90 py-2.5 px-2 z-50 transition-all duration-180 ease-out select-none ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto visible"
          : "opacity-0 -translate-y-1 pointer-events-none invisible"
      }`}
    >
      <div className="absolute -top-3 left-0 right-0 h-3" />
      <div className="space-y-0.5">
        <Link
          href="/shop?sort=newest"
          onClick={onClose}
          className="text-[12.5px] text-stone-700 hover:text-[#4A1513] hover:bg-stone-50 rounded-lg px-2.5 py-1.5 transition-colors block"
        >
          Fresh Arrivals
        </Link>
        <Link
          href="/shop?filter=trending"
          onClick={onClose}
          className="text-[12.5px] text-stone-700 hover:text-[#4A1513] hover:bg-stone-50 rounded-lg px-2.5 py-1.5 transition-colors block"
        >
          Trending Collections
        </Link>
        <Link
          href="/shop?filter=bestseller"
          onClick={onClose}
          className="text-[12.5px] text-stone-700 hover:text-[#4A1513] hover:bg-stone-50 rounded-lg px-2.5 py-1.5 transition-colors block"
        >
          Bestselling Styles
        </Link>
        <Link
          href="/curated"
          onClick={onClose}
          className="text-[12.5px] text-stone-700 hover:text-[#4A1513] hover:bg-stone-50 rounded-lg px-2.5 py-1.5 transition-colors block"
        >
          Celebrity Spotlight
        </Link>
        <div className="my-1.5 border-t border-stone-100" />
        <Link
          href="/discover"
          onClick={onClose}
          className="text-[11.5px] font-bold text-[#4A1513] px-2.5 py-1 hover:underline block"
        >
          Explore Discover Hub →
        </Link>
      </div>
    </div>
  );
}

/* =========================================================================
   3. PERSONAL STYLING DROPDOWN: Clean List
   ========================================================================= */
export function PersonalStylingDropdown({ isOpen, onClose, onMouseEnter, onMouseLeave }: DropdownProps) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute top-full left-0 mt-1 w-[240px] bg-white rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-stone-200/90 py-2.5 px-2 z-50 transition-all duration-180 ease-out select-none ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto visible"
          : "opacity-0 -translate-y-1 pointer-events-none invisible"
      }`}
    >
      <div className="absolute -top-3 left-0 right-0 h-3" />
      <div className="space-y-0.5">
        <Link
          href="/personal-styling"
          onClick={onClose}
          className="text-[12.5px] text-stone-700 hover:text-[#4A1513] hover:bg-stone-50 rounded-lg px-2.5 py-1.5 transition-colors block"
        >
          1-on-1 Video Consultation
        </Link>
        <Link
          href="/personal-styling"
          onClick={onClose}
          className="text-[12.5px] text-stone-700 hover:text-[#4A1513] hover:bg-stone-50 rounded-lg px-2.5 py-1.5 transition-colors block"
        >
          Wardrobe Audit &amp; Revamp
        </Link>
        <Link
          href="/personal-styling"
          onClick={onClose}
          className="text-[12.5px] text-stone-700 hover:text-[#4A1513] hover:bg-stone-50 rounded-lg px-2.5 py-1.5 transition-colors block"
        >
          Bridal &amp; Festive Trousseau
        </Link>
        <Link
          href="/personal-styling"
          onClick={onClose}
          className="text-[12.5px] text-stone-700 hover:text-[#4A1513] hover:bg-stone-50 rounded-lg px-2.5 py-1.5 transition-colors block"
        >
          Lookbook &amp; Color Analysis
        </Link>
        <div className="my-1.5 border-t border-stone-100" />
        <Link
          href="/personal-styling"
          onClick={onClose}
          className="text-[11.5px] font-bold text-[#4A1513] px-2.5 py-1 hover:underline block"
        >
          Book Stylist Session →
        </Link>
      </div>
    </div>
  );
}

/* =========================================================================
   4. OUR BRANDS DROPDOWN: Clean List
   ========================================================================= */
export function BrandsDropdown({ isOpen, onClose, onMouseEnter, onMouseLeave }: DropdownProps) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute top-full left-0 mt-1 w-[230px] bg-white rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-stone-200/90 py-2.5 px-2 z-50 transition-all duration-180 ease-out select-none ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto visible"
          : "opacity-0 -translate-y-1 pointer-events-none invisible"
      }`}
    >
      <div className="absolute -top-3 left-0 right-0 h-3" />
      <div className="space-y-0.5">
        <Link
          href="/brands?city=Coimbatore"
          onClick={onClose}
          className="text-[12.5px] text-stone-700 hover:text-[#4A1513] hover:bg-stone-50 rounded-lg px-2.5 py-1.5 transition-colors block"
        >
          Coimbatore Handlooms
        </Link>
        <Link
          href="/brands?city=Chennai"
          onClick={onClose}
          className="text-[12.5px] text-stone-700 hover:text-[#4A1513] hover:bg-stone-50 rounded-lg px-2.5 py-1.5 transition-colors block"
        >
          Chennai Designer Studios
        </Link>
        <Link
          href="/brands?city=Bangalore"
          onClick={onClose}
          className="text-[12.5px] text-stone-700 hover:text-[#4A1513] hover:bg-stone-50 rounded-lg px-2.5 py-1.5 transition-colors block"
        >
          Bangalore Boutiques
        </Link>
        <Link
          href="/brands?city=Mumbai"
          onClick={onClose}
          className="text-[12.5px] text-stone-700 hover:text-[#4A1513] hover:bg-stone-50 rounded-lg px-2.5 py-1.5 transition-colors block"
        >
          Mumbai Couture Labels
        </Link>
        <div className="my-1.5 border-t border-stone-100" />
        <Link
          href="/brands"
          onClick={onClose}
          className="text-[11.5px] font-bold text-[#4A1513] px-2.5 py-1 hover:underline block"
        >
          Browse All Brands →
        </Link>
      </div>
    </div>
  );
}

/* =========================================================================
   5. PARTNER WITH FEMAZON DROPDOWN: Clean List
   ========================================================================= */
export function PartnerDropdown({ isOpen, onClose, onMouseEnter, onMouseLeave }: DropdownProps) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute top-full right-0 mt-1 w-[240px] bg-white rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-stone-200/90 py-2.5 px-2 z-50 transition-all duration-180 ease-out select-none ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto visible"
          : "opacity-0 -translate-y-1 pointer-events-none invisible"
      }`}
    >
      <div className="absolute -top-3 left-0 right-0 h-3" />
      <div className="space-y-0.5">
        <Link
          href="/partner"
          onClick={onClose}
          className="text-[12.5px] text-stone-700 hover:text-[#4A1513] hover:bg-stone-50 rounded-lg px-2.5 py-1.5 transition-colors block font-medium"
        >
          Designer &amp; Boutique Partnerships
        </Link>
        <Link
          href="/seller/dashboard"
          onClick={onClose}
          className="text-[12.5px] text-stone-700 hover:text-[#4A1513] hover:bg-stone-50 rounded-lg px-2.5 py-1.5 transition-colors block"
        >
          Partner Dashboard
        </Link>
        <Link
          href="/personal-styling"
          onClick={onClose}
          className="text-[12.5px] text-stone-700 hover:text-[#4A1513] hover:bg-stone-50 rounded-lg px-2.5 py-1.5 transition-colors block"
        >
          Stylist Partner Program
        </Link>
        <Link
          href="/partner"
          onClick={onClose}
          className="text-[12.5px] text-stone-700 hover:text-[#4A1513] hover:bg-stone-50 rounded-lg px-2.5 py-1.5 transition-colors block"
        >
          Partner Benefits &amp; Guidelines
        </Link>
        <div className="my-1.5 border-t border-stone-100" />
        <Link
          href="/partner"
          onClick={onClose}
          className="text-[11.5px] font-bold text-[#4A1513] px-2.5 py-1 hover:underline block"
        >
          Explore Femazon Partner Network →
        </Link>
      </div>
    </div>
  );
}
