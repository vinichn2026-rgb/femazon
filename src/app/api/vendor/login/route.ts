import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/session';

const vendorLoginSchema = z.object({
  emailOrId: z.string().trim().min(1, 'Vendor ID or Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body' }, { status: 400 });
  }

  const parsed = vendorLoginSchema.safeParse(body);
  if (!parsed.success) {
    const errorMsg = parsed.error.errors[0]?.message || 'Invalid Vendor ID or Password';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 400 });
  }

  const { emailOrId, password } = parsed.data;

  // Generic 401 error response to prevent user enumeration
  const invalidAuthResponse = NextResponse.json(
    { success: false, message: 'Invalid Vendor ID or Password' },
    { status: 401 }
  );

  let user: any = null;

  // 1. Try finding by email
  if (emailOrId.includes('@')) {
    user = await prisma.user.findUnique({
      where: { email: emailOrId.toLowerCase() },
      include: { vendorProfile: true }
    });
  } else {
    // 2. Try finding by numeric ID or VendorProfile ID
    const numericId = parseInt(emailOrId, 10);
    if (!isNaN(numericId)) {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: numericId },
            { vendorProfile: { is: { id: numericId } } }
          ]
        },
        include: { vendorProfile: true }
      });
    } else {
      // Try searching for vendor by phone or business name
      const profile = await prisma.vendorProfile.findFirst({
        where: {
          OR: [
            { phone: emailOrId },
            { email: emailOrId.toLowerCase() }
          ]
        },
        include: { user: true }
      });
      if (profile?.user) {
        user = { ...profile.user, vendorProfile: profile };
      }
    }
  }

  if (!user) {
    return invalidAuthResponse;
  }

  // 3. Check password hash
  const isValidPassword = await bcrypt.compare(String(password), String(user.password));
  if (!isValidPassword) {
    return invalidAuthResponse;
  }

  // 4. Strict Role Separation: Must be VENDOR role
  if (user.role !== 'VENDOR') {
    return invalidAuthResponse;
  }

  // 5. Ensure vendor profile exists or create standard profile
  let vendorProfile = user.vendorProfile;
  if (!vendorProfile) {
    vendorProfile = await prisma.vendorProfile.create({
      data: {
        userId: user.id,
        businessName: user.name || 'Femazon Partner Boutique',
        email: user.email,
        phone: user.phone || '',
        status: 'APPROVED'
      }
    });
  }

  // 6. Generate signed HMAC token with VENDOR role
  const secret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret';
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 60 * 60 * 24 * 7; // 7 days

  const sessionPayload = {
    sub: String(user.id),
    name: user.name || vendorProfile.businessName || 'Vendor Partner',
    email: user.email,
    role: 'VENDOR',
    vendorId: vendorProfile.id,
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
      message: 'Vendor authentication successful ✓',
      redirect: '/vendor/dashboard',
      user: {
        id: String(user.id),
        name: user.name,
        email: user.email,
        role: 'VENDOR',
        vendorId: vendorProfile.id,
        businessName: vendorProfile.businessName
      },
    },
    { status: 200 }
  );

  res.headers.append('Set-Cookie', cookieParts.join('; '));
  return res;
}

export const runtime = 'nodejs';
