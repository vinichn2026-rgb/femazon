import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';

export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where: any = {};
    if (category && category !== 'All') {
      where.category = category;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        colorVariants: {
          include: {
            images: {
              orderBy: { displayOrder: 'asc' }
            },
            sizes: {
              orderBy: { size: 'asc' }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error('GET /api/vendor/products Error:', error);
    return NextResponse.json({ error: 'Failed to fetch vendor products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    let vendorId: number | null = null;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      if (user) {
        vendorId = user.id;
      }
    }

    const body = await request.json();
    const {
      title,
      name,
      brandName = 'Femazon Luxe',
      category,
      subCategory,
      subcategory,
      basePrice,
      price,
      salePrice,
      discountPrice,
      description = '',
      fabricCare = 'Pure Georgette - Dry Clean Only',
      packageContains = '1 Anarkali Kurta, 1 Churidar, 1 Dupatta',
      dispatchTimeline = 'Dispatched within 24-48 Hours',
      colorVariants
    } = body;

    const productTitle = (title || name || '').trim();
    const productCategory = (category || 'Kurta Sets').trim();
    const productSubCategory = (subCategory || subcategory || '').trim();
    const mrp = Math.round(Number(basePrice ?? price ?? 0));
    const finalPrice = salePrice || discountPrice ? Math.round(Number(salePrice ?? discountPrice)) : null;

    if (!productTitle) {
      return NextResponse.json({ error: 'Product Title is required.' }, { status: 400 });
    }
    if (mrp <= 0) {
      return NextResponse.json({ error: 'Base Price (MRP) must be a positive number.' }, { status: 400 });
    }
    if (finalPrice && finalPrice > mrp) {
      return NextResponse.json({ error: 'Sale Price cannot be higher than MRP.' }, { status: 400 });
    }
    if (!Array.isArray(colorVariants) || colorVariants.length === 0) {
      return NextResponse.json({ error: 'At least one color variety is required.' }, { status: 400 });
    }

    // Validate each color variant
    for (let i = 0; i < colorVariants.length; i++) {
      const cv = colorVariants[i];
      if (!cv.colorName || !cv.colorName.trim()) {
        return NextResponse.json({ error: `Color variety #${i + 1} is missing a Color Name.` }, { status: 400 });
      }
      if (!Array.isArray(cv.images) || cv.images.length === 0) {
        return NextResponse.json({ error: `Color variety "${cv.colorName}" must have at least one image uploaded.` }, { status: 400 });
      }
    }

    // Calculate total stock across all color variants and sizes
    let totalStock = 0;
    const allImages: string[] = [];
    let primaryCoverImage = '';
    const colorNames: string[] = [];
    const availableSizesSet = new Set<string>();

    for (const cv of colorVariants) {
      colorNames.push(cv.colorName.trim());

      // Images
      if (Array.isArray(cv.images)) {
        for (const img of cv.images) {
          const url = typeof img === 'string' ? img : img.imageUrl;
          if (url) {
            allImages.push(url);
            if (!primaryCoverImage || (typeof img === 'object' && img.isThumbnail)) {
              primaryCoverImage = url;
            }
          }
        }
      }

      // Sizes & stock
      if (Array.isArray(cv.sizes)) {
        for (const sz of cv.sizes) {
          const qty = Math.max(0, parseInt(sz.stockQty, 10) || 0);
          totalStock += qty;
          if (qty > 0) {
            availableSizesSet.add(sz.size);
          }
        }
      }
    }

    if (!primaryCoverImage && allImages.length > 0) {
      primaryCoverImage = allImages[0];
    }

    // Generate unique slug
    const baseSlug = slugify(productTitle);
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

    // Database transaction: Create Product + ColorVariants + VariantImages + SizeInventories
    const createdProduct = await prisma.$transaction(async (tx) => {
      // 1. Create main Product
      const product = await tx.product.create({
        data: {
          name: productTitle,
          slug: uniqueSlug,
          brandName: brandName.trim() || 'Femazon Luxe',
          category: productCategory,
          subcategory: productSubCategory || null,
          dressType: productSubCategory || null,
          price: mrp,
          discountPrice: finalPrice,
          description: description.trim(),
          fabricCare: fabricCare.trim(),
          packageContains: packageContains.trim(),
          dispatchTimeline: dispatchTimeline.trim() || 'Dispatched within 24-48 Hours',
          readyToShip: true,
          stock: totalStock,
          image: primaryCoverImage || null,
          images: JSON.stringify(allImages),
          sizes: JSON.stringify(Array.from(availableSizesSet)),
          colors: JSON.stringify(colorNames),
          approvalStatus: 'APPROVED',
          vendorId: vendorId || null
        }
      });

      // 2. Create Color Variants with Images and Sizes
      for (const cv of colorVariants) {
        const createdVariant = await tx.colorVariant.create({
          data: {
            productId: product.id,
            colorName: cv.colorName.trim(),
            colorHexCode: cv.colorHexCode?.trim() || null
          }
        });

        // Insert Images
        if (Array.isArray(cv.images) && cv.images.length > 0) {
          const imageRecords = cv.images.map((img: any, idx: number) => {
            const url = typeof img === 'string' ? img : img.imageUrl;
            const isThumb = typeof img === 'object' ? Boolean(img.isThumbnail) : idx === 0;
            const order = typeof img === 'object' && img.displayOrder ? img.displayOrder : idx + 1;
            return {
              colorVariantId: createdVariant.id,
              imageUrl: url,
              isThumbnail: isThumb,
              displayOrder: order
            };
          });

          await tx.variantImage.createMany({
            data: imageRecords
          });
        }

        // Insert Sizes & Stock
        if (Array.isArray(cv.sizes) && cv.sizes.length > 0) {
          const sizeRecords = cv.sizes.map((sz: any) => ({
            colorVariantId: createdVariant.id,
            size: sz.size.trim(),
            stockQty: Math.max(0, parseInt(sz.stockQty, 10) || 0)
          }));

          await tx.sizeInventory.createMany({
            data: sizeRecords
          });
        }
      }

      return product;
    });

    // Re-fetch complete created product with nested relations
    const completeProduct = await prisma.product.findUnique({
      where: { id: createdProduct.id },
      include: {
        colorVariants: {
          include: {
            images: { orderBy: { displayOrder: 'asc' } },
            sizes: { orderBy: { size: 'asc' } }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Ready-to-Ship product and color variants published successfully!',
      product: completeProduct
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/vendor/products Error:', error);
    return NextResponse.json({
      error: 'Failed to create product with color variants',
      details: error?.message || 'Server error'
    }, { status: 500 });
  }
}
