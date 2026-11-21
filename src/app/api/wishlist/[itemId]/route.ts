import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthEmail, getApiAuthPayload } from '@/lib/auth';

export const dynamic = 'force-dynamic';

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

    const wishlist = await prisma.wishlist.findUnique({ where: { userId: user.id } });
    if (!wishlist) {
      return NextResponse.json({ error: 'Wishlist not found' }, { status: 404 });
    }

    // STRICT USER ISOLATION: Check if item belongs to this user's wishlist either by wishlistItem.id or by productId
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        OR: [
          { id: itemId },
          { productId: itemId }
        ]
      }
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Wishlist item not found in your wishlist' }, { status: 404 });
    }

    await prisma.wishlistItem.delete({
      where: { id: existingItem.id }
    });

    return NextResponse.json({ success: true, message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('[Wishlist Item API] DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove wishlist item' }, { status: 500 });
  }
}
