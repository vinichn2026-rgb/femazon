"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, SlidersHorizontal, PackageX } from 'lucide-react';

import { ShopControls } from '@/components/shop/ShopControls';
import { ActiveFilterChips } from '@/components/shop/ActiveFilterChips';
import { FilterSidebar, FilterState } from '@/components/shop/FilterSidebar';
import { ProductCard, ProductCardSkeleton } from '@/components/shop/ProductCard';
import { LuxuryPromoBanner } from '@/components/shop/LuxuryPromoBanner';
import { useFemazonStore } from '@/context/FemazonStoreContext';

const CATEGORIES = [
  "All",
  "Kurta Sets",
  "Lehengas",
  "Sarees",
  "Wedding",
  "Dresses",
  "Gowns",
  "Handbags",
  "Potlis",
  "Footwear",
  "Shawls",
  "Hair Accessories",
  "Stoles & Scarves",
  "Belts",
  "Indo-Western",
  "Western Wear",
  "Co-ord Sets",
  "Kaftans",
  "Tops",
  "Femazon Exclusive",
  "On Sale",
  "New Arrivals"
];

const initialFilterState: FilterState = {
  silhouettes: [],
  subcategories: [],
  priceRange: null,
  sizes: [],
  colors: [],
  brands: [],
  inStockOnly: false,
  onSale: false,
  readyToShip: false,
};

interface ShopClientProps {
  initialProducts: any[];
  initialCategory: string;
  initialSilhouette?: string;
  initialWishlistIds?: number[];
  bannerImage?: string;
}

