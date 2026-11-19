import { BeautyMarketplaceClient } from '@/components/beauty/BeautyMarketplaceClient';
import { getApprovedProducts } from '@/lib/catalog';
import { getMarketplaceProfessionals, MARKETPLACE_CATEGORIES } from '@/lib/marketplaceServices';
import { BEAUTY_PRODUCT_SUBCATEGORIES } from '@/data/marketplaceData';
import type { ProductType } from '@/data/products';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Beauty & Self-care | Femazon Women’s Marketplace',
  description: 'Discover beauty products (skincare, haircare, makeup, bath & body, hygiene, tools) and book verified beauty professionals separately on Femazon.',
};
export const dynamic = 'force-dynamic';

function parseStringArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string');
    }
  } catch {
    // Fallback to comma-separated string
  }
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export default async function BeautyPage({
  searchParams,
}: {
  searchParams?: Promise<{ sub?: string; view?: string }>;
}) {
  const resolved = (await searchParams) || {};
  const category = MARKETPLACE_CATEGORIES['beauty'];
  const { professionals, error } = await getMarketplaceProfessionals(category);

  const beautyCategoryNames = [
    ...BEAUTY_PRODUCT_SUBCATEGORIES.map((c) => c.name),
    'Beauty Products',
    'Beauty & Cosmetics',
    'Beauty',
  ];

  let beautyProducts: ProductType[] = [];
  let productError: string | null = null;

  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        approvalStatus: 'APPROVED',
        flaggedForReview: false,
        category: { in: beautyCategoryNames, mode: 'insensitive' },
      },
      include: {
        vendor: {
          select: {
            name: true,
            vendorProfile: { select: { businessName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const reviewStats = await prisma.review.groupBy({
      by: ['productId'],
      where: { productId: { in: dbProducts.map((p) => p.id) } },
      _avg: { rating: true },
      _count: { _all: true },
    });
    const reviewMap = new Map(
      reviewStats.map((r) => [r.productId, { rating: r._avg.rating || 0, count: r._count._all }])
    );

    beautyProducts = dbProducts.map((p) => {
      const images = parseStringArray(p.images);
      const primary = p.image || images[0] || '/images/dress/placeholder.jpg';
      const originalPrice = p.price;
      const price = p.discountPrice && p.discountPrice < originalPrice ? p.discountPrice : originalPrice;
      const stats = reviewMap.get(p.id);
      const reviewCount = stats?.count || 0;

      return {
        id: String(p.id),
        name: p.name,
        slug: p.slug,
        brand: p.vendor?.vendorProfile?.businessName || p.brandName || p.vendor?.name || 'Femazon',
        category: p.category || 'Beauty',
        subCategory: p.subcategory || p.category || 'Beauty',
        price,
        originalPrice,
        discount: originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
        images: [primary, ...images.filter((img) => img !== primary)],
        sizes: parseStringArray(p.sizes),
        colors: parseStringArray(p.colors),
        rating: stats?.rating || 0,
        reviewCount,
        isNew: Date.now() - new Date(p.createdAt).getTime() <= 30 * 24 * 60 * 60 * 1000,
        isTrending: reviewCount >= 3,
        inStock: p.stock > 0,
        readyToShip: p.readyToShip,
        deliveryDays: p.deliveryDays ?? undefined,
        createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
      };
    });
  } catch (err) {
    console.warn('[BeautyPage] Failed to load beauty products from DB; trying snapshot:', err instanceof Error ? err.message : err);
    try {
      const names = new Set(beautyCategoryNames.map((n) => n.toLowerCase()));
      const fallback = (await getApprovedProducts()).filter(
        (p) => p.approvalStatus === 'APPROVED' && !p.flaggedForReview && p.category && names.has(p.category.toLowerCase())
      );
      beautyProducts = fallback.map((p) => {
        const images = parseStringArray(p.images);
        const primary = p.image || images[0] || '/images/dress/placeholder.jpg';
        const price = p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
        return {
          id: String(p.id),
          name: p.name,
          slug: p.slug,
          brand: p.brandName || 'Femazon',
          category: p.category || 'Beauty',
          subCategory: p.subcategory || p.category || 'Beauty',
          price,
          originalPrice: p.price,
          discount: p.price > 0 ? Math.round(((p.price - price) / p.price) * 100) : 0,
          images: [primary, ...images.filter((img) => img !== primary)],
          sizes: parseStringArray(p.sizes),
          colors: parseStringArray(p.colors),
          rating: 0,
          reviewCount: 0,
          isNew: false,
          isTrending: false,
          inStock: p.stock > 0,
          readyToShip: p.readyToShip,
          deliveryDays: p.deliveryDays ?? undefined,
          createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt || ''),
        };
      });
    } catch {
      productError = 'Beauty products are temporarily unavailable. Please try again later.';
    }
  }

  const initialView = resolved.view === 'products' ? 'products' : 'professionals';

  return (
    <BeautyMarketplaceClient
      category={category}
      professionals={professionals}
      beautyProducts={beautyProducts}
      directoryError={error}
      productError={productError}
      initialView={initialView}
      initialSubcategory={resolved.sub}
    />
  );
}
