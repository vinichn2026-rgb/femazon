"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Trash2, 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  ChevronRight,
  Plus,
  Minus,
  Check,
  Tag,
  Gift
} from 'lucide-react';
import { useFemazonStore, CartItem } from '@/context/FemazonStoreContext';

// Related Styling & "Complete the Look" Curations
interface RelatedMatch {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  tag: string;
}

const RELATED_STYLING_SETS: Record<string, { title: string; subtitle: string; editorialBanner: string; items: RelatedMatch[] }> = {
  ethnic: {
    title: "Complete the Couture Look",
    subtitle: "Handcrafted jewelry and artisan potlis to pair with your ethnic ensemble",
    editorialBanner: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=800",
    items: [
      {
        id: "rel_1",
        name: "Kundan & Pearl Heritage Choker Set",
        brand: "Tyaani Jewellery",
        price: 12500,
        originalPrice: 15000,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400",
        category: "Jewelry",
        tag: "STYLING MATCH"
      },
      {
        id: "rel_2",
        name: "Zardozi Embroidered Silk Potli",
        brand: "Femazon Luxe",
        price: 3800,
        originalPrice: 4500,
        image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=400",
        category: "Potlis",
        tag: "BESTSELLER"
      },
      {
        id: "rel_3",
        name: "Gold Embellished Artisan Mojaris",
        brand: "Needledust",
        price: 4200,
        originalPrice: 4990,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400",
        category: "Footwear",
        tag: "MUST HAVE"
      }
    ]
  },
  western: {
    title: "Style with Runway Accessories",
    subtitle: "Curated evening clutches and statement earrings for your modern silhouettes",
    editorialBanner: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=800",
    items: [
      {
        id: "rel_4",
        name: "Crystal Pavé Drop Statement Earrings",
        brand: "Outhouse Jewellery",
        price: 6800,
        originalPrice: 8500,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400",
        category: "Jewelry",
        tag: "TRENDING"
      },
      {
        id: "rel_5",
        name: "Satin Evening Minaudière Clutch",
        brand: "Label Ritu Kumar",
        price: 5200,
        originalPrice: 6200,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=400",
        category: "Bags",
        tag: "POPULAR"
      }
    ]
  }
};

