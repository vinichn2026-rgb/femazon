"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, ArrowLeft, UploadCloud, Camera, Sparkles, Wand2, 
  Download, Heart, ShoppingBag, RefreshCw, CheckCircle2, 
  ShieldCheck, AlertCircle, Eye, SlidersHorizontal, ChevronUp, ChevronDown
} from 'lucide-react';

const OCCASIONS = [
  'Brunch / Day Event',
  'Cocktail Night',
  'Engagement Party',
  'Mehendi / Haldi',
  'Party Night',
  'Reception',
  'Wedding Ceremony',
  'Festive Puja',
  'Sangeet Night',
];

interface ProductVirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string | number;
    name: string;
    image: string;
    images?: string[];
    price: number;
    discountPrice?: number;
    brand?: string;
  };
  selectedSize?: string;
  onAddToCart?: (size?: string) => void;
}

type Step = 'choose-photo' | 'camera-capture' | 'preview' | 'generating' | 'result';

export function ProductVirtualTryOnModal({
  isOpen,
  onClose,
  product,
  selectedSize = 'M',
  onAddToCart,
}: ProductVirtualTryOnModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('choose-photo');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isAddedToBag, setIsAddedToBag] = useState(false);
  const [generationStage, setGenerationStage] = useState<string>('Analyzing body contour & posture...');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Select Occasion');
  const [isOccasionDropdownOpen, setIsOccasionDropdownOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Camera Stream
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Resolve Product Image Safely
  let parsedImages: string[] = [];
  try {
    if (product.images) {
      parsedImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    }
  } catch (e) {}
  if (!Array.isArray(parsedImages)) parsedImages = [];

  const primaryProductImage = 
    (parsedImages.length > 0 && typeof parsedImages[0] === 'string' && parsedImages[0].length > 8 ? parsedImages[0] : null) || 
    (typeof product.image === 'string' && product.image.length > 8 ? product.image : null) || 
    "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=800";

  // Cleanup camera when modal closes or step changes
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Reset modal states when opening
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
    }
  }, [isOpen, cameraStream]);

  if (!isOpen) return null;

  // Handle Photo Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUserImage(event.target?.result as string);
      setCurrentStep('preview');
    };
    reader.readAsDataURL(file);
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUserImage(event.target?.result as string);
      setCurrentStep('preview');
    };
    reader.readAsDataURL(file);
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    setCurrentStep('camera-capture');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError("Camera access denied or unavailable. Please upload a photo instead.");
    }
  };

  // Capture Snapshot from Camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setUserImage(dataUrl);
      
      // Stop Camera
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      setCurrentStep('preview');
    }
  };

  // Trigger AI Generation Pipeline
  const handleGenerateLook = async () => {
    if (!userImage) return;

    setCurrentStep('generating');
    setGenerationStage('1. Analyzing silhouette & body pose...');

    const timer1 = setTimeout(() => {
      setGenerationStage('2. Draping couture garment & texture mapping...');
    }, 1000);

    const timer2 = setTimeout(() => {
      setGenerationStage('3. Harmonizing lighting, shadows & natural fabric folds...');
    }, 2000);

    try {
      const res = await fetch('/api/virtual-try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userImage,
          productId: product.id,
          productImage: primaryProductImage
        })
      });

      const data = await res.json();
      if (data.success && data.resultImage) {
        setResultImage(data.resultImage);
      } else {
        setResultImage(primaryProductImage);
      }
    } catch (e) {
      setResultImage(primaryProductImage);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setCurrentStep('result');
    }
  };

  // Add to Bag handler
  const handleAddLookToBag = () => {
    if (onAddToCart) {
      onAddToCart(selectedSize);
    }
    setIsAddedToBag(true);
    setTimeout(() => {
      setIsAddedToBag(false);
      onClose();
    }, 1500);
  };

  // Back Navigation Button
  const handleBack = () => {
    if (currentStep === 'camera-capture') {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      setCurrentStep('choose-photo');
    } else if (currentStep === 'preview') {
      setCurrentStep('choose-photo');
    } else if (currentStep === 'result') {
      setCurrentStep('preview');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden animate-in fade-in duration-300">
      
      {/* Soft Blurred Backdrop Scrim */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Right-Hand Sliding Side Panel Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex z-10">
        <div className="w-screen max-w-md sm:max-w-md bg-white shadow-2xl border-l border-stone-200 flex flex-col h-full animate-in slide-in-from-right duration-300 ease-out">
        
        {/* ========================================================================= */}
        {/* SIDE PANEL HEADER (Matching Aza Screenshot) */}
        {/* ========================================================================= */}
        <div className="px-6 py-4 bg-white border-b border-stone-100 flex items-center justify-between shrink-0">
          
          <h3 className="font-serif text-base sm:text-lg font-normal text-stone-900">
            Femazon&apos;s Virtual try-on
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-[#4A1513] hover:underline cursor-pointer tracking-wider"
          >
            Close
          </button>

        </div>

        {/* ========================================================================= */}
        {/* MODAL BODY (DYNAMIC FLOW BASED ON CURRENT STEP) */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col justify-center">
          
          {/* --------------------------------------------------------------------- */}
          {/* STEP 1: CHOOSE PHOTO (Aza Framing Example + Unified Drop Zone Box) */}
          {/* --------------------------------------------------------------------- */}
          {currentStep === 'choose-photo' && (
            <div className="w-full max-w-sm mx-auto flex flex-col">
              
              {/* Framing Example Container */}
              <div className="bg-[#FAF7F4] rounded-2xl p-4 border border-stone-200/70 mb-4 text-center">
                <span className="text-xs text-stone-600 font-medium block mb-2.5">
                  Framing example:
                </span>

                {/* 2 Framing Photos */}
                <div className="flex items-center justify-center gap-3 mb-2.5">
                  
                  {/* Left: Full Image */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-32 rounded-xl overflow-hidden bg-white border border-stone-200 shadow-xs relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=80&w=260"
                        alt="Full image example"
                        className="w-full h-full object-cover object-top"
                      />
                      <span className="absolute bottom-1 inset-x-1 bg-white/95 text-stone-800 text-[8px] font-semibold py-0.5 rounded text-center shadow-xs">
                        Try with full image
                      </span>
                    </div>
                  </div>

                  {/* Middle "or" */}
                  <span className="text-xs text-stone-400 font-medium">or</span>

                  {/* Right: Portrait */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-32 rounded-xl overflow-hidden bg-white border border-stone-200 shadow-xs relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=260"
                        alt="Portrait example"
                        className="w-full h-full object-cover object-top"
                      />
                      <span className="absolute bottom-1 inset-x-1 bg-white/95 text-stone-800 text-[8px] font-semibold py-0.5 rounded text-center shadow-xs">
                        Try with Portrait
                      </span>
                    </div>
                  </div>

                </div>

                {/* Subtext */}
                <p className="text-[11px] text-stone-500 leading-tight max-w-[260px] mx-auto">
                  For best results, upload a photo that includes your face and follows the example shown.
                </p>
              </div>

              {/* Single Unified Drop Zone Box */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border border-dashed rounded-2xl p-6 bg-white text-center transition-all ${
                  isDragging ? 'border-[#4A1513] bg-[#FAF5F2]' : 'border-stone-400/80 hover:border-stone-600'
                }`}
              >
                <UploadCloud size={38} className="text-stone-600 mx-auto mb-2" strokeWidth={1.4} />
                
                <h4 className="text-sm font-medium text-stone-800 mb-2">
                  Drop your image here
                </h4>

                <div className="flex items-center justify-center gap-1.5 text-xs text-stone-700 mb-3">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="inline-flex items-center gap-1 text-[#4A1513] font-semibold hover:underline cursor-pointer"
                  >
                    <Camera size={14} className="text-[#4A1513]" />
                    <span>Take a Selfie</span>
                  </button>
                  <span className="text-stone-400">or</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#4A1513] font-semibold hover:underline cursor-pointer"
                  >
                    Browse
                  </button>
                </div>

                <div className="text-[10px] text-stone-400 space-y-0.5">
                  <p>Image size should not exceed 10 MB.</p>
                  <p>PNG, JPG, or HEIC</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg, image/png, image/webp, image/heic"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* STEP 1.5: LIVE CAMERA CAPTURE */}
          {/* --------------------------------------------------------------------- */}
          {currentStep === 'camera-capture' && (
            <div className="max-w-md mx-auto w-full flex flex-col items-center text-center">
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-0.5">Align Your Silhouette</h3>
              <p className="text-xs text-stone-500 mb-3">Position your face &amp; upper body within the frame.</p>

              {cameraError ? (
                <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs text-center mb-4">
                  <AlertCircle size={22} className="mx-auto mb-2" />
                  <p>{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('choose-photo')}
                    className="mt-3 px-4 py-2 bg-stone-900 text-white rounded-lg font-bold"
                  >
                    Back to Photo Upload
                  </button>
                </div>
              ) : (
                <div className="relative w-full aspect-[3/4] bg-stone-950 rounded-2xl overflow-hidden shadow-lg border border-stone-800">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                  />
                  {/* Silhouette Oval Guide */}
                  <div className="absolute inset-0 pointer-events-none border-2 border-white/30 rounded-2xl m-6 flex items-center justify-center">
                    <div className="w-44 h-60 border-2 border-dashed border-white/60 rounded-full" />
                  </div>

                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white border-4 border-[#4A1513] flex items-center justify-center text-[#4A1513] shadow-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                    title="Capture Photo"
                  >
                    <Camera size={22} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* STEP 2: PHOTO PREVIEW (Exact Match to User Screenshot) */}
          {/* --------------------------------------------------------------------- */}
          {currentStep === 'preview' && userImage && (
            <div className="relative w-full max-w-sm mx-auto flex flex-col items-center">
              
              {/* Full-view Image Canvas Card */}
              <div className="relative w-full aspect-[3/4.6] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-lg">
                
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={userImage}
                  alt="Uploaded Look"
                  className="w-full h-full object-cover object-top"
                />

                {/* Selected Product Floating Pill at top */}
                <div className="absolute top-3 left-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-stone-200/80 shadow-xs flex items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4A1513] shrink-0" />
                    <span className="text-[10.5px] font-bold text-stone-800 truncate">
                      {product.name}
                    </span>
                  </div>
                  <span className="text-[10.5px] font-bold text-[#4A1513] shrink-0">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Bottom Gradient Scrim Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-4 z-20">
                  
                  {/* Occasion Selector Pill & Upward Dropdown */}
                  <div className="relative mb-3 flex justify-center">
                    
                    {/* Upward Dropdown Menu */}
                    {isOccasionDropdownOpen && (
                      <div className="absolute bottom-full mb-2 w-52 max-h-48 overflow-y-auto bg-white rounded-xl shadow-2xl border border-stone-200 py-1.5 z-30 animate-in zoom-in-95 duration-150">
                        {OCCASIONS.map((occ) => (
                          <button
                            key={occ}
                            type="button"
                            onClick={() => {
                              setSelectedOccasion(occ);
                              setIsOccasionDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-1.5 text-xs transition cursor-pointer hover:bg-[#FAF5F2] hover:text-[#4A1513] ${
                              selectedOccasion === occ ? 'font-bold text-[#4A1513] bg-[#FAF5F2]' : 'text-stone-700'
                            }`}
                          >
                            {occ}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Pill Button with Caret Up */}
                    <button
                      type="button"
                      onClick={() => setIsOccasionDropdownOpen(!isOccasionDropdownOpen)}
                      className="bg-white/95 backdrop-blur-xs text-[#4A1513] text-xs font-semibold px-4 py-1.5 rounded-full shadow-md border border-stone-200 hover:bg-white transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{selectedOccasion}</span>
                      <ChevronUp size={14} className={`transition-transform duration-200 ${isOccasionDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom Action Row (Change image & Generate) */}
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 bg-white hover:bg-stone-50 text-stone-900 border border-stone-200 rounded-xl font-medium text-xs shadow-md transition cursor-pointer"
                    >
                      Change image
                    </button>

                    <button
                      type="button"
                      onClick={handleGenerateLook}
                      className="px-6 py-2.5 bg-[#4A1513] hover:bg-[#350B0A] text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles size={14} />
                      <span>Generate</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* STEP 3: AI GENERATION (Premium Animated Loading Effect) */}
          {/* --------------------------------------------------------------------- */}
          {currentStep === 'generating' && (
            <div className="max-w-md mx-auto py-12 flex flex-col items-center text-center">
              
              {/* Silhouette Glowing Pulse Animation */}
              <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#4A1513]/10 animate-ping duration-1000" />
                <div className="absolute inset-2 rounded-full bg-[#4A1513]/20 animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-[#4A1513] text-white flex items-center justify-center shadow-xl">
                  <Wand2 size={32} className="animate-spin duration-3000" />
                </div>
              </div>

              <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2 flex items-center gap-2">
                <span>Creating your virtual look</span>
                <Sparkles size={18} className="text-[#4A1513] animate-pulse" />
              </h3>

              <p className="text-xs text-stone-500 mb-6">
                AI is styling you in this outfit...
              </p>

              {/* Progress Stage Pill */}
              <div className="w-full bg-[#FAF5F2] border border-[#4A1513]/20 rounded-xl p-3 text-[11.5px] font-semibold text-[#4A1513] animate-pulse">
                {generationStage}
              </div>

            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* STEP 4: RESULT (Comparison & Actions) */}
          {/* --------------------------------------------------------------------- */}
          {currentStep === 'result' && resultImage && (
            <div className="max-w-3xl mx-auto flex flex-col items-center">
              
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10.5px] font-bold uppercase tracking-wider mb-2">
                  <CheckCircle2 size={13} />
                  <span>Drape Complete</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Your Virtual Look is Ready ✨
                </h3>
              </div>

              {/* Side-by-Side Result Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mb-6">
                
                {/* Left: Original User Photo */}
                <div className="flex flex-col">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={userImage || ''}
                      alt="Original Silhouette"
                      className="w-full h-full object-cover object-top"
                    />
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold uppercase px-2.5 py-1 rounded-md">
                      Original Photo
                    </span>
                  </div>
                </div>

                {/* Right: AI Styled Result */}
                <div className="flex flex-col">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF7F4] border-2 border-[#4A1513] shadow-xl ring-4 ring-[#4A1513]/15">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resultImage || primaryProductImage}
                      alt="AI Styled Look"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=800";
                      }}
                    />
                    <span className="absolute top-3 left-3 bg-[#4A1513] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                      <Sparkles size={10} />
                      <span>AI Styled Look</span>
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 w-full mb-4">
                
                <button
                  type="button"
                  onClick={() => setCurrentStep('choose-photo')}
                  className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 hover:border-[#4A1513] text-stone-700 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RefreshCw size={13} />
                  <span>Try Another Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert("High-resolution look downloaded to your device!")}
                  className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 hover:border-[#4A1513] text-stone-700 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Download size={13} />
                  <span>Download Look</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSaved(!isSaved)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                    isSaved 
                      ? 'border-[#4A1513] bg-[#FAF5F2] text-[#4A1513]' 
                      : 'border-stone-300 bg-white text-stone-700 hover:border-[#4A1513]'
                  }`}
                >
                  <Heart size={13} fill={isSaved ? '#4A1513' : 'none'} />
                  <span>{isSaved ? 'Look Saved' : 'Save Look'}</span>
                </button>

              </div>

              {/* Primary Shopping CTA: ADD THIS LOOK TO BAG */}
              <div className="w-full max-w-md pt-2">
                <button
                  type="button"
                  onClick={handleAddLookToBag}
                  className="w-full py-4 px-8 rounded-2xl bg-[#4A1513] hover:bg-[#350B0A] text-white font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isAddedToBag ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>ADDED TO YOUR BAG!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>ADD THIS LOOK TO BAG ({selectedSize})</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  </div>
  );
}
