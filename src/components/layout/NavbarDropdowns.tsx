"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/* =========================================================================
   1. SHOP DROPDOWN: Clean 3-Column Simple Category List
   ========================================================================= */
export function ShopDropdown({ isOpen, onClose, onMouseEnter, onMouseLeave }: DropdownProps) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute top-full left-0 mt-1 w-[580px] bg-white rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-stone-200/90 p-5 z-50 transition-all duration-180 ease-out select-none ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto visible"
          : "opacity-0 -translate-y-1 pointer-events-none invisible"
      }`}
    >
      {/* Invisible hover bridge to eliminate any gap between nav link and dropdown */}
      <div className="absolute -top-3 left-0 right-0 h-3" />

      <div className="grid grid-cols-3 gap-6">
        {/* Column 1: Indian Wear */}
        <div>
          <Link
            href="/womens-wear?category=Indian+Wear"
            onClick={onClose}
            className="text-[11px] font-bold uppercase tracking-wider text-[#4A1513] block pb-1.5 mb-2.5 border-b border-stone-100 hover:underline"
          >
            Indian Wear
          </Link>
          <div className="space-y-2">
            <div>
              <Link
                href="/womens-wear?category=Sarees"
                onClick={onClose}
                className="text-[12.5px] font-semibold text-stone-800 hover:text-[#4A1513] transition-colors block"
              >
                Sarees
              </Link>
              <div className="pl-1.5 mt-0.5 space-y-0.5">
                <Link
                  href="/womens-wear?category=Sarees&subCategory=Banarasi+Silk"
                  onClick={onClose}
                  className="text-[11.5px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                >
                  Banarasi Silk
                </Link>
                <Link
                  href="/womens-wear?category=Sarees&subCategory=Kanjeevaram+Heritage"
                  onClick={onClose}
                  className="text-[11.5px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                >
                  Kanjeevaram
                </Link>
                <Link
                  href="/womens-wear?category=Sarees&subCategory=Organza+%26+Tissue"
                  onClick={onClose}
                  className="text-[11.5px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                >
                  Organza &amp; Tissue
                </Link>
              </div>
            </div>

            <div>
              <Link
                href="/womens-wear?category=Kurtas+%26+Kurta+Sets"
                onClick={onClose}
                className="text-[12.5px] font-semibold text-stone-800 hover:text-[#4A1513] transition-colors block"
              >
                Kurtas &amp; Sets
              </Link>
              <div className="pl-1.5 mt-0.5 space-y-0.5">
                <Link
                  href="/womens-wear?category=Kurtas+%26+Kurta+Sets&subCategory=Straight+Kurta+Sets"
                  onClick={onClose}
                  className="text-[11.5px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                >
                  Straight Sets
                </Link>
                <Link
                  href="/womens-wear?category=Kurtas+%26+Kurta+Sets&subCategory=Chikankari+Handloom"
                  onClick={onClose}
                  className="text-[11.5px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                >
                  Chikankari
                </Link>
              </div>
            </div>

            <Link
              href="/womens-wear?category=Lehengas"
              onClick={onClose}
              className="text-[12.5px] font-semibold text-stone-800 hover:text-[#4A1513] transition-colors block"
            >
              Lehengas
            </Link>

            <Link
              href="/womens-wear?category=Salwar+Suits"
              onClick={onClose}
              className="text-[12.5px] font-semibold text-stone-800 hover:text-[#4A1513] transition-colors block"
            >
              Salwar Suits &amp; Anarkali
            </Link>

            <Link
              href="/womens-wear?category=Ethnic+Dresses"
              onClick={onClose}
              className="text-[12.5px] font-semibold text-stone-800 hover:text-[#4A1513] transition-colors block"
            >
              Ethnic Dresses
            </Link>
          </div>
        </div>

        {/* Column 2: Western Wear */}
        <div>
          <Link
            href="/womens-wear?category=Western+Wear"
            onClick={onClose}
            className="text-[11px] font-bold uppercase tracking-wider text-[#4A1513] block pb-1.5 mb-2.5 border-b border-stone-100 hover:underline"
          >
            Western Wear
          </Link>
          <div className="space-y-2">
            <div>
              <Link
                href="/womens-wear?category=Dresses"
                onClick={onClose}
                className="text-[12.5px] font-semibold text-stone-800 hover:text-[#4A1513] transition-colors block"
              >
                Dresses
              </Link>
              <div className="pl-1.5 mt-0.5 space-y-0.5">
                <Link
                  href="/womens-wear?category=Dresses&subCategory=Maxi+Dresses"
                  onClick={onClose}
                  className="text-[11.5px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                >
                  Maxi Dresses
                </Link>
                <Link
                  href="/womens-wear?category=Dresses&subCategory=Midi+Dresses"
                  onClick={onClose}
                  className="text-[11.5px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                >
                  Midi &amp; Evening
                </Link>
              </div>
            </div>

            <div>
              <Link
                href="/womens-wear?category=Tops+%26+Shirts"
                onClick={onClose}
                className="text-[12.5px] font-semibold text-stone-800 hover:text-[#4A1513] transition-colors block"
              >
                Tops &amp; Shirts
              </Link>
              <div className="pl-1.5 mt-0.5 space-y-0.5">
                <Link
                  href="/womens-wear?category=Tops+%26+Shirts&subCategory=Silk+%26+Satin+Shirts"
                  onClick={onClose}
                  className="text-[11.5px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                >
                  Satin &amp; Silk Shirts
                </Link>
                <Link
                  href="/womens-wear?category=Tops+%26+Shirts&subCategory=Peplum+Tops"
                  onClick={onClose}
                  className="text-[11.5px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                >
                  Peplum Tops
                </Link>
              </div>
            </div>

            <Link
              href="/womens-wear?category=Co-ord+Sets"
              onClick={onClose}
              className="text-[12.5px] font-semibold text-stone-800 hover:text-[#4A1513] transition-colors block"
            >
              Co-ord Sets
            </Link>

            <Link
              href="/womens-wear?category=Trousers+%26+Pants"
              onClick={onClose}
              className="text-[12.5px] font-semibold text-stone-800 hover:text-[#4A1513] transition-colors block"
            >
              Trousers &amp; Pants
            </Link>

            <Link
              href="/womens-wear?category=Jackets"
              onClick={onClose}
              className="text-[12.5px] font-semibold text-stone-800 hover:text-[#4A1513] transition-colors block"
            >
              Jackets &amp; Blazers
            </Link>
          </div>
        </div>

        {/* Column 3: Accessories & Beauty */}
        <div>
          <Link
            href="/womens-wear?category=Other+Fashion"
            onClick={onClose}
            className="text-[11px] font-bold uppercase tracking-wider text-[#4A1513] block pb-1.5 mb-2.5 border-b border-stone-100 hover:underline"
          >
            Accessories &amp; More
          </Link>
          <div className="space-y-2">
            <div>
              <Link
                href="/womens-wear?category=Jewellery"
                onClick={onClose}
                className="text-[12.5px] font-semibold text-stone-800 hover:text-[#4A1513] transition-colors block"
              >
                Jewellery
              </Link>
              <div className="pl-1.5 mt-0.5 space-y-0.5">
                <Link
                  href="/womens-wear?category=Jewellery&subCategory=Necklaces+%26+Chokers"
                  onClick={onClose}
                  className="text-[11.5px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                >
                  Kundan Chokers
                </Link>
                <Link
                  href="/womens-wear?category=Jewellery&subCategory=Earrings+%26+Jhumkas"
                  onClick={onClose}
                  className="text-[11.5px] text-stone-500 hover:text-[#4A1513] transition-colors block py-0.5"
                >
                  Jhumkas &amp; Earrings
                </Link>
              </div>
            </div>

            <Link
              href="/womens-wear?category=Handbags"
              onClick={onClose}
              className="text-[12.5px] font-semibold text-stone-800 hover:text-[#4A1513] transition-colors block"
            >
              Handbags &amp; Potlis
            </Link>

            <Link
              href="/womens-wear?category=Footwear"
              onClick={onClose}
              className="text-[12.5px] font-semibold text-stone-800 hover:text-[#4A1513] transition-colors block"
            >
              Footwear &amp; Juttis
            </Link>

            <Link
              href="/beauty"
              onClick={onClose}
              className="text-[12.5px] font-semibold text-stone-800 hover:text-[#4A1513] transition-colors block"
            >
              Natural Beauty &amp; Skincare
            </Link>

            <Link
              href="/gifts"
              onClick={onClose}
              className="text-[12.5px] font-semibold text-stone-800 hover:text-[#4A1513] transition-colors block"
            >
              Curated Gift Hampers
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Direct Link */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
        <span className="text-[11px] text-stone-400">Authentic luxury collections</span>
        <Link
          href="/shop"
          onClick={onClose}
          className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider hover:underline inline-flex items-center gap-1"
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
