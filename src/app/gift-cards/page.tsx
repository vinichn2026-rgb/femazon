"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  Calendar, 
  ShieldCheck, 
  CreditCard,
  Heart,
  ArrowRight
} from 'lucide-react';
import { useFemazonStore } from '@/context/FemazonStoreContext';

const DENOMINATIONS = [1000, 2500, 5000, 10000, 25000];

export default function GiftCardsPage() {
  const { addToCart } = useFemazonStore();
  const [selectedAmount, setSelectedAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  const [giftMessage, setGiftMessage] = useState<string>("");
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const finalAmount = customAmount ? Number(customAmount) : selectedAmount;

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientEmail.trim() || finalAmount <= 0) return;

    addToCart({
      productId: "gift-card-" + Date.now(),
      name: `Femazon Luxury Digital Gift Card (₹${finalAmount.toLocaleString("en-IN")})`,
      brand: "Femazon Luxe",
      price: finalAmount,
      originalPrice: finalAmount,
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
      size: `₹${finalAmount.toLocaleString("en-IN")}`,
      color: "Gold Foil",
      quantity: 1,
      category: "Gift Cards",
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3500);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] pb-24 text-stone-900">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#3D1412] via-[#4A1513] to-[#5C1B19] text-white pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF0E6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-amber-200 mb-3 border border-white/15">
            <Gift size={13} className="text-amber-300" />
            <span>The Gift of Absolute Choice</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-3">
            Femazon Luxury Gift Cards
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
            Give the special women in your life access to over 5,000+ curated designer sarees, bridal lehengas, bespoke perfumes, and artisanal keepsakes. Delivered instantly via email.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Live Interactive Card Preview */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#2B0E0D] via-[#4A1513] to-[#7A2421] p-6 text-white shadow-xl flex flex-col justify-between border border-amber-300/30">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#F5E6D3_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span className="font-serif text-xl font-bold tracking-wider text-amber-200">FEMAZON</span>
                  <p className="text-[9px] uppercase tracking-widest text-amber-100/70">Luxury Digital Gift Card</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Sparkles size={16} className="text-amber-300" />
                </div>
              </div>

              <div className="relative z-10 my-auto text-center py-4">
                <span className="text-[11px] uppercase tracking-widest text-stone-300">Gift Amount</span>
                <p className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
                  ₹{finalAmount.toLocaleString("en-IN")}
                </p>
                {recipientName && (
                  <p className="text-xs text-amber-200/90 mt-2 truncate">
                    Exclusively for: <strong className="text-white">{recipientName}</strong>
                  </p>
                )}
              </div>

              <div className="relative z-10 flex items-end justify-between text-[10px] text-stone-300/80 pt-2 border-t border-white/10">
                <span>Valid for 1 Year across all collections</span>
                <span className="font-mono text-amber-200/90">FEMAZON-PRIVÉ</span>
              </div>
            </div>

            {/* Perks Bullet Points */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-3.5 text-xs text-stone-600">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#4A1513] shrink-0" />
                <span>Instant delivery to recipient&apos;s email inbox</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#4A1513] shrink-0" />
                <span>Redeemable on all Women&apos;s Wear, Girls&apos; Wear, Beauty &amp; Gifts</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#4A1513] shrink-0" />
                <span>Never expires for 365 days from issue date</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#4A1513] shrink-0" />
                <span>Can be combined with seasonal offers and sale discounts</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Customization Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2">
              Customize Your Gift Card
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              Choose an amount and write a personalized luxury note to accompany the gift card.
            </p>

            <form onSubmit={handleAddToCart} className="space-y-6">
              
              {/* 1. Amount Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
                  Select Denomination (₹)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {DENOMINATIONS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount("");
                      }}
                      className={`py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        selectedAmount === amt && !customAmount
                          ? "bg-[#4A1513] text-white border-[#4A1513] shadow-xs"
                          : "bg-stone-50 text-stone-700 border-stone-200 hover:border-[#4A1513]/40"
                      }`}
                    >
                      ₹{amt.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Field */}
                <div className="mt-3">
                  <input
                    type="number"
                    min="500"
                    max="100000"
                    placeholder="Or enter custom amount (Min ₹500)"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      if (e.target.value) setSelectedAmount(Number(e.target.value));
                    }}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#4A1513]"
                  />
                </div>
              </div>

              {/* 2. Recipient Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Recipient&apos;s Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Ananya Sharma"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#4A1513]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Recipient&apos;s Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ananya@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#4A1513]"
                  />
                </div>
              </div>

              {/* 3. Sender Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Your Name (Sender)
                </label>
                <input
                  type="text"
                  placeholder="Your Name or Family"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#4A1513]"
                />
              </div>

              {/* 4. Personal Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Personalized Message (Optional)
                </label>
                <textarea
                  rows={3}
                  maxLength={250}
                  placeholder="Wishing you a wonderful celebration! May you pick something you absolutely adore."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#4A1513] resize-none"
                />
                <p className="text-[10px] text-stone-400 text-right mt-1">
                  {250 - giftMessage.length} characters left
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={finalAmount <= 0}
                  className={`w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                    isAdded 
                      ? "bg-emerald-700 text-white"
                      : "bg-[#4A1513] hover:bg-[#350B0A] text-white"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Gift Card Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <Gift size={16} />
                      <span>Add to Bag · ₹{finalAmount.toLocaleString("en-IN")}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
