import React from 'react';
import { prisma } from '@/lib/prisma';


import { DressesShopClient } from '../components/DressesShopClient';

export const dynamic = 'force-dynamic';

export default async function CategoryShopPage({ params, searchParams }: { params: Promise<{ category: string, slug?: string[] }>, searchParams: Promise<{ type?: string, occasion?: string }> }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const categoryParam = resolvedParams.category;
  const slugArray = resolvedParams.slug || [];
  const subCategory = slugArray[0] || resolvedSearchParams.type || 'all';
  const occasion = resolvedSearchParams.occasion;

  // Format Category
  const formattedCategory = categoryParam.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Format SubCategory
  const formattedSubCategory = subCategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const displayTitle = subCategory === 'all' ? `${formattedCategory.toUpperCase()}` : `${formattedSubCategory.toUpperCase()}`;
  const querySubCategory = subCategory === 'fit-and-flare' ? 'Fit & Flare' : formattedSubCategory; 

  const displaySubtitle = subCategory !== 'all' ? `Explore our complete collection of beautiful ${formattedSubCategory.toLowerCase()}.` : `Explore our complete collection of ${formattedCategory.toLowerCase()}.`;

  // Query database
  const dbProducts = await prisma.product.findMany({
    where: {
      category: { equals: formattedCategory, mode: 'insensitive' },
      approvalStatus: 'APPROVED',
      ...(subCategory !== 'all' && {
        OR: [
          { dressType: { equals: querySubCategory, mode: 'insensitive' } },
          { subcategory: { equals: querySubCategory, mode: 'insensitive' } }
        ]
      }),
      ...(occasion && {
        occasion: { equals: occasion.replace(/-/g, ' '), mode: 'insensitive' }
      })
    },
    include: {
      vendor: { include: { vendorProfile: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const formattedProducts = dbProducts.map(p => {
    const isSale = p.discountPrice && p.discountPrice < p.price;
    const discountPercent = isSale && p.discountPrice ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 0;
    
    let sizes = ["S", "M", "L"];
    let colors = ["Black", "Red"];
    try {
      if (p.sizes) sizes = JSON.parse(p.sizes as string);
      if (p.colors) colors = JSON.parse(p.colors as string);
    } catch (e) {}

    const vendorName = p.vendor?.vendorProfile?.businessName || "Femazon Exclusive";

    let images: string[] = [];
    try {
      if (p.images) images = JSON.parse(p.images as string);
    } catch (e) {}

    return {
      id: p.id.toString(),
      name: p.name,
      brand: vendorName, 
      category: p.category || "Dresses",
      subCategory: p.subcategory || "Dresses",
      price: p.discountPrice ? p.discountPrice : p.price,
      originalPrice: p.price,
      discount: discountPercent,
      images: images.length > 0 ? images : (p.image ? [p.image] : []),
      sizes,
      colors,
      rating: 4.5, 
      reviewCount: Math.floor(Math.random() * 200) + 10,
      isTrending: false,
      isNew: false,
      inStock: p.stock > 0,
      createdAt: p.createdAt.toISOString()
    };
  });

  return (
    <div className="min-h-screen bg-white">
      <DressesShopClient 
        initialProducts={formattedProducts} 
        displayTitle={displayTitle} 
        displaySubtitle={displaySubtitle}
      />
    </div>
  );
}
