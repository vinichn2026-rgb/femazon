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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getVendorUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized or not a vendor' }, { status: 401 });

    const resolvedParams = await params;
    const productId = Number(resolvedParams.id);

    // Ensure the product belongs to this vendor
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.vendorId !== user.id) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
    }

    await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getVendorUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized or not a vendor' }, { status: 401 });

    const resolvedParams = await params;
    const productId = Number(resolvedParams.id);

    // Ensure the product belongs to this vendor
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.vendorId !== user.id) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
    }

    const body = await request.json();
    
    // Allow updating specific fields
    const { 
      name, description, price, discountPrice, 
      category, subcategory, stock, sizes, colors, 
      sku, images, approvalStatus, image
    } = body;

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (description !== undefined) dataToUpdate.description = description;
    if (price !== undefined) dataToUpdate.price = Math.round(Number(price));
    if (discountPrice !== undefined) dataToUpdate.discountPrice = discountPrice ? Math.round(Number(discountPrice)) : null;
    if (category !== undefined) dataToUpdate.category = category;
    if (subcategory !== undefined) dataToUpdate.subcategory = subcategory;
    if (stock !== undefined) dataToUpdate.stock = Math.round(Number(stock));
    if (sizes !== undefined) dataToUpdate.sizes = sizes;
    if (colors !== undefined) dataToUpdate.colors = colors;
    if (sku !== undefined) dataToUpdate.sku = sku;
    if (images !== undefined) dataToUpdate.images = Array.isArray(images) ? JSON.stringify(images) : images;
    if (image !== undefined || images !== undefined) {
      dataToUpdate.image = image || (Array.isArray(images) ? images[0] : null);
    }
    if (approvalStatus !== undefined) dataToUpdate.approvalStatus = approvalStatus;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: dataToUpdate
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
