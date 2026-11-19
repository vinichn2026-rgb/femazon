import { WomensWearClient } from "@/components/shop/WomensWearClient";
import { WOMENS_WEAR_CATEGORIES, type WomensWearProduct } from "@/data/womensWearData";
import { getApprovedProducts } from "@/lib/catalog";
import { getApprovedPartnerDirectory } from "@/lib/partnerDirectory";
import { prisma } from "@/lib/prisma";
import type { PartnerDirectoryListing } from "@/lib/partnerDirectory";

export const metadata = {
  title: "Women's Wear & Boutique Collections | Femazon",
  description: "Shop curated women's clothing across 14 categories: Sarees, Kurtis, Salwar Suits, Lehengas, Western Wear, Dresses, Tops, Co-ord Sets, Blouses, Bottom Wear, Nightwear, Maternity, Plus Size & Activewear directly from verified boutique owners.",
};
export const dynamic = "force-dynamic";

function parseStringArray(value: string | null): string[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    // Product variants may also be stored as comma-separated values.
  }

  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

interface WomensWearProductSource {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  image: string | null;
  images: string | null;
  category: string | null;
  subcategory: string | null;
  silhouette: string | null;
  flaggedForReview: boolean;
  stock: number;
  sizes: string | null;
  colors: string | null;
  approvalStatus: string;
  readyToShip: boolean;
  deliveryDays: number | null;
  brandName: string | null;
  fabricCare?: string | null;
  packageContains?: string | null;
  vendorId?: number | null;
  createdAt: Date | string;
  rating?: number | null;
  reviewCount?: number;
  vendor?: {
    name: string | null;
    vendorProfile: { businessName: string } | null;
  } | null;
}

function mapProducts(products: WomensWearProductSource[]): WomensWearProduct[] {
  return products.map((product) => {
    const images = parseStringArray(product.images);
    const primaryImage = product.image || images[0] || "/images/dress/placeholder.jpg";
    const originalPrice = product.price;
    const price =
      product.discountPrice && product.discountPrice < originalPrice
        ? product.discountPrice
        : originalPrice;
    const reviewCount = product.reviewCount || 0;
    const createdTime = new Date(product.createdAt).getTime();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const isNew = Number.isFinite(createdTime) ? createdTime >= thirtyDaysAgo : false;
    const isTrending = reviewCount >= 3 || (product.rating ?? 0) >= 4.5;

    return {
      id: String(product.id),
      name: product.name,
      slug: product.slug,
      brand: product.vendor?.vendorProfile?.businessName || product.brandName || product.vendor?.name || "Femazon",
      vendorName: product.vendor?.vendorProfile?.businessName || product.brandName || product.vendor?.name || "Femazon",
      vendorId: product.vendorId ?? undefined,
      category: product.category || "Women's Wear",
      subCategory: product.subcategory || product.category || "Women's Wear",
      price,
      originalPrice,
      discount: originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
      images: [primaryImage, ...images.filter((image) => image !== primaryImage)],
      sizes: parseStringArray(product.sizes),
      colors: parseStringArray(product.colors),
      rating: product.rating || 0,
      reviewCount,
      isNew,
      isTrending,
      inStock: product.stock > 0,
      readyToShip: product.readyToShip,
      deliveryDays: product.deliveryDays ?? undefined,
      fabric: product.subcategory || product.category || "Women's Wear",
      silhouette: product.silhouette || undefined,
      createdAt: product.createdAt instanceof Date
        ? product.createdAt.toISOString()
        : product.createdAt,
      fabricCare: product.fabricCare || undefined,
      description: product.description || "",
      packageContains: product.packageContains || undefined,
    };
  });
}

export default async function WomensWearPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; q?: string; sub?: string }>;
}) {
  const resolved = (await searchParams) || {};
  let boutiques: PartnerDirectoryListing[] = [];
  let boutiqueDirectoryError: string | null = null;
  try {
    boutiques = await getApprovedPartnerDirectory({ type: "SELLER" });
  } catch (error) {
    console.warn("[WomensWearPage] Boutique directory using fallback:", error instanceof Error ? error.message : String(error));
    boutiqueDirectoryError = "Boutique listings are temporarily unavailable. Please try again later.";
  }
  const productCategories = [
    ...WOMENS_WEAR_CATEGORIES.map((category) => category.name),
    "Kurtis",
    "Kurta Sets",
    "Western Wear",
    "Tops",
    "Bottom Wear",
    "Nightwear",
    "Blouses",
    "Gowns",
    "Indo-Western",
    "Accessories",
    "Potlis",
    "Maternity Wear",
    "Plus Size Fashion",
    "Activewear",
  ];
  let products: WomensWearProductSource[];
  try {
    const databaseProducts = await prisma.product.findMany({
      where: {
        approvalStatus: "APPROVED",
        flaggedForReview: false,
        category: { in: productCategories, mode: "insensitive" },
      },
      include: {
        vendor: {
          select: {
            name: true,
            vendorProfile: { select: { businessName: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    const reviewStats = await prisma.review.groupBy({
      by: ["productId"],
      where: { productId: { in: databaseProducts.map((product) => product.id) } },
      _avg: { rating: true },
      _count: { _all: true },
    });
    const reviewStatsByProductId = new Map(
      reviewStats.map((stats) => [
        stats.productId,
        { rating: stats._avg.rating, reviewCount: stats._count._all },
      ])
    );
    products = databaseProducts.map((product) => ({
      ...product,
      ...reviewStatsByProductId.get(product.id),
    }));
  } catch (error) {
    console.warn(
      "[WomensWearPage] Database query failed; using the approved catalog snapshot:",
      error instanceof Error ? error.message : error
    );
    const categoryNames = new Set(productCategories.map((category) => category.toLowerCase()));
    products = (await getApprovedProducts()).filter((product) =>
      product.approvalStatus === "APPROVED" &&
      !product.flaggedForReview &&
      product.category !== null &&
      categoryNames.has(product.category.toLowerCase())
    );
  }
  const initialProducts = mapProducts(products);

  return (
    <WomensWearClient 
      key={`${resolved.category || "All"}:${resolved.q || ""}:${resolved.sub || ""}`}
      initialProducts={initialProducts}
      boutiques={boutiques}
      boutiqueDirectoryError={boutiqueDirectoryError}
      initialCategory={resolved.category || "All"} 
      initialSearch={resolved.q || ""} 
      initialSubCategory={resolved.sub}
    />
  );
}
