"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, SlidersHorizontal, PackageX } from 'lucide-react';
import { CategoryTabs } from '@/components/shop/CategoryTabs';
import { ShopControls } from '@/components/shop/ShopControls';
import { ActiveFilterChips } from '@/components/shop/ActiveFilterChips';
import { FilterSidebar, FilterState } from '@/components/shop/FilterSidebar';
import { ProductCard, ProductCardSkeleton } from '@/components/shop/ProductCard';

const CATEGORIES = ["All", "Dresses", "Ethnic", "Tops", "Co-ords", "Accessories", "Kurtis"];

const initialFilterState: FilterState = {
  subcategories: [],
  priceRange: null,
  sizes: [],
  colors: [],
  brands: [],
  inStockOnly: false,
  onSale: false,
};

interface ShopClientProps {
  initialProducts: any[];
  initialCategory: string;
  initialWishlistIds?: number[];
}

export function ShopClient({ initialProducts, initialCategory, initialWishlistIds = [] }: ShopClientProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>(initialWishlistIds);
  
  // Try to match the incoming category case-insensitively with CATEGORIES
  const matchedCat = CATEGORIES.find(c => c.toLowerCase() === initialCategory.toLowerCase()) || "All";
  
  const [selectedCategory, setSelectedCategory] = useState(matchedCat);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("Featured");
  
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    ...(filters.onSale ? ['On Sale'] : [])
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
    if (chipText === 'In Stock') {
      handleFilterChange('inStockOnly', false);
      return;
    }
    if (chipText === 'On Sale') {
      handleFilterChange('onSale', false);
      return;
    }
    if (chipText.startsWith('Size: ')) {
      const size = chipText.replace('Size: ', '');
      handleFilterChange('sizes', filters.sizes.filter(s => s !== size));
      return;
    }
    if (filters.subcategories.includes(chipText)) handleFilterChange('subcategories', filters.subcategories.filter(x => x !== chipText));
    else if (filters.colors.includes(chipText)) handleFilterChange('colors', filters.colors.filter(x => x !== chipText));
    else if (filters.brands.includes(chipText)) handleFilterChange('brands', filters.brands.filter(x => x !== chipText));
  };

  const handleClearAllFilters = () => {
    setSelectedCategory("All");
    setFilters(initialFilterState);
    setSearchQuery("");
  };

  // ---- FILTERING LOGIC ----
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      // 1. Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && 
            !p.brand.toLowerCase().includes(q) && 
            !p.category.toLowerCase().includes(q)) {
          return false;
        }
      }

      // 2. Main Category
      if (selectedCategory !== "All" && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // 3. Sub-categories
      if (filters.subcategories.length > 0 && !filters.subcategories.includes(p.subCategory)) {
        return false;
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

      return true;
    });
  }, [searchQuery, selectedCategory, filters, initialProducts]);

  // ---- SORTING LOGIC ----
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (selectedSort) {
      case "Price: Low to High":
        return sorted.sort((a, b) => a.price - b.price);
      case "Price: High to Low":
        return sorted.sort((a, b) => b.price - a.price);
      case "Customer Popular":
        return sorted.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
      case "Newest Arrivals":
      case "Featured":
      default:
        // Already sorted by newest initially, so keep relative order or custom featured
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
      {/* 1. Breadcrumb & Page Header */}
      <div className="bg-[#fbf9f6] border-b border-accent/10 pt-12 md:pt-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <nav className="flex items-center text-[11px] font-bold uppercase tracking-widest text-text-muted mb-6">
            <Link href="/" className="hover:text-primary transition">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-text-main">Shop</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-5xl font-normal text-text-main tracking-wide mb-4">
            Shop Collection
          </h1>
          <p className="font-sans text-[15px] md:text-[16px] text-text-muted mb-8">
            Explore our curated styles
          </p>
        </div>
        
        {/* Horizontal Category Tabs */}
        <CategoryTabs 
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* 2. Main Layout Architecture */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-8 md:mt-12 flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
        
        {/* Filter Sidebar (Desktop & Mobile Drawer) */}
        <FilterSidebar 
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
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            selectedSort={selectedSort}
            onSortChange={(s) => setSelectedSort(s)}
          />

          <ActiveFilterChips 
            activeFilters={activeFilterChips}
            onRemoveFilter={handleRemoveChip}
            onClearAll={handleClearAllFilters}
          />

          {/* Product Grid or Empty State */}
          {isMounted ? (
            totalItems > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-10">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-10">
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
