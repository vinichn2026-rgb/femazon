import React, { Suspense } from 'react';
import { AdminPageTransitionBar } from '@/components/admin/AdminPageTransitionBar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AdminPageTransitionBar />
      </Suspense>
      {children}
    </>
  );
}
