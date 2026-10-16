import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthEmail } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const userEmail = await getApiAuthEmail(request);
    if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      user = await prisma.user.findFirst();
    }
    if (!user) return NextResponse.json([]);

    const items = await prisma.wardrobeItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wardrobe' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userEmail = await getApiAuthEmail(request);
    if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      user = await prisma.user.findFirst();
    }
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await request.json();
    const { imageUrl, category, color, brand } = body;

    if (!imageUrl || !category) {
      return NextResponse.json({ error: 'Image URL and Category are required' }, { status: 400 });
    }

    const item = await prisma.wardrobeItem.create({
      data: {
        userId: user.id,
        imageUrl,
        category,
        color,
        brand
      }
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add wardrobe item' }, { status: 500 });
  }
}
