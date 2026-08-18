"use client";

import { useEffect, useMemo, useState } from "react";

type CartItem = {
  id: number;
  slug: string;
  name: string;
  price: number;
  quantity: number;
};

type Booking = {
  title: string;
  category: string;
  slot: string;
};

const CART_STORAGE_KEY = "femazon_cart";
const BOOKING_STORAGE_KEY = "femazon_booking";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function loadBooking(): Booking | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(BOOKING_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Booking;
  } catch {
    return null;
  }
}

function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
}

export function CheckoutSummary() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [completeMessage, setCompleteMessage] = useState("");

  useEffect(() => {
    setCart(loadCart());
    setBooking(loadBooking());
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const handleConfirm = () => {
    if (cart.length === 0 && !booking) {
      return;
    }

    clearCart();
    setCart([]);
    setCompleteMessage(
      booking
        ? `Your order and ${booking.title} booking are confirmed. We will email the final details shortly.`
        : "Your order is confirmed. We will email the confirmation shortly."
    );
  };

  return (
    <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-600">Checkout</p>
          <h1 className="mt-3 text-3xl font-semibold">Confirm your purchase</h1>
        </div>
      </div>

      {completeMessage ? (
        <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 shadow-sm">
          <p className="font-semibold">Success!</p>
          <p className="mt-2 text-sm">{completeMessage}</p>
        </div>
      ) : null}

      <div className="mt-8 space-y-6">
        <div className="rounded-[1.5rem] bg-zinc-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Cart items</p>
          {cart.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-600">No products in your cart yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {cart.map((item) => (
                <div key={item.slug} className="rounded-3xl border border-zinc-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-zinc-500">Qty {item.quantity}</p>
                    </div>
                    <p className="font-semibold">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[1.5rem] bg-zinc-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Service booking</p>
          {booking ? (
            <div className="mt-4 rounded-3xl border border-zinc-200 bg-white p-5">
              <p className="font-semibold">{booking.title}</p>
              <p className="mt-2 text-sm text-zinc-600">{booking.category}</p>
              <p className="mt-1 text-sm font-medium text-zinc-700">Selected slot: {booking.slot}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-600">No service booking has been confirmed yet.</p>
          )}
        </div>

        <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-sm text-zinc-600">
            <span>Subtotal</span>
            <span>${(subtotal / 100).toFixed(2)}</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-zinc-600">
            <span>Service booking</span>
            <span>{booking ? "$0.00" : "$0.00"}</span>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-zinc-200 pt-4 text-lg font-semibold">
            <span>Total</span>
            <span>${(subtotal / 100).toFixed(2)}</span>
          </div>
          <button
            type="button"
            disabled={cart.length === 0 && !booking}
            onClick={handleConfirm}
            className="mt-6 w-full rounded-full bg-amber-600 px-5 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 hover:bg-amber-700"
          >
            Confirm and finalize
          </button>
        </div>
      </div>
    </div>
  );
}
