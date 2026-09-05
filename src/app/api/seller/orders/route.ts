import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';
import { getSessionFromCookie } from '@/lib/auth';

async function getVendorUser(request: Request) {
  let userEmail: string | undefined;
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      userEmail = session.user.email;
    }
  } catch {}

  if (!userEmail) {
    const payload = getSessionFromCookie(request.headers.get('cookie') || undefined);
    if (payload?.email) {
      userEmail = payload.email;
    }
  }

  if (!userEmail) return null;

  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user || user.role !== 'VENDOR') return null;

  return user;
}

// GET orders containing vendor's products
export async function GET(request: Request) {
  try {
    const user = await getVendorUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized or not a vendor' }, { status: 401 });

    // Find all order items linked to this vendor's products
    const orderItems = await prisma.orderItem.findMany({
      where: {
        product: {
          vendorId: user.id
        }
      },
      include: {
        product: { select: { id: true, name: true, image: true, price: true } },
        order: {
          select: {
            id: true,
            status: true,
            total: true,
            createdAt: true,
            shippingName: true,
            shippingPhone: true,
            shippingAddr: true,
            shippingCity: true,
            paymentMethod: true
          }
        }
      },
      orderBy: { order: { createdAt: 'desc' } }
    });

    // Group items by order for standard presentation
    const ordersMap = new Map<number, any>();
    orderItems.forEach(item => {
      const ord = item.order;
      if (!ordersMap.has(ord.id)) {
        ordersMap.set(ord.id, {
          id: ord.id,
          status: ord.status,
          total: ord.total,
          createdAt: ord.createdAt,
          shippingName: ord.shippingName,
          shippingPhone: ord.shippingPhone,
          shippingAddr: ord.shippingAddr,
          shippingCity: ord.shippingCity,
          paymentMethod: ord.paymentMethod,
          items: []
        });
      }
      ordersMap.get(ord.id).items.push({
        id: item.id,
        product: item.product,
        price: item.price,
        quantity: item.quantity,
        size: item.size
      });
    });

    return NextResponse.json(Array.from(ordersMap.values()));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
