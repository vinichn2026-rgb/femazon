"use client";

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronRight, SlidersHorizontal, Check } from 'lucide-react';
import { SHOP_DEPARTMENTS } from './ShopClient';

export interface FilterState {
  silhouettes?: string[];
  subcategories: string[];
  priceRange: string | null;
  maxPrice?: number | null;
  sizes: string[];
  colors: string[];
  brands: string[];
  inStockOnly: boolean;
  onSale: boolean;
  readyToShip: boolean;
}

export interface FilterBrandOption {
  name: string;
  count: number;
  city?: string;
  verified?: boolean;
}

interface FilterSidebarProps {
  categories?: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedDepartment?: string;
  onSelectDepartment?: (deptId: string) => void;
  availableBrands?: FilterBrandOption[];
  filters: FilterState;
  onFilterChange: (type: keyof FilterState, value: any) => void;
  onClearAll: () => void;
  onApplyFilters?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

// Default Featured Brands matching sample mockup
const FEATURED_BRANDS = [
  "Femazon",
  "StyleAura",
  "Grace & Glow",
  "Nagla Fashion",
  "Kovai Handlooms & Silks",
  "Mylapore Heritage Silks"
];

export function FilterSidebar({
  selectedCategory,
  onSelectCategory,
  selectedDepartment = "all",
  onSelectDepartment,
  availableBrands = [],
  filters,
  onFilterChange,
  onClearAll,
  onApplyFilters,
  isOpen,
  onClose,
}: FilterSidebarProps) {
  // Accordion state
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [expandedDept, setExpandedDept] = useState<string | null>(
    selectedDepartment !== "all" ? selectedDepartment : "womens-wear"
  );

  // Local state for interactive filtering before "Apply Filters" is clicked
  const [tempMaxPrice, setTempMaxPrice] = useState<number>(filters.maxPrice || 10000);
  const [tempBrands, setTempBrands] = useState<string[]>(filters.brands || []);
  const [tempDepartment, setTempDepartment] = useState<string>(selectedDepartment);
  const [tempCategory, setTempCategory] = useState<string>(selectedCategory);

  // Sync with prop changes
  useEffect(() => {
    setTempMaxPrice(filters.maxPrice || 10000);
    setTempBrands(filters.brands || []);
    setTempDepartment(selectedDepartment);
    setTempCategory(selectedCategory);
    if (selectedDepartment !== "all") {
      setExpandedDept(selectedDepartment);
    }
  }, [filters, selectedDepartment, selectedCategory]);

  // Combine featured brands and catalog brands without duplicates
  const displayBrands = React.useMemo(() => {
    if (availableBrands && availableBrands.length > 0) {
      return availableBrands.map(b => b.name);
    }
    return FEATURED_BRANDS;
  }, [availableBrands]);

  const toggleBrand = (brandName: string) => {
    setTempBrands(prev => {
      if (prev.includes(brandName)) {
        return prev.filter(b => b !== brandName);
      } else {
        return [...prev, brandName];
      }
    });
  };

  const handleApply = () => {
    if (onSelectDepartment && tempDepartment !== selectedDepartment) {
      onSelectDepartment(tempDepartment);
    }
    if (tempCategory !== selectedCategory) {
      onSelectCategory(tempCategory);
    }
    onFilterChange("brands", tempBrands);
    onFilterChange("maxPrice", tempMaxPrice === 10000 ? null : tempMaxPrice);
    if (onApplyFilters) onApplyFilters();
    onClose();
  };

  const handleClear = () => {
    setTempMaxPrice(10000);
    setTempBrands([]);
    setTempDepartment("all");
    setTempCategory("All");
    onClearAll();
    onClose();
  };

  // The core filter content used in both desktop sidebar and mobile drawer
  const filterContent = (
    <div className="space-y-5">
      {/* 1. All Categories (Collapsible) */}
      <div>
        <button
          type="button"
          onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
          className="w-full flex items-center justify-between text-[13.5px] font-bold text-stone-900 py-1 hover:text-[#4A1513] transition-colors cursor-pointer select-none"
        >
          <span>All Categories</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 text-stone-600 ${isCategoriesOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isCategoriesOpen && (
          <div className="mt-2.5 rounded-xl border border-stone-200/80 bg-white p-1 divide-y divide-stone-100 shadow-2xs">
            {SHOP_DEPARTMENTS.filter(d => d.id !== "all").map(dept => {
              const isDeptActive = tempDepartment === dept.id;
              const isDeptExpanded = expandedDept === dept.id;

              return (
                <div key={dept.id} className="py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setTempDepartment(dept.id);
                      setTempCategory("All");
                      setExpandedDept(prev => (prev === dept.id ? null : dept.id));
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer select-none ${
                      isDeptActive
                        ? "bg-[#FAF3EC] text-[#4A1513]"
                        : "text-stone-800 hover:bg-stone-50"
                    }`}
                  >
                    <span>{dept.name}</span>
                    <ChevronRight
                      size={14}
                      className={`transition-transform duration-200 ${
                        isDeptExpanded ? "rotate-90 text-[#4A1513]" : "text-stone-400"
                      }`}
                    />
                  </button>

                  {/* Subcategories dropdown under selected department */}
                  {isDeptExpanded && (
                    <div className="pl-3 pr-2 py-1.5 space-y-1 bg-[#FAF7F5] rounded-b-lg animate-in fade-in duration-150">
                      <button
                        type="button"
                        onClick={() => {
                          setTempDepartment(dept.id);
                          setTempCategory("All");
                        }}
                        className={`w-full text-left px-2 py-1 text-[11.5px] rounded transition-colors cursor-pointer block truncate ${
                          tempCategory === "All" && isDeptActive
                            ? "font-bold text-[#4A1513] bg-white shadow-2xs"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        All {dept.name}
                      </button>
                      {dept.categories.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setTempDepartment(dept.id);
                            setTempCategory(cat);
                          }}
                          className={`w-full text-left px-2 py-1 text-[11.5px] rounded transition-colors cursor-pointer block truncate ${
                            tempCategory === cat
                              ? "font-bold text-[#4A1513] bg-white shadow-2xs"
                              : "text-stone-600 hover:text-stone-900"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Price Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13.5px] font-bold text-stone-900">Price Range</span>
          {tempMaxPrice < 10000 && (
            <span className="text-[11px] font-bold text-[#4A1513]">Up to ₹{tempMaxPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Maroon Range Track Slider */}
        <div className="px-1 py-2">
          <input
            type="range"
            min={500}
            max={10000}
            step={500}
            value={tempMaxPrice}
            onChange={e => setTempMaxPrice(Number(e.target.value))}
            className="w-full accent-[#4A1513] h-1.5 bg-stone-200 rounded-lg cursor-pointer"
          />
        </div>

        <div className="flex justify-between items-center text-xs font-semibold text-stone-700 mt-1 select-none">
          <span>₹0</span>
          <span>₹10,000+</span>
        </div>
      </div>

      {/* 3. Brand */}
      <div>
        <span className="text-[13.5px] font-bold text-stone-900 block mb-2.5">Brand</span>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {displayBrands.map(brand => {
            const isChecked = tempBrands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center gap-2.5 text-xs text-stone-700 hover:text-stone-900 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleBrand(brand)}
                  className="w-4 h-4 rounded border-stone-300 text-[#4A1513] focus:ring-[#4A1513] cursor-pointer"
                />
                <span className={isChecked ? "font-semibold text-stone-900" : ""}>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* =========================================================================
          DESKTOP SIDEBAR: Permanent card on left matching reference layout
         ========================================================================= */}
      <aside className="hidden lg:block w-[265px] xl:w-[280px] shrink-0 self-start sticky top-24">
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
          {/* Sidebar Header */}
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-stone-100">
            <SlidersHorizontal size={17} className="text-stone-800" strokeWidth={1.8} />
            <h2 className="text-sm font-bold text-stone-900 tracking-tight">Filter Products</h2>
          </div>

          {/* Filter Options */}
          {filterContent}

          {/* Action Buttons: Side-by-Side on Desktop */}
          <div className="flex items-center gap-2 pt-4 mt-5 border-t border-stone-100">
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 py-2 px-3 bg-[#4A1513] hover:bg-[#380E0C] text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer text-center active:scale-95"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="py-2 px-3 border border-[#4A1513] text-[#4A1513] hover:bg-stone-50 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center active:scale-95"
            >
              Clear All
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MOBILE VIEW: Slide-in Drawer with Backdrop matching reference layout
         ========================================================================= */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer Panel */}
        <div
          className={`absolute inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 shrink-0">
            <h3 className="text-base font-bold text-stone-900">Filters</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {filterContent}
          </div>

          {/* Drawer Footer Buttons: Stacked on Mobile */}
          <div className="p-4 border-t border-stone-200 bg-white shrink-0 space-y-2">
            <button
              type="button"
              onClick={handleApply}
              className="w-full py-3 bg-[#4A1513] hover:bg-[#380E0C] text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer text-center active:scale-95"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="w-full py-2.5 border border-[#4A1513] text-[#4A1513] hover:bg-stone-50 text-xs font-bold rounded-xl transition-colors cursor-pointer text-center active:scale-95"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
