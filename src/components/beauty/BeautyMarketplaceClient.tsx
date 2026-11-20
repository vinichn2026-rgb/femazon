"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Sparkles, SlidersHorizontal, UserCheck } from "lucide-react";
import {
  BEAUTY_PRODUCT_SUBCATEGORIES,
  type MarketplaceCategory,
  type MarketplaceProfessional,
} from "@/data/marketplaceData";
import type { ProductType } from "@/data/products";
import { ServiceCategoryLanding } from "@/components/category/ServiceCategoryLanding";
import { ProductCard } from "@/components/shop/ProductCard";
import { useFemazonStore } from "@/context/FemazonStoreContext";

interface BeautyMarketplaceClientProps {
  category: MarketplaceCategory;
  professionals: MarketplaceProfessional[];
  beautyProducts: ProductType[];
  directoryError?: string | null;
  productError?: string | null;
  initialView?: "products" | "professionals";
  initialSubcategory?: string;
}

export function BeautyMarketplaceClient({
  category,
  professionals,
  beautyProducts,
  directoryError,
  productError,
  initialView = "professionals",
  initialSubcategory,
}: BeautyMarketplaceClientProps) {
  const { isInWishlist, toggleWishlist, addToCart } = useFemazonStore();
  const [activeView, setActiveView] = useState<"products" | "professionals">(initialView);
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>(
    initialView === "products" && initialSubcategory ? initialSubcategory : "all"
  );
  const [productSearch, setProductSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const handleViewChange = (view: "products" | "professionals") => {
    setActiveView(view);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("view", view);
      url.searchParams.delete("sub");
      window.history.replaceState({}, "", url.toString());
    }
  };

  const filteredProducts = useMemo(() => {
    let list = [...beautyProducts];

    if (selectedProductCategory !== "all") {
      const sub = BEAUTY_PRODUCT_SUBCATEGORIES.find(
        (item) =>
          item.slug === selectedProductCategory.toLowerCase() ||
          item.name.toLowerCase() === selectedProductCategory.toLowerCase()
      );
      const targetName = (sub?.name || selectedProductCategory).toLowerCase();
      list = list.filter((p) => {
        const text = `${p.category} ${p.subCategory || ""} ${p.name}`.toLowerCase();
        return text.includes(targetName);
      });
    }

    if (productSearch.trim()) {
      const q = productSearch.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(q))
      );
    }

    if (priceFilter === "under500") list = list.filter((p) => p.price < 500);
    else if (priceFilter === "500to1500") list = list.filter((p) => p.price >= 500 && p.price <= 1500);
    else if (priceFilter === "above1500") list = list.filter((p) => p.price > 1500);

    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => b.reviewCount - a.reviewCount);

    return list;
  }, [beautyProducts, selectedProductCategory, productSearch, priceFilter, sortBy]);

  return (
    <div className="bg-[#FAF7F5]">
      {/* Separate Discovery Experience Switcher */}
      <div className="sticky top-[88px] md:top-[96px] z-30 border-b border-stone-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#4A1513]" />
            <span className="font-serif text-sm font-bold text-stone-900 sm:text-base">
              Beauty &amp; Self-care
            </span>
          </div>

          <div
            role="tablist"
            aria-label="Beauty discovery mode"
            className="inline-flex rounded-full bg-stone-100 p-1 border border-stone-200"
          >
            <button
              role="tab"
              aria-selected={activeView === "products"}
              type="button"
              onClick={() => handleViewChange("products")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition cursor-pointer ${
                activeView === "products"
                  ? "bg-[#4A1513] text-white shadow-xs"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            >
              <ShoppingBag size={14} />
              <span>1. Beauty Products ({beautyProducts.length})</span>
            </button>
            <button
              role="tab"
              aria-selected={activeView === "professionals"}
              type="button"
              onClick={() => handleViewChange("professionals")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition cursor-pointer ${
                activeView === "professionals"
                  ? "bg-[#4A1513] text-white shadow-xs"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            >
              <UserCheck size={14} />
              <span>2. Beauty Professionals &amp; Services ({professionals.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeView === "professionals" ? (
        <ServiceCategoryLanding
          category={category}
          professionals={professionals}
          directoryError={directoryError}
          initialSubcategory={initialSubcategory}
        />
      ) : (
        <div className="min-h-screen pb-20">
          {/* Beauty Products Hero */}
          <section className="relative w-full bg-[#4A1513] text-white overflow-hidden py-14 sm:py-16">
            <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop"
                alt="Beauty Products"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#38100e] via-[#4A1513]/90 to-transparent z-0" />
            <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-bold tracking-widest uppercase mb-3">
                <ShoppingBag size={14} /> BEAUTY &amp; SELF-CARE STORE
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                Beauty, Skincare &amp; Personal Care Products
              </h1>
              <p className="text-sm sm:text-base text-stone-200 max-w-2xl">
                Shop curated skincare, haircare, clean makeup, bath &amp; body, personal &amp; feminine hygiene, grooming essentials, and beauty tools from trusted sellers.
              </p>
            </div>
          </section>

          {/* 8 Beauty Product Subcategories */}
          <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Shop Beauty Products by Category
              </h2>
              {selectedProductCategory !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedProductCategory("all")}
                  className="text-xs font-bold uppercase tracking-wider text-[#4A1513] hover:underline cursor-pointer"
                >
                  View All ({beautyProducts.length})
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {BEAUTY_PRODUCT_SUBCATEGORIES.map((sub) => {
                const isActive =
                  selectedProductCategory.toLowerCase() === sub.slug.toLowerCase() ||
                  selectedProductCategory.toLowerCase() === sub.name.toLowerCase();
                return (
                  <button
                    key={sub.slug}
                    type="button"
                    onClick={() => setSelectedProductCategory(isActive ? "all" : sub.slug)}
                    className={`group rounded-2xl overflow-hidden bg-white border text-left transition cursor-pointer flex flex-col ${
                      isActive
                        ? "border-[#4A1513] ring-2 ring-[#4A1513] shadow-md"
                        : "border-stone-200 hover:border-[#4A1513]/50 hover:shadow-sm"
                    }`}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-2.5 text-center">
                      <span className={`font-serif text-xs font-bold block ${isActive ? "text-[#4A1513]" : "text-stone-900"}`}>
                        {sub.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Product Search & Filter Bar */}
          <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            {productError && (
              <p role="status" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {productError}
              </p>
            )}

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 min-w-[220px] max-w-md">
                <Search size={16} className="absolute left-3.5 top-3 text-stone-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search skincare, haircare, makeup, hygiene, tools..."
                  className="w-full bg-stone-50 rounded-xl pl-10 pr-4 py-2 text-xs border border-stone-200 focus:outline-none focus:border-[#4A1513]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="bg-stone-50 rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#4A1513]"
                >
                  <option value="all">All Prices</option>
                  <option value="under500">Under ₹500</option>
                  <option value="500to1500">₹500 - ₹1,500</option>
                  <option value="above1500">Above ₹1,500</option>
                </select>

                <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                  <SlidersHorizontal size={14} className="text-[#4A1513]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs font-medium text-stone-800 focus:outline-none cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                <ShoppingBag size={28} className="mx-auto mb-3 text-[#4A1513]" />
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                  {beautyProducts.length === 0
                    ? "Beauty products are being added"
                    : "No matching beauty products found"}
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mb-5">
                  {beautyProducts.length === 0
                    ? "Approved beauty, skincare, haircare, and personal hygiene listings from sellers will appear here automatically."
                    : "Try clearing your category or search filters to explore more items."}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {selectedProductCategory !== "all" || productSearch || priceFilter !== "all" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProductCategory("all");
                        setProductSearch("");
                        setPriceFilter("all");
                      }}
                      className="px-5 py-2.5 bg-[#4A1513] text-white rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  ) : null}
                  <Link
                    href="/seller/register"
                    className="px-5 py-2.5 border border-[#4A1513] text-[#4A1513] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-rose-50 transition"
                  >
                    Sell Beauty Products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={isInWishlist(product.id)}
                    onToggleWishlist={() =>
                      toggleWishlist({
                        id: product.id,
                        name: product.name,
                        brand: product.brand,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.images[0],
                        category: product.category,
                      })
                    }
                    onQuickAdd={(p) =>
                      addToCart({
                        productId: p.id,
                        name: p.name,
                        brand: p.brand,
                        price: p.price,
                        image: p.images[0] || "/images/dress/placeholder.jpg",
                        size: p.sizes[0] || "Standard",
                        color: p.colors[0] || "Standard",
                        quantity: 1,
                      })
                    }
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