export function ShopClient({ 
  initialProducts, 
  initialCategory, 
  initialSilhouette = "All",
  initialWishlistIds = [], 
  bannerImage 
}: ShopClientProps) {
  const router = useRouter();
  const { isInWishlist, toggleWishlist, addToCart } = useFemazonStore();
  const [isMounted, setIsMounted] = useState(false);
  
  // Match incoming category case-insensitively
  const matchedCat = CATEGORIES.find(c => c.toLowerCase() === (initialCategory || "").toLowerCase()) || (initialCategory || "All");
  
  const [selectedCategory, setSelectedCategory] = useState(matchedCat);
  const [selectedSilhouette, setSelectedSilhouette] = useState(initialSilhouette || "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("Recommended");
  
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update selectedCategory whenever initialCategory prop changes
  useEffect(() => {
    if (initialCategory) {
      const match = CATEGORIES.find(c => c.toLowerCase() === initialCategory.toLowerCase()) || initialCategory;
      setSelectedCategory(match);
    }
  }, [initialCategory]);

  // Update selectedSilhouette whenever initialSilhouette prop changes
  useEffect(() => {
    if (initialSilhouette) {
      setSelectedSilhouette(initialSilhouette);
    }
  }, [initialSilhouette]);

  // Sync category and silhouette states to URL query params
  useEffect(() => {
    if (!isMounted) return;
    const url = new URL(window.location.href);
    if (selectedCategory !== "All") url.searchParams.set("category", selectedCategory);
    else url.searchParams.delete("category");
    
    if (selectedSilhouette !== "All") url.searchParams.set("silhouette", selectedSilhouette);
    else url.searchParams.delete("silhouette");

    window.history.replaceState({}, '', url.toString());
  }, [selectedCategory, selectedSilhouette, isMounted]);

  // Derived Active Filters Array for Chips
  const activeFilterChips = [
    ...(selectedCategory !== "All" ? [`Category: ${selectedCategory}`] : []),
    ...(selectedSilhouette !== "All" ? [`Silhouette: ${selectedSilhouette}`] : []),
    ...(filters.silhouettes || []).map(s => `Silhouette: ${s}`),
    ...filters.subcategories,
    ...(filters.priceRange ? [filters.priceRange] : []),
    ...filters.sizes.map(s => `Size: ${s}`),
    ...filters.colors,
    ...filters.brands,
    ...(filters.inStockOnly ? ['In Stock'] : []),
    ...(filters.onSale ? ['On Sale'] : []),
    ...(filters.readyToShip ? ['Ready to Ship'] : [])
  ];

  const handleFilterChange = (type: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleRemoveChip = (chipText: string) => {
    if (chipText.startsWith('Category: ')) {
      setSelectedCategory("All");
      return;
    }
    if (chipText.startsWith('Silhouette: ')) {
      const sil = chipText.replace('Silhouette: ', '');
      if (selectedSilhouette === sil) setSelectedSilhouette("All");
      handleFilterChange('silhouettes', (filters.silhouettes || []).filter(s => s !== sil));
      return;
    }
    if (chipText === filters.priceRange) {
      handleFilterChange('priceRange', null);
      return;
    }
    if (chipText.startsWith('Size: ')) {
      const sz = chipText.replace('Size: ', '');
      handleFilterChange('sizes', filters.sizes.filter(s => s !== sz));
      return;
    }
    if (filters.subcategories.includes(chipText)) {
      handleFilterChange('subcategories', filters.subcategories.filter(s => s !== chipText));
      return;
    }
    if (filters.colors.includes(chipText)) {
      handleFilterChange('colors', filters.colors.filter(c => c !== chipText));
      return;
    }
    if (filters.brands.includes(chipText)) {
      handleFilterChange('brands', filters.brands.filter(b => b !== chipText));
      return;
    }
    if (chipText === 'In Stock') handleFilterChange('inStockOnly', false);
    if (chipText === 'On Sale') handleFilterChange('onSale', false);
    if (chipText === 'Ready to Ship') handleFilterChange('readyToShip', false);
  };

  const handleClearAllFilters = () => {
    setSelectedCategory("All");
    setSelectedSilhouette("All");
    setFilters(initialFilterState);
    setSearchQuery("");
  };

  // ---- STRICT DRESS CATEGORY & SILHOUETTE FILTERING LOGIC ----
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      // 0. Safety Check: Exclude unapproved or flagged products
      if (p.flaggedForReview) return false;

      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand?.toLowerCase().includes(q);
        const matchesCat = p.category?.toLowerCase().includes(q);
        const matchesSil = (p.silhouette || '').toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCat && !matchesSil) return false;
      }

      // 2. Strict Category Filter
      if (selectedCategory && selectedCategory !== "All") {
        const selCat = selectedCategory.toLowerCase().trim();
        const prodCat = (p.category || "").toLowerCase().trim();

        if (selCat === "on sale") {
          if (!(p.discount > 0 || (p.originalPrice && p.originalPrice > p.price))) return false;
        } else if (selCat === "new arrivals" || selCat === "new") {
          if (!p.isNew) return false;
        } else if (selCat === "femazon exclusive") {
          if (!p.brand?.toLowerCase().includes("femazon") && !p.brand?.toLowerCase().includes("nagla")) return false;
        } else if (selCat === "wedding") {
          const isWeddingOccasion = (p.occasion || "").toLowerCase() === "wedding";
          if (!isWeddingOccasion && prodCat !== "lehengas" && prodCat !== "sarees") return false;
        } else {
          // Exact, strict category matching
          if (prodCat !== selCat) {
            return false;
          }
        }
      }

      // 3. Strict Silhouette Filter (AND logic with Category)
      const activeSilhouettes = [
        ...(selectedSilhouette && selectedSilhouette !== "All" ? [selectedSilhouette] : []),
        ...(filters.silhouettes || [])
      ].map(s => s.toLowerCase().trim());

      if (activeSilhouettes.length > 0) {
        const prodSil = (p.silhouette || "").toLowerCase().trim();
        const matchesSilhouette = activeSilhouettes.some(sil => prodSil === sil);
        if (!matchesSilhouette) return false;
      }

      // 4. Sub-categories
      if (filters.subcategories.length > 0) {
        const matchesSub = filters.subcategories.some(sub => {
          const s = sub.toLowerCase().trim();
          const pSub = (p.subCategory || "").toLowerCase().trim();
          const pSil = (p.silhouette || "").toLowerCase().trim();
          return pSub === s || pSil === s || pSub.includes(s) || s.includes(pSub);
        });
        if (!matchesSub) return false;
      }

      // 5. Brands / Designers
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) {
        return false;
      }

      // 6. Price Range
      if (filters.priceRange) {
        const range = filters.priceRange;
        if (range === "Under ₹999" && p.price >= 999) return false;
        if (range === "₹1,000 - ₹2,499" && (p.price < 1000 || p.price > 2499)) return false;
        if (range === "₹2,500 - ₹4,999" && (p.price < 2500 || p.price > 4999)) return false;
        if (range === "₹5,000+" && p.price < 5000) return false;
      }

      // 7. Sizes
      if (filters.sizes.length > 0) {
        const hasSize = filters.sizes.some((s: string) => p.sizes?.includes(s));
        if (!hasSize) return false;
      }

      // 8. Colors
      if (filters.colors.length > 0) {
        const hasColor = filters.colors.some((c: string) => p.colors?.includes(c));
        if (!hasColor) return false;
      }

      // 9. Stock / Sale / Shipping Toggles
      if (filters.inStockOnly && !p.inStock) return false;
      if (filters.onSale && p.discount < 30) return false;
      if (filters.readyToShip && !p.readyToShip) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, selectedSilhouette, filters, initialProducts]);

  // ---- SORTING LOGIC ----
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (selectedSort) {
      case "Price Low to High":
      case "Price: Low to High":
        return sorted.sort((a, b) => a.price - b.price);
      case "Price High to Low":
      case "Price: High to Low":
        return sorted.sort((a, b) => b.price - a.price);
      case "Discount High to Low":
        return sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      case "Popularity":
      case "Customer Popular":
        return sorted.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
      case "New Arrivals":
      case "Newest Arrivals":
      case "Recommended":
      case "Featured":
      default:
        return sorted;
    }
  }, [filteredProducts, selectedSort]);

  const handleToggleWishlist = (productId: string) => {
    const target = initialProducts.find(p => String(p.id) === String(productId));
    if (target) {
      toggleWishlist({
        id: target.id,
        name: target.name,
        brand: target.brand,
        price: target.price,
        originalPrice: target.originalPrice,
        image: target.image,
        category: target.category,
      });
    }
  };

  const handleQuickAdd = (product: any) => {
    addToCart({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      size: product.sizes?.[0] || 'M',
      color: product.colors?.[0] || 'Standard',
      quantity: 1,
      category: product.category,
    }, true);
  };

  const totalItems = sortedProducts.length;

  return (
    <div className="bg-surface min-h-screen text-text-main font-sans pb-24">
      {/* Luxury Burgundy & Gold Promo Banner */}
      <LuxuryPromoBanner />

      {/* 2. Main Layout Architecture */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 pt-4 md:pt-6 flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
        
        {/* Filter Sidebar (Desktop & Mobile Drawer) */}
        <FilterSidebar 
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={(c) => {
            setSelectedCategory(c);
          }}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAllFilters}
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
        />

        {/* Right Main Section */}
        <div className="flex-1 w-full min-w-0 flex flex-col">
          
          {/* Top Control Bar & Active Filters */}
          <ShopControls 
            totalItems={totalItems}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            selectedSort={selectedSort}
            onSortChange={(s) => setSelectedSort(s)}
            filters={filters}
            onFilterChange={handleFilterChange}
            onOpenMobileFilters={() => setIsFilterDrawerOpen(true)}
          />

          <ActiveFilterChips 
            activeFilters={activeFilterChips}
            onRemoveFilter={handleRemoveChip}
            onClearAll={handleClearAllFilters}
          />

          {/* Product Grid or Empty State */}
          {isMounted ? (
            totalItems > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
                {sortedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isWishlisted={isInWishlist(product.id)}
                    onQuickAdd={handleQuickAdd}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-[#fbf9f6] border border-accent/10 rounded-2xl flex-1">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 text-accent">
                  <PackageX size={32} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl text-text-main mb-2">No products found</h3>
                <p className="text-text-muted max-w-[400px] mx-auto mb-8">
                  We couldn't find anything matching your current filters. Try adjusting your search or clearing your filters to see more results.
                </p>
                <button 
                  onClick={handleClearAllFilters}
                  className="bg-text-main text-white font-bold text-[12px] uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg hover:bg-primary transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
              {Array.from({ length: 8 }).map((_, idx) => <ProductCardSkeleton key={idx} />)}
            </div>
          )}
          
        </div>
      </div>

      {/* Mobile Floating Filter Button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={() => setIsFilterDrawerOpen(true)}
          className="flex items-center gap-2 bg-text-main text-white px-8 py-3.5 rounded-full shadow-xl font-bold text-[12px] uppercase tracking-widest hover:bg-primary transition-colors"
        >
          <SlidersHorizontal size={16} />
          Filter & Sort
        </button>
      </div>

    </div>
  );
}
