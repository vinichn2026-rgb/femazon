import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { GirlsWearClient, type GirlsWearProduct } from '@/components/shop/GirlsWearClient';

export const metadata: Metadata = {
  title: "Girls' Festive & Occasion Wear | Femazon Kids Luxury",
  description: "Shop designer girls' lehenga cholis, traditional silk pattu pavadais, party frocks, and festive anarkalis for young princesses on Femazon.",
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

export default async function GirlsWearPage() {
  let products: GirlsWearProduct[] = [];

  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        approvalStatus: 'APPROVED',
        flaggedForReview: false,
        OR: [
          { category: { equals: "Girls' Wear", mode: 'insensitive' } },
          { category: { contains: "Girls", mode: 'insensitive' } },
          { subcategory: { contains: "Girls", mode: 'insensitive' } },
          { name: { contains: "Girls", mode: 'insensitive' } },
          { name: { contains: "Pavadai", mode: 'insensitive' } },
          { name: { contains: "Frock", mode: 'insensitive' } },
        ]
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
      products = dbProducts.map((p) => {
        const rawImages = parseStringArray(p.images);
        const primaryImage = p.image || rawImages[0] || "/images/dress/placeholder.jpg";
        const images = rawImages.length > 0 ? [primaryImage, ...rawImages.filter(img => img !== primaryImage)] : [primaryImage];
        const originalPrice = p.price;
        const discountPrice = p.discountPrice && p.discountPrice < originalPrice ? p.discountPrice : originalPrice;
        const discount = originalPrice > 0 ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100) : 0;
        
        const avgRating = p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 4.9;

        const vendorBusinessName = p.vendor?.vendorProfile?.businessName || p.brandName || p.vendor?.name || "Little Diva Couture";

        return {
          id: String(p.id),
          name: p.name,
          slug: p.slug,
          brand: p.brandName || vendorBusinessName,
          vendorName: vendorBusinessName,
          category: p.category || "Girls' Wear",
          subcategory: p.subcategory || undefined,
          price: discountPrice,
          originalPrice,
          discount,
          images,
          sizes: parseStringArray(p.sizes),
          colors: parseStringArray(p.colors),
          rating: avgRating,
          reviewCount: p.reviews.length || 8,
          isNew: true,
          readyToShip: p.readyToShip ?? true,
          deliveryDays: p.deliveryDays,
          occasion: p.occasion || "Festive & Wedding",
          createdAt: new Date(p.createdAt).toISOString(),
        };
      });
    }
  } catch (error) {
    console.warn("[GirlsWearPage] Database query warning:", error);
  }

  return <GirlsWearClient initialProducts={products} />;
}
