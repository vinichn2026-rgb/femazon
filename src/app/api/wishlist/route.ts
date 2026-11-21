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

    // Find or create wishlist for user
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
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

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error('[Wishlist API] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
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
    const { productId, action } = body;

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

    // Find or create wishlist for user
    let wishlist = await prisma.wishlist.findUnique({ where: { userId: user.id } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: user.id }
      });
    }

    // Check if item already exists in wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId: parsedProductId
      }
    });

    if (action === 'remove') {
      if (existingItem) {
        await prisma.wishlistItem.delete({ where: { id: existingItem.id } });
      }
      return NextResponse.json({ success: true, action: 'removed' }, { status: 200 });
    }

    if (action === 'add') {
      if (existingItem) {
        return NextResponse.json({ success: true, action: 'already_exists', item: existingItem }, { status: 200 });
      }
      const wishlistItem = await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId: parsedProductId
        },
        include: { product: true }
      });
      return NextResponse.json({ success: true, action: 'added', item: wishlistItem }, { status: 201 });
    }

    // Default toggle behavior
    if (existingItem) {
      await prisma.wishlistItem.delete({ where: { id: existingItem.id } });
      return NextResponse.json({ success: true, action: 'removed' }, { status: 200 });
    } else {
      const wishlistItem = await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId: parsedProductId
        },
        include: { product: true }
      });
      return NextResponse.json({ success: true, action: 'added', item: wishlistItem }, { status: 201 });
    }
  } catch (error) {
    console.error('[Wishlist API] POST error:', error);
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
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

    const wishlist = await prisma.wishlist.findUnique({ where: { userId: user.id } });
    if (wishlist) {
      await prisma.wishlistItem.deleteMany({
        where: { wishlistId: wishlist.id }
      });
    }

    return NextResponse.json({ success: true, message: 'Wishlist cleared successfully' });
  } catch (error) {
    console.error('[Wishlist API] DELETE error:', error);
    return NextResponse.json({ error: 'Failed to clear wishlist' }, { status: 500 });
  }
}
