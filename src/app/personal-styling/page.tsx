import { StylistMarketplaceClient } from "@/components/styling/StylistMarketplaceClient";
import { getApprovedStylists } from "@/lib/stylists";

export const metadata = {
  title: "Personal Styling Marketplace | Femazon",
  description:
    "Discover verified personal stylists, wardrobe consultants, and shopping assistants. Explore portfolios, dynamic packages, and book 1-on-1 sessions.",
};

export const dynamic = "force-dynamic";

export default async function PersonalStylingPage({
  searchParams,
}: {
  searchParams?: Promise<{ city?: string; spec?: string }>;
}) {
  const resolved = (await searchParams) || {};
  const { stylists, error } = await getApprovedStylists();

  return (
    <StylistMarketplaceClient
      stylists={stylists}
      error={error}
      initialCity={resolved.city || "all"}
      initialSpecialization={resolved.spec || "all"}
    />
  );
}
