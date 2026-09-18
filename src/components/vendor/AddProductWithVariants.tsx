'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Plus,
  Trash2,
  Upload,
  Star,
  CheckCircle2,
  AlertCircle,
  Truck,
  Package,
  Layers,
  Tag,
  Palette,
  Eye,
  ArrowRight,
  Loader2,
  Check
} from 'lucide-react';

const LUXURY_PRESET_COLORS = [
  { name: 'Wine Red', hex: '#722F37' },
  { name: 'Emerald Green', hex: '#046307' },
  { name: 'Mustard Yellow', hex: '#E1AD01' },
  { name: 'Royal Plum', hex: '#4A1513' },
  { name: 'Midnight Navy', hex: '#0F172A' },
  { name: 'Dusty Rose', hex: '#C08081' },
  { name: 'Ivory Cream', hex: '#FDFBF7' },
  { name: 'Obsidian Black', hex: '#1A1A1A' },
];

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

const CATEGORY_MAP: Record<string, string[]> = {
  'Kurta Sets': ['Anarkali Sets', 'Sharara & Gharara Sets', 'Straight Cut Suits', 'Angrakha Ensembles', 'Palazzo Sets'],
  'Lehengas': ['Bridal Lehengas', 'Bridesmaid Lehengas', 'Fusion / Drape Lehengas', 'Velvet Lehengas'],
  'Sarees': ['Banarasi Silk Sarees', 'Kanjeevaram Sarees', 'Chanderi Sarees', 'Organza Handpainted', 'Pre-Draped Sarees'],
  'Dresses & Gowns': ['Evening Gowns', 'Cocktail Dresses', 'Maxi Dresses', 'Cape Gowns'],
  'Indo-Western': ['Drape Skirt Sets', 'Jumpsuits', 'Cape Sets', 'Tunic Sets'],
  'Co-ord Sets': ['Embroidered Co-ords', 'Silk Co-ords', 'Printed Co-ords'],
  'Ready To Ship': ['Festive Express', 'Luxury Pret', 'Immediate Dispatch Exclusive']
};

export interface VariantImageItem {
  imageUrl: string;
  isThumbnail: boolean;
  displayOrder: number;
}

export interface SizeStockItem {
  size: string;
  stockQty: number;
}

export interface ColorVariantItem {
  id: string; // client temporary ID
  colorName: string;
  colorHexCode: string;
  images: VariantImageItem[];
  sizes: SizeStockItem[];
}

