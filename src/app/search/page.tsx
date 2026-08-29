import { prisma } from "@/lib/prisma";
import SearchClient from "./SearchClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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

  // Smart fashion synonym & token mapper
  const lowerQuery = query.toLowerCase().trim();
  
  const normalizeText = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[_-]/g, ' ')
      .replace(/chudidars?|chudidhars?|chudi|salwars?|suits?/g, 'chudi')
      .replace(/kurtas?|kurtis?|tunics?/g, 'kurti')
      .replace(/sarees?|saris?/g, 'saree')
      .replace(/dresses?|gowns?|frocks?/g, 'dress')
      .replace(/co[- ]?ords?|sets?|two[- ]piece/g, 'coord')
      .replace(/tops?|shirts?|blouses?/g, 'top')
      .replace(/jewels?|jewelry|necklaces?|accessories/g, 'accessory')
      .replace(/anarkalis?/g, 'anarkali');
  };

  const normQuery = normalizeText(lowerQuery);
  const tokens = normQuery.split(/\s+/).filter(t => t.length > 1 && !['png', 'jpg', 'jpeg', 'image', 'screenshot', 'file'].includes(t));

  let matchedProducts = dbProducts.filter((p: any) => {
    if (!lowerQuery) return false;
    const combined = `${p.name} ${p.description || ''} ${p.category || ''} ${p.subcategory || ''} ${p.dressType || ''} ${p.occasion || ''}`;
    const normCombined = normalizeText(combined);

    // 1. Direct or normalized query match
    if (combined.toLowerCase().includes(lowerQuery) || normCombined.includes(normQuery)) {
      return true;
    }

    // 2. Token match (e.g. "pink chudi" matches "chudi" / "chudidar")
    if (tokens.length > 0 && tokens.some(t => normCombined.includes(t) || combined.toLowerCase().includes(t))) {
      return true;
    }

    return false;
  });

  // If specific visual search term yielded no matches, fallback to closest category or top approved products
  if (matchedProducts.length === 0 && lowerQuery) {
    if (normQuery.includes('chudi') || normQuery.includes('ethnic') || normQuery.includes('saree') || normQuery.includes('kurti')) {
      matchedProducts = dbProducts.filter((p: any) => 
        (p.category && ['Ethnic', 'Kurtis', 'Dresses'].includes(p.category)) ||
        p.name.toLowerCase().includes('kurti') ||
        p.name.toLowerCase().includes('suit') ||
        p.name.toLowerCase().includes('saree')
      );
    } else if (normQuery.includes('dress') || normQuery.includes('gown')) {
      matchedProducts = dbProducts.filter((p: any) => 
        (p.category && ['Dresses', 'Ethnic'].includes(p.category)) ||
        p.name.toLowerCase().includes('dress') ||
        p.name.toLowerCase().includes('gown')
      );
    } else if (normQuery.includes('coord')) {
      matchedProducts = dbProducts.filter((p: any) => 
        (p.category && ['Co-ords'].includes(p.category)) ||
        p.name.toLowerCase().includes('coord')
      );
    } else if (normQuery.includes('top')) {
      matchedProducts = dbProducts.filter((p: any) => 
        (p.category && ['Tops'].includes(p.category)) ||
        p.name.toLowerCase().includes('top')
      );
    }
  }

  // If still completely empty, show featured collection so real products always display
  if (matchedProducts.length === 0) {
    matchedProducts = dbProducts.slice(0, 8);
  }

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
