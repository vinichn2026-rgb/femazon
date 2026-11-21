import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthEmail, getApiAuthPayload } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const payload = await getApiAuthPayload(request);
    const userEmail = payload?.email || (await getApiAuthEmail(request));

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId: rawItemId } = await params;
    const itemId = parseInt(rawItemId, 10);
    if (isNaN(itemId)) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // STRICT USER ISOLATION: Verify that this cart item belongs to the authenticated user's cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id
      }
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Cart item not found in your cart' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const { quantity } = body;

    const parsedQuantity = parseInt(String(quantity), 10);
    if (isNaN(parsedQuantity)) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    // If quantity is 0 or negative, remove the item from cart
    if (parsedQuantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: itemId }
      });
      return NextResponse.json({ success: true, removed: true, message: 'Item removed from cart' });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: parsedQuantity },
      include: { product: true }
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('[Cart Item API] PUT error:', error);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const payload = await getApiAuthPayload(request);
    const userEmail = payload?.email || (await getApiAuthEmail(request));

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId: rawItemId } = await params;
    const itemId = parseInt(rawItemId, 10);
    if (isNaN(itemId)) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // STRICT USER ISOLATION: Verify that this cart item belongs to the authenticated user's cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id
      }
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Cart item not found in your cart' }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    return NextResponse.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('[Cart Item API] DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 });
  }
}
