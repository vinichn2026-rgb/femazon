"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  ChevronLeft, 
  Truck, 
  CreditCard, 
  Banknote, 
  MapPin, 
  Plus, 
  UserCheck, 
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { useFemazonStore } from "@/context/FemazonStoreContext";

export interface AddressItem {
  id?: number | string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

interface CheckoutSummaryProps {
  initialUser?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  } | null;
  initialAddresses?: AddressItem[];
}

export function CheckoutSummary({ initialUser, initialAddresses = [] }: CheckoutSummaryProps) {
  const { user: contextUser, cart, clearCart } = useFemazonStore();
  
  // Active user details (prioritize context user, fallback to initialUser from server)
  const activeUser = contextUser || initialUser;
  
  const [addresses, setAddresses] = useState<AddressItem[]>(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<number | string | null>(
    initialAddresses.length > 0 ? (initialAddresses[0].id || 0) : null
  );
  const [showAddAddressForm, setShowAddAddressForm] = useState(initialAddresses.length === 0);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");

  // New Address Form State
  const [newAddress, setNewAddress] = useState<AddressItem>({
    name: activeUser?.name || "",
    phone: activeUser?.phone || "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: initialAddresses.length === 0
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderError, setOrderError] = useState("");

  // Fetch saved addresses from server if not populated
  useEffect(() => {
    if (addresses.length === 0 && activeUser?.email) {
      fetch("/api/addresses")
        .then(res => res.json())
        .then(data => {
          if (data?.addresses && Array.isArray(data.addresses) && data.addresses.length > 0) {
            setAddresses(data.addresses);
            setSelectedAddressId(data.addresses[0].id);
            setShowAddAddressForm(false);
          }
        })
        .catch(() => {});
    }
  }, [activeUser?.email, addresses.length]);

  // Keep user name & phone updated if activeUser changes
  useEffect(() => {
    if (activeUser?.name && !newAddress.name) {
      setNewAddress(prev => ({
        ...prev,
        name: activeUser.name,
        phone: activeUser.phone || prev.phone
      }));
    }
  }, [activeUser]);

  // Handle Input Changes for Address Form
  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Add / Save Address
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError("");

    if (!newAddress.name.trim() || !newAddress.phone.trim() || !newAddress.street.trim() || !newAddress.city.trim() || !newAddress.state.trim() || !newAddress.pincode.trim()) {
      setAddressError("Please fill in all address fields.");
      return;
    }

    setSavingAddress(true);
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress)
      });

      const data = await res.json();
      const saved = data?.address || {
        ...newAddress,
        id: Date.now()
      };

      const updated = [saved, ...addresses];
      setAddresses(updated);
      setSelectedAddressId(saved.id);
      setShowAddAddressForm(false);
    } catch (err) {
      // Local fallback
      const fallback = { ...newAddress, id: Date.now() };
      setAddresses(prev => [fallback, ...prev]);
      setSelectedAddressId(fallback.id);
      setShowAddAddressForm(false);
    } finally {
      setSavingAddress(false);
    }
  };

  // Get currently selected address
  const activeDeliveryAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0] || (showAddAddressForm ? newAddress : null);

  // Cart & Pricing Calculation
  const items = cart || [];
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = Number(item.price) || 0;
    const itemQty = Number(item.quantity) || 1;
    return sum + (itemPrice * itemQty);
  }, 0);

  const delivery = subtotal > 1500 ? 0 : (subtotal > 0 ? 99 : 0);
  const discount = subtotal > 3000 ? Math.floor(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal + delivery - discount);

  // Place Order Handler
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError("");

    if (items.length === 0) {
      setOrderError("Your cart is empty. Please add items before checking out.");
      return;
    }

    const deliveryAddr = activeDeliveryAddress;
    if (!deliveryAddr || !deliveryAddr.street || !deliveryAddr.pincode) {
      setOrderError("Please add and select a valid delivery address.");
      setShowAddAddressForm(true);
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingName: deliveryAddr.name,
          shippingPhone: deliveryAddr.phone,
          shippingAddr: deliveryAddr.street,
          shippingCity: deliveryAddr.city,
          shippingState: deliveryAddr.state,
          shippingPin: deliveryAddr.pincode,
          paymentMethod,
          items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            size: item.size || null,
            color: item.color || null
          }))
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to place order");
      }

      const order = await res.json();
      setOrderId(order.id || Math.floor(1000 + Math.random() * 9000));
      clearCart();
    } catch (err: any) {
      console.error("[Checkout] Order placement error:", err);
      setOrderError(err.message || "There was an error processing your order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Order Confirmed State
  if (orderId) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center shadow-lg">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} strokeWidth={2} />
        </div>
        <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-emerald-600 bg-emerald-100/60 px-3 py-1 rounded-full">
          Order Placed Successfully
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-4 mb-2">Thank you for your order!</h1>
        <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">
          Your order <strong className="text-stone-900 font-mono">#FMZ-{orderId}</strong> has been received and is being prepared for dispatch.
        </p>

        {activeDeliveryAddress && (
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left max-w-md mx-auto mb-8 text-xs text-stone-600 space-y-1">
            <p className="font-bold text-stone-900 text-sm mb-1 flex items-center gap-1.5">
              <MapPin size={14} className="text-[#4A1513]" /> Delivering to:
            </p>
            <p className="font-semibold text-stone-800">{activeDeliveryAddress.name} ({activeDeliveryAddress.phone})</p>
            <p>{activeDeliveryAddress.street}, {activeDeliveryAddress.city}</p>
            <p>{activeDeliveryAddress.state} - {activeDeliveryAddress.pincode}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href="/orders" 
            className="px-8 py-3.5 rounded-full bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-[0.16em] shadow-md transition-all text-center"
          >
            View My Orders
          </Link>
          <Link 
            href="/" 
            className="px-8 py-3.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-[0.16em] transition-all text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between mb-6">
        <Link 
          href="/cart" 
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-[#4A1513] transition"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Cart
        </Link>
        
        {/* Customer Badge */}
        {activeUser && (
          <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-200 px-3.5 py-1.5 rounded-full text-xs text-stone-700">
            <UserCheck size={14} className="text-emerald-600" />
            <span>Logged in as <strong>{activeUser.name || activeUser.email}</strong></span>
          </div>
        )}
      </div>

      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A1513] mb-1">Express Checkout</p>
        <h1 className="text-3xl md:text-4xl font-serif text-stone-900">Review & Place Your Order</h1>
      </div>

      {orderError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0" />
          <span>{orderError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Address Selection / Add Address Form & Payment */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECTION 1: Delivery Address */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-stone-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#4A1513] text-white inline-flex items-center justify-center text-xs font-bold font-sans">
                  1
                </span>
                <span>Delivery Address</span>
              </h2>

              {addresses.length > 0 && !showAddAddressForm && (
                <button
                  type="button"
                  onClick={() => setShowAddAddressForm(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A1513] hover:underline cursor-pointer"
                >
                  <Plus size={14} /> Add New Address
                </button>
              )}
            </div>

            {/* List Saved Addresses */}
            {addresses.length > 0 && !showAddAddressForm && (
              <div className="space-y-3 mb-4">
                {addresses.map((addr, idx) => {
                  const addrKey = addr.id || idx;
                  const isSelected = selectedAddressId === addrKey;
                  return (
                    <div
                      key={addrKey}
                      onClick={() => setSelectedAddressId(addrKey)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected 
                          ? 'border-[#4A1513] bg-[#4A1513]/5' 
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={isSelected}
                        onChange={() => setSelectedAddressId(addrKey)}
                        className="mt-1 accent-[#4A1513] text-[#4A1513]"
                      />
                      <div className="flex-1 text-xs text-stone-600">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-stone-900 text-sm">{addr.name}</span>
                          <span className="text-stone-400">•</span>
                          <span className="font-medium text-stone-700">{addr.phone}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold uppercase bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="leading-relaxed">{addr.street}, {addr.city}</p>
                        <p className="leading-relaxed">{addr.state} - <strong className="text-stone-800">{addr.pincode}</strong></p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Address Form ("add address add pananum") */}
            {showAddAddressForm && (
              <form onSubmit={handleSaveAddress} className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#4A1513]" /> Enter Shipping Details
                  </span>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAddAddressForm(false)}
                      className="text-xs text-stone-400 hover:text-stone-700"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {addressError && (
                  <p className="text-xs text-rose-600 font-medium">{addressError}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={newAddress.name}
                      onChange={handleAddressInputChange}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4A1513] focus:ring-1 focus:ring-[#4A1513] text-sm text-stone-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={newAddress.phone}
                      onChange={handleAddressInputChange}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4A1513] focus:ring-1 focus:ring-[#4A1513] text-sm text-stone-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      Street Address / Flat / Landmark *
                    </label>
                    <input
                      required
                      type="text"
                      name="street"
                      value={newAddress.street}
                      onChange={handleAddressInputChange}
                      placeholder="House/Flat No, Apartment, Street name"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4A1513] focus:ring-1 focus:ring-[#4A1513] text-sm text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      City *
                    </label>
                    <input
                      required
                      type="text"
                      name="city"
                      value={newAddress.city}
                      onChange={handleAddressInputChange}
                      placeholder="City"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4A1513] focus:ring-1 focus:ring-[#4A1513] text-sm text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      State *
                    </label>
                    <input
                      required
                      type="text"
                      name="state"
                      value={newAddress.state}
                      onChange={handleAddressInputChange}
                      placeholder="State"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4A1513] focus:ring-1 focus:ring-[#4A1513] text-sm text-stone-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      Pincode *
                    </label>
                    <input
                      required
                      type="text"
                      name="pincode"
                      value={newAddress.pincode}
                      onChange={handleAddressInputChange}
                      placeholder="6-digit Pincode"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4A1513] focus:ring-1 focus:ring-[#4A1513] text-sm text-stone-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="saveDefault"
                    name="isDefault"
                    checked={Boolean(newAddress.isDefault)}
                    onChange={handleAddressInputChange}
                    className="accent-[#4A1513] w-4 h-4 rounded cursor-pointer"
                  />
                  <label htmlFor="saveDefault" className="text-xs text-stone-600 cursor-pointer">
                    Save as default delivery address
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={savingAddress}
                  className="w-full py-3.5 rounded-full bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all mt-4 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {savingAddress ? "Saving Address..." : "Save & Deliver Here"}
                </button>
              </form>
            )}
          </div>

          {/* SECTION 2: Payment Method */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-serif text-stone-900 mb-6 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#4A1513] text-white inline-flex items-center justify-center text-xs font-bold font-sans">
                2
              </span>
              <span>Payment Method</span>
            </h2>

            <div className="space-y-3">
              <label className={`block border-2 rounded-2xl p-4 cursor-pointer transition-colors ${
                paymentMethod === 'COD' ? 'border-[#4A1513] bg-[#4A1513]/5' : 'border-stone-200 hover:border-stone-300'
              }`}>
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="accent-[#4A1513] text-[#4A1513]"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#4A1513]">
                      <Banknote size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 text-sm">Cash on Delivery (COD)</p>
                      <p className="text-xs text-stone-500">Pay cash or scan QR when your package arrives at your door.</p>
                    </div>
                  </div>
                </div>
              </label>

              <label className="block border-2 rounded-2xl p-4 opacity-50 bg-stone-50 border-stone-200 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <input type="radio" disabled name="paymentMethod" value="ONLINE" className="accent-stone-400" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-400">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-stone-500 text-sm">UPI, Net Banking & Cards</p>
                      <p className="text-[11px] text-amber-700 font-medium">Online Gateway Activation in Progress</p>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Items & Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm sticky top-8">
            <h2 className="text-xl font-serif text-stone-900 mb-6 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#4A1513] text-white inline-flex items-center justify-center text-xs font-bold font-sans">
                3
              </span>
              <span>Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
            </h2>

            {/* Cart Items List */}
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-stone-500 text-sm mb-4">No products in your checkout cart.</p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-2.5 rounded-full bg-[#4A1513] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-4 mb-6 max-h-[320px] overflow-y-auto pr-2 divide-y divide-stone-100">
                {items.map((item) => {
                  const price = Number(item.price) || 0;
                  const qty = Number(item.quantity) || 1;
                  return (
                    <div key={item.id} className="pt-3 first:pt-0 flex gap-4">
                      <div className="w-16 h-20 shrink-0 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-semibold text-xs sm:text-sm text-stone-900 line-clamp-2">{item.name}</p>
                          <p className="font-bold text-xs sm:text-sm text-stone-900 whitespace-nowrap">
                            ₹{(price * qty).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="text-[11px] text-stone-500 mt-1 flex flex-wrap items-center gap-2">
                          <span>Qty: <strong>{qty}</strong></span>
                          {item.size && <span>• Size: <strong>{item.size}</strong></span>}
                          {item.color && <span>• Color: <strong>{item.color}</strong></span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Price Breakdown */}
            <div className="rounded-2xl bg-stone-50 p-5 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm text-stone-600">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm text-stone-600">
                <span>Delivery</span>
                <span className="font-medium text-stone-900">
                  {delivery === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${delivery}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-xs sm:text-sm text-emerald-600 font-medium">
                  <span>Special Discount (10% off)</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between">
                <div>
                  <span className="font-serif text-lg font-bold text-stone-900 block">Total Amount</span>
                  <span className="text-[10px] text-stone-400">Inclusive of all taxes</span>
                </div>
                <span className="font-serif text-2xl font-bold text-[#4A1513]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Order Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={items.length === 0 || processing}
                className="w-full mt-4 py-4 rounded-full bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-[0.16em] shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {processing ? "Processing Your Order..." : `Place Order (₹${total.toLocaleString('en-IN')})`}
              </button>
            </div>

            <p className="text-center text-[11px] text-stone-400 mt-4 flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck size={14} className="text-[#4A1513]" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
