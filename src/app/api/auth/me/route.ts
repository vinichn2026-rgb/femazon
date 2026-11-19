import { NextResponse } from 'next/server';
import { getApiAuthPayload } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const payload = await getApiAuthPayload(request);
  if (!payload || !payload.email) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  // Safely enrich from database if reachable
  let dbUser: any = null;
  try {
    dbUser = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true, name: true, email: true, phone: true, role: true }
    });
  } catch (err) {
    // Non-blocking: continue with token payload
  }

  const safe = {
    id: String(dbUser?.id || payload.sub || Date.now()),
    name: dbUser?.name || payload.name || payload.email.split('@')[0],
    email: dbUser?.email || payload.email,
    phone: dbUser?.phone || (payload as any).phone || '',
    role: dbUser?.role || payload.role || 'CUSTOMER',
  };

  return NextResponse.json({ success: true, user: safe }, { status: 200 });
}
