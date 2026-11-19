import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVendorUser } from '@/lib/vendorAuth';

type VendorOrder = {
  id: number;
  status: string;
  total: number;
  createdAt: Date;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingAddr: string | null;
  shippingCity: string | null;
  paymentMethod: string;
  items: Array<{
    id: number;
    product: { id: number; name: string; image: string | null; price: number };
    price: number;
    quantity: number;
    size: string | null;
  }>;
};

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
    const ordersMap = new Map<number, VendorOrder>();
    orderItems.forEach(item => {
      const ord = item.order;
      let vendorOrder = ordersMap.get(ord.id);
      if (!vendorOrder) {
        vendorOrder = {
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
        };
        ordersMap.set(ord.id, vendorOrder);
      }
      vendorOrder.items.push({
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
