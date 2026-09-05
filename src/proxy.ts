import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read femazon_session cookie or next-auth session cookie
  const sessionCookie = req.cookies.get("femazon_session")?.value;
  let role: string | null = null;

  if (sessionCookie) {
    try {
      const [encoded] = sessionCookie.split('.');
      if (encoded) {
        // Base64 decode payload JSON
        const decoded = Buffer.from(encoded, 'base64').toString('utf8');
        const payload = JSON.parse(decoded);
        const now = Math.floor(Date.now() / 1000);
        if (!payload.exp || now <= payload.exp) {
          role = payload.role || null;
        }
      }
    } catch {}
  }

  // 1. Protected Admin Dashboard Routes
  if (pathname.startsWith("/admin/dashboard") || pathname === "/admin/products" || pathname === "/admin/vendors" || pathname === "/admin/users" || pathname === "/admin/bookings" || pathname === "/admin/services") {
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // 2. Protected Vendor Dashboard Routes
  if (pathname.startsWith("/vendor/dashboard") || pathname.startsWith("/seller/dashboard")) {
    if (role !== "VENDOR") {
      return NextResponse.redirect(new URL("/vendor", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/products/:path*",
    "/admin/vendors/:path*",
    "/admin/users/:path*",
    "/admin/bookings/:path*",
    "/admin/services/:path*",
    "/vendor/dashboard/:path*",
    "/seller/dashboard/:path*"
  ],
};
