import React from 'react';
import { VirtualTryOnClient } from '@/components/vton/VirtualTryOnClient';

export const metadata = {
  title: 'Virtual Try-On | Femazon',
  description: 'Try on our premium collection virtually using AI.',
};

export default function VirtualTryOnPage() {
  return (
    <div className="min-h-screen bg-white">
      <VirtualTryOnClient />
    </div>
  );
}
