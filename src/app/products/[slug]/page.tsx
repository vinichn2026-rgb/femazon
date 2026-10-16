import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { ProductDetailClient } from '@/components/shop/ProductDetailClient';
import { PRODUCTS } from '@/data/products';
import { NAGLA_SHOP_PRODUCTS } from '@/data/naglaFashionShop';

export const dynamic = 'force-dynamic';

function getCuratedSimilarProducts(currentProduct: any, dbProducts: any[] = []): any[] {
  const currentId = String(currentProduct.id || '');
  const currentSlug = String(currentProduct.slug || '');
  const cat = (currentProduct.category || '').toLowerCase();
  const subcat = (currentProduct.subcategory || currentProduct.subCategory || '').toLowerCase();
  const name = (currentProduct.name || '').toLowerCase();

  // Combine Nagla boutique products and catalog items
  const catalogList = [
    ...NAGLA_SHOP_PRODUCTS.map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category: p.category,
      subcategory: p.subcategory,
      price: p.discountPrice || p.price,
      discountPrice: p.discountPrice,
      originalPrice: p.price,
      image: p.image,
      images: p.images,
      rating: p.rating,
      reviewCount: p.reviewCount,
      isNew: p.isNew,
      isTrending: p.isTrending,
      deliveryDays: 3,
    })),
    ...PRODUCTS.map(p => ({
      id: p.id,
      slug: (p as any).slug || p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      subcategory: (p as any).subCategory || p.category,
      price: p.price,
      discountPrice: (p as any).discountPrice,
      originalPrice: (p as any).originalPrice,
      image: p.images?.[0] || (p as any).image,
      images: p.images,
      rating: p.rating,
      reviewCount: p.reviewCount,
      isNew: p.isNew,
      isTrending: p.isTrending,
      deliveryDays: (p as any).deliveryDays || 3,
    }))
  ];

  // Scoring function: ensures highly relevant, matching clothing silhouettes are prioritized
  const scoreProduct = (p: any) => {
    if (String(p.id) === currentId || (p.slug && p.slug === currentSlug)) return -1;
    const pCat = (p.category || '').toLowerCase();
    const pSub = (p.subcategory || p.subCategory || '').toLowerCase();
    const pName = (p.name || '').toLowerCase();

    let score = 0;
    // Exact subcategory match (e.g. Printed Kurta Sets with Printed Kurta Sets)
    if (subcat && pSub && (subcat === pSub || subcat.includes(pSub) || pSub.includes(subcat))) {
      score += 12;
    }
    // Category match (e.g. Kurta Sets / Ethnic)
    if (cat && pCat && (cat === pCat || cat.includes(pCat) || pCat.includes(cat))) {
      score += 8;
    }
    // Specific Indian Couture Silhouette keywords
    const keywords = ['kurta', 'kurti', 'anarkali', 'saree', 'lehenga', 'peplum', 'palazzo', 'dress', 'gown', 'chanderi', 'silk', 'printed', 'velvet'];
    for (const kw of keywords) {
      if (name.includes(kw) && pName.includes(kw)) score += 5;
    }
    // Same designer or brand
    if (currentProduct.brand && p.brand && currentProduct.brand.toLowerCase() === p.brand.toLowerCase()) {
      score += 3;
    }
    return score;
  };

  const allCandidates = [...dbProducts, ...catalogList];
  const seen = new Set<string>();
  const scored: { item: any; score: number }[] = [];

  for (const item of allCandidates) {
    const idKey = String(item.id || item.slug);
    if (!idKey || seen.has(idKey)) continue;
    seen.add(idKey);
    const score = scoreProduct(item);
    if (score > 0) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const results = scored.map(s => s.item);

  // If fewer than 8, backfill with top luxury items from the same realm
  if (results.length < 8) {
    for (const item of catalogList) {
      const idKey = String(item.id || item.slug);
      if (!seen.has(idKey) && String(item.id) !== currentId) {
        seen.add(idKey);
        results.push(item);
        if (results.length >= 12) break;
      }
    }
  }

  return results.slice(0, 12);
}

