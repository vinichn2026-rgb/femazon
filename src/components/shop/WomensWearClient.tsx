"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  SlidersHorizontal, 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  Store, 
  ChevronRight, 
  ArrowRight,
  Filter,
  X,
  Truck
} from 'lucide-react';
import { 
  WOMENS_WEAR_CATEGORIES, 
  WOMENS_WEAR_OCCASIONS,
  WomensWearCategory, 
  WomensWearProduct 
} from '@/data/womensWearData';
import { useFemazonStore } from '@/context/FemazonStoreContext';
import type { PartnerDirectoryListing } from '@/lib/partnerDirectory';
import { PageBanner } from '@/components/common/PageBanner';

interface WomensWearClientProps {
  initialProducts: WomensWearProduct[];
  boutiques: PartnerDirectoryListing[];
  boutiqueDirectoryError?: string | null;
  initialCategory?: string;
  initialSearch?: string;
  initialSubCategory?: string;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  sarees: ["saree", "sari"],
  "kurtas-kurta-sets": ["kurta", "kurti", "kurta set"],
  lehengas: ["lehenga"],
  "salwar-suits": ["salwar", "churidar", "palazzo suit"],
  anarkali: ["anarkali", "kalidar"],
  "sharara-gharara": ["sharara", "gharara"],
  "ethnic-dresses": ["ethnic dress", "indo-western", "kaftan"],
  "tops-shirts": ["top", "shirt", "tunic", "blouse"],
  dresses: ["dress", "gown", "maxi", "midi"],
  "co-ord-sets": ["co-ord", "coord"],
  "trousers-pants": ["trouser", "pant", "palazzo", "bottom", "culotte", "leggings"],
  skirts: ["skirt"],
  jumpsuits: ["jumpsuit", "romper"],
  jackets: ["jacket", "blazer", "shrug", "cape"],
  footwear: ["footwear", "jutti", "heel", "mule", "kolhapuri", "sandal"],
  handbags: ["handbag", "bag", "potli", "clutch", "tote", "sling"],
  jewellery: ["jewellery", "jewelry", "necklace", "choker", "earring", "jhumka", "bangle"],
  "fashion-accessories": ["accessory", "accessories", "dupatta", "stole", "belt"],
  "innerwear-loungewear": ["innerwear", "loungewear", "nightwear", "pajama", "sleepwear", "robe"],
};

function matchesCategory(product: WomensWearProduct, category: WomensWearCategory) {
  const productText = `${product.category} ${product.subCategory}`.toLowerCase();
  return (CATEGORY_KEYWORDS[category.id] || [category.name.toLowerCase()])
    .some((keyword) => productText.includes(keyword));
}

