import { NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/auth';

export async function GET(request: Request) {
  const payload = getSessionFromCookie(request.headers.get('cookie') || undefined);
  if (!payload) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });

  // Return safe user info only
  const safe = {
    id: String(payload.sub),
    name: payload.name,
    email: payload.email,
    role: payload.role,
  };

  return NextResponse.json({ success: true, user: safe }, { status: 200 });
}
