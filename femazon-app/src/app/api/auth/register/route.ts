import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z.string().trim().email('Email must be valid'),
    phone: z
      .string()
      .trim()
      .regex(/^\d{10}$/, 'Phone must be valid'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'confirmPassword must match password',
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

  const { name, email, phone, password } = parseResult.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { success: false, message: 'An account with this email already exists' },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'CUSTOMER',
    },
  });

  return NextResponse.json({ success: true, message: 'Account created successfully' }, { status: 201 });
}
