"use client";

import React, { useState } from 'react';
import { MessageCircle, Sparkles, X } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';

export function WhatsAppFloatingButton() {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = generateWhatsAppLink({
    type: 'general',
    customMessage: 'Hello Femazon Luxury Concierge, I would like assistance with couture outfits and styling services.'
  });

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      
      {/* Interactive Tooltip Card */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200 text-stone-900 text-xs font-medium animate-in slide-in-from-right-3 duration-300">
          <Sparkles size={13} className="text-[#4A1513] shrink-0 animate-pulse" />
          <span>Chat with Femazon Stylist</span>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-stone-700 ml-1.5 p-0.5"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Branded Pulse WhatsApp FAB Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_25px_rgba(37,211,102,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        aria-label="Chat on WhatsApp with Femazon Expert"
      >
        {/* Pulse Waves */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 pointer-events-none" />
        
        <MessageCircle size={26} strokeWidth={2} />
      </a>

    </div>
  );
}