export default function FullCartPage() {
  const { 
    cart, 
    cartCount, 
    cartSubtotal, 
    updateCartQuantity, 
    removeFromCart, 
    addToCart, 
    toggleWishlist, 
    isInWishlist 
  } = useFemazonStore();

  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [addedRelatedIds, setAddedRelatedIds] = useState<string[]>([]);

  // Shipping logic: Free shipping over ₹20,000
  const freeShippingThreshold = 20000;
  const shippingCharge = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 499;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const totalAmount = Math.max(0, cartSubtotal + shippingCharge - appliedDiscount);

  // Determine Related Set based on Cart Category
  const hasEthnic = cart.some(item => 
    item.category?.toLowerCase().includes('kurta') || 
    item.category?.toLowerCase().includes('lehenga') || 
    item.category?.toLowerCase().includes('saree') ||
    item.category?.toLowerCase().includes('ethnic')
  );

  const currentRelatedSet = hasEthnic ? RELATED_STYLING_SETS.ethnic : RELATED_STYLING_SETS.western;

  // Handle Apply Promo Code
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'FEMAZON10' || code === 'FIRST10') {
      const disc = Math.round(cartSubtotal * 0.10);
      setAppliedDiscount(disc);
      setCouponSuccess(`Coupon ${code} applied! ₹${disc.toLocaleString('en-IN')} saved.`);
    } else if (code === 'LUXE2000' && cartSubtotal >= 25000) {
      setAppliedDiscount(2000);
      setCouponSuccess(`Coupon LUXE2000 applied! ₹2,000 saved.`);
    } else {
      setCouponError('Invalid promo code or minimum spend requirement not met.');
    }
  };

  const handleAddRelatedToCart = (match: RelatedMatch) => {
    addToCart({
      productId: match.id,
      name: match.name,
      brand: match.brand,
      price: match.price,
      originalPrice: match.originalPrice,
      image: match.image,
      quantity: 1,
      category: match.category
    }, false);

    setAddedRelatedIds(prev => [...prev, match.id]);
    setTimeout(() => {
      setAddedRelatedIds(prev => prev.filter(id => id !== match.id));
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] py-8 sm:py-12 text-stone-900 font-sans selection:bg-[#4A1513] selection:text-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-[12px] font-medium text-stone-400 mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#4A1513] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-[#4A1513] transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-stone-800 font-semibold">Shopping Bag</span>
        </nav>

        {/* Page Title & Count */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-6 border-b border-stone-200">
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight">
              Shopping Bag
            </h1>
            <span className="text-stone-400 font-medium text-sm">
              ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </span>
          </div>

          {cartCount > 0 && (
            <Link 
              href="/shop"
              className="text-[13px] font-bold uppercase tracking-wider text-[#4A1513] hover:underline underline-offset-4 flex items-center gap-1 self-start sm:self-auto transition-colors"
            >
              <span>Continue Browsing</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* EMPTY BAG STATE */}
        {cart.length === 0 ? (
          <div className="my-12 py-20 px-6 bg-white rounded-3xl border border-stone-200 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#FAF7F5] border border-stone-200 flex items-center justify-center text-[#4A1513] mx-auto mb-6">
              <ShoppingBag size={34} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-stone-900 mb-2">Your Bag is Empty</h2>
            <p className="text-stone-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Explore our exquisite collection of designer bridal wear, handcrafted sarees, and contemporary chic ensembles.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#4A1513] hover:bg-[#350B0A] text-white font-medium text-xs uppercase tracking-[0.16em] px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <span>Explore Collection</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          /* MAIN TWO-COLUMN FULL-VIEW CART LAYOUT */
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: CART ITEMS & PROGRESS (7 COLS) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Free Express Shipping Meter */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-xs">
                <div className="flex items-center justify-between gap-2 text-xs font-semibold text-stone-800 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Truck size={16} className="text-[#4A1513]" />
                    {amountToFreeShipping === 0 ? (
                      <span className="text-emerald-700">You qualify for Complimentary Express White-Glove Shipping! 🚚</span>
                    ) : (
                      <span>Add <strong className="text-[#4A1513]">₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> more for Complimentary Express Shipping</span>
                    )}
                  </span>
                  <span className="text-stone-400">{freeShippingProgress}%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-[#4A1513] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden divide-y divide-stone-100">
                {cart.map((item) => {
                  const itemTotal = item.price * item.quantity;
                  const itemInWishlist = isInWishlist(item.productId);

                  return (
                    <div 
                      key={item.id} 
                      className="p-5 sm:p-7 flex flex-col sm:flex-row gap-5 sm:gap-6 hover:bg-[#FAF7F5]/30 transition-colors group"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative w-28 h-36 sm:w-32 sm:h-40 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shrink-0 select-none">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" 
                        />
                      </div>

                      {/* Product Details & Actions */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          {/* Brand & Category */}
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400">
                              {item.brand || 'Femazon Couture'}
                            </span>
                            <span className="font-serif text-lg sm:text-xl font-bold text-stone-900 whitespace-nowrap">
                              ₹{itemTotal.toLocaleString('en-IN')}
                            </span>
                          </div>

                          {/* Name */}
                          <h3 className="font-serif text-base sm:text-lg text-stone-900 font-normal leading-snug mb-2 line-clamp-2">
                            {item.name}
                          </h3>

                          {/* Attributes (Size / Unit Price) */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mb-4">
                            {item.size && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#FAF7F5] border border-stone-200 font-semibold text-stone-800">
                                Size: {item.size}
                              </span>
                            )}
                            <span>₹{item.price.toLocaleString('en-IN')} / piece</span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="line-through text-stone-400">
                                ₹{item.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Stepper & Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
                          
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-stone-200 rounded-full bg-[#FAF7F5]">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-[#4A1513] hover:bg-stone-200/60 rounded-full transition cursor-pointer"
                              aria-label="Decrease Quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-stone-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-[#4A1513] hover:bg-stone-200/60 rounded-full transition cursor-pointer"
                              aria-label="Increase Quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          {/* Move to Wishlist & Remove Buttons */}
                          <div className="flex items-center gap-4 text-xs font-medium text-stone-500">
                            <button
                              type="button"
                              onClick={() => toggleWishlist({
                                id: item.productId,
                                name: item.name,
                                brand: item.brand,
                                price: item.price,
                                originalPrice: item.originalPrice,
                                image: item.image,
                                category: item.category
                              })}
                              className={`flex items-center gap-1 hover:text-[#4A1513] transition-colors cursor-pointer ${
                                itemInWishlist ? 'text-[#4A1513] font-bold' : ''
                              }`}
                            >
                              <Heart size={14} className={itemInWishlist ? 'fill-[#4A1513]' : ''} />
                              <span>{itemInWishlist ? 'Saved in Wishlist' : 'Save for Later'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="flex items-center gap-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} />
                              <span>Remove</span>
                            </button>
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Luxury Guarantee Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-stone-200/80 flex items-center gap-3">
                  <ShieldCheck size={20} className="text-[#4A1513] shrink-0" />
                  <div>
                    <h4 className="text-[11.5px] font-bold uppercase tracking-wider text-stone-900">100% Authentic</h4>
                    <p className="text-[10.5px] text-stone-500">Direct from luxury designers</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200/80 flex items-center gap-3">
                  <RotateCcw size={20} className="text-[#4A1513] shrink-0" />
                  <div>
                    <h4 className="text-[11.5px] font-bold uppercase tracking-wider text-stone-900">Easy Returns</h4>
                    <p className="text-[10.5px] text-stone-500">7 days doorstep pickup</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200/80 flex items-center gap-3">
                  <Truck size={20} className="text-[#4A1513] shrink-0" />
                  <div>
                    <h4 className="text-[11.5px] font-bold uppercase tracking-wider text-stone-900">White-Glove Delivery</h4>
                    <p className="text-[10.5px] text-stone-500">Insured express transit</p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: RELATED STYLING SHOWCASE & ORDER SUMMARY (5 COLS) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* 1. RELATED STYLING SHOWCASE ("COMPLETE THE LOOK") */}
              <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
                
                {/* Visual Editorial Header Banner */}
                <div className="relative h-36 sm:h-40 overflow-hidden bg-stone-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={currentRelatedSet.editorialBanner} 
                    alt="Styling Inspiration"
                    className="w-full h-full object-cover object-center opacity-85" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F3DFCA] mb-1">
                      <Sparkles size={12} />
                      <span>{currentRelatedSet.title}</span>
                    </div>
                    <p className="text-xs text-white/90 font-light line-clamp-2">
                      {currentRelatedSet.subtitle}
                    </p>
                  </div>
                </div>

                {/* Related Matching Items */}
                <div className="p-5 divide-y divide-stone-100">
                  {currentRelatedSet.items.map((match) => {
                    const isAdded = addedRelatedIds.includes(match.id);

                    return (
                      <div key={match.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Image */}
                          <div className="w-14 h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={match.image} 
                              alt={match.name}
                              className="w-full h-full object-cover" 
                            />
                          </div>

                          {/* Info */}
                          <div className="min-w-0">
                            <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#4A1513]">
                              {match.tag}
                            </span>
                            <h4 className="font-serif text-[13.5px] text-stone-900 truncate font-medium">
                              {match.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5 text-xs">
                              <span className="font-bold text-stone-900">₹{match.price.toLocaleString('en-IN')}</span>
                              <span className="text-[11px] line-through text-stone-400">₹{match.originalPrice.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Add Match Button */}
                        <button
                          type="button"
                          onClick={() => handleAddRelatedToCart(match)}
                          className={`shrink-0 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                            isAdded 
                              ? 'bg-emerald-600 border-emerald-600 text-white' 
                              : 'bg-white hover:bg-[#4A1513] hover:text-white border-[#4A1513]/40 text-[#4A1513]'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check size={13} />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus size={13} />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* 2. ORDER SUMMARY CARD */}
              <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-xs">
                <h3 className="font-serif text-xl text-stone-900 mb-5 pb-3 border-b border-stone-100">
                  Order Summary
                </h3>

                {/* Coupon Input Form */}
                <form onSubmit={handleApplyCoupon} className="mb-6">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Coupon: FEMAZON10"
                        className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F5] border border-stone-200 rounded-xl text-xs uppercase font-medium tracking-wider focus:outline-none focus:border-[#4A1513]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-stone-900 hover:bg-[#4A1513] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </div>

                  {couponSuccess && (
                    <p className="text-[11.5px] font-medium text-emerald-700 mt-2 flex items-center gap-1">
                      <Check size={13} /> {couponSuccess}
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[11.5px] font-medium text-rose-600 mt-2">
                      {couponError}
                    </p>
                  )}
                </form>

                {/* Pricing Rows */}
                <div className="space-y-3.5 text-[13.5px] text-stone-600 pb-5 border-b border-stone-100">
                  <div className="flex justify-between items-center">
                    <span>Bag Total (excl. discounts)</span>
                    <span className="font-semibold text-stone-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between items-center text-emerald-700 font-medium">
                      <span>Promotional Discount</span>
                      <span>- ₹{appliedDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Shipping &amp; Handling</span>
                    <span>
                      {shippingCharge === 0 ? (
                        <strong className="text-emerald-700 font-bold uppercase text-xs">FREE</strong>
                      ) : (
                        `₹${shippingCharge.toLocaleString('en-IN')}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-stone-400 text-xs">
                    <span>Estimated GST (included)</span>
                    <span>12% / 18% inclusive</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="pt-4 pb-6 flex items-baseline justify-between">
                  <div>
                    <span className="font-serif text-lg text-stone-900 font-semibold block">Grand Total</span>
                    <span className="text-[11px] text-stone-400">Inclusive of all taxes</span>
                  </div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#4A1513]">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Primary Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full block py-4 bg-[#4A1513] hover:bg-[#350B0A] active:scale-[0.99] text-white font-bold text-[13px] uppercase tracking-[0.16em] text-center rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  Proceed to Checkout →
                </Link>

                <p className="text-center text-[11px] text-stone-400 mt-4 flex items-center justify-center gap-1.5 font-medium">
                  <ShieldCheck size={14} className="text-[#4A1513]" />
                  <span>256-Bit SSL Encrypted Checkout</span>
                </p>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
