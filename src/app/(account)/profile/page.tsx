import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Fetch complete user data including latest address
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      addresses: true,
      _count: {
        select: {
          orders: true,
          
        }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  // Convert dates and strip sensitive data
  const safeUser = {
    name: user.name || "Valued Customer",
    email: user.email,
    phone: user.phone || "Not provided",
    role: user.role,
    joinDate: user.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    addresses: user.addresses,
    stats: {
      orders: user._count.orders,
      wishlist: 0 // We'll mock wishlist count for now since it counts relations
    }
  };

  return <ProfileClient user={safeUser} />;
}