function getCuratedPairedProducts(currentProduct: any, dbJewelry: any[] = []): any[] {
  if (dbJewelry.length >= 4) return dbJewelry.slice(0, 4);

  const curatedJewelry = [
    {
      id: "pair-1",
      name: "Nazaakat - Kundan & Pearl Choker Set with Jhumkis",
      brand: "Nazaakat",
      category: "Jewellery",
      subcategory: "Choker Sets",
      price: 4999,
      discountPrice: 2499,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop"],
      rating: 4.9,
      deliveryDays: 2,
    },
    {
      id: "pair-2",
      name: "Festive Glow - Layered Pearl Choker Necklace",
      brand: "Festive Glow",
      category: "Jewellery",
      subcategory: "Necklaces",
      price: 2499,
      discountPrice: 1499,
      image: "https://images.unsplash.com/photo-1550614000-4b95d4edfa21?q=80&w=800&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1550614000-4b95d4edfa21?q=80&w=800&auto=format&fit=crop"],
      rating: 4.8,
      deliveryDays: 3,
    },
    {
      id: "pair-3",
      name: "Atelier Luxe - Handcrafted Zardozi Embellished Potli",
      brand: "Atelier Luxe",
      category: "Accessories",
      subcategory: "Potlis & Clutches",
      price: 3200,
      discountPrice: 1999,
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=800",
      images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=800"],
      rating: 4.9,
      deliveryDays: 2,
    },
    {
      id: "pair-4",
      name: "Festive Glow - Chunky Gold Plated Hoop & Chaandbali Earrings",
      brand: "Festive Glow",
      category: "Jewellery",
      subcategory: "Earrings",
      price: 999,
      discountPrice: 499,
      image: "https://images.unsplash.com/photo-1610030469983-98e550905b05?q=80&w=800&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1610030469983-98e550905b05?q=80&w=800&auto=format&fit=crop"],
      rating: 4.7,
      deliveryDays: 3,
    }
  ];

  return [...dbJewelry, ...curatedJewelry].slice(0, 4);
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const numId = Number(slug);

  let product: any = null;
  let dbSimilar: any[] = [];
  let dbPaired: any[] = [];

  try {
    product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: slug },
          ...(isNaN(numId) ? [] : [{ id: numId }])
        ],
        approvalStatus: 'APPROVED'
      },
      include: {
        colorVariants: {
          include: {
            images: { orderBy: { displayOrder: 'asc' } },
            sizes: { orderBy: { size: 'asc' } }
          }
        }
      }
    });

    if (product) {
      dbSimilar = await prisma.product.findMany({
        where: {
          id: { not: product.id },
          category: product.category,
          approvalStatus: 'APPROVED'
        },
        take: 8,
        orderBy: { createdAt: 'desc' }
      });

      dbPaired = await prisma.product.findMany({
        where: {
          category: 'Jewellery',
          approvalStatus: 'APPROVED'
        },
        take: 4,
        orderBy: { createdAt: 'desc' }
      });
    }
  } catch (err) {
    console.warn('[ProductDetailPage] DB query error, using fallback catalog:', err);
  }

  // Fallback to rich luxury catalog if not found in DB
  if (!product) {
    const catalogItem = PRODUCTS.find(p => p.id === slug || (p as any).slug === slug) 
      || NAGLA_SHOP_PRODUCTS.find(p => p.id === slug || p.slug === slug);
    
    if (catalogItem) {
      product = {
        id: catalogItem.id,
        slug: (catalogItem as any).slug || catalogItem.id,
        name: catalogItem.name,
        brand: catalogItem.brand,
        category: catalogItem.category,
        subcategory: (catalogItem as any).subcategory || (catalogItem as any).subCategory || catalogItem.category,
        price: catalogItem.price,
        discountPrice: (catalogItem as any).discountPrice || (catalogItem as any).price,
        image: (catalogItem as any).image || catalogItem.images?.[0],
        images: JSON.stringify(catalogItem.images || [(catalogItem as any).image]),
        colorVariants: [],
        sizes: catalogItem.sizes || ['XS', 'S', 'M', 'L', 'XL'],
        colors: catalogItem.colors || [],
        deliveryDays: (catalogItem as any).deliveryDays || 3,
        rating: catalogItem.rating || 4.8,
        reviewCount: catalogItem.reviewCount || 95,
        isNew: catalogItem.isNew || false,
        isTrending: catalogItem.isTrending || true,
        inStock: catalogItem.inStock ?? true,
        description: (catalogItem as any).description || `${catalogItem.name} handcrafted by master artisans.`,
        createdAt: new Date()
      };
    }
  }

  if (!product) {
    notFound();
  }

  // Generate highly suitable related items
  const similarProducts = getCuratedSimilarProducts(product, dbSimilar);
  const bestPairedProducts = getCuratedPairedProducts(product, dbPaired);

  // Check wishlist
  let isWishlisted = false;
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email && typeof product.id === 'number') {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          wishlist: {
            include: {
              items: { where: { productId: product.id } }
            }
          }
        }
      });
      isWishlisted = Boolean(user?.wishlist?.items?.length);
    }
  } catch (err) {
    // Session check safe catch
  }

  return (
    <ProductDetailClient
      product={product}
      similarProducts={similarProducts}
      bestPairedProducts={bestPairedProducts}
      isWishlisted={isWishlisted}
    />
  );
}
