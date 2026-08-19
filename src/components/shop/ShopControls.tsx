"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

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

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4">
      <div className="text-[13px] font-bold text-text-muted">
        Showing {totalItems} products
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
        {/* Search Bar */}
        <div className="relative flex-grow sm:flex-grow-0 sm:w-[280px]">
          <input 
            type="text" 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search dresses, kurtis, tops..." 
            className="w-full bg-transparent border border-accent/20 rounded-full py-2.5 pl-10 pr-10 text-[13px] text-text-main placeholder-text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
          />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          {localSearch && (
            <button 
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main bg-accent/10 rounded-full p-1 transition"
            >
              <X size={12} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative" ref={sortRef}>
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center justify-between gap-3 border border-accent/20 rounded-full py-2.5 px-5 text-[13px] font-bold text-text-main hover:border-primary transition w-full sm:w-auto bg-white shadow-sm min-w-[200px]"
          >
            <span className="truncate">Sort by: <span className="font-normal text-text-muted">{selectedSort}</span></span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-full mt-2 w-full sm:w-[200px] bg-white border border-accent/10 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-40 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onSortChange(option);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-5 py-2.5 text-[13px] transition ${
                    selectedSort === option 
                      ? 'bg-primary/5 text-primary font-bold' 
                      : 'text-text-main hover:bg-accent/5'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
