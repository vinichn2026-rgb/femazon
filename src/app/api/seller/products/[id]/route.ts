import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || user.role !== 'VENDOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Ensure the product belongs to this vendor
    const product = await prisma.product.findUnique({ where: { id: Number((await params).id) } });
    if (!product || product.vendorId !== user.id) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
    }

    await prisma.product.delete({ where: { id: Number((await params).id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || user.role !== 'VENDOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Ensure the product belongs to this vendor
    const product = await prisma.product.findUnique({ where: { id: Number((await params).id) } });
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
    if (images !== undefined) dataToUpdate.images = images ? JSON.stringify(images) : null;
    if (image !== undefined || images !== undefined) {
      dataToUpdate.image = image || (images && images.length > 0 ? images[0] : null);
    }
    if (approvalStatus !== undefined) dataToUpdate.approvalStatus = approvalStatus;

    const updatedProduct = await prisma.product.update({
      where: { id: Number((await params).id) },
      data: dataToUpdate
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
