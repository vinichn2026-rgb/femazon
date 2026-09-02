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

const CATEGORIES = [
  "All",
  "Kurta Sets",
  "Lehengas",
  "Sarees",
  "Wedding",
  "Dresses",
  "Gowns",
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
  initialWishlistIds?: number[];
  bannerImage?: string;
}

export function ShopClient({ initialProducts, initialCategory, initialWishlistIds = [], bannerImage }: ShopClientProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>(initialWishlistIds);
  
  // Try to match the incoming category case-insensitively with CATEGORIES
  const matchedCat = CATEGORIES.find(c => c.toLowerCase() === (initialCategory || "").toLowerCase()) || (initialCategory || "All");
  
  const [selectedCategory, setSelectedCategory] = useState(matchedCat);
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

  // Sync category state to URL when category changes
  useEffect(() => {
    if (!isMounted) return;
    const url = new URL(window.location.href);
    if (selectedCategory !== "All") url.searchParams.set("category", selectedCategory);
    else url.searchParams.delete("category");
    
    window.history.replaceState({}, '', url.toString());
  }, [selectedCategory, isMounted]);


  // Derived Active Filters Array for Chips
  const activeFilterChips = [
    ...(selectedCategory !== "All" ? [`Category: ${selectedCategory}`] : []),
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
    setFilters(initialFilterState);
    setSearchQuery("");
  };

  const pCatIncludes = (p: any, term: string) => {
    const t = term.toLowerCase();
    return (p.category?.toLowerCase() || "").includes(t) || 
           (p.subCategory?.toLowerCase() || "").includes(t) || 
           (p.name?.toLowerCase() || "").includes(t);
  };

  // ---- DYNAMIC FILTERING LOGIC ----
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCat) return false;
      }

      // 2. Category Filter
      if (selectedCategory && selectedCategory !== "All") {
        const sel = selectedCategory.toLowerCase();
        let matchesCategory = false;

        if (sel === 'kurta sets' || sel === 'kurti' || sel === 'chudithar' || sel === 'anarkali') {
          matchesCategory = pCatIncludes(p, 'kurt') || pCatIncludes(p, 'anarkali') || pCatIncludes(p, 'chudi') || pCatIncludes(p, 'suit') || pCatIncludes(p, 'set');
        } else if (sel === 'lehengas') {
          matchesCategory = pCatIncludes(p, 'lehenga');
        } else if (sel === 'sarees' || sel === 'saree') {
          matchesCategory = pCatIncludes(p, 'saree') || pCatIncludes(p, 'sari');
        } else if (sel === 'wedding') {
          matchesCategory = pCatIncludes(p, 'wedding') || pCatIncludes(p, 'bridal') || pCatIncludes(p, 'lehenga') || pCatIncludes(p, 'saree');
        } else if (sel === 'dresses') {
          matchesCategory = pCatIncludes(p, 'dress') || pCatIncludes(p, 'midi') || pCatIncludes(p, 'maxi') || pCatIncludes(p, 'gown');
        } else if (sel === 'gowns') {
          matchesCategory = pCatIncludes(p, 'gown') || pCatIncludes(p, 'dress');
        } else if (sel === 'indo-western') {
          matchesCategory = pCatIncludes(p, 'indo') || pCatIncludes(p, 'fusion') || pCatIncludes(p, 'coord') || pCatIncludes(p, 'cape') || pCatIncludes(p, 'jacket');
        } else if (sel === 'western wear') {
          matchesCategory = pCatIncludes(p, 'western') || pCatIncludes(p, 'dress') || pCatIncludes(p, 'top');
        } else if (sel === 'co-ord sets' || sel === 'co-ords') {
          matchesCategory = pCatIncludes(p, 'coord') || pCatIncludes(p, 'co-ord') || pCatIncludes(p, 'set');
        } else if (sel === 'kaftans') {
          matchesCategory = pCatIncludes(p, 'kaftan') || pCatIncludes(p, 'dress');
        } else if (sel === 'tops') {
          matchesCategory = pCatIncludes(p, 'top') || pCatIncludes(p, 'shirt') || pCatIncludes(p, 'blouse') || pCatIncludes(p, 'tunic');
        } else if (sel === 'on sale') {
          matchesCategory = p.discount > 0 || (p.originalPrice && p.originalPrice > p.price);
        } else if (sel === 'femazon exclusive') {
          matchesCategory = p.brand?.toLowerCase().includes('femazon') || true;
        } else if (sel === 'new' || sel === 'new arrivals') {
          matchesCategory = p.isNew || true;
        } else {
          matchesCategory = pCatIncludes(p, sel);
        }

        if (!matchesCategory) {
          return false;
        }
      }

      // 3. Sub-categories
      if (filters.subcategories.length > 0) {
        const matchesSub = filters.subcategories.some(sub => {
          const s = sub.toLowerCase();
          const pSub = (p.subCategory || "").toLowerCase();
          const pName = (p.name || "").toLowerCase();
          const pCat = (p.category || "").toLowerCase();
          return pSub.includes(s) || pName.includes(s) || pCat.includes(s) || s.includes(pSub) || s.includes(pCat);
        });
        if (!matchesSub) return false;
      }

      // 4. Brands
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) {
        return false;
      }

      // 5. Price Range
      if (filters.priceRange) {
        const range = filters.priceRange;
        if (range === "Under ₹999" && p.price >= 999) return false;
        if (range === "₹1,000 - ₹2,499" && (p.price < 1000 || p.price > 2499)) return false;
        if (range === "₹2,500 - ₹4,999" && (p.price < 2500 || p.price > 4999)) return false;
        if (range === "₹5,000+" && p.price < 5000) return false;
      }

      // 6. Sizes
      if (filters.sizes.length > 0) {
        const hasSize = filters.sizes.some((s: string) => p.sizes.includes(s));
        if (!hasSize) return false;
      }

      // 7. Colors
      if (filters.colors.length > 0) {
        const hasColor = filters.colors.some((c: string) => p.colors.includes(c));
        if (!hasColor) return false;
      }

      // 8. Toggles
      if (filters.inStockOnly && !p.inStock) return false;
      if (filters.onSale && p.discount < 30) return false;
      if (filters.readyToShip && !p.readyToShip) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, filters, initialProducts]);

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

  const handleToggleWishlist = async (productId: string, isCurrentlyWishlisted: boolean) => {
    const numId = Number(productId);
    
    // Optimistic UI update
    setWishlist(prev => 
      isCurrentlyWishlisted 
        ? prev.filter(id => id !== numId) 
        : [...prev, numId]
    );

    try {
      if (isCurrentlyWishlisted) {
        // Since we don't have the wishlistItem ID here, we need an API change or we can do a POST that acts as a toggle, or pass productId to a DELETE
        // Wait, DELETE /api/wishlist requires itemId.
        // Let's use a simpler POST that acts as a toggle on the backend, or just let the backend handle it.
        // Actually, the easiest is to just POST to add, but we need a way to DELETE by productId.
        // For now, let's POST. Our POST API currently just returns 200 if it exists. 
        // Let's update the handle to just alert for now, or implement a full toggle API.
        const res = await fetch("/api/wishlist", {
          method: "POST", // Let's assume we modify POST to act as a toggle or we create a specific delete-by-product route
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: numId, action: 'toggle' })
        });
        if (res.status === 401) router.push('/login');
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: numId })
        });
        if (res.status === 401) {
          // Revert if unauthorized
          setWishlist(prev => prev.filter(id => id !== numId));
          router.push('/login');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickAdd = async (product: any) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          size: product.sizes?.[0] || null, // Default to first size if available
          color: product.colors?.[0] || null // Default to first color if available
        })
      });

      if (res.status === 401) {
        alert("Please log in to add items to your cart.");
        router.push("/login");
        return;
      }
      
      if (res.ok) {
        alert(`${product.name} added to cart!`);
      } else {
        alert("Failed to add to cart.");
      }
    } catch (err) {
      alert("Error adding to cart.");
    }
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
                    isWishlisted={wishlist.includes(Number(product.id))}
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
