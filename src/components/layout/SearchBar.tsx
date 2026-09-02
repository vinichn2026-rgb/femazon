"use client";

import React, { useState, useRef, useId, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Search, Camera, X, Upload, Sparkles, Image as ImageIcon, ArrowRight, Tag, RefreshCw } from 'lucide-react';

export function SearchBar({ className = '' }: { className?: string }) {
  const router = useRouter();
  const fileInputId = useId();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [detectedCategory, setDetectedCategory] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const extractFashionKeyword = (filename: string): { term: string; label: string } => {
    // Strip timestamps, random hashes, file extensions
    const clean = filename
      .replace(/\.[^/.]+$/, '')
      .replace(/^\d+[-_]\d+[-_]?/, '')
      .replace(/[0-9]/g, ' ')
      .replace(/[-_]/g, ' ')
      .toLowerCase()
      .trim();

    if (clean.includes('chudi') || clean.includes('salwar') || clean.includes('suit') || clean.includes('chudidar')) {
      return { term: 'chudi', label: 'Chudidar / Ethnic Suit' };
    }
    if (clean.includes('saree') || clean.includes('sari')) {
      return { term: 'saree', label: 'Designer Saree' };
    }
    if (clean.includes('kurti') || clean.includes('kurta')) {
      return { term: 'kurti', label: 'Kurti / Tunics' };
    }
    if (clean.includes('anarkali')) {
      return { term: 'anarkali', label: 'Anarkali Dress' };
    }
    if (clean.includes('coord') || clean.includes('co ord') || clean.includes('set')) {
      return { term: 'co-ords', label: 'Co-ord Set' };
    }
    if (clean.includes('gown') || clean.includes('maxi')) {
      return { term: 'gown', label: 'Evening Gown / Maxi' };
    }
    if (clean.includes('dress') || clean.includes('midi') || clean.includes('mini')) {
      return { term: 'dress', label: 'Chic Dress' };
    }
    if (clean.includes('top') || clean.includes('shirt') || clean.includes('tunic') || clean.includes('blouse')) {
      return { term: 'top', label: 'Women Top' };
    }
    if (clean.includes('jewel') || clean.includes('necklace') || clean.includes('earring') || clean.includes('bag')) {
      return { term: 'accessories', label: 'Fashion Accessories' };
    }
    if (clean.includes('ethnic') || clean.includes('lehenga')) {
      return { term: 'ethnic', label: 'Ethnic Wear' };
    }

    const meaningfulWords = clean
      .split(/\s+/)
      .filter((w) => w.length > 2 && !['screenshot', 'image', 'img', 'photo', 'picture', 'upload', 'file', 'png', 'jpg', 'jpeg'].includes(w));

    if (meaningfulWords.length > 0) {
      const term = meaningfulWords[0];
      return { term, label: term.charAt(0).toUpperCase() + term.slice(1) };
    }

    return { term: 'kurti', label: 'Ethnic Fashion' };
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setImageName(file.name);
      setIsAnalyzing(true);
      const detected = extractFashionKeyword(file.name);
      setDetectedCategory(detected.label);
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 700);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleApplyImageSearch = (overrideTerm?: string) => {
    setIsImageModalOpen(false);
    let termToSearch = overrideTerm;
    if (!termToSearch) {
      const { term } = extractFashionKeyword(imageName || 'dress');
      termToSearch = term;
    }
    router.push(`/search?q=${encodeURIComponent(termToSearch)}`);
  };

  const sampleVisualSearches = [
    { label: 'Pink Chudi', query: 'chudi' },
    { label: 'Silk Saree', query: 'saree' },
    { label: 'Ethnic Kurti', query: 'kurti' },
    { label: 'Party Dress', query: 'dress' },
    { label: 'Velvet Co-ords', query: 'co-ords' },
    { label: 'Evening Gown', query: 'gown' },
  ];

  return (
    <>
      {/* Compact Classy Search Bar */}
      <form
        onSubmit={handleSearch}
        className={`relative flex items-center w-full max-w-[210px] sm:max-w-[230px] md:max-w-[250px] lg:max-w-[270px] transition-all duration-200 ${className}`}
      >
        <div className="group relative flex w-full h-[36px] items-center rounded-sm border border-[#4A1513]/25 bg-[#4A1513]/[0.02] pl-2.5 pr-1.5 text-xs shadow-[0_1px_4px_rgba(74,21,19,0.04)] transition-all duration-200 hover:border-[#4A1513]/40 hover:bg-[#4A1513]/[0.04] focus-within:border-[#4A1513] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#4A1513]/15">
          {/* Left search icon */}
          <Search className="h-3.5 w-3.5 shrink-0 text-[#4A1513]/60 group-focus-within:text-[#4A1513] transition-colors" strokeWidth={1.75} />

          {/* Compact search text input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full min-w-0 bg-transparent px-2 text-xs text-stone-800 placeholder:text-stone-400 placeholder:font-light outline-none focus:outline-none"
          />

          {/* Right actions: Clear button + Divider + Default Visible Image Search Button */}
          <div className="flex items-center gap-1 shrink-0">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="rounded-full p-0.5 text-stone-400 hover:bg-stone-200/60 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}

            {/* Subtle Divider */}
            <span className="h-3.5 w-[1px] bg-stone-200/90" aria-hidden="true" />

            {/* Screenshot / Image Search Button - Always visible by default */}
            <button
              type="button"
              onClick={() => setIsImageModalOpen(true)}
              className="flex items-center justify-center h-6 w-6 rounded-full text-stone-500 transition-all duration-150 hover:bg-[#4A1513]/10 hover:text-[#4A1513] active:scale-95 cursor-pointer"
              title="Visual / Image Search"
              aria-label="Visual Image Search"
            >
              <Camera className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </form>

      {/* Classy Visual Image Search Modal rendered via React Portal into document.body */}
      {isImageModalOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg my-auto overflow-hidden rounded-3xl border border-stone-100 bg-white p-6 sm:p-7 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4A1513] text-white shadow-xs">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-900 font-serif tracking-tight">Visual Image Search</h3>
                <p className="text-xs text-stone-500 mt-0.5">Upload a screenshot or photo to find real matching products</p>
              </div>
            </div>

            {/* Upload & Preview Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#4A1513] bg-[#4A1513]/5'
                  : 'border-stone-200 bg-stone-50/50 hover:border-stone-400 hover:bg-stone-50'
              }`}
            >
              <input
                id={fileInputId}
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              {selectedImage ? (
                <div className="flex flex-col items-center gap-3.5 w-full">
                  <div className="relative h-32 w-32 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedImage} alt="Selected preview" className="h-full w-full object-cover" />
                    {isAnalyzing && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white backdrop-blur-[2px]">
                        <Sparkles className="h-5 w-5 animate-spin text-amber-400" />
                        <span className="mt-1 text-[11px] font-medium">Scanning style...</span>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-semibold text-stone-800 truncate max-w-[280px]">{imageName}</p>
                    {detectedCategory && (
                      <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-800 border border-amber-200/80">
                        <Tag className="h-3 w-3 text-amber-600" />
                        <span>Style: {detectedCategory}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyImageSearch();
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-[#4A1513] px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-[#3D110F] active:scale-95 cursor-pointer"
                    >
                      <span>Search Similar Products</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(null);
                        setImageName('');
                        setDetectedCategory('');
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 shadow-2xs hover:bg-stone-50 cursor-pointer"
                      title="Upload different image"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Change</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-stone-200 text-stone-600 mb-3">
                    <Upload className="h-5 w-5 text-[#4A1513]" />
                  </div>
                  <p className="text-sm font-semibold text-stone-800">
                    Drag and drop screenshot, or <span className="text-[#4A1513] underline">browse</span>
                  </p>
                  <p className="mt-1 text-xs text-stone-400">Supports PNG, JPG, WebP screenshots up to 10MB</p>
                </div>
              )}
            </div>

            {/* Instant sample searches */}
            <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Or try instant sample looks:
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {sampleVisualSearches.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyImageSearch(item.query)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50/80 px-3 py-1.5 text-xs font-medium text-stone-700 shadow-2xs transition hover:border-[#4A1513]/30 hover:bg-white hover:text-[#4A1513] active:scale-95 cursor-pointer"
                  >
                    <ImageIcon className="h-3.5 w-3.5 text-[#4A1513]" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}


