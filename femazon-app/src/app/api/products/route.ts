import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !['VENDOR', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug, description, price, stock } = body;

  if (!name || !slug || !price || stock == null) {
    return NextResponse.json({ error: 'Missing product data' }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: 'Product slug already exists' }, { status: 409 });
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: Number(price),
      stock: Number(stock),
    },
  });

  return NextResponse.json(product);
}
