"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Search, 
  Menu, 
  Heart, 
  ShoppingBag, 
  UserCircle2, 
  Camera, 
  X, 
  ChevronDown, 
  ChevronRight, 
  MapPin, 
  LogOut, 
  Sparkles,
  CalendarDays,
  Scissors,
  Wallet,
  Crown,
  MessageSquare,
  Package,
  ShieldCheck,
  User,
  Settings
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { SearchBar } from './SearchBar';
import { HeaderSearchBar } from './HeaderSearchBar';
import { useFemazonStore } from '@/context/FemazonStoreContext';
import { GlobalCartDrawer } from '@/components/cart/GlobalCartDrawer';
import { LogoutConfirmModal } from '@/components/auth/LogoutConfirmModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { WhatsAppFloatingButton } from '@/components/common/WhatsAppFloatingButton';
import { FemazonAIChatDrawer } from '@/components/chat/FemazonAIChatDrawer';
import { BrandLogo } from '@/components/common/BrandLogo';
import { ImageSearchModal } from '@/components/shop/ImageSearchModal';

type AuthSession = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// Rich Navigation Data
const richNavigationData: Record<string, any[]> = {
  SHOP: [
    {
      title: "CHUDITHAR & SUITS",
      items: [
        { name: "Anarkali Chudithar", href: "/search?q=Anarkali%20Chudithar" },
        { name: "Straight Cut Chudithar", href: "/search?q=Straight%20Cut%20Chudithar" },
        { name: "Pakistani Style Suit", href: "/search?q=Pakistani%20Style%20Suit" },
        { name: "Palazzo & Sharara Suit", href: "/search?q=Sharara%20Suit" },
        { name: "Kurta Dupatta Sets", href: "/search?q=Kurta%20with%20Dupatta%20Set" }
      ]
    },
    {
      title: "DRESSES",
      items: [
        { name: "Midi Dresses", href: "/search?q=Midi%20Dresses" },
        { name: "Maxi Dresses", href: "/search?q=Maxi%20Dresses" },
        { name: "Mini Dresses", href: "/search?q=Mini%20Dresses" },
        { name: "Party Dresses", href: "/search?q=Party%20Dresses" }
      ]
    },
    {
      title: "ETHNIC",
      items: [
        { name: "Kurtas", href: "/search?q=Kurtas" },
        { name: "Anarkali", href: "/search?q=Anarkali" },
        { name: "Ethnic Dresses", href: "/search?q=Ethnic%20Dresses" },
        { name: "Kurta Sets", href: "/search?q=Kurta%20Sets" }
      ]
    },
    {
      title: "WESTERN",
      items: [
        { name: "Bodycon", href: "/search?q=Bodycon" },
        { name: "A-Line", href: "/search?q=A-Line" },
        { name: "Shirt Dresses", href: "/search?q=Shirt%20Dresses" },
        { name: "Maxi Dresses", href: "/search?q=Western%20Maxi" }
      ]
    },
    {
      title: "TOPS & CO-ORDS",
      items: [
        { name: "Crop Tops", href: "/search?q=Crop%20Tops" },
        { name: "Shirts & Blouses", href: "/search?q=Shirts" },
        { name: "Co-ords & Sets", href: "/search?q=Co-ords" },
        { name: "Indo-Western", href: "/search?q=Indo-Western" }
      ]
    },
    {
      title: "OCCASION",
      items: [
        { name: "Wedding Edit", href: "/search?q=Wedding" },
        { name: "Party & Festive", href: "/search?q=Party" },
        { name: "Casual Everyday", href: "/search?q=Casual" },
        { name: "Workwear / Office", href: "/search?q=Office" }
      ]
    }
  ],
  Services: [
    {
      title: "BOOK AN EXPERT",
      items: [
        { name: "Personal Styling", desc: "Find your perfect look", href: "/services/styling", dotColor: "bg-rose-400", badge: "HOT" },
        { name: "Makeup Artist", desc: "For weddings & parties", href: "/services/makeup", dotColor: "bg-pink-400", badge: "" },
        { name: "Shopping Assistant", desc: "Help while you shop", href: "/services/shopping", dotColor: "bg-purple-400", badge: "NEW" },
      ]
    }
  ],
  "AI Wardrobe": [
    {
      title: "YOUR DIGITAL CLOSET",
      items: [
        { name: "Outfit Suggestions", desc: "AI-powered daily looks", href: "/ai-wardrobe", dotColor: "bg-indigo-400", badge: "BETA" },
        { name: "My Wardrobe", desc: "Organize your pieces", href: "/ai-wardrobe/closet", dotColor: "bg-teal-400", badge: "" }
      ]
    }
  ]
};

const mainNavLinks = [
  { name: 'EXPLORE', hasMega: false, href: '/' },
  { name: 'SHOP', hasMega: false, href: '/shop' },
  { name: 'CURATED', hasMega: false, href: '/curated' },
  { name: 'SERVICES', hasMega: true, href: '/services' },
  { name: 'AI WARDROBE', hasMega: false, href: '/ai-wardrobe' },
];

export interface MegaMenuColumn {
  title: string;
  items: { label: string; href: string }[];
}

