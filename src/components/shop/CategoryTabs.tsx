"use client";

import React from 'react';

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryTabs({ categories, selectedCategory, onSelectCategory }: CategoryTabsProps) {
  return (
    <div className="w-full border-b border-accent/10 bg-surface sticky top-[88px] z-30">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="flex overflow-x-auto hide-scrollbar py-4 gap-2 md:gap-4 items-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`shrink-0 px-6 py-2.5 rounded-full text-[13px] font-bold tracking-widest uppercase transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-text-main text-white shadow-md'
                  : 'bg-accent/5 text-text-muted hover:bg-accent/10 hover:text-text-main'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
