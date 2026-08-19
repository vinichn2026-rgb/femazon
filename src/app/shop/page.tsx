import { prisma } from '@/lib/prisma';
import { ShopClient } from '@/components/shop/ShopClient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const resolvedSearchParams = await searchParams;
  
  // Fetch session and wishlist
  const session = await getServerSession(authOptions);
  let wishlistIds: number[] = [];
  
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        wishlist: { include: { items: true } }
      }
    });
    if (user?.wishlist) {
      wishlistIds = user.wishlist.items.map(item => item.productId);
    }
  }

  const dbProducts = await prisma.product.findMany({
    where: { approvalStatus: 'APPROVED' },
    orderBy: { createdAt: 'desc' }
  });

  // Map Database format to the format required by the Frontend ProductCard component
  const formattedProducts = dbProducts.map(p => {
    const isSale = p.discountPrice && p.discountPrice < p.price;
    const discountPercent = isSale && p.discountPrice ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 0;
    
    // Attempt to parse sizes and colors if they were stored as JSON strings
    let sizes = ["S", "M", "L"];
    let colors = ["Black", "Red"];
    try {
      if (p.sizes) sizes = JSON.parse(p.sizes as string);
      if (p.colors) colors = JSON.parse(p.colors as string);
    } catch (e) {
      // Ignore parse errors and use fallback
    }

    return {
      id: p.id.toString(),
      name: p.name,
      brand: "Femazon", // Mock for now until Brand is added to schema
      price: p.discountPrice ? p.discountPrice : p.price,
      originalPrice: p.price,
      discount: discountPercent,
      category: p.category || "Dresses",
      subCategory: p.category || "Dresses", // Mock subcategory
      image: p.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
      hoverImage: p.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
      rating: 4.5, // Mock rating
      reviewCount: Math.floor(Math.random() * 200) + 10,
      isTrending: true,
      isNew: true,
      inStock: p.stock > 0,
      sizes,
      colors
    };
  });

  const initialCategory = resolvedSearchParams.category || "All";

  return <ShopClient initialProducts={formattedProducts} initialCategory={initialCategory} initialWishlistIds={wishlistIds} />;
}