export function AddProductWithVariants({
  onProductCreated
}: {
  onProductCreated?: (product: any) => void;
}) {
  const router = useRouter();

  // Section A: Core Product Information
  const [title, setTitle] = useState('');
  const [brandName, setBrandName] = useState('Femazon Luxe');
  const [category, setCategory] = useState('Kurta Sets');
  const [subCategory, setSubCategory] = useState('Anarkali Sets');
  const [basePrice, setBasePrice] = useState<string>('');
  const [salePrice, setSalePrice] = useState<string>('');
  const [fabricCare, setFabricCare] = useState('Pure Georgette - Dry Clean Only');
  const [packageContains, setPackageContains] = useState('1 Anarkali Kurta, 1 Churidar, 1 Dupatta');
  const [description, setDescription] = useState('');

  // Section B: Dynamic Color Variants
  const [colorVariants, setColorVariants] = useState<ColorVariantItem[]>([
    {
      id: 'color-1',
      colorName: 'Emerald Green',
      colorHexCode: '#046307',
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=1000&q=85&auto=format&fit=crop',
          isThumbnail: true,
          displayOrder: 1
        }
      ],
      sizes: STANDARD_SIZES.map(s => ({
        size: s,
        stockQty: s === 'M' ? 4 : s === 'S' ? 2 : 0
      }))
    }
  ]);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingVariantId, setUploadingVariantId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'review'>('form');

  // Auto-calculated Discount %
  const discountPercent = useMemo(() => {
    const mrp = parseFloat(basePrice);
    const sale = parseFloat(salePrice);
    if (!isNaN(mrp) && !isNaN(sale) && mrp > 0 && sale > 0 && sale < mrp) {
      return Math.round(((mrp - sale) / mrp) * 100);
    }
    return 0;
  }, [basePrice, salePrice]);

  // Total Stock across all color variants
  const totalStock = useMemo(() => {
    return colorVariants.reduce((sum, cv) => {
      const cvTotal = cv.sizes.reduce((cvSum, sz) => cvSum + (Number(sz.stockQty) || 0), 0);
      return sum + cvTotal;
    }, 0);
  }, [colorVariants]);

  // Color variant handlers
  const handleAddColorVariant = () => {
    const nextIdx = colorVariants.length + 1;
    const defaultColor = LUXURY_PRESET_COLORS[colorVariants.length % LUXURY_PRESET_COLORS.length];

    const newVariant: ColorVariantItem = {
      id: `color-${Date.now()}`,
      colorName: defaultColor ? defaultColor.name : `Variety #${nextIdx}`,
      colorHexCode: defaultColor ? defaultColor.hex : '#722F37',
      images: [],
      sizes: STANDARD_SIZES.map(s => ({ size: s, stockQty: 0 }))
    };

    setColorVariants(prev => [...prev, newVariant]);
  };

  const handleRemoveColorVariant = (id: string) => {
    if (colorVariants.length <= 1) {
      alert('At least one color variety is required.');
      return;
    }
    setColorVariants(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateVariantField = (id: string, field: keyof ColorVariantItem, value: any) => {
    setColorVariants(prev =>
      prev.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // Image Upload handler for a specific color
  const handleImageUpload = async (variantId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingVariantId(variantId);
    setErrorMessage('');

    try {
      const uploadedImages: VariantImageItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await res.json();
        if (data.url) {
          uploadedImages.push({
            imageUrl: data.url,
            isThumbnail: false,
            displayOrder: Date.now() + i
          });
        }
      }

      setColorVariants(prev =>
        prev.map(c => {
          if (c.id !== variantId) return c;
          const combined = [...c.images, ...uploadedImages];
          // If no thumbnail set yet, set the first one as thumbnail
          const hasThumb = combined.some(img => img.isThumbnail);
          if (!hasThumb && combined.length > 0) {
            combined[0].isThumbnail = true;
          }
          return { ...c, images: combined };
        })
      );
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Image upload failed.');
    } finally {
      setUploadingVariantId(null);
    }
  };

  // Manual URL image addition for preview/testing
  const handleAddImageUrl = (variantId: string) => {
    const url = prompt(
      'Enter Image URL for this color variant:',
      'https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=1000&q=85&auto=format&fit=crop'
    );
    if (!url) return;

    setColorVariants(prev =>
      prev.map(c => {
        if (c.id !== variantId) return c;
        const newImg: VariantImageItem = {
          imageUrl: url.trim(),
          isThumbnail: c.images.length === 0,
          displayOrder: c.images.length + 1
        };
        return { ...c, images: [...c.images, newImg] };
      })
    );
  };

  const handleSetThumbnail = (variantId: string, imgIdx: number) => {
    setColorVariants(prev =>
      prev.map(c => {
        if (c.id !== variantId) return c;
        return {
          ...c,
          images: c.images.map((img, idx) => ({
            ...img,
            isThumbnail: idx === imgIdx
          }))
        };
      })
    );
  };

  const handleRemoveImage = (variantId: string, imgIdx: number) => {
    setColorVariants(prev =>
      prev.map(c => {
        if (c.id !== variantId) return c;
        const updated = c.images.filter((_, idx) => idx !== imgIdx);
        if (updated.length > 0 && !updated.some(img => img.isThumbnail)) {
          updated[0].isThumbnail = true;
        }
        return { ...c, images: updated };
      })
    );
  };

  // Stock change handler
  const handleStockChange = (variantId: string, sizeName: string, qty: number) => {
    const safeQty = Math.max(0, qty);
    setColorVariants(prev =>
      prev.map(c => {
        if (c.id !== variantId) return c;
        return {
          ...c,
          sizes: c.sizes.map(sz =>
            sz.size === sizeName ? { ...sz, stockQty: safeQty } : sz
          )
        };
      })
    );
  };

  // Quick Set All Stock for a Color Variant
  const handleSetAllStock = (variantId: string, qty: number) => {
    setColorVariants(prev =>
      prev.map(c => {
        if (c.id !== variantId) return c;
        return {
          ...c,
          sizes: c.sizes.map(sz => ({ ...sz, stockQty: Math.max(0, qty) }))
        };
      })
    );
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validations
    if (!title.trim()) {
      setErrorMessage('Please enter a Product Title.');
      return;
    }
    const mrp = parseFloat(basePrice);
    if (isNaN(mrp) || mrp <= 0) {
      setErrorMessage('Please enter a valid Base Price (MRP).');
      return;
    }
    const sale = salePrice ? parseFloat(salePrice) : null;
    if (sale !== null && sale > mrp) {
      setErrorMessage('Sale Price cannot exceed Base MRP.');
      return;
    }

    if (colorVariants.length === 0) {
      setErrorMessage('At least one color variety is required.');
      return;
    }

    for (const cv of colorVariants) {
      if (!cv.colorName.trim()) {
        setErrorMessage('All color varieties must have a Color Name.');
        return;
      }
      if (cv.images.length === 0) {
        setErrorMessage(`Please upload at least one image for "${cv.colorName}".`);
        return;
      }
    }

    if (totalStock <= 0) {
      setErrorMessage('Please allocate at least one piece of physical stock across sizes.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        brandName: brandName.trim(),
        category,
        subCategory,
        basePrice: mrp,
        salePrice: sale,
        fabricCare,
        packageContains,
        description: description.trim() || `${title} - Exquisite Ready-to-Ship Designer Collection.`,
        dispatchTimeline: 'Dispatched within 24-48 Hours',
        colorVariants: colorVariants.map(cv => ({
          colorName: cv.colorName.trim(),
          colorHexCode: cv.colorHexCode,
          images: cv.images.map((img, idx) => ({
            imageUrl: img.imageUrl,
            isThumbnail: img.isThumbnail,
            displayOrder: idx + 1
          })),
          sizes: cv.sizes.map(sz => ({
            size: sz.size,
            stockQty: Number(sz.stockQty) || 0
          }))
        }))
      };

      const res = await fetch('/api/vendor/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.details || 'Failed to publish product');
      }

      setSuccessMessage('Ready-to-Ship product and color variants published successfully!');

      if (onProductCreated) {
        onProductCreated(data.product);
      }

      setTimeout(() => {
        if (data.product?.slug) {
          router.push(`/products/${data.product.slug}`);
        } else {
          router.refresh();
        }
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error publishing product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 font-sans text-stone-800">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#4A1513] to-[#2B1311] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-3">
              <Truck size={14} className="text-white" />
              <span>Ready-To-Ship Collection</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-white font-normal tracking-tight">
              Create Ready-to-Ship Luxury Product
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl leading-relaxed">
              Upload color-wise dedicated photography and assign physical stock per size. Instant 24-48hr dispatch on storefront.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/10">
              <span className="block text-[10px] uppercase font-bold tracking-widest text-stone-300">Total Stock</span>
              <span className="text-xl font-serif font-bold text-white">{totalStock} <span className="text-xs font-sans font-normal text-stone-300">pcs</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Notifications */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold animate-in fade-in">
          <AlertCircle size={18} className="text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ========================================================================= */}
        {/* SECTION A: Core Product Information */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4A1513]/10 text-[#4A1513] flex items-center justify-center font-bold">
                <Package size={20} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 font-sans">
                  Section A: Core Product Information
                </h2>
                <p className="text-xs text-stone-500">General apparel specification and brand details</p>
              </div>
            </div>

            {/* Locked Ready-to-Ship Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A1513] text-white text-[11px] font-bold tracking-wider uppercase shadow-xs">
              <Truck size={13} />
              <span>Ready to Ship: 24-48h</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Title */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Product Title <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Chikankari Embroidered Pure Georgette Anarkali Set"
                className="w-full h-11 px-4 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#4A1513] focus:outline-none transition font-medium"
                required
              />
            </div>

            {/* Brand / Designer Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Brand / Designer Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                placeholder="e.g. Femazon Luxe"
                className="w-full h-11 px-4 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#4A1513] focus:outline-none transition font-medium"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Category <span className="text-rose-600">*</span>
              </label>
              <select
                value={category}
                onChange={e => {
                  setCategory(e.target.value);
                  const subOptions = CATEGORY_MAP[e.target.value] || [];
                  setSubCategory(subOptions[0] || '');
                }}
                className="w-full h-11 px-3 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#4A1513] focus:outline-none transition font-medium cursor-pointer"
              >
                {Object.keys(CATEGORY_MAP).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sub-Category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Subcategory / Silhouette
              </label>
              <select
                value={subCategory}
                onChange={e => setSubCategory(e.target.value)}
                className="w-full h-11 px-3 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#4A1513] focus:outline-none transition font-medium cursor-pointer"
              >
                {(CATEGORY_MAP[category] || []).map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Pricing Box */}
            <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  MRP (₹) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={basePrice}
                  onChange={e => setBasePrice(e.target.value)}
                  placeholder="4999"
                  className="w-full h-11 px-3 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#4A1513] focus:outline-none transition font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5 relative">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center justify-between">
                  <span>Sale (₹)</span>
                  {discountPercent > 0 && (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                      {discountPercent}% OFF
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  min="1"
                  value={salePrice}
                  onChange={e => setSalePrice(e.target.value)}
                  placeholder="3499"
                  className="w-full h-11 px-3 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#4A1513] focus:outline-none transition font-bold text-[#4A1513]"
                />
              </div>
            </div>

            {/* Fabric & Care */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Fabric &amp; Care
              </label>
              <input
                type="text"
                value={fabricCare}
                onChange={e => setFabricCare(e.target.value)}
                placeholder="e.g. Pure Georgette - Dry Clean Only"
                className="w-full h-11 px-4 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#4A1513] focus:outline-none transition font-medium"
              />
            </div>

            {/* Package Contains */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Package Inclusions
              </label>
              <input
                type="text"
                value={packageContains}
                onChange={e => setPackageContains(e.target.value)}
                placeholder="e.g. 1 Anarkali Kurta, 1 Churidar Pant, 1 Embroidered Dupatta"
                className="w-full h-11 px-4 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#4A1513] focus:outline-none transition font-medium"
              />
            </div>

            {/* Description */}
            <div className="col-span-full space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Product Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Detailed craft details, zari work, styling advice, and heritage craftsmanship..."
                className="w-full p-3 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#4A1513] focus:outline-none transition font-medium resize-none"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION B: Dynamic Color Variants & Image Management */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#4A1513]">
                <Palette size={16} />
                <span>Multi-Color Management</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif text-stone-900 font-normal mt-0.5">
                Section B: Color Varieties &amp; Stock Matrix
              </h2>
              <p className="text-xs text-stone-500">
                Each color has its own dedicated photo gallery and physical inventory by size.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddColorVariant}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition cursor-pointer self-start sm:self-auto"
            >
              <Plus size={16} />
              <span>Add Color Variety</span>
            </button>
          </div>

          {/* Color Variant Cards */}
          <div className="space-y-6">
            {colorVariants.map((variant, vIdx) => {
              const variantStock = variant.sizes.reduce((acc, sz) => acc + (Number(sz.stockQty) || 0), 0);
              const isUploadingThis = uploadingVariantId === variant.id;

              return (
                <div
                  key={variant.id}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-7 space-y-6 relative overflow-hidden"
                >
                  {/* Top Bar for this color */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center text-xs font-bold">
                        {vIdx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs"
                            style={{ backgroundColor: variant.colorHexCode || '#722F37' }}
                          />
                          <h3 className="text-base font-bold text-stone-900">
                            Color Variant: <span className="text-[#4A1513]">{variant.colorName || 'Untitled'}</span>
                          </h3>
                        </div>
                        <span className="text-[11px] text-stone-500 font-medium">
                          {variant.images.length} images &bull; {variantStock} pcs in stock
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Quick stock actions */}
                      <button
                        type="button"
                        onClick={() => handleSetAllStock(variant.id, 5)}
                        className="text-[11px] font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition"
                      >
                        Set 5 pcs each
                      </button>

                      {colorVariants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveColorVariant(variant.id)}
                          className="h-8 w-8 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer"
                          title="Remove this color variant"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 1. Color Identification */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                        Color Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={variant.colorName}
                        onChange={e => handleUpdateVariantField(variant.id, 'colorName', e.target.value)}
                        placeholder="e.g. Emerald Green, Wine Red, Mustard"
                        className="w-full h-11 px-4 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#4A1513] focus:outline-none transition font-medium"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                        Color Swatch (Circle Hex Code)
                      </label>
                      <div className="flex items-center gap-2">
                        {/* HTML Color Picker */}
                        <div className="relative">
                          <input
                            type="color"
                            value={variant.colorHexCode || '#722F37'}
                            onChange={e => handleUpdateVariantField(variant.id, 'colorHexCode', e.target.value)}
                            className="w-11 h-11 p-1 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer"
                            title="Choose custom color"
                          />
                        </div>

                        {/* Preset Swatches */}
                        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1">
                          {LUXURY_PRESET_COLORS.map(preset => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                handleUpdateVariantField(variant.id, 'colorName', preset.name);
                                handleUpdateVariantField(variant.id, 'colorHexCode', preset.hex);
                              }}
                              className={`w-7 h-7 rounded-full border transition-all cursor-pointer relative shrink-0 ${
                                variant.colorHexCode?.toLowerCase() === preset.hex.toLowerCase()
                                  ? 'ring-2 ring-[#4A1513] ring-offset-2 scale-110'
                                  : 'border-stone-200 hover:scale-105'
                              }`}
                              style={{ backgroundColor: preset.hex }}
                              title={preset.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Dedicated Image Uploader for this Color */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                        Gallery for {variant.colorName || 'This Color'} <span className="text-rose-600">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddImageUrl(variant.id)}
                        className="text-xs font-semibold text-[#4A1513] hover:underline cursor-pointer"
                      >
                        + Add Image via URL
                      </button>
                    </div>

                    {/* Upload Dropzone */}
                    <div className="border-2 border-dashed border-stone-200 hover:border-[#4A1513]/50 rounded-2xl p-4 sm:p-6 bg-stone-50/50 hover:bg-[#FAF7F5] transition text-center relative group">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        disabled={isUploadingThis}
                        onChange={e => handleImageUpload(variant.id, e.target.files)}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-[#4A1513] shadow-xs group-hover:scale-105 transition-transform">
                          {isUploadingThis ? (
                            <Loader2 size={18} className="animate-spin text-[#4A1513]" />
                          ) : (
                            <Upload size={18} />
                          )}
                        </div>
                        <p className="text-xs font-bold text-stone-800">
                          {isUploadingThis ? 'Uploading Photos...' : `Drop ${variant.colorName} Photos Here or Click to Browse`}
                        </p>
                        <p className="text-[11px] text-stone-500 font-medium">
                          Upload front look, back angle, embroidery close-ups (JPG, PNG, WebP)
                        </p>
                      </div>
                    </div>

                    {/* Image Thumbnails Grid */}
                    {variant.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                        {variant.images.map((img, imgIdx) => (
                          <div
                            key={imgIdx}
                            className={`group relative rounded-xl overflow-hidden border bg-stone-100 aspect-3/4 flex flex-col justify-between p-1.5 transition ${
                              img.isThumbnail ? 'ring-2 ring-[#4A1513] border-transparent shadow-md' : 'border-stone-200'
                            }`}
                          >
                            <img
                              src={img.imageUrl}
                              alt={`Thumbnail ${imgIdx + 1}`}
                              className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Main Cover Star Badge */}
                            <button
                              type="button"
                              onClick={() => handleSetThumbnail(variant.id, imgIdx)}
                              className={`relative z-10 self-start px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition ${
                                img.isThumbnail
                                  ? 'bg-[#4A1513] text-white shadow-xs'
                                  : 'bg-black/60 text-white/90 hover:bg-black'
                              }`}
                              title={img.isThumbnail ? 'Current Cover Image' : 'Click to make Cover Photo'}
                            >
                              <Star size={11} className={img.isThumbnail ? 'fill-white' : ''} />
                              <span>{img.isThumbnail ? 'Cover' : 'Set Cover'}</span>
                            </button>

                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(variant.id, imgIdx)}
                              className="relative z-10 self-end p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition cursor-pointer"
                              title="Delete photo"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. Size-Wise Physical Stock Matrix */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                        Physical Stock Matrix for {variant.colorName || 'This Color'}
                      </label>
                      <span className="text-xs font-bold text-[#4A1513]">
                        Subtotal: {variantStock} pcs
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                      {variant.sizes.map(sz => {
                        const qty = Number(sz.stockQty) || 0;
                        const isZero = qty === 0;

                        return (
                          <div
                            key={sz.size}
                            className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-between ${
                              isZero
                                ? 'bg-stone-50/70 border-stone-200'
                                : 'bg-white border-[#4A1513]/40 shadow-xs'
                            }`}
                          >
                            <span className="text-xs font-bold uppercase text-stone-800 mb-1">
                              {sz.size}
                            </span>

                            <input
                              type="number"
                              min="0"
                              value={sz.stockQty}
                              onChange={e =>
                                handleStockChange(variant.id, sz.size, parseInt(e.target.value, 10) || 0)
                              }
                              className={`w-full h-8 text-center text-xs font-bold rounded-lg border focus:outline-none transition ${
                                isZero
                                  ? 'border-stone-200 text-stone-400 bg-white'
                                  : 'border-[#4A1513] text-[#4A1513] bg-[#FAF7F5]'
                              }`}
                            />

                            <span
                              className={`mt-1.5 text-[9.5px] font-bold uppercase tracking-wider ${
                                isZero ? 'text-stone-400' : 'text-emerald-700'
                              }`}
                            >
                              {isZero ? 'Out of Stock' : `${qty} in stock`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION C: Review & Instant Publish */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-xl bg-[#4A1513]/10 text-[#4A1513] flex items-center justify-center font-bold">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 font-sans">
                Section C: Review &amp; Instant Publish
              </h2>
              <p className="text-xs text-stone-500">
                Confirm your color offerings and ready-to-ship inventory
              </p>
            </div>
          </div>

          {/* Color Summary Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {colorVariants.map(cv => {
              const subStock = cv.sizes.reduce((s, z) => s + (Number(z.stockQty) || 0), 0);
              const coverImg = cv.images.find(img => img.isThumbnail) || cv.images[0];

              return (
                <div
                  key={cv.id}
                  className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50 flex items-center gap-3"
                >
                  <div className="w-14 h-16 rounded-xl bg-stone-200 overflow-hidden shrink-0 relative">
                    {coverImg ? (
                      <img
                        src={coverImg.imageUrl}
                        alt={cv.colorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                        No Photo
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full border border-stone-300"
                        style={{ backgroundColor: cv.colorHexCode || '#722F37' }}
                      />
                      <span className="text-xs font-bold text-stone-900 truncate">
                        {cv.colorName}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {cv.images.length} photos uploaded
                    </p>
                    <p className="text-xs font-bold text-[#4A1513] mt-0.5">
                      {subStock} pcs available
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Publish Button */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-stone-100">
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                Ready-to-Ship Inventory Summary
              </span>
              <span className="text-lg font-serif font-bold text-stone-900">
                {colorVariants.length} Color Varieties &bull; {totalStock} Total Pieces
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-[0.16em] rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin text-white" />
                  <span>Publishing Product &amp; Variants...</span>
                </>
              ) : (
                <>
                  <span>Save &amp; Publish Ready-to-Ship Product</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
