import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';

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

      case 'CREATE_PRODUCT': {
        const slug = (payload.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        const mainImage = payload.image || (payload.images && payload.images.length > 0 ? payload.images[0] : "");
        const imagesJson = payload.images ? JSON.stringify(payload.images) : JSON.stringify(mainImage ? [mainImage] : []);
        const sizesJson = Array.isArray(payload.sizes) ? JSON.stringify(payload.sizes) : payload.sizes ? JSON.stringify([payload.sizes]) : JSON.stringify(["M", "L", "XL"]);
        const colorsJson = Array.isArray(payload.colors) ? JSON.stringify(payload.colors) : payload.color ? JSON.stringify([payload.color]) : JSON.stringify(["Green"]);

        const nativeProduct = await prisma.product.create({
          data: {
            name: payload.name,
            slug: slug,
            description: payload.description || "",
            price: Math.round(Number(payload.price)),
            discountPrice: payload.discountPrice ? Math.round(Number(payload.discountPrice)) : null,
            stock: Math.round(Number(payload.stock || 25)),
            category: payload.category || "Chudithar",
            subcategory: payload.pattern || payload.subcategory || "A-Line Pattern",
            dressType: payload.pattern || "A-Line Pattern",
            image: mainImage,
            images: imagesJson,
            sizes: sizesJson,
            colors: colorsJson,
            approvalStatus: 'APPROVED'
          }
        });
        return NextResponse.json(nativeProduct);
      }

      case 'UPDATE_PRODUCT': {
        const mainImage = payload.image || (payload.images && payload.images.length > 0 ? payload.images[0] : undefined);
        const imagesJson = payload.images ? JSON.stringify(payload.images) : undefined;
        const sizesJson = Array.isArray(payload.sizes) ? JSON.stringify(payload.sizes) : undefined;
        const colorsJson = Array.isArray(payload.colors) ? JSON.stringify(payload.colors) : payload.color ? JSON.stringify([payload.color]) : undefined;

        const updatedProduct = await prisma.product.update({
          where: { id: Number(payload.productId || payload.id) },
          data: {
            name: payload.name,
            description: payload.description,
            price: payload.price !== undefined ? Math.round(Number(payload.price)) : undefined,
            discountPrice: payload.discountPrice !== undefined ? (payload.discountPrice ? Math.round(Number(payload.discountPrice)) : null) : undefined,
            stock: payload.stock !== undefined ? Math.round(Number(payload.stock)) : undefined,
            category: payload.category,
            subcategory: payload.pattern || payload.subcategory,
            dressType: payload.pattern,
            image: mainImage,
            images: imagesJson,
            sizes: sizesJson,
            colors: colorsJson,
            approvalStatus: payload.approvalStatus || 'APPROVED'
          }
        });
        return NextResponse.json(updatedProduct);
      }

      case 'DELETE_PRODUCT': {
        await prisma.product.delete({
          where: { id: Number(payload.productId || payload.id) }
        });
        return NextResponse.json({ success: true });
      }

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
