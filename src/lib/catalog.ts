import catalogSnapshot from '@/data/catalog-snapshot.json';
import { prisma } from './prisma';

export interface CatalogProduct {
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
  dressType: string | null;
  occasion: string | null;
  silhouette: string | null;
  flaggedForReview: boolean;
  stock: number;
  sizes: string | null;
  colors: string | null;
  approvalStatus: string;
  readyToShip: boolean;
  deliveryDays: number | null;
  brandName: string | null;
  createdAt: Date;
}

export interface FormattedShopProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  vendorName: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  subCategory: string;
  silhouette: string;
  flaggedForReview: boolean;
  occasion?: string;
  image: string;
  hoverImage: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isTrending: boolean;
  isNew: boolean;
  inStock: boolean;
  readyToShip: boolean;
  deliveryDays: number | null;
  sizes: string[];
  colors: string[];
}

interface GlobalCatalogState {
  rawCache?: CatalogProduct[];
  formattedCache?: FormattedShopProduct[];
  lastSyncTime?: number;
  isSyncing?: boolean;
}

const globalForCatalog = globalThis as unknown as {
  __femazon_catalog_state__?: GlobalCatalogState;
};

if (!globalForCatalog.__femazon_catalog_state__) {
  globalForCatalog.__femazon_catalog_state__ = {};
}

const state = globalForCatalog.__femazon_catalog_state__;

function loadLocalSnapshot(): CatalogProduct[] {
  return catalogSnapshot as unknown as CatalogProduct[];
}

// Ensure cache is pre-seeded synchronously from bundled snapshot
if (!state.rawCache || state.rawCache.length === 0) {
  state.rawCache = loadLocalSnapshot();
  state.lastSyncTime = Date.now();
}

function formatCatalog(products: CatalogProduct[]): FormattedShopProduct[] {
  return products.map((p) => {
    const isSale = p.discountPrice && p.discountPrice < p.price;
    const discountPercent = isSale && p.discountPrice 
      ? Math.round(((p.price - p.discountPrice) / p.price) * 100) 
      : 0;

    let sizes = ["S", "M", "L"];
    let colors = ["Black", "Red"];
    try {
      if (p.sizes) sizes = JSON.parse(p.sizes);
      if (p.colors) colors = JSON.parse(p.colors);
    } catch {}

    const brandName = p.brandName || "Femazon Luxe";

    let images: string[] = [];
    try {
      if (p.images) images = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
    } catch {}

    const primaryImage = p.image || (images.length > 0 ? images[0] : "/images/dress/placeholder.jpg");
    const hoverImage = images.length > 1 ? images[1] : primaryImage;

    return {
      id: p.id.toString(),
      slug: p.slug,
      name: p.name,
      brand: brandName,
      vendorName: brandName,
      price: p.discountPrice ? p.discountPrice : p.price,
      originalPrice: p.price,
      discount: discountPercent,
      category: p.category || "Dresses",
      subCategory: p.subcategory || p.category || "Dresses",
      silhouette: p.silhouette || p.dressType || "Straight",
      flaggedForReview: p.flaggedForReview || false,
      occasion: p.occasion || undefined,
      image: primaryImage,
      hoverImage,
      images: images.length > 0 ? images : [primaryImage],
      rating: 4.8,
      reviewCount: 48,
      isTrending: p.category === 'Co-ord Sets' || p.category === 'Kurta Sets',
      isNew: p.category === 'Tops' || p.category === 'Sarees',
      inStock: p.stock > 0,
      readyToShip: p.readyToShip ?? true,
      deliveryDays: p.deliveryDays,
      sizes,
      colors,
    };
  });
}

// Background revalidation (stale-while-revalidate pattern)
async function revalidateCatalogInBackground() {
  if (state.isSyncing) return;
  state.isSyncing = true;

  try {
    const products = await prisma.product.findMany({
      where: {
        approvalStatus: 'APPROVED',
        flaggedForReview: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (products && products.length > 0) {
      state.rawCache = products as CatalogProduct[];
      state.formattedCache = formatCatalog(state.rawCache);
      state.lastSyncTime = Date.now();
    }
  } catch (err) {
    console.warn('[Background Catalog Sync Warning]:', err);
  } finally {
    state.isSyncing = false;
  }
}

export async function getApprovedProducts(): Promise<CatalogProduct[]> {
  if (!state.rawCache || state.rawCache.length === 0) {
    state.rawCache = loadLocalSnapshot();
    state.formattedCache = formatCatalog(state.rawCache);
    state.lastSyncTime = Date.now();
  }

  return state.rawCache || [];
}

export async function getFormattedShopProducts(): Promise<FormattedShopProduct[]> {
  if (state.formattedCache && state.formattedCache.length > 0) {
    return state.formattedCache;
  }

  const raw = await getApprovedProducts();
  state.formattedCache = formatCatalog(raw);
  return state.formattedCache;
}

export function invalidateCatalogCache() {
  if (state) {
    state.rawCache = undefined;
    state.formattedCache = undefined;
    state.lastSyncTime = 0;
  }
  revalidateCatalogInBackground();
}
