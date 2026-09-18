import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getSessionFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminClient from "../AdminClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | Femazon Control Center",
  description: "Platform management, vendor approvals, orders, and services.",
};

export default async function AdminDashboardPage() {
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

  // 2. Strict Protection: If no authenticated session exists, redirect to /admin
  if (!userEmail) {
    redirect("/admin");
  }

  // 3. Strict Role Separation: Validate user in database
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true, name: true, email: true, role: true }
  });

  // If user does not exist or user role is NOT ADMIN, block and redirect to /admin
  if (!user || user.role !== 'ADMIN') {
    redirect("/admin");
  }

  // 4. Fetch all admin data in parallel using Promise.all for high performance
  const [
    users, 
    vendors, 
    products, 
    categories, 
    orders, 
    bookings, 
    services
  ] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => []),
    prisma.vendorProfile.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } }).catch(() => []),
    prisma.product.findMany({ include: { vendor: true }, orderBy: { createdAt: 'desc' } }).catch(() => []),
    prisma.category.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => []),
    prisma.order.findMany({ 
      include: { user: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    }).catch(() => []),
    prisma.serviceBooking.findMany({
      include: { user: true, service: true, provider: true },
      orderBy: { createdAt: 'desc' }
    }).catch(() => []),
    prisma.service.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => [])
  ]);

  return (
    <AdminClient 
      user={user}
      users={users} 
      vendors={vendors} 
      products={products} 
      categories={categories} 
      orders={orders} 
      bookings={bookings}
      services={services}
    />
  );
}
