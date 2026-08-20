"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, MapPin, Package, AlertCircle, RefreshCw, XCircle, CheckCircle2, Truck, PackageSearch } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrderDetailsClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const router = useRouter();

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) {
        setError("Order not found or unauthorized");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to cancel order");
      } else {
        fetchOrder();
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="text-zinc-500 py-10 text-center">Loading details...</div>;
  if (error) return <div className="text-red-500 py-10 text-center">{error}</div>;
  if (!order) return null;

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLACED": return "bg-blue-50 text-blue-700 border-blue-200";
      case "CONFIRMED": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PACKED": return "bg-amber-50 text-amber-700 border-amber-200";
      case "SHIPPED": return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "DELIVERED": return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "CANCELLED": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PLACED": return <Package className="text-blue-500" size={16} />;
      case "CONFIRMED": return <CheckCircle2 className="text-emerald-500" size={16} />;
      case "PACKED": return <PackageSearch className="text-amber-500" size={16} />;
      case "SHIPPED": return <Truck className="text-indigo-500" size={16} />;
      case "DELIVERED": return <CheckCircle2 className="text-emerald-600" size={16} />;
      case "CANCELLED": return <XCircle className="text-red-500" size={16} />;
      default: return <Package className="text-zinc-500" size={16} />;
    }
  };

  const canCancel = order.status === 'PLACED' || order.status === 'CONFIRMED';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/orders" className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-normal text-text-main">Order Details</h1>
          <p className="text-xs text-zinc-500">Order #FMZ10{order.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content: Items & Tracking */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white rounded-[2rem] border border-accent/20 p-6 md:p-8 shadow-sm">
            <h3 className="font-bold text-text-main mb-6 flex items-center gap-2"><Package size={18}/> Items in this Order</h3>
            <div className="space-y-6">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex gap-4 md:gap-6">
                  <div className="w-24 h-28 shrink-0 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-100">
                    <img 
                      src={item.product.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop"} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-text-main text-sm md:text-base leading-snug">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary mt-1">Sold by: {item.product.vendor?.businessName}</p>
                      </div>
                      <p className="font-bold text-text-main text-lg whitespace-nowrap">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    
                    <div className="text-xs text-zinc-500 mt-4 flex gap-4">
                      <span className="bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100">Qty: <strong className="text-primary">{item.quantity}</strong></span>
                      {item.size && <span className="bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100">Size: <strong className="text-primary">{item.size}</strong></span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          {order.address && (
            <div className="bg-white rounded-[2rem] border border-accent/20 p-6 md:p-8 shadow-sm">
              <h3 className="font-bold text-text-main mb-4 flex items-center gap-2"><MapPin size={18}/> Delivery Address</h3>
              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                <p className="font-bold text-text-main mb-1">{order.address.name}</p>
                <p className="text-sm text-zinc-600 mb-2">{order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}</p>
                <p className="text-sm font-medium text-primary">Phone: {order.address.phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Summary & Actions */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-[2rem] border border-accent/20 p-6 shadow-sm">
            <h3 className="font-bold text-text-main mb-6">Order Summary</h3>
            
            <div className="space-y-4 text-sm mb-6 pb-6 border-b border-zinc-100">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Order Date</span>
                <span className="font-medium text-text-main text-right">{orderDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Payment</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] tracking-widest uppercase">Paid</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Order Status</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="font-bold text-zinc-500 uppercase tracking-widest text-[11px]">Total Amount</span>
              <span className="font-serif text-3xl text-text-main leading-none">₹{order.total.toLocaleString('en-IN')}</span>
            </div>

            <div className="space-y-3">
              <button className="w-full text-xs font-bold uppercase tracking-widest text-white bg-text-main hover:bg-primary px-4 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                <RefreshCw size={14} /> Track Order
              </button>
              
              {canCancel && (
                <button 
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 disabled:opacity-50 px-4 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle size={14} /> {cancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
            
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Orders can only be cancelled before they are packed for shipping. Need help? <Link href="#" className="font-bold hover:underline">Contact Support</Link>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
