import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getApiAuthEmail } from '@/lib/auth';
import { createPartnerApplication } from '@/lib/partnerApplications';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const sellerRegistrationSchema = z.object({
  businessName: z.string().trim().min(1).max(200),
  ownerName: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(10).max(30).refine((value) => value.replace(/\D/g, '').length >= 10, {
    message: 'Phone number must contain at least 10 digits',
  }),
  address: z.string().trim().min(1).max(500),
  businessCategory: z.string().trim().min(1).max(100),
  description: z.string().trim().max(2000).optional().default(''),
  gstNumber: z.string().trim().max(50).optional().default(''),
  businessType: z.string().trim().max(100).optional().default(''),
  city: z.string().trim().max(100).optional().default(''),
  pincode: z.string().trim().max(20).optional().default(''),
  portfolioUrl: z.string().trim().max(500).optional().default(''),
  bankAccountName: z.string().trim().max(200).optional().default(''),
  bankAccountNumber: z.string().trim().max(50).optional().default(''),
  bankIfsc: z.string().trim().max(30).optional().default(''),
});

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const parsed = sellerRegistrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid seller registration details' },
        { status: 400 }
      );
    }
    const registration = parsed.data;

    // Check if user is currently authenticated
    const authEmail = await getApiAuthEmail(request);
    let user = authEmail ? await prisma.user.findUnique({ where: { email: authEmail } }) : null;

    // If not authenticated via cookie, check if a user exists with the submitted form email
    if (!user && registration.email) {
      user = await prisma.user.findUnique({ where: { email: registration.email.toLowerCase() } });
    }

    // If no user account exists at all, create one for the new seller with an unguessable placeholder password.
    // The vendor will create their own secure password via the password setup link once approved by an admin.
    if (!user) {
      const initialPlaceholderPassword = crypto.randomBytes(32).toString('hex');
      const defaultPasswordHash = await bcrypt.hash(initialPlaceholderPassword, 10);
      user = await prisma.user.create({
        data: {
          email: registration.email.toLowerCase(),
          name: registration.ownerName,
          phone: registration.phone,
          password: defaultPasswordHash,
          role: 'CUSTOMER', // Promoted to VENDOR upon Admin approval
        },
      });
    }

    // Generate unique shop slug
    const baseSlug = slugify(registration.businessName) || `vendor-${user.id}`;
    let shopSlug = baseSlug;
    let count = 1;
    while (true) {
      const existingSlug = await prisma.vendorProfile.findFirst({
        where: { slug: shopSlug, NOT: { userId: user.id } },
        select: { id: true },
      });
      if (!existingSlug) break;
      shopSlug = `${baseSlug}-${count++}`;
    }

    // Upsert VendorProfile linked to this user account
    const fullAddress = registration.city
      ? `${registration.address}, ${registration.city} - ${registration.pincode}`
      : registration.address;

    const profile = await prisma.vendorProfile.upsert({
      where: { userId: user.id },
      update: {
        businessName: registration.businessName,
        slug: shopSlug,
        ownerName: registration.ownerName,
        email: registration.email,
        phone: registration.phone,
        address: fullAddress,
        businessCategory: registration.businessCategory,
        description: registration.description,
        gstNumber: registration.gstNumber || null,
        status: 'PENDING',
      },
      create: {
        userId: user.id,
        businessName: registration.businessName,
        slug: shopSlug,
        ownerName: registration.ownerName,
        email: registration.email,
        phone: registration.phone,
        address: fullAddress,
        businessCategory: registration.businessCategory,
        description: registration.description,
        gstNumber: registration.gstNumber || null,
        status: 'PENDING',
      },
    });

    // Create a PartnerApplication for Admin review
    const combinedServiceInfo = [
      registration.businessType ? `Type: ${registration.businessType}` : '',
      registration.gstNumber ? `GST: ${registration.gstNumber}` : 'GST: Unregistered / Exempt',
      registration.bankAccountName ? `Bank Name: ${registration.bankAccountName}` : '',
      registration.bankAccountNumber ? `Account: ${registration.bankAccountNumber}` : '',
      registration.bankIfsc ? `IFSC: ${registration.bankIfsc}` : '',
    ].filter(Boolean).join(' | ');

    const application = await createPartnerApplication({
      userId: user.id,
      name: registration.ownerName,
      email: registration.email,
      phone: registration.phone,
      businessName: registration.businessName,
      applicantType: 'SELLER',
      categories: registration.businessCategory,
      description: registration.description,
      location: fullAddress,
      serviceInfo: combinedServiceInfo || undefined,
      portfolio: registration.portfolioUrl || undefined,
    });

    return NextResponse.json({ 
      success: true, 
      profile, 
      applicationId: application.id,
      message: 'Your seller application has been submitted and is pending review.' 
    }, { status: 200 });

  } catch (error: any) {
    console.error('[SellerRegisterAPI] Failed to register seller:', error);
    return NextResponse.json({ error: error?.message || 'Failed to submit seller application' }, { status: 500 });
  }
}
