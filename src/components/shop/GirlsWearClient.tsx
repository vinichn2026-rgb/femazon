"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Filter, 
  X, 
  Truck, 
  Heart, 
  ChevronRight, 
  SlidersHorizontal,
  ArrowRight,
  Package
} from 'lucide-react';
import { useFemazonStore } from '@/context/FemazonStoreContext';

export interface GirlsWearProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  vendorName: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
  sizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  readyToShip: boolean;
  deliveryDays?: number | null;
  occasion?: string;
  createdAt: string;
}

interface GirlsWearClientProps {
  initialProducts: GirlsWearProduct[];
}

const GIRLS_SUBCATEGORIES = [
  { id: "all", label: "All Girls' Wear" },
  { id: "lehenga", label: "Lehenga Choli", match: ["lehenga"] },
  { id: "frocks", label: "Party Frocks", match: ["frock", "dress", "party"] },
  { id: "pattu-pavadai", label: "Pattu Pavadai", match: ["pattu", "pavadai", "brocade"] },
  { id: "anarkali", label: "Anarkali Suits", match: ["anarkali"] },
  { id: "sharara", label: "Sharara Sets", match: ["sharara", "peplum"] },
];

const GIRLS_SIZES = ["1-2 Y", "2-3 Y", "3-4 Y", "4-5 Y", "5-6 Y", "6-7 Y", "7-8 Y", "8-9 Y", "9-10 Y", "10-12 Y"];

const GIRLS_OCCASIONS = [
  { id: "all", label: "All Occasions" },
  { id: "festive", label: "Festive & Wedding" },
  { id: "birthday", label: "Birthday & Party" },
  { id: "traditional", label: "Ceremonial & Puja" },
];

