"use client";

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Check, Search, Store } from 'lucide-react';

export interface FilterState {
  silhouettes?: string[];
  subcategories: string[];
  priceRange: string | null;
  sizes: string[];
  colors: string[];
  brands: string[];
  inStockOnly: boolean;
  onSale: boolean;
  readyToShip: boolean;
}

export interface FilterBrandOption {
  name: string;
  count: number;
  city?: string;
  verified?: boolean;
}

export const SILHOUETTE_OPTIONS = [
  { label: "Straight Kurta / Cut", value: "Straight" },
  { label: "Anarkali (Flared)", value: "Anarkali" },
  { label: "A-Line", value: "A-Line" },
  { label: "Maxi Dress", value: "Maxi" },
  { label: "Midi Dress", value: "Midi" },
  { label: "Mini Dress", value: "Mini" },
  { label: "Bodycon", value: "Bodycon" },
  { label: "Fit and Flare", value: "Fit and Flare" },
  { label: "Wrap Dress", value: "Wrap" },
  { label: "Shirt Dress", value: "Shirt Dress" },
  { label: "Slip Dress", value: "Slip Dress" },
  { label: "Evening Gown", value: "Gown" },
  { label: "Lehenga Set", value: "Lehenga" },
  { label: "Palazzo Set", value: "Palazzo" },
  { label: "Sharara Set", value: "Sharara" },
  { label: "Peplum Set", value: "Peplum" }
];

export interface DepartmentCategoryGroup {
  id: string;
  number: number;
  name: string;
  categories: string[];
}

