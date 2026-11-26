import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { getServerAuthEmail } from '@/lib/auth';
import { VendorProductsClient } from '@/components/vendor/VendorProductsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Products & Approval Status | Femazon Partner Portal',
  description: 'Manage designer fashion listings, track admin approvals, and resubmit rejected items.'
};

export default async function VendorProductsPage() {
  let email = await getServerAuthEmail().catch(() => null);
  if (!email) {
    const session = await getServerSession(authOptions).catch(() => null);
    if (session?.user?.email) {
      email = session.user.email;
    }
  }

  let whereClause: any = {};
  let counts = { all: 0, pending: 0, approved: 0, rejected: 0 };
  let currentVendorId: number | null = null;

  if (email) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { vendorProfile: true }
    });
    if (user && (user.role === 'VENDOR' || user.role === 'ADMIN')) {
      currentVendorId = user.id;
      whereClause = user.role === 'ADMIN' ? {} : { vendorId: user.id };

      const [allCount, pendingCount, approvedCount, rejectedCount] = await Promise.all([
        prisma.product.count({ where: whereClause }),
        prisma.product.count({ where: { ...whereClause, approvalStatus: 'PENDING' } }),
        prisma.product.count({ where: { ...whereClause, approvalStatus: 'APPROVED' } }),
        prisma.product.count({ where: { ...whereClause, approvalStatus: 'REJECTED' } }),
      ]);

      counts = {
        all: allCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount
      };
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
    take: 100
  });

  return (
    <VendorProductsClient
      initialProducts={products}
      initialCounts={counts}
      vendorId={currentVendorId}
    />
  );
}
