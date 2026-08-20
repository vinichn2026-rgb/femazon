import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookingId = parseInt((await params).id);
    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
    }

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
      include: { user: { select: { email: true } } }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (session.user.role !== 'ADMIN' && booking.user.email !== session.user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (booking.status !== 'CONFIRMED') {
      return NextResponse.json({ error: "Booking cannot be cancelled at this stage." }, { status: 400 });
    }

    const updated = await prisma.serviceBooking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' }
    });

    // Send notification
    import("@/lib/notifications").then(({ createNotification }) => {
      createNotification(
        booking.userId,
        "Booking Cancelled",
        `Your booking for #${bookingId.toString().padStart(4, '0')} has been cancelled.`,
        "BOOKING",
        `/bookings/${bookingId}`
      );
    }).catch(console.error);

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Cancel Booking error:", error);
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
  }
}
