import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { getApiAuthPayload } from '@/lib/auth';

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

// GET /api/categories
// Returns all main categories with nested subcategories and product counts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true'; // If true, return inactive too (for admin)

    const categoryWhere: any = all ? {} : { isActive: true };
    const subcategoryWhere: any = all ? {} : { isActive: true };

    const categories = await prisma.category.findMany({
      where: categoryWhere,
      include: {
        subcategories: {
          where: subcategoryWhere,
          orderBy: { displayOrder: 'asc' },
          include: {
            _count: {
              select: { products: true }
            }
          }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });

    return NextResponse.json({
      success: true,
      categories
    });
  } catch (error: any) {
    console.error('GET /api/categories Error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/categories
// Allows Admin to create a Category or Subcategory
export async function POST(request: Request) {
  try {
    let email: string | undefined;

    const session = await getServerSession(authOptions).catch(() => null);
    if (session?.user?.email) {
      email = session.user.email;
    } else {
      const authPayload = await getApiAuthPayload(request).catch(() => null);
      if (authPayload?.email) {
        email = authPayload.email;
      }
    }

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized: Session missing' }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true }
    });

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { type, name, description, categoryId, displayOrder = 0, isActive = true, image } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category/Subcategory name is required.' }, { status: 400 });
    }

    const cleanName = name.trim();

    // Create Subcategory
    if (type === 'SUBCATEGORY' || categoryId) {
      const targetCatId = Number(categoryId);
      if (!targetCatId || isNaN(targetCatId)) {
        return NextResponse.json({ error: 'Valid categoryId is required for subcategory.' }, { status: 400 });
      }

      const parentCat = await prisma.category.findUnique({ where: { id: targetCatId } });
      if (!parentCat) {
        return NextResponse.json({ error: 'Parent Category not found.' }, { status: 404 });
      }

      const slug = slugify(`${parentCat.slug}-${cleanName}`);

      const subcategory = await prisma.subcategory.create({
        data: {
          name: cleanName,
          slug,
          categoryId: targetCatId,
          description: description?.trim() || null,
          image: image?.trim() || null,
          displayOrder: Number(displayOrder) || 0,
          isActive: Boolean(isActive)
        }
      });

      return NextResponse.json({
        success: true,
        message: `Subcategory "${cleanName}" created successfully!`,
        subcategory
      }, { status: 201 });
    }

    // Create Main Category
    const baseSlug = slugify(cleanName);
    const existingSlug = await prisma.category.findUnique({ where: { slug: baseSlug } });
    const finalSlug = existingSlug ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;

    const category = await prisma.category.create({
      data: {
        name: cleanName,
        slug: finalSlug,
        description: description?.trim() || null,
        image: image?.trim() || null,
        displayOrder: Number(displayOrder) || 0,
        isActive: Boolean(isActive)
      }
    });

    return NextResponse.json({
      success: true,
      message: `Main Category "${cleanName}" created successfully!`,
      category
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/categories Error:', error);
    return NextResponse.json({
      error: 'Failed to create category',
      details: error?.message || 'Server error'
    }, { status: 500 });
  }
}
