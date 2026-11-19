import { NextResponse } from "next/server";
import { getApiAuthEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueStylistSlug } from "@/lib/stylists";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const emailInput = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const city = typeof body.city === "string" ? body.city.trim() : "";
    const location = typeof body.location === "string" ? body.location.trim() : "";
    const experience = typeof body.experience === "string" ? body.experience.trim() : "";
    const bio = typeof body.bio === "string" ? body.bio.trim() : "";

    if (!fullName || !emailInput || !phone || !city || !location || !experience || !bio) {
      return NextResponse.json(
        { error: "Please complete all required stylist profile fields." },
        { status: 400 }
      );
    }

    const authEmail = await getApiAuthEmail(request);
    let userId: number | null = null;
    if (authEmail) {
      const user = await prisma.user.findUnique({
        where: { email: authEmail },
        select: { id: true },
      });
      userId = user?.id ?? null;
    }

    const existing = await prisma.stylistProfile.findFirst({
      where: {
        OR: [
          ...(userId ? [{ userId }] : []),
          { email: emailInput },
        ],
      },
      select: { id: true, status: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: `A stylist application already exists for this account (Status: ${existing.status}).`,
        },
        { status: 409 }
      );
    }

    const specializations = Array.isArray(body.specializations)
      ? body.specializations.filter((s: unknown): s is string => typeof s === "string" && s.trim().length > 0)
      : [];
    const portfolioImages = Array.isArray(body.portfolioImages)
      ? body.portfolioImages.filter((s: unknown): s is string => typeof s === "string" && s.trim().length > 0)
      : [];
    const consultationModes = Array.isArray(body.consultationModes)
      ? body.consultationModes.filter((s: unknown): s is string => typeof s === "string" && s.trim().length > 0)
      : ["Online"];
    const preferredLocations = Array.isArray(body.preferredLocations)
      ? body.preferredLocations.filter((s: unknown): s is string => typeof s === "string" && s.trim().length > 0)
      : typeof body.preferredLocations === "string"
        ? body.preferredLocations.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];

    const experienceYearsMatch = experience.match(/\d+/);
    const experienceYears = Number(body.experienceYears) || (experienceYearsMatch ? Number(experienceYearsMatch[0]) : 1);
    const slug = await generateUniqueStylistSlug(fullName);

    const created = await prisma.stylistProfile.create({
      data: {
        userId,
        slug,
        fullName,
        email: emailInput,
        phone,
        profileImage: typeof body.profileImage === "string" && body.profileImage.trim() ? body.profileImage.trim() : null,
        city,
        location,
        preferredLocations: JSON.stringify(preferredLocations),
        experience,
        experienceYears,
        bio,
        specializations: JSON.stringify(specializations),
        portfolioImages: JSON.stringify(portfolioImages),
        socialLinks: JSON.stringify({
          instagram: typeof body.instagram === "string" ? body.instagram.trim() : "",
          linkedin: typeof body.linkedin === "string" ? body.linkedin.trim() : "",
          website: typeof body.website === "string" ? body.website.trim() : "",
        }),
        consultationModes: JSON.stringify(consultationModes.length > 0 ? consultationModes : ["Online"]),
        qualifications: typeof body.qualifications === "string" ? body.qualifications.trim() : null,
        availabilitySchedule: typeof body.availabilitySchedule === "string" && body.availabilitySchedule.trim()
          ? body.availabilitySchedule.trim()
          : "Mon - Sat, 10:00 AM - 7:00 PM",
        status: "PENDING",
      },
    });

    await prisma.stylistApplication.create({
      data: {
        stylistId: created.id,
        status: "PENDING",
      },
    }).catch(() => {});

    if (portfolioImages.length > 0) {
      await prisma.stylistPortfolio.createMany({
        data: portfolioImages.map((imageUrl: string, idx: number) => ({
          stylistId: created.id,
          imageUrl,
          displayOrder: idx + 1,
        })),
      }).catch(() => {});
    }

    return NextResponse.json(
      {
        success: true,
        stylist: {
          id: created.id,
          slug: created.slug,
          status: created.status,
        },
        message: "Your stylist application has been submitted and is pending admin review.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Stylist Register Error]:", err);
    return NextResponse.json(
      { error: "Unable to submit stylist application right now. Please try again later." },
      { status: 500 }
    );
  }
}
