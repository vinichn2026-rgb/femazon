import { prisma } from "@/lib/prisma";
import CategoryClient from "./CategoryClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  // Try to find the category in the DB
  let category = await prisma.category.findUnique({
    where: { slug }
  });

  // If not found in DB, we'll mock it for the sake of the demo (e.g. for "women")
  if (!category) {
    category = {
      id: 999,
      name: slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " "),
      slug: slug,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop",
      description: `Explore the latest trends in ${slug.charAt(0).toUpperCase() + slug.slice(1)}.`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

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

  // Map category slug to matching product category names
  const categoryFilters: Record<string, string[]> = {
    'sarees': ['Sarees'],
    'lehengas': ['Lehengas'],
    'kurta-sets': ['Kurta Sets'],
    'dresses': ['Dresses'],
    'gowns': ['Gowns'],
    'co-ord-sets': ['Co-ord Sets'],
    'indo-western': ['Indo-Western'],
    'tops': ['Tops', 'Tops & Tunics'],
    'jewellery': ['Jewellery'],
    'handbags': ['Handbags'],
    'potlis': ['Potlis'],
    'footwear': ['Footwear'],
    'shawls': ['Shawls'],
    'accessories': ['Accessories', 'Belts', 'Hair Accessories', 'Stoles & Scarves'],
  };

  const matchingCategories = categoryFilters[slug.toLowerCase()] || (category?.name ? [category.name] : []);

  const whereClause: any = {
    approvalStatus: 'APPROVED',
  };
  if (matchingCategories.length > 0) {
    whereClause.category = { in: matchingCategories };
  }

  // Fetch products matching the selected category
  const dbProducts = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  });

  const formattedProducts = dbProducts.map((p: any) => {
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
    <CategoryClient 
      category={category} 
      initialProducts={formattedProducts} 
      initialWishlistIds={wishlistIds} 
    />
  );
}
