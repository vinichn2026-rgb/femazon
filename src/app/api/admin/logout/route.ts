import { NextResponse } from 'next/server';

function createClearedCookieResponse(response: NextResponse) {
  const expiredCookies = [
    'femazon_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
    'next-auth.session-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
    '__Secure-next-auth.session-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure',
    'next-auth.callback-url=; Path=/; Max-Age=0; SameSite=Lax',
    'next-auth.csrf-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
  ];

  expiredCookies.forEach(cookie => {
    response.headers.append('Set-Cookie', cookie);
  });

  return response;
}

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Admin logged out successfully."
  });
  return createClearedCookieResponse(response);
}

export async function GET(request: Request) {
  const url = new URL('/admin', request.url);
  const response = NextResponse.redirect(url);
  return createClearedCookieResponse(response);
}
