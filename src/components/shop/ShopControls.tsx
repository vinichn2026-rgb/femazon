"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  SlidersHorizontal,
  Check
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
  selectedDepartment,
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
    "Latest First",
    "Recommended",
    "Popularity",
    "Price Low to High",
    "Price High to Low",
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

  // Compute active filters count for mobile filter badge
  const activeCount = React.useMemo(() => {
    if (!filters) return 0;
    let count = 0;
    if (filters.brands && filters.brands.length > 0) count += filters.brands.length;
    if (filters.maxPrice && filters.maxPrice < 10000) count += 1;
    if (selectedDepartment && selectedDepartment !== "all") count += 1;
    if (selectedCategory && selectedCategory !== "All") count += 1;
    return count;
  }, [filters, selectedDepartment, selectedCategory]);

  const displayCount = Math.min(12, totalItems);

  return (
    <div className="flex items-center justify-between gap-4 py-2 mb-6">
      {/* Desktop: Showing 1-12 of 48 products */}
      <div className="hidden lg:block text-xs sm:text-[13px] text-stone-600 font-medium tracking-tight">
        {totalItems > 0 ? (
          <span>
            Showing 1–{displayCount} of {totalItems} products
          </span>
        ) : (
          <span>0 products found</span>
        )}
      </div>

      {/* Mobile: Filter Button */}
      <div className="lg:hidden flex items-center">
        {onOpenMobileFilters && (
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FAF5F0] border border-[#E8DCD5] text-[#4A1513] text-xs font-semibold shadow-2xs hover:bg-[#F3ECE5] transition-colors cursor-pointer"
          >
            <SlidersHorizontal size={14} className="text-[#4A1513]" />
            <span>Filter</span>
            {activeCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#4A1513] text-white text-[10px] flex items-center justify-center font-bold">
                {activeCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Sort By Dropdown (Matches reference: "Sort by: Latest First ∨") */}
      <div className="relative shrink-0" ref={sortRef}>
        <button 
          type="button"
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-lg border border-stone-200 bg-white text-xs font-medium text-stone-800 hover:border-[#4A1513] transition shadow-2xs cursor-pointer"
        >
          <span className="text-stone-500 font-normal">Sort by:</span>
          <span className="font-semibold text-stone-900">{selectedSort}</span>
          <ChevronDown size={13} className={`text-stone-500 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
        </button>

        {isSortOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
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
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
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
  );
}
