import type { ProductType } from "@/data/products";
import { getApprovedProducts, type CatalogProduct } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

export type GiftCatalogProduct = ProductType & {
  slug: string;
  vendorName: string;
  sellerLocation?: string;
  occasion?: string;
  description?: string;
};

function parseStringArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function mapCatalogProduct(product: CatalogProduct): GiftCatalogProduct {
  const discountPrice = product.discountPrice && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;
  const images = parseStringArray(product.images);
  if (product.image && !images.includes(product.image)) images.unshift(product.image);

  return {
    id: String(product.id),
    slug: product.slug,
    description: product.description || "",
    occasion: product.occasion || "",
    name: product.name,
    brand: product.brandName || "Femazon Marketplace",
    vendorName: product.brandName || "Femazon Marketplace",
    category: product.category || "Other",
    subCategory: product.subcategory || product.category || "Other",
    price: discountPrice,
    originalPrice: product.price,
    discount: discountPrice < product.price
      ? Math.round(((product.price - discountPrice) / product.price) * 100)
      : 0,
    images,
    sizes: parseStringArray(product.sizes),
    colors: parseStringArray(product.colors),
    rating: 0,
    reviewCount: 0,
    isNew: false,
    isTrending: false,
    inStock: product.stock > 0,
    readyToShip: product.readyToShip,
    deliveryDays: product.deliveryDays ?? undefined,
    flaggedForReview: product.flaggedForReview,
    createdAt: new Date(product.createdAt).toISOString(),
  };
}

export async function getGiftCatalog(): Promise<{
  products: GiftCatalogProduct[];
  error: string | null;
}> {
  let databaseError: string | null = null;
  try {
    const products = await prisma.product.findMany({
      where: {
        approvalStatus: "APPROVED",
        flaggedForReview: false,
      },
      include: {
        vendor: { include: { vendorProfile: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      products: products.map((product) => {
        const averageRating = product.reviews.length > 0
          ? product.reviews.reduce((total, review) => total + review.rating, 0) / product.reviews.length
          : 0;
        const mapped = mapCatalogProduct(product);
        const vendorName = product.vendor?.vendorProfile?.businessName || product.brandName || "Femazon Marketplace";
        const sellerLocation = product.vendor?.vendorProfile?.address || "";
        return {
          ...mapped,
          brand: vendorName,
          vendorName,
          sellerLocation,
          rating: averageRating,
          reviewCount: product.reviews.length,
        };
      }),
      error: null,
    };
  } catch (error) {
    databaseError = error instanceof Error ? error.message : String(error);
    console.error("[GiftCatalog] Failed to load approved products from the database:", databaseError);
  }

  const snapshotProducts = await getApprovedProducts();
  return {
    products: snapshotProducts
      .filter((product) => product.approvalStatus === "APPROVED" && !product.flaggedForReview)
      .map(mapCatalogProduct),
    error: "Showing the available catalog snapshot because the live product directory could not be reached.",
  };
}
