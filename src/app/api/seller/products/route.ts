import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';
import { getSessionFromCookie } from '@/lib/auth';

async function getVendorUser(request: Request) {
  let userEmail: string | undefined;
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      userEmail = session.user.email;
    }
  } catch {}

  if (!userEmail) {
    const payload = getSessionFromCookie(request.headers.get('cookie') || undefined);
    if (payload?.email) {
      userEmail = payload.email;
    }
  }

  if (!userEmail) return null;

  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user || user.role !== 'VENDOR') return null;

  return user;
}

// GET all products for the logged-in vendor
export async function GET(request: Request) {
  try {
    const user = await getVendorUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized or not a vendor' }, { status: 401 });

    const products = await prisma.product.findMany({
      where: { vendorId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST a new product for the logged-in vendor
export async function POST(request: Request) {
  try {
    const user = await getVendorUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized or not a vendor' }, { status: 401 });

    const body = await request.json();
    const { 
      name, description, price, discountPrice, 
      category, subcategory, stock, sizes, colors, 
      sku, images, status, image
    } = body;

    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const approvalStatus = status === "DRAFT" ? "DRAFT" : "APPROVED";

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Math.round(Number(price)),
        discountPrice: discountPrice ? Math.round(Number(discountPrice)) : null,
        category,
        subcategory,
        stock: Math.max(0, parseInt(stock, 10) || 0),
        sizes: sizes || "XS, S, M, L, XL",
        colors: colors || "Multi",
        sku: sku || `FMZ-V-${Date.now().toString().slice(-6)}`,
        images: Array.isArray(images) ? JSON.stringify(images) : (typeof images === 'string' ? images : null),
        image: image || (Array.isArray(images) ? images[0] : null) || "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600",
        approvalStatus,
        vendorId: user.id
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
