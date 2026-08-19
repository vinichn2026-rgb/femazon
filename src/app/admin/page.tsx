import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user || user.role !== 'ADMIN') {
    redirect("/");
  }

  // Fetch all necessary admin data
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  const vendors = await prisma.vendorProfile.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
  const products = await prisma.product.findMany({ include: { vendor: true }, orderBy: { createdAt: 'desc' } });
  const categories = await prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
  
  const orders = await prisma.order.findMany({ 
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  });
  
  const bookings = await prisma.serviceBooking.findMany({
    include: { user: true, service: true, provider: true },
    orderBy: { createdAt: 'desc' }
  });

  const services = await prisma.service.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <AdminClient 
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
