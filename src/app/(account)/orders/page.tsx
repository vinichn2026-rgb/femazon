"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Truck, CheckCircle2, PackageSearch } from "lucide-react";

type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  product: {
    name: string;
    image?: string | null;
  };
};

type Order = {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.status === 401) {
          setError("Please log in to view your orders.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PLACED": return <Package className="text-blue-500" size={20} />;
      case "CONFIRMED": return <CheckCircle2 className="text-emerald-500" size={20} />;
      case "PACKED": return <PackageSearch className="text-amber-500" size={20} />;
      case "SHIPPED": return <Truck className="text-indigo-500" size={20} />;
      case "DELIVERED": return <CheckCircle2 className="text-emerald-600" size={20} />;
      default: return <Package className="text-zinc-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLACED": return "bg-blue-50 text-blue-700 border-blue-200";
      case "CONFIRMED": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PACKED": return "bg-amber-50 text-amber-700 border-amber-200";
      case "SHIPPED": return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "DELIVERED": return "bg-emerald-100 text-emerald-800 border-emerald-300";
      default: return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-surface p-8 flex justify-center items-center text-zinc-500">Loading your orders...</div>;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-surface p-8 flex justify-center items-center">
        <div className="rounded-[2rem] border border-accent/20 bg-white p-12 shadow-sm text-center">
          <PackageSearch size={48} className="mx-auto text-zinc-300 mb-6" />
          <h2 className="font-serif text-2xl text-text-main mb-2">Sign in to view orders</h2>
          <p className="text-zinc-500 mb-8 max-w-sm">Log in to track your past purchases, view shipping status, and manage returns.</p>
          <Link href="/login" className="rounded-full bg-text-main px-8 py-3.5 text-xs font-bold tracking-widest uppercase text-white hover:bg-primary transition-colors">
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-normal text-text-main mb-3">My Orders</h1>
        <p className="font-sans text-[15px] text-text-muted">
          Track, manage, and review your purchases
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#fbf9f6] border border-accent/10 rounded-3xl mx-auto">
          <Package size={48} className="text-zinc-300 mb-6" strokeWidth={1} />
          <h3 className="font-serif text-2xl text-text-main mb-2">No orders yet</h3>
          <p className="text-text-muted max-w-[400px] mx-auto mb-8">
            Looks like you haven't made any purchases yet. Explore our collection to find something you love!
          </p>
          <Link 
            href="/shop"
            className="bg-text-main text-white font-bold text-[12px] uppercase tracking-widest px-8 py-3.5 rounded-full shadow-md hover:bg-primary transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            });

            return (
              <div key={order.id} className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
                {/* Header */}
                <div className="bg-zinc-50 border-b border-zinc-200 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-x-8 gap-y-2">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Order Placed</p>
                      <p className="text-sm font-medium text-text-main">{orderDate}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Total</p>
                      <p className="text-sm font-medium text-text-main">₹{order.total.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Order #</p>
                      <p className="text-sm font-medium text-text-main">FMZ10{order.id}</p>
                    </div>
                  </div>
                  
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-widest self-start md:self-auto ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 md:p-6 space-y-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 md:gap-6">
                      <div className="w-20 h-24 shrink-0 rounded-lg overflow-hidden bg-zinc-100">
                        <img 
                          src={item.product.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop"} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-text-main text-sm md:text-base leading-snug max-w-[80%]">
                            {item.product.name}
                          </h4>
                          <p className="font-bold text-text-main whitespace-nowrap">₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                        
                        <div className="text-xs text-zinc-500 mt-2 space-y-1">
                          <p>Quantity: <strong className="text-zinc-700">{item.quantity}</strong></p>
                          {item.size && <p>Size: <strong className="text-zinc-700">{item.size}</strong></p>}
                          {item.color && <p>Color: <strong className="text-zinc-700">{item.color}</strong></p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="bg-white border-t border-zinc-100 p-4 px-6 flex justify-end gap-3">
                  <Link href={`/orders/${order.id}`} className="text-[11px] font-bold uppercase tracking-widest text-text-main px-5 py-2.5 rounded-full border border-zinc-300 hover:bg-zinc-50 transition">
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
