"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, SlidersHorizontal, PackageX, ArrowRight } from 'lucide-react';
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

// Mock Subcategories based on user's request for "Women"
const SUBCATEGORIES = [
  { name: "Dresses", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=300&auto=format&fit=crop" },
  { name: "Kurtis", image: "https://images.unsplash.com/photo-1583391733958-d15ce1711202?q=80&w=300&auto=format&fit=crop" },
  { name: "Sarees", image: "https://images.unsplash.com/photo-1610189046647-7589d70081d1?q=80&w=300&auto=format&fit=crop" },
  { name: "Tops", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=300&auto=format&fit=crop" },
  { name: "Bottoms", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=300&auto=format&fit=crop" },
  { name: "Ethnic Wear", image: "https://images.unsplash.com/photo-1583391733975-23c21a1f46b4?q=80&w=300&auto=format&fit=crop" },
  { name: "Activewear", image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=300&auto=format&fit=crop" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=300&auto=format&fit=crop" },
];

export default function CategoryClient({ category, initialProducts, initialWishlistIds = [] }: any) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>(initialWishlistIds);
  
  const [searchQuery, setSearchQuery] = useState("");
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
    setSearchQuery("");
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p: any) => {
      if (searchQuery) {
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
  }, [searchQuery, filters, initialProducts]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (selectedSort) {
      case "Price: Low to High": return sorted.sort((a, b) => a.price - b.price);
      case "Price: High to Low": return sorted.sort((a, b) => b.price - a.price);
      case "Customer Popular": return sorted.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
      default: return sorted;
    }
  }, [filteredProducts, selectedSort]);

  const trendingProducts = useMemo(() => {
    return initialProducts.filter((p: any) => p.isTrending).slice(0, 4);
  }, [initialProducts]);

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
      
      {/* 1. Category Hero Banner */}
      <div className="relative h-[40vh] md:h-[50vh] bg-zinc-900 w-full overflow-hidden">
        <img 
          src={category.image} 
          alt={category.name} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-zinc-900/40"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <nav className="flex items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/70 mb-4 md:mb-6">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link href="/shop" className="hover:text-white transition">Categories</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-white">{category.name}</span>
          </nav>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-4 tracking-tight drop-shadow-md">
            {category.name}
          </h1>
          <p className="text-sm md:text-base text-zinc-200 max-w-xl mx-auto drop-shadow-sm">
            {category.description}
          </p>
        </div>
      </div>

      {/* 2. Subcategories Row */}
      <div className="py-12 md:py-16 bg-white border-b border-accent/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-8 text-center md:text-left">Shop by Category</h2>
          
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 md:gap-8 hide-scrollbar snap-x">
            {SUBCATEGORIES.map((sub, i) => (
              <Link 
                key={i} 
                href={`/shop?category=${encodeURIComponent(sub.name)}`}
                className="flex flex-col items-center gap-3 shrink-0 snap-start group"
              >
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 p-1 transition-all group-hover:border-primary group-hover:shadow-md">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img 
                      src={sub.image} 
                      alt={sub.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>
                <span className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-text-main group-hover:text-primary transition-colors text-center w-24">
                  {sub.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Trending Carousel */}
      {trendingProducts.length > 0 && (
        <div className="py-16 md:py-24 bg-[#fbf9f6] border-b border-accent/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-text-main mb-2">Trending in {category.name}</h2>
                <p className="text-text-muted text-sm">The most loved styles right now</p>
              </div>
              <Link href="#all-products" className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary hover:text-text-main transition-colors">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {trendingProducts.map((product: any) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isWishlisted={wishlist.includes(Number(product.id))}
                  onQuickAdd={handleQuickAdd}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. All Products with Filters */}
      <div id="all-products" className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-16 md:mt-24 flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
        
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
          
          <div className="mb-6 pb-6 border-b border-zinc-200">
            <h2 className="font-serif text-3xl text-text-main mb-2">All {category.name}</h2>
            <p className="text-sm text-text-muted">Discover our complete collection</p>
          </div>

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
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 text-accent">
                  <PackageX size={32} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl text-text-main mb-2">No products found</h3>
                <p className="text-text-muted max-w-[400px] mx-auto mb-8">
                  We couldn't find anything matching your current filters.
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

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
