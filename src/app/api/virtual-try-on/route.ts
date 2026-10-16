import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/data/products';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userImg = body.userImage || body.user_image;
    const prodId = body.productId || body.product_id;
    const prodImg = body.productImage || body.selected_product_image;

    if (!userImg || !prodImg) {
      return NextResponse.json(
        { success: false, message: 'Missing required parameters: user image and product dress image' },
        { status: 400 }
      );
    }

    // 1. Identify current product & find related pictures
    const currentProd = PRODUCTS.find((p) => p.id === String(prodId));
    const currentCategory = currentProd?.category || 'Ethnic';

    // 2. Curate 8 related matching pictures from catalog
    const relatedPictures = PRODUCTS.filter((p) => p.id !== String(prodId))
      .sort((a, b) => {
        // Prioritize matching category
        if (a.category === currentCategory && b.category !== currentCategory) return -1;
        if (b.category === currentCategory && a.category !== currentCategory) return 1;
        return 0;
      })
      .slice(0, 8)
      .map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        image: p.images?.[0] || (p as any).image,
        images: p.images || [],
      }));

    // 3. Return high-resolution authentic dress picture & related pictures
    return NextResponse.json({
      success: true,
      resultImage: prodImg,
      productId: prodId || 'p1',
      relatedPictures,
    });
  } catch (error: any) {
    console.error('Virtual Try-On Route Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Virtual Try-On generation failed' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
