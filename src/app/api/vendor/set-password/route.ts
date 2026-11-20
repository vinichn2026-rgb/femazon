import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyVendorPasswordSetupToken, setVendorPassword } from '@/lib/vendorPasswordSetup';

const setPasswordSchema = z.object({
  token: z.string().min(1, 'Password setup token is required.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .max(100, 'Password must not exceed 100 characters.')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.'),
  confirmPassword: z.string().min(1, 'Please confirm your password.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

/**
 * GET: Validates a password setup token before rendering the form
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Password setup token is missing.' },
        { status: 400 }
      );
    }

    const verification = await verifyVendorPasswordSetupToken(token);

    if (!verification.valid || !verification.user || !verification.vendor) {
      return NextResponse.json(
        { success: false, error: verification.error || 'Invalid or expired setup token.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      shopName: verification.vendor.businessName,
      vendorId: verification.vendor.id,
      email: verification.user.email,
      status: verification.vendor.status,
    });
  } catch (err: any) {
    console.error('[GET /api/vendor/set-password error]:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error validating setup token.' },
      { status: 500 }
    );
  }
}

/**
 * POST: Securely saves the vendor's chosen password
 */
export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    const parsed = setPasswordSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || 'Invalid password details provided.';
      return NextResponse.json({ success: false, message: errorMsg }, { status: 400 });
    }

    const { token, password } = parsed.data;

    // 1. Verify token validity, status, and single-use signature
    const verification = await verifyVendorPasswordSetupToken(token);
    if (!verification.valid || !verification.user || !verification.vendor) {
      return NextResponse.json(
        { success: false, message: verification.error || 'Setup token is invalid or expired.' },
        { status: 400 }
      );
    }

    // 2. Set vendor's password using bcrypt hashing
    const setResult = await setVendorPassword({
      userId: verification.user.id,
      vendorId: verification.vendor.id,
      newPassword: password,
    });

    if (!setResult.success) {
      return NextResponse.json(
        { success: false, message: setResult.error || 'Failed to update password.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password set successfully! Your vendor account is now fully active.',
      loginId: verification.user.email,
      redirect: '/vendor/login',
    });
  } catch (err: any) {
    console.error('[POST /api/vendor/set-password error]:', err);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred while saving your password.' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
