"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  ShoppingBag,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  Sparkles,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { useFemazonStore } from '@/context/FemazonStoreContext';

export function GlobalCartDrawer() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    isCartOpen,
    closeCart,
    updateCartQuantity,
    removeFromCart,
    wishlistCount,
    moveAllWishlistToCart
  } = useFemazonStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'AZA10' || code === 'FIRSTBUY') {
      const disc = Math.round(cartSubtotal * 0.10);
      setAppliedDiscount(disc);
      setCouponMsg({ type: 'success', text: `Saved ₹${disc.toLocaleString('en-IN')} with ${code}!` });
    } else if (code === 'LUXE15') {
      const disc = Math.round(cartSubtotal * 0.15);
      setAppliedDiscount(disc);
      setCouponMsg({ type: 'success', text: `Saved ₹${disc.toLocaleString('en-IN')} with ${code}!` });
    } else {
      setCouponMsg({ type: 'error', text: 'Invalid coupon code. Try AZA10 or LUXE15' });
    }
  };

  const shipping = 0; // Free express shipping
  const totalOriginal = cart.reduce((acc, item) => acc + ((item.originalPrice || item.price) * item.quantity), 0);
  const totalSavings = (totalOriginal - cartSubtotal) + appliedDiscount;
  const finalPayable = Math.max(0, cartSubtotal - appliedDiscount);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden animate-in fade-in duration-300">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex z-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl border-l border-stone-200 flex flex-col h-full animate-in slide-in-from-right duration-300 ease-out font-sans">
          
          {/* Header */}
          <div className="px-5 py-4 bg-[#FAF7F4] border-b border-stone-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#4A1513] text-white flex items-center justify-center shadow-xs">
                <ShoppingBag size={15} />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-stone-900 leading-tight">
                  Shopping Bag ({cartCount})
                </h3>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#4A1513]">
                  100% Guaranteed Authentic Designer Wear
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition shadow-2xs cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white">
            
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <ShoppingBag size={28} />
                </div>
                <h4 className="font-serif text-xl font-bold text-stone-900">Your Shopping Bag is Empty</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Explore luxury designer bridal lehengas, silk sarees, and contemporary anarkali suits.
                </p>
                
                {wishlistCount > 0 && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={moveAllWishlistToCart}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm bg-[#4A1513]/10 text-[#4A1513] hover:bg-[#4A1513]/15 text-xs font-bold uppercase tracking-wider transition"
                    >
                      <Heart size={13} className="fill-[#4A1513]" />
                      <span>Move {wishlistCount} Wishlist Items to Bag</span>
                    </button>
                  </div>
                )}

                <div className="pt-4">
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[#4A1513] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#350B0A] transition"
                  >
                    <span>Browse Collections</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3.5">
                  {cart.map(item => {
                    const itemTotal = item.price * item.quantity;
                    const originalItemTotal = (item.originalPrice || item.price) * item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="p-3 bg-[#FAF7F4] rounded-sm border border-stone-200/80 flex gap-3 relative group"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-20 aspect-[3/4] rounded-xs overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>

                        {/* Info & Quantity Controls */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#4A1513] truncate">
                                {item.brand || 'Femazon Exclusive'}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="text-stone-400 hover:text-rose-600 transition p-0.5 cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <h4 className="font-serif text-xs font-semibold text-stone-900 leading-snug line-clamp-1 mt-0.5">
                              {item.name}
                            </h4>
                            {item.size && (
                              <span className="text-[11px] text-stone-500 block mt-0.5">
                                Size: <b className="text-stone-800">{item.size}</b>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 mt-1">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-stone-300 rounded-xs bg-white overflow-hidden shadow-2xs">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-0.5 text-xs font-bold text-stone-700 hover:bg-stone-100"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-bold text-stone-900 tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-0.5 text-xs font-bold text-stone-700 hover:bg-stone-100"
                              >
                                +
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <span className="font-sans text-sm font-bold text-stone-900 tabular-nums block">
                                ₹{itemTotal.toLocaleString('en-IN')}
                              </span>
                              {originalItemTotal > itemTotal && (
                                <span className="font-sans text-[10px] text-stone-400 line-through tabular-nums block">
                                  ₹{originalItemTotal.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Free Shipping Assurance */}
                <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-sm flex items-center gap-2 text-xs text-emerald-900 font-medium">
                  <Truck size={16} className="text-emerald-700 shrink-0" />
                  <span>Free Express Insured Delivery by <b>Thursday, 18 Sep</b></span>
                </div>

                {/* Coupons Box */}
                <div className="p-3.5 bg-white border border-stone-200 rounded-sm space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <Tag size={13} className="text-[#4A1513]" />
                    <span>Apply Coupon Code</span>
                  </span>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="AZA10 or LUXE15"
                      className="flex-1 px-3 py-2 border border-stone-300 rounded-sm text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-[#4A1513]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                  {couponMsg && (
                    <p className={`text-[11.5px] font-semibold ${couponMsg.type === 'success' ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </div>

                {/* Summary Box */}
                <div className="p-3.5 bg-[#FAF7F4] border border-stone-200 rounded-sm space-y-2 text-xs">
                  <h5 className="font-serif text-xs font-bold uppercase tracking-wider text-stone-800 pb-2 border-b border-stone-200">
                    Order Summary ({cartCount} Items)
                  </h5>
                  <div className="flex justify-between text-stone-600">
                    <span>Total MRP</span>
                    <span className="tabular-nums">₹{totalOriginal.toLocaleString('en-IN')}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Total Savings</span>
                      <span className="tabular-nums">- ₹{totalSavings.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-600">
                    <span>Delivery Fee</span>
                    <span className="text-emerald-700 font-bold uppercase">FREE</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-bold text-sm text-stone-900">
                    <span>Total Payable</span>
                    <span className="font-sans text-base font-bold text-stone-900 tabular-nums">
                      ₹{finalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Footer Checkout Trigger */}
          {cart.length > 0 && (
            <div className="px-5 py-4 bg-white border-t border-stone-200 flex items-center justify-between shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-stone-400">Total Payable</span>
                <span className="font-sans text-lg font-bold text-[#4A1513] tabular-nums">
                  ₹{finalPayable.toLocaleString('en-IN')}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="px-6 py-3.5 rounded-sm bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-[0.16em] shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
