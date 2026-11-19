import React from "react";
import { Metadata } from "next";
import { getApprovedPartnerDirectory } from "@/lib/partnerDirectory";
import { BrandsClient, BrandListing } from "./BrandsClient";

export const metadata: Metadata = {
  title: "Our Brands & Boutiques | Femazon Marketplace",
  description:
    "Discover verified independent boutiques, women's fashion ateliers, generational weavers and artisanal brands across Coimbatore, Chennai and India on Femazon.",
};

interface BrandsPageProps {
  searchParams?: Promise<{ city?: string; category?: string }>;
}

export default async function BrandsPage({ searchParams }: BrandsPageProps) {
  const resolved = (await searchParams) || {};
  
  const rawBoutiques = await getApprovedPartnerDirectory().catch(() => []);

  const brands: BrandListing[] = (rawBoutiques as any[]).map((b: any) => ({
    id: b.id,
    name: b.businessName || b.name,
    brandName: b.businessName || b.name,
    category: b.categories || "Fashion & Couture",
    city: b.location || "Coimbatore",
    rating: 4.9,
    featured: true,
    image: b.portfolioUrl || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=600",
    badge: "VERIFIED SELLER",
    description: b.description || `Curated collections and direct boutique customer service from ${b.location || "India"}.`,
    productCount: 45,
    storeUrl: b.storeUrl || `/shop?brand=${encodeURIComponent(b.businessName || b.name)}`,
  }));

  return (
    <BrandsClient
      initialBrands={brands}
      initialCity={resolved.city || "all"}
    />
  );
}
