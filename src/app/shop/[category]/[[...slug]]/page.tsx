import React from 'react';
import { prisma } from '@/lib/prisma';
import { getApprovedProducts } from '@/lib/catalog';
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

  // Query database with fallback
  let dbProducts: any[] = [];
  try {
    dbProducts = await prisma.product.findMany({
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
  } catch (err) {
    console.warn('[CategoryShopPage] DB query error, using fallback catalog:', err);
  }

  if (!dbProducts || dbProducts.length === 0) {
    const all = await getApprovedProducts();
    const filtered = all.filter(p => 
      p.category?.toLowerCase() === formattedCategory.toLowerCase() ||
      p.subcategory?.toLowerCase() === querySubCategory.toLowerCase()
    );
    dbProducts = filtered.length > 0 ? filtered : all;
  }

  const formattedProducts = dbProducts.map(p => {
    const isSale = p.discountPrice && p.discountPrice < p.price;
    const discountPercent = isSale && p.discountPrice ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 0;
    
    let sizes = ["S", "M", "L"];
    let colors = ["Black", "Red"];
    try {
      if (p.sizes) sizes = typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes;
      if (p.colors) colors = typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors;
    } catch (e) {}

    const vendorName = p.vendor?.vendorProfile?.businessName || p.brandName || "Femazon Exclusive";

    let images: string[] = [];
    try {
      if (p.images) images = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
    } catch (e) {}

    return {
      id: p.id.toString(),
      name: p.name,
      brand: vendorName, 
      category: p.category || "Dresses",
      subCategory: p.subcategory || p.category || "Dresses",
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
      createdAt: p.createdAt ? (typeof p.createdAt === 'string' ? p.createdAt : (p.createdAt.toISOString ? p.createdAt.toISOString() : new Date(p.createdAt).toISOString())) : new Date().toISOString()
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
