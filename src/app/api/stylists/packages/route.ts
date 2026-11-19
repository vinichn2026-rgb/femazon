import { NextResponse } from "next/server";
import { getApiAuthEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getAuthenticatedStylist(request: Request) {
  const email = await getApiAuthEmail(request);
  if (!email) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true } });
  if (!user) return { error: NextResponse.json({ error: "User not found" }, { status: 401 }) };

  const stylist = await prisma.stylistProfile.findFirst({
    where: { OR: [{ userId: user.id }, { email: user.email.toLowerCase() }] },
    select: { id: true, status: true },
  });
  if (!stylist) return { error: NextResponse.json({ error: "Stylist profile not found" }, { status: 404 }) };
  return { stylist };
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedStylist(request);
    if ("error" in auth) return auth.error;

    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const packageType = typeof body.packageType === "string" ? body.packageType.trim() : title;
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const price = Math.max(0, Math.round(Number(body.price) || 0));
    const duration = typeof body.duration === "string" ? body.duration.trim() : "60 mins";
    const sessionsCount = Math.max(1, Math.round(Number(body.sessionsCount) || 1));
    const deliveryMode = typeof body.deliveryMode === "string" ? body.deliveryMode.trim() : "Online & Offline";

    if (!title || !description || price <= 0) {
      return NextResponse.json(
        { error: "Package title, description, and valid price are required." },
        { status: 400 }
      );
    }

    const includedServices = Array.isArray(body.includedServices)
      ? body.includedServices.filter((s: unknown): s is string => typeof s === "string" && s.trim().length > 0)
      : [];
    const addOns = Array.isArray(body.addOns)
      ? body.addOns
          .filter((a: any) => a && typeof a.name === "string" && a.name.trim())
          .map((a: any) => ({ name: a.name.trim(), price: Math.max(0, Math.round(Number(a.price) || 0)) }))
      : [];
    const images = Array.isArray(body.images)
      ? body.images.filter((s: unknown): s is string => typeof s === "string" && s.trim().length > 0)
      : [];

    const pkg = await prisma.stylistPackage.create({
      data: {
        stylistId: auth.stylist.id,
        title,
        packageType,
        description,
        price,
        duration,
        includedServices: JSON.stringify(includedServices),
        sessionsCount,
        deliveryMode,
        location: typeof body.location === "string" ? body.location.trim() || null : null,
        addOns: JSON.stringify(addOns),
        availability: typeof body.availability === "string" ? body.availability.trim() || null : null,
        images: JSON.stringify(images),
        isActive: body.isActive !== false,
      },
    });

    return NextResponse.json({ success: true, package: pkg }, { status: 201 });
  } catch (err) {
    console.error("[Stylist Packages POST Error]:", err);
    return NextResponse.json({ error: "Failed to create package." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await getAuthenticatedStylist(request);
    if ("error" in auth) return auth.error;

    const body = await request.json();
    const packageId = Number(body.id);
    if (!packageId) {
      return NextResponse.json({ error: "Package id is required." }, { status: 400 });
    }

    const existing = await prisma.stylistPackage.findFirst({
      where: { id: packageId, stylistId: auth.stylist.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Package not found." }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (typeof body.title === "string" && body.title.trim()) data.title = body.title.trim();
    if (typeof body.packageType === "string" && body.packageType.trim()) data.packageType = body.packageType.trim();
    if (typeof body.description === "string" && body.description.trim()) data.description = body.description.trim();
    if (body.price !== undefined) data.price = Math.max(0, Math.round(Number(body.price) || 0));
    if (typeof body.duration === "string" && body.duration.trim()) data.duration = body.duration.trim();
    if (body.sessionsCount !== undefined) data.sessionsCount = Math.max(1, Math.round(Number(body.sessionsCount) || 1));
    if (typeof body.deliveryMode === "string" && body.deliveryMode.trim()) data.deliveryMode = body.deliveryMode.trim();
    if (typeof body.location === "string") data.location = body.location.trim() || null;
    if (typeof body.availability === "string") data.availability = body.availability.trim() || null;
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;
    if (Array.isArray(body.includedServices)) data.includedServices = JSON.stringify(body.includedServices);
    if (Array.isArray(body.addOns)) data.addOns = JSON.stringify(body.addOns);
    if (Array.isArray(body.images)) data.images = JSON.stringify(body.images);

    const updated = await prisma.stylistPackage.update({
      where: { id: packageId },
      data,
    });

    return NextResponse.json({ success: true, package: updated });
  } catch (err) {
    console.error("[Stylist Packages PATCH Error]:", err);
    return NextResponse.json({ error: "Failed to update package." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await getAuthenticatedStylist(request);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "Package id is required." }, { status: 400 });

    const existing = await prisma.stylistPackage.findFirst({
      where: { id, stylistId: auth.stylist.id },
    });
    if (!existing) return NextResponse.json({ error: "Package not found." }, { status: 404 });

    await prisma.stylistPackage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Stylist Packages DELETE Error]:", err);
    return NextResponse.json({ error: "Failed to delete package." }, { status: 500 });
  }
}
