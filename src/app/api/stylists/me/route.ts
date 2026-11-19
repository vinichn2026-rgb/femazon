import { NextResponse } from "next/server";
import { getApiAuthEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mapStylistRecord } from "@/lib/stylists";

export const dynamic = "force-dynamic";

async function findMyStylist(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });
  if (!user) return { user: null, stylist: null };

  const stylist = await prisma.stylistProfile.findFirst({
    where: {
      OR: [{ userId: user.id }, { email: user.email.toLowerCase() }],
    },
    include: {
      packages: { orderBy: { createdAt: "desc" } },
      bookings: { orderBy: { createdAt: "desc" } },
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });

  // Link userId automatically if matched by email
  if (stylist && !stylist.userId) {
    await prisma.stylistProfile.update({
      where: { id: stylist.id },
      data: { userId: user.id },
    });
  }

  return { user, stylist };
}

export async function GET(request: Request) {
  try {
    const email = await getApiAuthEmail(request);
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { stylist } = await findMyStylist(email);
    if (!stylist) {
      return NextResponse.json({ stylist: null }, { status: 200 });
    }

    const mapped = mapStylistRecord({
      ...stylist,
      packages: stylist.packages,
      reviews: stylist.reviews,
    });

    const completedOrConfirmed = stylist.bookings.filter((b) =>
      ["ACCEPTED", "CONFIRMED", "COMPLETED"].includes(b.status)
    );
    const grossEarnings = completedOrConfirmed.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalCommission = completedOrConfirmed.reduce((sum, b) => sum + b.commissionAmount, 0);
    const netEarnings = completedOrConfirmed.reduce((sum, b) => sum + b.stylistEarnings, 0);

    return NextResponse.json({
      stylist: {
        ...mapped,
        rejectionReason: stylist.rejectionReason,
        isActive: stylist.isActive,
        allPackages: stylist.packages.map((pkg) => ({
          ...pkg,
          includedServices: JSON.parse(pkg.includedServices || "[]"),
          addOns: JSON.parse(pkg.addOns || "[]"),
          images: JSON.parse(pkg.images || "[]"),
        })),
        bookings: stylist.bookings,
        earnings: {
          grossEarnings,
          totalCommission,
          netEarnings,
          commissionRate: stylist.commissionRate,
          totalBookings: stylist.bookings.length,
        },
      },
    });
  } catch (err) {
    console.error("[Stylist Me GET Error]:", err);
    return NextResponse.json({ error: "Failed to load stylist dashboard." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const email = await getApiAuthEmail(request);
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { stylist } = await findMyStylist(email);
    if (!stylist) {
      return NextResponse.json({ error: "Stylist profile not found." }, { status: 404 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (typeof body.fullName === "string" && body.fullName.trim()) updateData.fullName = body.fullName.trim();
    if (typeof body.phone === "string" && body.phone.trim()) updateData.phone = body.phone.trim();
    if (typeof body.profileImage === "string") updateData.profileImage = body.profileImage.trim() || null;
    if (typeof body.city === "string" && body.city.trim()) updateData.city = body.city.trim();
    if (typeof body.location === "string" && body.location.trim()) updateData.location = body.location.trim();
    if (typeof body.experience === "string" && body.experience.trim()) {
      updateData.experience = body.experience.trim();
      const match = body.experience.match(/\d+/);
      if (match) updateData.experienceYears = Number(match[0]);
    }
    if (typeof body.bio === "string" && body.bio.trim()) updateData.bio = body.bio.trim();
    if (typeof body.qualifications === "string") updateData.qualifications = body.qualifications.trim() || null;
    if (typeof body.availabilitySchedule === "string") updateData.availabilitySchedule = body.availabilitySchedule.trim() || null;
    if (Array.isArray(body.specializations)) updateData.specializations = JSON.stringify(body.specializations);
    if (Array.isArray(body.portfolioImages)) updateData.portfolioImages = JSON.stringify(body.portfolioImages);
    if (Array.isArray(body.consultationModes)) updateData.consultationModes = JSON.stringify(body.consultationModes);
    if (Array.isArray(body.preferredLocations)) updateData.preferredLocations = JSON.stringify(body.preferredLocations);
    if (body.socialLinks && typeof body.socialLinks === "object") updateData.socialLinks = JSON.stringify(body.socialLinks);

    const updated = await prisma.stylistProfile.update({
      where: { id: stylist.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, stylist: updated });
  } catch (err) {
    console.error("[Stylist Me PATCH Error]:", err);
    return NextResponse.json({ error: "Failed to update stylist profile." }, { status: 500 });
  }
}
