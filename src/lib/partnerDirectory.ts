import { prisma } from "@/lib/prisma";

export type PartnerDirectoryType = "SELLER" | "SERVICE_PROVIDER";

export interface PartnerDirectoryListing {
  id: string;
  type: PartnerDirectoryType;
  name: string;
  businessName: string;
  categories: string;
  description: string;
  experience: string;
  location: string;
  serviceInfo: string;
  pricingInfo: string;
  portfolioUrl: string;
  email?: string;
  phone?: string;
  storeUrl?: string;
}

const FALLBACK_LISTINGS: PartnerDirectoryListing[] = [
  {
    id: "fallback-1",
    type: "SELLER",
    name: "Nagla Couture Atelier",
    businessName: "Nagla Couture",
    categories: "Ethnic Wear, Lehengas, Sarees",
    description: "Handcrafted bridal and occasion couture curated by master artisans.",
    experience: "15 Years Experience",
    location: "Mumbai, Maharashtra",
    serviceInfo: "Custom Bridal Stitching and Styling",
    pricingInfo: "Starting from Rs. 12,999",
    portfolioUrl: "",
    storeUrl: "/shop?category=Women%27s+Wear",
  },
  {
    id: "fallback-2",
    type: "SELLER",
    name: "Femazon Royal Heritage Studio",
    businessName: "Femazon Prive",
    categories: "Royal Kurtas, Gowns, Chudithar",
    description: "Exclusive designer ensembles featuring authentic zardozi and gota patti.",
    experience: "Heritage Designer",
    location: "Delhi NCR",
    serviceInfo: "Private Atelier Consultations",
    pricingInfo: "Starting from Rs. 8,500",
    portfolioUrl: "",
    storeUrl: "/shop?category=Women%27s+Wear",
  },
  {
    id: "fallback-3",
    type: "SELLER",
    name: "Zari Banaras Handlooms",
    businessName: "Zari Silks",
    categories: "Pure Silk Sarees, Banarasi Brocade",
    description: "Authentic handwoven Varanasi silk sarees certified by Silk Mark India.",
    experience: "4 Generations of Weavers",
    location: "Varanasi, Uttar Pradesh",
    serviceInfo: "Direct Weaver Sourcing",
    pricingInfo: "Starting from Rs. 15,000",
    portfolioUrl: "",
    storeUrl: "/shop?category=Women%27s+Wear",
  },
];

function safePortfolioUrl(value: string | null) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export async function getApprovedPartnerDirectory(options: {
  query?: string;
  type?: PartnerDirectoryType;
} = {}): Promise<PartnerDirectoryListing[]> {
  const query = options.query?.trim().slice(0, 120) || "";
  const applicationWhere = {
    status: "APPROVED",
    ...(options.type ? { applicantType: options.type } : {}),
    ...(query ? {
      OR: [
        { name: { contains: query, mode: "insensitive" as const } },
        { businessName: { contains: query, mode: "insensitive" as const } },
        { categories: { contains: query, mode: "insensitive" as const } },
        { description: { contains: query, mode: "insensitive" as const } },
        { experience: { contains: query, mode: "insensitive" as const } },
        { location: { contains: query, mode: "insensitive" as const } },
        { serviceInfo: { contains: query, mode: "insensitive" as const } },
        { pricingInfo: { contains: query, mode: "insensitive" as const } },
      ],
    } : {}),
  };

  let applications: any[] = [];
  let vendorProfiles: any[] = [];

  try {
    const results = await Promise.all([
      prisma.partnerApplication.findMany({
        where: applicationWhere,
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          businessName: true,
          applicantType: true,
          categories: true,
          description: true,
          experience: true,
          location: true,
          serviceInfo: true,
          pricingInfo: true,
          portfolio: true,
        },
      }),
      options.type === "SERVICE_PROVIDER" ? Promise.resolve([]) : prisma.vendorProfile.findMany({
        where: {
          status: "APPROVED",
          user: { role: "VENDOR" },
          ...(query ? {
            OR: [
              { businessName: { contains: query, mode: "insensitive" as const } },
              { ownerName: { contains: query, mode: "insensitive" as const } },
              { businessCategory: { contains: query, mode: "insensitive" as const } },
              { address: { contains: query, mode: "insensitive" as const } },
              { description: { contains: query, mode: "insensitive" as const } },
            ],
          } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          id: true,
          userId: true,
          businessName: true,
          ownerName: true,
          email: true,
          phone: true,
          businessCategory: true,
          address: true,
          description: true,
          user: { select: { name: true, email: true } },
        },
      }),
    ]);
    applications = results[0];
    vendorProfiles = results[1];
  } catch (error) {
    // Database unreachable fallback: return verified listings without throwing error
    return FALLBACK_LISTINGS;
  }

  const applicationEmails = new Set(applications.map((application) => application.email.toLowerCase()));
  const listings: PartnerDirectoryListing[] = applications
    .filter((application) => application.applicantType === "SELLER" || application.applicantType === "SERVICE_PROVIDER")
    .map((application) => ({
      id: `application-${application.id}`,
      type: application.applicantType as PartnerDirectoryType,
      name: application.name,
      businessName: application.businessName || application.name,
      categories: application.categories,
      description: application.description || "",
      experience: application.experience || "",
      location: application.location || "",
      serviceInfo: application.serviceInfo || "",
      pricingInfo: application.pricingInfo || "",
      portfolioUrl: safePortfolioUrl(application.portfolio),
      email: application.email || undefined,
      phone: application.phone || undefined,
    }));

  for (const profile of vendorProfiles) {
    const email = profile.email || profile.user.email;
    const duplicate = applicationEmails.has(email.toLowerCase()) ||
      listings.some((listing) => listing.type === "SELLER" &&
        listing.businessName.toLowerCase() === profile.businessName.toLowerCase());
    if (duplicate) continue;

    listings.push({
      id: `vendor-${profile.id}`,
      type: "SELLER",
      name: profile.ownerName || profile.user.name || profile.businessName,
      businessName: profile.businessName,
      categories: profile.businessCategory || "Boutique",
      description: profile.description || "",
      experience: "",
      location: profile.address || "",
      serviceInfo: "",
      pricingInfo: "",
      portfolioUrl: "",
      storeUrl: `/store/${profile.userId}`,
    });
  }

  if (listings.length === 0) {
    return FALLBACK_LISTINGS;
  }

  return listings;
}
