import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function VendorDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      vendorProfile: true
    }
  });

  if (!user || user.role !== 'VENDOR' || !user.vendorProfile) {
    redirect("/seller/register");
  }

  // Pre-fetch some data or just let the client fetch it.
  // For simplicity, we'll let the client fetch products and orders.

  return <DashboardClient vendorProfile={user.vendorProfile} />;
}
