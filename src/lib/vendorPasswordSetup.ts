import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, verifyToken } from '@/lib/session';

const TOKEN_SECRET = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'femazon-vendor-secure-secret-2026';
// Token valid for 72 hours (3 days)
const TOKEN_EXPIRY_SECONDS = 72 * 60 * 60;

interface VendorSetupTokenPayload {
  uid: number;
  vid: number;
  email: string;
  sig: string;
  iat: number;
  exp: number;
  pur: 'vendor_setup';
}

/**
 * Computes a verification signature tied to the user's current password hash and vendor status.
 * When the user changes their password, this signature changes, making the setup link single-use.
 */
function computeSignature(userId: number, currentPasswordHash: string, vendorId: number, status: string): string {
  return crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(`${userId}:${currentPasswordHash}:${vendorId}:${status}`)
    .digest('hex')
    .slice(0, 16);
}

/**
 * Generates a cryptographically signed, single-use, time-limited password setup token for an approved vendor.
 */
export function generateVendorPasswordSetupToken(params: {
  userId: number;
  vendorId: number;
  email: string;
  currentPasswordHash: string;
  vendorStatus: string;
}): string {
  const now = Math.floor(Date.now() / 1000);
  const sig = computeSignature(params.userId, params.currentPasswordHash, params.vendorId, params.vendorStatus);

  const payload: VendorSetupTokenPayload = {
    uid: params.userId,
    vid: params.vendorId,
    email: params.email.toLowerCase().trim(),
    sig,
    iat: now,
    exp: now + TOKEN_EXPIRY_SECONDS,
    pur: 'vendor_setup',
  };

  return signToken(payload, TOKEN_SECRET);
}

export interface VerifyTokenResult {
  valid: boolean;
  error?: string;
  user?: {
    id: number;
    email: string;
    name: string | null;
    role: string;
  };
  vendor?: {
    id: number;
    businessName: string;
    ownerName: string | null;
    email: string | null;
    status: string;
    slug: string | null;
  };
}

/**
 * Validates a vendor password setup token against the database:
 * - Checks HMAC token validity and expiration.
 * - Confirms vendor exists and has APPROVED status.
 * - Confirms token has NOT been used yet (single-use check via password hash signature).
 */
export async function verifyVendorPasswordSetupToken(token: string): Promise<VerifyTokenResult> {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Password setup token is missing.' };
  }

  // 1. Verify HMAC structure and expiration
  const rawPayload = verifyToken(token, TOKEN_SECRET);
  if (!rawPayload || rawPayload.pur !== 'vendor_setup') {
    return {
      valid: false,
      error: 'Invalid, malformed, or expired password setup link. Please request a new setup link from the administrator.',
    };
  }

  const payload = rawPayload as VendorSetupTokenPayload;

  // 2. Fetch User and VendorProfile from PostgreSQL
  const user = await prisma.user.findUnique({
    where: { id: payload.uid },
    include: { vendorProfile: true },
  });

  if (!user) {
    return { valid: false, error: 'The user account associated with this link was not found.' };
  }

  const vendor = user.vendorProfile;
  if (!vendor || vendor.id !== payload.vid) {
    return { valid: false, error: 'The vendor profile associated with this link was not found.' };
  }

  // 3. Ensure vendor is officially APPROVED
  if (vendor.status !== 'APPROVED') {
    return {
      valid: false,
      error: `Your vendor account status is currently "${vendor.status}". Only approved vendors can activate their password.`,
    };
  }

  // 4. Single-use check: Verify signature against current password hash
  const currentSig = computeSignature(user.id, user.password, vendor.id, vendor.status);
  if (currentSig !== payload.sig) {
    return {
      valid: false,
      error: 'This password setup link has already been used. If you have already set your password, please proceed to Vendor Login.',
    };
  }

  return {
    valid: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    vendor: {
      id: vendor.id,
      businessName: vendor.businessName,
      ownerName: vendor.ownerName,
      email: vendor.email,
      status: vendor.status,
      slug: vendor.slug,
    },
  };
}

/**
 * Securely updates the vendor's password using bcrypt hashing.
 * Once updated, previous setup tokens for this user become instantly invalid.
 */
export async function setVendorPassword(params: {
  userId: number;
  vendorId: number;
  newPassword: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!params.newPassword || params.newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    const hashedPassword = await bcrypt.hash(params.newPassword, 10);

    // Update user password, ensure role is VENDOR, and mark setup completed
    await prisma.$transaction([
      prisma.user.update({
        where: { id: params.userId },
        data: {
          password: hashedPassword,
          role: 'VENDOR',
        },
      }),
      prisma.vendorProfile.update({
        where: { id: params.vendorId },
        data: {
          status: 'APPROVED',
          passwordSetupCompleted: true,
          passwordSetupCompletedAt: new Date(),
        } as any,
      }),
    ]);

    return { success: true };
  } catch (err: any) {
    console.error('[SetVendorPassword Exception]:', err);
    return { success: false, error: err?.message || 'Failed to update vendor password.' };
  }
}
