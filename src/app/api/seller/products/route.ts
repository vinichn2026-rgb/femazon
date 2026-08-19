import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET all products for the logged-in vendor
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || user.role !== 'VENDOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

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
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || user.role !== 'VENDOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

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

    // The frontend sends `status` as "DRAFT" or "PENDING".
    // "PENDING" means it's published but awaiting admin approval.
    const approvalStatus = status === "DRAFT" ? "DRAFT" : "PENDING";

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Math.round(Number(price)),
        discountPrice: discountPrice ? Math.round(Number(discountPrice)) : null,
        category,
        subcategory,
        stock: Math.round(Number(stock || 0)),
        sizes,
        colors,
        sku,
        image: image || (images && images.length > 0 ? images[0] : null),
        images: images ? JSON.stringify(images) : null,
        approvalStatus,
        vendorId: user.id
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
