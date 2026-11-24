"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, SlidersHorizontal, PackageX, Sparkles, Store, ShoppingBag, Heart } from 'lucide-react';

import { ShopControls } from '@/components/shop/ShopControls';
import { ActiveFilterChips } from '@/components/shop/ActiveFilterChips';
import { FilterSidebar, FilterState, FilterBrandOption } from '@/components/shop/FilterSidebar';
import { ProductCard, ProductCardSkeleton } from '@/components/shop/ProductCard';
import { LuxuryPromoBanner } from '@/components/shop/LuxuryPromoBanner';
import { useFemazonStore } from '@/context/FemazonStoreContext';

export interface DepartmentOption {
  id: string;
  name: string;
  categories: string[];
}

export const SHOP_DEPARTMENTS: DepartmentOption[] = [
  {
    id: "all",
    name: "All Categories",
    categories: [
      "All",
      "Kurta Sets",
      "Lehengas",
      "Sarees",
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
    ]
  },
  {
    id: "womens-wear",
    name: "Women's Wear",
    categories: [
      "Sarees",
      "Kurta Sets",
      "Kurtis",
      "Chudithar",
      "Lehengas",
      "Dresses",
      "Gowns",
      "Co-ord Sets",
      "Western Wear",
      "Tops",
      "Kaftans",
      "Indo-Western"
    ]
  },
  {
    id: "beauty",
    name: "Beauty & Self-care",
    categories: [
      "Skincare",
      "Hair Care",
      "Face Care",
      "Body Care",
      "Makeup",
      "Fragrances",
      "Bath & Body",
      "Beauty Gift Sets"
    ]
  },
  {
    id: "jewellery",
    name: "Jewellery & Accessories",
    categories: [
      "Handbags",
      "Potlis",
      "Earrings",
      "Necklaces",
      "Bangles",
      "Rings",
      "Hair Accessories",
      "Shawls",
      "Stoles & Scarves",
      "Belts",
      "Footwear"
    ]
  },
  {
    id: "gifts",
    name: "Gifts for Every Occasion",
    categories: [
      "Birthday Gifts",
      "Anniversary Gifts",
      "Wedding Gifts",
      "Personalised Gifts",
      "Gift Hampers",
      "Gifts for Her",
      "Gifts for Him",
      "Festival Gifts"
    ]
  }
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
  initialSubcategory?: string;
  initialOccasion?: string;
  initialWishlistIds?: number[];
  bannerImage?: string;
  initialDepartment?: string;
}

const CATEGORY_BANNERS: Record<string, {
  title: string;
  highlightText: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  objectPosition?: string;
}> = {
  "womens-wear": {
    title: "Women's Wear",
    highlightText: "Boutique Collections",
    description: "Handcrafted sarees, designer kurtis, regal lehengas & modern western silhouettes from authentic boutiques.",
    imageSrc: "/banners/hero_saree.jpg",
    imageAlt: "Women's Wear Collection",
    objectPosition: "object-[center_10%]",
  },
  "beauty": {
    title: "Beauty & Self-care",
    highlightText: "Botanical Rituals & Glow",
    description: "Shop pure botanicals, ritual skincare, radiant makeup, bath & body, and hair essentials from trusted formulators.",
    imageSrc: "/banners/hero_beauty_jewels.jpg",
    imageAlt: "Beauty & Self-care Collection",
    objectPosition: "object-[center_25%]",
  },
  "jewellery": {
    title: "Jewellery & Accessories",
    highlightText: "Timeless Adornments",
    description: "Regal Kundan chokers, temple jhumkas, artisanal potlis, luxury handbags & embroidered footwear.",
    imageSrc: "/categories/luxury_jewelry.png",
    imageAlt: "Jewellery & Accessories Collection",
    objectPosition: "object-center",
  },
  "gifts": {
    title: "Gifts for Every Occasion",
    highlightText: "Thoughtful Curations",
    description: "Curated gift hampers, celebratory boxes, flowers, chocolates & personalised surprises.",
    imageSrc: "/banners/hero_gifts.jpg",
    imageAlt: "Gifts for Every Occasion",
    objectPosition: "object-center",
  },
  "all": {
    title: "Shop Our",
    highlightText: "Latest Collection",
    description: "Discover elegance in every detail across our four curated departments.",
    imageSrc: "/banners/shop_banner_woman.jpg",
    imageAlt: "Shop Our Latest Collection",
    objectPosition: "object-right md:object-center",
  },
};

