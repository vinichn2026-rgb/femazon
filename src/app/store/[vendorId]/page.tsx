import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StoreClient from "./StoreClient";

export const dynamic = "force-dynamic";

export default async function VendorStorePage({ params }: { params: { vendorId: string } }) {
  const vendorId = parseInt(params.vendorId);
  
  if (isNaN(vendorId)) {
    notFound();
  }

  const vendor = await prisma.user.findUnique({
    where: { 
      id: vendorId,
      role: 'VENDOR'
    },
    include: {
      vendorProfile: true,
      products: {
        where: { approvalStatus: 'APPROVED' },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!vendor || !vendor.vendorProfile) {
    notFound();
  }

  // Determine Location from Address
  const addressParts = vendor.vendorProfile.address?.split(',') || [];
  const city = addressParts.length > 1 ? addressParts[addressParts.length - 2].trim() : "Unknown Location";

  const safeVendor = {
    id: vendor.id,
    businessName: vendor.vendorProfile.businessName,
    description: vendor.vendorProfile.description || "Welcome to our store! We offer the best products for your lifestyle.",
    location: city,
    joinDate: vendor.createdAt.getFullYear().toString(),
    products: vendor.products
  };

  return <StoreClient vendor={safeVendor} />;
}
