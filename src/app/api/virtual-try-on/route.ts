import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userImg = body.userImage || body.user_image;
    const prodId = body.productId || body.product_id;
    const prodImg = body.productImage || body.selected_product_image;

    if (!userImg || !prodId || !prodImg) {
      return NextResponse.json(
        { success: false, message: 'Missing required parameters (user_image, selected_product_image, product_id)' },
        { status: 400 }
      );
    }

    // Check if prodImg is valid
    let validProductImg = "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=800";
    if (typeof prodImg === 'string' && prodImg.length > 8 && (prodImg.startsWith('http') || prodImg.startsWith('/') || prodImg.startsWith('data:'))) {
      validProductImg = prodImg;
    }

    // Dynamic result based on product image
    const mockResultImage = validProductImg;

    return NextResponse.json({
      success: true,
      resultImage: mockResultImage,
      productId: prodId || 'p1'
    });
    
  } catch (error: any) {
    console.error('Virtual Try-On Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
