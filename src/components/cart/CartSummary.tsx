"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  id: number;
  slug: string;
  name: string;
  price: number;
  quantity: number;
};

const CART_STORAGE_KEY = "femazon_cart";

function parseCart() {
  if (typeof window === "undefined") return [] as CartItem[];
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) return [] as CartItem[];

  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [] as CartItem[];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartSummary() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(parseCart());
  }, []);

  const updateQuantity = (slug: string, value: number) => {
    const nextCart = cart.map((item) =>
      item.slug === slug ? { ...item, quantity: Math.max(1, item.quantity + value) } : item
    );
    setCart(nextCart);
    saveCart(nextCart);
  };

  const removeItem = (slug: string) => {
    const nextCart = cart.filter((item) => item.slug !== slug);
    setCart(nextCart);
    saveCart(nextCart);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Cart details</h2>
        <Link href="/checkout" className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          Checkout
        </Link>
      </div>

      {cart.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-600">Your cart is empty. Add products from the marketplace.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {cart.map((item) => (
            <div key={item.slug} className="rounded-3xl border border-zinc-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-zinc-500">{item.quantity} × ${(item.price / 100).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, -1)}
                    className="rounded-full border border-zinc-200 px-3 py-2 text-sm"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, 1)}
                    className="rounded-full border border-zinc-200 px-3 py-2 text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-zinc-500">Total</span>
                <span className="font-semibold">${((item.price * item.quantity) / 100).toFixed(2)}</span>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.slug)}
                className="mt-4 text-sm font-medium text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="rounded-3xl bg-zinc-50 p-4">
            <div className="flex items-center justify-between text-sm text-zinc-600">
              <span>Subtotal</span>
              <span>${(subtotal / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
