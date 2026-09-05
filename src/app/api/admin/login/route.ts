import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/session';

const adminLoginSchema = z.object({
  emailOrId: z.string().trim().min(1, 'Admin Email or ID is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body' }, { status: 400 });
  }

  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) {
    const errorMsg = parsed.error.errors[0]?.message || 'Invalid Admin ID or Password';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 400 });
  }

  const { emailOrId, password } = parsed.data;

  const invalidAuthResponse = NextResponse.json(
    { success: false, message: 'Invalid Admin ID or Password' },
    { status: 401 }
  );

  let user = null;

  // 1. Try finding by email
  if (emailOrId.includes('@')) {
    user = await prisma.user.findUnique({
      where: { email: emailOrId.toLowerCase() }
    });
  } else {
    // 2. Try finding by numeric user ID
    const numericId = parseInt(emailOrId, 10);
    if (!isNaN(numericId)) {
      user = await prisma.user.findUnique({
        where: { id: numericId }
      });
    }
  }

  if (!user) {
    return invalidAuthResponse;
  }

  // 3. Verify password
  const isValidPassword = await bcrypt.compare(String(password), String(user.password));
  if (!isValidPassword) {
    return invalidAuthResponse;
  }

  // 4. Strict Role Separation: User role must be ADMIN
  if (user.role !== 'ADMIN') {
    return invalidAuthResponse;
  }

  // 5. Generate signed session token with ADMIN role
  const secret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret';
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 60 * 60 * 24 * 7; // 7 days

  const sessionPayload = {
    sub: String(user.id),
    name: user.name || 'Femazon Administrator',
    email: user.email,
    role: 'ADMIN',
    iat: now,
    exp: now + expiresIn,
  };

  const token = signToken(sessionPayload, secret);
  const isHttps = request.url.startsWith('https://');

  const res = NextResponse.json(
    {
      success: true,
      message: 'Admin authentication successful ✓',
      redirect: '/admin/dashboard',
      user: {
        id: String(user.id),
        name: user.name,
        email: user.email,
        role: 'ADMIN'
      },
    },
    { status: 200 }
  );

  res.cookies.set({
    name: 'femazon_session',
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: expiresIn,
    secure: isHttps
  });

  return res;
}

export const runtime = 'nodejs';
