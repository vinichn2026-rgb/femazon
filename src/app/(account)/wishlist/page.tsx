"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

type WishlistItem = {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    price: number;
    discountPrice?: number | null;
    image?: string | null;
  };
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist");
      if (res.status === 401) {
        setError("Please log in to view your wishlist.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      setError("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (itemId: number) => {
    // Optimistic UI update
    setItems((prev) => prev.filter((item) => item.id !== itemId));

    try {
      await fetch(`/api/wishlist/${itemId}`, { method: "DELETE" });
    } catch (err) {
      fetchWishlist(); // Revert on failure
    }
  };

  const handleMoveToCart = async (item: WishlistItem) => {
    try {
      // 1. Add to cart
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        alert("Failed to add to cart.");
        return;
      }

      // 2. Remove from wishlist
      await handleRemove(item.id);
      alert(`${item.product.name} moved to cart!`);
    } catch (err) {
      alert("Error moving item to cart.");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-surface p-8 flex justify-center items-center text-zinc-500">Loading wishlist...</div>;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-surface p-8 flex justify-center items-center">
        <div className="rounded-[2rem] border border-accent/20 bg-white p-12 shadow-sm text-center">
          <Heart size={48} className="mx-auto text-zinc-300 mb-6" />
          <h2 className="font-serif text-2xl text-text-main mb-2">Sign in to sync your wishlist</h2>
          <p className="text-zinc-500 mb-8 max-w-sm">Save your favorite items across all your devices and never lose track of what you love.</p>
          <Link href="/login" className="rounded-full bg-text-main px-8 py-3.5 text-xs font-bold tracking-widest uppercase text-white hover:bg-primary transition-colors">
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 text-center">
          <h1 className="font-serif text-4xl font-normal text-text-main mb-3">Your Wishlist</h1>
          <p className="font-sans text-[15px] text-text-muted">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#fbf9f6] border border-accent/10 rounded-3xl mx-auto max-w-3xl">
            <Heart size={48} className="text-zinc-300 mb-6" strokeWidth={1} />
            <h3 className="font-serif text-2xl text-text-main mb-2">Nothing saved yet</h3>
            <p className="text-text-muted max-w-[400px] mx-auto mb-8">
              Click the heart icon on products you love to save them here for later.
            </p>
            <Link 
              href="/shop"
              className="bg-text-main text-white font-bold text-[12px] uppercase tracking-widest px-8 py-3.5 rounded-full shadow-md hover:bg-primary transition-colors"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-10">
            {items.map((item) => {
              const currentPrice = item.product.discountPrice || item.product.price;
              
              return (
                <div key={item.id} className="group flex flex-col h-full bg-white rounded-2xl border border-accent/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Media Area */}
                  <div className="relative w-full aspect-[4/5] bg-accent/5 overflow-hidden">
                    <Link href={`/product/${item.product.id}`}>
                      <img 
                        src={item.product.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop"} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                    
                    {/* Remove Button */}
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-text-muted hover:text-red-500 hover:bg-white transition-all duration-300"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Details Area */}
                  <div className="flex flex-col flex-1 p-4">
                    <Link href={`/product/${item.product.id}`}>
                      <h3 className="text-[13px] md:text-[14px] text-text-main font-medium leading-snug line-clamp-2 mb-2 hover:text-primary transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-4 mt-auto">
                      <span className="text-[14px] md:text-[15px] font-bold text-text-main">
                        ₹{currentPrice.toLocaleString('en-IN')}
                      </span>
                      {item.product.discountPrice && (
                        <span className="text-[12px] text-text-muted line-through">
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handleMoveToCart(item)}
                      className="w-full mt-auto bg-white border border-text-main text-text-main font-bold text-[11px] uppercase tracking-widest py-3 rounded-full shadow-sm hover:bg-text-main hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={14} /> Move to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
