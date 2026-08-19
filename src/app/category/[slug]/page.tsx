import { prisma } from "@/lib/prisma";
import CategoryClient from "./CategoryClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
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

  // Fetch products (for demo, just fetch all approved if it's a mock category, else filter by name)
  const dbProducts = await prisma.product.findMany({
    where: { 
      approvalStatus: 'APPROVED',
      // If it's a real category, you might filter by: category: category.name
    },
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