export function GirlsWearClient({ initialProducts }: GirlsWearClientProps) {
  const { isInWishlist, toggleWishlist } = useFemazonStore();

  const [activeSubcategory, setActiveSubcategory] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("newest");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");
  const [selectedMinDiscount, setSelectedMinDiscount] = useState<number>(0);
  const [onlyReadyToShip, setOnlyReadyToShip] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Available brands dynamically
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    initialProducts.forEach(p => {
      if (p.brand && p.brand !== "Femazon") brands.add(p.brand);
      if (p.vendorName && p.vendorName !== "Femazon") brands.add(p.vendorName);
    });
    return Array.from(brands).sort();
  }, [initialProducts]);

  // Available colors dynamically
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    initialProducts.forEach(p => {
      p.colors.forEach(c => colors.add(c));
    });
    return Array.from(colors).sort();
  }, [initialProducts]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Subcategory filter
    if (activeSubcategory !== "all") {
      const subConfig = GIRLS_SUBCATEGORIES.find(s => s.id === activeSubcategory);
      if (subConfig?.match) {
        list = list.filter(p => {
          const text = `${p.name} ${p.subcategory || ""} ${p.category}`.toLowerCase();
          return subConfig.match.some(m => text.includes(m));
        });
      }
    }

    // Brand filter
    if (selectedBrand !== "all") {
      list = list.filter(p => 
        p.brand.toLowerCase() === selectedBrand.toLowerCase() || 
        p.vendorName.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // Size filter (multi-select)
    if (selectedSizes.length > 0) {
      list = list.filter(p => 
        p.sizes.some(sz => selectedSizes.includes(sz))
      );
    }

    // Color filter (multi-select)
    if (selectedColors.length > 0) {
      list = list.filter(p => 
        p.colors.some(col => selectedColors.some(sc => col.toLowerCase().includes(sc.toLowerCase())))
      );
    }

    // Occasion filter
    if (selectedOccasion !== "all") {
      list = list.filter(p => 
        p.occasion && p.occasion.toLowerCase().includes(selectedOccasion.toLowerCase())
      );
    }

    // Price filter
    if (selectedPriceRange === "under1500") list = list.filter(p => p.price < 1500);
    else if (selectedPriceRange === "1500to2500") list = list.filter(p => p.price >= 1500 && p.price <= 2500);
    else if (selectedPriceRange === "2500to4000") list = list.filter(p => p.price > 2500 && p.price <= 4000);
    else if (selectedPriceRange === "above4000") list = list.filter(p => p.price > 4000);

    // Discount filter
    if (selectedMinDiscount > 0) {
      list = list.filter(p => p.discount >= selectedMinDiscount);
    }

    // Ready to ship
    if (onlyReadyToShip) {
      list = list.filter(p => p.readyToShip);
    }

    // Sorting
    if (selectedSort === "newest") {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (selectedSort === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (selectedSort === "popular") {
      list.sort((a, b) => b.reviewCount - a.reviewCount || b.rating - a.rating);
    }

    return list;
  }, [
    initialProducts, 
    activeSubcategory, 
    selectedBrand, 
    selectedSizes, 
    selectedColors, 
    selectedOccasion, 
    selectedPriceRange, 
    selectedMinDiscount, 
    onlyReadyToShip, 
    selectedSort
  ]);

  const hasActiveFilters = 
    activeSubcategory !== "all" || 
    selectedBrand !== "all" || 
    selectedSizes.length > 0 || 
    selectedColors.length > 0 || 
    selectedOccasion !== "all" || 
    selectedPriceRange !== "all" || 
    selectedMinDiscount > 0 || 
    onlyReadyToShip;

  const clearAllFilters = () => {
    setActiveSubcategory("all");
    setSelectedBrand("all");
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedOccasion("all");
    setSelectedPriceRange("all");
    setSelectedMinDiscount(0);
    setOnlyReadyToShip(false);
  };

  const paginatedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#FAF7F5] pb-24 text-stone-900">
      
      {/* 1. Category Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#3D1412] via-[#4A1513] to-[#5C1B19] text-white pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF0E6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-amber-200 mb-3 border border-white/15">
            <Sparkles size={13} className="text-amber-300" />
            <span>Little Princess Haute Couture</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-3">
            Girls&apos; Festive &amp; Occasion Wear
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
            Exquisite traditional silk pattu pavadais, hand-embroidered velvet lehenga cholis, tiered organza party frocks, and festive anarkalis crafted for graceful moments.
          </p>
        </div>
      </section>

      {/* 2. Subcategory Navigation Pills */}
      <nav aria-label="Girls Subcategories" className="bg-white border-b border-stone-200 sticky top-14 sm:top-16 z-30 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3 py-3 overflow-x-auto no-scrollbar">
            {GIRLS_SUBCATEGORIES.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  setActiveSubcategory(sub.id);
                  setVisibleCount(12);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeSubcategory === sub.id
                    ? "bg-[#4A1513] text-white shadow-xs"
                    : "bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 hover:border-[#4A1513]/40"
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 3. Controls & Active Filters Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
            >
              <Filter size={13} />
              <span>Filters</span>
            </button>

            <span className="text-xs font-medium text-stone-600">
              Showing <strong className="text-stone-900">{filteredProducts.length}</strong> items
            </span>
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-stone-500 hidden sm:inline">Sort by:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4A1513] cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Popularity &amp; Ratings</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider mr-1">Active:</span>

            {activeSubcategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#4A1513]/10 text-[#4A1513] text-xs font-medium border border-[#4A1513]/20">
                {GIRLS_SUBCATEGORIES.find(s => s.id === activeSubcategory)?.label}
                <button onClick={() => setActiveSubcategory("all")} className="hover:text-red-700 cursor-pointer p-0.5">
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedBrand !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-medium border border-amber-200">
                {selectedBrand}
                <button onClick={() => setSelectedBrand("all")} className="hover:text-amber-700 cursor-pointer p-0.5">
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedSizes.map(size => (
              <span key={size} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-medium border border-stone-200">
                Size: {size}
                <button onClick={() => toggleSize(size)} className="hover:text-red-700 cursor-pointer p-0.5">
                  <X size={12} />
                </button>
              </span>
            ))}

            {selectedColors.map(color => (
              <span key={color} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-medium border border-rose-200">
                {color}
                <button onClick={() => toggleColor(color)} className="hover:text-rose-900 cursor-pointer p-0.5">
                  <X size={12} />
                </button>
              </span>
            ))}

            {selectedPriceRange !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-medium border border-stone-200">
                Price: {selectedPriceRange}
                <button onClick={() => setSelectedPriceRange("all")} className="hover:text-red-700 cursor-pointer p-0.5">
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-[#4A1513] hover:underline cursor-pointer ml-1"
            >
              Clear All
            </button>
          </div>
        )}

        {/* 4. Main Body: Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-6 sticky top-36">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="font-serif text-base font-bold text-stone-900">Refine Girls&apos; Wear</span>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} className="text-xs text-[#4A1513] font-semibold hover:underline cursor-pointer">
                  Reset
                </button>
              )}
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
                Price Range
              </h4>
              <div className="space-y-1.5 text-xs text-stone-600">
                {[
                  { id: "all", label: "All Prices" },
                  { id: "under1500", label: "Under ₹1,500" },
                  { id: "1500to2500", label: "₹1,500 – ₹2,500" },
                  { id: "2500to4000", label: "₹2,500 – ₹4,000" },
                  { id: "above4000", label: "Above ₹4,000" },
                ].map(p => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer hover:text-stone-900">
                    <input 
                      type="radio" 
                      name="girlsPrice" 
                      checked={selectedPriceRange === p.id} 
                      onChange={() => setSelectedPriceRange(p.id)}
                      className="accent-[#4A1513]"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Age / Size Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
                Age / Size
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {GIRLS_SIZES.map(sz => {
                  const isChecked = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition cursor-pointer ${
                        isChecked 
                          ? 'bg-[#4A1513] text-white border-[#4A1513]' 
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors Filter */}
            {availableColors.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
                  Color
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {availableColors.map(color => {
                    const isChecked = selectedColors.includes(color);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => toggleColor(color)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-full border transition cursor-pointer ${
                          isChecked 
                            ? 'bg-[#4A1513] text-white border-[#4A1513]' 
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Occasion Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
                Occasion
              </h4>
              <div className="space-y-1.5 text-xs text-stone-600">
                {GIRLS_OCCASIONS.map(occ => (
                  <label key={occ.id} className="flex items-center gap-2 cursor-pointer hover:text-stone-900">
                    <input 
                      type="radio" 
                      name="girlsOccasion" 
                      checked={selectedOccasion === occ.id} 
                      onChange={() => setSelectedOccasion(occ.id)}
                      className="accent-[#4A1513]"
                    />
                    <span>{occ.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands Filter */}
            {availableBrands.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
                  Boutique / Brand
                </h4>
                <div className="space-y-1.5 text-xs text-stone-600">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-stone-900">
                    <input 
                      type="radio" 
                      name="girlsBrand" 
                      checked={selectedBrand === "all"} 
                      onChange={() => setSelectedBrand("all")}
                      className="accent-[#4A1513]"
                    />
                    <span>All Boutiques</span>
                  </label>
                  {availableBrands.map(b => (
                    <label key={b} className="flex items-center gap-2 cursor-pointer hover:text-stone-900">
                      <input 
                        type="radio" 
                        name="girlsBrand" 
                        checked={selectedBrand.toLowerCase() === b.toLowerCase()} 
                        onChange={() => setSelectedBrand(b)}
                        className="accent-[#4A1513]"
                      />
                      <span className="truncate">{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Ready to Ship */}
            <div className="pt-2 border-t border-stone-100">
              <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={onlyReadyToShip} 
                  onChange={(e) => setOnlyReadyToShip(e.target.checked)}
                  className="rounded text-[#4A1513] focus:ring-[#4A1513]"
                />
                <span className="flex items-center gap-1.5">
                  <Truck size={14} className="text-[#4A1513]" />
                  Ready to Ship Only
                </span>
              </label>
            </div>
          </aside>

          {/* PRODUCTS LISTING GRID */}
          <main className="lg:col-span-3">
            {paginatedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
                <Package size={40} className="mx-auto text-stone-300 mb-3" />
                <h3 className="font-serif text-lg font-bold text-stone-800 mb-1">
                  No products found
                </h3>
                <p className="text-xs text-stone-500 mb-4 max-w-sm mx-auto">
                  We couldn&apos;t find any items matching your selected criteria. Try adjusting or clearing your filters.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-5 py-2 rounded-full bg-[#4A1513] text-white text-xs font-semibold hover:bg-[#350B0A] transition cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
                  {paginatedProducts.map((product) => {
                    const isFavorited = isInWishlist(product.id);
                    const primaryImage = product.images[0] || "/images/dress/placeholder.jpg";
                    const hoverImage = product.images.length > 1 ? product.images[1] : primaryImage;

                    return (
                      <div 
                        key={product.id}
                        className="group flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-stone-300 transition duration-300 text-left"
                      >
                        {/* Media Area */}
                        <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                          <Link href={`/products/${product.slug || product.id}`} className="block w-full h-full">
                            <img 
                              src={primaryImage} 
                              alt={product.name}
                              className={`w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 ${
                                hoverImage !== primaryImage ? 'group-hover:opacity-0' : ''
                              }`}
                              loading="lazy"
                            />
                            {hoverImage !== primaryImage && (
                              <img 
                                src={hoverImage} 
                                alt={`${product.name} alternate`}
                                className="absolute inset-0 w-full h-full object-cover object-top opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-hover:scale-105"
                                loading="lazy"
                              />
                            )}
                          </Link>

                          {/* Top Badges */}
                          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
                            {product.isNew && (
                              <span className="px-2 py-0.5 rounded-sm bg-[#4A1513] text-white text-[9.5px] font-bold tracking-wider uppercase">
                                New
                              </span>
                            )}
                            {product.discount > 0 && (
                              <span className="px-1.5 py-0.5 rounded-sm bg-white/95 text-[#4A1513] text-[9.5px] font-bold shadow-2xs backdrop-blur-xs">
                                {product.discount}% OFF
                              </span>
                            )}
                          </div>

                          {/* Wishlist Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleWishlist({
                                id: product.id,
                                name: product.name,
                                brand: product.brand,
                                price: product.price,
                                originalPrice: product.originalPrice,
                                image: primaryImage,
                                category: product.category,
                              });
                            }}
                            className="absolute top-2.5 right-2.5 z-10 w-7.5 h-7.5 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-stone-600 hover:text-rose-600 transition shadow-2xs cursor-pointer"
                            aria-label="Save to Wishlist"
                          >
                            <Heart 
                              size={15} 
                              className={isFavorited ? "fill-rose-600 text-rose-600" : "text-stone-600"} 
                            />
                          </button>

                          {/* Ready to ship pill */}
                          {product.readyToShip && (
                            <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-stone-800 text-[9px] font-semibold backdrop-blur-xs shadow-2xs">
                                <Truck size={10} className="text-[#4A1513]" />
                                Ready to ship
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-3 sm:p-4 flex flex-col flex-1">
                          {/* Brand / Boutique Name */}
                          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-400 truncate mb-0.5">
                            {product.vendorName || product.brand || "Little Diva Couture"}
                          </p>

                          {/* Product Title */}
                          <Link 
                            href={`/products/${product.slug || product.id}`}
                            className="text-xs sm:text-[13px] font-medium text-stone-800 hover:text-[#4A1513] transition line-clamp-1 mb-2"
                            title={product.name}
                          >
                            {product.name}
                          </Link>

                          {/* Pricing Row */}
                          <div className="mt-auto flex items-baseline gap-2">
                            <span className="text-xs sm:text-sm font-bold text-stone-900">
                              ₹{product.price.toLocaleString("en-IN")}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-[11px] text-stone-400 line-through">
                                ₹{product.originalPrice.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 5. Pagination / Load More Button */}
                {visibleCount < filteredProducts.length && (
                  <div className="mt-10 text-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount(prev => prev + 12)}
                      className="px-8 py-3 rounded-full bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-semibold tracking-wider uppercase transition shadow-xs active:scale-95 cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>Load More Products</span>
                      <ArrowRight size={14} />
                    </button>
                    <p className="text-xs text-stone-400 mt-2">
                      Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} items
                    </p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsFilterDrawerOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col p-6 z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <span className="font-serif text-lg font-bold text-stone-900">Filters</span>
              <button 
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1 rounded-full text-stone-500 hover:text-stone-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="py-6 space-y-6">
              {/* Subcategories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Category</h4>
                <div className="space-y-1.5 text-xs text-stone-600">
                  {GIRLS_SUBCATEGORIES.map(sub => (
                    <label key={sub.id} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="mobileGirlsCategory" 
                        checked={activeSubcategory === sub.id}
                        onChange={() => setActiveSubcategory(sub.id)}
                        className="accent-[#4A1513]"
                      />
                      <span>{sub.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Age / Size */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Age / Size</h4>
                <div className="flex flex-wrap gap-1.5">
                  {GIRLS_SIZES.map(sz => {
                    const isChecked = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSize(sz)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition ${
                          isChecked 
                            ? 'bg-[#4A1513] text-white border-[#4A1513]' 
                            : 'bg-stone-50 text-stone-700 border-stone-200'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Price Range</h4>
                <div className="space-y-1.5 text-xs text-stone-600">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under1500", label: "Under ₹1,500" },
                    { id: "1500to2500", label: "₹1,500 – ₹2,500" },
                    { id: "2500to4000", label: "₹2,500 – ₹4,000" },
                    { id: "above4000", label: "Above ₹4,000" },
                  ].map(p => (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="mobileGirlsPrice" 
                        checked={selectedPriceRange === p.id}
                        onChange={() => setSelectedPriceRange(p.id)}
                        className="accent-[#4A1513]"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-stone-200 flex gap-3">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-2 rounded-xl bg-[#4A1513] text-white text-xs font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
