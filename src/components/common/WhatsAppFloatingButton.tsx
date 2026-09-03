"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';

export function WhatsAppFloatingButton() {
  const whatsappUrl = generateWhatsAppLink({
    type: 'general',
    customMessage: 'Hello Femazon Luxury Concierge, I would like assistance with couture outfits and styling services.'
  });

  return (
    <div className="fixed bottom-6 right-6 z-[9980] flex items-center">
      {/* Branded Pulse WhatsApp FAB Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_25px_rgba(37,211,102,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        aria-label="Chat on WhatsApp with Femazon Expert"
        title="Chat with Concierge on WhatsApp"
      >
        {/* Subtle Pulse Waves */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none" />
        
        <MessageCircle size={24} strokeWidth={2} />
      </a>
    </div>
  );
}
