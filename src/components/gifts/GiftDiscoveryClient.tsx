"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Gift,
  Heart,
  MapPin,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  Truck,
  X,
} from "lucide-react";
import { useFemazonStore } from "@/context/FemazonStoreContext";
import type { GiftCatalogProduct } from "@/lib/giftCatalog";

type GiftDiscoveryClientProps = {
  products: GiftCatalogProduct[];
  catalogNotice: string | null;
  initialOccasion?: string;
  initialCategory?: string;
};

const BUDGETS = [
  { label: "Any price", value: "all" },
  { label: "Under ₹1,500", value: "under-1500" },
  { label: "₹1,500–₹3,000", value: "1500-3000" },
  { label: "₹3,000–₹5,000", value: "3000-5000" },
  { label: "Over ₹5,000", value: "over-5000" },
] as const;

export const GIFT_OCCASIONS = [
  { name: "Birthday", keywords: ["birthday", "celebration", "party", "cake"] },
  { name: "Anniversary", keywords: ["anniversary", "romantic", "couple", "love"] },
  { name: "Wedding Gifts", keywords: ["wedding", "bridal", "bride", "engagement", "groom"] },
  { name: "Baby Shower", keywords: ["baby", "newborn", "shower", "mother", "maternity"] },
  { name: "Friendship", keywords: ["friend", "friendship", "bestie"] },
  { name: "Festivals", keywords: ["festival", "festive", "diwali", "pongal", "navratri", "eid", "rakhi"] },
  { name: "Valentine's Day", keywords: ["valentine", "romantic", "rose", "chocolate", "love"] },
  { name: "Mother's Day", keywords: ["mother", "mom", "mum", "saree", "skincare", "self-care"] },
  { name: "Thank You", keywords: ["thank you", "gratitude", "appreciation"] },
  { name: "Congratulations", keywords: ["congratulation", "milestone", "promotion", "housewarming"] },
  { name: "Personalized Gifts", keywords: ["personalized", "custom", "monogram", "engraved", "name"] },
  { name: "Just Because", keywords: ["surprise", "gift", "hamper", "self-care", "flower"] },
] as const;

export const GIFT_CATEGORIES = [
  {
    name: "Gift Hampers",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=500&auto=format&fit=crop",
    keywords: ["hamper", "gift box", "curated box"],
  },
  {
    name: "Flowers",
    image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=500&auto=format&fit=crop",
    keywords: ["flower", "bouquet", "rose", "floral", "florist"],
  },
  {
    name: "Chocolates",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=500&auto=format&fit=crop",
    keywords: ["chocolate", "truffle", "cocoa", "praline"],
  },
  {
    name: "Cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500&auto=format&fit=crop",
    keywords: ["cake", "bakery", "pastry", "cupcake"],
  },
  {
    name: "Personalized Gifts",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=500&auto=format&fit=crop",
    keywords: ["personalized", "custom", "engraved", "monogram"],
  },
  {
    name: "Jewellery Gifts",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=500&auto=format&fit=crop",
    keywords: ["jewellery", "jewelry", "necklace", "earring", "bracelet", "ring"],
  },
  {
    name: "Beauty Gift Boxes",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=500&auto=format&fit=crop",
    keywords: ["beauty", "makeup", "skincare", "cosmetic"],
  },
  {
    name: "Self-care Hampers",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500&auto=format&fit=crop",
    keywords: ["self-care", "spa", "bath", "candle", "aromatherapy", "wellness"],
  },
  {
    name: "Dry Fruit Hampers",
    image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=500&auto=format&fit=crop",
    keywords: ["dry fruit", "nut", "almond", "cashew", "festive hamper"],
  },
  {
    name: "Plants",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=500&auto=format&fit=crop",
    keywords: ["plant", "succulent", "indoor plant", "bonsai"],
  },
  {
    name: "Customized Gift Boxes",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=500&auto=format&fit=crop",
    keywords: ["customized", "custom box", "gift box", "hamper"],
  },
] as const;

