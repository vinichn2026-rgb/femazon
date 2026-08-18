import { NextRequest, NextResponse } from 'next/server';

async function importKey(secret: string) {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

function base64urlToBase64(input: string) {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  while (input.length % 4) input += '=';
  return input;
}

function base64urlToUtf8(input: string) {
  try {
    const b64 = base64urlToBase64(input);
    if (typeof atob === 'function') {
      return decodeURIComponent(Array.from(atob(b64), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    }
    // Node fallback
    return Buffer.from(b64, 'base64').toString('utf8');
  } catch (err) {
    return null;
  }
}

async function verifyToken(token: string, secret: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encoded, signature] = parts;

    const key = await importKey(secret);
    const enc = new TextEncoder();
    const data = enc.encode(encoded);
    const sigExpected = await crypto.subtle.sign('HMAC', key, data);

    // convert expected signature to base64url
    const sigExpectedB64 = (() => {
      if (typeof Buffer !== 'undefined') return Buffer.from(sigExpected).toString('base64');
      let str = '';
      const arr = new Uint8Array(sigExpected);
      for (let i = 0; i < arr.length; i++) str += String.fromCharCode(arr[i]);
      return btoa(str);
    })();

    const sigExpectedUrl = sigExpectedB64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    // constant-time compare
    if (sigExpectedUrl.length !== signature.length) return null;
    let diff = 0;
    for (let i = 0; i < signature.length; i++) diff |= signature.charCodeAt(i) ^ sigExpectedUrl.charCodeAt(i);
    if (diff !== 0) return null;

    const payloadJson = base64urlToUtf8(encoded);
    if (!payloadJson) return null;
    const payload = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) return null;
    return payload;
  } catch (err) {
    return null;
  }
}

const customerPaths = ['/profile', '/cart', '/bookings', '/orders', '/wishlist'];
const vendorPaths = ['/vendor/dashboard', '/vendor/products', '/vendor/services', '/vendor/bookings'];
const adminPaths = ['/admin/dashboard', '/admin/users', '/admin/vendors', '/admin/products', '/admin/services', '/admin/bookings'];

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const isVendorRoute = vendorPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const isCustomerRoute = customerPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const isAdminRoute = adminPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (!isVendorRoute && !isCustomerRoute && !isAdminRoute) return NextResponse.next();

  const cookie = req.headers.get('cookie') || '';
  const match = cookie.split(';').map((c) => c.trim()).find((c) => c.startsWith('femazon_session='));
  if (!match) {
    const url = new URL('/login', req.url);
    url.searchParams.set('returnTo', pathname + search);
    return NextResponse.redirect(url);
  }

  const token = match.split('=')[1];
  const secret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret';
  const payload = await verifyToken(token, secret);

  if (!payload) {
    const url = new URL('/login', req.url);
    url.searchParams.set('returnTo', pathname + search);
    return NextResponse.redirect(url);
  }

  const role = payload.role;

  if (isVendorRoute) {
    // Only VENDOR allowed. ADMIN redirected to admin dashboard; others to /unauthorized
    if (role === 'VENDOR') return NextResponse.next();
    if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (isAdminRoute) {
    // Only ADMIN allowed. Others denied.
    if (role === 'ADMIN') return NextResponse.next();
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (isCustomerRoute) {
    // CUSTOMER allowed. Non-CUSTOMER redirected to respective dashboards
    if (role === 'CUSTOMER') return NextResponse.next();
    if (role === 'VENDOR') return NextResponse.redirect(new URL('/vendor/dashboard', req.url));
    if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile',
    '/profile/:path*',
    '/cart',
    '/cart/:path*',
    '/bookings',
    '/bookings/:path*',
    '/orders',
    '/orders/:path*',
    '/wishlist',
    '/wishlist/:path*',
    '/vendor/dashboard',
    '/vendor/dashboard/:path*',
    '/vendor/products',
    '/vendor/products/:path*',
    '/vendor/services',
    '/vendor/services/:path*',
    '/vendor/bookings',
    '/vendor/bookings/:path*',
    '/admin/dashboard',
    '/admin/dashboard/:path*',
    '/admin/users',
    '/admin/users/:path*',
    '/admin/vendors',
    '/admin/vendors/:path*',
    '/admin/products',
    '/admin/products/:path*',
    '/admin/services',
    '/admin/services/:path*',
    '/admin/bookings',
    '/admin/bookings/:path*',
  ],
};
