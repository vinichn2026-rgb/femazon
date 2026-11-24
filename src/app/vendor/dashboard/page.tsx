import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getSessionFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import VendorDashboardClient from "@/components/vendor/VendorDashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Vendor Dashboard | Femazon Partner Portal",
  description: "Manage products, orders, and boutique performance on Femazon.",
};

export default async function VendorDashboardPage() {
  // 1. Check server-side session from NextAuth or femazon_session cookie
  let userEmail: string | undefined;

  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    userEmail = session.user.email;
  } else {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('femazon_session')?.value;
    const authSession = getSessionFromCookie(
      sessionCookie ? `femazon_session=${sessionCookie}` : undefined
    );
    if (authSession?.email) {
      userEmail = authSession.email;
    }
  }

  // 2. Strict Protection: If no authenticated session exists, redirect to /vendor/login
  if (!userEmail) {
    redirect("/vendor/login");
  }

  // 3. Strict Role Separation: Validate user in database
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      vendorProfile: true
    }
  });

  // If user does not exist or user role is NOT VENDOR, block and redirect to /vendor/login
  if (!user || user.role !== 'VENDOR') {
    redirect("/vendor/login");
  }

  // 4. Verify vendor approval status and completed password setup on the server
  const vendorProfile = user.vendorProfile;
  if (!vendorProfile || vendorProfile.status !== 'APPROVED') {
    redirect(`/vendor/login?error=${encodeURIComponent(vendorProfile?.status || 'PENDING')}`);
  }

  if ((vendorProfile as any).passwordSetupCompleted === false) {
    redirect("/vendor/login?error=PASSWORD_SETUP_REQUIRED");
  }

  return (
    <VendorDashboardClient 
      vendorProfile={vendorProfile} 
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }} 
    />
  );
}
