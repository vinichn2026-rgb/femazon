import { ShopClient } from '@/components/shop/ShopClient';
import { getFormattedShopProducts } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Gifts for Every Occasion | Femazon",
  description: "Explore curated gift hampers, celebratory boxes, flowers, chocolates & personalised surprises on Femazon.",
};

interface GiftsSearchParams {
  category?: string | string[];
  occasion?: string | string[];
  dept?: string | string[];
  department?: string | string[];
  subcategory?: string | string[];
  sort?: string | string[];
}

export default async function GiftsPage({
  searchParams,
}: {
  searchParams?: Promise<GiftsSearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const formattedProducts = await getFormattedShopProducts();
  const rawCategory =
    resolvedSearchParams.category ||
    resolvedSearchParams.occasion ||
    resolvedSearchParams.subcategory;
  const initialCategory = Array.isArray(rawCategory)
    ? rawCategory[0]
    : (rawCategory || "All");

  return (
    <ShopClient
      initialProducts={formattedProducts}
      initialCategory={initialCategory}
      initialDepartment="gifts"
    />
  );
}
