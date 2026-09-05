import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getSessionFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminLoginClient from "./AdminLoginClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Portal Login | Femazon",
  description: "Secure administrator access to Femazon platform operations.",
};

export default async function AdminLoginPage() {
  // 1. Check if user already has an active session
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

  // 2. If authenticated as ADMIN in DB, redirect directly to dashboard
  if (userEmail) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { role: true }
    });

    if (user && user.role === 'ADMIN') {
      redirect("/admin/dashboard");
    }
  }

  // Otherwise, show Admin Login page
  return <AdminLoginClient />;
}
