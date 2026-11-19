import { NextResponse } from 'next/server';
import { getApprovedProducts } from '@/lib/catalog';
import { getApprovedPartnerDirectory, type PartnerDirectoryListing } from '@/lib/partnerDirectory';
import { prisma } from '@/lib/prisma';

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

interface SearchProductResult {
  id: number;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  discountPercent: number;
  image: string;
  brandName: string;
  category: string | null;
  silhouette: string | null;
  readyToShip: boolean;
}

interface SearchResponse {
  topSearches: typeof TOP_SEARCHES;
  products: SearchProductResult[];
  services?: {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    basePrice: number;
    image: string;
    providers: { id: number; name: string; rating: number; reviewCount: number }[];
  }[];
  partners?: PartnerDirectoryListing[];
  serviceError?: string | null;
  partnerError?: string | null;
  isSearch: boolean;
  totalCount?: number;
}

let cachedTopResponse: SearchResponse | null = null;
let lastTopCacheTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim().slice(0, 120) || '';

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
        services: [],
        partners: [],
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

    let matchingServices: {
      id: number;
      slug: string;
      name: string;
      description: string | null;
      basePrice: number;
      image: string | null;
      providers: { id: number; name: string; rating: number; reviewCount: number }[];
    }[] = [];
    let serviceError: string | null = null;
    let matchingPartners: PartnerDirectoryListing[] = [];
    let partnerError: string | null = null;
    try {
      matchingServices = await prisma.service.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { slug: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            {
              providers: {
                some: {
                  OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { bio: { contains: q, mode: 'insensitive' } },
                  ],
                },
              },
            },
          ],
        },
        include: {
          providers: {
            orderBy: { rating: 'desc' },
            take: 2,
            select: { id: true, name: true, rating: true, reviewCount: true },
          },
        },
        orderBy: { name: 'asc' },
        take: 4,
      });
    } catch (error) {
      serviceError = 'Service search is temporarily unavailable.';
      console.error('[API Search] Service search failed:', error);
    }
    try {
      matchingPartners = await getApprovedPartnerDirectory({ query: q });
    } catch (error) {
      partnerError = 'Boutique and professional search is temporarily unavailable.';
      console.error('[API Search] Partner search failed:', error);
    }

    return NextResponse.json({
      topSearches: TOP_SEARCHES,
      products,
      services: matchingServices.map((service) => ({
        id: service.id,
        slug: service.slug,
        name: service.name,
        description: service.description,
        basePrice: service.basePrice,
        image: service.image || '/femazon-emblem.png',
        providers: service.providers,
      })),
      partners: matchingPartners,
      serviceError,
      partnerError,
      isSearch: true,
      totalCount: filtered.length,
    });
  } catch (error) {
    console.error('[API Search Error]:', error);
    return NextResponse.json({ error: 'Search is temporarily unavailable.' }, { status: 500 });
  }
}
