import React from "react";
import { prisma } from "@/lib/prisma";
import { CuratedPageClient } from "@/components/curated/CuratedPageClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Curated Fashion Edits | Femazon",
  description: "Discover handpicked styles designed for every occasion, mood, and moment on Femazon."
};

export default async function CuratedPage() {
  const dbProducts = await prisma.product.findMany({
    where: { approvalStatus: "APPROVED" },
    take: 12,
    orderBy: { createdAt: "desc" }
  });

  const trendingProducts = dbProducts.map((p) => {
    let badge = "TRENDING";
    if (p.category === "Saree") badge = "VIRAL SAREE";
    else if (p.category === "Kurtis" || p.category === "Kurti") badge = "TRENDING KURTI";
    else if (p.category === "Co-ords") badge = "POPULAR SET";
    else if (p.category === "Dresses") badge = "STATEMENT DRESS";
    else if (p.category === "Anarkali") badge = "ROYAL ANARKALI";

    return {
      id: p.id.toString(),
      name: p.name,
      category: p.subcategory || p.category || "Designer Edit",
      price: `₹${(p.discountPrice || p.price).toLocaleString("en-IN")}`,
      originalPrice: p.discountPrice && p.discountPrice < p.price ? `₹${p.price.toLocaleString("en-IN")}` : undefined,
      discount: p.discountPrice && p.discountPrice < p.price ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : undefined,
      img: p.image || "https://images.unsplash.com/photo-1610047614301-13c63f00c032?q=80&w=600&h=800&auto=format&fit=crop",
      badge,
      slug: p.slug
    };
  });

  return <CuratedPageClient trendingProducts={trendingProducts} />;
}
