"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, Sparkles, UserCheck } from "lucide-react";
import { PageBanner } from "@/components/common/PageBanner";
import { useFemazonStore, WishlistItem } from "@/context/FemazonStoreContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, moveWishlistToCart, user, refreshWishlist } = useFemazonStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    refreshWishlist();
  }, [refreshWishlist]);

  const handleRemove = async (productId: string | number) => {
    await removeFromWishlist(productId);
  };

  const handleMoveToCart = async (item: WishlistItem) => {
    await moveWishlistToCart(item, 'M');
  };

  if (!mounted) {
    return <div className="p-12 text-center text-stone-400 font-sans text-sm">Loading your private vault...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Standardized Luxury Page Banner */}
      <PageBanner
        title="Your Saved Wishlist"
        highlightText="Curated Favorites"
        description="Cherished pieces, festive bridal wear, and celebration picks saved to your private Femazon vault."
        ctaText="Explore Collection"
        ctaLink="/shop"
        imageSrc="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop"
        imageAlt="Femazon Wishlist"
      />

      {/* Guest Mode Informational Banner */}
      {!user && (
        <div className="p-4 rounded-2xl bg-[#FAF7F4] border border-[#4A1513]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-[#4A1513] shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Guest Wishlist Mode</h4>
              <p className="text-xs text-stone-500">
                These items are currently stored in your browser. Sign in to synchronize them to your permanent account vault.
              </p>
            </div>
          </div>
          <Link
            href="/login?callbackUrl=/wishlist"
            className="px-5 py-2.5 rounded-full bg-[#4A1513] hover:bg-[#350B0A] text-white text-[11px] font-bold uppercase tracking-wider transition shrink-0"
          >
            Sign In to Save
          </Link>
        </div>
      )}

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-stone-200/80 rounded-3xl mx-auto shadow-xs">
          <Heart size={48} className="text-stone-300 mb-6" strokeWidth={1} />
          <h3 className="font-serif text-2xl text-stone-900 mb-2">Nothing saved yet</h3>
          <p className="text-stone-500 max-w-[400px] mx-auto mb-8 text-sm">
            Click the heart icon on luxury lehengas, sarees, and ensembles you adore to curate them here.
          </p>
          <Link 
            href="/shop"
            className="bg-[#4A1513] hover:bg-[#350B0A] text-white font-bold text-[12px] uppercase tracking-widest px-8 py-3.5 rounded-full shadow-md transition-colors"
          >
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-8">
          {wishlist.map((item) => {
            const currentPrice = item.price;
            const originalPrice = item.originalPrice || item.price;

            return (
              <div 
                key={item.id} 
                className="group flex flex-col h-full bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                {/* Media Area */}
                <div className="relative w-full aspect-[4/5] bg-stone-100 overflow-hidden">
                  <Link href={`/product/${item.productId}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>

                  {/* Remove Button */}
                  <button 
                    type="button"
                    onClick={() => handleRemove(item.productId)}
                    className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-stone-400 hover:text-rose-600 hover:bg-white transition-all cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Details Area */}
                <div className="flex flex-col flex-1 p-4">
                  {item.brand && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A1513] mb-1">
                      {item.brand}
                    </span>
                  )}

                  <Link href={`/product/${item.productId}`}>
                    <h3 className="font-serif text-[14px] text-stone-900 font-medium leading-snug line-clamp-2 mb-2 hover:text-[#4A1513] transition-colors">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-4 mt-auto">
                    <span className="text-[14px] font-bold text-stone-900">
                      ₹{currentPrice.toLocaleString('en-IN')}
                    </span>
                    {originalPrice > currentPrice && (
                      <span className="text-[11.5px] text-stone-400 line-through">
                        ₹{originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button 
                    type="button"
                    onClick={() => handleMoveToCart(item)}
                    className="w-full mt-auto bg-white hover:bg-[#4A1513] border border-[#4A1513] text-[#4A1513] hover:text-white font-bold text-[11px] uppercase tracking-wider py-2.5 rounded-full shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag size={13} />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