const RECIPIENTS = ["Mother", "Partner", "Sister", "Friend", "Colleague", "Bride & Groom", "New Parents"] as const;
const RECIPIENT_KEYWORDS: Record<(typeof RECIPIENTS)[number], string[]> = {
  Mother: ["mother", "mom", "mum", "saree", "silk", "skincare", "wellness", "plant"],
  Partner: ["partner", "wife", "girlfriend", "jewellery", "jewelry", "handbag", "chocolate", "flower", "beauty"],
  Sister: ["sister", "jewellery", "jewelry", "handbag", "accessory", "beauty", "dress", "hamper"],
  Friend: ["friend", "accessory", "handbag", "beauty", "skincare", "chocolate", "plant", "jewellery"],
  Colleague: ["colleague", "accessory", "plant", "dry fruit", "chocolate", "hamper", "gift"],
  "Bride & Groom": ["wedding", "bridal", "couple", "saree", "jewellery", "hamper"],
  "New Parents": ["baby", "newborn", "mother", "hamper", "flower", "cake"],
};

export function GiftDiscoveryClient({
  products,
  catalogNotice,
  initialOccasion,
  initialCategory,
}: GiftDiscoveryClientProps) {
  const { isInWishlist, toggleWishlist, addToCart } = useFemazonStore();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");
  const [selectedBudget, setSelectedBudget] = useState<(typeof BUDGETS)[number]["value"]>("all");
  const [selectedOccasion, setSelectedOccasion] = useState(
    () =>
      GIFT_OCCASIONS.find((o) => o.name.toLowerCase() === initialOccasion?.toLowerCase())?.name ??
      "Any occasion"
  );
  const [selectedRecipient, setSelectedRecipient] = useState("Anyone");
  const [selectedVendor, setSelectedVendor] = useState("All sellers");
  const [deliveryLocation, setDeliveryLocation] = useState("All locations");
  const [sortOrder, setSortOrder] = useState<"recommended" | "price-low" | "price-high" | "rating">("recommended");
  const [search, setSearch] = useState("");

  // Personalization modal state
  const [personalizeTarget, setPersonalizeTarget] = useState<GiftCatalogProduct | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [includeGiftCard, setIncludeGiftCard] = useState(true);
  const [giftWrap, setGiftWrap] = useState("Signature Ribbon Box");
  const [customNotes, setCustomNotes] = useState("");

  const extraCategories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort((a, b) => a.localeCompare(b)),
    [products]
  );
  const vendors = useMemo(
    () => Array.from(new Set(products.map((p) => p.vendorName).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [products]
  );
  const locations = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.sellerLocation).filter((loc): loc is string => Boolean(loc)))
      ).sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const visibleProducts = products.filter((product) => {
      const searchText = `${product.name} ${product.vendorName} ${product.category} ${product.subCategory} ${product.description || ""} ${product.occasion || ""}`.toLowerCase();

      if (selectedCategory !== "All") {
        const giftCat = GIFT_CATEGORIES.find(
          (c) => c.name.toLowerCase() === selectedCategory.toLowerCase()
        );
        if (giftCat) {
          const matchesCat =
            product.category.toLowerCase() === giftCat.name.toLowerCase() ||
            giftCat.keywords.some((kw) => searchText.includes(kw));
          if (!matchesCat) return false;
        } else if (product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      if (query && !searchText.includes(query)) return false;
      if (selectedVendor !== "All sellers" && product.vendorName !== selectedVendor) return false;

      if (deliveryLocation !== "All locations") {
        if (!product.sellerLocation?.toLowerCase().includes(deliveryLocation.toLowerCase())) {
          return false;
        }
      }

      if (selectedOccasion !== "Any occasion") {
        const occObj = GIFT_OCCASIONS.find((o) => o.name === selectedOccasion);
        if (occObj && !occObj.keywords.some((term) => searchText.includes(term))) {
          return false;
        }
      }

      if (selectedRecipient !== "Anyone") {
        const terms = RECIPIENT_KEYWORDS[selectedRecipient as (typeof RECIPIENTS)[number]];
        if (terms && !terms.some((term) => searchText.includes(term))) return false;
      }

      switch (selectedBudget) {
        case "under-1500":
          return product.price < 1500;
        case "1500-3000":
          return product.price >= 1500 && product.price <= 3000;
        case "3000-5000":
          return product.price > 3000 && product.price <= 5000;
        case "over-5000":
          return product.price > 5000;
        default:
          return true;
      }
    });

    if (sortOrder === "price-low") return visibleProducts.sort((a, b) => a.price - b.price);
    if (sortOrder === "price-high") return visibleProducts.sort((a, b) => b.price - a.price);
    if (sortOrder === "rating") return visibleProducts.sort((a, b) => b.rating - a.rating);
    return visibleProducts;
  }, [
    products,
    search,
    selectedBudget,
    selectedCategory,
    selectedOccasion,
    selectedRecipient,
    selectedVendor,
    deliveryLocation,
    sortOrder,
  ]);

  const handleToggleWishlist = (product: GiftCatalogProduct) => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      brand: product.vendorName,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0] || "",
      category: product.category,
    });
  };

  const handleConfirmPersonalizedGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalizeTarget) return;
    const summaryParts = [
      recipientName.trim() ? `For: ${recipientName.trim()}` : "",
      `Wrap: ${giftWrap}`,
      includeGiftCard ? "Gift Card Included" : "",
      personalMessage.trim() ? `Msg: "${personalMessage.trim()}"` : "",
      customNotes.trim() ? `Note: ${customNotes.trim()}` : "",
    ].filter(Boolean);

    addToCart(
      {
        productId: personalizeTarget.id,
        name: personalizeTarget.name,
        brand: personalizeTarget.vendorName,
        price: personalizeTarget.price,
        originalPrice: personalizeTarget.originalPrice,
        image: personalizeTarget.images[0] || "",
        size: personalizeTarget.sizes[0] || "Gift Standard",
        color: summaryParts.join(" · ") || personalizeTarget.colors[0] || "Standard",
        quantity: 1,
        category: personalizeTarget.category,
      },
      true
    );

    setPersonalizeTarget(null);
    setRecipientName("");
    setPersonalMessage("");
    setCustomNotes("");
  };

  return (
    <main className="min-h-screen bg-[#FAF7F5] pb-20 text-stone-900">
      {/* 1. HERO BANNER */}
      <section className="overflow-hidden bg-[#fff1f4] px-4 py-10 text-[#3D110F] sm:py-14">
        <div className="mx-auto grid max-w-[1400px] items-center gap-7 md:grid-cols-[1fr_0.85fr] md:gap-12">
          <div className="py-2">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C8A253]/50 bg-white/85 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#4A1513] sm:text-xs">
              <Gift size={14} /> SENT WITH LOVE · FEMAZON GIFTING
            </span>
            <h1 className="max-w-3xl font-serif text-3xl font-normal leading-tight tracking-tight sm:text-5xl">
              Gifts for All Occasions
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
              Curated gift hampers, fresh flowers, artisan chocolates, celebration cakes, personalized keepsakes, jewellery, and self-care boxes — delivered with personal messages and luxury gift wrapping.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#gift-results"
                className="inline-flex items-center gap-2 rounded-full bg-[#4A1513] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#38100e] transition"
              >
                <span>Explore Gifts</span>
                <ArrowRight size={14} />
              </a>
              <Link
                href="/partner/register"
                className="inline-flex items-center gap-2 rounded-full border border-[#4A1513] bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#4A1513] hover:bg-rose-50 transition"
              >
                <Store size={14} />
                <span>Sell Gifts on Femazon</span>
              </Link>
            </div>
          </div>
          <div className="relative hidden h-60 overflow-hidden rounded-3xl md:block lg:h-72 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop"
              alt="A carefully wrapped gift box"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D110F]/35 to-transparent" />
          </div>
        </div>
      </section>

      {/* 2. SHOP BY OCCASION (12 OCCASIONS) */}
      <section className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b1646] block">
              Every Celebration
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">Shop by Occasion</h2>
          </div>
          {selectedOccasion !== "Any occasion" && (
            <button
              type="button"
              onClick={() => setSelectedOccasion("Any occasion")}
              className="text-xs font-bold uppercase tracking-wider text-[#4A1513] hover:underline cursor-pointer"
            >
              Clear Occasion
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {GIFT_OCCASIONS.map((occ) => {
            const active = selectedOccasion === occ.name;
            return (
              <button
                key={occ.name}
                type="button"
                onClick={() => {
                  setSelectedOccasion(active ? "Any occasion" : occ.name);
                  document.getElementById("gift-results")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  active
                    ? "bg-[#4A1513] text-white shadow-xs"
                    : "bg-white border border-stone-200 text-stone-700 hover:border-[#4A1513]"
                }`}
              >
                {occ.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY (11 GIFT CATEGORIES) */}
      <section className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b1646] block">
              Thoughtful Collections
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">Shop by Gift Category</h2>
          </div>
          {selectedCategory !== "All" && (
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className="text-xs font-bold uppercase tracking-wider text-[#4A1513] hover:underline cursor-pointer"
            >
              View All Categories
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {GIFT_CATEGORIES.map((cat) => {
            const active = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => {
                  setSelectedCategory(active ? "All" : cat.name);
                  document.getElementById("gift-results")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`group overflow-hidden rounded-2xl border bg-white text-left transition cursor-pointer ${
                  active
                    ? "border-[#4A1513] ring-2 ring-[#4A1513] shadow-md"
                    : "border-stone-200 hover:border-[#4A1513]/60 hover:shadow-sm"
                }`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-2.5 text-center">
                  <span className={`font-serif text-xs font-bold ${active ? "text-[#4A1513]" : "text-stone-900"}`}>
                    {cat.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. FILTER BAR & RESULTS */}
      <section id="gift-results" className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 lg:px-8">
        {catalogNotice && (
          <p role="status" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {catalogNotice}
          </p>
        )}

        <div className="mb-7 space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search gift hampers, flowers, chocolates, cakes, personalized gifts, sellers..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#4A1513]"
              aria-label="Search gift ideas"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <select
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-700 outline-none"
            >
              <option>Any occasion</option>
              {GIFT_OCCASIONS.map((o) => (
                <option key={o.name}>{o.name}</option>
              ))}
            </select>

            <select
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-700 outline-none"
            >
              <option>Anyone</option>
              {RECIPIENTS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>

            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value as typeof selectedBudget)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-700 outline-none"
            >
              {BUDGETS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-700 outline-none"
            >
              <option value="All">All Gift Types</option>
              {GIFT_CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
              {extraCategories
                .filter((c) => !GIFT_CATEGORIES.some((g) => g.name.toLowerCase() === c.toLowerCase()))
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>

            <select
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-700 outline-none"
            >
              <option>All locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-700">
              <SlidersHorizontal size={13} className="text-[#4A1513] shrink-0" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                className="w-full bg-transparent outline-none font-medium"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {vendors.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="font-bold text-stone-500 uppercase tracking-wider">Gift Seller:</span>
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs outline-none"
              >
                <option>All sellers</option>
                {vendors.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-stone-900">Curated Gift Ideas</h2>
          <span className="text-sm text-stone-500">{filteredProducts.length} items</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              const wishlisted = isInWishlist(product.id);
              const img = product.images[0] || "/images/dress/placeholder.jpg";
              return (
                <article
                  key={product.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xs transition hover:shadow-xl"
                >
                  <div>
                    <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                      <Link href={`/product/${product.slug || product.id}`} className="block h-full w-full">
                        <img
                          src={img}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleToggleWishlist(product)}
                        className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-stone-700 shadow-xs hover:text-rose-600 cursor-pointer"
                        aria-label="Toggle wishlist"
                      >
                        <Heart size={15} fill={wishlisted ? "#e11d48" : "none"} className={wishlisted ? "text-rose-600" : ""} />
                      </button>
                      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                        {product.inStock ? (
                          <span className="rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[10px] font-bold text-white">
                            In Stock
                          </span>
                        ) : (
                          <span className="rounded-full bg-stone-800/80 px-2.5 py-0.5 text-[10px] font-bold text-white">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2 text-[11px] text-stone-500">
                        <span className="font-semibold uppercase tracking-wider text-[#8b1646] truncate">
                          {product.vendorName}
                        </span>
                        {product.reviewCount > 0 && (
                          <span className="inline-flex items-center gap-1 font-bold text-amber-600 shrink-0">
                            <Star size={11} fill="currentColor" /> {product.rating.toFixed(1)} ({product.reviewCount})
                          </span>
                        )}
                      </div>

                      <Link href={`/product/${product.slug || product.id}`}>
                        <h3 className="mt-1 font-serif text-base font-bold text-stone-900 line-clamp-2 hover:text-[#4A1513]">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
                        <span className="inline-flex items-center gap-1">
                          <Truck size={12} className="text-[#4A1513]" />
                          {product.readyToShip
                            ? "Express 24-48h"
                            : `Est. ${product.deliveryDays || 3}-${(product.deliveryDays || 3) + 2} days`}
                        </span>
                        {product.sellerLocation && (
                          <span className="inline-flex items-center gap-1 truncate">
                            <MapPin size={11} /> {product.sellerLocation}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-stone-100 p-4 pt-3 space-y-2.5">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-lg font-bold text-[#4A1513]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-stone-400 line-through">
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={!product.inStock}
                        onClick={() => setPersonalizeTarget(product)}
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#4A1513] px-2.5 py-2 text-[11px] font-bold text-[#4A1513] hover:bg-rose-50 disabled:opacity-50 cursor-pointer"
                      >
                        <Sparkles size={12} /> Personalize
                      </button>
                      <button
                        type="button"
                        disabled={!product.inStock}
                        onClick={() =>
                          addToCart(
                            {
                              productId: product.id,
                              name: product.name,
                              brand: product.vendorName,
                              price: product.price,
                              originalPrice: product.originalPrice,
                              image: img,
                              size: product.sizes[0] || "Free Size",
                              color: product.colors[0] || "Standard",
                              quantity: 1,
                              category: product.category,
                            },
                            true
                          )
                        }
                        className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#4A1513] px-2.5 py-2 text-[11px] font-bold text-white hover:bg-[#38100e] disabled:opacity-50 cursor-pointer"
                      >
                        <ShoppingBag size={12} /> Add Gift
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center">
            <Gift size={32} className="mx-auto mb-4 text-[#4A1513]" />
            <h3 className="font-serif text-xl font-bold text-stone-900">No matching gift ideas</h3>
            <p className="mt-2 text-sm text-stone-500">
              Try another search or broaden your occasion, category, or budget filters.
            </p>
          </div>
        )}

        {/* 5. GIFT SELLER REGISTRATION BANNER */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-[#4A1513] to-[#2B0B0A] p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-rose-200 mb-3">
              GIFT SHOPS · FLORISTS · BAKERIES · HAMPER CREATORS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Sell Your Curated Gifts on Femazon
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-stone-200 leading-relaxed">
              Register as a Femazon Gift Seller to upload hampers, fresh flowers, artisan chocolates, cakes, plants, and personalized gift boxes.
            </p>
          </div>
          <Link
            href="/partner/register"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#4A1513] shadow-lg hover:bg-rose-50 transition shrink-0"
          >
            <span>Register Gift Business</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* GIFT PERSONALIZATION MODAL */}
      {personalizeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setPersonalizeTarget(null)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
            >
              <X size={18} />
            </button>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b1646]">
              Personalize Your Gift
            </span>
            <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
              {personalizeTarget.name}
            </h3>

            <form onSubmit={handleConfirmPersonalizedGift} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g., Ananya"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Personal Message
                </label>
                <textarea
                  rows={3}
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="Write a heartfelt note for your gift card..."
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Gift Wrapping
                  </label>
                  <select
                    value={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
                  >
                    <option value="Signature Ribbon Box">Signature Ribbon Box</option>
                    <option value="Festive Silk Wrap">Festive Silk Wrap</option>
                    <option value="Minimalist Kraft & Twine">Minimalist Kraft &amp; Twine</option>
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeGiftCard}
                      onChange={(e) => setIncludeGiftCard(e.target.checked)}
                      className="accent-[#4A1513]"
                    />
                    <span>Include Printed Gift Card</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Customization Options / Instructions
                </label>
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g., Engraving initials, ribbon color, delivery note"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-[#4A1513] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="font-serif text-xl font-bold text-[#4A1513]">
                  ₹{personalizeTarget.price.toLocaleString("en-IN")}
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#4A1513] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#38100e] cursor-pointer"
                >
                  <CheckCircle2 size={14} /> Add Personalized Gift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
