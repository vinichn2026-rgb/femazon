import { NextResponse } from 'next/server';
import { signToken } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id, name, email, phone, role } = body;

    const userEmail = email || 'member@femazon.luxury';
    const userName = name || 'Femazon Member';
    const userRole = (role === 'ADMIN' || role === 'VENDOR') ? role : 'CUSTOMER';

    // Safely attempt to sync user in database (non-blocking if DB is offline)
    let dbUser: any = null;
    try {
      dbUser = await prisma.user.findUnique({ where: { email: userEmail } });
      if (!dbUser) {
        const dummyPassword = await bcrypt.hash('Femazon@123', 10);
        dbUser = await prisma.user.create({
          data: {
            email: userEmail,
            name: userName,
            phone: phone || null,
            role: userRole,
            password: dummyPassword,
          }
        }).catch(async () => {
          return await prisma.user.findUnique({ where: { email: userEmail } });
        });
      }
    } catch (dbErr) {
      console.warn('[Session Sync] Database query skipped:', dbErr);
    }

    const secret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret';
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 60 * 60 * 24 * 7; // 7 days

    const sessionPayload = {
      sub: String(dbUser?.id || id || Date.now()),
      name: dbUser?.name || userName,
      email: dbUser?.email || userEmail,
      phone: dbUser?.phone || phone || '',
      role: dbUser?.role || userRole,
      iat: now,
      exp: now + expiresIn,
    };

    const token = signToken(sessionPayload, secret);
    const isHttps = request.url.startsWith('https://') || request.headers.get('x-forwarded-proto') === 'https';

    const res = NextResponse.json({
      success: true,
      user: {
        id: sessionPayload.sub,
        name: sessionPayload.name,
        email: sessionPayload.email,
        phone: sessionPayload.phone,
        role: sessionPayload.role,
      },
    });

    res.cookies.set({
      name: 'femazon_session',
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: expiresIn,
      secure: isHttps,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error setting session' }, { status: 500 });
  }
}
