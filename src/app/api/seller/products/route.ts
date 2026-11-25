import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVendorUser } from '@/lib/vendorAuth';
import { getProductValidationMessage, serializeProductList, vendorProductSchema } from '@/lib/vendorProducts';

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
    console.error('[SellerProducts] Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST a new product for the logged-in vendor
export async function POST(request: Request) {
  try {
    const user = await getVendorUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized or not a vendor' }, { status: 401 });

    const body: unknown = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid product data.' }, { status: 400 });
    }
    const parsed = vendorProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: getProductValidationMessage(parsed.error) }, { status: 400 });
    }

    const { name, description, price, discountPrice, category, subcategory, stock, sizes, colors, sku, images, image, status } = parsed.data;
    const imageList = Array.isArray(images) ? images : typeof images === 'string' ? images.split(/\r?\n/).filter(Boolean) : [];
    
    // Strict 3 to 5 images requirement
    if (status !== 'DRAFT' && (imageList.length < 3 || imageList.length > 5)) {
      return NextResponse.json({ error: 'Product must have between 3 and 5 uploaded images.' }, { status: 400 });
    }

    const mainImage = image || imageList[0] || null;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const approvalStatus = status === "DRAFT" ? "DRAFT" : "SUBMITTED";

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        price,
        discountPrice: discountPrice ?? null,
        category,
        subcategory: subcategory || null,
        stock,
        sizes: serializeProductList(sizes) ?? null,
        colors: serializeProductList(colors) ?? null,
        sku: sku || null,
        images: serializeProductList(images) ?? (imageList.length > 0 ? JSON.stringify(imageList) : null),
        image: mainImage,
        approvalStatus,
        vendorId: user.id
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('[SellerProducts] Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
