import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthEmail } from '@/lib/auth';
import { getBookingsCache, getInFlightRequests, CACHE_TTL_MS, clearBookingsCache } from '@/lib/bookingsCache';

export async function GET(request: Request) {
  try {
    const userEmail = await getApiAuthEmail(request);
    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cacheKey = userEmail.toLowerCase();
    const cache = getBookingsCache();
    const cached = cache.get(cacheKey);
    const now = Date.now();
    if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
      return NextResponse.json(cached.data);
    }

    // In-flight deduplication: if an active database query is running for this user, reuse it
    const inflight = getInFlightRequests();
    let activePromise = inflight.get(cacheKey);
    if (!activePromise) {
      activePromise = (async () => {
        try {
          const bookings = await prisma.serviceBooking.findMany({
            where: { user: { email: userEmail } },
            include: {
              service: true,
              provider: true
            },
            orderBy: { createdAt: 'desc' }
          });

          cache.set(cacheKey, { data: bookings, timestamp: Date.now() });
          return bookings;
        } finally {
          inflight.delete(cacheKey);
        }
      })();

      inflight.set(cacheKey, activePromise);
    }

    const result = await activePromise;
    return NextResponse.json(result);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userEmail = await getApiAuthEmail(request);
    if (!userEmail) {
      return NextResponse.json({ error: 'Please sign in to complete your booking request' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) return NextResponse.json({ error: 'User account not found' }, { status: 404 });

    const body = await request.json();
    const { 
      serviceId, 
      providerId,
      date, 
      time, 
      location, 
      duration, 
      customerName, 
      customerPhone, 
      notes 
    } = body;

    if (!serviceId || !date || !time || !location) {
      return NextResponse.json({ 
        error: 'Please fill in the required booking information (service, date, time slot, and location/address).' 
      }, { status: 400 });
    }

    const parsedServiceId = Number(serviceId);
    if (!Number.isInteger(parsedServiceId) || parsedServiceId <= 0) {
      return NextResponse.json({ error: 'Please select a valid service.' }, { status: 400 });
    }

    const service = await prisma.service.findUnique({ where: { id: parsedServiceId } });
    if (!service) return NextResponse.json({ error: 'Selected service not found' }, { status: 404 });

    let provider;
    if (providerId !== undefined && providerId !== null) {
      const parsedProviderId = Number(providerId);
      if (!Number.isInteger(parsedProviderId) || parsedProviderId <= 0) {
        return NextResponse.json({ error: 'Please select a valid provider.' }, { status: 400 });
      }

      provider = await prisma.provider.findFirst({
        where: { id: parsedProviderId, serviceId: service.id }
      });
    } else {
      provider = await prisma.provider.findFirst({
        where: { serviceId: service.id },
        orderBy: { rating: 'desc' }
      });
    }

    if (!provider) {
      return NextResponse.json({ error: 'No provider is currently listed for this service.' }, { status: 404 });
    }

    const calculatedTotal = service.basePrice * (duration ? Number(duration) : 1);

    const booking = await prisma.serviceBooking.create({
      data: {
        userId: user.id,
        providerId: provider.id,
        serviceId: service.id,
        date,
        time,
        location,
        duration: duration ? Number(duration) : 1,
        total: calculatedTotal,
        customerName: customerName || user.name || 'Valued Customer',
        customerPhone: customerPhone || user.phone || '',
        notes: notes || '',
        status: 'REQUEST_RECEIVED'
      },
      include: {
        service: true,
        provider: true
      }
    });

    clearBookingsCache(userEmail);

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json({ error: 'Failed to submit service booking request' }, { status: 500 });
  }
}
