import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthEmail, getApiAuthPayload } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const payload = await getApiAuthPayload(request);
    const userEmail = payload?.email || (await getApiAuthEmail(request));

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true
          },
          orderBy: { id: 'desc' }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error('[Cart API] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await getApiAuthPayload(request);
    const userEmail = payload?.email || (await getApiAuthEmail(request));

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const { productId, quantity = 1, size, color } = body;

    const parsedProductId = Number(productId);
    if (!productId || isNaN(parsedProductId) || parsedProductId <= 0) {
      return NextResponse.json({ error: 'Valid Product ID is required' }, { status: 400 });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: parsedProductId }
    });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Find or create cart for user
    let cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id }
      });
    }

    const parsedQuantity = Math.max(1, Number(quantity) || 1);
    const normalizedSize = size && String(size).trim() !== '' ? String(size).trim() : null;
    const normalizedColor = color && String(color).trim() !== '' ? String(color).trim() : null;

    // Check if exact variant already exists in cart for THIS user
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: parsedProductId,
        size: normalizedSize,
        color: normalizedColor
      }
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + parsedQuantity },
        include: { product: true }
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: parsedProductId,
          quantity: parsedQuantity,
          size: normalizedSize,
          color: normalizedColor
        },
        include: { product: true }
      });
    }

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error('[Cart API] POST error:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = await getApiAuthPayload(request);
    const userEmail = payload?.email || (await getApiAuthEmail(request));

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }

    return NextResponse.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('[Cart API] DELETE error:', error);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
