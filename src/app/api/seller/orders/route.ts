import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET orders containing vendor's products
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || user.role !== 'VENDOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Find all order items linked to this vendor's products
    const orderItems = await prisma.orderItem.findMany({
      where: {
        product: {
          vendorId: user.id
        }
      },
      include: {
        product: { select: { name: true, image: true } },
        order: {
          select: {
            status: true,
            createdAt: true,
            shippingName: true,
            shippingCity: true
          }
        }
      },
      orderBy: { order: { createdAt: 'desc' } }
    });

    return NextResponse.json(orderItems);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
