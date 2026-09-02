"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Trash2,
  Tag,
  CreditCard,
  Smartphone,
  Landmark,
  Banknote,
  Lock,
  ChevronRight,
  ChevronDown,
  Sparkles,
  MapPin,
  Clock,
  RefreshCw,
  Gift
} from 'lucide-react';

export interface CheckoutProduct {
  id: string | number;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  image: string;
  images?: string[];
  sizes?: string[];
  category?: string;
}

interface ProductCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: CheckoutProduct;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  initialMode?: 'bag' | 'checkout';
}

export function ProductCheckoutDrawer({
  isOpen,
  onClose,
  product,
  selectedSize,
  onSelectSize,
  initialMode = 'bag'
}: ProductCheckoutDrawerProps) {
  // Steps: 1 = Bag / Review, 2 = Shipping Address, 3 = Payment Method, 4 = Confirmation
  const [currentStep, setCurrentStep] = useState<number>(initialMode === 'checkout' ? 2 : 1);
  const [quantity, setQuantity] = useState<number>(1);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Address Form State
  const [fullName, setFullName] = useState<string>('Vinitha Chandran');
  const [phone, setPhone] = useState<string>('9876543210');
  const [email, setEmail] = useState<string>('vinitha@example.com');
  const [pincode, setPincode] = useState<string>('600028');
  const [addressLine, setAddressLine] = useState<string>('No. 42, Poes Garden, R.A. Puram');
  const [city, setCity] = useState<string>('Chennai');
  const [state, setState] = useState<string>('Tamil Nadu');
  const [addressType, setAddressType] = useState<'Home' | 'Office'>('Home');

  // Payment Mode State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState<string>('vinitha@okaxis');
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');

  // Fallback sizes
  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Fit'];

  // Current active size
  const activeSize = selectedSize || availableSizes[0] || 'M';

  // Calculations
  const unitPrice = product.discountPrice || product.price || 18895;
  const originalUnitPrice = product.originalPrice || unitPrice;
  const subtotal = unitPrice * quantity;
  const totalOriginal = originalUnitPrice * quantity;
  const totalSavings = totalOriginal - subtotal + appliedDiscount;
  const shippingCost = 0; // Free express shipping
  const finalPayable = Math.max(0, subtotal - appliedDiscount);

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(initialMode === 'checkout' ? 2 : 1);
      setIsPlacingOrder(false);
      setConfirmedOrderId('');
    }
  }, [isOpen, initialMode]);

  // Apply Coupon Logic
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const code = couponCode.trim().toUpperCase();
    if (code === 'AZA10' || code === 'FIRSTBUY') {
      const discount = Math.round(subtotal * 0.10);
      setAppliedDiscount(discount);
      setCouponSuccess(`Coupon ${code} applied! Saved ₹${discount.toLocaleString('en-IN')}`);
    } else if (code === 'LUXE15') {
      const discount = Math.round(subtotal * 0.15);
      setAppliedDiscount(discount);
      setCouponSuccess(`Coupon ${code} applied! Saved ₹${discount.toLocaleString('en-IN')}`);
    } else {
      setCouponError('Invalid coupon code. Try AZA10 or LUXE15');
    }
  };

  // Place Order Handler
  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    setTimeout(() => {
      const ordId = `AZA-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedOrderId(ordId);
      setIsPlacingOrder(false);
      setCurrentStep(4);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden animate-in fade-in duration-300">
      
      {/* Backdrop Scrim */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Right Sliding Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex z-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl border-l border-stone-200 flex flex-col h-full animate-in slide-in-from-right duration-300 ease-out font-sans">
          
          {/* ========================================================================= */}
          {/* DRAWER HEADER */}
          {/* ========================================================================= */}
          <div className="px-5 py-4 bg-[#FAF7F4] border-b border-stone-200 flex items-center justify-between shrink-0">
            
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#4A1513] text-white flex items-center justify-center shadow-2xs">
                <ShoppingBag size={15} />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-stone-900 leading-tight">
                  {currentStep === 1 && 'My Shopping Bag'}
                  {currentStep === 2 && 'Delivery Address'}
                  {currentStep === 3 && 'Payment & Finalize'}
                  {currentStep === 4 && 'Order Confirmed'}
                </h3>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#4A1513]">
                  {currentStep === 1 && 'Step 1 of 3 · Bag Review'}
                  {currentStep === 2 && 'Step 2 of 3 · Shipping Info'}
                  {currentStep === 3 && 'Step 3 of 3 · Secure Checkout'}
                  {currentStep === 4 && 'Thank you for shopping!'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition shadow-2xs cursor-pointer"
            >
              <X size={16} />
            </button>

          </div>

          {/* ========================================================================= */}
          {/* DRAWER BODY (SCROLLABLE) */}
          {/* ========================================================================= */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white">
            
            {/* --------------------------------------------------------------------- */}
            {/* STEP 1: SHOPPING BAG / ITEM REVIEW */}
            {/* --------------------------------------------------------------------- */}
            {currentStep === 1 && (
              <div className="space-y-5">
                
                {/* Product Card Row */}
                <div className="p-4 bg-[#FAF7F4] rounded-2xl border border-stone-200/80 flex gap-4">
                  
                  {/* Thumbnail Image */}
                  <div className="relative w-24 aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image || "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600"}
                      alt={product.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Product Details & Controls */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      {product.brand && (
                        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#4A1513] block truncate">
                          {product.brand}
                        </span>
                      )}
                      <h4 className="font-serif text-sm font-semibold text-stone-900 leading-snug line-clamp-2 mt-0.5">
                        {product.name}
                      </h4>
                    </div>

                    {/* Size and Quantity Selectors */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      
                      {/* Size Selector */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-stone-500 font-medium">Size:</span>
                        <select
                          value={activeSize}
                          onChange={(e) => onSelectSize(e.target.value)}
                          className="px-2.5 py-1 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:border-[#4A1513]"
                        >
                          {availableSizes.map(sz => (
                            <option key={sz} value={sz}>{sz}</option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-stone-500 font-medium">Qty:</span>
                        <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-2 py-0.5 text-xs font-bold text-stone-700 hover:bg-stone-100"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-stone-900 tabular-nums">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-2 py-0.5 text-xs font-bold text-stone-700 hover:bg-stone-100"
                          >
                            +
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Price Row */}
                    <div className="flex items-baseline gap-2 pt-2 border-t border-stone-200/60 mt-2">
                      <span className="font-sans text-base font-bold text-stone-900 tabular-nums">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                      {totalOriginal > subtotal && (
                        <span className="font-sans text-xs text-stone-400 line-through tabular-nums">
                          ₹{totalOriginal.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                  </div>

                </div>

                {/* Delivery Assurance */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-sm flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
                  <Truck size={16} className="text-emerald-700 shrink-0" />
                  <span>Free Express Delivery by <b>Thursday, 18 Sep</b></span>
                </div>

                {/* Promo Code Accordion Box */}
                <div className="p-3.5 bg-white border border-stone-200 rounded-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                      <Tag size={13} className="text-[#4A1513]" />
                      <span>Apply Coupons &amp; Offers</span>
                    </span>
                  </div>

                  <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter AZA10 or LUXE15"
                      className="flex-1 px-3 py-2 border border-stone-300 rounded-sm text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-[#4A1513]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>

                  {couponSuccess && (
                    <p className="text-[11.5px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={13} /> {couponSuccess}
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[11.5px] text-rose-600 font-medium">
                      ✕ {couponError}
                    </p>
                  )}

                  {/* Available Coupon Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => { setCouponCode('AZA10'); }}
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold uppercase rounded-xs"
                    >
                      AZA10 (10% OFF)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCouponCode('LUXE15'); }}
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold uppercase rounded-xs"
                    >
                      LUXE15 (15% OFF)
                    </button>
                  </div>
                </div>

                {/* Price Details Breakdown */}
                <div className="p-3.5 bg-[#FAF7F4] border border-stone-200 rounded-sm space-y-2 text-xs">
                  <h5 className="font-serif text-xs font-bold uppercase tracking-wider text-stone-800 pb-2 border-b border-stone-200">
                    Price Details ({quantity} Item)
                  </h5>

                  <div className="flex justify-between text-stone-600">
                    <span>Total MRP</span>
                    <span className="tabular-nums">₹{totalOriginal.toLocaleString('en-IN')}</span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount on MRP</span>
                      <span className="tabular-nums">- ₹{totalSavings.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span>Delivery Fee</span>
                    <span className="text-emerald-700 font-bold uppercase">FREE</span>
                  </div>

                  <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-bold text-sm text-stone-900">
                    <span>Total Payable</span>
                    <span className="text-base font-bold text-stone-900 tabular-nums">
                      ₹{finalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* STEP 2: SHIPPING ADDRESS & CONTACT */}
            {/* --------------------------------------------------------------------- */}
            {currentStep === 2 && (
              <div className="space-y-4 text-left">
                
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <h4 className="font-serif text-base font-bold text-stone-900">Enter Shipping Address</h4>
                    <p className="text-xs text-stone-500">Orders are shipped via insured priority courier.</p>
                  </div>
                  <span className="text-xs text-[#4A1513] font-bold">100% Insured</span>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Vinitha Chandran"
                      className="w-full px-3.5 py-2.5 rounded-sm border border-stone-300 text-xs font-semibold text-stone-900 bg-white focus:outline-none focus:border-[#4A1513]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full px-3.5 py-2.5 rounded-sm border border-stone-300 text-xs font-semibold text-stone-900 bg-white focus:outline-none focus:border-[#4A1513]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="6-digit pincode"
                        className="w-full px-3.5 py-2.5 rounded-sm border border-stone-300 text-xs font-semibold text-stone-900 bg-white focus:outline-none focus:border-[#4A1513]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                      Flat / House No. / Building / Street Address *
                    </label>
                    <input
                      type="text"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder="e.g. No 42, Poes Garden"
                      className="w-full px-3.5 py-2.5 rounded-sm border border-stone-300 text-xs font-semibold text-stone-900 bg-white focus:outline-none focus:border-[#4A1513]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-sm border border-stone-300 text-xs font-semibold text-stone-900 bg-white focus:outline-none focus:border-[#4A1513]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-sm border border-stone-300 text-xs font-semibold text-stone-900 bg-white focus:outline-none focus:border-[#4A1513]"
                      />
                    </div>
                  </div>

                  {/* Address Type Pill */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                      Address Type
                    </label>
                    <div className="flex gap-2">
                      {['Home', 'Office'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAddressType(type as any)}
                          className={`px-4 py-1.5 rounded-sm border text-xs font-bold uppercase transition cursor-pointer ${
                            addressType === type
                              ? 'border-[#4A1513] bg-[#FAF5F2] text-[#4A1513]'
                              : 'border-stone-200 bg-white text-stone-700'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Mini Item Summary */}
                <div className="p-3 bg-[#FAF7F4] rounded-sm border border-stone-200 flex items-center justify-between text-xs mt-3">
                  <div className="truncate">
                    <span className="font-bold text-stone-900 block truncate">{product.name}</span>
                    <span className="text-stone-500">Size: {activeSize} · Qty: {quantity}</span>
                  </div>
                  <span className="font-bold text-stone-900 tabular-nums ml-2">
                    ₹{finalPayable.toLocaleString('en-IN')}
                  </span>
                </div>

              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* STEP 3: PAYMENT METHOD & REVIEW */}
            {/* --------------------------------------------------------------------- */}
            {currentStep === 3 && (
              <div className="space-y-4 text-left">
                
                <div className="pb-2 border-b border-stone-100">
                  <h4 className="font-serif text-base font-bold text-stone-900">Choose Payment Method</h4>
                  <p className="text-xs text-stone-500">All transactions are encrypted with 256-bit SSL protection.</p>
                </div>

                {/* Payment Mode Options */}
                <div className="space-y-2.5">
                  
                  {/* UPI Option */}
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3.5 rounded-sm border-2 transition cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-[#4A1513] bg-[#FAF5F2] shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Smartphone size={18} className="text-[#4A1513]" />
                        <div>
                          <span className="text-xs font-bold text-stone-900 block">UPI Instant (GPay / PhonePe / Paytm)</span>
                          <span className="text-[10.5px] text-stone-500">Pay directly from your bank app</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs">Fastest</span>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="mt-3 pt-2.5 border-t border-stone-200">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobile@upi"
                          className="w-full px-3 py-2 border border-stone-300 rounded-sm text-xs font-medium bg-white focus:outline-none focus:border-[#4A1513]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Card Option */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-sm border-2 transition cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-[#4A1513] bg-[#FAF5F2] shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CreditCard size={18} className="text-[#4A1513]" />
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">Credit / Debit Card</span>
                        <span className="text-[10.5px] text-stone-500">Visa, MasterCard, RuPay, Amex</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Banking */}
                  <div
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3.5 rounded-sm border-2 transition cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'border-[#4A1513] bg-[#FAF5F2] shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Landmark size={18} className="text-[#4A1513]" />
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">Net Banking</span>
                        <span className="text-[10.5px] text-stone-500">All major Indian banks supported</span>
                      </div>
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3.5 rounded-sm border-2 transition cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-[#4A1513] bg-[#FAF5F2] shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Banknote size={18} className="text-[#4A1513]" />
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">Cash on Delivery</span>
                        <span className="text-[10.5px] text-stone-500">Pay cash upon delivery to your doorstep</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Final Order Amount Summary */}
                <div className="p-4 bg-[#FAF7F4] rounded-2xl border border-stone-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Delivering to:</span>
                    <span className="font-semibold text-stone-900">{fullName} ({pincode})</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Item &amp; Size:</span>
                    <span className="font-semibold text-stone-900">{product.name.split('-')[0]} ({activeSize})</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-bold text-sm text-stone-900">
                    <span>Total Amount Payable:</span>
                    <span className="font-sans text-xl font-bold text-[#4A1513] tabular-nums">
                      ₹{finalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* STEP 4: ORDER CONFIRMED & SUCCESS */}
            {/* --------------------------------------------------------------------- */}
            {currentStep === 4 && (
              <div className="py-6 flex flex-col items-center text-center space-y-4">
                
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-lg animate-bounce">
                  <CheckCircle2 size={32} />
                </div>

                <div>
                  <h4 className="font-serif text-2xl font-bold text-stone-900">
                    Order Placed Successfully! 🎉
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 max-w-sm">
                    Thank you for your purchase. We are preparing your couture outfit for priority shipment.
                  </p>
                </div>

                {/* Order Summary Receipt Box */}
                <div className="w-full bg-[#FAF7F4] p-4 rounded-2xl border border-stone-200 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Order ID:</span>
                    <span className="font-mono font-bold text-stone-900">{confirmedOrderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Product:</span>
                    <span className="font-semibold text-stone-900 truncate max-w-[200px]">{product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Size &amp; Qty:</span>
                    <span className="font-semibold text-stone-900">{activeSize} · Qty {quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Delivering to:</span>
                    <span className="font-semibold text-stone-900">{addressLine}, {city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Amount Paid:</span>
                    <span className="font-bold text-emerald-700">₹{finalPayable.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* WhatsApp Update Pill */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm text-xs text-emerald-800 font-medium flex items-center gap-2">
                  <span>📱 Tracking updates will be sent to <b>+91 {phone}</b></span>
                </div>

                <div className="w-full pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3.5 rounded-sm bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                  <Link
                    href="/orders"
                    className="w-full py-3 rounded-sm bg-white border border-stone-300 text-stone-700 text-xs font-bold uppercase tracking-wider text-center hover:border-stone-500 transition"
                  >
                    View All Orders
                  </Link>
                </div>

              </div>
            )}

          </div>

          {/* ========================================================================= */}
          {/* DRAWER FOOTER (NAVIGATION BUTTONS) */}
          {/* ========================================================================= */}
          {currentStep < 4 && (
            <div className="px-5 py-4 bg-white border-t border-stone-200 flex items-center justify-between shrink-0">
              
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-4 py-2.5 rounded-sm border border-stone-300 text-stone-700 text-xs font-bold uppercase tracking-wider hover:border-stone-500 transition cursor-pointer"
                >
                  Back
                </button>
              ) : (
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Total Payable</span>
                  <span className="font-sans text-base font-bold text-stone-900 tabular-nums">
                    ₹{finalPayable.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <button
                type="button"
                disabled={isPlacingOrder}
                onClick={() => {
                  if (currentStep === 1) {
                    setCurrentStep(2);
                  } else if (currentStep === 2) {
                    setCurrentStep(3);
                  } else if (currentStep === 3) {
                    handlePlaceOrder();
                  }
                }}
                className="px-6 py-3 rounded-sm bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-[0.16em] shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isPlacingOrder ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>
                    {currentStep === 1 && 'Proceed to Checkout →'}
                    {currentStep === 2 && 'Continue to Payment →'}
                    {currentStep === 3 && `Place Order (₹${finalPayable.toLocaleString('en-IN')}) 🔒`}
                  </span>
                )}
              </button>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
