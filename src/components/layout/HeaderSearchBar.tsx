"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Camera, 
  X, 
  Heart, 
  Zap, 
  ArrowRight, 
  Loader2 
} from "lucide-react";
import { useFemazonStore } from "@/context/FemazonStoreContext";
import { ImageSearchModal } from "@/components/shop/ImageSearchModal";

interface ProductPreview {
  id: number | string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  discountPercent?: number;
  image: string;
  brandName?: string;
  category?: string;
  silhouette?: string;
  readyToShip?: boolean;
}

interface SearchData {
  topSearches: { label: string; query: string }[];
  products: ProductPreview[];
  isSearch: boolean;
  totalCount?: number;
}

let sharedSearchCache: SearchData | null = null;
let sharedSearchPromise: Promise<SearchData | null> | null = null;

export function HeaderSearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const { isInWishlist, toggleWishlist } = useFemazonStore();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [data, setData] = useState<SearchData | null>(sharedSearchCache);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy-load initial top searches ONLY when user actually opens the search bar
  useEffect(() => {
    if (!isOpen || query.trim() || data) return;

    if (sharedSearchCache) {
      setData(sharedSearchCache);
      return;
    }

    if (!sharedSearchPromise) {
      sharedSearchPromise = fetch("/api/search")
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          sharedSearchCache = json;
          sharedSearchPromise = null;
          return json;
        })
        .catch(() => {
          sharedSearchPromise = null;
          return null;
        });
    }

    sharedSearchPromise.then((cached) => {
      if (cached) setData(cached);
    });
  }, [isOpen, query, data]);

  // Debounced live search when user enters a query
  useEffect(() => {
    if (!isOpen) return;

    if (!query.trim()) {
      if (sharedSearchCache) setData(sharedSearchCache);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const url = `/api/search?q=${encodeURIComponent(query.trim())}`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.warn("Live search error:", e);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  const handleChipClick = (chipQuery: string) => {
    setQuery(chipQuery);
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(chipQuery)}`);
  };

  const handleProductClick = (slugOrId: string | number) => {
    setIsOpen(false);
    router.push(`/shop/${slugOrId}`);
  };

  return (
    <>
      {/* Background Dim Backdrop when Search Dropdown is Open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/25 z-40 backdrop-blur-[1px] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div ref={containerRef} className={`relative w-full z-50 ${className}`}>
        {/* Search Input Bar (Aza Fashions Benchmark Style) */}
        <form 
          onSubmit={handleSubmit}
          className={`group relative w-full h-[44px] flex items-center px-4 rounded-sm transition-all duration-200 border shadow-[0_1px_4px_rgba(74,21,19,0.04)] ${
            isOpen 
              ? "bg-white border-[#4A1513] ring-2 ring-[#4A1513]/15" 
              : "border-[#4A1513]/25 hover:border-[#4A1513]/50 bg-[#4A1513]/[0.02] hover:bg-[#4A1513]/[0.04]"
          }`}
        >
          {/* Magnifying Glass Icon */}
          <Search 
            size={18} 
            className={`shrink-0 transition-colors ${
              isOpen ? "text-[#4A1513]" : "text-[#4A1513]/60 group-hover:text-[#4A1513]"
            }`} 
          />

          {/* Search Input Field */}
          <input 
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search for products, brands and more"
            className="w-full bg-transparent border-none focus:outline-none text-[13.5px] text-[#2B1311] px-3 placeholder:text-stone-400 font-normal"
          />

          {/* Right Action Icons: Loading / Clear + Divider + Image Search */}
          <div className="flex items-center gap-2.5 shrink-0 ml-auto">
            {isLoading && (
              <Loader2 size={15} className="animate-spin text-[#4A1513]/70" />
            )}

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-stone-400 hover:text-stone-700 p-0.5 rounded-full hover:bg-stone-100 transition cursor-pointer"
                aria-label="Clear query"
              >
                <X size={15} />
              </button>
            )}

            <div className="h-4 w-[1px] bg-stone-300/80" />

            {/* Image Search Button */}
            <button 
              type="button" 
              onClick={() => {
                setIsOpen(false);
                setIsImageSearchOpen(true);
              }}
              className="flex items-center gap-1.5 text-stone-600 hover:text-[#4A1513] hover:bg-[#4A1513]/10 px-2.5 py-1 rounded-sm transition-colors text-[12px] font-medium whitespace-nowrap cursor-pointer"
            >
              <Camera size={16} className="text-[#4A1513]" />
              <span className="hidden sm:inline">Image Search</span>
            </button>
          </div>
        </form>

        {/* Dropdown Popover Card (Identical to Aza Fashions Reference) */}
        {isOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-screen max-w-[920px] bg-white rounded-2xl shadow-2xl border border-stone-200/90 z-50 p-6 md:p-8 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
              
              {/* LEFT COLUMN: Top Searches */}
              <div className="w-full md:w-[250px] lg:w-[270px] shrink-0 border-b md:border-b-0 md:border-r border-stone-100 pb-5 md:pb-0 md:pr-6">
                <h3 className="text-[13px] font-semibold text-stone-500 uppercase tracking-wider mb-4">
                  Top Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(data?.topSearches || []).map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleChipClick(item.query)}
                      className="px-3.5 py-2 rounded-xl text-xs font-medium bg-stone-50/90 text-stone-700 border border-stone-200/90 hover:bg-[#4A1513]/5 hover:border-[#4A1513]/40 hover:text-[#4A1513] transition shadow-2xs text-left cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: Top Products / Live Search Results */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-serif font-medium text-[#2B1311]">
                    {query.trim() ? `Search Results for "${query}"` : "Top Products"}
                  </h3>
                  {query.trim() && data?.totalCount && data.totalCount > 3 ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="text-xs font-semibold text-[#4A1513] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View all ({data.totalCount})
                      <ArrowRight size={13} />
                    </button>
                  ) : null}
                </div>

                {/* Product Grid */}
                {data && data.products && data.products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.products.map((product) => {
                      const isFavorited = isInWishlist(product.id);
                      const displayPrice = product.discountPrice || product.price;

                      return (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product.slug || product.id)}
                          className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-stone-100 hover:border-stone-200/90 hover:shadow-md transition-all duration-300 cursor-pointer text-left"
                        >
                          {/* Image with Aspect Ratio and Wishlist Icon */}
                          <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />

                            {/* Wishlist Heart Icon Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist({
                                  id: product.id,
                                  name: product.name,
                                  brand: product.brandName,
                                  price: displayPrice,
                                  originalPrice: product.price,
                                  image: product.image,
                                  category: product.category,
                                });
                              }}
                              className={`absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 backdrop-blur-xs transition shadow-xs cursor-pointer ${
                                isFavorited 
                                  ? "text-rose-600 hover:text-rose-700" 
                                  : "text-stone-500 hover:text-[#4A1513]"
                              }`}
                              aria-label="Save to Wishlist"
                            >
                              <Heart 
                                size={15} 
                                className={isFavorited ? "fill-rose-600" : ""} 
                              />
                            </button>
                          </div>

                          {/* Product Info */}
                          <div className="p-3 flex flex-col flex-1">
                            {/* Tags / Badges */}
                            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                              <span className="text-[10px] font-medium tracking-tight px-1.5 py-0.5 rounded-sm bg-[#FAF0E6] text-[#7A3E2D]">
                                Femazon Exclusive
                              </span>
                              {product.readyToShip && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium tracking-tight px-1.5 py-0.5 rounded-sm bg-stone-100 text-stone-700">
                                  <Zap size={10} className="text-amber-600 fill-amber-600" />
                                  Ready to ship
                                </span>
                              )}
                            </div>

                            {/* Brand Name */}
                            <span className="text-[12px] font-semibold text-stone-900 truncate">
                              {product.brandName || "Femazon Luxe"}
                            </span>

                            {/* Product Title */}
                            <p className="text-[11.5px] text-stone-600 line-clamp-1 mt-0.5">
                              {product.name}
                            </p>

                            {/* Pricing Row */}
                            <div className="mt-2 flex items-baseline gap-2">
                              <span className="text-[13px] font-bold text-stone-900">
                                ₹{displayPrice.toLocaleString("en-IN")}
                              </span>
                              {product.discountPrice && product.discountPrice < product.price && (
                                <>
                                  <span className="text-[11px] text-stone-400 line-through">
                                    ₹{product.price.toLocaleString("en-IN")}
                                  </span>
                                  {product.discountPercent && product.discountPercent > 0 && (
                                    <span className="text-[11px] font-semibold text-[#B2382A]">
                                      {product.discountPercent}% OFF
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center text-stone-500">
                    <p className="text-sm">No products found matching &ldquo;{query}&rdquo;.</p>
                    <p className="text-xs text-stone-400 mt-1">Try checking your spelling or search for sarees, lehengas, or kurtas.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Footer Action when query entered */}
            {query.trim() && (
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  Press <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[11px]">Enter</kbd> to see all results
                </span>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-xs font-semibold uppercase tracking-wider text-[#4A1513] hover:text-[#2B1311] inline-flex items-center gap-1 cursor-pointer"
                >
                  View All Search Results
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Visual Image Search Modal */}
      <ImageSearchModal 
        isOpen={isImageSearchOpen} 
        onClose={() => setIsImageSearchOpen(false)} 
      />
    </>
  );
}
