import { prisma } from "@/lib/prisma";
export * from "@/lib/stylistTypes";
import type {
  PublicStylist,
  StylistAddOn,
  StylistPackageItem,
  StylistReviewItem,
} from "@/lib/stylistTypes";

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }
  } catch {
    // Fallback to comma-separated string
  }
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export function parseAddOns(value: string | null | undefined): StylistAddOn[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is { name: string; price: number } =>
          Boolean(item && typeof item === "object" && "name" in item && "price" in item)
        )
        .map((item) => ({
          name: String(item.name).trim(),
          price: Math.max(0, Number(item.price) || 0),
        }))
        .filter((item) => item.name.length > 0);
    }
  } catch {
    // Ignore malformed JSON
  }
  return [];
}

export function parseSocialLinks(value: string | null | undefined): {
  instagram?: string;
  linkedin?: string;
  website?: string;
} {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const obj = parsed as Record<string, unknown>;
      return {
        instagram: typeof obj.instagram === "string" ? obj.instagram : undefined,
        linkedin: typeof obj.linkedin === "string" ? obj.linkedin : undefined,
        website: typeof obj.website === "string" ? obj.website : undefined,
      };
    }
  } catch {
    // Ignore malformed JSON
  }
  return {};
}

export function slugifyStylistName(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "stylist";
}

export async function generateUniqueStylistSlug(fullName: string): Promise<string> {
  const base = slugifyStylistName(fullName);
  const existing = await (prisma as any).stylistProfile?.findUnique({ where: { slug: base }, select: { id: true } });
  if (!existing) return base;
  return `${base}-${Date.now().toString(36).slice(-4)}`;
}

export function mapStylistRecord(record: any): PublicStylist {
  const packages: StylistPackageItem[] = (record.packages || [])
    .filter((pkg: any) => pkg.isActive !== false)
    .map((pkg: any) => ({
      id: pkg.id,
      stylistId: pkg.stylistId,
      title: pkg.title,
      packageType: pkg.packageType,
      description: pkg.description,
      price: pkg.price,
      duration: pkg.duration,
      includedServices: parseJsonArray(pkg.includedServices),
      sessionsCount: pkg.sessionsCount || 1,
      deliveryMode: pkg.deliveryMode || "Online & Offline",
      location: pkg.location || record.city || "",
      addOns: parseAddOns(pkg.addOns),
      availability: pkg.availability || record.availabilitySchedule || "",
      images: parseJsonArray(pkg.images),
      isActive: pkg.isActive !== false,
    }));

  const visibleReviews: StylistReviewItem[] = (record.reviews || [])
    .filter((rev: any) => rev.isVisible !== false && !rev.isComplaint)
    .map((rev: any) => ({
      id: rev.id,
      customerName: rev.customerName,
      rating: rev.rating,
      comment: rev.comment || "",
      isComplaint: Boolean(rev.isComplaint),
      complaintStatus: rev.complaintStatus || "NONE",
      createdAt: rev.createdAt instanceof Date ? rev.createdAt.toISOString() : String(rev.createdAt),
    }));

  const reviewsCount = visibleReviews.length;
  const rating =
    reviewsCount > 0
      ? visibleReviews.reduce((sum, item) => sum + item.rating, 0) / reviewsCount
      : 0;

  const startingPrice =
    packages.length > 0 ? Math.min(...packages.map((p) => p.price)) : 0;

  return {
    id: record.id,
    slug: record.slug,
    fullName: record.fullName,
    email: record.email,
    phone: record.phone,
    profileImage: record.profileImage || "/femazon-emblem.png",
    city: record.city,
    location: record.location,
    preferredLocations: parseJsonArray(record.preferredLocations),
    experience: record.experience,
    experienceYears: record.experienceYears || 0,
    bio: record.bio,
    specializations: parseJsonArray(record.specializations),
    portfolioImages: parseJsonArray(record.portfolioImages),
    socialLinks: parseSocialLinks(record.socialLinks),
    consultationModes: parseJsonArray(record.consultationModes),
    qualifications: record.qualifications || "",
    availabilitySchedule: record.availabilitySchedule || "By Appointment",
    status: record.status,
    verified: Boolean(record.verified),
    featured: Boolean(record.featured),
    commissionRate: record.commissionRate ?? 15,
    startingPrice,
    rating,
    reviewsCount,
    packages,
    reviews: visibleReviews,
  };
}

export async function getApprovedStylists(): Promise<{ stylists: PublicStylist[]; error: string | null }> {
  try {
    const records = await (prisma as any).stylistProfile?.findMany({
      where: {
        status: "APPROVED",
        isActive: true,
      },
      include: {
        packages: { where: { isActive: true }, orderBy: { price: "asc" } },
        reviews: { where: { isVisible: true, isComplaint: false }, orderBy: { createdAt: "desc" } },
      },
      orderBy: [{ featured: "desc" }, { verified: "desc" }, { createdAt: "desc" }],
    });
    return { stylists: (records || []).map(mapStylistRecord), error: null };
  } catch (err) {
    console.warn("[Stylists] Failed to load approved stylists:", err instanceof Error ? err.message : err);
    return {
      stylists: [],
      error: "The personal stylist directory is temporarily unavailable. Please try again shortly.",
    };
  }
}

export async function getApprovedStylistBySlug(slug: string): Promise<PublicStylist | null> {
  try {
    const record = await (prisma as any).stylistProfile?.findFirst({
      where: {
        slug,
        status: "APPROVED",
        isActive: true,
      },
      include: {
        packages: { where: { isActive: true }, orderBy: { price: "asc" } },
        reviews: { where: { isVisible: true, isComplaint: false }, orderBy: { createdAt: "desc" } },
      },
    });
    return record ? mapStylistRecord(record) : null;
  } catch (err) {
    console.warn("[Stylists] Failed to load stylist by slug:", err instanceof Error ? err.message : err);
    return null;
  }
}

export async function getFeaturedStylists(limit = 4): Promise<PublicStylist[]> {
  try {
    const featured = await (prisma as any).stylistProfile?.findMany({
      where: { status: "APPROVED", isActive: true, featured: true },
      include: {
        packages: { where: { isActive: true }, orderBy: { price: "asc" } },
        reviews: { where: { isVisible: true, isComplaint: false }, orderBy: { createdAt: "desc" } },
      },
      orderBy: [{ verified: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
    if (featured && featured.length > 0) return featured.map(mapStylistRecord);

    const fallback = await (prisma as any).stylistProfile?.findMany({
      where: { status: "APPROVED", isActive: true },
      include: {
        packages: { where: { isActive: true }, orderBy: { price: "asc" } },
        reviews: { where: { isVisible: true, isComplaint: false }, orderBy: { createdAt: "desc" } },
      },
      orderBy: [{ verified: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
    return (fallback || []).map(mapStylistRecord);
  } catch {
    return [];
  }
}
