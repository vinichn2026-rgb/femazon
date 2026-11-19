import { notFound } from "next/navigation";
import { StylistProfileClient } from "@/components/styling/StylistProfileClient";
import { getApprovedStylistBySlug } from "@/lib/stylists";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stylist = await getApprovedStylistBySlug(slug);
  if (!stylist) {
    return { title: "Personal Stylist | Femazon" };
  }
  return {
    title: `${stylist.fullName} — Personal Stylist | Femazon`,
    description: stylist.bio,
  };
}

export default async function StylistProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stylist = await getApprovedStylistBySlug(slug);

  if (!stylist) {
    notFound();
  }

  return <StylistProfileClient stylist={stylist} />;
}
