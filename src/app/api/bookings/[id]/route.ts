import { NextResponse } from "next/server";
import { getApiAuthEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userEmail = await getApiAuthEmail(request);
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const bookingId = parseInt(resolvedParams.id);
    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
    }

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
      include: {
        user: { select: { email: true, name: true, phone: true } },
        service: true,
        provider: true
      }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const currentUser = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (currentUser.role !== 'ADMIN' && booking.user.email !== userEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error("Fetch Booking Details error:", error);
    return NextResponse.json({ error: "Failed to fetch booking details" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userEmail = await getApiAuthEmail(request);
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const resolvedParams = await params;
    const bookingId = parseInt(resolvedParams.id);
    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
    }

    const existingBooking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
      include: { user: true }
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const body = await request.json();
    const { status, supporterName, total, notes, date, time, location } = body;

    // Customers can cancel or reschedule if it belongs to them
    const isOwner = existingBooking.user.email === userEmail;
    const isAdmin = currentUser.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData: any = {};

    if (isAdmin) {
      if (status) updateData.status = status;
      if (supporterName !== undefined) updateData.supporterName = supporterName;
      if (total !== undefined) updateData.total = Number(total);
      if (notes !== undefined) updateData.notes = notes;
      if (date) updateData.date = date;
      if (time) updateData.time = time;
      if (location) updateData.location = location;
    } else {
      // Customer actions: can request cancellation or update notes/date/time
      if (status === 'CANCELLED') {
        updateData.status = 'CANCELLED';
      }
      if (notes !== undefined) updateData.notes = notes;
      if (date) updateData.date = date;
      if (time) updateData.time = time;
      if (location) updateData.location = location;
    }

    const updated = await prisma.serviceBooking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        service: true,
        provider: true
      }
    });

    try {
      const { clearBookingsCache } = await import('../route');
      clearBookingsCache(userEmail);
    } catch {}

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update Booking error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
