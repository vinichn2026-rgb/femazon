"use client";

import React, { useState, useRef, useId, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Search, Camera, X } from 'lucide-react';
import { ImageSearchModal } from '@/components/shop/ImageSearchModal';

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

    if (clean.includes('lady bag') || clean.includes('ladies bag') || clean.includes('handbag') || clean.includes('purse') || clean.includes('tote') || clean.includes('clutch') || clean.includes('bag')) {
      return { term: 'handbag', label: 'Handbags & Purses' };
    }
    if (clean.includes('potli') || clean.includes('batwa')) {
      return { term: 'potli', label: 'Bridal Potlis' };
    }
    if (clean.includes('footwear') || clean.includes('shoe') || clean.includes('sandal') || clean.includes('jutti') || clean.includes('heel') || clean.includes('kolhapuri')) {
      return { term: 'footwear', label: 'Footwear & Juttis' };
    }
    if (clean.includes('shawl') || clean.includes('stole') || clean.includes('scarf')) {
      return { term: 'shawl', label: 'Shawls & Stoles' };
    }
    if (clean.includes('belt') || clean.includes('kamarbandh')) {
      return { term: 'belt', label: 'Designer Belts' };
    }
    if (clean.includes('jewel') || clean.includes('necklace') || clean.includes('earring') || clean.includes('choker')) {
      return { term: 'jewellery', label: 'Jewellery & Chokers' };
    }
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

      {/* Visual Image Search Modal */}
      <ImageSearchModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />
    </>
  );
}


