"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Sparkles,
  Camera,
  Zap,
  Tag,
  Scissors,
  Check,
  SlidersHorizontal
} from 'lucide-react';
import { FilterState } from './FilterSidebar';

interface ShopControlsProps {
  totalItems: number;
  selectedCategory?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSort: string;
  onSortChange: (sortOption: string) => void;
  filters?: FilterState;
  onFilterChange?: (type: keyof FilterState, value: any) => void;
  onOpenMobileFilters?: () => void;
}

export function ShopControls({
  totalItems,
  selectedCategory = "All",
  searchQuery,
  onSearchChange,
  selectedSort,
  onSortChange,
  filters,
  onFilterChange,
  onOpenMobileFilters
}: ShopControlsProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    "Recommended",
    "Popularity",
    "New Arrivals",
    "Price Low to High",
    "Price High to Low",
    "Discount High to Low"
  ];

  // Click outside to close sort dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isOnSaleActive = filters?.onSale ?? false;
  const isCustomFitActive = filters?.sizes?.includes("Custom Fit") ?? false;

  const handleToggleCustomFit = () => {
    if (!filters || !onFilterChange) return;
    if (isCustomFitActive) {
      onFilterChange("sizes", filters.sizes.filter(s => s !== "Custom Fit"));
    } else {
      onFilterChange("sizes", [...filters.sizes, "Custom Fit"]);
    }
  };

  const categoryDisplayTitle = selectedCategory === "All"
    ? "All Collections"
    : selectedCategory === "New"
    ? "New Arrivals"
    : selectedCategory;

  return (
    <div className="flex flex-col gap-4 pb-4 border-b border-stone-200/80 mb-6">
      
      {/* Top Header Line: Category Title & Item Count */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <h1 className="font-serif text-lg sm:text-xl md:text-2xl text-stone-900 font-normal tracking-tight">
          <span>{categoryDisplayTitle}</span>{' '}
          <span className="text-xs sm:text-sm font-sans font-normal text-stone-400">
            ({totalItems.toLocaleString('en-IN')} Styles)
          </span>
        </h1>

        {/* Mobile Filter Trigger Button */}
        {onOpenMobileFilters && (
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-300 text-xs font-semibold text-stone-800 self-start"
          >
            <SlidersHorizontal size={13} />
            <span>Filters</span>
          </button>
        )}
      </div>

      {/* Action Strip: Quick Pill Filters & Luxury Sort Dropdown */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
        
        {/* Left: Quick Filter Pills (White & Maroon Theme) */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
          
          {/* 1. New Arrivals Pill */}
          <button
            type="button"
            onClick={() => onSortChange(selectedSort === "New Arrivals" ? "Recommended" : "New Arrivals")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
              selectedSort === "New Arrivals"
                ? 'border-[#4A1513] bg-[#4A1513] text-white shadow-xs'
                : 'border-stone-200 bg-white text-stone-700 hover:border-[#4A1513] hover:text-[#4A1513]'
            }`}
          >
            <Sparkles size={12} className={selectedSort === "New Arrivals" ? "text-white" : "text-[#4A1513]"} />
            <span>New</span>
          </button>

          {/* 2. Virtual Try-On Pill */}
          <Link
            href="/wardrobe"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border border-stone-200 bg-white text-stone-700 hover:border-[#4A1513] hover:text-[#4A1513] transition cursor-pointer shadow-2xs"
          >
            <Camera size={12} className="text-[#4A1513]" />
            <span>Virtual Try-On</span>
          </Link>

          {/* 3. On Sale Pill */}
          <button
            type="button"
            onClick={() => onFilterChange?.('onSale', !isOnSaleActive)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
              isOnSaleActive
                ? 'border-[#4A1513] bg-[#4A1513] text-white shadow-xs'
                : 'border-stone-200 bg-white text-stone-700 hover:border-[#4A1513] hover:text-[#4A1513]'
            }`}
          >
            <Tag size={12} className={isOnSaleActive ? "text-white" : "text-[#4A1513]"} />
            <span>On Sale</span>
          </button>

          {/* 5. Custom-Fit Pill */}
          <button
            type="button"
            onClick={handleToggleCustomFit}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
              isCustomFitActive
                ? 'border-[#4A1513] bg-[#4A1513] text-white shadow-xs'
                : 'border-stone-200 bg-white text-stone-700 hover:border-[#4A1513] hover:text-[#4A1513]'
            }`}
          >
            <Scissors size={12} className={isCustomFitActive ? "text-white" : "text-[#4A1513]"} />
            <span>Custom-fit</span>
          </button>

        </div>

        {/* Right: Luxury Sort By Dropdown (White & Maroon) */}
        <div className="relative shrink-0 self-end md:self-center" ref={sortRef}>
          <button 
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold text-stone-800 hover:border-[#4A1513] transition shadow-2xs cursor-pointer"
          >
            <span className="text-stone-500 font-normal">Sort By:</span>
            <span className="font-bold text-[#4A1513]">{selectedSort}</span>
            <ChevronDown size={13} className={`text-stone-500 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-stone-200 rounded-xl shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
              {sortOptions.map((option) => {
                const isSelected = selectedSort === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onSortChange(option);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected 
                        ? 'font-bold text-[#4A1513] bg-[#4A1513]/5' 
                        : 'text-stone-700 hover:bg-stone-50 hover:text-[#4A1513]'
                    }`}
                  >
                    <span>{option}</span>
                    {isSelected && <Check size={13} className="text-[#4A1513]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
