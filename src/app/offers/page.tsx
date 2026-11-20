import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getApprovedProducts } from '@/lib/catalog';
import { OffersClient, type OfferProduct } from './OffersClient';

export const metadata: Metadata = {
  title: "Special Offers & Boutique Sales | Femazon Luxe",
  description: "Shop exclusive promotional discounts, seasonal sales, and boutique markdowns across luxury women's fashion, beauty, and gifts.",
};

export const dynamic = "force-dynamic";

function parseStringArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    // Comma-separated fallback
  }
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

export default async function OffersPage() {
  let products: OfferProduct[] = [];

  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        approvalStatus: 'APPROVED',
        flaggedForReview: false,
        discountPrice: {
          not: null,
        }
      },
      include: {
        vendor: {
          select: {
            name: true,
            vendorProfile: {
              select: { businessName: true }
            }
          }
        },
        reviews: {
          select: { rating: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    if (dbProducts && dbProducts.length > 0) {
      products = dbProducts
        .filter(p => p.discountPrice && p.discountPrice < p.price)
        .map((p) => {
          const rawImages = parseStringArray(p.images);
          const primaryImage = p.image || rawImages[0] || "/images/dress/placeholder.jpg";
          const images = rawImages.length > 0 ? [primaryImage, ...rawImages.filter(img => img !== primaryImage)] : [primaryImage];
          const originalPrice = p.price;
          const discountPrice = p.discountPrice!;
          const discount = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
          
          const avgRating = p.reviews.length > 0
            ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
            : 4.8;

          const vendorBusinessName = p.vendor?.vendorProfile?.businessName || p.brandName || p.vendor?.name || "Femazon Luxe";

          return {
            id: String(p.id),
            name: p.name,
            slug: p.slug,
            brand: p.brandName || vendorBusinessName,
            vendorName: vendorBusinessName,
            category: p.category || "Women's Wear",
            subcategory: p.subcategory || undefined,
            price: discountPrice,
            originalPrice,
            discount,
            images,
            sizes: parseStringArray(p.sizes),
            colors: parseStringArray(p.colors),
            rating: avgRating,
            reviewCount: p.reviews.length || 10,
            isNew: true,
            readyToShip: p.readyToShip ?? true,
            createdAt: new Date(p.createdAt).toISOString(),
          };
        });
    }
  } catch (error) {
    console.warn("[OffersPage] Database query warning:", error);
  }

  // Fallback to catalog snapshot items that have discounts
  if (products.length === 0) {
    const fallbackList = await getApprovedProducts();
    products = fallbackList
      .filter(p => p.discountPrice && p.discountPrice < p.price)
      .map((p) => {
        const rawImages = parseStringArray(p.images);
        const primaryImage = p.image || rawImages[0] || "/images/dress/placeholder.jpg";
        const images = rawImages.length > 0 ? [primaryImage, ...rawImages.filter(img => img !== primaryImage)] : [primaryImage];
        const originalPrice = p.price;
        const discountPrice = p.discountPrice!;
        const discount = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);

        return {
          id: String(p.id),
          name: p.name,
          slug: p.slug,
          brand: p.brandName || "Femazon Luxe",
          vendorName: p.brandName || "Femazon Luxe",
          category: p.category || "Women's Wear",
          subcategory: p.subcategory || undefined,
          price: discountPrice,
          originalPrice,
          discount,
          images,
          sizes: parseStringArray(p.sizes),
          colors: parseStringArray(p.colors),
          rating: 4.8,
          reviewCount: 15,
          isNew: true,
          readyToShip: p.readyToShip ?? true,
          createdAt: new Date(p.createdAt).toISOString(),
        };
      });
  }

  return <OffersClient initialProducts={products} />;
}
