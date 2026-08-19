"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  id: number;
  productId: number;
  quantity: number;
  size?: string;
  color?: string;
  product: {
    name: string;
    price: number;
    discountPrice?: number | null;
    image?: string | null;
  };
};

type CartData = {
  id: number;
  userId: number;
  items: CartItem[];
};

export function CartSummary() {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.status === 401) {
        setError("Please log in to view your cart.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setCartData(data);
    } catch (err) {
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    // Optimistic UI update
    setCartData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item)
      };
    });

    try {
      await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity })
      });
    } catch (err) {
      fetchCart(); // Revert on failure
    }
  };

  const removeItem = async (itemId: number) => {
    // Optimistic UI update
    setCartData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      };
    });

    try {
      await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
    } catch (err) {
      fetchCart(); // Revert on failure
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-zinc-500">Loading cart...</div>;
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm text-center">
        <p className="text-zinc-600 mb-4">{error}</p>
        <Link href="/login" className="rounded-full bg-primary px-6 py-2 text-sm font-bold tracking-widest uppercase text-white">
          Login
        </Link>
      </div>
    );
  }

  const items = cartData?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);
  
  // Calculate delivery & discount
  const delivery = subtotal > 1500 ? 0 : (subtotal > 0 ? 99 : 0);
  // Example flat discount if they spend over 3000
  const discount = subtotal > 3000 ? Math.floor(subtotal * 0.1) : 0;
  const total = subtotal + delivery - discount;

  return (
    <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="font-serif text-2xl text-text-main">Shopping Cart</h2>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-zinc-600 mb-6">Your cart is empty. Add products from the marketplace.</p>
          <Link href="/shop" className="rounded-full bg-text-main px-6 py-3 text-xs font-bold tracking-widest uppercase text-white hover:bg-primary transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {items.map((item) => {
              const currentPrice = item.product.discountPrice || item.product.price;
              
              return (
                <div key={item.id} className="rounded-2xl border border-zinc-200 p-4 flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-24 shrink-0 rounded-lg overflow-hidden bg-zinc-100">
                    <img 
                      src={item.product.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop"} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-text-main leading-tight">{item.product.name}</p>
                        <p className="font-bold text-primary whitespace-nowrap ml-4">₹{(currentPrice * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                      
                      <div className="text-xs text-zinc-500 mt-1 flex gap-3">
                        {item.size && <span>Size: <strong className="text-zinc-700">{item.size}</strong></span>}
                        {item.color && <span>Color: <strong className="text-zinc-700">{item.color}</strong></span>}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">₹{currentPrice.toLocaleString('en-IN')} each</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity, -1)}
                          className="rounded-full border border-zinc-200 w-7 h-7 flex items-center justify-center text-sm hover:bg-zinc-50 transition"
                        >
                          −
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity, 1)}
                          className="rounded-full border border-zinc-200 w-7 h-7 flex items-center justify-center text-sm hover:bg-zinc-50 transition"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-bold tracking-widest uppercase text-text-muted hover:text-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Calculations */}
          <div className="rounded-2xl bg-zinc-50 p-6 space-y-3">
            <div className="flex items-center justify-between text-sm text-zinc-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-zinc-600">
              <span>Delivery {delivery === 0 && <span className="text-emerald-500 font-bold ml-1">(Free over ₹1,500)</span>}</span>
              <span>{delivery === 0 ? 'Free' : `₹${delivery}`}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-sm text-emerald-600 font-medium">
                <span>Discount (10% off over ₹3,000)</span>
                <span>- ₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            
            <div className="border-t border-zinc-200 my-2 pt-3 flex items-center justify-between">
              <span className="font-serif text-lg text-text-main font-bold">Total</span>
              <span className="font-serif text-xl text-primary font-bold">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <Link href="/checkout" className="block w-full text-center rounded-full bg-text-main px-4 py-4 text-[11px] font-bold tracking-[0.2em] uppercase text-white hover:bg-primary transition shadow-md">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
