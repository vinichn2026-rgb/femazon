import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { VendorProductsClient } from '@/components/vendor/VendorProductsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Ready-to-Ship Products & Color Variants | Femazon Partner Portal',
  description: 'Manage luxury apparel listings with dedicated color galleries and size inventories.'
};

export default async function VendorProductsPage() {
  const session = await getServerSession(authOptions);

  let whereClause: any = {};
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    if (user && user.role === 'VENDOR') {
      whereClause = { vendorId: user.id };
    }
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      colorVariants: {
        include: {
          images: { orderBy: { displayOrder: 'asc' } },
          sizes: { orderBy: { size: 'asc' } }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return <VendorProductsClient initialProducts={products} />;
}
