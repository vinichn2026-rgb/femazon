"use client";

import { useState } from "react";

type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
};

type CartItem = Product & { quantity: number };

const CART_STORAGE_KEY = "femazon_cart";

function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function setCartItems(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function AddToCartButton({ product }: { product: Product }) {
  const [status, setStatus] = useState<"idle" | "added">("idle");

  const handleAddToCart = () => {
    const cart = getCartItems();
    const index = cart.findIndex((item) => item.slug === product.slug);
    if (index >= 0) {
      cart[index] = { ...cart[index], quantity: cart[index].quantity + 1 };
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    setCartItems(cart);
    setStatus("added");

    window.setTimeout(() => setStatus("idle"), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className="rounded-full bg-amber-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-amber-700"
    >
      {status === "added" ? "Added to cart" : "Add to cart"}
    </button>
  );
}
