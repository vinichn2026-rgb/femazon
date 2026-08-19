import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await request.json();
    const { businessName, ownerName, email, phone, address, businessCategory, description } = body;

    if (!businessName) {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 });
    }

    // Upsert VendorProfile (Status is PENDING by default in Prisma schema)
    const profile = await prisma.vendorProfile.upsert({
      where: { userId: user.id },
      update: {
        businessName,
        ownerName,
        email,
        phone,
        address,
        businessCategory,
        description,
        status: "PENDING"
      },
      create: {
        userId: user.id,
        businessName,
        ownerName,
        email,
        phone,
        address,
        businessCategory,
        description,
        status: "PENDING"
      }
    });

    // We do NOT update the user's role to VENDOR yet.
    // They must be approved by an Admin first.

    return NextResponse.json({ success: true, profile }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register seller' }, { status: 500 });
  }
}
