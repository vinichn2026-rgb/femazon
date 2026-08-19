import { prisma } from "@/lib/prisma";
import SearchClient from "./SearchClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || "";

  // Fetch session to get wishlist
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
      wishlistIds = user.wishlist.items.map((item: any) => item.productId);
    }
  }

  // Fetch products matching query (case-insensitive in sqlite can be tricky, so we'll fetch approved and filter here or use basic contains if supported)
  const dbProducts = await prisma.product.findMany({
    where: { 
      approvalStatus: 'APPROVED'
    },
    orderBy: { createdAt: 'desc' }
  });

  // Filter in memory for simplicity with SQLite
  const lowerQuery = query.toLowerCase();
  const matchedProducts = dbProducts.filter((p: any) => {
    if (!lowerQuery) return false;
    return (
      p.name.toLowerCase().includes(lowerQuery) ||
      (p.description && p.description.toLowerCase().includes(lowerQuery)) ||
      (p.category && p.category.toLowerCase().includes(lowerQuery)) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(lowerQuery))
    );
  });

  const formattedProducts = matchedProducts.map((p: any) => {
    const isSale = p.discountPrice && p.discountPrice < p.price;
    const discountPercent = isSale && p.discountPrice ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 0;
    
    let sizes = ["S", "M", "L"];
    let colors = ["Black", "Red"];
    try {
      if (p.sizes) sizes = JSON.parse(p.sizes as string);
      if (p.colors) colors = JSON.parse(p.colors as string);
    } catch (e) {}

    return {
      id: p.id.toString(),
      name: p.name,
      brand: "Femazon", 
      price: p.discountPrice ? p.discountPrice : p.price,
      originalPrice: p.price,
      discount: discountPercent,
      category: p.category || "Dresses",
      subCategory: p.category || "Dresses", 
      image: p.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
      hoverImage: p.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
      rating: 4.5,
      reviewCount: Math.floor(Math.random() * 200) + 10,
      isTrending: Math.random() > 0.5,
      isNew: true,
      inStock: p.stock > 0,
      sizes,
      colors
    };
  });

  return (
    <SearchClient 
      query={query} 
      initialProducts={formattedProducts} 
      initialWishlistIds={wishlistIds} 
    />
  );
}
