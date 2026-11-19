import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StoreClient from "@/app/store/[vendorId]/StoreClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.toLowerCase().trim();

  const profile = await prisma.vendorProfile.findFirst({
    where: {
      OR: [
        { slug: slug },
        { id: isNaN(Number(slug)) ? undefined : Number(slug) }
      ],
      status: 'APPROVED'
    },
    select: {
      businessName: true,
      description: true
    }
  });

  if (!profile) return { title: "Store Not Found | Femazon" };

  return {
    title: `${profile.businessName} | Official Boutique on Femazon`,
    description: profile.description || `Discover curated designer fashion from ${profile.businessName} on Femazon.`
  };
}

export default async function DynamicVendorShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.toLowerCase().trim();

  if (!slug) notFound();

  // 1. Fetch vendor dynamically from PostgreSQL by slug or ID
  // Strict Requirement: Ensure suspended, rejected or pending vendors are NOT publicly displayed
  const profile = await prisma.vendorProfile.findFirst({
    where: {
      OR: [
        { slug: slug },
        { id: isNaN(Number(slug)) ? undefined : Number(slug) }
      ],
      status: 'APPROVED'
    },
    include: {
      user: {
        include: {
          products: {
            where: { approvalStatus: 'APPROVED' },
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  });

  if (!profile || !profile.user || profile.status !== 'APPROVED' || profile.user.role !== 'VENDOR') {
    notFound();
  }

  // 2. Determine Location from Address
  const addressParts = profile.address?.split(',') || [];
  const city = addressParts.length > 1 ? addressParts[addressParts.length - 2].trim() : "Unknown Location";

  // 3. Format safe vendor data for existing StoreClient architecture
  const safeVendor = {
    id: profile.user.id,
    businessName: profile.businessName,
    description: profile.description || "Welcome to our boutique! Explore our curated designer collections.",
    location: city,
    joinDate: profile.createdAt.getFullYear().toString(),
    products: profile.user.products || []
  };

  return <StoreClient vendor={safeVendor} />;
}
