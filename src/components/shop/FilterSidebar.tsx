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
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  filters: FilterState;
  onFilterChange: (type: keyof FilterState, value: any) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const CHUDITHAR_VARIETIES = [
  "Anarkali Chudithar",
  "Straight Cut Chudithar",
  "A-Line Chudithar",
  "Angrakha Style",
  "Floor Length Chudithar",
  "Umbrella Cut Chudithar",
  "Pakistani Style Suit",
  "Patiala Suit",
  "Punjabi Suit",
  "Salwar Suit",
  "Palazzo Suit",
  "Sharara Suit",
  "Gharara Suit",
  "Pant Style Suit",
  "Cigarette Pant Suit",
  "Dhoti Style Suit",
  "Jacket Style Suit",
  "Layered Chudithar",
  "High-Low Style Suit",
  "Flared Chudithar",
  "Kaftan Style Suit",
  "Kurta with Dupatta Set",
  "Kurta Palazzo Set",
  "Kurta Pant Set",
  "Kurta Skirt Set"
];

const KURTI_VARIETIES = [
  "Straight Cut Kurti",
  "A-Line Kurti",
  "Anarkali Kurti",
  "Flared Kurti",
  "High-Low Kurti",
  "Asymmetrical Kurti",
  "Angrakha Kurti",
  "Front Slit Kurti",
  "Side Slit Kurti",
  "Floor Length Kurti",
  "Short Kurti",
  "Long Kurti",
  "Shirt Style Kurti",
  "Kaftan Kurti",
  "Jacket Style Kurti",
  "Layered Kurti",
  "C-Cut Kurti",
  "Tail Cut Kurti",
  "Umbrella Cut Kurti",
  "Princess Cut Kurti",
  "Panelled Kurti",
  "Peplum Kurti",
  "Dhoti Style Kurti",
  "Indo-Western Kurti",
  "Asymmetric Hem Kurti",
  "Slit Style Kurti",
  "Empire Line Kurti",
  "Frock Style Kurti",
  "Tunic Style Kurti",
  "Denim Kurti"
];

const ANARKALI_VARIETIES = [
  "Classic Anarkali",
  "Floor Length Anarkali",
  "Short Anarkali",
  "Long Anarkali",
  "Flared Anarkali",
  "Umbrella Anarkali",
  "Layered Anarkali",
  "Jacket Style Anarkali",
  "Angrakha Anarkali",
  "Asymmetrical Anarkali",
  "High-Low Anarkali",
  "Panelled Anarkali",
  "Princess Cut Anarkali",
  "Front Slit Anarkali",
  "Side Slit Anarkali",
  "Trail Style Anarkali",
  "Gown Style Anarkali",
  "Pakistani Style Anarkali",
  "Indo-Western Anarkali",
  "Cape Style Anarkali",
  "Double Layer Anarkali",
  "Tiered Anarkali",
  "Kalidar Anarkali",
  "Frock Style Anarkali",
  "Party Wear Anarkali",
  "Bridal Anarkali",
  "Festive Anarkali",
  "Casual Anarkali",
  "Embroidered Anarkali",
  "Printed Anarkali"
];

const SAREE_VARIETIES = [
  "Kanchipuram Saree",
  "Banarasi Saree",
  "Mysore Silk Saree",
  "Chanderi Saree",
  "Paithani Saree",
  "Patola Saree",
  "Bandhani Saree",
  "Sambalpuri Saree",
  "Pochampally Saree",
  "Kota Saree",
  "Jamdani Saree",
  "Tant Saree",
  "Kalamkari Saree",
  "Linen Saree",
  "Cotton Saree",
  "Silk Saree",
  "Georgette Saree",
  "Chiffon Saree",
  "Crepe Saree",
  "Organza Saree",
  "Tissue Saree",
  "Net Saree",
  "Satin Saree",
  "Velvet Saree",
  "Designer Saree",
  "Party Wear Saree",
  "Bridal Saree",
  "Wedding Saree",
  "Half & Half Saree",
  "Ruffle Saree",
  "Pre-Draped Saree",
  "Ready-to-Wear Saree",
  "Lehenga Style Saree",
  "Dhoti Style Saree",
  "Belted Saree",
  "Printed Saree",
  "Embroidered Saree",
  "Handloom Saree",
  "Fancy Saree",
  "Casual Saree"
];