export interface MegaMenuCard {
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

export interface CategoryMenuData {
  columns: MegaMenuColumn[];
  cards: MegaMenuCard[];
}

export const CATEGORY_MEGA_MENUS: Record<string, CategoryMenuData> = {
  "New": {
    columns: [
      {
        title: "WHAT'S NEW",
        items: [
          { label: "New In Kurta Sets", href: "/shop?category=Kurta+Sets&sort=newest" },
          { label: "New In Lehengas", href: "/shop?category=Lehengas&sort=newest" },
          { label: "New In Sarees", href: "/shop?category=Sarees&sort=newest" },
          { label: "New In Dresses & Gowns", href: "/shop?category=Dresses&sort=newest" },
          { label: "New In Indo-Western", href: "/shop?category=Indo-Western&sort=newest" },
          { label: "New In Co-ord Sets", href: "/shop?category=Co-ord+Sets&sort=newest" },
          { label: "Fresh Arrivals This Week", href: "/shop?sort=newest" },
        ],
      },
      {
        title: "TRENDING EDITS",
        items: [
          { label: "Runway Spotlight", href: "/curated" },
          { label: "Celebrity Styles", href: "/curated" },
          { label: "The Silk Legacy", href: "/shop?category=Sarees" },
          { label: "Pastel Luxury Edit", href: "/shop?category=Lehengas" },
          { label: "Minimalist Indian", href: "/shop?category=Kurta+Sets" },
          { label: "Statement Capes", href: "/shop?category=Indo-Western" },
        ],
      },
      {
        title: "OCCASION CAPSULE",
        items: [
          { label: "Summer Wedding 2026", href: "/shop?category=Wedding" },
          { label: "Destination Soiree", href: "/curated" },
          { label: "Resort Glam", href: "/shop?category=Western+Wear" },
          { label: "Festive Pre-Orders", href: "/shop?sort=newest" },
          { label: "Cocktail Nights", href: "/shop?category=Western+Wear" },
        ],
      },
    ],
    cards: [
      {
        title: "New Season Couture",
        subtitle: "Fresh Off The Runway",
        image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600",
        href: "/shop?sort=newest",
      },
      {
        title: "Celebrity Spotlight",
        subtitle: "Iconic Festive Looks",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=600",
        href: "/curated",
      },
      {
        title: "The Pastel Edit",
        subtitle: "Soft Hues & Florals",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Lehengas",
      },
      {
        title: "Modern Drape Sets",
        subtitle: "Contemporary Fusion",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Indo-Western",
      },
    ],
  },
  "Kurta Sets": {
    columns: [
      {
        title: "SHOP BY SILHOUETTE",
        items: [
          { label: "Anarkali Sets", href: "/shop?category=Kurta+Sets&silhouette=Anarkali" },
          { label: "Straight Kurta Sets", href: "/shop?category=Kurta+Sets&silhouette=Straight" },
          { label: "Sharara & Gharara Sets", href: "/shop?category=Kurta+Sets&silhouette=Sharara" },
          { label: "Palazzo Sets", href: "/shop?category=Kurta+Sets&silhouette=Palazzo" },
          { label: "Fusion Kurta Sets", href: "/shop?category=Kurta+Sets&silhouette=Fusion" },
          { label: "Short Kurtas & Dhoti", href: "/shop?category=Kurta+Sets&silhouette=Dhoti" },
          { label: "Jacket Kurta Sets", href: "/shop?category=Kurta+Sets&silhouette=Jacket" },
        ],
      },
      {
        title: "SHOP BY OCCASION",
        items: [
          { label: "Festive & Puja Wear", href: "/shop?category=Kurta+Sets&occasion=Festive" },
          { label: "Wedding Functions", href: "/shop?category=Kurta+Sets&occasion=Wedding" },
          { label: "Haldi & Mehendi Sets", href: "/shop?category=Kurta+Sets&occasion=Haldi" },
          { label: "Casual Everyday Luxe", href: "/shop?category=Kurta+Sets&occasion=Casual" },
          { label: "Office & Workwear", href: "/shop?category=Kurta+Sets&occasion=Workwear" },
          { label: "Evening Gatherings", href: "/shop?category=Kurta+Sets&occasion=Evening" },
        ],
      },
      {
        title: "SHOP BY FABRIC & WORK",
        items: [
          { label: "Pure Silk Sets", href: "/shop?category=Kurta+Sets&fabric=Silk" },
          { label: "Organza & Chiffon", href: "/shop?category=Kurta+Sets&fabric=Organza" },
          { label: "Chikankari & Lucknowi", href: "/shop?category=Kurta+Sets&work=Chikankari" },
          { label: "Mirror Work & Resham", href: "/shop?category=Kurta+Sets&work=Mirror" },
          { label: "Banarasi & Brocade", href: "/shop?category=Kurta+Sets&fabric=Banarasi" },
        ],
      },
    ],
    cards: [
      {
        title: "Royal Anarkalis",
        subtitle: "Grand Flared Ensembles",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Kurta+Sets&silhouette=Anarkali",
      },
      {
        title: "Sharara & Gharara",
        subtitle: "Festive Volume",
        image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Kurta+Sets&silhouette=Sharara",
      },
      {
        title: "Silk Straight Suits",
        subtitle: "Timeless Elegance",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Kurta+Sets&silhouette=Straight",
      },
      {
        title: "Daily Luxury Kurtas",
        subtitle: "Effortless Comfort",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Kurta+Sets&occasion=Casual",
      },
    ],
  },
  "Lehengas": {
    columns: [
      {
        title: "SHOP BY STYLE",
        items: [
          { label: "Bridal Lehengas", href: "/shop?category=Lehengas&style=Bridal" },
          { label: "Bridesmaid Lehengas", href: "/shop?category=Lehengas&style=Bridesmaid" },
          { label: "Fusion & Cape Lehengas", href: "/shop?category=Lehengas&style=Cape" },
          { label: "Printed Lehengas", href: "/shop?category=Lehengas&style=Printed" },
          { label: "Velvet Lehengas", href: "/shop?category=Lehengas&fabric=Velvet" },
          { label: "Jacket & Peplum Lehengas", href: "/shop?category=Lehengas&style=Jacket" },
          { label: "Tiered & Flared Lehengas", href: "/shop?category=Lehengas&style=Tiered" },
        ],
      },
      {
        title: "SHOP BY OCCASION",
        items: [
          { label: "Wedding Day / Pheras", href: "/shop?category=Lehengas&occasion=Wedding" },
          { label: "Sangeet Night Glam", href: "/shop?category=Lehengas&occasion=Sangeet" },
          { label: "Mehendi & Haldi", href: "/shop?category=Lehengas&occasion=Mehendi" },
          { label: "Reception Soiree", href: "/shop?category=Lehengas&occasion=Reception" },
          { label: "Engagement / Roka", href: "/shop?category=Lehengas&occasion=Engagement" },
          { label: "Cocktail Party", href: "/shop?category=Lehengas&occasion=Cocktail" },
        ],
      },
      {
        title: "TRENDING PALETTES",
        items: [
          { label: "Crimson & Royal Red", href: "/shop?category=Lehengas&color=Red" },
          { label: "Pastel & Blush Pink", href: "/shop?category=Lehengas&color=Pink" },
          { label: "Sunshine Yellow & Lime", href: "/shop?category=Lehengas&color=Yellow" },
          { label: "Emerald Green & Teal", href: "/shop?category=Lehengas&color=Green" },
          { label: "Champagne & Gold", href: "/shop?category=Lehengas&color=Gold" },
        ],
      },
    ],
    cards: [
      {
        title: "Royal Bridal Lehengas",
        subtitle: "Heritage Zardozi",
        image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Lehengas&style=Bridal",
      },
      {
        title: "Pastel Sangeet Sets",
        subtitle: "Glamour In Motion",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Lehengas&occasion=Sangeet",
      },
      {
        title: "Modern Cape Lehengas",
        subtitle: "Contemporary Silhouette",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Lehengas&style=Cape",
      },
      {
        title: "Mirror & Resham Work",
        subtitle: "Artisanal Craftsmanship",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Lehengas",
      },
    ],
  },
  "Sarees": {
    columns: [
      {
        title: "SHOP BY STYLE",
        items: [
          { label: "Pre-Draped Sarees", href: "/shop?category=Sarees&style=Pre-Draped" },
          { label: "Classic 6-Yard Drapes", href: "/shop?category=Sarees&style=Classic" },
          { label: "Saree Gowns", href: "/shop?category=Sarees&style=Saree-Gown" },
          { label: "Ruffle & Frill Sarees", href: "/shop?category=Sarees&style=Ruffle" },
          { label: "Cape & Jacket Sarees", href: "/shop?category=Sarees&style=Cape" },
          { label: "Pant & Dhoti Sarees", href: "/shop?category=Sarees&style=Pant" },
          { label: "Printed Designer Sarees", href: "/shop?category=Sarees&style=Printed" },
        ],
      },
      {
        title: "SHOP BY FABRIC",
        items: [
          { label: "Pure Banarasi Silk", href: "/shop?category=Sarees&fabric=Banarasi" },
          { label: "Kanjeevaram Heritage", href: "/shop?category=Sarees&fabric=Kanjeevaram" },
          { label: "Organza & Tissue", href: "/shop?category=Sarees&fabric=Organza" },
          { label: "Sequin & Shimmer", href: "/shop?category=Sarees&fabric=Sequin" },
          { label: "Chiffon & Georgette", href: "/shop?category=Sarees&fabric=Chiffon" },
          { label: "Handloom Tussar & Chanderi", href: "/shop?category=Sarees&fabric=Handloom" },
        ],
      },
      {
        title: "SHOP BY OCCASION",
        items: [
          { label: "Bridal Drapes", href: "/shop?category=Sarees&occasion=Bridal" },
          { label: "Reception Glamour", href: "/shop?category=Sarees&occasion=Reception" },
          { label: "Festive Puja Wear", href: "/shop?category=Sarees&occasion=Festive" },
          { label: "Cocktail & Party Nights", href: "/shop?category=Sarees&occasion=Cocktail" },
          { label: "Modern Farewell & Soiree", href: "/shop?category=Sarees&occasion=Farewell" },
        ],
      },
    ],
    cards: [
      {
        title: "Heritage Silk Sarees",
        subtitle: "Pure Kanjeevaram & Banarasi",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Sarees&fabric=Kanjeevaram",
      },
      {
        title: "Ready Pre-Draped",
        subtitle: "1-Minute Ready Luxury",
        image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Sarees&style=Pre-Draped",
      },
      {
        title: "Shimmer Cocktail Drapes",
        subtitle: "Sequin Magic",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Sarees&fabric=Sequin",
      },
      {
        title: "Floral Organza Sarees",
        subtitle: "Airy Summer Romance",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Sarees&fabric=Organza",
      },
    ],
  },
  "Ready To Ship": {
    columns: [
      {
        title: "EXPRESS DISPATCH",
        items: [
          { label: "Ready Kurta Sets", href: "/shop?category=Kurta+Sets&tag=Ready+To+Ship" },
          { label: "Ready Sarees", href: "/shop?category=Sarees&tag=Ready+To+Ship" },
          { label: "Ready Lehengas", href: "/shop?category=Lehengas&tag=Ready+To+Ship" },
          { label: "Ready Dresses & Gowns", href: "/shop?category=Dresses&tag=Ready+To+Ship" },
          { label: "Ready Indo-Western", href: "/shop?category=Indo-Western&tag=Ready+To+Ship" },
          { label: "Ready Co-ord Sets", href: "/shop?category=Co-ord+Sets&tag=Ready+To+Ship" },
        ],
      },
      {
        title: "DISPATCH TIMELINE",
        items: [
          { label: "Ships within 24 Hours", href: "/shop?tag=Ready+To+Ship&dispatch=24hr" },
          { label: "Ships within 48 Hours", href: "/shop?tag=Ready+To+Ship&dispatch=48hr" },
          { label: "Standard Sizes (S, M, L, XL)", href: "/shop?tag=Ready+To+Ship" },
          { label: "Express International Delivery", href: "/shop?tag=Ready+To+Ship" },
        ],
      },
      {
        title: "POPULAR EDITS",
        items: [
          { label: "Ready Under ₹15,000", href: "/shop?tag=Ready+To+Ship&price=under-15000" },
          { label: "Ready Wedding Guest Looks", href: "/shop?tag=Ready+To+Ship&occasion=Wedding" },
          { label: "Weekend Party Outfits", href: "/shop?tag=Ready+To+Ship&occasion=Party" },
          { label: "Last-Minute Festive Picks", href: "/shop?tag=Ready+To+Ship&occasion=Festive" },
        ],
      },
    ],
    cards: [
      {
        title: "24-Hour Kurta Sets",
        subtitle: "Instant Elegance",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Kurta+Sets&tag=Ready+To+Ship",
      },
      {
        title: "Express Sarees",
        subtitle: "Pre-stitched & Draped",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Sarees&tag=Ready+To+Ship",
      },
      {
        title: "Ready Bridal & Sangeet",
        subtitle: "Quick Dispatch Luxury",
        image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Lehengas&tag=Ready+To+Ship",
      },
      {
        title: "Quick Partywear",
        subtitle: "Evening Silhouettes",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Western+Wear&tag=Ready+To+Ship",
      },
    ],
  },
  "Wedding": {
    columns: [
      {
        title: "THE BRIDAL SUITE",
        items: [
          { label: "The Royal Bride", href: "/shop?category=Wedding&role=Bride" },
          { label: "Royal Bridal Lehengas", href: "/shop?category=Lehengas&style=Bridal" },
          { label: "Heritage Bridal Sarees", href: "/shop?category=Sarees&occasion=Bridal" },
          { label: "Bridal Trousseau Essentials", href: "/curated" },
          { label: "Reception Gowns & Trails", href: "/shop?category=Gowns&occasion=Reception" },
        ],
      },
      {
        title: "WEDDING GUEST & FAMILY",
        items: [
          { label: "The Bridesmaid Edit", href: "/curated" },
          { label: "Mother of the Bride", href: "/shop?category=Wedding&role=Mother" },
          { label: "Sister of the Groom", href: "/shop?category=Wedding&role=Sister" },
          { label: "Wedding Guest Glam", href: "/shop?category=Wedding&role=Guest" },
          { label: "Groomsmen Ensembles", href: "/shop?category=Wedding" },
        ],
      },
      {
        title: "WEDDING CEREMONIES",
        items: [
          { label: "Haldi Sunshine (Yellows)", href: "/shop?category=Wedding&ceremony=Haldi" },
          { label: "Mehendi & Sangeet Beats", href: "/shop?category=Wedding&ceremony=Sangeet" },
          { label: "Engagement / Ring Ceremony", href: "/shop?category=Wedding&ceremony=Engagement" },
          { label: "Grand Reception Soiree", href: "/shop?category=Wedding&ceremony=Reception" },
          { label: "Cocktail & After-Party", href: "/shop?category=Wedding&ceremony=Cocktail" },
        ],
      },
    ],
    cards: [
      {
        title: "The Royal Bride",
        subtitle: "Couture Masterpieces",
        image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Lehengas&style=Bridal",
      },
      {
        title: "Sangeet Glamour",
        subtitle: "Dance Floor Magic",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Wedding&ceremony=Sangeet",
      },
      {
        title: "Bridesmaid Squad",
        subtitle: "Coordinated Elegance",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=600",
        href: "/curated",
      },
      {
        title: "Haldi & Mehendi",
        subtitle: "Vibrant Celebrations",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Wedding&ceremony=Haldi",
      },
    ],
  },
  "Indo-Western": {
    columns: [
      {
        title: "SHOP BY SILHOUETTE",
        items: [
          { label: "Co-ord Sets", href: "/shop?category=Co-ord+Sets" },
          { label: "Cape & Jacket Sets", href: "/shop?category=Indo-Western&style=Cape" },
          { label: "Dhoti & Peplum Sets", href: "/shop?category=Indo-Western&style=Dhoti" },
          { label: "Saree Gowns", href: "/shop?category=Indo-Western&style=Saree-Gown" },
          { label: "Fusion Jumpsuits", href: "/shop?category=Indo-Western&style=Jumpsuit" },
          { label: "Tunics & Kaftans", href: "/shop?category=Kaftans" },
          { label: "Skirt & Bustier Sets", href: "/shop?category=Indo-Western&style=Skirt-Set" },
        ],
      },
      {
        title: "OCCASION FOCUS",
        items: [
          { label: "Cocktail Nights", href: "/shop?category=Indo-Western&occasion=Cocktail" },
          { label: "Sangeet Fusion", href: "/shop?category=Indo-Western&occasion=Sangeet" },
          { label: "Resort & Destination", href: "/shop?category=Indo-Western&occasion=Resort" },
          { label: "Pre-Wedding Brunches", href: "/shop?category=Indo-Western&occasion=Brunch" },
          { label: "Festive Parties", href: "/shop?category=Indo-Western&occasion=Festive" },
        ],
      },
      {
        title: "DESIGN HIGHLIGHTS",
        items: [
          { label: "Dramatic Drape Cuts", href: "/shop?category=Indo-Western" },
          { label: "Embellished Capes", href: "/shop?category=Indo-Western&style=Cape" },
          { label: "Modern Corsetry", href: "/shop?category=Indo-Western" },
          { label: "High-Slit Tunics", href: "/shop?category=Indo-Western" },
          { label: "Metallic & Sequin Touches", href: "/shop?category=Indo-Western" },
        ],
      },
    ],
    cards: [
      {
        title: "Statement Co-ords",
        subtitle: "Effortless Chic",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Co-ord+Sets",
      },
      {
        title: "Designer Cape Sets",
        subtitle: "Layered Sophistication",
        image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Indo-Western&style=Cape",
      },
      {
        title: "Modern Saree Gowns",
        subtitle: "Red Carpet Fusion",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Indo-Western&style=Saree-Gown",
      },
      {
        title: "Fusion Jumpsuits",
        subtitle: "Modern Power Silhouette",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Indo-Western&style=Jumpsuit",
      },
    ],
  },
  "Western Wear": {
    columns: [
      {
        title: "DRESSES & GOWNS",
        items: [
          { label: "Evening Gowns", href: "/shop?category=Gowns" },
          { label: "Midi & Maxi Dresses", href: "/shop?category=Dresses" },
          { label: "Bodycon & Party Dresses", href: "/shop?category=Dresses&style=Bodycon" },
          { label: "Cocktail Dresses", href: "/shop?category=Dresses&occasion=Cocktail" },
          { label: "Shirt & Wrap Dresses", href: "/shop?category=Dresses&style=Shirt" },
        ],
      },
      {
        title: "TOPS & TAILORING",
        items: [
          { label: "Blazers & Pantsuits", href: "/shop?category=Western+Wear&type=Pantsuit" },
          { label: "Crop Tops & Corsets", href: "/shop?category=Tops&style=Corset" },
          { label: "Luxury Silk Blouses", href: "/shop?category=Tops&fabric=Silk" },
          { label: "Tailored Trousers", href: "/shop?category=Western+Wear&type=Trousers" },
          { label: "Designer Jumpsuits", href: "/shop?category=Western+Wear&type=Jumpsuit" },
        ],
      },
      {
        title: "CURATED EDITS",
        items: [
          { label: "Red Carpet & Black Tie", href: "/shop?category=Gowns" },
          { label: "Resort & Summer Holiday", href: "/shop?category=Western+Wear&occasion=Resort" },
          { label: "Power Dressing / Office", href: "/shop?category=Western+Wear&occasion=Office" },
          { label: "High-Street Nightout", href: "/shop?category=Dresses&occasion=Party" },
        ],
      },
    ],
    cards: [
      {
        title: "Red Carpet Gowns",
        subtitle: "Sculpted Elegance",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Gowns",
      },
      {
        title: "Chic Evening Dresses",
        subtitle: "Cocktail Glamour",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Dresses",
      },
      {
        title: "Resortwear & Maxis",
        subtitle: "Effortless Breeze",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Western+Wear&occasion=Resort",
      },
      {
        title: "Tailored Pantsuits",
        subtitle: "Modern Luxury",
        image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Western+Wear&type=Pantsuit",
      },
    ],
  },
  "Dresses": {
    columns: [
      {
        title: "LENGTH & SILHOUETTE",
        items: [
          { label: "Midi Dresses", href: "/shop?category=Dresses&silhouette=Midi" },
          { label: "Maxi Dresses", href: "/shop?category=Dresses&silhouette=Maxi" },
          { label: "Mini & Short Dresses", href: "/shop?category=Dresses&silhouette=Mini" },
          { label: "Bodycon Silhouettes", href: "/shop?category=Dresses&silhouette=Bodycon" },
          { label: "A-Line & Flared", href: "/shop?category=Dresses&silhouette=A-Line" },
          { label: "Wrap & Shirt Dresses", href: "/shop?category=Dresses&silhouette=Wrap" },
        ],
      },
      {
        title: "SHOP BY OCCASION",
        items: [
          { label: "Evening & Cocktail", href: "/shop?category=Dresses&occasion=Cocktail" },
          { label: "Vacation & Resortwear", href: "/shop?category=Dresses&occasion=Resort" },
          { label: "Day Brunches & High Tea", href: "/shop?category=Dresses&occasion=Brunch" },
          { label: "Party & Club Glam", href: "/shop?category=Dresses&occasion=Party" },
          { label: "Casual Everyday Chic", href: "/shop?category=Dresses&occasion=Casual" },
        ],
      },
      {
        title: "TRENDING FABRICS",
        items: [
          { label: "Satin & Silk Slip Dresses", href: "/shop?category=Dresses&fabric=Satin" },
          { label: "Pure Linen & Breathable Cotton", href: "/shop?category=Dresses&fabric=Linen" },
          { label: "Organza & Chiffon Florals", href: "/shop?category=Dresses&fabric=Organza" },
          { label: "Pleated & Velvet Luxe", href: "/shop?category=Dresses&fabric=Velvet" },
        ],
      },
    ],
    cards: [
      {
        title: "Evening Gowns & Dresses",
        subtitle: "Timeless Allure",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Dresses&occasion=Cocktail",
      },
      {
        title: "Floral Resort Maxis",
        subtitle: "Sun-Drenched Vacation",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Dresses&occasion=Resort",
      },
      {
        title: "Cocktail Bodycons",
        subtitle: "Statement Nightout",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Dresses&style=Bodycon",
      },
      {
        title: "Luxury Midi Dresses",
        subtitle: "Day To Dinner",
        image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Dresses&length=Midi",
      },
    ],
  },
  "Femazon Services": {
    columns: [
      {
        title: "BOOK AN EXPERT",
        items: [
          { label: "Personal Stylist Consultation", href: "/services/styling" },
          { label: "Bridal Makeup & Hair Artists", href: "/services/makeup" },
          { label: "Personal Shopping Assistant", href: "/services/shopping-assistant" },
          { label: "Bridal Draping & Tailoring", href: "/services/draping" },
          { label: "Mehndi Artists Directory", href: "/services/mehndi" },
        ],
      },
      {
        title: "DIGITAL INNOVATION",
        items: [
          { label: "Personal Couture Styling", href: "/services/styling" },
          { label: "AI Digital Wardrobe", href: "/wardrobe" },
          { label: "24/7 WhatsApp Stylist Concierge", href: "https://wa.me/919876543210" },
          { label: "Custom Measurements Fit", href: "/measurements" },
        ],
      },
      {
        title: "PRIVILEGES & REWARDS",
        items: [
          { label: "Femazon Privé Tier", href: "/wallet" },
          { label: "Femazon Credits & Wallet", href: "/wallet" },
          { label: "Become a Seller", href: "/seller/register" },
          { label: "Join as Service Provider", href: "/services/provider/register" },
        ],
      },
    ],
    cards: [
      {
        title: "Personal Styling",
        subtitle: "Couture Styling Session",
        image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600",
        href: "/services/styling",
      },
      {
        title: "Boutique Concierge",
        subtitle: "Luxury Fashion Services",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=600",
        href: "/services",
      },
      {
        title: "Bridal Makeup",
        subtitle: "Certified Luxury Artists",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=600",
        href: "/services/makeup",
      },
      {
        title: "AI Digital Wardrobe",
        subtitle: "Organize & Mix-Match",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=600",
        href: "/wardrobe",
      },
    ],
  },
  "On Sale": {
    columns: [
      {
        title: "DISCOUNT TIERS",
        items: [
          { label: "Up To 50% Off", href: "/shop?discount=50" },
          { label: "Up To 40% Off", href: "/shop?discount=40" },
          { label: "Up To 30% Off", href: "/shop?discount=30" },
          { label: "Special Festive Offers", href: "/shop?discount=festive" },
          { label: "Clearance Couture", href: "/shop?discount=clearance" },
        ],
      },
      {
        title: "SHOP BY CATEGORY SALE",
        items: [
          { label: "Kurta Sets On Sale", href: "/shop?category=Kurta+Sets&onSale=true" },
          { label: "Sarees On Sale", href: "/shop?category=Sarees&onSale=true" },
          { label: "Lehengas On Sale", href: "/shop?category=Lehengas&onSale=true" },
          { label: "Dresses & Gowns On Sale", href: "/shop?category=Dresses&onSale=true" },
          { label: "Indo-Western On Sale", href: "/shop?category=Indo-Western&onSale=true" },
        ],
      },
      {
        title: "PRICE EDIT",
        items: [
          { label: "Under ₹5,000", href: "/shop?price=under-5000" },
          { label: "₹5,000 - ₹15,000", href: "/shop?price=5000-15000" },
          { label: "₹15,000 - ₹30,000", href: "/shop?price=15000-30000" },
          { label: "Luxury Designer Deals", href: "/shop?onSale=true" },
        ],
      },
    ],
    cards: [
      {
        title: "Festive Sale Picks",
        subtitle: "Up To 50% Off",
        image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600",
        href: "/shop?discount=50",
      },
      {
        title: "Designer Kurta Deals",
        subtitle: "Limited Time Offers",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Kurta+Sets&onSale=true",
      },
      {
        title: "Saree Steals",
        subtitle: "Pure Silk & Chiffon",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Sarees&onSale=true",
      },
      {
        title: "Evening Glam Sale",
        subtitle: "Gowns & Fusion",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=600",
        href: "/shop?category=Western+Wear&onSale=true",
      },
    ],
  },
};

// Exact categories matching Aza Fashions & Femazon Luxury Theme
export const SUB_NAV_ITEMS = [
  "New",
  "Kurta Sets",
  "Lehengas",
  "Sarees",
  "Ready To Ship",
  "Wedding",
  "Indo-Western",
  "Western Wear",
  "Dresses",
  "Femazon Services",
  "On Sale"
];

export function SiteLayout({
  children,
  authSession,
}: {
  children: React.ReactNode;
  authSession?: AuthSession | null;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isImageSearchModalOpen, setIsImageSearchModalOpen] = useState(false);

  // Profile Dropdown Controlled State
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Global Real-time Store State
  const { 
    cartCount, 
    openCart, 
    wishlistCount, 
    user, 
    bookingCount, 
    requestLogout, 
    openAuthModal, 
    walletBalance 
  } = useFemazonStore();

  const isLoggedIn = Boolean(user || authSession);
  const role = user?.role || authSession?.role;
  const userFirstName = user?.firstName || (user?.name ? user.name.split(' ')[0] : 'Member');

  // Handle Click Outside Profile Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle ESC Key to Close Profile Dropdown
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleAccordion = (name: string) => {
    setActiveAccordion(prev => prev === name ? null : name);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Check if current route is dedicated portal or auth page
  const isPortalOrAuthPage = 
    pathname?.startsWith('/vendor') || 
    pathname?.startsWith('/admin') || 
    pathname?.startsWith('/seller') ||
    pathname === '/login' || 
    pathname === '/register';

  if (isPortalOrAuthPage) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] text-stone-900 font-sans flex flex-col justify-between antialiased selection:bg-[#4A1513] selection:text-white">
        {children}
        {/* Global Shopping Cart Drawer */}
        <GlobalCartDrawer />
        {/* Verified Logout Confirmation Modal */}
        <LogoutConfirmModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-main font-sans overflow-x-hidden">
      
      {/* 1. Top Announcement Banner */}
      <div className="w-full bg-[#4A1513] py-2 px-6">
        <div className="mx-auto flex max-w-[1400px] items-center justify-center text-[11px] font-bold uppercase tracking-widest text-white/90">
          Prepaid orders get priority shipping 🚚
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-white transition-all shadow-xs border-b border-stone-200">
        {/* Tier 1: Logo, Search, Actions */}
        <div className="mx-auto flex h-[88px] md:h-[96px] max-w-[1400px] items-center px-4 sm:px-6 relative gap-4 sm:gap-8">
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex md:hidden text-text-main transition hover:text-primary cursor-pointer p-1"
            aria-label="Open Navigation Menu"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Left: Brand Logo */}
          <BrandLogo />

          {/* Center: Search Bar with Aza Fashions Top Searches & Top Products Popover */}
          <div className="flex-1 max-w-2xl mx-auto hidden md:block">
            <HeaderSearchBar />
          </div>

          {/* Right: Actions (Store, Bookings, Wishlist, Cart, Profile) */}
          <div className="flex shrink-0 items-center justify-end gap-4 sm:gap-6 lg:gap-7 ml-auto">
            
            {/* Find a Store */}
            <Link href="/stores" className="hidden xl:flex items-center gap-2 text-stone-700 hover:text-[#4A1513] transition-colors">
              <MapPin size={19} strokeWidth={1.5} />
              <span className="text-[13px] font-medium">Find a store</span>
            </Link>

            {/* DEDICATED BOOKING ICON WITH LIVE BADGE */}
            <Link 
              href="/bookings" 
              className="relative text-stone-800 hover:text-[#4A1513] transition-colors group cursor-pointer"
              title="My Bookings"
            >
              <CalendarDays size={22} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
              {bookingCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-[18px] min-w-[18px] px-1 items-center justify-center rounded-full bg-[#4A1513] text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
                  {bookingCount}
                </span>
              )}
            </Link>

            {/* Wishlist Counter */}
            <Link 
              href="/wishlist" 
              className="relative text-stone-800 hover:text-[#4A1513] transition-colors group"
              title="Wishlist"
            >
              <Heart size={22} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#4A1513] text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link (Full View Page) */}
            <Link 
              href="/cart"
              className="relative text-stone-800 hover:text-[#4A1513] transition-colors group cursor-pointer"
              title="Shopping Bag"
            >
              <ShoppingBag size={22} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#4A1513] text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* PROFILE DROPDOWN (Aza Fashions Luxury Method) */}
            <div className="relative flex items-center" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="relative text-stone-800 hover:text-[#4A1513] transition-colors focus:outline-none cursor-pointer group p-1"
                aria-label="Account Menu"
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="true"
                title={isLoggedIn ? `Account (${userFirstName})` : "Account Login"}
              >
                {isLoggedIn ? (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FAF7F5] border border-stone-300 group-hover:border-[#4A1513] text-[#4A1513] flex items-center justify-center font-serif font-bold text-xs transition-colors shadow-2xs">
                    {userFirstName.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <UserCircle2 size={23} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
                )}
              </button>

              {/* Luxury Aza-Style Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className={`absolute right-0 top-full mt-2.5 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.15)] z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-sans border border-stone-200/90 ${
                  isLoggedIn ? 'w-80 rounded-3xl p-3' : 'w-[310px] sm:w-[330px] rounded-2xl p-6 sm:p-7'
                }`}>
                  
                  {/* Top Caret Arrow pointing directly under profile icon */}
                  <div className="absolute -top-2 right-3.5 w-4 h-4 bg-white border-t border-l border-stone-200/90 rotate-45 z-10" />

                  {/* Dropdown Content */}
                  {isLoggedIn ? (
                    <>
                      {/* Dropdown Header Card */}
                      <div className="p-3.5 bg-gradient-to-r from-[#FAF7F5] to-rose-50/40 rounded-2xl border border-stone-200/70 mb-2 relative z-20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#4A1513] text-white flex items-center justify-center font-serif text-sm font-bold shadow-xs shrink-0">
                            {userFirstName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="text-[13.5px] font-bold text-stone-900 truncate">
                                {user?.name || userFirstName}
                              </p>
                              <Crown size={12} className="text-amber-600 shrink-0" />
                            </div>
                            <p className="text-[11px] text-stone-500 truncate">
                              {user?.email || user?.phone || 'Femazon Privé Member'}
                            </p>
                          </div>
                        </div>

                        {/* Wallet Balance Quick Chip */}
                        <Link
                          href="/wallet"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="mt-2.5 flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200/80 hover:border-[#4A1513] transition text-xs group cursor-pointer"
                        >
                          <div className="flex items-center gap-2 text-stone-700 font-medium">
                            <Wallet size={14} className="text-[#4A1513]" />
                            <span>Femazon Credits</span>
                          </div>
                          <div className="flex items-center gap-1 font-mono font-bold text-[#4A1513]">
                            <span>₹{walletBalance.toLocaleString('en-IN')}</span>
                            <ChevronRight size={13} className="text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </Link>
                      </div>
                    </>
                  ) : (
                    /* Exact Aza Fashions Logged-Out Card with White & Maroon Theme */
                    <div className="text-center relative z-20">
                      <h3 className="text-xl sm:text-[22px] font-bold text-[#4A1513] tracking-tight leading-tight font-serif">
                        Log in or Sign up
                      </h3>
                      <p className="text-[13px] text-stone-500 mt-1.5 mb-6 leading-snug">
                        for a personalized shopping experience
                      </p>

                      {/* Primary Button: Sign in with Email (Maroon) */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          openAuthModal('otp');
                        }}
                        className="w-full py-3.5 px-4 bg-[#4A1513] hover:bg-[#380E0C] active:scale-[0.99] text-white font-bold text-[14px] rounded-xl transition-all shadow-xs cursor-pointer block text-center"
                      >
                        Sign in with Email
                      </button>

                      {/* Secondary Button: Sign in with Google (White with Maroon Hover) */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          openAuthModal('otp');
                        }}
                        className="w-full mt-3 py-3 px-4 bg-white hover:bg-stone-50 hover:border-[#4A1513]/40 hover:text-[#4A1513] active:scale-[0.99] border border-stone-300 rounded-xl text-stone-700 font-medium text-[13.5px] transition flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs"
                      >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Sign in with Google</span>
                      </button>
                    </div>
                  )}

                  {/* Account Navigation Options for Logged-In User */}
                  {isLoggedIn && (
                    <div className="py-1 text-[13px] text-stone-700 space-y-0.5 relative z-20">
                    
                    {/* Orders */}
                    <Link 
                      href="/orders" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-[#FAF7F5] hover:text-[#4A1513] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Package size={16} className="text-stone-400 group-hover:text-[#4A1513] transition-colors" />
                        <span className="font-medium">My Orders &amp; Returns</span>
                      </div>
                      <ChevronRight size={14} className="text-stone-300 group-hover:text-[#4A1513] group-hover:translate-x-0.5 transition-all" />
                    </Link>

                    {/* Bookings */}
                    <Link 
                      href="/bookings" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-[#FAF7F5] hover:text-[#4A1513] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <CalendarDays size={16} className="text-stone-400 group-hover:text-[#4A1513] transition-colors" />
                        <span className="font-medium">My Appointments &amp; Bookings</span>
                      </div>
                      {bookingCount > 0 ? (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#4A1513] text-white text-[10px] font-bold">
                          {bookingCount}
                        </span>
                      ) : (
                        <ChevronRight size={14} className="text-stone-300 group-hover:text-[#4A1513] group-hover:translate-x-0.5 transition-all" />
                      )}
                    </Link>

                    {/* Wishlist */}
                    <Link 
                      href="/wishlist" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-[#FAF7F5] hover:text-[#4A1513] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Heart size={16} className="text-stone-400 group-hover:text-[#4A1513] transition-colors" />
                        <span className="font-medium">My Wishlist</span>
                      </div>
                      {wishlistCount > 0 ? (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#4A1513]/10 text-[#4A1513] text-[10px] font-bold">
                          {wishlistCount}
                        </span>
                      ) : (
                        <ChevronRight size={14} className="text-stone-300 group-hover:text-[#4A1513] group-hover:translate-x-0.5 transition-all" />
                      )}
                    </Link>

                    {/* AI Wardrobe */}
                    <Link 
                      href="/wardrobe" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-[#FAF7F5] hover:text-[#4A1513] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles size={16} className="text-stone-400 group-hover:text-[#4A1513] transition-colors" />
                        <span className="font-medium">AI Digital Wardrobe</span>
                      </div>
                      <span className="px-1.5 py-0.2 text-[9px] font-bold text-amber-700 bg-amber-50 rounded">AI</span>
                    </Link>

                    {/* Custom Measurements (Aza Fashions Feature) */}
                    <Link 
                      href="/measurements" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-[#FAF7F5] hover:text-[#4A1513] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Scissors size={16} className="text-stone-400 group-hover:text-[#4A1513] transition-colors" />
                        <span className="font-medium">My Measurements &amp; Fit</span>
                      </div>
                      <span className="px-1.5 py-0.2 text-[9px] font-bold text-rose-700 bg-rose-50 rounded">CUSTOM</span>
                    </Link>

                    {/* Wallet & Credits */}
                    <Link 
                      href="/wallet" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-[#FAF7F5] hover:text-[#4A1513] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Wallet size={16} className="text-stone-400 group-hover:text-[#4A1513] transition-colors" />
                        <span className="font-medium">Wallet &amp; Privileges</span>
                      </div>
                      <ChevronRight size={14} className="text-stone-300 group-hover:text-[#4A1513] group-hover:translate-x-0.5 transition-all" />
                    </Link>

                    {/* Saved Addresses */}
                    <Link 
                      href="/addresses" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-[#FAF7F5] hover:text-[#4A1513] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-stone-400 group-hover:text-[#4A1513] transition-colors" />
                        <span className="font-medium">Saved Addresses</span>
                      </div>
                      <ChevronRight size={14} className="text-stone-300 group-hover:text-[#4A1513] group-hover:translate-x-0.5 transition-all" />
                    </Link>

                    {/* Settings & Profile */}
                    <Link 
                      href="/settings" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-[#FAF7F5] hover:text-[#4A1513] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Settings size={16} className="text-stone-400 group-hover:text-[#4A1513] transition-colors" />
                        <span className="font-medium">Account Settings</span>
                      </div>
                      <ChevronRight size={14} className="text-stone-300 group-hover:text-[#4A1513] group-hover:translate-x-0.5 transition-all" />
                    </Link>

                    {/* WhatsApp Stylist Concierge */}
                    <a 
                      href="https://wa.me/919876543210?text=Hi%20Femazon%20Stylist%20team,%20I%20would%20like%20assistance" 
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquare size={16} className="text-emerald-600 shrink-0" />
                        <span className="font-medium">WhatsApp Stylist Concierge</span>
                      </div>
                      <span className="px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 bg-emerald-100 rounded">24/7</span>
                    </a>

                    {role === 'VENDOR' && (
                      <Link 
                        href="/seller/dashboard" 
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[#4A1513] font-semibold hover:bg-[#FAF7F5] transition-colors"
                      >
                        <span>Vendor Dashboard</span>
                        <ChevronRight size={14} />
                      </Link>
                    )}
                    {role === 'ADMIN' && (
                      <Link 
                        href="/admin/dashboard" 
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[#4A1513] font-semibold hover:bg-[#FAF7F5] transition-colors"
                      >
                        <span>Admin Dashboard</span>
                        <ChevronRight size={14} />
                      </Link>
                    )}

                    {/* Logout Button */}
                    <div className="my-1.5 border-t border-stone-100" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        requestLogout();
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <LogOut size={16} />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}

                </div>
              )}
            </div>

          </div>
        </div>

        {/* Tier 2: Category Navigation Menu */}
        <div className="w-full border-t border-stone-100 bg-white hidden md:block">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between h-[46px] relative">
            {SUB_NAV_ITEMS.map((item) => {
              const menuData = CATEGORY_MEGA_MENUS[item];
              const isSale = item === 'On Sale';
              const isServices = item === 'Femazon Services';
              const isVton = item === 'Virtual Try On';

              const href = isVton
                ? '/virtual-try-on'
                : isServices
                ? '/services'
                : isSale
                ? '/shop?onSale=true'
                : `/shop?category=${encodeURIComponent(item)}`;

              return (
                <div key={item} className="group flex h-full items-center">
                  <Link 
                    href={href} 
                    className={`flex h-full items-center text-[13px] tracking-wide transition-colors border-b-[3px] border-transparent group-hover:border-[#4A1513] ${
                      isSale
                        ? 'text-[#4A1513] font-bold'
                        : 'text-stone-700 hover:text-[#4A1513] hover:font-medium'
                    }`}
                  >
                    {item}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {menuData && (
                    <div className="absolute left-0 right-0 top-full z-50 invisible opacity-0 translate-y-1 bg-white shadow-xl border-t border-stone-200/90 transition-all duration-300 ease-out group-hover:visible group-hover:opacity-100 group-hover:translate-y-0">
                      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-5 flex gap-8 items-stretch bg-white">
                        
                        {/* Left Subcategory Columns */}
                        <div className="w-[44%] grid grid-cols-3 gap-6 py-1">
                          {menuData.columns.map((col, idx) => (
                            <div key={col.title} className={`flex flex-col ${idx !== menuData.columns.length - 1 ? 'border-r border-stone-100 pr-4' : ''}`}>
                              <h4 className="font-serif text-[11px] font-bold tracking-[0.16em] uppercase text-[#4A1513] mb-3 pb-1 border-b border-stone-200/70 whitespace-nowrap">
                                {col.title}
                              </h4>
                              <ul className="flex flex-col gap-1.5">
                                {col.items.map((linkItem) => (
                                  <li key={linkItem.label}>
                                    <Link
                                      href={linkItem.href}
                                      className="text-[12.5px] text-stone-700 hover:text-[#4A1513] hover:font-medium hover:translate-x-1 transition-all duration-200 block py-0.5 leading-snug line-clamp-1"
                                    >
                                      {linkItem.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        <div className="w-[1px] bg-stone-200/70 my-1 self-stretch" />

                        {/* Right Visual Category Cards */}
                        <div className="w-[56%] flex flex-col justify-stretch py-1">
                          <div className="grid grid-cols-4 gap-3.5 h-full">
                            {menuData.cards.map((card) => (
                              <Link
                                key={card.title}
                                href={card.href}
                                className="group/card flex flex-col h-full bg-white rounded-xl overflow-hidden border border-stone-200/80 hover:border-[#4A1513]/50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 cursor-pointer"
                              >
                                <div className="relative w-full flex-1 min-h-[145px] overflow-hidden bg-stone-100">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={card.image}
                                    alt={card.title}
                                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover/card:scale-105"
                                  />
                                </div>
                                <div className="px-2.5 py-2.5 bg-white flex items-center justify-between gap-1 shrink-0 border-t border-stone-100">
                                  <div className="min-w-0 flex-1">
                                    <h5 className="font-serif text-[11px] font-semibold text-stone-900 group-hover/card:text-[#4A1513] transition-colors leading-tight truncate">
                                      {card.title}
                                    </h5>
                                    <p className="text-[9.5px] text-stone-400 truncate mt-0.5">
                                      {card.subtitle}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-0.5 text-[8.5px] font-bold tracking-[0.1em] uppercase text-[#4A1513] shrink-0 ml-1">
                                    <span>SHOP</span>
                                    <span>→</span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Sliding Drawer */}
      <div 
        className={`fixed inset-0 z-50 bg-[#4A1513]/60 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-[340px] bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/femazon-logo.png" 
              alt="Femazon" 
              className="h-9 w-auto object-contain" 
            />
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-stone-500 hover:text-stone-900 p-1 cursor-pointer">
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="px-5 pt-3 pb-2">
          <SearchBar className="!max-w-full" />
        </div>

        {/* Mobile Nav Links & Accordion */}
        <div className="flex-1 overflow-y-auto px-5 py-3 divide-y divide-stone-100">
          {/* Top Quick Links */}
          <div className="pb-2 space-y-1">
            {mainNavLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-[12.5px] font-bold uppercase tracking-wider text-stone-900 hover:text-[#4A1513]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Aza Fashions Category List Accordion */}
          <div className="py-2 space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#4A1513] px-1 py-1.5">
              Categories
            </p>
            {SUB_NAV_ITEMS.map((item) => {
              const menuData = CATEGORY_MEGA_MENUS[item];
              const isExpanded = activeAccordion === item;
              const isSale = item === 'On Sale';

              if (!menuData) {
                return (
                  <Link
                    key={item}
                    href={item === 'Virtual Try On' ? '/virtual-try-on' : `/shop?category=${encodeURIComponent(item)}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-2.5 px-2 rounded-lg text-[13px] font-medium transition ${
                      isSale ? 'text-[#4A1513] font-bold' : 'text-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    <span>{item}</span>
                    <ChevronRight size={14} className="text-stone-400" />
                  </Link>
                );
              }

              return (
                <div key={item} className="rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item)}
                    className={`w-full flex items-center justify-between py-2.5 px-2 text-[13px] font-medium transition cursor-pointer ${
                      isSale ? 'text-[#4A1513] font-bold' : 'text-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    <span>{item}</span>
                    <ChevronDown
                      size={14}
                      className={`text-stone-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#4A1513]' : ''}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="bg-[#FAF7F5] rounded-xl p-3 mb-1.5 space-y-3">
                      {menuData.columns.map((col) => (
                        <div key={col.title}>
                          <h6 className="text-[10px] font-bold tracking-wider uppercase text-[#4A1513] mb-1">
                            {col.title}
                          </h6>
                          <div className="grid grid-cols-1 gap-1 pl-1">
                            {col.items.slice(0, 5).map((subItem) => (
                              <Link
                                key={subItem.label}
                                href={subItem.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-[12px] text-stone-600 hover:text-[#4A1513] py-0.5 block truncate"
                              >
                                • {subItem.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                      <Link
                        href={`/shop?category=${encodeURIComponent(item)}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-center py-1.5 bg-white border border-[#4A1513]/30 text-[#4A1513] text-[11px] font-bold uppercase tracking-wider rounded-lg"
                      >
                        View All {item} →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Bottom Actions */}
        <div className="border-t border-stone-200 p-6 bg-[#FAF7F5]/50 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Link 
              href="/bookings" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-[#4A1513]"
            >
              <CalendarDays size={16} /> 
              <span>Bookings {bookingCount > 0 ? `(${bookingCount})` : ''}</span>
            </Link>

            <Link 
              href="/wishlist" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-[#4A1513]"
            >
              <Heart size={16} /> 
              <span>Wishlist</span>
            </Link>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
              <span className="text-xs font-semibold text-stone-700">Hi, {userFirstName} 👋</span>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  requestLogout();
                }}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 bg-[#4A1513] text-white text-xs font-bold uppercase tracking-widest text-center rounded-full transition shadow-xs"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>

      <main>{children}</main>

      {/* 5-Column Luxury Footer */}
      <footer className="bg-white border-t border-stone-200 pt-16 pb-8 text-stone-900">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-[#4A1513] mb-2">Shop</h4>
              <Link href="/shop?sort=newest" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">New Arrivals</Link>
              <Link href="/shop?category=clothing" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Clothing</Link>
              <Link href="/shop?category=shoes" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Shoes</Link>
              <Link href="/shop?category=accessories" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Accessories</Link>
              <Link href="/shop?category=beauty" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Beauty</Link>
              <Link href="/shop?category=offers" className="text-xs font-medium text-[#4A1513] hover:underline transition">Offers</Link>
            </div>

            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-[#4A1513] mb-2">Services</h4>
              <Link href="/services/makeup" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Makeup</Link>
              <Link href="/services/mehndi" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Mehndi</Link>
              <Link href="/services/salon" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Salon</Link>
              <Link href="/services/styling" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Personal Styling</Link>
              <Link href="/services/shopping-assistant" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Shopping Assistant</Link>
            </div>

            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-[#4A1513] mb-2">AI</h4>
              <Link href="/ai-wardrobe" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">AI Wardrobe</Link>
              <Link href="/ai-wardrobe/suggestions" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Outfit Suggestions</Link>
            </div>

            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-[#4A1513] mb-2">Customer Care</h4>
              <Link href="/contact" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Contact Us</Link>
              <Link href="/track-order" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Track Order</Link>
              <Link href="/shipping" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Shipping</Link>
              <Link href="/returns" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Returns</Link>
              <Link href="/faqs" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">FAQs</Link>
            </div>

            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <h4 className="font-serif text-sm font-bold tracking-widest uppercase text-[#4A1513] mb-2">Company</h4>
              <Link href="/about" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">About Femazon</Link>
              <Link href="/vendor/register" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Become a Seller</Link>
              <Link href="/services/provider/register" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Become a Service Provider</Link>
              <Link href="/services/shopping-assistant/become-assistant" className="text-xs font-medium text-stone-500 hover:text-[#4A1513] transition">Become a Shopping Assistant</Link>
            </div>

          </div>

          <div className="border-t border-stone-200 pt-8 pb-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 text-stone-500">
              <a href="#" className="hover:text-[#4A1513] transition"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg></a>
              <a href="#" className="hover:text-[#4A1513] transition"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path></svg></a>
            </div>

            <div className="flex gap-4 items-center">
              <span className="text-xs font-bold text-stone-500">SECURE CHECKOUT</span>
              <div className="flex gap-2">
                <div className="h-6 w-10 bg-stone-100 rounded border border-stone-200 flex items-center justify-center text-[8px] font-bold">VISA</div>
                <div className="h-6 w-10 bg-stone-100 rounded border border-stone-200 flex items-center justify-center text-[8px] font-bold">MC</div>
                <div className="h-6 w-10 bg-stone-100 rounded border border-stone-200 flex items-center justify-center text-[8px] font-bold">AMEX</div>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-stone-500 font-bold uppercase tracking-widest">
            <p>© {new Date().getFullYear()} Femazon. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-[#4A1513] transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#4A1513] transition">Terms &amp; Conditions</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Shopping Cart Drawer */}
      <GlobalCartDrawer />

      {/* Verified Logout Confirmation Modal */}
      <LogoutConfirmModal />

      {/* Aza Fashions Inspired Auth Modal */}
      <AuthModal />

      {/* Visual Image Search Modal */}
      <ImageSearchModal 
        isOpen={isImageSearchModalOpen} 
        onClose={() => setIsImageSearchModalOpen(false)} 
      />

      {/* Branded Pulse WhatsApp FAB */}
      <WhatsAppFloatingButton />

      {/* AI Concierge Drawer */}
      <Suspense fallback={null}>
        <FemazonAIChatDrawer />
      </Suspense>
    </div>
  );
}
