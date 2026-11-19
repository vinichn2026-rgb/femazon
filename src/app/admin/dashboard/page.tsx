import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getSessionFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminClient from "../AdminClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Super Admin Control Centre | Femazon Luxury Marketplace",
  description: "Platform-level governance for Women's Gallery Product Marketplace and Personal Styling Services.",
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

  // 4. Fetch all marketplace data across Product & Service divisions in parallel
  const [
    users, 
    vendors, 
    stylists,
    products, 
    categories, 
    orders, 
    stylistBookings
  ] = await Promise.all([
    // Customers & platform users
    prisma.user.findMany({ 
      where: { role: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' } 
    }).catch(() => []),

    // External Product Vendors (Women's Gallery)
    prisma.vendorProfile.findMany({ 
      include: { 
        user: { 
          include: { 
            products: true 
          } 
        } 
      }, 
      orderBy: { createdAt: 'desc' } 
    }).catch(() => []),

    // Service Providers (Personal Styling Professionals)
    prisma.stylistProfile.findMany({ 
      include: { 
        user: true, 
        packages: true, 
        portfolios: true, 
        bookings: true 
      }, 
      orderBy: { createdAt: 'desc' } 
    }).catch(() => []),

    // Vendor submitted products
    prisma.product.findMany({ 
      include: { 
        vendor: { 
          include: { 
            vendorProfile: true 
          } 
        } 
      }, 
      orderBy: { createdAt: 'desc' } 
    }).catch(() => []),

    // Product Marketplace categories
    prisma.category.findMany({ 
      orderBy: { createdAt: 'asc' } 
    }).catch(() => []),

    // Customer product orders (with line items & vendor linking)
    prisma.order.findMany({ 
      include: { 
        user: true, 
        items: { 
          include: { 
            product: { 
              include: { 
                vendor: { 
                  include: { 
                    vendorProfile: true 
                  } 
                } 
              } 
            } 
          } 
        } 
      },
      orderBy: { createdAt: 'desc' }
    }).catch(() => []),

    // Personal Styling service bookings
    prisma.stylistBooking.findMany({
      include: { 
        stylist: true, 
        package: true, 
        user: true 
      },
      orderBy: { createdAt: 'desc' }
    }).catch(() => [])
  ]);

  return (
    <AdminClient 
      user={user}
      users={users} 
      vendors={vendors} 
      stylists={stylists}
      products={products} 
      categories={categories} 
      orders={orders} 
      bookings={stylistBookings}
    />
  );
}
