import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    if (pathname.startsWith("/seller") || pathname.startsWith("/vendor")) {
      if (role !== "VENDOR") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
    
    if (pathname.startsWith("/admin")) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    if (pathname.startsWith("/profile") || pathname.startsWith("/cart") || pathname.startsWith("/orders") || pathname.startsWith("/wishlist")) {
      if (role === "VENDOR") {
        return NextResponse.redirect(new URL("/seller/dashboard", req.url));
      }
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/seller/:path*",
    "/vendor/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/cart",
    "/wishlist",
    "/orders"
  ],
};
