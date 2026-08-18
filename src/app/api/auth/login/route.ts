import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/session';

const loginSchema = z.object({
  email: z.string().trim().email('Email must be valid'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
  }

  const parse = loginSchema.safeParse(body);
  if (!parse.success) {
    const message = parse.error.errors[0]?.message ?? 'Invalid login data';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }

  const { email, password } = parse.data;

  const user = await prisma.user.findUnique({ where: { email } });

  // Do not reveal whether the user exists. Use same error message for both cases.
  const genericError = NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });

  if (!user) return genericError;

  const valid = await bcrypt.compare(String(password), String(user.password));
  if (!valid) return genericError;

  // Create a signed session token (HMAC) stored in an HttpOnly cookie.
  const secret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret';
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 60 * 60 * 24 * 7; // 7 days

  const sessionPayload = {
    sub: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + expiresIn,
  };

  const token = signToken(sessionPayload, secret);

  const isProd = process.env.NODE_ENV === 'production';
  const cookieParts = [
    `femazon_session=${token}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=${expiresIn}`,
  ];
  if (isProd) cookieParts.push('Secure');

  const res = NextResponse.json(
    {
      success: true,
      user: {
        id: String(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    { status: 200 }
  );

  res.headers.append('Set-Cookie', cookieParts.join('; '));

  return res;
}

export const runtime = 'nodejs';
