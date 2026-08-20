import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { action, payload } = body;

    switch (action) {
      case 'APPROVE_VENDOR':
        const vp = await prisma.vendorProfile.update({
          where: { id: payload.vendorId },
          data: { status: 'APPROVED' }
        });
        await prisma.user.update({
          where: { id: vp.userId },
          data: { role: 'VENDOR' }
        });
        return NextResponse.json({ success: true });

      case 'APPROVE_PRODUCT':
        await prisma.product.update({
          where: { id: payload.productId },
          data: { approvalStatus: 'APPROVED' }
        });
        return NextResponse.json({ success: true });
        
      case 'REJECT_PRODUCT':
        await prisma.product.update({
          where: { id: payload.productId },
          data: { approvalStatus: 'REJECTED' }
        });
        return NextResponse.json({ success: true });

      case 'CREATE_PRODUCT':
        const slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        const nativeProduct = await prisma.product.create({
          data: {
            name: payload.name,
            slug: slug,
            price: Math.round(Number(payload.price)),
            stock: Math.round(Number(payload.stock)),
            category: payload.category || "General",
            image: payload.image || "",
            approvalStatus: 'APPROVED'
          }
        });
        return NextResponse.json(nativeProduct);

      case 'DELETE_USER':
        await prisma.user.delete({
          where: { id: payload.userId }
        });
        return NextResponse.json({ success: true });

      case 'CREATE_CATEGORY':
        const cat = await prisma.category.create({
          data: {
            name: payload.name,
            slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: payload.description
          }
        });
        return NextResponse.json(cat);

      case 'DELETE_CATEGORY':
        await prisma.category.delete({
          where: { id: payload.categoryId }
        });
        return NextResponse.json({ success: true });

      case 'CREATE_SERVICE':
        const newService = await prisma.service.create({
          data: {
            name: payload.name,
            slug: payload.name.toLowerCase().replace(/ /g, '-'),
            description: payload.description || "",
            basePrice: Number(payload.price) || 0,
            image: payload.image || "",
          }
        });
        return NextResponse.json(newService);

      case 'DELETE_SERVICE':
        await prisma.service.delete({
          where: { id: payload.serviceId }
        });
        return NextResponse.json({ success: true });

      case 'UPDATE_BOOKING_STATUS':
        await prisma.serviceBooking.update({
          where: { id: payload.bookingId },
          data: { status: payload.status }
        });
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to perform action' }, { status: 500 });
  }
}
