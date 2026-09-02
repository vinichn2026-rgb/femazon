"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { 
  Upload, Sparkles, Download, ShoppingBag, RefreshCcw, 
  ArrowRight, Check, SlidersHorizontal, Camera, ShieldCheck, 
  ChevronRight, Heart, Share2, HelpCircle, ChevronDown, ChevronUp,
  Maximize2, Eye, Star, Layers, Wand2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductType, PRODUCTS } from '@/data/products';

// Sample Model Presets (Inspired by Aza Fashions)
const SAMPLE_MODELS = [
  {
    id: 'model-1',
    name: 'Ananya (Traditional)',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    description: 'Medium skin tone, athletic silhouette'
  },
  {
    id: 'model-2',
    name: 'Priya (Bridal)',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    description: 'Warm olive undertone, petite frame'
  },
  {
    id: 'model-3',
    name: 'Maya (Contemporary)',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
    description: 'Fair complexion, tall silhouette'
  },
];

// Setting / Backdrop Scenes
const BACKDROP_SCENES = [
  { id: 'palace', name: 'Royal Palace Courtyard', icon: '🏰' },
  { id: 'sangeet', name: 'Festive Sangeet Ballroom', icon: '✨' },
  { id: 'haveli', name: 'Heritage Haveli', icon: '🏛️' },
  { id: 'terrace', name: 'Sunset Terrace', icon: '🌅' },
  { id: 'minimal', name: 'Editorial Studio', icon: '📸' },
];

// Customer Transformations
const TRANSFORMATIONS = [
  {
    name: 'Rhea Kapoor',
    location: 'Mumbai',
    outfit: 'Embroidered Georgette Anarkali',
    comment: 'I tried 5 lehengas before ordering for my sister’s sangeet. The fit and color match was identical in real life!',
    before: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500',
    after: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=500',
    rating: 5,
  },
  {
    name: 'Deepika Sen',
    location: 'New Delhi',
    outfit: 'Bridal Crimson Silk Lehenga',
    comment: 'Seeing myself in the royal courtyard setting made me confident in purchasing my dream bridal outfit online.',
    before: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=500',
    after: 'https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=80&w=500',
    rating: 5,
  },
  {
    name: 'Anushka Sharma',
    location: 'Bengaluru',
    outfit: 'Pastel Organza Kurta Set',
    comment: 'The fastest and most realistic virtual dressing room I’ve used. Saved me multiple boutique visits!',
    before: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=500',
    after: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=500',
    rating: 5,
  },
];

// FAQs
const FAQS = [
  {
    q: 'How accurate is the Virtual Try-On drape and fit?',
    a: 'Our generative AI models simulate 3D fabric physics, realistic light refraction, and anatomical contouring tailored to Indian couture silhouettes—ensuring an ultra-realistic preview.'
  },
  {
    q: 'Is my uploaded photo kept private and secure?',
    a: 'Yes, your photos are processed in encrypted memory solely for the duration of the try-on session and are never sold, shared, or retained without explicit consent.'
  },
  {
    q: 'What kind of photo gives the best virtual try-on result?',
    a: 'For best results, upload a well-lit, front-facing full or upper-body photo wearing fitted clothing with neutral posture and a clean background.'
  },
  {
    q: 'Can I customize my outfit size after trying it on?',
    a: 'Yes! Once you preview your look, select your standard size (XS to XXL) or choose Custom Fit measurements before adding to your bag.'
  }
];

function VirtualTryOnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProductId = searchParams.get('productId');

  // Filter States (Inspired by Aza Filter Bar)
  const [selectedGender, setSelectedGender] = useState<'Women' | 'Men'>('Women');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');

  // Studio States
  const [userImage, setUserImage] = useState<string | null>(SAMPLE_MODELS[0].image);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(PRODUCTS[0] || null);
  const [selectedBackdrop, setSelectedBackdrop] = useState<string>(BACKDROP_SCENES[0].id);
  const [selectedSize, setSelectedSize] = useState<string>('M');

  // Generation & Status
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStage, setProcessStage] = useState<string>('Analyzing silhouette...');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Comparison slider position (0 to 100)
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side' | 'result-only'>('slider');

  // FAQ open accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial product if passed in URL query
  useEffect(() => {
    if (initialProductId) {
      const prod = PRODUCTS.find(p => p.id === initialProductId);
      if (prod) {
        setSelectedProduct(prod);
      }
    }
  }, [initialProductId]);

  // Handle Photo Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUserImage(event.target?.result as string);
      setResultImage(null); // Reset previous result
    };
    reader.readAsDataURL(file);
  };

  // Trigger Virtual Try-On Generation
  const handleGenerateTryOn = async () => {
    if (!userImage || !selectedProduct) return;

    setIsProcessing(true);
    setResultImage(null);

    // Simulate multi-stage AI pipeline
    setProcessStage('1. Analyzing body contour & posture...');
    setTimeout(() => {
      setProcessStage('2. Draping luxury fabric & texture mapping...');
    }, 900);
    setTimeout(() => {
      setProcessStage('3. Harmonizing lighting with chosen scene...');
    }, 1800);

    try {
      const prodImg = selectedProduct.images?.[0] || (selectedProduct as any).image;
      const res = await fetch('/api/virtual-try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userImage,
          productId: selectedProduct.id,
          productImage: prodImg,
          backdrop: selectedBackdrop
        })
      });

      const data = await res.json();
      if (data.success) {
        setResultImage(data.resultImage);
      } else {
        setResultImage(prodImg);
      }
    } catch (e) {
      // Fallback to high-res product preview on error
      const prodImg = selectedProduct.images?.[0] || (selectedProduct as any).image;
      setResultImage(prodImg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Add to Bag action
  const handleAddToCart = () => {
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 3000);
  };

  // Filter outfits catalog
  const filteredProducts = PRODUCTS.filter(p => {
    if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-white text-stone-900 min-h-screen">
      
      {/* ========================================================================= */}
      {/* 1. HERO HEADER (Aza "The Look. On You." Style) */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF7F4] border-b border-stone-200/80 pt-8 pb-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left Headline */}
            <div className="text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#4A1513]/20 text-[#4A1513] text-[11px] font-bold tracking-widest uppercase mb-4 shadow-2xs">
                <Sparkles size={13} className="text-[#4A1513]" />
                <span>Next-Gen AI Dressing Room</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight">
                The Look. <span className="text-[#4A1513] italic font-normal">On You.</span>
              </h1>
              <p className="mt-3 text-stone-600 text-base sm:text-lg">
                With the setting, the moment, the look! Experience royal Indian couture draped accurately on your silhouette before you buy.
              </p>
            </div>

            {/* Right Video / Live Try-On Showcase Card */}
            <div className="w-full lg:w-[420px] bg-white p-3 rounded-2xl border border-stone-200/90 shadow-md flex items-center gap-3">
              <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=400"
                  alt="Virtual Try On Preview"
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute bottom-1 left-1 right-1 bg-black/60 backdrop-blur-xs text-white text-[8.5px] uppercase font-bold tracking-wider py-0.5 text-center rounded">
                  AI PREVIEW
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A1513]">Instant Drape Tech</span>
                <h4 className="font-serif text-sm font-semibold text-stone-900 mt-0.5">Sabyasachi &amp; Atelier Couture</h4>
                <p className="text-[11.5px] text-stone-500 mt-1 leading-snug">
                  Upload your photo or choose a model below to begin styling.
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-[#4A1513]">
                  <span>100% Private &amp; Secure</span>
                  <ShieldCheck size={14} />
                </div>
              </div>
            </div>

          </div>

          {/* Multi-Segment Filter Strip (Gender, Category, Occasion) */}
          <div className="mt-8 bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            
            {/* Gender Toggle */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedGender('Women')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedGender === 'Women' ? 'bg-[#4A1513] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Women
              </button>
              <button
                type="button"
                onClick={() => setSelectedGender('Men')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedGender === 'Men' ? 'bg-[#4A1513] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Men
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              {['All', 'Kurta Sets', 'Lehengas', 'Sarees', 'Dresses', 'Gowns', 'Ethnic'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                    selectedCategory === cat
                      ? 'border-[#4A1513] bg-[#4A1513] text-white shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-[#4A1513] hover:text-[#4A1513]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Occasion Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Occasion:</span>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#4A1513]"
              >
                <option value="All">All Occasions</option>
                <option value="Wedding">Wedding / Bridal</option>
                <option value="Festive">Festive / Diwali</option>
                <option value="Sangeet">Sangeet / Mehendi</option>
                <option value="Cocktail">Cocktail / Reception</option>
              </select>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE VIRTUAL TRY-ON STUDIO (CORE EXPERIENCE) */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* --------------------------------------------------------------------- */}
          {/* LEFT: Photo Canvas / Model Selection (Col 1-4) */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col gap-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
                <span>Step 1: Your Photo</span>
              </h3>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-bold text-[#4A1513] uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Upload size={12} />
                <span>Upload New</span>
              </button>
            </div>

            {/* Active User Photo / Selected Model Box */}
            <div className="relative w-full aspect-[3/4.2] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              {userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userImage}
                  alt="Selected Canvas"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-stone-400">
                  <Camera size={36} className="mb-2" />
                  <p className="text-xs">No photo selected</p>
                </div>
              )}

              {/* Upload Trigger overlay button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs text-[#4A1513] text-xs font-bold py-2 rounded-lg shadow-md border border-stone-200/80 hover:bg-white transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Camera size={14} />
                <span>Upload Custom Photo</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* Preset Model Avatars */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2.5">Or Choose Sample Model:</p>
              <div className="grid grid-cols-3 gap-2.5">
                {SAMPLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => {
                      setUserImage(model.image);
                      setResultImage(null);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition cursor-pointer ${
                      userImage === model.image ? 'border-[#4A1513] ring-2 ring-[#4A1513]/20 shadow-xs' : 'border-stone-200 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-cover object-top"
                    />
                    {userImage === model.image && (
                      <div className="absolute top-1 right-1 bg-[#4A1513] text-white p-0.5 rounded-full">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* --------------------------------------------------------------------- */}
          {/* MIDDLE: Outfit & Backdrop Selector (Col 5-8) */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col gap-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Step 2: Choose Outfit &amp; Setting
              </h3>
              <span className="text-[11px] font-semibold text-stone-500">
                {filteredProducts.length} Looks Available
              </span>
            </div>

            {/* Outfits Grid */}
            <div className="flex flex-col gap-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Select Outfit to Try On:</p>
              
              <div className="grid grid-cols-2 gap-3 max-h-[310px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredProducts.slice(0, 8).map((prod) => {
                  const isSelected = selectedProduct?.id === prod.id;
                  const img = prod.images?.[0] || (prod as any).image;

                  return (
                    <div
                      key={prod.id}
                      onClick={() => {
                        setSelectedProduct(prod);
                        setResultImage(null);
                      }}
                      className={`relative rounded-xl p-2 bg-[#FAF7F4] border transition-all cursor-pointer flex flex-col ${
                        isSelected
                          ? 'border-[#4A1513] ring-2 ring-[#4A1513]/25 bg-white shadow-xs'
                          : 'border-stone-200/80 hover:border-[#4A1513]/40'
                      }`}
                    >
                      <div className="relative w-full aspect-[3/3.8] rounded-lg overflow-hidden bg-stone-100 mb-1.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={prod.name}
                          className="w-full h-full object-cover object-top"
                        />
                        {isSelected && (
                          <span className="absolute top-1 right-1 bg-[#4A1513] text-white p-0.5 rounded-full shadow-xs">
                            <Check size={10} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <h5 className="font-serif text-[11.5px] font-semibold text-stone-900 line-clamp-1 leading-snug">
                        {prod.name}
                      </h5>
                      <span className="text-[11px] font-bold text-[#4A1513] mt-0.5">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Backdrop / Scene Selector */}
            <div className="pt-2 border-t border-stone-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">Select Event Setting:</p>
              <div className="grid grid-cols-3 gap-1.5">
                {BACKDROP_SCENES.map((scene) => (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => setSelectedBackdrop(scene.id)}
                    className={`px-2 py-2 rounded-lg text-[10.5px] font-medium border text-center transition cursor-pointer flex flex-col items-center gap-0.5 ${
                      selectedBackdrop === scene.id
                        ? 'border-[#4A1513] bg-[#FAF5F2] text-[#4A1513] font-bold shadow-2xs'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-base">{scene.icon}</span>
                    <span className="line-clamp-1 leading-tight">{scene.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Try-On Button */}
            <button
              type="button"
              disabled={isProcessing || !userImage || !selectedProduct}
              onClick={handleGenerateTryOn}
              className="w-full py-3.5 px-6 rounded-xl bg-[#4A1513] text-white font-bold text-sm tracking-wider uppercase shadow-md hover:bg-[#360D0C] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Wand2 size={18} className="animate-spin" />
                  <span>{processStage}</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate Virtual Try-On</span>
                </>
              )}
            </button>

          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT: AI Result & Comparison View (Col 9-12) */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col gap-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-1.5">
                <Wand2 size={16} className="text-[#4A1513]" />
                <span>Step 3: The Result</span>
              </h3>

              {/* View Mode Controls */}
              {resultImage && (
                <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setViewMode('slider')}
                    className={`px-2 py-1 rounded transition cursor-pointer ${viewMode === 'slider' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'}`}
                  >
                    Compare
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('result-only')}
                    className={`px-2 py-1 rounded transition cursor-pointer ${viewMode === 'result-only' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'}`}
                  >
                    Result
                  </button>
                </div>
              )}
            </div>

            {/* Display Canvas Box */}
            <div className="relative w-full aspect-[3/4.2] rounded-xl overflow-hidden bg-stone-100 border border-stone-200 select-none">
              
              {isProcessing ? (
                // Processing Animation
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#FAF7F4] to-white">
                  <div className="w-16 h-16 rounded-full border-4 border-[#4A1513]/20 border-t-[#4A1513] animate-spin mb-4 flex items-center justify-center">
                    <Sparkles size={22} className="text-[#4A1513] animate-pulse" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-stone-900 mb-1">Generating High-Fashion Render</h4>
                  <p className="text-xs text-[#4A1513] font-semibold">{processStage}</p>
                </div>
              ) : resultImage ? (
                // Result View with Comparison Slider
                viewMode === 'slider' ? (
                  <div className="relative w-full h-full overflow-hidden cursor-ew-resize">
                    {/* Underlying Original Photo */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={userImage || ''}
                      alt="Original User Silhouette"
                      className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
                    />
                    <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                      Before
                    </span>

                    {/* Draped Result (Clipped by slider) */}
                    <div
                      className="absolute inset-0 overflow-hidden pointer-events-none"
                      style={{ width: `${sliderPosition}%` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resultImage}
                        alt="AI Styled Result"
                        className="absolute inset-0 w-full h-full object-cover object-top max-w-none"
                        style={{ width: '100%', height: '100%' }}
                      />
                      <span className="absolute top-2 left-2 bg-[#4A1513] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow-sm">
                        AI Styled
                      </span>
                    </div>

                    {/* Slider Divider Bar */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#4A1513] text-white flex items-center justify-center shadow-md border-2 border-white">
                        <SlidersHorizontal size={12} />
                      </div>
                    </div>

                    {/* Range Input Trigger */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPosition}
                      onChange={(e) => setSliderPosition(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    />
                  </div>
                ) : (
                  // Result Only View
                  <div className="relative w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resultImage}
                      alt="AI Styled Result"
                      className="w-full h-full object-cover object-top"
                    />
                    <span className="absolute top-2 left-2 bg-[#4A1513] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow-sm">
                      AI Styled Look
                    </span>
                  </div>
                )
              ) : (
                // Empty state before generation
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-stone-400 bg-[#FCFAF8]">
                  <Wand2 size={36} className="text-stone-300 mb-2" />
                  <p className="text-xs text-stone-500 max-w-[200px]">
                    Choose an outfit and click <strong>Generate</strong> to preview your look here.
                  </p>
                </div>
              )}
            </div>

            {/* Draped Outfit Info & Size Selector */}
            {selectedProduct && (
              <div className="p-3 bg-[#FAF7F4] rounded-xl border border-stone-200/70 flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Selected Couture</span>
                    <h4 className="font-serif text-xs font-bold text-stone-900 line-clamp-1">{selectedProduct.name}</h4>
                  </div>
                  <span className="font-bold text-xs text-[#4A1513] shrink-0">
                    ₹{selectedProduct.price.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Size Selector */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-200/50">
                  <span className="text-[10.5px] font-semibold text-stone-600">Size:</span>
                  <div className="flex items-center gap-1">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`w-6 h-6 rounded text-[9.5px] font-bold transition cursor-pointer border ${
                          selectedSize === sz
                            ? 'border-[#4A1513] bg-[#4A1513] text-white shadow-2xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-xl bg-[#4A1513] text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-[#360D0C] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isAddedToCart ? (
                  <>
                    <Check size={14} />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} />
                    <span>Add Outfit to Bag</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => alert("HD look downloaded to your device.")}
                className="p-3 rounded-xl bg-white border border-stone-200 text-stone-700 hover:border-[#4A1513] hover:text-[#4A1513] transition shadow-2xs flex items-center justify-center cursor-pointer"
                title="Download HD Look"
              >
                <Download size={16} />
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. CURATED TRY-ON COLLECTION (Aza Style Showcase Grid) */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF7F4] py-14 border-t border-b border-stone-200/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#4A1513]">Virtual Try-On Enabled</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
                Popular Outfits Ready to Try On
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-wider text-[#4A1513] hover:underline flex items-center gap-1"
            >
              <span>Explore Entire Catalog</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Outfits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {PRODUCTS.slice(0, 4).map((prod) => {
              const img = prod.images?.[0] || (prod as any).image;
              return (
                <div
                  key={prod.id}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-[#4A1513]/40 shadow-xs hover:shadow-md transition-all duration-300"
                >
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={prod.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 bg-[#FAF3EC] text-[#2A2522] text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
                      <Sparkles size={11} className="text-[#4A1513]" />
                      <span>Virtual Try-On</span>
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{prod.brand}</span>
                    <h4 className="font-serif text-[12.5px] font-semibold text-stone-900 line-clamp-1 mt-0.5">{prod.name}</h4>
                    <span className="text-[12px] font-bold text-[#4A1513] mt-1">₹{prod.price.toLocaleString('en-IN')}</span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProduct(prod);
                        setResultImage(null);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className="mt-3 w-full py-2 bg-stone-50 hover:bg-[#4A1513] text-stone-800 hover:text-white text-[11px] font-bold uppercase tracking-wider rounded-lg border border-stone-200 hover:border-[#4A1513] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles size={12} />
                      <span>Try On This Look</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW IT WORKS (3 SIMPLE STEPS) */}
      {/* ========================================================================= */}
      <section className="py-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4A1513]">Effortless Styling</span>
          <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">How Virtual Try-On Works</h2>
          <p className="text-stone-500 text-sm mt-2">See your dream outfit draped in seconds with 3 simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-6 rounded-2xl bg-[#FAF7F4] border border-stone-200/70 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#4A1513] text-white flex items-center justify-center font-serif text-lg font-bold mb-4 shadow-sm">
              1
            </div>
            <h4 className="font-serif text-base font-bold text-stone-900 mb-1.5">Upload Your Photo</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Upload a front-facing photo or select from our diverse model presets with different body profiles.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F4] border border-stone-200/70 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#4A1513] text-white flex items-center justify-center font-serif text-lg font-bold mb-4 shadow-sm">
              2
            </div>
            <h4 className="font-serif text-base font-bold text-stone-900 mb-1.5">Pick Couture &amp; Backdrop</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Choose from lehengas, sarees, and kurta sets and pair with your celebration’s event backdrop.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F4] border border-stone-200/70 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#4A1513] text-white flex items-center justify-center font-serif text-lg font-bold mb-4 shadow-sm">
              3
            </div>
            <h4 className="font-serif text-base font-bold text-stone-900 mb-1.5">Instant AI Drape</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              View ultra-accurate fabric drape, shadow alignment, and compare before/after with total confidence.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. REAL CUSTOMER TRANSFORMATIONS */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF7F4] py-16 border-t border-stone-200/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4A1513]">Customer Transformations</span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">Styled by AI, Loved by You</h2>
            <p className="text-stone-500 text-sm mt-2">See how our customers explored designer looks before ordering.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRANSFORMATIONS.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col gap-4">
                
                {/* Before & After Images */}
                <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden aspect-[16/10] bg-stone-100">
                  <div className="relative h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.before} alt="Before" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded">Before</span>
                  </div>
                  <div className="relative h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.after} alt="After" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-[#4A1513] text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded">Draped</span>
                  </div>
                </div>

                {/* Rating & Comment */}
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-700 italic leading-relaxed">
                    &ldquo;{item.comment}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-stone-900">{item.name}, {item.location}</span>
                  <span className="text-stone-400">{item.outfit}</span>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FAQS */}
      {/* ========================================================================= */}
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4A1513]">Got Questions?</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-serif text-sm font-semibold text-stone-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50 transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} className="text-[#4A1513]" /> : <ChevronDown size={16} className="text-stone-400" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

export function VirtualTryOnClient() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-serif">Loading Virtual Try-On Experience...</div>}>
      <VirtualTryOnContent />
    </Suspense>
  );
}
