import React from "react";
import { Metadata } from "next";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ProfessionalsDirectoryClient } from "./ProfessionalsDirectoryClient";

export const metadata: Metadata = {
  title: "Discover Your Personal Stylist & Beauty Professionals | Femazon",
  description: "Book verified bridal makeup artists, hair stylists, henna designers, master saree draping specialists, and personal styling concierges across India.",
};

export default function ProfessionalsPage() {
  return (
    <SiteLayout>
      <ProfessionalsDirectoryClient />
    </SiteLayout>
  );
}
