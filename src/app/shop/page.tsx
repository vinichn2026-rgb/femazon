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
    include: {
      vendor: {
        include: {
          vendorProfile: true
        }
      }
    },
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

    // Extract Vendor Name
    const vendorName = p.vendor?.vendorProfile?.businessName || "Femazon Exclusive";

    // Handle Image Array safely
    let images: string[] = [];
    try {
      if (p.images) {
        images = JSON.parse(p.images as string);
      }
    } catch (e) {}

    return {
      id: p.id.toString(),
      name: p.name,
      brand: vendorName, 
      vendorName: vendorName,
      price: p.discountPrice ? p.discountPrice : p.price,
      originalPrice: p.price,
      discount: discountPercent,
      category: p.category || "Dresses",
      subCategory: p.category || "Dresses",
      image: p.image || (images.length > 0 ? images[0] : "https://via.placeholder.com/600x800"),
      hoverImage: images.length > 1 ? images[1] : p.image,
      images: images.length > 0 ? images : (p.image ? [p.image] : []),
      rating: 4.5, 
      reviewCount: Math.floor(Math.random() * 200) + 10,
      isTrending: p.category === 'Co-ords' || p.category === 'Kurtis',
      isNew: p.category === 'Tops' || p.category === 'Ethnic',
      inStock: p.stock > 0,
      sizes,
      colors
    };
  });

  const initialCategory = resolvedSearchParams.category || "All";

  // Simulate a Backend API fetching a dynamic banner
  const bannerImage = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop";

  return <ShopClient initialProducts={formattedProducts} initialCategory={initialCategory} initialWishlistIds={wishlistIds} bannerImage={bannerImage} />;
}
