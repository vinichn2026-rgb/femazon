import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getSessionFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminProfileClient } from "./AdminProfileClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Profile | Femazon Luxury Marketplace",
  description: "Administrator profile details and platform governance credentials.",
};

export default async function AdminProfilePage() {
  let userEmail: string | undefined;

  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    userEmail = session.user.email;
  } else {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("femazon_session")?.value;
    const authSession = getSessionFromCookie(
      sessionCookie ? `femazon_session=${sessionCookie}` : undefined
    );
    if (authSession?.email) {
      userEmail = authSession.email;
    }
  }

  if (!userEmail) {
    redirect("/admin");
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/admin");
  }

  return <AdminProfileClient user={user} />;
}
