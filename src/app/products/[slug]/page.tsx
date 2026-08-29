import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { ProductDetailClient } from '@/components/shop/ProductDetailClient';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const numId = Number(slug);

  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { slug: slug },
        ...(isNaN(numId) ? [] : [{ id: numId }])
      ],
      approvalStatus: 'APPROVED'
    }
  });

  if (!product) {
    notFound();
  }

  // Fetch similar products in database (Anarkalis, Kurtas, Ethnic)
  const similarProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      approvalStatus: 'APPROVED'
    },
    take: 12,
    orderBy: { createdAt: 'desc' }
  });

  // Fetch best paired jewelry / accessories
  const bestPairedProducts = await prisma.product.findMany({
    where: {
      category: 'Jewellery',
      approvalStatus: 'APPROVED'
    },
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  // Check wishlist
  const session = await getServerSession(authOptions);
  let isWishlisted = false;

  if (session?.user?.email) {
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

  return (
    <ProductDetailClient
      product={product}
      similarProducts={similarProducts}
      bestPairedProducts={bestPairedProducts}
      isWishlisted={isWishlisted}
    />
  );
}

