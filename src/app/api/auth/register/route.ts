import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/session';

const registerSchema = z
  .object({
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    name: z.string().trim().optional(),
    email: z.string().trim().email('Please enter a valid email address'),
    phone: z
      .string()
      .trim()
      .min(8, 'Phone number must be at least 8 digits'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
  }

  const parseResult = registerSchema.safeParse(body);

  if (!parseResult.success) {
    const message = parseResult.error.errors[0]?.message ?? 'Invalid registration data';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }

  const { firstName, lastName, name: providedName, email, phone, password } = parseResult.data;

  const fullName = (providedName || `${firstName || ''} ${lastName || ''}`).trim() || 'Femazon Member';

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { success: false, message: 'An account with this email already exists' },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: fullName,
      email,
      phone,
      password: hashedPassword,
      role: 'CUSTOMER',
    },
  });

  // Automatically sign in the user by issuing session cookie
  const secret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret';
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 60 * 60 * 24 * 7; // 7 days

  const sessionPayload = {
    sub: String(newUser.id),
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    iat: now,
    exp: now + expiresIn,
  };

  const token = signToken(sessionPayload, secret);
  const isHttps = request.url.startsWith('https://');

  const res = NextResponse.json({
    success: true,
    message: 'Account created successfully ✓',
    user: {
      id: String(newUser.id),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    }
  }, { status: 201 });

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
