import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVendorUser } from '@/lib/vendorAuth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getVendorUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized or not a vendor' }, { status: 401 });

    const orderItemId = Number((await params).id);
    if (!Number.isInteger(orderItemId) || orderItemId <= 0) {
      return NextResponse.json({ error: 'Invalid order item ID' }, { status: 400 });
    }

    // Verify this orderItem actually belongs to a product owned by this vendor
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: { product: true }
    });

    if (!orderItem || orderItem.product.vendorId !== user.id) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body) || !('status' in body) || typeof body.status !== 'string') {
      return NextResponse.json({ error: 'A valid status is required' }, { status: 400 });
    }

    const status = body.status;
    const nextStatus: Record<string, string> = {
      PLACED: 'CONFIRMED',
      CONFIRMED: 'PACKED',
      PACKED: 'SHIPPED',
    };
    if (nextStatus[orderItem.status] !== status) {
      return NextResponse.json({ error: 'Invalid order status transition' }, { status: 400 });
    }

    const updated = await prisma.orderItem.updateMany({
      where: { id: orderItemId, status: orderItem.status },
      data: { status }
    });
    if (updated.count !== 1) {
      return NextResponse.json({ error: 'Order status changed before this update could be applied' }, { status: 409 });
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('[SellerOrders] Failed to update order item status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