export function WomensWearClient({
  initialProducts,
  boutiques,
  boutiqueDirectoryError,
  initialCategory = "All",
  initialSearch = "",
  initialSubCategory = "",
}: WomensWearClientProps) {
  const { isInWishlist, toggleWishlist, addToCart } = useFemazonStore();

  const getCanonicalCategory = (catName: string) => {
    if (!catName || catName === "All") return "All";
    const found = WOMENS_WEAR_CATEGORIES.find(
      c => c.name.toLowerCase() === catName.toLowerCase() ||
           c.id.toLowerCase() === catName.toLowerCase() ||
           c.slug.toLowerCase() === catName.toLowerCase()
    );
    return found ? found.name : catName;
  };
  const getCanonicalSubCategory = (categoryName: string, subcategoryName: string) => {
    const category = WOMENS_WEAR_CATEGORIES.find((item) =>
      [item.name, item.id, item.slug].some((value) => value.toLowerCase() === getCanonicalCategory(categoryName).toLowerCase())
    );
    return category?.subcategories.find((subcategory) =>
      subcategory.toLowerCase() === subcategoryName.toLowerCase() ||
      subcategory.toLowerCase().replace(/[^a-z0-9]+/g, "-") === subcategoryName.toLowerCase()
    ) || "All";
  };

  const [selectedCategory, setSelectedCategory] = useState<string>(() => getCanonicalCategory(initialCategory || "All"));
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(() =>
    getCanonicalSubCategory(initialCategory, initialSubCategory)
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [selectedSort, setSelectedSort] = useState<string>("popular");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCollectionTab, setSelectedCollectionTab] = useState<"all" | "new" | "trending" | "ready">("all");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");
  const [onlyReadyToShip, setOnlyReadyToShip] = useState(false);
  const [selectedBoutique, setSelectedBoutique] = useState<string>("all");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const activeCategoryObj = useMemo(() => {
    if (!selectedCategory || selectedCategory === "All") return null;
    return WOMENS_WEAR_CATEGORIES.find(
      c => c.name.toLowerCase() === selectedCategory.toLowerCase() || 
           c.id.toLowerCase() === selectedCategory.toLowerCase() ||
           c.slug.toLowerCase() === selectedCategory.toLowerCase()
    ) || null;
  }, [selectedCategory]);

  const handleCategoryChange = (categoryName: string, scroll = true) => {
    const canonical = getCanonicalCategory(categoryName);
    setSelectedCategory(canonical);
    setSelectedSubCategory("All");
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (canonical === "All") {
        params.delete("category");
      } else {
        params.set("category", canonical);
      }
      params.delete("sub");
      const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
      window.history.replaceState({}, '', newUrl);

      if (scroll && canonical !== "All") {
        const el = document.getElementById("catalog-section");
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  const handleSubCategoryChange = (sub: string) => {
    setSelectedSubCategory(sub);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (sub === "All") {
        params.delete("sub");
      } else {
        const subcategory = activeCategoryObj?.subcategories.find((item) => item.toLowerCase() === sub.toLowerCase());
        params.set("sub", subcategory?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || sub);
      }
      const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  };

  const categoryCounts = useMemo(
    () => Object.fromEntries(
      WOMENS_WEAR_CATEGORIES.map((category) => [
        category.id,
        initialProducts.filter((product) => matchesCategory(product, category)).length,
      ])
    ),
    [initialProducts]
  );

  // Unique Boutiques / Sellers List
  const availableBoutiques = useMemo(() => {
    const list = Array.from(new Set(initialProducts.map(p => p.brand).filter(Boolean)));
    return list;
  }, [initialProducts]);

  // Unique Colors extracted from live catalog
  const availableColors = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of initialProducts) {
      for (const c of p.colors) {
        const trimmed = c.trim();
        if (trimmed) counts.set(trimmed, (counts.get(trimmed) || 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14)
      .map(([color]) => color);
  }, [initialProducts]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Category Filter
    if (selectedCategory && selectedCategory !== "All") {
      const selectedCategoryObj = WOMENS_WEAR_CATEGORIES.find(
        (category) => category.name.toLowerCase() === selectedCategory.toLowerCase()
      );
      if (selectedCategoryObj) {
        result = result.filter((product) => matchesCategory(product, selectedCategoryObj));
      }
    }

    // 1b. SubCategory Filter
    if (selectedSubCategory && selectedSubCategory !== "All") {
      result = result.filter(p => 
        p.subCategory.toLowerCase() === selectedSubCategory.toLowerCase() ||
        p.subCategory.toLowerCase().includes(selectedSubCategory.toLowerCase())
      );
    }

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.vendorName.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.colors.some(c => c.toLowerCase().includes(q))
      );
    }

    // 3. Price Filter
    if (selectedPriceRange !== "all") {
      if (selectedPriceRange === "under2500") result = result.filter(p => p.price < 2500);
      else if (selectedPriceRange === "2500to5000") result = result.filter(p => p.price >= 2500 && p.price <= 5000);
      else if (selectedPriceRange === "5000to15000") result = result.filter(p => p.price > 5000 && p.price <= 15000);
      else if (selectedPriceRange === "above15000") result = result.filter(p => p.price > 15000);
    }

    // 4. Boutique Filter
    if (selectedBoutique !== "all") {
      result = result.filter(p => p.brand === selectedBoutique);
    }

    // 5. Ready To Ship / Collection Tab Filter
    if (onlyReadyToShip || selectedCollectionTab === "ready") {
      result = result.filter(p => p.readyToShip);
    }
    if (selectedCollectionTab === "new") {
      result = result.filter(p => p.isNew);
    } else if (selectedCollectionTab === "trending") {
      result = result.filter(p => p.isTrending);
    }

    // 5b. Occasion Filter
    if (selectedOccasion !== "all") {
      const occasion = WOMENS_WEAR_OCCASIONS.find(o => o.id === selectedOccasion);
      if (occasion) {
        result = result.filter(p => {
          const text = `${p.name} ${p.category} ${p.subCategory} ${p.fabric} ${p.description}`.toLowerCase();
          return occasion.keywords.some(kw => text.includes(kw));
        });
      }
    }

    // 6. Sizes Filter
    if (selectedSizes.length > 0) {
      result = result.filter(p => 
        p.sizes.some(s => selectedSizes.some(sel => s.toLowerCase().includes(sel.toLowerCase())))
      );
    }

    // 6b. Colors Filter
    if (selectedColors.length > 0) {
      result = result.filter(p =>
        p.colors.some(c => selectedColors.some(sel => c.toLowerCase().includes(sel.toLowerCase())))
      );
    }

    // 7. Sort
    if (selectedSort === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (selectedSort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === "discount") {
      result.sort((a, b) => b.discount - a.discount);
    } else if (selectedSort === "newest") {
      result.sort((a, b) => (Date.parse(b.createdAt || "") || 0) - (Date.parse(a.createdAt || "") || 0));
    } else {
      // Default: popularity / trending
      result.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
    }

    return result;
  }, [
    selectedCategory,
    selectedSubCategory, 
    searchQuery, 
    selectedPriceRange, 
    selectedBoutique, 
    onlyReadyToShip, 
    selectedSizes, 
    selectedColors,
    selectedCollectionTab,
    selectedOccasion,
    selectedSort,
    initialProducts
  ]);

  const toggleSizeSelection = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColorSelection = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const clearAllFilters = () => {
    handleCategoryChange("All");
    setSelectedSubCategory("All");
    setSearchQuery("");
    setSelectedPriceRange("all");
    setSelectedBoutique("all");
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedCollectionTab("all");
    setSelectedOccasion("all");
    setOnlyReadyToShip(false);
    setSelectedSort("popular");
  };

  const hasActiveFilters = 
    selectedCategory !== "All" || 
    selectedSubCategory !== "All" ||
    searchQuery.trim() !== "" || 
    selectedPriceRange !== "all" || 
    selectedBoutique !== "all" || 
    selectedSizes.length > 0 || 
    selectedColors.length > 0 ||
    selectedCollectionTab !== "all" ||
    selectedOccasion !== "all" ||
    onlyReadyToShip;

  return (
    <div className="bg-[#FAF7F5] min-h-screen text-stone-900 font-sans pb-24">
      
      {/* 1. HERO BANNER: STANDARDIZED PAGE BANNER MATCHING SHOP REFERENCE */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <PageBanner
          title="Women's Wear"
          highlightText="Curated Collections"
          description="Discover authentic handloom sarees, designer kurtis, regal lehengas & western tailoring from verified independent boutiques."
          ctaText="Explore Collections"
          ctaLink="#catalog"
          imageSrc="/banners/hero_saree.jpg"
          fallbackImage="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=800"
          imageAlt="Women's Wear Collection"
        />
      </div>

      {/* 2. STICKY CATEGORY PILLS STRIP */}
      <section id="catalog-section" className="bg-white border-y border-stone-200/90 sticky top-[88px] md:top-[96px] z-30 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => handleCategoryChange("All")}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition cursor-pointer ${
                selectedCategory === "All"
                  ? 'bg-[#4A1513] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              All Clothing ({initialProducts.length})
            </button>
            {WOMENS_WEAR_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#4A1513] text-white font-bold shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {categoryCounts[cat.id] || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3b. ACTIVE SUBCATEGORY FILTER CHIPS */}
        {activeCategoryObj && activeCategoryObj.subcategories.length > 0 && (
          <div className="bg-[#F8F5F2] border-t border-stone-200/60 py-2.5 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1400px] mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 whitespace-nowrap mr-1">
                {activeCategoryObj.name} Edits:
              </span>
              <button
                onClick={() => handleSubCategoryChange("All")}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedSubCategory === "All"
                    ? 'bg-[#4A1513] text-white font-bold shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400'
                }`}
              >
                All {activeCategoryObj.name}
              </button>
              {activeCategoryObj.subcategories.map(sub => {
                const isSubSelected = selectedSubCategory.toLowerCase() === sub.toLowerCase();
                return (
                  <button
                    key={sub}
                    onClick={() => handleSubCategoryChange(sub)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                      isSubSelected
                        ? 'bg-[#4A1513] text-white font-bold shadow-xs'
                        : 'bg-white text-stone-700 border border-stone-200 hover:border-[#4A1513]'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 4. MAIN PRODUCT CATALOG + CONTROLS + FILTER SIDEBAR */}
      <section id="catalog-section" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Category Header & Breadcrumb Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
            <button 
              onClick={() => handleCategoryChange("All")}
              className="hover:underline hover:text-[#4A1513] cursor-pointer"
            >
              Women&apos;s Wear
            </button>
            <ChevronRight size={12} className="text-stone-400" />
            <span className={selectedCategory === "All" ? "font-semibold text-stone-800" : "font-semibold text-[#4A1513]"}>
              {selectedCategory === "All" ? "All Outfits" : selectedCategory}
            </span>
            {selectedSubCategory !== "All" && (
              <>
                <ChevronRight size={12} className="text-stone-400" />
                <span className="font-semibold text-stone-900 bg-stone-200/70 px-2 py-0.5 rounded-md text-[11px]">
                  {selectedSubCategory}
                </span>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                {selectedCategory === "All" ? "All Curated Women's Outfits" : `${selectedCategory} Collection`}
              </h2>
              {activeCategoryObj?.description && (
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
                  {activeCategoryObj.description}
                </p>
              )}
            </div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider shrink-0">
              {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"} Available
            </span>
          </div>
        </div>
        
        {/* New Arrivals / Trending / Ready to Ship Quick Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {[
            { id: "all", label: "All Styles" },
            { id: "new", label: "New Arrivals" },
            { id: "trending", label: "Trending Products" },
            { id: "ready", label: "Ready to Ship" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCollectionTab(tab.id as "all" | "new" | "trending" | "ready")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition cursor-pointer ${
                selectedCollectionTab === tab.id
                  ? "bg-[#4A1513] text-white shadow-xs"
                  : "bg-white text-stone-700 border border-stone-200 hover:border-[#4A1513]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4 mb-6">
          
          <div className="flex items-center gap-2">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold uppercase tracking-wider hover:bg-stone-200 transition"
            >
              <Filter size={15} />
              <span>Filters</span>
            </button>

            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Showing <strong className="text-stone-900">{filteredProducts.length}</strong> Products
            </span>
          </div>

          {/* Quick Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-[#4A1513] text-xs font-semibold border border-rose-200">
                  Category: {selectedCategory}
                  <button onClick={() => handleCategoryChange("All")} className="hover:text-red-700 p-0.5 cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedSubCategory !== "All" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200">
                  Edit: {selectedSubCategory}
                  <button onClick={() => handleSubCategoryChange("All")} className="hover:text-red-700 p-0.5 cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-[#4A1513] text-xs font-semibold border border-rose-200">
                  &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery("")} className="hover:text-red-700 p-0.5 cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedBoutique !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                  {selectedBoutique}
                  <button onClick={() => setSelectedBoutique("all")} className="hover:text-amber-900 p-0.5">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedColors.map((col) => (
                <span key={col} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-200">
                  Color: {col}
                  <button onClick={() => toggleColorSelection(col)} className="hover:text-red-700 p-0.5 cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              ))}
              {selectedOccasion !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-[#4A1513] text-xs font-semibold border border-rose-200">
                  Occasion: {WOMENS_WEAR_OCCASIONS.find(o => o.id === selectedOccasion)?.name || selectedOccasion}
                  <button onClick={() => setSelectedOccasion("all")} className="hover:text-red-700 p-0.5 cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}
              {onlyReadyToShip && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  Ready to Ship
                  <button onClick={() => setOnlyReadyToShip(false)} className="hover:text-emerald-900 p-0.5">
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:underline font-semibold ml-1 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Sort Selector */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-stone-500 hidden sm:inline">Sort By:</span>
            <div className="flex items-center gap-1.5 text-stone-700 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
              <SlidersHorizontal size={14} className="text-[#4A1513]" />
              <select
                value={selectedSort}
                onChange={e => setSelectedSort(e.target.value)}
                className="bg-transparent focus:outline-none text-xs text-stone-800 font-medium cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest Arrivals</option>
                <option value="rating">Customer Rating (Highest)</option>
                <option value="discount">Biggest Discount (%)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

        </div>

        {/* Layout Grid: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className={`lg:block ${isFilterDrawerOpen ? 'block' : 'hidden'} bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-6 sticky top-44`}>
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="font-serif text-lg font-bold text-stone-900">Refine Collection</span>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} className="text-xs text-[#4A1513] font-bold uppercase tracking-wider hover:underline">
                  Reset
                </button>
              )}
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3">
                Price (₹)
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { id: "all", label: "All Prices" },
                  { id: "under2500", label: "Under ₹2,500" },
                  { id: "2500to5000", label: "₹2,500 - ₹5,000" },
                  { id: "5000to15000", label: "₹5,000 - ₹15,000" },
                  { id: "above15000", label: "Luxury (Above ₹15,000)" },
                ].map(p => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer text-stone-600 hover:text-stone-900">
                    <input 
                      type="radio" 
                      name="priceRange" 
                      checked={selectedPriceRange === p.id} 
                      onChange={() => setSelectedPriceRange(p.id)}
                      className="accent-[#4A1513]"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sizes Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3">
                Size
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "Free Size"].map(size => {
                  const isChecked = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSizeSelection(size)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition cursor-pointer ${
                        isChecked 
                          ? 'bg-[#4A1513] text-white border-[#4A1513]' 
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colours Filter */}
            {availableColors.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3">
                  Colour
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {availableColors.map(color => {
                    const isChecked = selectedColors.includes(color);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => toggleColorSelection(color)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-full border transition cursor-pointer ${
                          isChecked
                            ? 'bg-[#4A1513] text-white border-[#4A1513]'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Boutique / Seller Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3">
                Verified Boutiques
              </h4>
              <select
                value={selectedBoutique}
                onChange={e => setSelectedBoutique(e.target.value)}
                className="w-full bg-stone-50 rounded-xl border border-stone-200 px-3 py-2 text-xs focus:outline-none focus:border-[#4A1513]"
              >
                <option value="all">All Verified Boutiques</option>
                {availableBoutiques.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Ready to Ship Toggle */}
            <div className="pt-2 border-t border-stone-100">
              <label className="flex items-center justify-between cursor-pointer text-xs">
                <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <Truck size={14} className="text-[#4A1513]" /> Express Ships (24-48h)
                </span>
                <input 
                  type="checkbox"
                  checked={onlyReadyToShip}
                  onChange={e => setOnlyReadyToShip(e.target.checked)}
                  className="w-4 h-4 accent-[#4A1513] rounded"
                />
              </label>
            </div>

          </aside>

          {/* PRODUCT CARDS LISTING GRID */}
          <div className="lg:col-span-3">
            
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                <div className="w-16 h-16 bg-rose-50 text-[#4A1513] rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                  {initialProducts.length === 0 ? "Women's Wear listings are on their way" : "No Matching Outfits Found"}
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                  {initialProducts.length === 0
                    ? "There are no approved products in this collection yet. Please check back soon."
                    : "We couldn&apos;t find items matching your search or filters. Try adjusting your filters or search terms."}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-[#4A1513] text-white rounded-full text-xs font-bold tracking-wider uppercase hover:bg-[#38100e] transition cursor-pointer"
                >
                  View All Outfits
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const isWish = isInWishlist(product.id);
                  const images = product.images.length > 0 
                    ? product.images 
                    : ["https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=800"];
                  const hasSecondaryImage = images.length > 1;

                  return (
                    <div 
                      key={product.id}
                      className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-xl hover:border-stone-300 transition duration-300"
                    >
                      {/* Media Area */}
                      <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                        <Link href={`/product/${product.slug || product.id}`} className="block w-full h-full">
                          <img 
                            src={images[0]} 
                            alt={product.name}
                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                              hasSecondaryImage ? 'group-hover:opacity-0' : ''
                            }`}
                          />
                          {hasSecondaryImage && (
                            <img 
                              src={images[1]} 
                              alt={`${product.name} Alternate`}
                              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-hover:scale-105"
                            />
                          )}
                        </Link>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
                          {product.readyToShip && (
                            <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-stone-900 text-[10px] font-bold shadow-xs backdrop-blur-xs flex items-center gap-1">
                              <Truck size={10} className="text-[#4A1513]" />
                              {product.deliveryDays ? `Ships in ${product.deliveryDays}d` : "Ready to ship"}
                            </span>
                          )}
                          {product.discount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-[#4A1513] text-white text-[10px] font-bold tracking-wider">
                              {product.discount}% OFF
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={() => toggleWishlist({
                            id: product.id,
                            name: product.name,
                            brand: product.brand,
                            price: product.price,
                            originalPrice: product.originalPrice,
                            image: images[0],
                            category: product.category
                          })}
                          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-600 hover:text-rose-600 transition shadow-xs cursor-pointer"
                        >
                          <Heart 
                            size={16} 
                            className={isWish ? "fill-rose-600 text-rose-600" : "text-stone-600"} 
                          />
                        </button>

                        {/* Quick Size Select Bar on Hover */}
                        {product.sizes.length > 0 && (
                          <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-xs p-2.5 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 border-t border-stone-200">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#4A1513] mb-1.5 text-center">
                              Quick Add · Select Size
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-1.5">
                              {product.sizes.map((sz) => (
                                <button
                                  key={sz}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    addToCart({
                                      productId: product.id,
                                      name: product.name,
                                      brand: product.brand,
                                      price: product.price,
                                      originalPrice: product.originalPrice,
                                      image: images[0],
                                      size: sz,
                                      color: product.colors[0] || "Standard",
                                      quantity: 1,
                                      category: product.category
                                    }, true);
                                  }}
                                  className="px-2 py-1 rounded-md text-[10px] font-bold bg-stone-100 hover:bg-[#4A1513] hover:text-white transition cursor-pointer"
                                >
                                  {sz}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Product Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        
                        <div>
                          {/* Boutique / Seller Info */}
                          <div className="flex items-center justify-between mb-1">
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-stone-600 truncate max-w-[80%]">
                              <Store size={12} className="text-[#4A1513] shrink-0" />
                              <span className="truncate">{product.brand}</span>
                            </span>
                            {product.reviewCount > 0 ? (
                              <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                                ★ {product.rating.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-stone-500">No reviews</span>
                            )}
                          </div>

                          {/* Product Title */}
                          <Link href={`/product/${product.slug || product.id}`}>
                            <h3 className="font-serif text-sm font-bold text-stone-900 group-hover:text-[#4A1513] transition line-clamp-1 mb-1">
                              {product.name}
                            </h3>
                          </Link>

                          <p className="text-[11px] text-stone-500 line-clamp-1 mb-2">
                            {product.fabric}
                          </p>
                        </div>

                        {/* Price & Action */}
                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between mt-auto">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-sans text-sm sm:text-base font-bold text-stone-900">
                                ₹{product.price.toLocaleString("en-IN")}
                              </span>
                              {product.originalPrice > product.price && (
                                <span className="font-sans text-xs text-stone-400 line-through">
                                  ₹{product.originalPrice.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-emerald-700 font-semibold block">
                              Femazon marketplace listing
                            </span>
                          </div>

                          <Link
                            href={`/product/${product.slug || product.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#4A1513]/40 text-[#4A1513] hover:bg-[#4A1513] hover:text-white transition text-xs font-bold uppercase tracking-wider"
                          >
                            <span>View</span>
                            <ArrowRight size={11} />
                          </Link>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </section>

    </div>
  );
}
