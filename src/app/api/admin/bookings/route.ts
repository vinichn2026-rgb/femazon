import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthEmail } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const userEmail = await getApiAuthEmail(request);
    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const bookings = await prisma.serviceBooking.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        service: true,
        provider: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Admin fetch bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
