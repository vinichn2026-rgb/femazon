import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { FemazonAIConciergeExperience } from '@/components/concierge/FemazonAIConciergeExperience';

export const metadata: Metadata = {
  title: 'Femazon AI Concierge ✨ | Personal Stylist & Best Friend for Women',
  description: 'Your personal AI assistant for style, fashion, beauty, makeup, hair, events & everything in between. Get personalized recommendations and complete head-to-toe looks.',
};

export default function AIConciergePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center text-xs uppercase tracking-widest text-[#4A1513]">Loading AI Concierge...</div>}>
      <FemazonAIConciergeExperience />
    </Suspense>
  );
}
