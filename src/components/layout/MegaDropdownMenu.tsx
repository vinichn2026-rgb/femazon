"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Store, UserCheck, ShieldCheck } from "lucide-react";

export interface MegaDropdownMenuProps {
  activeDropdown: string | null;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function MegaDropdownMenu({
  activeDropdown,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: MegaDropdownMenuProps) {
  return (
    <>
      {/* 1. Subtle Dimming Backdrop */}
      <div
        className={`fixed inset-0 top-[58px] sm:top-[64px] bg-black/20 backdrop-blur-[1px] transition-opacity duration-200 z-30 pointer-events-auto ${
          activeDropdown ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Mega Dropdown Container */}
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`absolute top-full left-0 right-0 w-full bg-white border-b border-stone-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] transition-all duration-200 ease-out z-40 select-none ${
          activeDropdown
            ? "opacity-100 translate-y-0 pointer-events-auto visible"
            : "opacity-0 -translate-y-1.5 pointer-events-none invisible"
        }`}
      >
        {/* Invisible continuous hover bridge ensuring zero mouse leave flicker */}
        <div className="absolute -top-3 left-0 right-0 h-3" />

        <div className="mx-auto max-w-[1440px] px-6 lg:px-8 py-7 sm:py-8">
          {/* ========================================================
              MENU 1: SHOP (Femazon Core Category & Subcategory Catalog)
             ======================================================== */}
          {activeDropdown === "shop" && (
            <div>
              <div className="grid grid-cols-4 gap-7 xl:gap-9">
                {/* Column 1: Indian Wear */}
                <div>
                  <div className="pb-2 mb-3.5 border-b border-stone-100">
                    <Link
                      href="/womens-wear?category=Indian+Wear"
                      onClick={onClose}
                      className="text-[11.5px] font-bold tracking-widest uppercase text-[#4A1513] hover:underline"
                    >
                      Indian Wear
                    </Link>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Link
                        href="/womens-wear?category=Sarees"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Sarees
                      </Link>
                      <div className="mt-1 pl-1.5 space-y-0.5">
                        <Link
                          href="/womens-wear?category=Sarees&subCategory=Banarasi+Silk"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Banarasi Silk
                        </Link>
                        <Link
                          href="/womens-wear?category=Sarees&subCategory=Kanjeevaram+Heritage"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Kanjeevaram Heritage
                        </Link>
                        <Link
                          href="/womens-wear?category=Sarees&subCategory=Organza+%26+Tissue"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Organza &amp; Tissue
                        </Link>
                        <Link
                          href="/womens-wear?category=Sarees&subCategory=Pre-Draped+Sarees"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Pre-Draped Sarees
                        </Link>
                      </div>
                    </div>

                    <div>
                      <Link
                        href="/womens-wear?category=Kurtas+%26+Kurta+Sets"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Kurtas &amp; Kurta Sets
                      </Link>
                      <div className="mt-1 pl-1.5 space-y-0.5">
                        <Link
                          href="/womens-wear?category=Kurtas+%26+Kurta+Sets&subCategory=Straight+Kurta+Sets"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Straight Kurta Sets
                        </Link>
                        <Link
                          href="/womens-wear?category=Kurtas+%26+Kurta+Sets&subCategory=Chikankari+Handloom"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Chikankari Handloom
                        </Link>
                        <Link
                          href="/womens-wear?category=Kurtas+%26+Kurta+Sets&subCategory=Palazzo+Sets"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Palazzo Sets
                        </Link>
                      </div>
                    </div>

                    <div>
                      <Link
                        href="/womens-wear?category=Lehengas"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Lehengas
                      </Link>
                      <div className="mt-1 pl-1.5 space-y-0.5">
                        <Link
                          href="/womens-wear?category=Lehengas&subCategory=Bridal+Zardozi"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Bridal Zardozi
                        </Link>
                        <Link
                          href="/womens-wear?category=Lehengas&subCategory=Pastel+Sangeet"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Pastel Sangeet
                        </Link>
                      </div>
                    </div>

                    <div>
                      <Link
                        href="/womens-wear?category=Salwar+Suits"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Salwar Suits &amp; Anarkali
                      </Link>
                    </div>

                    <div>
                      <Link
                        href="/womens-wear?category=Sharara+%26+Gharara"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Sharara &amp; Gharara
                      </Link>
                    </div>

                    <div>
                      <Link
                        href="/womens-wear?category=Ethnic+Dresses"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Ethnic Dresses &amp; Indo-Western
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <Link
                      href="/womens-wear?category=Indian+Wear"
                      onClick={onClose}
                      className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore Indian Wear</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>

                {/* Column 2: Western Wear */}
                <div>
                  <div className="pb-2 mb-3.5 border-b border-stone-100">
                    <Link
                      href="/womens-wear?category=Western+Wear"
                      onClick={onClose}
                      className="text-[11.5px] font-bold tracking-widest uppercase text-[#4A1513] hover:underline"
                    >
                      Western Wear
                    </Link>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Link
                        href="/womens-wear?category=Dresses"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Dresses
                      </Link>
                      <div className="mt-1 pl-1.5 space-y-0.5">
                        <Link
                          href="/womens-wear?category=Dresses&subCategory=Maxi+Dresses"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Maxi Dresses
                        </Link>
                        <Link
                          href="/womens-wear?category=Dresses&subCategory=Midi+Dresses"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Midi Dresses
                        </Link>
                        <Link
                          href="/womens-wear?category=Dresses&subCategory=Evening+Gowns"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Evening Gowns
                        </Link>
                      </div>
                    </div>

                    <div>
                      <Link
                        href="/womens-wear?category=Tops+%26+Shirts"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Tops &amp; Shirts
                      </Link>
                      <div className="mt-1 pl-1.5 space-y-0.5">
                        <Link
                          href="/womens-wear?category=Tops+%26+Shirts&subCategory=Silk+%26+Satin+Shirts"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Silk &amp; Satin Shirts
                        </Link>
                        <Link
                          href="/womens-wear?category=Tops+%26+Shirts&subCategory=Peplum+Tops"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Peplum Tops
                        </Link>
                      </div>
                    </div>

                    <div>
                      <Link
                        href="/womens-wear?category=Co-ord+Sets"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Co-ord Sets
                      </Link>
                      <div className="mt-1 pl-1.5 space-y-0.5">
                        <Link
                          href="/womens-wear?category=Co-ord+Sets&subCategory=Linen+Casual+Co-ords"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Linen Casual Co-ords
                        </Link>
                        <Link
                          href="/womens-wear?category=Co-ord+Sets&subCategory=Festive+Embroidered+Sets"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Festive Embroidered Sets
                        </Link>
                      </div>
                    </div>

                    <div>
                      <Link
                        href="/womens-wear?category=Trousers+%26+Pants"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Trousers &amp; Pants
                      </Link>
                    </div>

                    <div>
                      <Link
                        href="/womens-wear?category=Skirts"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Skirts &amp; Jumpsuits
                      </Link>
                    </div>

                    <div>
                      <Link
                        href="/womens-wear?category=Jackets"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Tailored Jackets &amp; Blazers
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <Link
                      href="/womens-wear?category=Western+Wear"
                      onClick={onClose}
                      className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore Western Wear</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>

                {/* Column 3: Footwear, Bags & Jewellery */}
                <div>
                  <div className="pb-2 mb-3.5 border-b border-stone-100">
                    <Link
                      href="/womens-wear?category=Other+Fashion"
                      onClick={onClose}
                      className="text-[11.5px] font-bold tracking-widest uppercase text-[#4A1513] hover:underline"
                    >
                      Footwear &amp; Accessories
                    </Link>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Link
                        href="/womens-wear?category=Jewellery"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Jewellery
                      </Link>
                      <div className="mt-1 pl-1.5 space-y-0.5">
                        <Link
                          href="/womens-wear?category=Jewellery&subCategory=Necklaces+%26+Chokers"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Kundan &amp; Chokers
                        </Link>
                        <Link
                          href="/womens-wear?category=Jewellery&subCategory=Earrings+%26+Jhumkas"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Temple Jhumkas &amp; Earrings
                        </Link>
                        <Link
                          href="/womens-wear?category=Jewellery&subCategory=Bangles+%26+Bracelets"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Bangles &amp; Bracelets
                        </Link>
                      </div>
                    </div>

                    <div>
                      <Link
                        href="/womens-wear?category=Handbags"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Handbags &amp; Potlis
                      </Link>
                      <div className="mt-1 pl-1.5 space-y-0.5">
                        <Link
                          href="/womens-wear?category=Handbags&subCategory=Potlis+%26+Batua"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Artisanal Potlis &amp; Batua
                        </Link>
                        <Link
                          href="/womens-wear?category=Handbags&subCategory=Embellished+Clutches"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Embellished Clutches
                        </Link>
                        <Link
                          href="/womens-wear?category=Handbags&subCategory=Structured+Totes"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Structured Totes
                        </Link>
                      </div>
                    </div>

                    <div>
                      <Link
                        href="/womens-wear?category=Footwear"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Footwear
                      </Link>
                      <div className="mt-1 pl-1.5 space-y-0.5">
                        <Link
                          href="/womens-wear?category=Footwear&subCategory=Embroidered+Juttis"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Embroidered Juttis
                        </Link>
                        <Link
                          href="/womens-wear?category=Footwear&subCategory=Kolhapuris"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Handcrafted Kolhapuris
                        </Link>
                      </div>
                    </div>

                    <div>
                      <Link
                        href="/womens-wear?category=Fashion+Accessories"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Belts, Scarves &amp; Shawls
                      </Link>
                    </div>

                    <div>
                      <Link
                        href="/womens-wear?category=Innerwear+%26+Loungewear"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Innerwear &amp; Loungewear
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <Link
                      href="/womens-wear?category=Other+Fashion"
                      onClick={onClose}
                      className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore Accessories</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>

                {/* Column 4: Beauty & Gifts */}
                <div>
                  <div className="pb-2 mb-3.5 border-b border-stone-100">
                    <Link
                      href="/beauty"
                      onClick={onClose}
                      className="text-[11.5px] font-bold tracking-widest uppercase text-[#4A1513] hover:underline"
                    >
                      Beauty &amp; Gifts
                    </Link>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Link
                        href="/beauty"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Natural Beauty &amp; Self-Care
                      </Link>
                      <div className="mt-1 pl-1.5 space-y-0.5">
                        <Link
                          href="/beauty?view=products&sub=skincare"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Natural Skincare &amp; Oils
                        </Link>
                        <Link
                          href="/beauty?view=products&sub=haircare"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Herbal Hair Care
                        </Link>
                        <Link
                          href="/beauty?view=products&sub=makeup"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Clean Makeup &amp; Tints
                        </Link>
                        <Link
                          href="/beauty?view=products&sub=personal-hygiene"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Bath &amp; Body Spa
                        </Link>
                      </div>
                    </div>

                    <div>
                      <Link
                        href="/gifts"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-stone-900 hover:text-[#4A1513] transition-colors block"
                      >
                        Curated Gifts &amp; Hampers
                      </Link>
                      <div className="mt-1 pl-1.5 space-y-0.5">
                        <Link
                          href="/gifts?category=Gift+Hampers"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Gourmet &amp; Pamper Hampers
                        </Link>
                        <Link
                          href="/gifts?occasion=Birthday"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Birthday &amp; Anniversary Gifts
                        </Link>
                        <Link
                          href="/gifts?category=Flowers"
                          onClick={onClose}
                          className="text-[12px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                        >
                          Fresh Flowers &amp; Chocolates
                        </Link>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="p-3 bg-[#FAF7F5] rounded-xl border border-stone-200/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A1513] block mb-1">
                          Femazon Promise
                        </span>
                        <p className="text-[11.5px] text-stone-600 leading-snug">
                          100% authentic curated luxury from verified boutiques across India.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <Link
                      href="/gifts"
                      onClick={onClose}
                      className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore Gifts &amp; Beauty</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MENU 2: DISCOVER
             ======================================================== */}
          {activeDropdown === "discover" && (
            <div>
              <div className="grid grid-cols-3 gap-8 xl:gap-12 max-w-5xl">
                {/* Column 1: Curated Edits */}
                <div>
                  <div className="pb-2 mb-3.5 border-b border-stone-100">
                    <span className="text-[11.5px] font-bold tracking-widest uppercase text-[#4A1513]">
                      Curated Edits
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/shop?sort=newest"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Fresh Arrivals This Week
                    </Link>
                    <Link
                      href="/shop?filter=trending"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Trending Collections
                    </Link>
                    <Link
                      href="/shop?filter=bestseller"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Bestselling Styles
                    </Link>
                    <Link
                      href="/curated"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Celebrity &amp; Runway Spotlight
                    </Link>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <Link
                      href="/shop"
                      onClick={onClose}
                      className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider hover:underline inline-flex items-center gap-1"
                    >
                      <span>Browse All Products</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>

                {/* Column 2: Shop by Department */}
                <div>
                  <div className="pb-2 mb-3.5 border-b border-stone-100">
                    <span className="text-[11.5px] font-bold tracking-widest uppercase text-[#4A1513]">
                      Shop by Department
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/womens-wear"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Women&apos;s Couture &amp; Wear
                    </Link>
                    <Link
                      href="/beauty"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Natural Beauty &amp; Skincare
                    </Link>
                    <Link
                      href="/gifts"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Curated Hampers &amp; Gifts
                    </Link>
                    <Link
                      href="/womens-wear?category=Jewellery"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Artisanal Jewellery &amp; Bags
                    </Link>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <Link
                      href="/discover"
                      onClick={onClose}
                      className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore Discover Hub</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>

                {/* Column 3: Exclusive Services */}
                <div>
                  <div className="pb-2 mb-3.5 border-b border-stone-100">
                    <span className="text-[11.5px] font-bold tracking-widest uppercase text-[#4A1513]">
                      Femazon Experiences
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-3.5 rounded-xl bg-[#FAF7F5] border border-stone-200/70">
                      <div className="flex items-center gap-2 text-[#4A1513] mb-1">
                        <Sparkles size={14} />
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                          Personal Styling
                        </h4>
                      </div>
                      <p className="text-[11.5px] text-stone-600 mb-2 leading-relaxed">
                        1-on-1 consultation with verified stylists for bespoke lookbooks and wardrobe edits.
                      </p>
                      <Link
                        href="/personal-styling"
                        onClick={onClose}
                        className="text-[11px] font-bold text-[#4A1513] hover:underline inline-flex items-center gap-1"
                      >
                        Book a Stylist →
                      </Link>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF7F5] border border-stone-200/70">
                      <div className="flex items-center gap-2 text-[#4A1513] mb-1">
                        <Store size={14} />
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                          Verified Boutiques
                        </h4>
                      </div>
                      <p className="text-[11.5px] text-stone-600 mb-2 leading-relaxed">
                        Discover regional designers from Coimbatore, Chennai, Bangalore &amp; Mumbai.
                      </p>
                      <Link
                        href="/brands"
                        onClick={onClose}
                        className="text-[11px] font-bold text-[#4A1513] hover:underline inline-flex items-center gap-1"
                      >
                        Explore Brands →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MENU 3: PERSONAL STYLING
             ======================================================== */}
          {activeDropdown === "personal-styling" && (
            <div>
              <div className="grid grid-cols-3 gap-8 xl:gap-12 max-w-5xl">
                {/* Column 1: Services */}
                <div>
                  <div className="pb-2 mb-3.5 border-b border-stone-100">
                    <span className="text-[11.5px] font-bold tracking-widest uppercase text-[#4A1513]">
                      Styling Consultations
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/personal-styling"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      1-on-1 Bespoke Video Consultation
                    </Link>
                    <Link
                      href="/personal-styling"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Wardrobe Audit &amp; Revamp
                    </Link>
                    <Link
                      href="/personal-styling"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Bridal &amp; Festive Trousseau Planning
                    </Link>
                    <Link
                      href="/personal-styling"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Executive &amp; Everyday Lookbook
                    </Link>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <Link
                      href="/personal-styling"
                      onClick={onClose}
                      className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore All Styling Services</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>

                {/* Column 2: What You Get */}
                <div>
                  <div className="pb-2 mb-3.5 border-b border-stone-100">
                    <span className="text-[11.5px] font-bold tracking-widest uppercase text-[#4A1513]">
                      What Is Included
                    </span>
                  </div>
                  <div className="space-y-2.5 text-[12.5px] text-stone-600">
                    <div className="flex items-start gap-2">
                      <span className="text-[#4A1513] font-bold">•</span>
                      <span>60-minute interactive video consultation with verified stylist</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#4A1513] font-bold">•</span>
                      <span>Body silhouette analysis &amp; personal color palette mapping</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#4A1513] font-bold">•</span>
                      <span>Personalized digital lookbook with direct boutique links</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#4A1513] font-bold">•</span>
                      <span>Exclusive partner discounts on recommended outfits</span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Booking Card */}
                <div>
                  <div className="p-5 rounded-2xl bg-[#FAF7F5] border border-stone-200/80">
                    <div className="flex items-center gap-2 mb-2 text-[#4A1513]">
                      <UserCheck size={18} />
                      <h4 className="font-serif text-base font-medium text-stone-900">
                        Book Your Stylist
                      </h4>
                    </div>
                    <p className="text-[12px] text-stone-600 mb-4 leading-relaxed">
                      Upgrade your personal style with verified fashion experts who understand your aesthetic.
                    </p>
                    <Link
                      href="/personal-styling"
                      onClick={onClose}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#4A1513] hover:bg-[#380e0c] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                    >
                      <span>Schedule Consultation</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MENU 4: OUR BRANDS
             ======================================================== */}
          {activeDropdown === "brands" && (
            <div>
              <div className="grid grid-cols-3 gap-8 xl:gap-12 max-w-5xl">
                {/* Column 1: By Region */}
                <div>
                  <div className="pb-2 mb-3.5 border-b border-stone-100">
                    <span className="text-[11.5px] font-bold tracking-widest uppercase text-[#4A1513]">
                      Regional Boutique Hubs
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/brands?city=Coimbatore"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Coimbatore Handloom &amp; Silks
                    </Link>
                    <Link
                      href="/brands?city=Chennai"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Chennai Heritage Boutiques
                    </Link>
                    <Link
                      href="/brands?city=Bangalore"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Bangalore Designer Studios
                    </Link>
                    <Link
                      href="/brands?city=Mumbai"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Mumbai Contemporary Couture
                    </Link>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <Link
                      href="/brands"
                      onClick={onClose}
                      className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider hover:underline inline-flex items-center gap-1"
                    >
                      <span>Browse All Brands</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>

                {/* Column 2: Specialties */}
                <div>
                  <div className="pb-2 mb-3.5 border-b border-stone-100">
                    <span className="text-[11.5px] font-bold tracking-widest uppercase text-[#4A1513]">
                      Brand Specialities
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/brands"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Pure Silk &amp; Handloom Weavers
                    </Link>
                    <Link
                      href="/brands"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Contemporary Indo-Western Studios
                    </Link>
                    <Link
                      href="/brands"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Artisanal Jewellery &amp; Potlis
                    </Link>
                    <Link
                      href="/brands"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Organic Skincare &amp; Wellness
                    </Link>
                  </div>
                </div>

                {/* Column 3: Partner with Us */}
                <div>
                  <div className="p-5 rounded-2xl bg-[#FAF7F5] border border-stone-200/80">
                    <div className="flex items-center gap-2 mb-2 text-[#4A1513]">
                      <ShieldCheck size={18} />
                      <h4 className="font-serif text-base font-medium text-stone-900">
                        Join Femazon
                      </h4>
                    </div>
                    <p className="text-[12px] text-stone-600 mb-4 leading-relaxed">
                      Are you a women&apos;s wear designer, boutique owner or artisan? Reach verified buyers across India.
                    </p>
                    <Link
                      href="/seller/register"
                      onClick={onClose}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#4A1513] hover:bg-[#380e0c] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                    >
                      <span>Become a Seller</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MENU 5: PARTNER WITH FEMAZON
             ======================================================== */}
          {activeDropdown === "partner" && (
            <div>
              <div className="grid grid-cols-3 gap-8 xl:gap-12 max-w-5xl">
                {/* Column 1: Seller Program */}
                <div>
                  <div className="pb-2 mb-3.5 border-b border-stone-100">
                    <span className="text-[11.5px] font-bold tracking-widest uppercase text-[#4A1513]">
                      Seller Programs
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/seller/register"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Register as a Vendor / Boutique
                    </Link>
                    <Link
                      href="/seller/dashboard"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Vendor Dashboard &amp; Analytics
                    </Link>
                    <Link
                      href="/partner"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Automated Payouts &amp; Order Logistics
                    </Link>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <Link
                      href="/seller/register"
                      onClick={onClose}
                      className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider hover:underline inline-flex items-center gap-1"
                    >
                      <span>Start Selling Today</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>

                {/* Column 2: Specialist Roles */}
                <div>
                  <div className="pb-2 mb-3.5 border-b border-stone-100">
                    <span className="text-[11.5px] font-bold tracking-widest uppercase text-[#4A1513]">
                      Specialist Partnerships
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/personal-styling"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Certified Stylist Onboarding
                    </Link>
                    <Link
                      href="/partner"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Artisan &amp; Handloom Cooperative Program
                    </Link>
                    <Link
                      href="/partner"
                      onClick={onClose}
                      className="text-[13px] text-stone-700 hover:text-[#4A1513] font-medium transition-colors block py-1"
                    >
                      Regional Boutique Verification Standards
                    </Link>
                  </div>
                </div>

                {/* Column 3: Partner Overview */}
                <div>
                  <div className="p-5 rounded-2xl bg-[#FAF7F5] border border-stone-200/80">
                    <div className="flex items-center gap-2 mb-2 text-[#4A1513]">
                      <Store size={18} />
                      <h4 className="font-serif text-base font-medium text-stone-900">
                        Grow with Femazon
                      </h4>
                    </div>
                    <p className="text-[12px] text-stone-600 mb-4 leading-relaxed">
                      Zero listing fees. Direct access to high-intent female shoppers. Verified boutique badge.
                    </p>
                    <Link
                      href="/partner"
                      onClick={onClose}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#4A1513] hover:bg-[#380e0c] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                    >
                      <span>Explore Partner Portal</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
