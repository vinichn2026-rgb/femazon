"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Tag, 
  Sparkles, 
  Filter, 
  X, 
  Heart, 
  Truck, 
  ArrowRight,
  Package,
  Percent
} from 'lucide-react';
import { useFemazonStore } from '@/context/FemazonStoreContext';

export interface OfferProduct {
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
  createdAt: string;
}

interface OffersClientProps {
  initialProducts: OfferProduct[];
}

const DISCOUNT_TIERS = [
  { id: 0, label: "All Special Offers" },
  { id: 20, label: "20%+ OFF" },
  { id: 30, label: "30%+ OFF" },
  { id: 40, label: "40%+ OFF" },
  { id: 50, label: "Mega Savings (50%+)" },
];

export function OffersClient({ initialProducts }: OffersClientProps) {
  const { isInWishlist, toggleWishlist } = useFemazonStore();

  const [selectedDiscount, setSelectedDiscount] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("discount");
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Categories present in discounts
  const categories = useMemo(() => {
    const cats = new Set<string>();
    initialProducts.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Filter by min discount
    if (selectedDiscount > 0) {
      list = list.filter(p => p.discount >= selectedDiscount);
    }

    // Filter by category
    if (selectedCategory !== "all") {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Sorting
    if (selectedSort === "discount") {
      list.sort((a, b) => b.discount - a.discount);
    } else if (selectedSort === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (selectedSort === "newest") {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [initialProducts, selectedDiscount, selectedCategory, selectedSort]);

  const paginatedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#FAF7F5] pb-24 text-stone-900">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#3D1412] via-[#4A1513] to-[#5C1B19] text-white pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF0E6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-amber-200 mb-3 border border-white/15">
            <Percent size={13} className="text-amber-300" />
            <span>Exclusive Promotional Edits</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-3">
            Special Offers &amp; Markdowns
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
            Enjoy boutique sales, seasonal clearances, and special price reductions across curated Indian couture, girls&apos; festive collections, and luxury beauty.
          </p>
        </div>
      </section>

      {/* Discount Tiers Navigation Bar */}
      <nav aria-label="Discount Tiers" className="bg-white border-b border-stone-200 sticky top-14 sm:top-16 z-30 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3 py-3 overflow-x-auto no-scrollbar">
            {DISCOUNT_TIERS.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => {
                  setSelectedDiscount(tier.id);
                  setVisibleCount(12);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedDiscount === tier.id
                    ? "bg-[#4A1513] text-white shadow-xs"
                    : "bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 hover:border-[#4A1513]/40"
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Controls Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-stone-500 mr-1">Category:</span>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                selectedCategory === "all" ? "bg-[#4A1513] text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-[#4A1513] text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-stone-500 hidden sm:inline">Sort by:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4A1513] cursor-pointer"
            >
              <option value="discount">Highest Discount First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Markdowns</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {paginatedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
            <Package size={40} className="mx-auto text-stone-300 mb-3" />
            <h3 className="font-serif text-lg font-bold text-stone-800 mb-1">
              No promotional items in this tier
            </h3>
            <p className="text-xs text-stone-500 mb-4 max-w-sm mx-auto">
              Please choose a different discount tier or browse all special offers.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedDiscount(0);
                setSelectedCategory("all");
              }}
              className="px-5 py-2 rounded-full bg-[#4A1513] text-white text-xs font-semibold hover:bg-[#350B0A] transition cursor-pointer"
            >
              View All Offers
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {paginatedProducts.map((product) => {
                const isFavorited = isInWishlist(product.id);
                const primaryImage = product.images[0] || "/images/dress/placeholder.jpg";
                const hoverImage = product.images.length > 1 ? product.images[1] : primaryImage;
                const savings = product.originalPrice - product.price;

                return (
                  <div 
                    key={product.id}
                    className="group flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-lg transition duration-300 text-left"
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

                      {/* Discount Badge */}
                      <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                        <span className="px-2 py-0.5 rounded-sm bg-[#4A1513] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                          {product.discount}% OFF
                        </span>
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
                    </div>

                    {/* Product Info */}
                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                      <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-400 truncate mb-0.5">
                        {product.vendorName || product.brand || "Femazon Luxe"}
                      </p>

                      <Link 
                        href={`/products/${product.slug || product.id}`}
                        className="text-xs sm:text-[13px] font-medium text-stone-800 hover:text-[#4A1513] transition line-clamp-1 mb-2"
                        title={product.name}
                      >
                        {product.name}
                      </Link>

                      <div className="mt-auto flex items-baseline justify-between pt-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs sm:text-sm font-bold text-stone-900">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[11px] text-stone-400 line-through">
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-700">
                          Save ₹{savings.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredProducts.length && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="px-8 py-3 rounded-full bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-semibold tracking-wider uppercase transition shadow-xs active:scale-95 cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Load More Offers</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
