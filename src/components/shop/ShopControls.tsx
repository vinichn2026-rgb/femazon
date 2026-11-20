"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  Sparkles,
  Tag,
  Scissors,
  Check,
  SlidersHorizontal
} from 'lucide-react';
import { FilterState } from './FilterSidebar';

export interface DepartmentOption {
  id: string;
  name: string;
  categories: string[];
}

interface ShopControlsProps {
  totalItems: number;
  selectedCategory?: string;
  selectedDepartment?: string;
  departments?: DepartmentOption[];
  onSelectDepartment?: (deptId: string) => void;
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
  selectedDepartment = "all",
  departments,
  onSelectDepartment,
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
    "Latest First",
    "Popularity",
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

  const isNewArrivalsActive = selectedSort === "Latest First" || selectedSort === "New Arrivals";
  const isOnSaleActive = filters?.onSale ?? false;
  const isCustomFitActive = filters?.sizes?.includes("Custom Fit") ?? false;

  const handleToggleNew = () => {
    if (isNewArrivalsActive) {
      onSortChange("Recommended");
    } else {
      onSortChange("Latest First");
    }
  };

  const handleToggleCustomFit = () => {
    if (!filters || !onFilterChange) return;
    if (isCustomFitActive) {
      onFilterChange("sizes", filters.sizes.filter(s => s !== "Custom Fit"));
    } else {
      onFilterChange("sizes", [...filters.sizes, "Custom Fit"]);
    }
  };

  return (
    <div className="w-full pb-3 mb-4 sm:mb-5 border-b border-stone-200/80">
      {/* =========================================================================
          COMPACT EQUAL ROW: Quick Filters + Styles Count + Sort By (Categories in Sidebar)
         ========================================================================= */}
      <div className="flex items-center justify-between gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
        
        {/* Left: Mobile Filters Button + Quick Filter Pills + Styles Count */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto hide-scrollbar py-0.5 min-w-0">
          {/* Mobile Filter Button */}
          {onOpenMobileFilters && (
            <button
              type="button"
              onClick={onOpenMobileFilters}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-semibold text-stone-800 hover:border-[#4A1513] hover:text-[#4A1513] transition shadow-2xs cursor-pointer shrink-0"
            >
              <SlidersHorizontal size={13} />
              <span>Filters</span>
            </button>
          )}

          {/* Quick Filter Pill: New */}
          <button
            type="button"
            onClick={handleToggleNew}
            className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
              isNewArrivalsActive
                ? 'border-[#4A1513] bg-[#4A1513] text-white shadow-xs'
                : 'border-stone-200 bg-white text-stone-700 hover:border-[#4A1513] hover:text-[#4A1513]'
            }`}
          >
            <Sparkles size={12} className={isNewArrivalsActive ? "text-white" : "text-[#4A1513]"} />
            <span>New</span>
          </button>

          {/* Quick Filter Pill: On Sale */}
          <button
            type="button"
            onClick={() => onFilterChange?.('onSale', !isOnSaleActive)}
            className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
              isOnSaleActive
                ? 'border-[#4A1513] bg-[#4A1513] text-white shadow-xs'
                : 'border-stone-200 bg-white text-stone-700 hover:border-[#4A1513] hover:text-[#4A1513]'
            }`}
          >
            <Tag size={12} className={isOnSaleActive ? "text-white" : "text-[#4A1513]"} />
            <span>On Sale</span>
          </button>

          {/* Quick Filter Pill: Custom-fit */}
          <button
            type="button"
            onClick={handleToggleCustomFit}
            className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
              isCustomFitActive
                ? 'border-[#4A1513] bg-[#FAF5F0] text-[#4A1513] shadow-xs ring-1 ring-[#4A1513]'
                : 'border-stone-200 bg-white text-stone-700 hover:border-[#4A1513] hover:text-[#4A1513]'
            }`}
          >
            <Scissors size={12} className={isCustomFitActive ? "text-[#4A1513]" : "text-[#4A1513]"} />
            <span>Custom-fit</span>
          </button>

          {/* Styles Count */}
          <span className="hidden sm:inline-block text-xs sm:text-[13px] font-sans font-medium text-stone-400 whitespace-nowrap pl-1">
            ({totalItems.toLocaleString('en-IN')} Styles)
          </span>
        </div>

        {/* Right: Sort Dropdown */}
        <div className="relative shrink-0 ml-auto" ref={sortRef}>
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
