"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X, LayoutGrid, List } from 'lucide-react';

interface ShopControlsProps {
  totalItems: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSort: string;
  onSortChange: (sortOption: string) => void;
}

export function ShopControls({
  totalItems,
  searchQuery,
  onSearchChange,
  selectedSort,
  onSortChange
}: ShopControlsProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const sortOptions = [
    "Featured",
    "Newest Arrivals",
    "Price: Low to High",
    "Price: High to Low",
    "Customer Popular"
  ];

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(localSearch);
    }, 400);
    return () => clearTimeout(handler);
  }, [localSearch, onSearchChange]);

  // Click outside to close sort
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const itemsToShow = Math.min(12, totalItems);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-2">
      <div className="text-[13px] font-medium text-zinc-600">
        Showing 1-{itemsToShow || 0} of {totalItems} products
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
        {/* Search Bar */}
        <div className="relative flex-grow sm:flex-grow-0 sm:w-[280px]">
          <input 
            type="text" 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search dresses, kurtis, tops..." 
            className="w-full bg-white border border-zinc-200 rounded-full py-2.5 pl-4 pr-10 text-[13px] text-text-main placeholder-zinc-400 focus:outline-none focus:border-[#F687B3] transition-colors shadow-sm"
          />
          <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          {localSearch && (
            <button 
              onClick={() => setLocalSearch('')}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 rounded-full p-1 transition"
            >
              <X size={14} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative" ref={sortRef}>
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center justify-between gap-2 bg-transparent py-2.5 px-2 text-[13px] font-medium text-zinc-600 hover:text-primary transition-colors w-full sm:w-auto min-w-[140px]"
          >
            <span className="truncate text-primary font-bold">Sort by: <span className="font-normal text-zinc-600">{selectedSort}</span></span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-full mt-2 w-full sm:w-[200px] bg-white border border-zinc-100 rounded-xl shadow-lg z-40 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onSortChange(option);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-5 py-2.5 text-[13px] transition ${
                    selectedSort === option 
                      ? 'bg-[#F687B3]/10 text-[#4A2020] font-bold' 
                      : 'text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View Toggles */}
        <div className="hidden sm:flex items-center gap-2">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-[#F9DEDC] text-[#4A2020]' : 'text-zinc-400 hover:bg-zinc-100'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-[#F9DEDC] text-[#4A2020]' : 'text-zinc-400 hover:bg-zinc-100'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
