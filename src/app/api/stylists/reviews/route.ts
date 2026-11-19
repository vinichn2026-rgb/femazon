import { NextResponse } from "next/server";
import { getApiAuthEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const stylistId = Number(body.stylistId);
    const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";
    const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 5)));
    const comment = typeof body.comment === "string" ? body.comment.trim() : "";
    const isComplaint = Boolean(body.isComplaint);

    if (!stylistId || !customerName || !comment) {
      return NextResponse.json(
        { error: "Please provide your name and feedback." },
        { status: 400 }
      );
    }

    const stylist = await prisma.stylistProfile.findFirst({
      where: { id: stylistId, status: "APPROVED" },
      select: { id: true },
    });
    if (!stylist) {
      return NextResponse.json({ error: "Stylist not found." }, { status: 404 });
    }

    const authEmail = await getApiAuthEmail(request);
    let userId: number | null = null;
    if (authEmail) {
      const user = await prisma.user.findUnique({ where: { email: authEmail }, select: { id: true } });
      userId = user?.id ?? null;
    }

    const review = await prisma.stylistReview.create({
      data: {
        stylistId: stylist.id,
        userId,
        customerName,
        rating,
        comment,
        isComplaint,
        complaintStatus: isComplaint ? "OPEN" : "NONE",
        isVisible: !isComplaint,
      },
    });

    return NextResponse.json(
      {
        success: true,
        review,
        message: isComplaint
          ? "Your complaint has been submitted to Femazon Admin for review."
          : "Thank you for reviewing this personal stylist!",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Stylist Reviews POST Error]:", err);
    return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
  }
}
