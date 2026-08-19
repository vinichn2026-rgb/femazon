"use client";

import React from 'react';
import { X } from 'lucide-react';

interface ActiveFilterChipsProps {
  activeFilters: string[];
  onRemoveFilter: (filter: string) => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({ activeFilters, onRemoveFilter, onClearAll }: ActiveFilterChipsProps) {
  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-accent/10 pb-6">
      {activeFilters.map((filter) => (
        <span 
          key={filter} 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent/5 border border-accent/20 text-[12px] font-medium text-text-main"
        >
          {filter}
          <button 
            onClick={() => onRemoveFilter(filter)}
            className="text-text-muted hover:text-primary transition-colors hover:bg-accent/10 rounded-full p-0.5"
          >
            <X size={12} strokeWidth={2} />
          </button>
        </span>
      ))}
      <button 
        onClick={onClearAll}
        className="text-[12px] font-bold uppercase tracking-widest text-primary hover:underline ml-2"
      >
        Clear All
      </button>
    </div>
  );
}
