import { ShopClient } from '@/components/shop/ShopClient';
import { getFormattedShopProducts } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

interface ShopSearchParams {
  category?: string;
  silhouette?: string;
  style?: string;
  length?: string;
  subcategory?: string;
  occasion?: string;
  sort?: string;
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<ShopSearchParams> }) {
  const resolvedSearchParams = await searchParams;

  // Instant pre-formatted catalog from memory cache (0ms)
  const formattedProducts = await getFormattedShopProducts();

  let initialCategory = resolvedSearchParams.category || "All";
  const rawCatLower = initialCategory.toLowerCase().trim();
  if (rawCatLower === "handbags" || rawCatLower === "handbag" || rawCatLower === "bags" || rawCatLower === "bag" || rawCatLower === "lady bag" || rawCatLower === "ladies bag") {
    initialCategory = "Handbags";
  } else if (rawCatLower === "potlis" || rawCatLower === "potli") {
    initialCategory = "Potlis";
  } else if (rawCatLower === "footwear" || rawCatLower === "shoes") {
    initialCategory = "Footwear";
  } else if (rawCatLower === "shawls" || rawCatLower === "shawl") {
    initialCategory = "Shawls";
  } else if (rawCatLower === "hair accessories" || rawCatLower === "hair-accessories") {
    initialCategory = "Hair Accessories";
  } else if (rawCatLower === "stoles & scarves" || rawCatLower === "stoles-scarves") {
    initialCategory = "Stoles & Scarves";
  } else if (rawCatLower === "belts" || rawCatLower === "belt") {
    initialCategory = "Belts";
  } else if (rawCatLower === "kurtis" || rawCatLower === "kurti" || rawCatLower === "ethnic") {
    initialCategory = "Kurta Sets";
  }
  
  // Normalize incoming silhouette/style/length param
  let initialSilhouette = resolvedSearchParams.silhouette || resolvedSearchParams.style || resolvedSearchParams.length || "All";
  // Handle common aliases: e.g. "Bodycon Silhouettes" -> "Bodycon"
  if (initialSilhouette.toLowerCase().includes("bodycon")) initialSilhouette = "Bodycon";
  else if (initialSilhouette.toLowerCase().includes("anarkali")) initialSilhouette = "Anarkali";
  else if (initialSilhouette.toLowerCase().includes("straight")) initialSilhouette = "Straight";
  else if (initialSilhouette.toLowerCase().includes("a-line")) initialSilhouette = "A-Line";
  else if (initialSilhouette.toLowerCase().includes("palazzo")) initialSilhouette = "Palazzo";
  else if (initialSilhouette.toLowerCase().includes("sharara")) initialSilhouette = "Sharara";
  else if (initialSilhouette.toLowerCase().includes("peplum")) initialSilhouette = "Peplum";
  else if (initialSilhouette.toLowerCase().includes("gown")) initialSilhouette = "Gown";
  else if (initialSilhouette.toLowerCase().includes("maxi")) initialSilhouette = "Maxi";
  else if (initialSilhouette.toLowerCase().includes("midi")) initialSilhouette = "Midi";
  else if (initialSilhouette.toLowerCase().includes("mini")) initialSilhouette = "Mini";
  else if (initialSilhouette.toLowerCase().includes("wrap")) initialSilhouette = "Wrap";
  else if (initialSilhouette.toLowerCase().includes("shirt")) initialSilhouette = "Shirt Dress";
  else if (initialSilhouette.toLowerCase().includes("slip")) initialSilhouette = "Slip Dress";

  // Simulate a Backend API fetching a dynamic banner
  const bannerImage = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop";

  return (
    <ShopClient 
      initialProducts={formattedProducts} 
      initialCategory={initialCategory} 
      initialSilhouette={initialSilhouette}
      initialWishlistIds={[]} 
      bannerImage={bannerImage} 
    />
  );
}
