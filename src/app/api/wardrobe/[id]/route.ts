import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
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
