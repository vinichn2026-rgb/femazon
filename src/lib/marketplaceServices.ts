import { MARKETPLACE_CATEGORIES, type MarketplaceCategory, type MarketplaceProfessional } from "@/data/marketplaceData";
import { getApprovedPartnerDirectory } from "@/lib/partnerDirectory";
import { prisma } from "@/lib/prisma";

const SERVICE_CATEGORY_KEYWORDS: Record<string, string[]> = {
  beauty: ["beauty", "parlour", "parlor", "makeup", "salon", "hair", "stylist", "skin", "skincare", "nail", "mehendi", "mehndi", "henna"],
  styling: ["styling", "stylist", "fashion", "wardrobe", "shopping assistant", "outfit consultation"],

};

const GENERIC_SUBCATEGORY_TERMS = new Set([
  "and",
  "artist",
  "artists",
  "service",
  "services",
  "professional",
  "professionals",
]);

function getServiceSubcategory(category: MarketplaceCategory, serviceText: string) {
  return category.subcategories.find((subcategory) => {
    const terms = `${subcategory.name} ${subcategory.slug.replace(/-/g, " ")}`
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 3 && !GENERIC_SUBCATEGORY_TERMS.has(term));
    return terms.some((term) => serviceText.includes(term));
  })?.name;
}

export async function getMarketplaceProfessionals(category: MarketplaceCategory): Promise<{
  professionals: MarketplaceProfessional[];
  error: string | null;
}> {
  let directoryError: string | null = null;
  let professionals: MarketplaceProfessional[] = [];
  try {
    const services = await prisma.service.findMany({
      where: { providers: { some: {} } },
      include: { providers: { orderBy: { rating: "desc" } } },
      orderBy: { name: "asc" },
    });
    const keywords = SERVICE_CATEGORY_KEYWORDS[category.id] || [];
    professionals = services.flatMap((service) => {
      const serviceText = `${service.name} ${service.slug} ${service.description || ""}`.toLowerCase();
      if (!keywords.some((keyword) => serviceText.includes(keyword))) return [];

      const subcategory = getServiceSubcategory(category, serviceText) || service.name;
      return service.providers.map((provider): MarketplaceProfessional => ({
        id: String(provider.id),
        providerId: provider.id,
        serviceId: service.id,
        name: provider.name,
        category: category.name,
        subcategory,
        role: service.name,
        location: "",
        rating: provider.reviewCount > 0 ? provider.rating : 0,
        reviewsCount: provider.reviewCount,
        experience: provider.bio?.match(/\d+\+?\s+years?/i)?.[0] || "",
        startingPrice: service.basePrice,
        image: provider.image || service.image || "/femazon-emblem.png",
        badges: [],
        bio: provider.bio || service.description || "",
        availability: "",
        verified: false,
        servicesOffered: [{
          name: service.name,
          duration: "",
          price: service.basePrice,
          description: service.description || "",
        }],
      }));
    });
  } catch (error) {
    console.error(
      `[MarketplaceServices] Failed to load ${category.name}:`,
      error instanceof Error ? error.message : error
    );
    directoryError = "The service directory is temporarily unavailable. Please try again later.";
  }

  try {
    const approvedPartners = await getApprovedPartnerDirectory({ type: "SERVICE_PROVIDER" });
    const keywords = SERVICE_CATEGORY_KEYWORDS[category.id] || [];
    const approvedProfiles = approvedPartners.flatMap((partner): MarketplaceProfessional[] => {
      const partnerText = `${partner.categories} ${partner.businessName} ${partner.serviceInfo} ${partner.description}`.toLowerCase();
      if (!keywords.some((keyword) => partnerText.includes(keyword))) return [];

      const startingPriceText = partner.pricingInfo.match(/(?:₹|rs\.?\s*)\s*([\d,]+)/i)?.[1]
        || partner.pricingInfo.match(/([\d,]+)/)?.[1];
      const startingPrice = startingPriceText ? Number(startingPriceText.replace(/,/g, "")) : 0;
      const role = partner.categories || category.name;
      const servicesOffered = partner.serviceInfo
        ? partner.serviceInfo.split(/[,;\n]/).map((name) => name.trim()).filter(Boolean).slice(0, 4)
        : [role];

      return [{
        id: partner.id,
        name: partner.name,
        businessName: partner.businessName,
        category: category.name,
        subcategory: getServiceSubcategory(category, partnerText) || role,
        role,
        location: partner.location,
        rating: 0,
        reviewsCount: 0,
        experience: partner.experience,
        pricingDetails: partner.pricingInfo,
        startingPrice: Number.isFinite(startingPrice) ? startingPrice : 0,
        image: "/femazon-emblem.png",
        badges: ["Femazon approved"],
        bio: partner.description || partner.serviceInfo,
        portfolioUrl: partner.portfolioUrl,
        contactEmail: partner.email,
        contactPhone: partner.phone,
        verified: true,
        servicesOffered: servicesOffered.map((name) => ({
          name,
          duration: "",
          price: Number.isFinite(startingPrice) ? startingPrice : 0,
          description: partner.serviceInfo || partner.description,
        })),
      }];
    });

    professionals = [...professionals, ...approvedProfiles];
  } catch (error) {
    console.error("[MarketplaceServices] Failed to load approved partner profiles:", error);
    directoryError ||= "Approved partner profiles are temporarily unavailable.";
  }

  return { professionals, error: directoryError };
}

export { MARKETPLACE_CATEGORIES };