export const SHOP_CATEGORY_DEPARTMENTS: DepartmentCategoryGroup[] = [
  {
    id: "womens-wear",
    number: 1,
    name: "Women's Wear",
    categories: [
      "Sarees",
      "Kurtis",
      "Chudithar",
      "Kurta Sets",
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
    number: 2,
    name: "Beauty & Self-Care",
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
    number: 3,
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
    number: 4,
    name: "Gifts for Every Occasion",
    categories: [
      "Birthday Gifts",
      "Anniversary Gifts",
      "Personalised Gifts",
      "Festival Gifts",
      "Wedding Gifts",
      "Return Gifts",
      "Gift Hampers",
      "Gifts for Her",
      "Gifts for Him"
    ]
  }
];

export const DEPARTMENT_PRICE_TIERS: Record<string, PriceTier[]> = {
  "womens-wear": [
    { label: "Under ₹1,499", min: 0, max: 1499 },
    { label: "₹1,500 – ₹2,999", min: 1500, max: 2999 },
    { label: "₹3,000 – ₹5,999", min: 3000, max: 5999 },
    { label: "₹6,000 – ₹9,999", min: 6000, max: 9999 },
    { label: "₹10,000 & Above", min: 10000, max: null },
  ],
  beauty: [
    { label: "Under ₹499", min: 0, max: 499 },
    { label: "₹500 – ₹999", min: 500, max: 999 },
    { label: "₹1,000 – ₹1,999", min: 1000, max: 1999 },
    { label: "₹2,000 & Above", min: 2000, max: null },
  ],
  jewellery: [
    { label: "Under ₹799", min: 0, max: 799 },
    { label: "₹800 – ₹1,999", min: 800, max: 1999 },
    { label: "₹2,000 – ₹3,999", min: 2000, max: 3999 },
    { label: "₹4,000 & Above", min: 4000, max: null },
  ],
  gifts: [
    { label: "Under ₹499", min: 0, max: 499 },
    { label: "₹500 – ₹1,499", min: 500, max: 1499 },
    { label: "₹1,500 – ₹2,999", min: 1500, max: 2999 },
    { label: "₹3,000 & Above", min: 3000, max: null },
  ],
  all: [
    { label: "Under ₹999", min: 0, max: 999 },
    { label: "₹1,000 – ₹2,499", min: 1000, max: 2499 },
    { label: "₹2,500 – ₹4,999", min: 2500, max: 4999 },
    { label: "₹5,000 & Above", min: 5000, max: null },
  ],
};

export interface PriceTier {
  label: string;
  min: number;
  max: number | null;
}

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedDepartment?: string;
  onSelectDepartment?: (deptId: string) => void;
  availableBrands?: FilterBrandOption[];
  filters: FilterState;
  onFilterChange: (type: keyof FilterState, value: any) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const CHUDITHAR_VARIETIES = [
  "Anarkali Chudithar",
  "Straight Cut Chudithar",
  "A-Line Chudithar",
  "Angrakha Style",
  "Floor Length Chudithar",
  "Umbrella Cut Chudithar",
  "Pakistani Style Suit",
  "Patiala Suit",
  "Punjabi Suit",
  "Salwar Suit",
  "Palazzo Suit",
  "Sharara Suit",
  "Gharara Suit",
  "Pant Style Suit",
  "Cigarette Pant Suit",
  "Dhoti Style Suit",
  "Jacket Style Suit",
  "Layered Chudithar",
  "High-Low Style Suit",
  "Flared Chudithar",
  "Kaftan Style Suit",
  "Kurta with Dupatta Set",
  "Kurta Palazzo Set",
  "Kurta Pant Set",
  "Kurta Skirt Set"
];

const KURTI_VARIETIES = [
  "Straight Cut Kurti",
  "A-Line Kurti",
  "Anarkali Kurti",
  "Flared Kurti",
  "High-Low Kurti",
  "Asymmetrical Kurti",
  "Angrakha Kurti",
  "Front Slit Kurti",
  "Side Slit Kurti",
  "Floor Length Kurti",
  "Short Kurti",
  "Long Kurti",
  "Shirt Style Kurti",
  "Kaftan Kurti",
  "Jacket Style Kurti",
  "Layered Kurti",
  "C-Cut Kurti",
  "Tail Cut Kurti",
  "Umbrella Cut Kurti",
  "Princess Cut Kurti",
  "Panelled Kurti",
  "Peplum Kurti",
  "Dhoti Style Kurti",
  "Indo-Western Kurti",
  "Asymmetric Hem Kurti",
  "Slit Style Kurti",
  "Empire Line Kurti",
  "Frock Style Kurti",
  "Tunic Style Kurti",
  "Denim Kurti"
];

const ANARKALI_VARIETIES = [
  "Classic Anarkali",
  "Floor Length Anarkali",
  "Short Anarkali",
  "Long Anarkali",
  "Flared Anarkali",
  "Umbrella Anarkali",
  "Layered Anarkali",
  "Jacket Style Anarkali",
  "Angrakha Anarkali",
  "Asymmetrical Anarkali",
  "High-Low Anarkali",
  "Panelled Anarkali",
  "Princess Cut Anarkali",
  "Front Slit Anarkali",
  "Side Slit Anarkali",
  "Trail Style Anarkali",
  "Gown Style Anarkali",
  "Pakistani Style Anarkali",
  "Indo-Western Anarkali",
  "Cape Style Anarkali",
  "Double Layer Anarkali",
  "Tiered Anarkali",
  "Kalidar Anarkali",
  "Frock Style Anarkali",
  "Party Wear Anarkali",
  "Bridal Anarkali",
  "Festive Anarkali",
  "Casual Anarkali",
  "Embroidered Anarkali",
  "Printed Anarkali"
];

const SAREE_VARIETIES = [
  "Kanchipuram Saree",
  "Banarasi Saree",
  "Mysore Silk Saree",
  "Chanderi Saree",
  "Paithani Saree",
  "Patola Saree",
  "Bandhani Saree",
  "Sambalpuri Saree",
  "Pochampally Saree",
  "Kota Saree",
  "Jamdani Saree",
  "Tant Saree",
  "Kalamkari Saree",
  "Linen Saree",
  "Cotton Saree",
  "Silk Saree",
  "Georgette Saree",
  "Chiffon Saree",
  "Crepe Saree",
  "Organza Saree",
  "Tissue Saree",
  "Net Saree",
  "Satin Saree",
  "Velvet Saree",
  "Designer Saree",
  "Party Wear Saree",
  "Bridal Saree",
  "Wedding Saree",
  "Half & Half Saree",
  "Ruffle Saree",
  "Pre-Draped Saree",
  "Ready-to-Wear Saree",
  "Lehenga Style Saree",
  "Dhoti Style Saree",
  "Belted Saree",
  "Printed Saree",
  "Embroidered Saree",
  "Handloom Saree",
  "Fancy Saree",
  "Casual Saree"
];

const OCCASION_VARIETIES = [
  "Casual Wear",
  "Office Wear",
  "Party Wear",
  "Festive Wear",
  "Wedding Wear",
  "Reception Wear",
  "Engagement Wear",
  "Traditional Wear",
  "Daily Wear"
];

export const CATEGORY_SUB_ITEMS: Record<string, string[]> = {
  Sarees: SAREE_VARIETIES,
  Saree: SAREE_VARIETIES,
  "Kurta Sets": [
    "Kurta with Dupatta Set",
    "Kurta Palazzo Set",
    "Kurta Pant Set",
    "Kurta Skirt Set",
    "Straight Cut Kurta Set",
    "Anarkali Kurta Set",
    "Sharara Kurta Set",
    "Embroidered Kurta Set"
  ],
  Kurtis: KURTI_VARIETIES,
  Kurti: KURTI_VARIETIES,
  Chudithar: CHUDITHAR_VARIETIES,
  Anarkali: ANARKALI_VARIETIES,
  Lehengas: [
    "Bridal Lehenga",
    "Party Wear Lehenga",
    "Floral Print Lehenga",
    "Semi-Stitched Lehenga",
    "Velvet Lehenga",
    "Georgette Lehenga",
    "Silk Brocade Lehenga"
  ],
  Dresses: [
    "Midi Dresses",
    "Maxi Dresses",
    "Mini Dresses",
    "Bodycon Dresses",
    "A-Line Dresses",
    "Wrap Dresses",
    "Shirt Dresses",
    "Party Wear Dresses"
  ],
  Gowns: [
    "Evening Gowns",
    "Ball Gowns",
    "Indo-Western Gowns",
    "Cape Style Gowns",
    "Embroidered Gowns",
    "Reception Gowns"
  ],
  "Co-ord Sets": [
    "Printed Co-ords",
    "Festive Ethnic Co-ords",
    "Blazer Sets",
    "Crop Top & Skirt Sets",
    "Casual Summer Sets"
  ],
  "Western Wear": [
    "Jumpsuits",
    "Blazers & Jackets",
    "Tops & Blouses",
    "Trousers & Pants",
    "Skirts"
  ],
  Tops: [
    "Crop Tops",
    "Shirts & Blouses",
    "Tunics",
    "Peplum Tops",
    "Ethnic Tops"
  ],
  Handbags: [
    "Tote Bags",
    "Shoulder Bags",
    "Crossbody Bags",
    "Clutches",
    "Satchels"
  ],
  Potlis: [
    "Embroidered Potlis",
    "Bridal Potlis",
    "Velvet Potlis",
    "Pearl Embellished Potlis",
    "Zari Work Potlis"
  ],
  Earrings: [
    "Jhumkas",
    "Chandbalis",
    "Stud Earrings",
    "Drop & Dangle Earrings",
    "Hoop Earrings"
  ],
  Necklaces: [
    "Choker Sets",
    "Kundan Necklaces",
    "Temple Jewellery",
    "Polki Sets",
    "Pendant Chains"
  ],
  Bangles: [
    "Kada Bangles",
    "Silk Thread Bangles",
    "Bridal Chooda",
    "Glass Bangles",
    "Antique Gold Bangles"
  ],
  Rings: [
    "Statement Rings",
    "Solitaire Rings",
    "Kundan Rings",
    "Adjustable Rings"
  ],
  "Hair Accessories": [
    "Hair Bands",
    "Matha Patti",
    "Maang Tikka",
    "Hair Pins & Brooches",
    "Scrunchies & Clips"
  ],
  Shawls: [
    "Pashmina Shawls",
    "Kashmiri Embroidered Shawls",
    "Silk Shawls",
    "Woolen Shawls"
  ],
  "Stoles & Scarves": [
    "Silk Stoles",
    "Printed Scarves",
    "Chiffon Stoles",
    "Handloom Stoles"
  ],
  Belts: [
    "Embroidered Belts",
    "Metallic Kamarbandh",
    "Leather Belts",
    "Saree Belts"
  ],
  Footwear: [
    "Punjabi Juttis",
    "Kolhapuris",
    "Embellished Mojaris",
    "Block Heels",
    "Bridal Sandals"
  ],
  Skincare: [
    "Face Serums",
    "Moisturizers",
    "Sunscreen",
    "Toners & Mists",
    "Night Creams"
  ],
  "Hair Care": [
    "Herbal Hair Oils",
    "Shampoos",
    "Conditioners",
    "Hair Masks",
    "Hair Growth Serums"
  ],
  "Face Care": [
    "Cleansers",
    "Exfoliators & Scrubs",
    "Sheet Masks",
    "Clay Masks"
  ],
  "Body Care": [
    "Body Lotions",
    "Body Washes",
    "Body Butters",
    "Scrubs & Polishes"
  ],
  Makeup: [
    "Lipsticks & Lip Oils",
    "Kohl & Eyeliners",
    "Eyeshadow Palettes",
    "Foundations & BB Creams",
    "Highlighters"
  ],
  Fragrances: [
    "Artisanal Attars",
    "Eau De Parfum",
    "Body Mists",
    "Solid Perfumes"
  ],
  "Birthday Gifts": [
    "Curated Birthday Hampers",
    "Personalised Keepsakes",
    "Luxury Chocolate Boxes",
    "Spa & Self-Care Kits"
  ],
  "Anniversary Gifts": [
    "Couples Hampers",
    "Personalised Frame & Watch",
    "Luxury Scented Candles",
    "Wine & Gourmet Sets"
  ],
  "Wedding Gifts": [
    "Bridal Trousseau Boxes",
    "Silverware & Keepsakes",
    "Luxury Home Decor Gifts",
    "Heritage Silk Hampers"
  ],
  "Personalised Gifts": [
    "Custom Engraved Gifts",
    "Monogrammed Robes & Bags",
    "Personalised Jewellery Boxes",
    "Custom Photo Hampers"
  ],
  "Gift Hampers": [
    "Festive Sweet Hampers",
    "Organic Wellness Hampers",
    "Tea & Coffee Connoisseur",
    "Royal Gourmet Baskets"
  ],
  "Gifts for Her": [
    "Designer Jewellery Gifts",
    "Luxury Perfume Sets",
    "Silk Sarees & Dupattas",
    "Pamper Care Hampers"
  ],
  "Gifts for Him": [
    "Grooming Essentials Kits",
    "Wallets & Belt Sets",
    "Classic Watches",
    "Gourmet Snack Hampers"
  ],
  "Festival Gifts": [
    "Diwali Sweet & Diya Sets",
    "Pongal & Sankranti Hampers",
    "Eid Royal Treats",
    "Christmas & New Year Hampers"
  ],
  Occasions: OCCASION_VARIETIES,
};

const DEFAULT_BRANDS: FilterBrandOption[] = [
  { name: "Femazon Luxe", count: 113, city: "Chennai", verified: true },
  { name: "Femazon Heritage", count: 7, city: "Coimbatore", verified: true },
  { name: "Kovai Handlooms & Silks", count: 18, city: "Coimbatore", verified: true },
  { name: "Nagla Atelier", count: 24, city: "Chennai", verified: true },
  { name: "Siruvani Botanical Care", count: 14, city: "Coimbatore", verified: true },
  { name: "Kongu Artisanal Treats", count: 12, city: "Coimbatore", verified: true },
  { name: "Mylapore Heritage Silks", count: 16, city: "Chennai", verified: true },
  { name: "Priya Sundaram Couture", count: 9, city: "Chennai", verified: true },
  { name: "Bengaluru Silk Haven", count: 15, city: "Bangalore", verified: true },
];

// Accordion Component Helper
function Accordion({ title, badge, children, defaultOpen = false }: { title: string, badge?: string | number, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-100 py-4">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)} 
        className="flex w-full items-center justify-between font-bold text-[13px] tracking-wide text-stone-900 hover:text-[#4A1513] transition-colors"
      >
        <span className="flex items-center gap-2">
          <span>{title}</span>
          {badge !== undefined && (
            <span className="px-1.5 py-0.2 rounded-full bg-stone-100 text-[#4A1513] text-[10px] font-bold">
              {badge}
            </span>
          )}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-300 text-zinc-400 ${isOpen ? 'rotate-180 text-[#4A1513]' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}

export function FilterSidebar({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  selectedDepartment = "all",
  onSelectDepartment,
  availableBrands = DEFAULT_BRANDS,
  filters, 
  onFilterChange, 
  onClearAll, 
  isOpen, 
  onClose 
}: FilterSidebarProps) {
  const [brandSearch, setBrandSearch] = useState("");
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategoryExpand = (cat: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const hasActiveFilters = 
    (filters.silhouettes && filters.silhouettes.length > 0) ||
    filters.subcategories.length > 0 || 
    filters.priceRange !== null || 
    filters.sizes.length > 0 || 
    filters.colors.length > 0 || 
    filters.brands.length > 0 || 
    filters.inStockOnly || 
    filters.onSale;

  const handleCheckboxToggle = (type: keyof FilterState, value: string, currentArray: string[]) => {
    if (currentArray.includes(value)) {
      onFilterChange(type, currentArray.filter(i => i !== value));
    } else {
      onFilterChange(type, [...currentArray, value]);
    }
  };

  const allBrandsList = availableBrands && availableBrands.length > 0 ? availableBrands : DEFAULT_BRANDS;
  const filteredBrands = allBrandsList.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()));

  const SidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header for Mobile */}
      <div className="flex lg:hidden items-center justify-between pb-4 border-b border-accent/20 px-6 py-5">
        <h2 className="font-serif text-xl font-normal text-text-main tracking-wide">Filters &amp; Categories</h2>
        <button onClick={onClose} className="text-text-muted hover:text-text-main">
          <X size={20} />
        </button>
      </div>

      {/* Scrollable Filters Area */}
      <div className="flex-1 overflow-y-auto px-6 lg:px-0 pb-24 lg:pb-8 hide-scrollbar">
        
        {/* 1. CATEGORY NAV - Clean List with Nested Subcategories */}
        <div className="pb-5 lg:pt-0 pt-4 border-b border-stone-100">
          <div className="flex items-center justify-between min-h-[36px] mb-3">
            <h3 className="font-bold text-[13px] tracking-wider text-stone-900 uppercase">Categories</h3>
            {selectedCategory !== "All" && (
              <button 
                type="button" 
                onClick={() => onSelectCategory("All")}
                className="text-[11px] font-semibold text-[#4A1513] hover:underline cursor-pointer"
              >
                Reset to All
              </button>
            )}
          </div>

          {/* Clean List of Categories under selected department */}
          <ul className="space-y-0.5">
            {categories.map((cat) => {
              const subItems = CATEGORY_SUB_ITEMS[cat] || [];
              const isExpanded = Boolean(expandedCategories[cat]);
              const isSelected = selectedCategory === cat;
              const hasActiveSub = subItems.some((sub) => filters.subcategories.includes(sub));

              return (
                <li key={cat} className="flex flex-col border-b border-stone-100/60 last:border-0 pb-0.5 pt-0.5">
                  <div className="flex items-center justify-between py-1 group/cat px-1">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat);
                        if (subItems.length > 0 && !isExpanded) {
                          setExpandedCategories((prev) => ({ ...prev, [cat]: true }));
                        }
                        if (window.innerWidth < 1024 && subItems.length === 0) onClose();
                      }}
                      className={`text-[12.5px] text-left transition-all flex items-center gap-1.5 cursor-pointer flex-1 ${
                        isSelected
                          ? "font-bold text-[#4A1513]"
                          : hasActiveSub
                          ? "font-semibold text-[#4A1513]"
                          : "text-stone-600 hover:text-stone-950 font-normal"
                      }`}
                    >
                      <span>{cat === "All" ? "All in This Department" : cat}</span>
                      {subItems.length > 0 && (
                        <span className="text-[10px] text-stone-400 font-medium group-hover/cat:text-[#4A1513]">
                          ({subItems.length})
                        </span>
                      )}
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4A1513]" />
                      )}
                      {subItems.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => toggleCategoryExpand(cat, e)}
                          className="p-1 text-stone-400 hover:text-[#4A1513] transition-transform duration-200 cursor-pointer"
                          title={`Toggle ${cat} list`}
                        >
                          <ChevronDown
                            size={12}
                            className={`transition-transform duration-300 ${
                              isExpanded ? "rotate-180 text-[#4A1513]" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Subcategories (only shown when expanded) */}
                  {subItems.length > 0 && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isExpanded ? "max-h-[260px] opacity-100 mt-1 mb-1.5" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-3.5 ml-1 border-l-2 border-[#4A1513]/20 space-y-1 py-1 max-h-[240px] overflow-y-auto hide-scrollbar">
                        {subItems.map((sub) => {
                          const isSubSelected = filters.subcategories.includes(sub);
                          return (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => {
                                handleCheckboxToggle("subcategories", sub, filters.subcategories);
                                if (selectedCategory !== cat && selectedCategory !== "All") {
                                  onSelectCategory(cat);
                                }
                                if (window.innerWidth < 1024) onClose();
                              }}
                              className={`text-[11.5px] text-left w-full flex items-center justify-between py-1 px-1.5 rounded-md transition-colors cursor-pointer ${
                                isSubSelected
                                  ? "font-bold text-[#4A1513] bg-[#4A1513]/5"
                                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                              }`}
                            >
                              <span className="truncate pr-2">{sub}</span>
                              {isSubSelected ? (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#4A1513] shrink-0" />
                              ) : (
                                <span className="w-2.5 h-2.5 rounded-full border border-stone-300 group-hover:border-stone-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* 2. SELLERS & BRANDS (DIRECTLY UNDER CATEGORIES - HelloThozhi Style) */}
        <Accordion title="Sellers &amp; Brands" badge={filters.brands.length > 0 ? filters.brands.length : undefined} defaultOpen={false}>
          <div className="pt-1">
            {/* Search Sellers / Brands */}
            <div className="mb-3 relative">
              <input 
                type="text" 
                placeholder="Search sellers or brands..." 
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200/90 rounded-lg py-1.5 pl-7 pr-3 text-[12px] text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#4A1513] transition"
              />
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
            </div>

            {/* List of Sellers & Brands with real-time product counts */}
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto hide-scrollbar pr-1">
              {filteredBrands.map((b) => {
                const isChecked = filters.brands.includes(b.name);
                return (
                  <label key={b.name} className="flex items-center justify-between group cursor-pointer py-1 px-1.5 rounded-md hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                        isChecked ? 'bg-[#4A1513] border-[#4A1513] text-white' : 'border-stone-300 bg-white group-hover:border-[#4A1513]'
                      }`}>
                        {isChecked && <Check size={10} strokeWidth={3} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`text-[12.5px] block truncate transition-colors ${
                          isChecked ? 'font-bold text-[#4A1513]' : 'text-stone-700 group-hover:text-stone-950'
                        }`}>
                          {b.name}
                        </span>
                        {b.city && (
                          <span className="text-[10px] text-stone-400 block truncate">
                            {b.city}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                      {b.verified && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold">
                          VERIFIED
                        </span>
                      )}
                      <span className="text-[11px] text-stone-400 font-mono">
                        ({b.count})
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isChecked}
                      onChange={() => handleCheckboxToggle('brands', b.name, filters.brands)}
                    />
                  </label>
                );
              })}
              {filteredBrands.length === 0 && (
                <p className="text-xs text-stone-400 py-2 text-center">No sellers found</p>
              )}
            </div>
          </div>
        </Accordion>

        {/* 3. DEPARTMENT-AWARE PRICE FILTER (Accurate rates tailored per section) */}
        <Accordion 
          title="Price Range" 
          badge={filters.priceRange ? "1" : undefined}
          defaultOpen={false}
        >
          <div className="pt-1 space-y-2">
            {/* Dynamic Price Tiers tailored to the current section */}
            <div className="space-y-1.5">
              {(DEPARTMENT_PRICE_TIERS[selectedDepartment] || DEPARTMENT_PRICE_TIERS["all"]).map((tier) => {
                const isSelected = filters.priceRange === tier.label;
                return (
                  <button
                    key={tier.label}
                    type="button"
                    onClick={() => onFilterChange("priceRange", isSelected ? null : tier.label)}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-[12px] transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#4A1513] text-white font-bold shadow-2xs"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    <span>{tier.label}</span>
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>

            {/* Custom Min / Max Price Input */}
            <div className="mt-2.5 pt-2.5 border-t border-stone-100">
              <span className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                Custom Budget (₹)
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="Min"
                  value={customMin}
                  onChange={(e) => setCustomMin(e.target.value)}
                  className="w-full min-w-0 px-2 py-1 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-900 focus:outline-none focus:border-[#4A1513]"
                />
                <span className="text-stone-400 text-xs">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={customMax}
                  onChange={(e) => setCustomMax(e.target.value)}
                  className="w-full min-w-0 px-2 py-1 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-900 focus:outline-none focus:border-[#4A1513]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customMin || customMax) {
                      const label = customMin && customMax 
                        ? `₹${customMin} – ₹${customMax}`
                        : customMin 
                        ? `₹${customMin}+` 
                        : `Under ₹${customMax}`;
                      onFilterChange("priceRange", label);
                    }
                  }}
                  className="px-2.5 py-1 bg-[#4A1513] hover:bg-[#350B0A] text-white text-[11px] font-bold rounded-md transition cursor-pointer shrink-0"
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        </Accordion>

        {/* Clear Filters (Only show if active) */}
        {hasActiveFilters && (
          <div className="py-4 border-t border-zinc-100 flex justify-between items-center mt-2">
            <span className="font-bold text-[13px] tracking-wide text-primary">Active Filters</span>
            <button 
              onClick={onClearAll}
              className="text-[11px] font-bold uppercase tracking-widest text-text-muted hover:text-[#4A1513] underline transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Left Column) */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0 self-start sticky top-28">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
            onClick={onClose} 
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
