import { NextResponse } from 'next/server';

export function GET(request: Request) {
  const url = new URL('/', request.url);
  const cookieValue = ['femazon_session='];
  cookieValue.push('Path=/');
  cookieValue.push('Max-Age=0');
  cookieValue.push('HttpOnly');
  cookieValue.push('SameSite=Lax');
  if (process.env.NODE_ENV === 'production') {
    cookieValue.push('Secure');
  }

  const response = NextResponse.redirect(url);
  response.headers.set('Set-Cookie', cookieValue.join('; '));
  return response;
}