function matchesPriceRange(price: number, rangeStr: string): boolean {
  if (!rangeStr) return true;
  const clean = rangeStr.replace(/,/g, '').trim();

  // "Under ₹X" or "< ₹X"
  const underMatch = clean.match(/under\s*₹?\s*(\d+)/i) || clean.match(/<\s*₹?\s*(\d+)/i);
  if (underMatch) {
    const maxVal = parseFloat(underMatch[1]);
    return price <= maxVal;
  }

  // "₹X & Above" or "₹X+" or "Above ₹X"
  const aboveMatch = clean.match(/₹?\s*(\d+)\s*(?:&|\+)\s*(?:above)?/i) || clean.match(/above\s*₹?\s*(\d+)/i);
  if (aboveMatch) {
    const minVal = parseFloat(aboveMatch[1]);
    return price >= minVal;
  }

  // "₹X – ₹Y" or "₹X - ₹Y"
  const rangeMatch = clean.match(/₹?\s*(\d+)\s*[-–]\s*₹?\s*(\d+)/);
  if (rangeMatch) {
    const minVal = parseFloat(rangeMatch[1]);
    const maxVal = parseFloat(rangeMatch[2]);
    return price >= minVal && price <= maxVal;
  }

  return true;
}

function matchesDepartment(p: FormattedShopProduct, department: string): boolean {
  if (department === "all") return true;
  if (p.flaggedForReview) return false;
  const prodCat = (p.category || "").toLowerCase().trim();
  const prodName = (p.name || "").toLowerCase().trim();

  if (department === "womens-wear") {
    const isWomen = [
      "saree", "kurta", "kurti", "chudithar", "lehenga", "dress", "gown", 
      "co-ord", "western", "top", "kaftan", "indo-western", "anarkali", "suit"
    ].some(w => prodCat.includes(w) || prodName.includes(w));
    const isOtherDept = [
      "bag", "handbag", "potli", "jewel", "earring", "necklace", "bangle", 
      "hair accessory", "shawl", "stole", "scarf", "belt", "footwear", "accessories",
      "beauty", "skincare", "hair care", "makeup", "fragrance", "bath & body", "gift", "hamper"
    ].some(j => prodCat.includes(j)) || /\b(ring|earring|necklace|bangle|potli|jhumka|choker|clutch|shawl|stole|footwear|sandal|jutti)\b/i.test(prodName);
    return isWomen && !isOtherDept;
  } else if (department === "beauty") {
    const isBeauty = [
      "beauty", "skincare", "hair care", "face care", "body care", "makeup", "fragrance", 
      "serum", "lotion", "oil", "bath & body", "facial", "glow set", "elixir", "cosmetic", "beauty gift sets"
    ].some(b => prodCat.includes(b) || prodName.includes(b));
    const isApparelOrJewel = [
      "saree", "lehenga", "kurta", "kurti", "dress", "gown", "bag", "belt", "jewel", "shawl", "stole", "scarf", "footwear", "crossbody"
    ].some(w => prodCat.includes(w) || prodName.includes(w));
    return isBeauty && !isApparelOrJewel;
  } else if (department === "jewellery") {
    const isJewelleryOrAccessory = [
      "bag", "handbag", "potli", "jewel", "earring", "necklace", "bangle", 
      "hair accessory", "shawl", "stole", "scarf", "belt", "footwear", "accessories"
    ].some(j => prodCat.includes(j)) || /\b(ring|earring|necklace|bangle|potli|jhumka|choker|clutch|shawl|stole|footwear|sandal|jutti|accessories)\b/i.test(prodName);
    const isApparelOrBeauty = [
      "saree", "lehenga", "kurta", "dress", "gown", "skincare", "makeup", "serum", "fragrance", "hair care", "bath & body", "elixir"
    ].some(w => prodCat.includes(w) || prodName.includes(w));
    return isJewelleryOrAccessory && !isApparelOrBeauty;
  } else if (department === "gifts") {
    const isBeauty = [
      "skincare", "hair care", "makeup", "fragrance", "bath & body", "beauty gift sets", "facial"
    ].some(b => prodCat.includes(b));
    const isGift = [
      "gift", "hamper", "birthday", "anniversary", "wedding gift", "personalised", "festival gift", "celebration box", "keepsake"
    ].some(g => prodCat.includes(g) || prodName.includes(g));
    const isApparelOrJewel = ["saree", "lehenga", "kurta", "dress", "gown", "potli", "belt", "shawl", "footwear"].some(w => prodCat.includes(w));
    return isGift && !isApparelOrJewel && !isBeauty;
  }
  return true;
}

