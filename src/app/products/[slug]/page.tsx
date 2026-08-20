import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import ReviewSection from '@/components/reviews/ReviewSection';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({ 
    where: { 
      slug,
      approvalStatus: 'APPROVED'
    } 
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16 text-primary">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <Link href="/products" className="text-sm font-medium text-zinc-600 hover:text-primary">
          ← Back to marketplace
        </Link>

        <section className="grid gap-8 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.5rem] bg-zinc-100 p-10">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-600">Featured item</p>
            <h1 className="mt-3 text-3xl font-semibold">{product.name}</h1>
            <p className="mt-4 text-zinc-600">{product.description ?? 'A premium product ready for your storefront.'}</p>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm text-zinc-500">Availability</p>
              <p className="mt-2 text-lg font-semibold">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
              <p className="mt-6 text-4xl font-semibold">${(product.price / 100).toFixed(2)}</p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AddToCartButton product={{ id: product.id, slug: product.slug, name: product.name, price: product.price }} />
              <button className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium text-primary">Save</button>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <ReviewSection targetType="product" targetId={product.id} />

      </div>
    </main>
  );
}
