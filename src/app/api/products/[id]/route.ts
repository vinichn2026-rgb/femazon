import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthEmail } from '@/lib/auth';

function isValidNumber(value: unknown, min: number, max: number, integer = true) {
  if (typeof value !== 'number' && (typeof value !== 'string' || value.trim() === '')) return false;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max && (!integer || Number.isInteger(parsed));
}

async function getProductEditor(request: Request, productId: number) {
  const email = await getApiAuthEmail(request);
  if (!email) return { error: 'Unauthorized', status: 401 as const };

  const [user, product] = await Promise.all([
    prisma.user.findUnique({ where: { email }, select: { id: true, role: true } }),
    prisma.product.findUnique({ where: { id: productId }, select: { id: true, vendorId: true, price: true } }),
  ]);
  if (!user || !['VENDOR', 'ADMIN'].includes(user.role)) {
    return { error: 'Forbidden', status: 403 as const };
  }
  if (!product || (user.role !== 'ADMIN' && product.vendorId !== user.id)) {
    return { error: 'Product not found', status: 404 as const };
  }
  return { user, product };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const productId = Number((await params).id);
    
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('[Product] Failed to fetch product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const productId = Number((await params).id);
    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const access = await getProductEditor(request, productId);
    if ('error' in access) {
      return NextResponse.json({ error: access.error }, { status: access.status });
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid product data' }, { status: 400 });
    }
    const { 
      name, slug, description, price, discountPrice, 
      image, category, stock, sizes, colors
    } = body as Record<string, unknown>;

    if (
      (name !== undefined && (typeof name !== 'string' || name.trim().length === 0 || name.length > 200)) ||
      (slug !== undefined && (typeof slug !== 'string' || slug.trim().length === 0 || slug.length > 250)) ||
      (description !== undefined && description !== null && (typeof description !== 'string' || description.length > 5000)) ||
      (category !== undefined && (typeof category !== 'string' || category.trim().length === 0 || category.length > 100)) ||
      (image !== undefined && image !== null && (typeof image !== 'string' || image.length > 2048)) ||
      (price !== undefined && !isValidNumber(price, 1, 10_000_000)) ||
      (discountPrice !== undefined && discountPrice !== null && !isValidNumber(discountPrice, 1, 10_000_000)) ||
      (stock !== undefined && !isValidNumber(stock, 0, 100_000)) ||
      (sizes !== undefined && sizes !== null && typeof sizes !== 'string' && !Array.isArray(sizes)) ||
      (colors !== undefined && colors !== null && typeof colors !== 'string' && !Array.isArray(colors))
    ) {
      return NextResponse.json({ error: 'Invalid product field values' }, { status: 400 });
    }
    if (
      discountPrice !== undefined && discountPrice !== null &&
      Number(discountPrice) > Number(price ?? access.product.price)
    ) {
      return NextResponse.json({ error: 'Discount price cannot exceed the regular price' }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id: productId, ...(access.user.role === 'VENDOR' ? { vendorId: access.user.id } : {}) },
      data: {
        ...(typeof name === 'string' && { name: name.trim() }),
        ...(typeof slug === 'string' && { slug: slug.trim() }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(discountPrice !== undefined && { discountPrice: discountPrice ? Number(discountPrice) : null }),
        ...(image !== undefined && { image }),
        ...(category !== undefined && { category }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(sizes !== undefined && { sizes: Array.isArray(sizes) ? JSON.stringify(sizes) : sizes }),
        ...(colors !== undefined && { colors: Array.isArray(colors) ? JSON.stringify(colors) : colors }),
        ...(access.user.role === 'VENDOR' && (
          name !== undefined || slug !== undefined || description !== undefined ||
          price !== undefined || discountPrice !== undefined || image !== undefined ||
          category !== undefined || sizes !== undefined || colors !== undefined
        ) && { approvalStatus: 'PENDING' }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[Product] Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const productId = Number((await params).id);
    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const access = await getProductEditor(request, productId);
    if ('error' in access) {
      return NextResponse.json({ error: access.error }, { status: access.status });
    }

    await prisma.product.delete({
      where: { id: productId, ...(access.user.role === 'VENDOR' ? { vendorId: access.user.id } : {}) },
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('[Product] Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
