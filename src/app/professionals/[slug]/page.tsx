import { notFound } from "next/navigation";
import { getProfessionalBySlug, INITIAL_BEAUTY_PROFESSIONALS } from "@/data/professionalsData";
import { ProfessionalProfileClient } from "./ProfessionalProfileClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pro = getProfessionalBySlug(slug) || INITIAL_BEAUTY_PROFESSIONALS.find(p => p.slug === slug || p.id === slug);
  if (!pro) return { title: "Professional Not Found | Femazon" };

  return {
    title: `${pro.name} | ${pro.speciality} | Femazon Verified Professional`,
    description: `Book ${pro.name} for ${pro.category} in ${pro.location}. Starting at ₹${pro.startingPrice.toLocaleString("en-IN")}. View verified portfolios and packages.`,
  };
}

export default async function ProfessionalProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pro = getProfessionalBySlug(slug) || INITIAL_BEAUTY_PROFESSIONALS.find(p => p.slug === slug || p.id === slug);

  if (!pro) {
    notFound();
  }

  return (
    <main>
      <ProfessionalProfileClient professional={pro} />
    </main>
  );
}
