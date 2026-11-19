import { GiftDiscoveryClient } from "@/components/gifts/GiftDiscoveryClient";
import { getGiftCatalog } from "@/lib/giftCatalog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gifts for All Occasions | Femazon",
  description: "Explore curated gift hampers, flowers, chocolates, cakes, personalized gifts, jewellery, and self-care hampers across all occasions on Femazon.",
};

export default async function GiftsPage({
  searchParams,
}: {
  searchParams: Promise<{ occasion?: string | string[]; category?: string | string[] }>;
}) {
  const { occasion: requestedOccasion, category: requestedCategory } = await searchParams;
  const occasionValue = Array.isArray(requestedOccasion) ? requestedOccasion[0] : requestedOccasion;
  const categoryValue = Array.isArray(requestedCategory) ? requestedCategory[0] : requestedCategory;
  const { products, error } = await getGiftCatalog();

  return (
    <GiftDiscoveryClient
      products={products}
      catalogNotice={error}
      initialOccasion={occasionValue}
      initialCategory={categoryValue}
    />
  );
}
