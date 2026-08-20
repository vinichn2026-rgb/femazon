import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams;
  const query = params.q?.trim() ?? '';
  const category = params.category?.trim() ?? '';

  const products = await prisma.product.findMany({
    where: {
      ...(query
        ? {
            OR: [
              { name: { contains: query } },
              { description: { contains: query } },
            ],
          }
        : {}),
      ...(category ? { slug: { contains: category } } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16 text-primary">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-600">Marketplace</p>
          <h1 className="mt-3 text-3xl font-semibold">Browse products</h1>
          <p className="mt-3 max-w-2xl text-zinc-600">Search and filter the available catalog to find the perfect item.</p>

          <form className="mt-6 flex flex-col gap-3 md:flex-row" method="get">
            <input
              name="q"
              defaultValue={query}
              placeholder="Search products"
              className="flex-1 rounded-full border border-zinc-300 px-4 py-3"
            />
            <select name="category" defaultValue={category} className="rounded-full border border-zinc-300 px-4 py-3">
              <option value="">All categories</option>
              <option value="tech">Tech</option>
              <option value="home">Home</option>
              <option value="fashion">Fashion</option>
            </select>
            <button className="rounded-full bg-primary px-5 py-3 font-medium text-white">Filter</button>
          </form>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="rounded-[1rem] bg-zinc-100 p-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">{product.slug}</p>
                <h2 className="mt-2 text-xl font-semibold">{product.name}</h2>
              </div>
              <p className="mt-4 text-sm text-zinc-600">{product.description ?? 'A handcrafted product from the Femazon catalog.'}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-zinc-500">{product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}</span>
                <span className="text-lg font-semibold">${(product.price / 100).toFixed(2)}</span>
              </div>
              <Link href={`/products/${product.slug}`} className="mt-6 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">
                View details
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
