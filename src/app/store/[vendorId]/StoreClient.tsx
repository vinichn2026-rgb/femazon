"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Star, Share2, Heart, Search, Filter } from "lucide-react";
import ReviewSection from "@/components/reviews/ReviewSection";

export default function StoreClient({ vendor }: { vendor: any }) {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <main className="min-h-screen bg-surface pb-20">
      
      {/* Store Header/Cover */}
      <div className="relative h-64 md:h-80 bg-primary overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000&auto=format&fit=crop" 
          alt="Store Cover" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 md:px-12 pb-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-end gap-6">
              {/* Store Avatar */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-primary bg-white overflow-hidden shrink-0 flex items-center justify-center text-3xl font-serif">
                {vendor.businessName.charAt(0)}
              </div>
              
              <div className="pb-2">
                <h1 className="font-serif text-3xl md:text-5xl text-white mb-2">{vendor.businessName}</h1>
                <div className="flex items-center gap-4 text-sm text-zinc-300">
                  <span className="flex items-center gap-1 text-yellow-400 font-bold"><Star size={16} fill="currentColor" /> 4.6</span>
                  <span className="flex items-center gap-1"><MapPin size={16} /> {vendor.location}</span>
                  <span className="hidden sm:inline">Member since {vendor.joinDate}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pb-2">
              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition">
                <Share2 size={18} />
              </button>
              <button className="px-6 py-2.5 rounded-full bg-white text-primary font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition flex items-center gap-2">
                <Heart size={16} /> Follow
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Left Sidebar: About Store */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-zinc-100">
              <h3 className="font-bold text-text-main mb-4 uppercase tracking-widest text-xs">About Store</h3>
              <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                {vendor.description}
              </p>
              
              <div className="space-y-4 pt-6 border-t border-zinc-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Products</span>
                  <span className="font-bold text-text-main">{vendor.products.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Followers</span>
                  <span className="font-bold text-text-main">1.2k</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Response Time</span>
                  <span className="font-bold text-text-main">&lt; 24h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            
            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-zinc-200 mb-8">
              <button 
                onClick={() => setActiveTab('products')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'products' ? 'text-text-main' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                Products
                {activeTab === 'products' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-text-main"></div>}
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'reviews' ? 'text-text-main' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                Reviews (128)
                {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-text-main"></div>}
              </button>
            </div>

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-serif text-2xl text-text-main">All Products</h2>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 text-zinc-600"><Search size={18}/></button>
                    <button className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 text-zinc-600"><Filter size={18}/></button>
                  </div>
                </div>

                {vendor.products.length === 0 ? (
                  <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-zinc-100">
                    <p className="text-zinc-500">This vendor has not published any products yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
                    {vendor.products.map((product: any) => {
                      let imageUrl = product.image;
                      if (!imageUrl && product.images) {
                        try {
                          const parsed = JSON.parse(product.images);
                          if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
                        } catch(e) {}
                      }

                      return (
                        <Link href={`/shop/${product.slug}`} key={product.id} className="group cursor-pointer">
                          <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-zinc-100">
                            <img
                              src={imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop"}
                              alt={product.name}
                              className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-text-main hover:bg-primary hover:text-white transition shadow-sm">
                                <Heart size={14} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="px-1">
                            <h3 className="font-semibold text-text-main text-sm mb-1 group-hover:underline truncate">{product.name}</h3>
                            <div className="flex items-center gap-2">
                              {product.discountPrice ? (
                                <>
                                  <span className="font-bold text-text-main">₹{product.discountPrice}</span>
                                  <span className="text-zinc-400 text-xs line-through">₹{product.price}</span>
                                </>
                              ) : (
                                <span className="font-bold text-text-main">₹{product.price}</span>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <ReviewSection targetType="vendor" targetId={vendor.id} />
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
