'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Plus,
  Truck,
  Palette,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { AddProductWithVariants } from './AddProductWithVariants';

export function VendorProductsClient({
  initialProducts = []
}: {
  initialProducts?: any[];
}) {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [viewMode, setViewMode] = useState<'list' | 'create'>('create');

  const handleProductCreated = (newProd: any) => {
    setProducts(prev => [newProd, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/vendor/dashboard"
              className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition shadow-2xs"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif text-stone-900 font-normal">
                Ready-to-Ship Inventory
              </h1>
              <p className="text-xs text-stone-500">
                Multi-color designer fashion catalog with immediate 24-48h dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('create')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                viewMode === 'create'
                  ? 'bg-[#4A1513] text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Plus size={15} />
              <span>New Ready-to-Ship</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#4A1513] text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Package size={15} />
              <span>Catalog ({products.length})</span>
            </button>
          </div>
        </div>

        {/* View Mode Switching */}
        {viewMode === 'create' ? (
          <AddProductWithVariants onProductCreated={handleProductCreated} />
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Your Ready-to-Ship Products</h2>
                <p className="text-xs text-stone-500">Products featuring dedicated color galleries and size matrixes</p>
              </div>

              <button
                type="button"
                onClick={() => setViewMode('create')}
                className="text-xs font-bold uppercase tracking-wider text-[#4A1513] hover:underline flex items-center gap-1"
              >
                <span>+ Add Product</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF7F5] border border-stone-200 flex items-center justify-center text-[#4A1513] mx-auto">
                  <Package size={28} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-800">No Ready-to-Ship products yet</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                    Start publishing luxury garments with color varieties and real-time physical inventory.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('create')}
                  className="px-6 py-2.5 bg-[#4A1513] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:bg-[#350B0A] transition cursor-pointer"
                >
                  Create First Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map(p => {
                  const variants = p.colorVariants || [];
                  const coverImage = p.image || (variants[0]?.images[0]?.imageUrl) || '/placeholder.jpg';

                  return (
                    <div
                      key={p.id}
                      className="group rounded-2xl border border-stone-200 hover:border-[#4A1513]/40 bg-white shadow-2xs hover:shadow-md transition overflow-hidden flex flex-col"
                    >
                      <div className="aspect-3/4 bg-stone-100 relative overflow-hidden">
                        <img
                          src={coverImage}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-[#4A1513] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                          <Truck size={10} />
                          <span>Ready to Ship</span>
                        </div>

                        {/* Price badge */}
                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                          ₹{p.discountPrice || p.price}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                            {p.category} &bull; {p.subcategory || p.dressType || 'Couture'}
                          </span>
                          <h3 className="text-sm font-bold text-stone-900 line-clamp-1 mt-0.5">
                            {p.name}
                          </h3>
                        </div>

                        {/* Color swatches preview */}
                        {variants.length > 0 && (
                          <div className="space-y-1.5 pt-2 border-t border-stone-100">
                            <div className="flex items-center justify-between text-[11px] text-stone-500">
                              <span>{variants.length} Colors Available</span>
                              <span className="font-bold text-[#4A1513]">{p.stock} pcs total</span>
                            </div>

                            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                              {variants.map((v: any) => (
                                <div
                                  key={v.id}
                                  className="w-5 h-5 rounded-full border border-stone-300 shadow-2xs shrink-0"
                                  style={{ backgroundColor: v.colorHexCode || '#722F37' }}
                                  title={v.colorName}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-2 flex items-center justify-between">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="text-xs font-bold text-[#4A1513] hover:underline flex items-center gap-1"
                          >
                            <span>View on Store</span>
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
