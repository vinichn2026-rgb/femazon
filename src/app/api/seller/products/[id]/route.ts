import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { getVendorUser } from '@/lib/vendorAuth';
import { getProductValidationMessage, serializeProductList, vendorProductSchema } from '@/lib/vendorProducts';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getVendorUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized or not a vendor' }, { status: 401 });

    const resolvedParams = await params;
    const productId = Number(resolvedParams.id);
    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json({ error: 'Invalid product ID.' }, { status: 400 });
    }

    // Ensure the product belongs to this vendor
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.vendorId !== user.id) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
    }

    await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SellerProducts] Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getVendorUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized or not a vendor' }, { status: 401 });

    const resolvedParams = await params;
    const productId = Number(resolvedParams.id);
    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json({ error: 'Invalid product ID.' }, { status: 400 });
    }

    // Ensure the product belongs to this vendor
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.vendorId !== user.id) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid product data.' }, { status: 400 });
    }

    const parsed = vendorProductSchema.innerType().partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: getProductValidationMessage(parsed.error) }, { status: 400 });
    }
    if (
      parsed.data.discountPrice !== undefined &&
      parsed.data.discountPrice !== null &&
      parsed.data.discountPrice > Number(parsed.data.price ?? product.price)
    ) {
      return NextResponse.json({ error: 'Discount price cannot exceed the regular price.' }, { status: 400 });
    }
    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ error: 'No product changes were provided.' }, { status: 400 });
    }

    const {
      name, description, price, discountPrice, category, subcategory, stock,
      sizes, colors, sku, images, image, status,
    } = parsed.data;

    // Validate 3 to 5 images if updating image list
    if (images !== undefined) {
      const imageList = Array.isArray(images) ? images : typeof images === 'string' ? images.split(/\r?\n/).filter(Boolean) : [];
      if (imageList.length > 0 && (imageList.length < 3 || imageList.length > 5)) {
        return NextResponse.json({ error: 'Product must have between 3 and 5 uploaded images.' }, { status: 400 });
      }
    }
    const dataToUpdate: Prisma.ProductUpdateInput = {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(discountPrice !== undefined && { discountPrice }),
      ...(category !== undefined && { category }),
      ...(subcategory !== undefined && { subcategory }),
      ...(stock !== undefined && { stock }),
      ...(sizes !== undefined && { sizes: serializeProductList(sizes) }),
      ...(colors !== undefined && { colors: serializeProductList(colors) }),
      ...(sku !== undefined && { sku }),
      ...(images !== undefined && { images: serializeProductList(images) }),
    };
    if (image !== undefined || images !== undefined) {
      const imageList = Array.isArray(images)
        ? images
        : typeof images === 'string'
          ? images.split(/\r?\n/).filter(Boolean)
          : [];
      dataToUpdate.image = image || imageList[0] || null;
    }
    const listingDetailsChanged = Object.keys(parsed.data).some((field) => field !== 'status' && field !== 'stock');
    dataToUpdate.approvalStatus = status === 'DRAFT'
      ? 'DRAFT'
      : status === 'SUBMITTED' || (listingDetailsChanged && product.approvalStatus !== 'DRAFT')
        ? 'SUBMITTED'
        : product.approvalStatus;

    if (dataToUpdate.approvalStatus === 'PENDING') {
      dataToUpdate.rejectionReason = null;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: dataToUpdate
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('[SellerProducts] Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
