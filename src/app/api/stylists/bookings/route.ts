import { NextResponse } from "next/server";
import { getApiAuthEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const email = await getApiAuthEmail(request);
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true } });
    if (!user) return NextResponse.json({ bookings: [] });

    const bookings = await prisma.stylistBooking.findMany({
      where: {
        OR: [{ userId: user.id }, { customerEmail: user.email.toLowerCase() }],
      },
      include: {
        stylist: { select: { fullName: true, slug: true, city: true, profileImage: true } },
        package: { select: { title: true, duration: true, packageType: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("[Stylist Bookings GET Error]:", err);
    return NextResponse.json({ error: "Failed to load bookings." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const stylistId = Number(body.stylistId);
    const packageId = body.packageId ? Number(body.packageId) : null;
    const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";
    const customerEmail = typeof body.customerEmail === "string" ? body.customerEmail.trim().toLowerCase() : "";
    const customerPhone = typeof body.customerPhone === "string" ? body.customerPhone.trim() : "";
    const bookingDate = typeof body.bookingDate === "string" ? body.bookingDate.trim() : "";
    const bookingTime = typeof body.bookingTime === "string" ? body.bookingTime.trim() : "";
    const deliveryMode = typeof body.deliveryMode === "string" ? body.deliveryMode.trim() : "Online";
    const location = typeof body.location === "string" ? body.location.trim() : "";
    const notes = typeof body.notes === "string" ? body.notes.trim() : "";
    const paymentMethod = body.paymentMethod === "ONLINE_PAID" ? "ONLINE_PAID" : "REQUEST";

    if (!stylistId || !customerName || !customerEmail || !customerPhone || !bookingDate || !bookingTime) {
      return NextResponse.json(
        { error: "Please fill in your contact details, date, and preferred time slot." },
        { status: 400 }
      );
    }

    const stylist = await prisma.stylistProfile.findFirst({
      where: { id: stylistId, status: "APPROVED", isActive: true },
    });
    if (!stylist) {
      return NextResponse.json({ error: "Selected stylist is not available." }, { status: 404 });
    }

    let basePrice = 0;
    let validAddOns: Array<{ name: string; price: number }> = [];

    if (packageId) {
      const pkg = await prisma.stylistPackage.findFirst({
        where: { id: packageId, stylistId: stylist.id, isActive: true },
      });
      if (!pkg) {
        return NextResponse.json({ error: "Selected package is not available." }, { status: 404 });
      }
      basePrice = pkg.price;

      const availableAddOns: Array<{ name: string; price: number }> = JSON.parse(pkg.addOns || "[]");
      const requestedNames: string[] = Array.isArray(body.selectedAddOns) ? body.selectedAddOns : [];
      validAddOns = availableAddOns.filter((a) => requestedNames.includes(a.name));
    } else {
      basePrice = Math.max(0, Math.round(Number(body.customAmount) || 1500));
    }

    const addOnsTotal = validAddOns.reduce((sum, a) => sum + a.price, 0);
    const totalAmount = basePrice + addOnsTotal;
    const commissionAmount = Math.round((totalAmount * (stylist.commissionRate || 15)) / 100);
    const stylistEarnings = Math.max(0, totalAmount - commissionAmount);

    const authEmail = await getApiAuthEmail(request);
    let userId: number | null = null;
    if (authEmail) {
      const user = await prisma.user.findUnique({ where: { email: authEmail }, select: { id: true } });
      userId = user?.id ?? null;
    }

    const booking = await prisma.stylistBooking.create({
      data: {
        stylistId: stylist.id,
        packageId,
        userId,
        customerName,
        customerEmail,
        customerPhone,
        bookingDate,
        bookingTime,
        deliveryMode,
        location: location || stylist.city,
        selectedAddOns: JSON.stringify(validAddOns),
        notes: notes || null,
        totalAmount,
        commissionAmount,
        stylistEarnings,
        paymentStatus: paymentMethod === "ONLINE_PAID" ? "PENDING" : "PAY_AT_SESSION",
        status: "PENDING",
      },
    });

    await prisma.commission.create({
      data: {
        stylistId: stylist.id,
        bookingId: booking.id,
        grossAmount: totalAmount,
        commissionRate: stylist.commissionRate || 15,
        commissionAmount,
        netPayout: stylistEarnings,
        status: "PENDING",
      },
    }).catch(() => {});

    if (stylist.userId) {
      await prisma.notification
        .create({
          data: {
            userId: stylist.userId,
            title: "New Personal Styling Booking",
            message: `${customerName} requested a booking on ${bookingDate} (${bookingTime}).`,
            type: "BOOKING",
            link: "/stylist/dashboard",
          },
        })
        .catch(() => {});
    }

    return NextResponse.json(
      {
        success: true,
        booking,
        message: "Your booking request has been submitted and is awaiting stylist confirmation.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Stylist Bookings POST Error]:", err);
    return NextResponse.json({ error: "Failed to submit booking." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const email = await getApiAuthEmail(request);
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, role: true, email: true } });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const bookingId = Number(body.bookingId);
    const status = typeof body.status === "string" ? body.status.toUpperCase() : "";
    const allowedStatuses = ["PENDING", "ACCEPTED", "CONFIRMED", "COMPLETED", "REJECTED", "CANCELLED"];

    if (!bookingId || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Valid bookingId and status are required." }, { status: 400 });
    }

    const booking = await prisma.stylistBooking.findUnique({
      where: { id: bookingId },
      include: { stylist: { select: { userId: true, email: true } } },
    });
    if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

    const isOwnerStylist =
      booking.stylist.userId === user.id || booking.stylist.email.toLowerCase() === user.email.toLowerCase();
    if (!isOwnerStylist && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.stylistBooking.update({
      where: { id: bookingId },
      data: { status },
    });

    if (booking.userId) {
      await prisma.notification
        .create({
          data: {
            userId: booking.userId,
            title: "Personal Styling Booking Updated",
            message: `Your styling booking #${booking.id} status is now ${status}.`,
            type: "BOOKING",
            link: "/personal-styling",
          },
        })
        .catch(() => {});
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (err) {
    console.error("[Stylist Bookings PATCH Error]:", err);
    return NextResponse.json({ error: "Failed to update booking status." }, { status: 500 });
  }
}
