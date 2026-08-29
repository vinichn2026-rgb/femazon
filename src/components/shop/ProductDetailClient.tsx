"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Share2,
  Truck,
  ChevronRight,
  Sparkles,
  Maximize2,
  X,
  Ruler,
  MessageCircle,
  Headphones,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Clock,
  Flame,
  Percent,
  Check
} from 'lucide-react';

interface ProductDetailClientProps {
  product: any;
  similarProducts?: any[];
  bestPairedProducts?: any[];
  isWishlisted?: boolean;
}

export function ProductDetailClient({
  product,
  similarProducts = [],
  bestPairedProducts = [],
  isWishlisted: initialWishlisted = false
}: ProductDetailClientProps) {
  const router = useRouter();

  // Parse images safely
  let images: string[] = [];
  try {
    if (product.images) {
      images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    }
  } catch (e) {}
  if (images.length === 0 && product.image) {
    images = [product.image];
  }
  if (images.length === 0) {
    images = [
      "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572804013309-82a891485787?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=1000&q=85&auto=format&fit=crop"
    ];
  }

  // Parse sizes safely
  let sizes: string[] = ["3XS", "XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "6XL"];
  try {
    if (product.sizes) {
      const parsed = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
      if (Array.isArray(parsed) && parsed.length > 0) sizes = parsed;
    }
  } catch (e) {}

  // Parse colors safely
  let colors: string[] = ["Sage Blossom", "Pastel Lavender", "Ivory Rose", "Sunset Peach"];
  try {
    if (product.colors) {
      const parsed = typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors;
      if (Array.isArray(parsed) && parsed.length > 0) colors = parsed;
    }
  } catch (e) {}

  const [selectedSize, setSelectedSize] = useState(sizes[4] || "M");
  const [selectedColor, setSelectedColor] = useState(colors[0] || "Sage Blossom");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartSuccessMessage, setCartSuccessMessage] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Delivery Pincode State
  const [pincode, setPincode] = useState('600001');
  const [isEditingPincode, setIsEditingPincode] = useState(false);

  // Similar Items Tab Filter
  const [activeSimilarTab, setActiveSimilarTab] = useState<'closest' | 'designer' | 'exclusive' | 'ready'>('closest');

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    details: false,
    shipping: false
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const originalPrice = product.price;
  const currentPrice = product.discountPrice ? product.discountPrice : product.price;

  const handleToggleWishlist = async () => {
    setIsWishlisted(!isWishlisted);
    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: Number(product.id), action: isWishlisted ? 'remove' : 'add' })
      });
    } catch (e) {}
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: Number(product.id),
          quantity,
          size: selectedSize,
          color: selectedColor
        })
      });

      if (res.status === 401) {
        alert('Please sign in to add items to your cart.');
        router.push('/login');
        return;
      }

      if (res.ok) {
        setCartSuccessMessage('Added to your cart!');
        setTimeout(() => setCartSuccessMessage(''), 3000);
      } else {
        alert('Could not add to cart.');
      }
    } catch (e) {
      alert('Error adding item to cart.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Extract Designer Name & Display Title
  const isPaulmiHarsh = product.name?.toLowerCase().includes('paulmi') || product.slug?.includes('paulmi');
  const isSheetalBatra = product.name?.toLowerCase().includes('sheetal batra') || product.slug?.includes('sheetal-batra');
  
  const designerName = isPaulmiHarsh 
    ? "Paulmi and Harsh" 
    : isSheetalBatra 
    ? "Sheetal Batra" 
    : (product.name?.split('-')[0]?.trim() || "Femazon Atelier");

  const displayTitle = isPaulmiHarsh
    ? "Laverna Floral Printed & Embroidered Chanderi Silk Kurta and Pant Set"
    : isSheetalBatra
    ? "Orange Chanderi Silk Umaira Embroidered Flared Anarkali Salwar Set"
    : (product.name?.split('-')[1]?.trim() || product.name);

  // Filter similar items based on active tab
  const filteredSimilarItems = useMemo(() => {
    if (similarProducts.length === 0) return [];
    if (activeSimilarTab === 'designer') {
      const dMatches = similarProducts.filter(p => p.name?.toLowerCase().includes(designerName.toLowerCase()));
      return dMatches.length > 0 ? dMatches : similarProducts.slice(0, 8);
    }
    if (activeSimilarTab === 'exclusive') {
      return similarProducts.slice(0, 8);
    }
    if (activeSimilarTab === 'ready') {
      return similarProducts.filter(p => (p.stock || 0) > 0).slice(0, 8);
    }
    return similarProducts.slice(0, 8);
  }, [similarProducts, activeSimilarTab, designerName]);

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans pb-28">
      
      {/* Top Breadcrumb Navigation */}
      <div className="border-b border-stone-100 bg-white py-3 px-4 sm:px-8">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between text-xs text-stone-500 font-medium">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <Link href="/" className="hover:text-[#4A1513] transition">Home</Link>
            <ChevronRight size={12} className="text-stone-300 shrink-0" />
            <Link href="/shop" className="hover:text-[#4A1513] transition">Womenswear</Link>
            <ChevronRight size={12} className="text-stone-300 shrink-0" />
            <Link href={`/shop?category=${product.category || 'Ethnic'}`} className="hover:text-[#4A1513] transition">
              {product.subcategory || product.category || 'Kurta Sets'}
            </Link>
            <ChevronRight size={12} className="text-stone-300 shrink-0" />
            <span className="text-[#4A1513] font-semibold">{designerName}</span>
          </div>
          <span className="hidden sm:inline-block text-stone-400 text-[11px] uppercase tracking-wider">
            SKU: FEM-{Number(product.id || 752306).toString().padStart(6, '0')}
          </span>
        </div>
      </div>

      {/* Main Product Presentation */}
      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT: 2-Column High-Fashion Editorial Photo Grid */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group bg-[#FAF7F4] overflow-hidden cursor-zoom-in rounded-xl border border-stone-100/80 shadow-2xs"
                  onClick={() => setLightboxImage(imgUrl)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`${product.name} editorial view ${idx + 1}`}
                    className="w-full h-auto aspect-[3/4.2] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Floating View Similar / Enlarge Button Top-Right of 2nd image */}
                  {idx === 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxImage(imgUrl);
                      }}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs p-1.5 rounded-full text-[#4A1513] shadow-md hover:bg-white transition flex items-center justify-center"
                      title="Enlarge High-Res View"
                    >
                      <Maximize2 size={15} />
                    </button>
                  )}

                  {/* Floating Submitted Look Badge on 2nd image */}
                  {idx === 1 && (
                    <div className="absolute bottom-3 right-3 bg-[#4A1513]/90 backdrop-blur-xs text-white text-[9px] uppercase font-bold tracking-widest px-3 py-1.5 flex items-center gap-1.5 shadow-md rounded-full">
                      <span>SUBMITTED LOOK: KURTA &amp; TROUSER SET</span>
                      <ChevronRight size={12} />
                    </div>
                  )}

                  {/* Hover Magnify Overlay */}
                  <div className="absolute inset-0 bg-[#4A1513]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-white/95 text-[#4A1513] text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 shadow-sm rounded-full border border-stone-200">
                      Click to Enlarge
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT: Sticky Designer Buy Box (White & Maroon Luxury Theme) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col space-y-4 lg:sticky lg:top-20">
            
            {/* Top Badges & Action Icons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-[#4A1513]/10 text-[#4A1513] text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full border border-[#4A1513]/20">
                  <Sparkles size={11} />
                  <span>New In</span>
                </span>

                <span className="inline-flex items-center gap-1 bg-[#fff8f2] text-[#4A1513] text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full border border-[#e8d5cb]">
                  <Flame size={11} />
                  <span>Designer Exclusive</span>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`p-2 rounded-full hover:bg-stone-100 transition ${isWishlisted ? 'text-[#4A1513]' : 'text-stone-600'}`}
                  title="Wishlist"
                >
                  <Heart size={18} fill={isWishlisted ? '#4A1513' : 'none'} className={isWishlisted ? 'text-[#4A1513]' : ''} />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-stone-100 transition text-stone-600"
                  title="Share"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Designer Link & Title */}
            <div>
              <Link
                href={`/search?q=${encodeURIComponent(designerName)}`}
                className="font-serif text-lg sm:text-xl font-bold uppercase tracking-[0.2em] text-[#4A1513] hover:underline inline-flex items-center gap-1 transition"
              >
                <span>{designerName}</span>
                <ChevronRight size={16} />
              </Link>
              <h1 className="font-serif text-base sm:text-lg text-stone-800 font-normal mt-1 leading-snug">
                {displayTitle}
              </h1>
              <p className="text-xs text-stone-400 mt-0.5">
                Set of 2: Chanderi Silk Kurta &amp; Silk Trousers
              </p>
            </div>

            {/* Price Box */}
            <div className="pt-1 pb-2 border-b border-stone-100">
              <div className="flex items-baseline gap-2.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPrice && (
                  <span className="text-xs font-bold text-[#4A1513] bg-[#4A1513]/10 px-2 py-0.5 rounded">
                    Save {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                  </span>
                )}
              </div>
              <span className="text-[11px] text-stone-500 block mt-1">
                Price inclusive of all taxes · Free Express Shipping
              </span>
            </div>

            {/* Color Swatches */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Color: <span className="font-normal text-stone-600">{selectedColor}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer border rounded-md ${
                      selectedColor === c
                        ? 'border-[#4A1513] bg-[#4A1513] text-white shadow-xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-[#4A1513]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-stone-800">Select Size</span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-[#4A1513] hover:underline cursor-pointer font-semibold"
                >
                  <Ruler size={13} />
                  <span>Size guide &amp; measurements</span>
                </button>
              </div>

              {/* Size Buttons Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`h-9 text-xs font-bold uppercase transition cursor-pointer border rounded-md flex items-center justify-center ${
                      selectedSize === sz
                        ? 'border-[#4A1513] bg-[#4A1513] text-white shadow-xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-[#4A1513] hover:bg-stone-50'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {/* Ships by Date Pill */}
              <div className="flex items-center gap-1.5 text-xs text-stone-600 pt-1">
                <Truck size={14} className="text-[#4A1513]" />
                <span>Dispatch: <strong className="text-stone-900">⚡ Ready To Ship in 24-48 Hours</strong></span>
              </div>
            </div>

            {/* Action Buttons: Add To Cart & Speak To Stylist */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 h-13 bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer rounded-xl"
              >
                <ShoppingBag size={16} />
                <span>{isAddingToCart ? 'ADDING...' : 'ADD TO CART'}</span>
              </button>

              <a
                href="https://wa.me/918291990059?text=Hello%2C%20I%20would%20like%20styling%20assistance%20for%20Paulmi%20and%20Harsh%20Laverna%20Kurta%20Set"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-13 border-2 border-[#4A1513] bg-white hover:bg-[#4A1513]/5 text-[#4A1513] text-xs font-bold uppercase tracking-[0.2em] transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer rounded-xl"
              >
                <Headphones size={16} />
                <span>SPEAK TO STYLIST</span>
              </a>
            </div>

            {cartSuccessMessage && (
              <p className="text-center text-xs font-semibold text-[#4A1513] bg-[#4A1513]/10 py-2.5 rounded-lg border border-[#4A1513]/20 animate-in fade-in">
                ✓ {cartSuccessMessage}
              </p>
            )}

            {/* Pincode & Standard Delivery Container */}
            <div className="border border-stone-200 p-4 bg-[#FAF7F4] space-y-2 rounded-xl">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-stone-800">
                  <span>📍</span>
                  {isEditingPincode ? (
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-20 px-1 border border-stone-400 text-xs rounded"
                    />
                  ) : (
                    <span>Delivery Pincode: {pincode}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingPincode(!isEditingPincode)}
                  className="text-xs font-semibold text-[#4A1513] hover:underline"
                >
                  {isEditingPincode ? 'Save' : 'Change'}
                </button>
              </div>

              <div className="p-2.5 bg-white border border-stone-200 text-xs rounded-lg">
                <span className="text-stone-700">Estimated Delivery by <strong className="text-[#4A1513]">3-5 Business Days</strong></span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-stone-500">
                <Clock size={12} />
                <span>Need express delivery? <a href="https://wa.me/918291990059" target="_blank" rel="noopener noreferrer" className="text-[#4A1513] font-semibold underline">Chat with our team</a></span>
              </div>
            </div>

            {/* Shop with Confidence 6-Point Grid */}
            <div className="border-t border-stone-100 pt-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2">Shop with Confidence</h3>
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[11px] text-stone-600">
                <div>• Loved by 2 Million+ Customers</div>
                <div>• 24/7 Concierge Service</div>
                <div>• Trusted in Fashion for 20 Years</div>
                <div>• Personalized Styling Assistance</div>
                <div>• Authentic Designer Labels</div>
                <div>• Exclusive Member Benefits</div>
              </div>
            </div>

            {/* Offers & Coupons Box */}
            <div className="border border-stone-200 p-4 bg-white space-y-2.5 rounded-xl shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">Offers &amp; Benefits</h3>
              
              {/* Coupon Box */}
              <div className="flex items-center justify-between p-2.5 bg-[#FCF6F3] border border-[#F0DED4] text-xs rounded-lg">
                <div className="flex items-center gap-2">
                  <Percent size={14} className="text-[#4A1513]" />
                  <span>Best Coupon: <strong className="text-[#4A1513]">APP15</strong></span>
                </div>
                <span className="text-[11px] text-stone-500 font-medium">Save extra up to ₹1,500</span>
              </div>

              {/* FemazonCash Pill */}
              <div className="text-xs text-stone-700 font-medium px-3 py-2 bg-stone-50 border border-stone-100 rounded-lg flex items-center justify-between">
                <span>Earn 1500 FemazonCash Points</span>
                <span className="text-[#4A1513] font-bold">★</span>
              </div>
            </div>

            {/* Accordions: Product Details & Shipping */}
            <div className="border-t border-stone-100 pt-2 space-y-2">
              {/* Product Details */}
              <div className="border border-stone-200 bg-white rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('details')}
                  className="w-full flex items-center justify-between p-4 text-xs font-bold text-stone-900 hover:bg-stone-50 transition text-left"
                >
                  <span className="uppercase tracking-wider">Product Details &amp; Composition</span>
                  {openAccordions.details ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordions.details && (
                  <div className="px-4 pb-4 text-xs text-stone-600 space-y-2.5 border-t border-stone-100 pt-3 leading-relaxed">
                    <p>{product.description}</p>
                    <div className="grid grid-cols-2 gap-y-2 text-[11px] pt-2 border-t border-stone-100 text-stone-500">
                      <div><strong className="text-stone-800">Set Includes:</strong> Kurta &amp; Silk Pants</div>
                      <div><strong className="text-stone-800">Fabric:</strong> Pure Chanderi Silk &amp; Organza</div>
                      <div><strong className="text-stone-800">Craft:</strong> Botanical Print &amp; Zardozi</div>
                      <div><strong className="text-stone-800">Care:</strong> Dry Clean Only</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div className="border border-stone-200 bg-white rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between p-4 text-xs font-bold text-stone-900 hover:bg-stone-50 transition text-left"
                >
                  <span className="uppercase tracking-wider">Shipping &amp; Returns Policy</span>
                  {openAccordions.shipping ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordions.shipping && (
                  <div className="px-4 pb-4 text-xs text-stone-600 space-y-2 border-t border-stone-100 pt-3">
                    <p>• Free express courier shipping across India.</p>
                    <p>• 7-day hassle-free exchange &amp; return policy.</p>
                    <p>• Real-time courier tracking sent via SMS and Email upon dispatch.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Support Strip */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">Customer Support</h4>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="https://wa.me/918291990059"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg border border-stone-200 hover:border-[#4A1513] text-[11px] font-bold text-stone-800 transition bg-white"
                >
                  <MessageCircle size={13} className="text-[#4A1513]" />
                  <span>Chat with us</span>
                </a>
                <a
                  href="tel:02262767120"
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg border border-stone-200 hover:border-[#4A1513] text-[11px] font-bold text-stone-800 transition bg-white"
                >
                  <Phone size={13} className="text-[#4A1513]" />
                  <span>022 62767120</span>
                </a>
                <a
                  href="mailto:support@femazon.com"
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg border border-stone-200 hover:border-[#4A1513] text-[11px] font-bold text-stone-800 transition bg-white"
                >
                  <Mail size={13} className="text-[#4A1513]" />
                  <span>Mail us</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: SIMILAR ITEMS (4-Column Lookbook Grid) */}
        {/* ========================================================================= */}
        <section className="mt-24 pt-12 border-t border-stone-100">
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal mb-6">
            Similar Items
          </h2>

          {/* Filter Pills Bar */}
          <div className="flex items-center gap-2.5 overflow-x-auto hide-scrollbar pb-4 mb-6">
            <button
              type="button"
              onClick={() => setActiveSimilarTab('closest')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition cursor-pointer border ${
                activeSimilarTab === 'closest'
                  ? 'border-[#4A1513] text-[#4A1513] bg-[#4A1513]/10 shadow-xs'
                  : 'border-stone-200 text-stone-600 bg-white hover:border-[#4A1513]'
              }`}
            >
              Closest Match
            </button>

            <button
              type="button"
              onClick={() => setActiveSimilarTab('designer')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition cursor-pointer border ${
                activeSimilarTab === 'designer'
                  ? 'border-[#4A1513] text-[#4A1513] bg-[#4A1513]/10 shadow-xs'
                  : 'border-stone-200 text-stone-600 bg-white hover:border-[#4A1513]'
              }`}
            >
              More from Designer
            </button>

            <button
              type="button"
              onClick={() => setActiveSimilarTab('exclusive')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition cursor-pointer border ${
                activeSimilarTab === 'exclusive'
                  ? 'border-[#4A1513] text-[#4A1513] bg-[#4A1513]/10 shadow-xs'
                  : 'border-stone-200 text-stone-600 bg-white hover:border-[#4A1513]'
              }`}
            >
              Femazon Exclusive
            </button>

            <button
              type="button"
              onClick={() => setActiveSimilarTab('ready')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition cursor-pointer border ${
                activeSimilarTab === 'ready'
                  ? 'border-[#4A1513] text-[#4A1513] bg-[#4A1513]/10 shadow-xs'
                  : 'border-stone-200 text-stone-600 bg-white hover:border-[#4A1513]'
              }`}
            >
              Ready to Ship
            </button>
          </div>

          {/* 4-Column Product Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {filteredSimilarItems.map((item, idx) => {
              let itemImg = item.image || "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=600";
              try {
                if (item.images) {
                  const parsed = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
                  if (parsed[0]) itemImg = parsed[0];
                }
              } catch (e) {}

              const itemDesigner = item.name?.split('-')[0]?.trim() || "Femazon Atelier";
              const cleanItemName = item.name?.split('-')[1]?.trim() || item.name;

              return (
                <Link
                  key={item.id}
                  href={`/products/${item.slug || item.id}`}
                  className="group flex flex-col bg-white"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[3/4.2] bg-[#FAF7F4] overflow-hidden rounded-2xl mb-3 border border-stone-100/80 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={itemImg}
                      alt={item.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Floating Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center text-stone-700 hover:text-[#4A1513] transition shadow-sm"
                    >
                      <Heart size={15} />
                    </button>
                  </div>

                  {/* Micro Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#4A1513] bg-[#4A1513]/10 px-2 py-0.5 rounded">
                      ⚡ Ready to ship
                    </span>
                    {idx % 2 === 0 && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        ✨ New Arrivals
                      </span>
                    )}
                  </div>

                  {/* Designer & Name */}
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-[#4A1513] transition">
                    {itemDesigner}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 font-normal">
                    {cleanItemName}
                  </p>

                  {/* Price */}
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      ₹{(item.discountPrice || item.price).toLocaleString('en-IN')}
                    </span>
                    {item.discountPrice && (
                      <span className="text-[11px] text-stone-400 line-through">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: BEST PAIRED WITH (Polki & Kundan Fine Jewellery) */}
        {/* ========================================================================= */}
        <section className="mt-20 pt-12 border-t border-stone-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#4A1513]">Curated Styling</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal mt-1">
                Best Paired With
              </h2>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                className="h-9 w-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-700 hover:border-[#4A1513] hover:text-[#4A1513] transition bg-white shadow-2xs"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {(bestPairedProducts.length > 0 ? bestPairedProducts : similarProducts.slice(0, 4)).map((item, idx) => {
              let itemImg = item.image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600";
              try {
                if (item.images) {
                  const parsed = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
                  if (parsed[0]) itemImg = parsed[0];
                }
              } catch (e) {}

              const brandName = item.name?.split('-')[0]?.trim() || "Nazaakat";
              const jewelryName = item.name?.split('-')[1]?.trim() || item.name;

              return (
                <Link
                  key={item.id}
                  href={`/products/${item.slug || item.id}`}
                  className="group flex flex-col bg-white"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[3/4] bg-[#FAF7F4] overflow-hidden rounded-2xl mb-3 border border-stone-100/80 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={itemImg}
                      alt={item.name}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Floating Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center text-stone-700 hover:text-[#4A1513] transition shadow-sm"
                    >
                      <Heart size={15} />
                    </button>
                  </div>

                  {/* Micro Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#4A1513] bg-[#4A1513]/10 px-2 py-0.5 rounded">
                      ⚡ Ready to ship
                    </span>
                    {idx === 0 && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        50% OFF
                      </span>
                    )}
                    {idx > 0 && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        ✨ New Arrivals
                      </span>
                    )}
                  </div>

                  {/* Designer & Name */}
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-[#4A1513] transition">
                    {brandName}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 font-normal">
                    {jewelryName}
                  </p>

                  {/* Price */}
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      ₹{(item.discountPrice || item.price).toLocaleString('en-IN')}
                    </span>
                    {item.discountPrice && (
                      <span className="text-[11px] text-stone-400 line-through">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: RECENTLY VIEWED */}
        {/* ========================================================================= */}
        <section className="mt-20 pt-12 border-t border-stone-100">
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal mb-6">
            Recently Viewed
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {similarProducts.slice(0, 4).map((rel) => {
              let relImg = rel.image || "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=600";
              try {
                if (rel.images) {
                  const parsed = typeof rel.images === 'string' ? JSON.parse(rel.images) : rel.images;
                  if (parsed[0]) relImg = parsed[0];
                }
              } catch (e) {}

              return (
                <Link
                  key={rel.id}
                  href={`/products/${rel.slug || rel.id}`}
                  className="group flex flex-col bg-white"
                >
                  <div className="relative aspect-[3/4.2] bg-[#FAF7F4] overflow-hidden rounded-2xl mb-2.5 border border-stone-100/80 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={relImg}
                      alt={rel.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-[#4A1513] transition line-clamp-1">
                    {rel.name?.split('-')[0]?.trim() || rel.name}
                  </h4>
                  <span className="text-xs font-bold text-stone-900 mt-1">
                    ₹{(rel.discountPrice || rel.price).toLocaleString('en-IN')}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

      </main>

      {/* Lightbox Fullscreen Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white hover:text-black flex items-center justify-center transition"
          >
            <X size={20} />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImage}
              alt="High resolution look"
              className="max-h-[90vh] w-auto object-contain shadow-2xl rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsSizeGuideOpen(false)}
        >
          <div
            className="bg-white max-w-lg w-full p-6 shadow-2xl rounded-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">Designer Size Guide</h3>
                <p className="text-xs text-stone-500">Standard body measurements in Inches</p>
              </div>
              <button onClick={() => setIsSizeGuideOpen(false)} className="text-stone-400 hover:text-stone-900">
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Bust</th>
                    <th className="p-2.5">Waist</th>
                    <th className="p-2.5">Hip</th>
                    <th className="p-2.5">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-600">
                  <tr><td className="p-2.5 font-bold text-stone-900">3XS</td><td className="p-2.5">30&quot;</td><td className="p-2.5">24&quot;</td><td className="p-2.5">32&quot;</td><td className="p-2.5">48&quot;</td></tr>
                  <tr><td className="p-2.5 font-bold text-stone-900">XXS</td><td className="p-2.5">32&quot;</td><td className="p-2.5">26&quot;</td><td className="p-2.5">34&quot;</td><td className="p-2.5">48&quot;</td></tr>
                  <tr><td className="p-2.5 font-bold text-stone-900">XS</td><td className="p-2.5">34&quot;</td><td className="p-2.5">28&quot;</td><td className="p-2.5">36&quot;</td><td className="p-2.5">48&quot;</td></tr>
                  <tr><td className="p-2.5 font-bold text-stone-900">S</td><td className="p-2.5">36&quot;</td><td className="p-2.5">30&quot;</td><td className="p-2.5">38&quot;</td><td className="p-2.5">48&quot;</td></tr>
                  <tr><td className="p-2.5 font-bold text-stone-900">M</td><td className="p-2.5">38&quot;</td><td className="p-2.5">32&quot;</td><td className="p-2.5">40&quot;</td><td className="p-2.5">48&quot;</td></tr>
                  <tr><td className="p-2.5 font-bold text-stone-900">L</td><td className="p-2.5">40&quot;</td><td className="p-2.5">34&quot;</td><td className="p-2.5">42&quot;</td><td className="p-2.5">48&quot;</td></tr>
                  <tr><td className="p-2.5 font-bold text-stone-900">XL</td><td className="p-2.5">42&quot;</td><td className="p-2.5">36&quot;</td><td className="p-2.5">44&quot;</td><td className="p-2.5">48&quot;</td></tr>
                  <tr><td className="p-2.5 font-bold text-stone-900">XXL</td><td className="p-2.5">44&quot;</td><td className="p-2.5">38&quot;</td><td className="p-2.5">46&quot;</td><td className="p-2.5">48&quot;</td></tr>
                  <tr><td className="p-2.5 font-bold text-stone-900">3XL</td><td className="p-2.5">46&quot;</td><td className="p-2.5">40&quot;</td><td className="p-2.5">48&quot;</td><td className="p-2.5">48&quot;</td></tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="px-5 py-2 bg-[#4A1513] text-white text-xs font-bold uppercase tracking-wider rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
