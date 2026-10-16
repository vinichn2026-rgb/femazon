import { NextResponse } from 'next/server';
import { getApprovedProducts } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

const TOP_SEARCHES = [
  { label: 'Corset Lehengas', query: 'Corset Lehengas' },
  { label: 'Kanjeevaram Silk', query: 'Kanjeevaram' },
  { label: 'Anarkali Sets', query: 'Anarkali' },
  { label: 'Indo Western Women', query: 'Indo-Western' },
  { label: 'Pre Draped Saree', query: 'Pre Draped Saree' },
  { label: 'Velvet Lehengas', query: 'Velvet Lehenga' },
  { label: 'Straight Kurti Sets', query: 'Straight Kurta' },
  { label: 'Evening Gowns', query: 'Evening Gowns' },
  { label: 'Bridal Potlis', query: 'Potlis' },
  { label: 'Pure Banarasi Silk', query: 'Banarasi' },
];

let cachedTopResponse: any = null;
let lastTopCacheTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';

    // If query is empty, return Top Searches and curated Top Products (Aza Fashions style)
    if (!q) {
      const now = Date.now();
      if (cachedTopResponse && (now - lastTopCacheTime < CACHE_TTL_MS)) {
        return NextResponse.json(cachedTopResponse);
      }

      const all = await getApprovedProducts();
      const topProductsRaw = all.filter(p => p.image).slice(0, 3);

      const topProducts = topProductsRaw.map((p) => {
        const isSale = p.discountPrice && p.discountPrice < p.price;
        const discountPercent = isSale && p.discountPrice 
          ? Math.round(((p.price - p.discountPrice) / p.price) * 100) 
          : 0;

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          discountPrice: p.discountPrice,
          discountPercent,
          image: p.image || '/images/dress/placeholder.jpg',
          brandName: p.brandName || 'Femazon Luxe',
          category: p.category,
          silhouette: p.silhouette,
          readyToShip: p.readyToShip ?? true,
        };
      });

      const responseData = {
        topSearches: TOP_SEARCHES,
        products: topProducts,
        isSearch: false,
      };

      cachedTopResponse = responseData;
      lastTopCacheTime = Date.now();

      return NextResponse.json(responseData);
    }

    // When query is provided, search across name, category, subcategory, silhouette, occasion
    const lowerQuery = q.toLowerCase();
    const allProducts = await getApprovedProducts();

    const filtered = allProducts.filter((p) => {
      const searchTarget = [
        p.name,
        p.category,
        p.subcategory,
        p.silhouette,
        p.dressType,
        p.occasion,
        p.brandName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchTarget.includes(lowerQuery);
    });

    const products = filtered.slice(0, 3).map((p) => {
      const isSale = p.discountPrice && p.discountPrice < p.price;
      const discountPercent = isSale && p.discountPrice 
        ? Math.round(((p.price - p.discountPrice) / p.price) * 100) 
        : 0;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        discountPrice: p.discountPrice,
        discountPercent,
        image: p.image || '/images/dress/placeholder.jpg',
        brandName: p.brandName || 'Femazon Luxe',
        category: p.category,
        silhouette: p.silhouette,
        readyToShip: p.readyToShip ?? true,
      };
    });

    return NextResponse.json({
      topSearches: TOP_SEARCHES,
      products,
      isSearch: true,
      totalCount: filtered.length,
    });
  } catch (error) {
    console.warn('[API Search Warning]:', error);
    return NextResponse.json({
      topSearches: TOP_SEARCHES,
      products: [],
      isSearch: false,
    });
  }
}
