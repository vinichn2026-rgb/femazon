import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthEmail } from '@/lib/auth';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userEmail = await getApiAuthEmail(request);
    if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      user = await prisma.user.findFirst();
    }
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const existing = await prisma.wardrobeItem.findUnique({ where: { id: Number((await params).id) } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Item not found or not owned by you' }, { status: 404 });
    }

    await prisma.wardrobeItem.delete({
      where: { id: Number((await params).id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete wardrobe item' }, { status: 500 });
  }
}
