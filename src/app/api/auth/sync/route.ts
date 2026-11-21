import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthEmail, getApiAuthPayload } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface GuestCartItemInput {
  productId: number | string;
  quantity?: number;
  size?: string | null;
  color?: string | null;
}

interface GuestWishlistItemInput {
  productId: number | string;
}

export async function POST(request: Request) {
  try {
    const payload = await getApiAuthPayload(request);
    const userEmail = payload?.email || (await getApiAuthEmail(request));

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Unauthorized. Guest cart & wishlist can only be synchronised into an authenticated account.' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        cart: true,
        wishlist: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User account not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const guestCart: GuestCartItemInput[] = Array.isArray(body?.guestCart) ? body.guestCart : [];
    const guestWishlist: GuestWishlistItemInput[] = Array.isArray(body?.guestWishlist) ? body.guestWishlist : [];

    // 1. Ensure authenticated user has an isolated Cart
    let userCart = user.cart;
    if (!userCart) {
      userCart = await prisma.cart.create({
        data: { userId: user.id }
      });
    }

    // 2. Ensure authenticated user has an isolated Wishlist
    let userWishlist = user.wishlist;
    if (!userWishlist) {
      userWishlist = await prisma.wishlist.create({
        data: { userId: user.id }
      });
    }

    let mergedCartCount = 0;
    let mergedWishlistCount = 0;

    // 3. Merge Guest Cart Items with Variant Preservation & Duplicate Prevention
    if (guestCart.length > 0) {
      for (const item of guestCart) {
        const prodId = Number(item.productId);
        if (!prodId || isNaN(prodId)) continue;

        // Verify product exists in DB catalog
        const productExists = await prisma.product.findUnique({
          where: { id: prodId },
          select: { id: true, stock: true }
        });
        if (!productExists) continue;

        const qtyToAdd = Math.max(1, Number(item.quantity) || 1);
        const normSize = item.size && String(item.size).trim() !== '' ? String(item.size).trim() : null;
        const normColor = item.color && String(item.color).trim() !== '' ? String(item.color).trim() : null;

        // Check if this exact product variant already exists in the user's cart
        const existingItem = await prisma.cartItem.findFirst({
          where: {
            cartId: userCart.id,
            productId: prodId,
            size: normSize,
            color: normColor
          }
        });

        if (existingItem) {
          // Increment quantity, preserving variant details
          await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: {
              quantity: existingItem.quantity + qtyToAdd
            }
          });
        } else {
          // Insert new item linked exclusively to the authenticated user's cart
          await prisma.cartItem.create({
            data: {
              cartId: userCart.id,
              productId: prodId,
              quantity: qtyToAdd,
              size: normSize,
              color: normColor
            }
          });
        }
        mergedCartCount++;
      }
    }

    // 4. Merge Guest Wishlist Items with Duplicate Prevention
    if (guestWishlist.length > 0) {
      for (const item of guestWishlist) {
        const prodId = Number(item.productId);
        if (!prodId || isNaN(prodId)) continue;

        const productExists = await prisma.product.findUnique({
          where: { id: prodId },
          select: { id: true }
        });
        if (!productExists) continue;

        // Check if product is already in the user's wishlist
        const existingWishItem = await prisma.wishlistItem.findFirst({
          where: {
            wishlistId: userWishlist.id,
            productId: prodId
          }
        });

        if (!existingWishItem) {
          await prisma.wishlistItem.create({
            data: {
              wishlistId: userWishlist.id,
              productId: prodId
            }
          });
          mergedWishlistCount++;
        }
      }
    }

    // 5. Fetch fresh updated cart and wishlist strictly for this user
    const updatedCart = await prisma.cart.findUnique({
      where: { id: userCart.id },
      include: {
        items: {
          include: { product: true },
          orderBy: { id: 'desc' }
        }
      }
    });

    const updatedWishlist = await prisma.wishlist.findUnique({
      where: { id: userWishlist.id },
      include: {
        items: {
          include: { product: true },
          orderBy: { id: 'desc' }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Guest data successfully synchronised to authenticated user account',
      userId: user.id,
      cart: updatedCart?.items || [],
      wishlist: updatedWishlist?.items || [],
      mergedCartCount,
      mergedWishlistCount
    });
  } catch (error) {
    console.error('[Guest Sync Error]:', error);
    return NextResponse.json({ error: 'Failed to synchronise guest data' }, { status: 500 });
  }
}
