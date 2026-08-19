import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const bookings = await prisma.serviceBooking.findMany({
      where: { userId: user.id },
      include: {
        service: true,
        provider: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await request.json();
    const { providerId, serviceId, date, time, location, duration } = body;

    if (!providerId || !serviceId || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const service = await prisma.service.findUnique({ where: { id: Number(serviceId) } });
    if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

    const calculatedTotal = service.basePrice * (duration ? Number(duration) : 1);

    const booking = await prisma.serviceBooking.create({
      data: {
        userId: user.id,
        providerId: Number(providerId),
        serviceId: Number(serviceId),
        date,
        time,
        location,
        duration: duration ? Number(duration) : null,
        total: calculatedTotal,
        status: 'CONFIRMED'
      }
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
