import { ShopClient } from '@/components/shop/ShopClient';
import { getFormattedShopProducts } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Beauty & Self-care | Femazon",
  description: "Discover pure botanicals, ritual skincare, radiant makeup, bath & body, and hair essentials on Femazon.",
};

interface BeautySearchParams {
  category?: string;
  dept?: string;
  department?: string;
  sub?: string;
  subcategory?: string;
  view?: string;
  sort?: string;
}

export default async function BeautyPage({
  searchParams,
}: {
  searchParams?: Promise<BeautySearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const formattedProducts = await getFormattedShopProducts();
  const initialCategory =
    resolvedSearchParams.category ||
    resolvedSearchParams.sub ||
    resolvedSearchParams.subcategory ||
    "All";

  return (
    <ShopClient
      initialProducts={formattedProducts}
      initialCategory={initialCategory}
      initialDepartment="beauty"
    />
  );
}
