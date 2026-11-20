"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal, SearchX } from 'lucide-react';
import { FilterSidebar, FilterState } from '@/components/shop/FilterSidebar';
import { ShopControls } from '@/components/shop/ShopControls';
import { ActiveFilterChips } from '@/components/shop/ActiveFilterChips';
import { ProductCard, ProductCardSkeleton } from '@/components/shop/ProductCard';
import { PageBanner } from '@/components/common/PageBanner';
import type { PartnerDirectoryListing } from '@/lib/partnerDirectory';

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

interface SearchService {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  basePrice: number;
  image: string | null;
  providers: { id: number; name: string; rating: number; reviewCount: number }[];
}

export default function SearchClient({
  query,
  initialProducts,
  initialWishlistIds = [],
  serviceResults = [],
  partnerResults = [],
  partnerDirectoryError = null,
}: {
  query: string;
  initialProducts: any[];
  initialWishlistIds?: number[];
  serviceResults?: SearchService[];
  partnerResults?: PartnerDirectoryListing[];
  partnerDirectoryError?: string | null;
}) {
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
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 pt-2 sm:pt-3">
        {/* Standardized Luxury Page Banner */}
        <PageBanner
          title="Search Results"
          highlightText={query ? `"${query}"` : "Couture Catalog"}
          description="Explore curated couture, handcrafted accessories, and designer boutique pieces tailored to your search."
          ctaText="Explore Shop"
          ctaLink="/shop"
          imageSrc="/banners/hero_saree.jpg"
          imageAlt="Search Results"
          className="mb-4 sm:mb-6"
        />
      </div>

      {initialProducts.length === 0 && serviceResults.length === 0 && partnerResults.length === 0 ? (
        // Empty State
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
          <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-8 text-accent">
            <SearchX size={48} strokeWidth={1} />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-text-main mb-4">No marketplace results found</h2>
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
            categories={["All", "Dresses", "Ethnic", "Tops", "Co-ords", "Accessories", "Kurtis"]}
            selectedCategory="All"
            onSelectCategory={(c) => router.push(`/shop?category=${c}`)}
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
            {initialProducts.length === 0 ? null : isMounted ? (
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
            {partnerDirectoryError && (
              <p role="status" className="mx-auto mt-6 max-w-[1400px] px-4 text-sm text-amber-800 sm:px-6">
                {partnerDirectoryError}
              </p>
            )}

            {partnerResults.length > 0 && (
              <section className="mt-10 border-t border-stone-200 pt-8">
                <h2 className="mb-4 font-serif text-2xl font-bold text-stone-900">Boutiques &amp; professionals</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {partnerResults.map((partner) => (
                    <article key={partner.id} className="rounded-2xl border border-stone-200 bg-white p-5">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        Femazon approved {partner.type === "SELLER" ? "boutique" : "professional"}
                      </span>
                      <h3 className="mt-2 font-serif text-lg font-bold text-stone-900">{partner.businessName}</h3>
                      <p className="mt-1 text-xs text-stone-500">{[partner.categories, partner.location].filter(Boolean).join(" · ")}</p>
                      {partner.description && <p className="mt-3 line-clamp-2 text-sm text-stone-600">{partner.description}</p>}
                      <div className="mt-4 flex flex-wrap gap-3">
                        {partner.storeUrl ? (
                          <Link href={partner.storeUrl} className="text-xs font-semibold text-[#4A1513] underline underline-offset-2">Visit boutique</Link>
                        ) : (
                          <a href={`mailto:support@femazon.com?subject=${encodeURIComponent(`Femazon enquiry: ${partner.businessName}`)}`} className="text-xs font-semibold text-[#4A1513] underline underline-offset-2">Enquire with Femazon</a>
                        )}
                        {partner.portfolioUrl && <a href={partner.portfolioUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#4A1513] underline underline-offset-2">Portfolio</a>}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {serviceResults.length > 0 && (
              <section className="mt-10 border-t border-stone-200 pt-8">
                <h2 className="mb-4 font-serif text-2xl font-bold text-stone-900">Related services</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {serviceResults.map((service) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.slug}`}
                      className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-[#4A1513]/40 hover:shadow-md"
                    >
                      <span className="text-xs font-bold uppercase tracking-wider text-[#4A1513]">Service</span>
                      <h3 className="mt-2 font-serif text-lg font-bold text-stone-900">{service.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-stone-600">
                        {service.description || "View service details and listed providers."}
                      </p>
                      <p className="mt-3 text-xs text-stone-500">
                        {service.providers.length} provider{service.providers.length === 1 ? "" : "s"} listed
                        {service.basePrice > 0 ? ` · From ₹${service.basePrice.toLocaleString("en-IN")}` : ""}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
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
