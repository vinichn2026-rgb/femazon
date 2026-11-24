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

  const vendorProfile = user.vendorProfile;

  // 3. Strict Vendor Status & Password Setup Verification
  if (vendorProfile) {
    if (vendorProfile.status === 'PENDING') {
      return NextResponse.json(
        {
          success: false,
          message: 'Your vendor account is pending admin approval. You will receive an approval email with your password setup link once approved.',
        },
        { status: 403 }
      );
    }

    if (vendorProfile.status === 'REJECTED') {
      return NextResponse.json(
        {
          success: false,
          message: 'Your vendor application has been rejected. Please contact Femazon support.',
        },
        { status: 403 }
      );
    }

    if (vendorProfile.status === 'SUSPENDED') {
      return NextResponse.json(
        {
          success: false,
          message: 'Your vendor account has been suspended. Please contact Femazon support.',
        },
        { status: 403 }
      );
    }

    // Approved vendors who have not created a password must use the setup link first
    if (vendorProfile.status === 'APPROVED' && (vendorProfile as any).passwordSetupCompleted === false) {
      return NextResponse.json(
        {
          success: false,
          message: 'Your account is approved, but you have not created your password yet. Please open the "Set Your Password" link sent to your registered email to activate your account.',
          needsPasswordSetup: true,
        },
        { status: 403 }
      );
    }
  }

  // 4. Check password hash
  const isValidPassword = await bcrypt.compare(String(password), String(user.password));
  if (!isValidPassword) {
    return invalidAuthResponse;
  }

  // 5. Strict Role Separation & Final Verification
  if (user.role !== 'VENDOR' || !vendorProfile || vendorProfile.status !== 'APPROVED') {
    return invalidAuthResponse;
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
  const isHttps = request.url.startsWith('https://');

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
