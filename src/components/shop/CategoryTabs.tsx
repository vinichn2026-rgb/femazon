"use client";

import React from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryTabs({ categories, selectedCategory, onSelectCategory }: CategoryTabsProps) {
  return (
    <div className="w-full bg-white border-b border-accent/10 sticky top-[88px] z-30 pb-4">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <div className="flex overflow-x-auto hide-scrollbar py-4 gap-4 items-center border-b border-zinc-200">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`
                  flex items-center justify-center min-w-[100px] px-4 py-2 text-[11px] font-bold tracking-widest uppercase transition-all duration-300
                  ${isSelected 
                    ? 'bg-primary text-white border border-primary' 
                    : 'bg-transparent text-zinc-500 border border-transparent hover:border-zinc-300 hover:text-primary'}
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