export function ShopClient({ 
  initialProducts, 
  initialCategory, 
  initialSilhouette = "All",
  initialSubcategory,
  initialOccasion,
  initialWishlistIds = [], 
  bannerImage,
  initialDepartment
}: ShopClientProps) {
  const router = useRouter();
  const { isInWishlist, toggleWishlist, addToCart } = useFemazonStore();
  const [isMounted, setIsMounted] = useState(false);
  
  // Resolve initial department based on initialDepartment prop or initialCategory
  const resolvedInitialDept = useMemo(() => {
    if (initialDepartment && ["womens-wear", "beauty", "jewellery", "gifts", "all"].includes(initialDepartment)) {
      return initialDepartment;
    }
    const catLower = (initialCategory || "").toLowerCase();
    if (catLower === "beauty" || catLower.includes("beauty") || catLower === "skincare" || catLower === "makeup" || catLower === "hair care") return "beauty";
    if (catLower === "handbags" || catLower === "potlis" || catLower === "jewelry" || catLower === "jewellery" || catLower.includes("jewel") || catLower === "accessories" || catLower === "belts" || catLower === "footwear" || catLower === "shawls") return "jewellery";
    if (catLower === "gifts" || catLower.includes("gift")) return "gifts";
    if (catLower === "womens-wear" || catLower.includes("women") || catLower === "sarees" || catLower === "dresses" || catLower === "kurta sets") return "womens-wear";
    return "all";
  }, [initialCategory, initialDepartment]);

  const [selectedDepartment, setSelectedDepartment] = useState(resolvedInitialDept);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");
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
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Update selectedSilhouette whenever initialSilhouette prop changes
  useEffect(() => {
    if (initialSilhouette) {
      setSelectedSilhouette(initialSilhouette);
    }
  }, [initialSilhouette]);

  // Sync state to URL query params
  useEffect(() => {
    if (!isMounted) return;
    const url = new URL(window.location.href);
    if (selectedDepartment !== "all") url.searchParams.set("dept", selectedDepartment);
    else url.searchParams.delete("dept");

    if (selectedCategory !== "All") url.searchParams.set("category", selectedCategory);
    else url.searchParams.delete("category");
    
    if (selectedSilhouette !== "All") url.searchParams.set("silhouette", selectedSilhouette);
    else url.searchParams.delete("silhouette");

    window.history.replaceState({}, '', url.toString());
  }, [selectedDepartment, selectedCategory, selectedSilhouette, isMounted]);

  // Categories to display in sidebar based on current department
  const activeCategories = useMemo(() => {
    const dept = SHOP_DEPARTMENTS.find(d => d.id === selectedDepartment);
    return dept ? dept.categories : SHOP_DEPARTMENTS[0].categories;
  }, [selectedDepartment]);

  // Dynamically compute available sellers & brands with live counts
  const availableBrands: FilterBrandOption[] = useMemo(() => {
    const counts: Record<string, number> = {};
    const deptProducts = initialProducts.filter(p => matchesDepartment(p, selectedDepartment));

    deptProducts.forEach(p => {
      const b = p.vendorName || p.brand || "Femazon Luxe";
      counts[b] = (counts[b] || 0) + 1;
    });

    const partnerBrands: Record<string, { name: string; city: string; verified: boolean; baseCount: number }[]> = {
      "womens-wear": [
        { name: "Kovai Handlooms & Silks", city: "Coimbatore", verified: true, baseCount: 18 },
        { name: "Nagla Atelier", city: "Chennai", verified: true, baseCount: 24 },
        { name: "Mylapore Heritage Silks", city: "Chennai", verified: true, baseCount: 16 },
        { name: "Priya Sundaram Couture", city: "Chennai", verified: true, baseCount: 9 },
        { name: "Bengaluru Silk Haven", city: "Bangalore", verified: true, baseCount: 15 },
      ],
      "beauty": [
        { name: "Siruvani Botanical Care", city: "Coimbatore", verified: true, baseCount: 14 },
        { name: "AyurGlow Organic Skincare", city: "Bangalore", verified: true, baseCount: 12 },
        { name: "Kavita Reddy Makeup Studio", city: "Chennai", verified: true, baseCount: 8 },
      ],
      "jewellery": [
        { name: "Nagla Atelier", city: "Chennai", verified: true, baseCount: 14 },
        { name: "Femazon Heritage", city: "Coimbatore", verified: true, baseCount: 16 },
      ],
      "gifts": [
        { name: "Kongu Artisanal Treats", city: "Coimbatore", verified: true, baseCount: 12 },
        { name: "Femazon Heritage", city: "Coimbatore", verified: true, baseCount: 10 },
      ]
    };

    const list: FilterBrandOption[] = [];

    // Add existing catalog brands
    Object.entries(counts).forEach(([name, count]) => {
      list.push({
        name,
        count,
        verified: true,
        city: name.includes("Heritage") || name.includes("Kovai") || name.includes("Kongu") || name.includes("Siruvani") ? "Coimbatore" : "Chennai",
      });
    });

    // Add partner brands if applicable
    const activePartnerBrands = partnerBrands[selectedDepartment] || [
      { name: "Kovai Handlooms & Silks", city: "Coimbatore", verified: true, baseCount: 18 },
      { name: "Nagla Atelier", city: "Chennai", verified: true, baseCount: 24 },
      { name: "Siruvani Botanical Care", city: "Coimbatore", verified: true, baseCount: 14 },
      { name: "Kongu Artisanal Treats", city: "Coimbatore", verified: true, baseCount: 12 },
      { name: "Mylapore Heritage Silks", city: "Chennai", verified: true, baseCount: 16 },
    ];

    activePartnerBrands.forEach(pb => {
      if (!counts[pb.name]) {
        list.push({
          name: pb.name,
          city: pb.city,
          count: pb.baseCount,
          verified: pb.verified,
        });
      }
    });

    return list.sort((a, b) => b.count - a.count);
  }, [initialProducts, selectedDepartment]);

  // Handle department change
  const handleSelectDepartment = (deptId: string) => {
    setSelectedDepartment(deptId);
    setSelectedCategory("All");
    setSelectedSilhouette("All");
  };

  // Derived Active Filters Array for Chips
  const activeFilterChips = [
    ...(selectedDepartment !== "all" ? [`Dept: ${SHOP_DEPARTMENTS.find(d => d.id === selectedDepartment)?.name}`] : []),
    ...(selectedCategory !== "All" ? [`Category: ${selectedCategory}`] : []),
    ...(selectedSilhouette !== "All" ? [`Silhouette: ${selectedSilhouette}`] : []),
    ...(filters.silhouettes || []).map(s => `Silhouette: ${s}`),
    ...filters.subcategories,
    ...(filters.maxPrice && filters.maxPrice < 10000 ? [`Under ₹${filters.maxPrice.toLocaleString('en-IN')}`] : []),
    ...(filters.priceRange ? [filters.priceRange] : []),
    ...filters.sizes.map(s => `Size: ${s}`),
    ...filters.colors,
    ...filters.brands.map(b => `Brand: ${b}`),
    ...(filters.inStockOnly ? ['In Stock'] : []),
    ...(filters.onSale ? ['On Sale'] : []),
    ...(filters.readyToShip ? ['Ready to Ship'] : [])
  ];

  const handleFilterChange = (type: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleRemoveChip = (chipText: string) => {
    if (chipText.startsWith('Dept: ')) {
      setSelectedDepartment("all");
      return;
    }
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
    if (chipText.startsWith('Brand: ')) {
      const brand = chipText.replace('Brand: ', '');
      handleFilterChange('brands', filters.brands.filter(b => b !== brand));
      return;
    }
    if (chipText.startsWith('Seller: ')) {
      const seller = chipText.replace('Seller: ', '');
      handleFilterChange('brands', filters.brands.filter(b => b !== seller));
      return;
    }
    if (chipText.startsWith('Under ₹')) {
      handleFilterChange('maxPrice', null);
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
    setSelectedDepartment("all");
    setSelectedCategory("All");
    setSelectedSilhouette("All");
    setFilters(initialFilterState);
    setSearchQuery("");
  };

  // ---- FILTERING LOGIC ----
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      // 0. Safety Check
      if (p.flaggedForReview) return false;

      // 1. Department Filter
      if (!matchesDepartment(p, selectedDepartment)) return false;

      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = (p.brand || '').toLowerCase().includes(q) || (p.vendorName || '').toLowerCase().includes(q);
        const matchesCat = (p.category || '').toLowerCase().includes(q);
        const matchesSil = (p.silhouette || '').toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCat && !matchesSil) return false;
      }

      // 3. Category Filter
      if (selectedCategory && selectedCategory !== "All") {
        const selCat = selectedCategory.toLowerCase().trim();
        const prodCat = (p.category || "").toLowerCase().trim();

        if (selCat === "on sale") {
          if (!(p.discount > 0 || (p.originalPrice && p.originalPrice > p.price))) return false;
        } else if (selCat === "new arrivals" || selCat === "new") {
          if (!p.isNew) return false;
        } else if (selCat === "femazon exclusive") {
          if (!p.brand?.toLowerCase().includes("femazon") && !p.brand?.toLowerCase().includes("nagla")) return false;
        } else {
          if (prodCat !== selCat && !prodCat.includes(selCat) && !selCat.includes(prodCat)) {
            return false;
          }
        }
      }

      // 4. Dress Silhouette Filter
      const activeSilhouettes = [
        ...(selectedSilhouette && selectedSilhouette !== "All" ? [selectedSilhouette] : []),
        ...(filters.silhouettes || [])
      ].map(s => s.toLowerCase().trim());

      if (activeSilhouettes.length > 0) {
        const prodSil = (p.silhouette || "").toLowerCase().trim();
        const matchesSilhouette = activeSilhouettes.some(sil => prodSil === sil);
        if (!matchesSilhouette) return false;
      }

      // 5. Sub-categories
      if (filters.subcategories.length > 0) {
        const matchesSub = filters.subcategories.some(sub => {
          const s = sub.toLowerCase().trim();
          const pSub = (p.subCategory || "").toLowerCase().trim();
          const pSil = (p.silhouette || "").toLowerCase().trim();
          return pSub === s || pSil === s || pSub.includes(s) || s.includes(pSub);
        });
        if (!matchesSub) return false;
      }

      // 6. Sellers / Brands Filter (Directly from FilterSidebar)
      if (filters.brands.length > 0) {
        const prodSeller = (p.vendorName || p.brand || "").toLowerCase().trim();
        const matchesBrand = filters.brands.some(b => {
          const target = b.toLowerCase().trim();
          return prodSeller === target || prodSeller.includes(target) || target.includes(prodSeller);
        });
        if (!matchesBrand) return false;
      }

      // 7. Price Range & Max Price Slider
      if (filters.maxPrice && p.price > filters.maxPrice) {
        return false;
      }
      if (filters.priceRange && !matchesPriceRange(p.price, filters.priceRange)) {
        return false;
      }

      // 8. Sizes
      if (filters.sizes.length > 0) {
        const hasSize = filters.sizes.some((s: string) => p.sizes?.includes(s));
        if (!hasSize) return false;
      }

      // 9. Colors
      if (filters.colors.length > 0) {
        const hasColor = filters.colors.some((c: string) => p.colors?.includes(c));
        if (!hasColor) return false;
      }

      // 10. Stock / Sale / Shipping Toggles
      if (filters.inStockOnly && !p.inStock) return false;
      if (filters.onSale && p.discount < 30) return false;
      if (filters.readyToShip && !p.readyToShip) return false;

      return true;
    });
  }, [searchQuery, selectedDepartment, selectedCategory, selectedSilhouette, filters, initialProducts]);

  // ---- SORTING LOGIC ----
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (selectedSort) {
      case "Latest First":
      case "New Arrivals":
      case "Newest Arrivals":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date || 0).getTime();
          const dateB = new Date(b.createdAt || b.date || 0).getTime();
          return dateB - dateA;
        });
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
  const currentBanner = CATEGORY_BANNERS[selectedDepartment] || CATEGORY_BANNERS.all;

  return (
    <div className="bg-surface min-h-screen text-text-main font-sans pb-24">
      {/* Main Layout Architecture */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 pt-2 sm:pt-3">
        {/* Luxury Burgundy & Gold Promo Banner (Dynamic per Category) */}
        <LuxuryPromoBanner
          title={currentBanner.title}
          highlightText={currentBanner.highlightText}
          description={currentBanner.description}
          imageSrc={currentBanner.imageSrc}
          imageAlt={currentBanner.imageAlt}
          objectPosition={currentBanner.objectPosition}
          ctaText="Explore Collection"
          ctaLink="#shop-catalog"
        />
        
        {/* Top Control Bar spanning equally above Filter Sidebar & Product section */}
        <div id="shop-catalog">
          <ShopControls 
            totalItems={totalItems}
            selectedCategory={selectedCategory}
            selectedDepartment={selectedDepartment}
            departments={SHOP_DEPARTMENTS}
            onSelectDepartment={handleSelectDepartment}
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            selectedSort={selectedSort}
            onSortChange={(s) => setSelectedSort(s)}
            filters={filters}
            onFilterChange={handleFilterChange}
            onOpenMobileFilters={() => setIsFilterDrawerOpen(true)}
          />
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 relative">
          {/* Filter Sidebar (Desktop & Mobile Drawer) with Sellers & Brands right under Categories */}
          <FilterSidebar 
            categories={activeCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={(c) => setSelectedCategory(c)}
            selectedDepartment={selectedDepartment}
            onSelectDepartment={handleSelectDepartment}
            availableBrands={availableBrands}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAllFilters}
            isOpen={isFilterDrawerOpen}
            onClose={() => setIsFilterDrawerOpen(false)}
          />

          {/* Right Main Section */}
          <div className="flex-1 w-full min-w-0 flex flex-col">
            
            <ActiveFilterChips 
              activeFilters={activeFilterChips}
              onRemoveFilter={handleRemoveChip}
              onClearAll={handleClearAllFilters}
            />

            {/* Product Grid or Empty State */}
          {isMounted ? (
            totalItems > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-7 md:gap-x-6 md:gap-y-10">
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
                  We couldn&apos;t find anything matching your current filters. Try adjusting your search, department or clearing your filters to see more results.
                </p>
                <button 
                  onClick={handleClearAllFilters}
                  className="bg-[#4A1513] text-white font-bold text-[12px] uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg hover:bg-[#380E0C] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-7 md:gap-x-6 md:gap-y-10">
              {Array.from({ length: 6 }).map((_, idx) => <ProductCardSkeleton key={idx} />)}
            </div>
          )}
          
        </div>
      </div>
    </div>

  </div>
  );
}
