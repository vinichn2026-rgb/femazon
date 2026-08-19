import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { targetType: string; targetId: string } }
) {
  try {
    const { targetType, targetId } = params;
    const id = parseInt(targetId);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    let whereClause = {};
    if (targetType === "product") whereClause = { productId: id };
    else if (targetType === "service") whereClause = { serviceId: id };
    else if (targetType === "provider") whereClause = { providerId: id };
    else if (targetType === "vendor") {
      // For vendor, we get all reviews for all products of this vendor
      const vendorProducts = await prisma.product.findMany({
        where: { vendorId: id },
        select: { id: true }
      });
      const pIds = vendorProducts.map(p => p.id);
      whereClause = { productId: { in: pIds } };
    } else {
      return NextResponse.json({ error: "Invalid target type" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true, image: true } } // assuming user has image in real app, we just use name
      },
      orderBy: { createdAt: 'desc' }
    });

    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    return NextResponse.json({
      reviews,
      total: reviews.length,
      averageRating: parseFloat(averageRating.toFixed(1))
    });
  } catch (error: any) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
