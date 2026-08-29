"use client";

import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ChevronDown, X, Check } from 'lucide-react';
import { ProductCard } from '@/components/shop/ProductCard';

const FILTER_OPTIONS = {
  categories: [
    // Dresses
    "Midi Dresses", "Maxi Dresses", "Mini Dresses", "Party Dresses",
    // Ethnic
    "Kurtas", "Anarkali", "Ethnic Dresses", "Kurta Sets",
    // Western
    "Bodycon", "A-Line", "Shirt Dresses",
    // Tops
    "Crop Tops", "Shirts", "Blouses", "Tunics",
    // Fusion
    "Co-ords", "Indo-Western", "Fusion Dresses", "Sets",
    // Occasion
    "Wedding", "Party", "Casual", "Office"
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  prices: ["Under ₹999", "₹1,000 - ₹2,499", "₹2,500 - ₹4,999", "₹5,000+"],
  colors: ["Black", "White", "Red", "Navy", "Green", "Pink", "Blue"],
  brands: ["Nagla Women's", "Femazon Exclusive", "Zara", "H&M", "Biba"],
  fabrics: ["Cotton", "Linen", "Silk", "Satin", "Georgette", "Velvet", "Chiffon"],
  occasions: ["Everyday", "Workwear", "Party", "Vacation", "Special Occasion"],
  ratings: ["4★ & above", "3★ & above"]
};

const FILTER_LABELS: Record<string, string> = {
  categories: "Category",
  sizes: "Size",
  prices: "Price",
  colors: "Color",
  brands: "Brand",
  fabrics: "Fabric",
  occasions: "Occasion",
  ratings: "Rating"
};

const SORT_OPTIONS = [
  "Recommended",
  "What's New",
  "Popularity",
  "Price: Low → High",
  "Price: High → Low",
  "Customer Rating"
];

interface DressesShopClientProps {
  initialProducts: any[];
  displayTitle: string;
  displaySubtitle?: string;
}

export function DressesShopClient({ initialProducts, displayTitle, displaySubtitle }: DressesShopClientProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const [activeSort, setActiveSort] = useState("Recommended");
  
  // State for mock filters
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    categories: [], sizes: [], prices: [], colors: [], brands: [], fabrics: [], occasions: [], ratings: []
  });

  // Expand/collapse individual filter sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true, sizes: true, prices: true, colors: true, brands: true, fabrics: false, occasions: false, ratings: false
  });

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({
      categories: [], sizes: [], prices: [], colors: [], brands: [], fabrics: [], occasions: [], ratings: []
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Mock Sorting Logic
  const displayProducts = useMemo(() => {
    let sorted = [...initialProducts];
    if (activeSort === "Price: Low → High") sorted.sort((a, b) => a.price - b.price);
    if (activeSort === "Price: High → Low") sorted.sort((a, b) => b.price - a.price);
    if (activeSort === "What's New") sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sorted;
  }, [initialProducts, activeSort]);

  return (
    <>
      {/* Page Header */}
      <div className="pt-24 pb-8 px-4 max-w-7xl mx-auto text-center border-b border-neutral-100">
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-widest mb-4">
          {displayTitle}
        </h1>
        {displaySubtitle && (
          <p className="text-sm text-neutral-600 mb-6">{displaySubtitle}</p>
        )}
        <p className="text-neutral-500 font-medium">
          {displayProducts.length} Dresses
        </p>
      </div>

      {/* Controls: Filters & Sort */}
      <div className="py-4 px-4 max-w-7xl mx-auto flex items-center justify-between border-b border-neutral-100 mb-8 relative">
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider hover:text-neutral-600 transition-colors"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider hover:text-neutral-600 transition-colors"
          >
            Sort By
            <ChevronDown size={18} />
          </button>
          
          {isSortOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-200 shadow-xl z-20">
              {SORT_OPTIONS.map(option => (
                <button
                  key={option}
                  onClick={() => { setActiveSort(option); setIsSortOpen(false); }}
                  className={`block w-full text-left px-4 py-3 text-sm hover:bg-neutral-50 ${activeSort === option ? 'font-bold' : 'font-medium'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 max-w-7xl mx-auto pb-24">
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
            {displayProducts.map(product => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">No dresses found for this style</h3>
            <p className="text-neutral-500">Try adjusting your filters or check back later for new arrivals.</p>
          </div>
        )}
      </div>

      {/* Filter Drawer */}
      {isFilterOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsFilterOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-[85vw] md:w-[400px] bg-white z-50 flex flex-col shadow-2xl transform transition-transform duration-300">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-lg font-bold uppercase tracking-wider">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Filters */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {Object.entries(FILTER_OPTIONS).map(([category, options]) => (
                <div key={category} className="border-b border-neutral-100 pb-6 last:border-0">
                  <button 
                    className="flex w-full items-center justify-between py-2 text-left font-bold uppercase tracking-wide text-sm"
                    onClick={() => toggleSection(category)}
                  >
                    {FILTER_LABELS[category]}
                    <ChevronDown size={16} className={`transition-transform duration-200 ${expandedSections[category] ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedSections[category] && (
                    <div className="mt-4 space-y-3">
                      {options.map((option) => {
                        const isChecked = activeFilters[category]?.includes(option);
                        return (
                          <label key={option} className="flex items-center group cursor-pointer">
                            <div className={`w-5 h-5 border flex items-center justify-center mr-3 transition-colors ${isChecked ? 'bg-black border-black text-white' : 'border-neutral-300 group-hover:border-black'}`}>
                              {isChecked && <Check size={14} />}
                            </div>
                            <span className="text-sm font-medium">{option}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-neutral-100 bg-white grid grid-cols-2 gap-4">
              <button 
                onClick={clearAllFilters}
                className="py-3 border border-black text-black font-bold text-sm uppercase tracking-wider hover:bg-neutral-50 transition-colors"
              >
                Clear All
              </button>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="py-3 bg-black border border-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-900 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
