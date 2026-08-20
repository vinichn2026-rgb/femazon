"use client";

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Check, Search } from 'lucide-react';

export interface FilterState {
  subcategories: string[];
  priceRange: string | null;
  sizes: string[];
  colors: string[];
  brands: string[];
  inStockOnly: boolean;
  onSale: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (type: keyof FilterState, value: any) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const SUB_CATEGORIES = [
  { name: "Maxi Dresses", count: 14 },
  { name: "Anarkali Suits", count: 22 },
  { name: "Crop Tops", count: 18 },
  { name: "Midi Dresses", count: 35 },
  { name: "Sarees", count: 42 }
];

const PRICE_RANGES = [
  "Under ₹999",
  "₹1,000 - ₹2,499",
  "₹2,500 - ₹4,999",
  "₹5,000+"
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

const COLORS = [
  { name: "Black", hex: "#4A1513" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#E53E3E" },
  { name: "Navy", hex: "#2C5282" },
  { name: "Emerald Green", hex: "#38A169" },
  { name: "Mustard", hex: "#D69E2E" },
  { name: "Blush Pink", hex: "#F687B3" },
  { name: "Lavender", hex: "#B794F4" }
];

const BRANDS = ["Aura Studio", "Ethnic Vibes", "Urban Chic", "Festive Glow"];

// Accordion Component Helper
function Accordion({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-100 py-5">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex w-full items-center justify-between font-bold text-[13px] tracking-wide text-primary hover:text-zinc-600 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 text-zinc-400 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}

export function FilterSidebar({ filters, onFilterChange, onClearAll, isOpen, onClose }: FilterSidebarProps) {
  const [brandSearch, setBrandSearch] = useState("");

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const hasActiveFilters = 
    filters.subcategories.length > 0 || 
    filters.priceRange !== null || 
    filters.sizes.length > 0 || 
    filters.colors.length > 0 || 
    filters.brands.length > 0 || 
    filters.inStockOnly || 
    filters.onSale;

  const handleCheckboxToggle = (type: keyof FilterState, value: string, currentArray: string[]) => {
    if (currentArray.includes(value)) {
      onFilterChange(type, currentArray.filter(i => i !== value));
    } else {
      onFilterChange(type, [...currentArray, value]);
    }
  };

  const filteredBrands = BRANDS.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()));

  const SidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-accent/20 px-6 py-5 lg:px-0 lg:py-0 lg:mb-2 lg:border-none">
        <h2 className="font-serif text-xl font-normal text-text-main tracking-wide">Filters</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={onClearAll}
            disabled={!hasActiveFilters}
            className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${hasActiveFilters ? 'text-primary hover:underline' : 'text-text-muted opacity-50 cursor-not-allowed'}`}
          >
            Clear All
          </button>
          {/* Mobile close button */}
          <button onClick={onClose} className="lg:hidden text-text-muted hover:text-text-main">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Scrollable Filters Area */}
      <div className="flex-1 overflow-y-auto px-6 lg:px-0 pb-24 lg:pb-8 hide-scrollbar">
        
        <Accordion title="Category" defaultOpen={true}>
          <div className="space-y-3">
            {SUB_CATEGORIES.map((cat) => (
              <label key={cat.name} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.subcategories.includes(cat.name) ? 'bg-text-main border-text-main text-white' : 'border-accent/40 bg-white group-hover:border-text-main'}`}>
                    {filters.subcategories.includes(cat.name) && <Check size={12} strokeWidth={3} />}
                  </div>
                  <span className="text-[13px] text-text-muted group-hover:text-text-main transition-colors">{cat.name}</span>
                </div>
                <span className="text-[11px] text-text-muted/60">({cat.count})</span>
              </label>
            ))}
          </div>
        </Accordion>

        <Accordion title="Price Range" defaultOpen={true}>
          <div className="space-y-4 pt-2">
            {/* Mocked Dual Slider */}
            <div className="relative h-1 w-full bg-zinc-200 rounded-full">
              <div className="absolute top-0 left-1/4 right-1/4 h-full bg-[#E78A7A] rounded-full"></div>
              {/* Thumbs */}
              <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#E78A7A] rounded-full shadow-sm cursor-pointer"></div>
              <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#E78A7A] rounded-full shadow-sm cursor-pointer"></div>
            </div>
            
            {/* Input boxes */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-full border border-zinc-200 rounded-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[12px]">₹</span>
                <input type="text" value="399" readOnly className="w-full bg-transparent py-1.5 pl-6 pr-2 text-[12px] font-medium text-zinc-700 outline-none" />
              </div>
              <span className="text-zinc-400">-</span>
              <div className="relative w-full border border-zinc-200 rounded-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[12px]">₹</span>
                <input type="text" value="4999" readOnly className="w-full bg-transparent py-1.5 pl-6 pr-2 text-[12px] font-medium text-zinc-700 outline-none" />
              </div>
            </div>
          </div>
        </Accordion>

        <Accordion title="Size" defaultOpen={true}>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => {
              const isActive = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => handleCheckboxToggle('sizes', size, filters.sizes)}
                  className={`min-w-[40px] px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border ${
                    isActive 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </Accordion>

        <Accordion title="Color" defaultOpen={false}>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => {
              const isActive = filters.colors.includes(color.name);
              return (
                <button
                  key={color.name}
                  onClick={() => handleCheckboxToggle('colors', color.name, filters.colors)}
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                    isActive ? 'ring-2 ring-offset-2 ring-text-main' : 'ring-1 ring-accent/20'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={`Color ${color.name}`}
                >
                  {isActive && <Check size={14} className={color.name === 'White' ? 'text-primary' : 'text-white'} strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </Accordion>

        <Accordion title="Brand / Collection" defaultOpen={false}>
          <div className="mb-4 relative">
            <input 
              type="text" 
              placeholder="Search brands..." 
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="w-full bg-accent/5 border border-accent/20 rounded-md py-2 pl-8 pr-3 text-[12px] text-text-main placeholder-text-muted/60 focus:outline-none focus:border-primary transition"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          </div>
          <div className="space-y-3 max-h-[150px] overflow-y-auto hide-scrollbar">
            {filteredBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-3 group cursor-pointer">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.brands.includes(brand) ? 'bg-text-main border-text-main text-white' : 'border-accent/40 bg-white group-hover:border-text-main'}`}>
                  {filters.brands.includes(brand) && <Check size={12} strokeWidth={3} />}
                </div>
                <span className="text-[13px] text-text-muted group-hover:text-text-main transition-colors">{brand}</span>
              </label>
            ))}
            {filteredBrands.length === 0 && <p className="text-xs text-text-muted">No brands found.</p>}
          </div>
        </Accordion>

        <Accordion title="Availability & Discount" defaultOpen={false}>
          <div className="space-y-4 pt-2">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-[13px] text-text-muted group-hover:text-text-main transition-colors">In Stock Only</span>
              <div className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${filters.inStockOnly ? 'bg-text-main' : 'bg-accent/20'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${filters.inStockOnly ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              <input type="checkbox" className="hidden" checked={filters.inStockOnly} onChange={() => onFilterChange('inStockOnly', !filters.inStockOnly)} />
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-[13px] font-medium text-text-main transition-colors">On Sale (&gt; 30% off)</span>
              <div className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${filters.onSale ? 'bg-[#E53E3E]' : 'bg-accent/20'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${filters.onSale ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              <input type="checkbox" className="hidden" checked={filters.onSale} onChange={() => onFilterChange('onSale', !filters.onSale)} />
            </label>
          </div>
        </Accordion>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden absolute bottom-0 left-0 w-full bg-white border-t border-accent/20 p-4 flex gap-4 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={onClearAll}
          className="flex-1 py-3.5 border border-text-main text-text-main font-bold text-[12px] uppercase tracking-widest rounded-full hover:bg-accent/5 transition-colors"
        >
          Reset
        </button>
        <button 
          onClick={onClose}
          className="flex-1 py-3.5 bg-text-main text-white font-bold text-[12px] uppercase tracking-widest rounded-full shadow-md hover:bg-primary transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[280px] shrink-0">
        <div className="sticky top-[160px] pb-12">
          {SidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer */}
      <div 
        className={`fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-[340px] bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {SidebarContent}
      </div>
    </>
  );
}
