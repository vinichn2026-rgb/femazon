import { prisma } from "@/lib/prisma";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 p-8 text-white shadow-sm sm:p-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-400">
            Femazon Day 3
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Discover products, sign in, and shop with a polished marketplace experience.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-300">
            This storefront now has a clean header, footer, and navigation to support the next e-commerce screens.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/register" className="rounded-full bg-white px-5 py-3 text-sm font-medium text-zinc-900">Create account</a>
            <a href="/login" className="rounded-full border border-white/30 px-5 py-3 text-sm font-medium text-white">Login</a>
            <a href="/products" className="rounded-full border border-white/30 px-5 py-3 text-sm font-medium text-white">Browse products</a>
            <a href="/services" className="rounded-full border border-white/30 px-5 py-3 text-sm font-medium text-white">Browse services</a>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {products.map((product: { id: number; name: string; description: string | null; stock: number; price: number }) => (
            <article key={product.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="mt-2 text-sm text-zinc-600">{product.description ?? "No description yet."}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-zinc-500">Stock: {product.stock}</span>
                <span className="font-semibold">${(product.price / 100).toFixed(2)}</span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
