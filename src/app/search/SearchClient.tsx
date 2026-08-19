"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal, SearchX, ArrowRight, Search } from 'lucide-react';
import { FilterSidebar, FilterState } from '@/components/shop/FilterSidebar';
import { ShopControls } from '@/components/shop/ShopControls';
import { ActiveFilterChips } from '@/components/shop/ActiveFilterChips';
import { ProductCard, ProductCardSkeleton } from '@/components/shop/ProductCard';

const initialFilterState: FilterState = {
  subcategories: [],
  priceRange: null,
  sizes: [],
  colors: [],
  brands: [],
  inStockOnly: false,
  onSale: false,
};

export default function SearchClient({ query, initialProducts, initialWishlistIds = [] }: any) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>(initialWishlistIds);
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [selectedSort, setSelectedSort] = useState("Featured");
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFilterChange = (type: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleRemoveChip = (chipText: string) => {
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
    setFilters(initialFilterState);
    setSearchQuery(query);
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p: any) => {
      if (searchQuery && searchQuery !== query) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
      }
      if (filters.subcategories.length > 0 && !filters.subcategories.includes(p.subCategory)) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
      if (filters.priceRange) {
        const range = filters.priceRange;
        if (range === "Under ₹999" && p.price >= 999) return false;
        if (range === "₹1,000 - ₹2,499" && (p.price < 1000 || p.price > 2499)) return false;
        if (range === "₹2,500 - ₹4,999" && (p.price < 2500 || p.price > 4999)) return false;
        if (range === "₹5,000+" && p.price < 5000) return false;
      }
      if (filters.sizes.length > 0) {
        const hasSize = filters.sizes.some((s: string) => p.sizes.includes(s));
        if (!hasSize) return false;
      }
      if (filters.colors.length > 0) {
        const hasColor = filters.colors.some((c: string) => p.colors.includes(c));
        if (!hasColor) return false;
      }
      if (filters.inStockOnly && !p.inStock) return false;
      if (filters.onSale && p.discount < 30) return false;
      return true;
    });
  }, [searchQuery, query, filters, initialProducts]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (selectedSort) {
      case "Price: Low to High": return sorted.sort((a, b) => a.price - b.price);
      case "Price: High to Low": return sorted.sort((a, b) => b.price - a.price);
      case "Customer Popular": return sorted.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
      default: return sorted;
    }
  }, [filteredProducts, selectedSort]);

  const activeFilterChips = [
    ...filters.subcategories,
    ...(filters.priceRange ? [filters.priceRange] : []),
    ...filters.sizes.map(s => `Size: ${s}`),
    ...filters.colors,
    ...filters.brands,
    ...(filters.inStockOnly ? ['In Stock'] : []),
    ...(filters.onSale ? ['On Sale'] : [])
  ];

  const handleToggleWishlist = async (productId: string, isCurrentlyWishlisted: boolean) => {
    const numId = Number(productId);
    setWishlist(prev => isCurrentlyWishlisted ? prev.filter(id => id !== numId) : [...prev, numId]);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: numId, action: isCurrentlyWishlisted ? 'toggle' : undefined })
      });
      if (res.status === 401) router.push('/login');
    } catch (err) {}
  };

  const handleQuickAdd = async (product: any) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          size: product.sizes?.[0] || null,
          color: product.colors?.[0] || null
        })
      });
      if (res.status === 401) {
        alert("Please log in to add items to your cart.");
        router.push("/login");
        return;
      }
      if (res.ok) alert(`${product.name} added to cart!`);
      else alert("Failed to add to cart.");
    } catch (err) {
      alert("Error adding to cart.");
    }
  };

  const totalItems = sortedProducts.length;

  return (
    <div className="bg-surface min-h-screen text-text-main font-sans pb-24">
      
      {/* Search Header */}
      <div className="bg-[#fbf9f6] border-b border-accent/10 pt-12 md:pt-16 pb-8">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
              <Search size={24} />
            </div>
            <div>
              <p className="font-sans text-[13px] font-bold tracking-widest uppercase text-text-muted mb-1">Search Results</p>
              <h1 className="font-serif text-3xl md:text-5xl font-normal text-text-main">
                "{query}"
              </h1>
            </div>
          </div>
          <p className="text-zinc-500 mt-2">{initialProducts.length} items matched your search.</p>
        </div>
      </div>

      {initialProducts.length === 0 ? (
        // Empty State
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
          <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-8 text-accent">
            <SearchX size={48} strokeWidth={1} />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-text-main mb-4">No products found</h2>
          <p className="text-zinc-500 mb-10 max-w-md mx-auto">
            We couldn't find any matches for "{query}". Try checking your spelling or searching for a broader term.
          </p>
          
          <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm text-left">
            <h3 className="font-bold text-sm uppercase tracking-widest text-text-main mb-6">Popular Searches</h3>
            <div className="flex flex-wrap gap-3">
              {['Dresses', 'Kurtis', 'Tops', 'Floral', 'Summer Collection', 'Handbags'].map(term => (
                <Link 
                  key={term}
                  href={`/search?q=${term}`}
                  className="px-6 py-2.5 rounded-full bg-zinc-50 border border-zinc-200 text-sm font-medium hover:border-primary hover:text-primary transition"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Main Search Results Layout
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-8 md:mt-12 flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
          
          {/* Filter Sidebar */}
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

            {/* Product Grid */}
            {isMounted ? (
              totalItems > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-10">
                  {sortedProducts.map((product: any) => (
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
                  <h3 className="font-serif text-2xl text-text-main mb-2">No items match your filters</h3>
                  <p className="text-text-muted max-w-[400px] mx-auto mb-8">
                    Try adjusting your filters to see more results.
                  </p>
                  <button 
                    onClick={handleClearAllFilters}
                    className="bg-text-main text-white font-bold text-[12px] uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg hover:bg-primary transition-colors"
                  >
                    Clear Filters
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
      )}

      {/* Mobile Floating Filter Button */}
      {initialProducts.length > 0 && (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <button 
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2 bg-text-main text-white px-8 py-3.5 rounded-full shadow-xl font-bold text-[12px] uppercase tracking-widest hover:bg-primary transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filter & Sort
          </button>
        </div>
      )}
    </div>
  );
}
