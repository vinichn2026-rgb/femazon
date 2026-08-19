"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, Truck, CreditCard, Banknote } from "lucide-react";

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

export function CheckoutSummary() {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingAddr: "",
    shippingCity: "",
    shippingState: "",
    shippingPin: ""
  });
  
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.status === 401) {
        setError("Please log in to checkout.");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartData || cartData.items.length === 0) return;
    
    setProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          paymentMethod
        })
      });
      
      if (!res.ok) throw new Error("Failed to create order");
      
      const order = await res.json();
      setOrderId(order.id);
      
    } catch (err) {
      alert("There was an error processing your order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading checkout details...</div>;
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm text-center">
        <p className="text-zinc-600 mb-4">{error}</p>
        <Link href="/login" className="rounded-full bg-primary px-6 py-2 text-sm font-bold tracking-widest uppercase text-white">
          Login
        </Link>
      </div>
    );
  }

  if (orderId) {
    return (
      <div className="rounded-[2rem] border border-zinc-200 bg-white p-10 shadow-sm text-center">
        <CheckCircle2 size={64} className="mx-auto text-emerald-500 mb-6" strokeWidth={1.5} />
        <h1 className="text-3xl font-serif text-text-main mb-2">Order Confirmed!</h1>
        <p className="text-zinc-500 mb-8 max-w-md mx-auto">
          Thank you for your purchase. Your order <strong className="text-text-main">#FMZ10{orderId}</strong> has been successfully placed. We'll send you an email with your shipping details shortly.
        </p>
        <Link href="/orders" className="rounded-full bg-text-main px-8 py-3.5 text-[12px] font-bold tracking-widest uppercase text-white hover:bg-primary transition shadow-md">
          View My Orders
        </Link>
      </div>
    );
  }

  const items = cartData?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);
  
  const delivery = subtotal > 1500 ? 0 : (subtotal > 0 ? 99 : 0);
  const discount = subtotal > 3000 ? Math.floor(subtotal * 0.1) : 0;
  const total = subtotal + delivery - discount;

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/cart" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-text-muted hover:text-primary transition mb-8">
        <ChevronLeft size={14} className="mr-1" /> Back to Cart
      </Link>
      
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Checkout</p>
        <h1 className="text-3xl md:text-4xl font-serif text-text-main">Complete your order</h1>
      </div>

      <form onSubmit={handleConfirm} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Address & Payment */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. Address Form */}
          <div className="rounded-[2rem] border border-accent/20 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-serif text-text-main mb-6 flex items-center gap-2">
              <span className="bg-text-main text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-sans">1</span>
              Delivery Address
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Full Name *</label>
                <input required type="text" name="shippingName" value={formData.shippingName} onChange={handleInputChange} className="w-full border border-accent/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" placeholder="e.g. Jane Doe" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Phone Number *</label>
                <input required type="tel" name="shippingPhone" value={formData.shippingPhone} onChange={handleInputChange} className="w-full border border-accent/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" placeholder="10-digit mobile number" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Street Address *</label>
                <input required type="text" name="shippingAddr" value={formData.shippingAddr} onChange={handleInputChange} className="w-full border border-accent/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" placeholder="House/Flat No., Street, Landmark" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">City *</label>
                <input required type="text" name="shippingCity" value={formData.shippingCity} onChange={handleInputChange} className="w-full border border-accent/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" placeholder="City" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">State *</label>
                <input required type="text" name="shippingState" value={formData.shippingState} onChange={handleInputChange} className="w-full border border-accent/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" placeholder="State" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Pincode *</label>
                <input required type="text" name="shippingPin" value={formData.shippingPin} onChange={handleInputChange} className="w-full border border-accent/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" placeholder="6-digit Pincode" />
              </div>
            </div>
          </div>

          {/* 3. Payment Selection */}
          <div className="rounded-[2rem] border border-accent/20 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-serif text-text-main mb-6 flex items-center gap-2">
              <span className="bg-text-main text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-sans">2</span>
              Payment Method
            </h2>

            <div className="space-y-3">
              <label className={`block border rounded-xl p-4 cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-accent/20 hover:border-primary/50'}`}>
                <div className="flex items-center gap-4">
                  <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="w-4 h-4 text-primary focus:ring-primary accent-primary" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
                      <Banknote size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-text-main text-sm">Cash on Delivery (COD)</p>
                      <p className="text-xs text-text-muted">Pay when your order arrives at your doorstep.</p>
                    </div>
                  </div>
                </div>
              </label>

              <label className={`block border rounded-xl p-4 cursor-not-allowed opacity-60 bg-zinc-50 border-accent/10`}>
                <div className="flex items-center gap-4">
                  <input type="radio" name="paymentMethod" value="ONLINE" disabled className="w-4 h-4" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-400">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-500 text-sm">Credit/Debit Card, UPI</p>
                      <p className="text-xs text-amber-600 font-medium">Coming Soon</p>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Confirm */}
        <div className="lg:col-span-5">
          <div className="rounded-[2rem] border border-accent/20 bg-white p-6 md:p-8 shadow-sm sticky top-8">
            <h2 className="text-xl font-serif text-text-main mb-6 flex items-center gap-2">
              <span className="bg-text-main text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-sans">3</span>
              Order Summary
            </h2>
            
            {items.length === 0 ? (
              <p className="text-sm text-zinc-600">No products in your cart.</p>
            ) : (
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => {
                   const price = item.product.discountPrice || item.product.price;
                   return (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-20 shrink-0 rounded-lg overflow-hidden bg-zinc-100">
                        <img 
                          src={item.product.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop"} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start">
                          <p className="font-semibold text-sm text-text-main leading-snug pr-4">{item.product.name}</p>
                          <p className="font-bold text-sm text-text-main whitespace-nowrap">₹{(price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-1 flex gap-2">
                          <span>Qty: {item.quantity}</span>
                          {item.size && <span>• Size: {item.size}</span>}
                          {item.color && <span>• Color: {item.color}</span>}
                        </div>
                      </div>
                    </div>
                   );
                })}
              </div>
            )}

            <div className="rounded-2xl bg-zinc-50 p-5 shadow-inner">
              <div className="flex items-center justify-between text-sm text-zinc-600 mb-3">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-zinc-600 mb-3">
                <span>Delivery</span>
                <span>{delivery === 0 ? 'Free' : `₹${delivery}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-sm text-emerald-600 font-medium mb-3">
                  <span>Discount</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 text-xl font-serif font-bold text-text-main">
                <span>Total</span>
                <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
              </div>
              
              <button
                type="submit"
                disabled={items.length === 0 || processing}
                className="mt-6 w-full rounded-full bg-text-main px-5 py-4 text-[12px] font-bold tracking-[0.15em] uppercase text-white shadow-lg transition hover:bg-primary disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? "Processing..." : "Place Order"}
              </button>
            </div>
            
            <p className="text-center text-[10px] text-zinc-400 mt-6 flex items-center justify-center gap-1">
              <CheckCircle2 size={12} /> Secure and encrypted checkout
            </p>
          </div>
        </div>

      </form>
    </div>
  );
}
