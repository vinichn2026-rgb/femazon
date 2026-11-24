import { ShopClient } from '@/components/shop/ShopClient';
import { getFormattedShopProducts } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Women's Wear | Femazon",
  description: "Shop curated women's clothing across sarees, kurtis, lehengas, dresses, gowns, co-ords & western wear on Femazon.",
};

interface WomensWearSearchParams {
  category?: string;
  dept?: string;
  department?: string;
  silhouette?: string;
  style?: string;
  subcategory?: string;
  sort?: string;
}

export default async function WomensWearPage({ searchParams }: { searchParams: Promise<WomensWearSearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const formattedProducts = await getFormattedShopProducts();
  const initialCategory = resolvedSearchParams.category || "All";
  const initialSilhouette = resolvedSearchParams.silhouette || resolvedSearchParams.style || "All";

  return (
    <ShopClient
      initialProducts={formattedProducts}
      initialCategory={initialCategory}
      initialSilhouette={initialSilhouette}
      initialDepartment="womens-wear"
    />
  );
}
