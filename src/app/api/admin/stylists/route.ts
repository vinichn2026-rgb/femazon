import { NextResponse } from "next/server";
import { getApiAuthEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STYLIST_APPLICATION_STATUSES } from "@/lib/stylists";

export const dynamic = "force-dynamic";

async function requireAdmin(request: Request) {
  const email = await getApiAuthEmail(request);
  if (!email) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const admin = await prisma.user.findUnique({ where: { email }, select: { id: true, role: true } });
  if (!admin || admin.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { admin };
}

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if ("error" in auth) return auth.error;

    const [stylists, packages, bookings, reviews] = await Promise.all([
      prisma.stylistProfile.findMany({
        include: {
          _count: { select: { packages: true, bookings: true, reviews: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.stylistPackage.findMany({
        include: { stylist: { select: { fullName: true, city: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.stylistBooking.findMany({
        include: {
          stylist: { select: { fullName: true, city: true } },
          package: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.stylistReview.findMany({
        include: { stylist: { select: { fullName: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({ stylists, packages, bookings, reviews });
  } catch (err) {
    console.error("[Admin Stylists GET Error]:", err);
    return NextResponse.json({ error: "Failed to load admin stylist data." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if ("error" in auth) return auth.error;

    const body = await request.json();
    const { action, payload } = body || {};
    if (!action || !payload) {
      return NextResponse.json({ error: "Action and payload are required." }, { status: 400 });
    }

    switch (action) {
      case "UPDATE_STATUS": {
        const status = String(payload.status || "").toUpperCase();
        if (!STYLIST_APPLICATION_STATUSES.includes(status as any)) {
          return NextResponse.json({ error: "Invalid status." }, { status: 400 });
        }
        const updated = await prisma.stylistProfile.update({
          where: { id: Number(payload.stylistId) },
          data: {
            status,
            rejectionReason: status === "REJECTED" ? String(payload.rejectionReason || "") : null,
            verified: status === "APPROVED" ? Boolean(payload.verified ?? true) : false,
          },
        });
        if (updated.userId) {
          await prisma.notification
            .create({
              data: {
                userId: updated.userId,
                title: `Stylist Application ${status}`,
                message:
                  status === "APPROVED"
                    ? "Congratulations! Your Personal Stylist profile is now live on Femazon."
                    : `Your stylist application status was updated to ${status}.`,
                type: "SYSTEM",
                link: "/stylist/dashboard",
              },
            })
            .catch(() => {});
        }
        return NextResponse.json({ success: true, stylist: updated });
      }

      case "TOGGLE_VERIFY": {
        const updated = await prisma.stylistProfile.update({
          where: { id: Number(payload.stylistId) },
          data: { verified: Boolean(payload.verified) },
        });
        return NextResponse.json({ success: true, stylist: updated });
      }

      case "TOGGLE_FEATURED": {
        const updated = await prisma.stylistProfile.update({
          where: { id: Number(payload.stylistId) },
          data: { featured: Boolean(payload.featured) },
        });
        return NextResponse.json({ success: true, stylist: updated });
      }

      case "TOGGLE_ACTIVE": {
        const updated = await prisma.stylistProfile.update({
          where: { id: Number(payload.stylistId) },
          data: { isActive: Boolean(payload.isActive) },
        });
        return NextResponse.json({ success: true, stylist: updated });
      }

      case "UPDATE_COMMISSION": {
        const rate = Math.min(50, Math.max(0, Number(payload.commissionRate) || 0));
        const updated = await prisma.stylistProfile.update({
          where: { id: Number(payload.stylistId) },
          data: { commissionRate: rate },
        });
        return NextResponse.json({ success: true, stylist: updated });
      }

      case "TOGGLE_PACKAGE_ACTIVE": {
        const updated = await prisma.stylistPackage.update({
          where: { id: Number(payload.packageId) },
          data: { isActive: Boolean(payload.isActive) },
        });
        return NextResponse.json({ success: true, package: updated });
      }

      case "MODERATE_REVIEW": {
        const updated = await prisma.stylistReview.update({
          where: { id: Number(payload.reviewId) },
          data: {
            ...(typeof payload.isVisible === "boolean" ? { isVisible: payload.isVisible } : {}),
            ...(typeof payload.complaintStatus === "string" ? { complaintStatus: payload.complaintStatus } : {}),
          },
        });
        return NextResponse.json({ success: true, review: updated });
      }

      default:
        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }
  } catch (err) {
    console.error("[Admin Stylists POST Error]:", err);
    return NextResponse.json({ error: "Admin action failed." }, { status: 500 });
  }
}
