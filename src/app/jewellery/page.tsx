import { ShopClient } from '@/components/shop/ShopClient';
import { getFormattedShopProducts } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Jewellery & Accessories | Femazon",
  description: "Explore regal Kundan chokers, temple jhumkas, artisanal potlis, luxury handbags & embroidered footwear on Femazon.",
};

interface JewellerySearchParams {
  category?: string;
  silhouette?: string;
  style?: string;
  subcategory?: string;
  sort?: string;
}

export default async function JewelleryPage({ searchParams }: { searchParams: Promise<JewellerySearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const formattedProducts = await getFormattedShopProducts();
  const initialCategory = resolvedSearchParams.category || "All";

  return (
    <ShopClient
      initialProducts={formattedProducts}
      initialCategory={initialCategory}
      initialDepartment="jewellery"
    />
  );
}