const OCCASION_VARIETIES = [
  "Casual Wear",
  "Office Wear",
  "Party Wear",
  "Festive Wear",
  "Wedding Wear",
  "Reception Wear",
  "Engagement Wear",
  "Traditional Wear",
  "Daily Wear"
];

const CATEGORY_SUB_ITEMS: Record<string, string[]> = {
  Chudithar: CHUDITHAR_VARIETIES,
  Kurti: KURTI_VARIETIES,
  Anarkali: ANARKALI_VARIETIES,
  Saree: SAREE_VARIETIES,
  Occasions: OCCASION_VARIETIES,
  Ethnic: ["Kurtas", "Anarkali", "Ethnic Dresses", "Kurta Sets", "Lehengas", "Dupattas"],
  Dresses: ["Midi Dresses", "Maxi Dresses", "Mini Dresses", "Party Dresses", "Bodycon Dresses"],
  "Co-ords": ["Printed Co-ords", "Festive Sets", "Western Sets", "Blazer Sets"],
  Tops: ["Crop Tops", "Shirts & Blouses", "Tunics", "T-Shirts"]
};

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

export function FilterSidebar({ categories, selectedCategory, onSelectCategory, filters, onFilterChange, onClearAll, isOpen, onClose }: FilterSidebarProps) {
  const [brandSearch, setBrandSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Chudithar: true,
    Kurti: false,
    Anarkali: false,
    Saree: false,
    Occasions: false,
  });

  const toggleCategoryExpand = (cat: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

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
      {/* Header for Mobile */}
      <div className="flex lg:hidden items-center justify-between pb-4 border-b border-accent/20 px-6 py-5">
        <h2 className="font-serif text-xl font-normal text-text-main tracking-wide">Filters</h2>
        <button onClick={onClose} className="text-text-muted hover:text-text-main">
          <X size={20} />
        </button>
      </div>

      {/* Scrollable Filters Area */}
      <div className="flex-1 overflow-y-auto px-6 lg:px-0 pb-24 lg:pb-8 hide-scrollbar">
        
        {/* CATEGORY NAV - Revolve Style with Nested Dropdowns */}
        <div className="pb-6 lg:pt-0 pt-4">
          <h3 className="font-bold text-[13px] tracking-wide text-primary uppercase mb-4">Category</h3>
          <ul className="space-y-1">
            {categories.map((cat) => {
              const subItems = CATEGORY_SUB_ITEMS[cat] || [];
              const isExpanded = Boolean(expandedCategories[cat]);
              const isSelected = selectedCategory === cat;
              const hasActiveSub = subItems.some(sub => filters.subcategories.includes(sub));

              return (
                <li key={cat} className="flex flex-col border-b border-stone-100/60 pb-1 pt-1">
                  <div className="flex items-center justify-between py-1 group/cat">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat);
                        if (subItems.length > 0 && !isExpanded) {
                          setExpandedCategories(prev => ({ ...prev, [cat]: true }));
                        }
                        if (window.innerWidth < 1024 && subItems.length === 0) onClose();
                      }}
                      className={`text-[13px] text-left transition-all flex items-center gap-2 cursor-pointer flex-1 ${
                        isSelected 
                          ? 'font-bold text-[#4A1513]' 
                          : hasActiveSub
                          ? 'font-semibold text-[#4A1513]'
                          : 'text-stone-600 hover:text-stone-950 font-normal'
                      }`}
                    >
                      <span>{cat === 'All' ? 'All Items' : cat}</span>
                      {subItems.length > 0 && (
                        <span className="text-[10px] text-stone-400 font-medium group-hover/cat:text-[#4A1513]">({subItems.length})</span>
                      )}
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4A1513]" />
                      )}
                      {subItems.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => toggleCategoryExpand(cat, e)}
                          className="p-1 text-stone-400 hover:text-[#4A1513] transition-transform duration-200"
                          title={`Toggle ${cat} list`}
                        >
                          <ChevronDown size={13} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#4A1513]' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expandable Sub-Categories List */}
                  {subItems.length > 0 && (
                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[280px] opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'}`}>
                      <div className="pl-3.5 ml-1 border-l-2 border-[#4A1513]/20 space-y-1 py-1 max-h-[260px] overflow-y-auto hide-scrollbar">
                        {subItems.map((sub) => {
                          const isSubSelected = filters.subcategories.includes(sub);
                          return (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => {
                                handleCheckboxToggle('subcategories', sub, filters.subcategories);
                                if (selectedCategory !== cat && selectedCategory !== 'All') {
                                  onSelectCategory(cat);
                                }
                                if (window.innerWidth < 1024) onClose();
                              }}
                              className={`text-[12px] text-left w-full flex items-center justify-between py-1 px-1.5 rounded-md transition-colors ${
                                isSubSelected
                                  ? 'font-bold text-[#4A1513] bg-[#4A1513]/5'
                                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                              }`}
                            >
                              <span className="truncate pr-2">{sub}</span>
                              {isSubSelected ? (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#4A1513] shrink-0" />
                              ) : (
                                <span className="w-2.5 h-2.5 rounded-full border border-stone-300 group-hover:border-stone-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Clear Filters (Only show if active) */}
        {hasActiveFilters && (
          <div className="py-4 border-t border-zinc-100 flex justify-between items-center">
            <span className="font-bold text-[13px] tracking-wide text-primary">Filters</span>
            <button 
              onClick={onClearAll}
              className="text-[11px] font-bold uppercase tracking-widest text-text-muted hover:text-text-main underline transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        {/* Designers (Formerly Brand) */}
        <Accordion title="Designers" defaultOpen={false}>
          <div className="mb-4 relative">
            <input 
              type="text" 
              placeholder="Search designers..." 
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
            {filteredBrands.length === 0 && <p className="text-xs text-text-muted">No designers found.</p>}
          </div>
        </Accordion>

        {/* Occasion Filter */}
        <Accordion title="Occasion" defaultOpen={false}>
          <div className="space-y-3">
            {[
              "Casual Wear",
              "Office Wear",
              "Party Wear",
              "Festive Wear",
              "Wedding Wear",
              "Reception Wear",
              "Engagement Wear",
              "Traditional Wear",
              "Daily Wear"
            ].map((item) => (
              <label key={item} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 rounded border border-accent/40 bg-white group-hover:border-text-main flex items-center justify-center"></div>
                <span className="text-[13px] text-text-muted group-hover:text-text-main">{item}</span>
              </label>
            ))}
          </div>
        </Accordion>

        {/* Price */}
        <Accordion title="Price" defaultOpen={true}>
          <div className="space-y-4 pt-2">
            <div className="relative h-1 w-full bg-zinc-200 rounded-full">
              <div className="absolute top-0 left-1/4 right-1/4 h-full bg-[#E78A7A] rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#E78A7A] rounded-full shadow-sm cursor-pointer"></div>
              <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#E78A7A] rounded-full shadow-sm cursor-pointer"></div>
            </div>
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

        {/* Discount */}
        <Accordion title="Discount" defaultOpen={false}>
          <div className="space-y-4 pt-2">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-[13px] font-medium text-text-main transition-colors">On Sale (&gt; 30% off)</span>
              <div className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${filters.onSale ? 'bg-[#E53E3E]' : 'bg-accent/20'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${filters.onSale ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              <input type="checkbox" className="hidden" checked={filters.onSale} onChange={() => onFilterChange('onSale', !filters.onSale)} />
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-[13px] text-text-muted group-hover:text-text-main transition-colors">Clearance (Up to 70% off)</span>
              <div className="w-9 h-5 rounded-full bg-accent/20 transition-colors flex items-center px-0.5">
                <div className="w-4 h-4 rounded-full bg-white translate-x-0" />
              </div>
            </label>
          </div>
        </Accordion>

        {/* Pattern - Dummy */}
        <Accordion title="Pattern" defaultOpen={false}>
          <div className="space-y-3">
            {["Floral", "Geometric", "Solid", "Striped", "Printed"].map((item) => (
              <label key={item} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 rounded border border-accent/40 bg-white group-hover:border-text-main flex items-center justify-center"></div>
                <span className="text-[13px] text-text-muted group-hover:text-text-main">{item}</span>
              </label>
            ))}
          </div>
        </Accordion>

        {/* Type of Work - Dummy */}
        <Accordion title="Type of Work" defaultOpen={false}>
          <div className="space-y-3">
            {["Embroidery", "Zari", "Mirror Work", "Sequin", "Handwoven"].map((item) => (
              <label key={item} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 rounded border border-accent/40 bg-white group-hover:border-text-main flex items-center justify-center"></div>
                <span className="text-[13px] text-text-muted group-hover:text-text-main">{item}</span>
              </label>
            ))}
          </div>
        </Accordion>

        {/* Size */}
        <Accordion title="Size" defaultOpen={false}>
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

        {/* Color */}
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

        {/* Shipping Time - Dummy */}
        <Accordion title="Shipping Time" defaultOpen={false}>
          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-[13px] text-text-muted group-hover:text-text-main transition-colors">Ready to Ship</span>
              <div className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${filters.inStockOnly ? 'bg-text-main' : 'bg-accent/20'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${filters.inStockOnly ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              <input type="checkbox" className="hidden" checked={filters.inStockOnly} onChange={() => onFilterChange('inStockOnly', !filters.inStockOnly)} />
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-[13px] text-text-muted group-hover:text-text-main transition-colors">1-2 Weeks</span>
              <div className="w-9 h-5 rounded-full bg-accent/20 transition-colors flex items-center px-0.5">
                <div className="w-4 h-4 rounded-full bg-white translate-x-0" />
              </div>
            </label>
          </div>
        </Accordion>

        {/* Styles - Dummy */}
        <Accordion title="Styles" defaultOpen={false}>
          <div className="space-y-3">
            {["A-Line", "Straight", "Flared", "Asymmetric"].map((item) => (
              <label key={item} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 rounded border border-accent/40 bg-white group-hover:border-text-main flex items-center justify-center"></div>
                <span className="text-[13px] text-text-muted group-hover:text-text-main">{item}</span>
              </label>
            ))}
          </div>
        </Accordion>

        {/* Fabric/Material - Dummy */}
        <Accordion title="Fabric/Material" defaultOpen={false}>
          <div className="space-y-3">
            {["Cotton", "Silk", "Georgette", "Chiffon", "Velvet"].map((item) => (
              <label key={item} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 rounded border border-accent/40 bg-white group-hover:border-text-main flex items-center justify-center"></div>
                <span className="text-[13px] text-text-muted group-hover:text-text-main">{item}</span>
              </label>
            ))}
          </div>
        </Accordion>

        {/* Sleeve Length - Dummy */}
        <Accordion title="Sleeve Length" defaultOpen={false}>
          <div className="space-y-3">
            {["Sleeveless", "Short Sleeves", "3/4 Sleeves", "Full Sleeves"].map((item) => (
              <label key={item} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 rounded border border-accent/40 bg-white group-hover:border-text-main flex items-center justify-center"></div>
                <span className="text-[13px] text-text-muted group-hover:text-text-main">{item}</span>
              </label>
            ))}
          </div>
        </Accordion>

        {/* Neckline Style - Dummy */}
        <Accordion title="Neckline Style" defaultOpen={false}>
          <div className="space-y-3">
            {["V-Neck", "Round Neck", "Boat Neck", "Halter Neck"].map((item) => (
              <label key={item} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 rounded border border-accent/40 bg-white group-hover:border-text-main flex items-center justify-center"></div>
                <span className="text-[13px] text-text-muted group-hover:text-text-main">{item}</span>
              </label>
            ))}
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
