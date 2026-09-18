import React from 'react';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#4A1513] flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in duration-150">
      {/* Prominent Maroon & White Spinner */}
      <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-4 border-white/20 border-t-white animate-spin" />
        <div className="absolute w-12 h-12 rounded-full border-2 border-white/10 border-b-white animate-spin [animation-direction:reverse] [animation-duration:1.2s]" />
      </div>

      {/* Brand Title */}
      <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-[0.3em] text-white mb-2">
        FEMAZON
      </h1>
      
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
        ADMIN
      </p>
    </div>
  );
}
