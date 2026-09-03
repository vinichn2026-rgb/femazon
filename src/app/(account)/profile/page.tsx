import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getSessionFromCookie } from "@/lib/auth";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  let userEmail = session?.user?.email;

  if (!userEmail) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('femazon_session')?.value;
    const authSession = getSessionFromCookie(
      sessionCookie ? `femazon_session=${sessionCookie}` : undefined
    );
    if (authSession?.email) {
      userEmail = authSession.email;
    }
  }

  let dbUser = null;
  if (userEmail) {
    dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        addresses: true,
        _count: {
          select: {
            orders: true,
          }
        }
      }
    });
  }

  const nameParts = (dbUser?.name || "Priya Sharma").trim().split(' ');
  const firstName = nameParts[0] || "Priya";
  const lastName = nameParts.slice(1).join(' ') || "Sharma";

  // Convert dates and strip sensitive data
  const safeUser = {
    name: dbUser?.name || `${firstName} ${lastName}`,
    firstName: firstName,
    lastName: lastName,
    email: dbUser?.email || userEmail || "priya.sharma@femazon.com",
    phone: dbUser?.phone || "+91 98765 43210",
    role: dbUser?.role || "CUSTOMER",
    joinDate: dbUser?.createdAt ? dbUser.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "September 2026",
    addresses: dbUser?.addresses || [],
    stats: {
      orders: dbUser?._count?.orders || 2,
      wishlist: 4
    }
  };

  return <ProfileClient user={safeUser} />;
}
