"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, ShieldCheck, Store } from "lucide-react";
import type { PartnerDirectoryListing } from "@/lib/partnerDirectory";

const FEATURED_CITIES = ["Coimbatore", "Chennai"];

function getCity(location: string) {
  const knownCities = [...FEATURED_CITIES, "Bengaluru", "Madurai", "Salem", "Tiruppur"];
  return knownCities.find((city) => location.toLowerCase().includes(city.toLowerCase())) || location;
}

export function BoutiqueDirectory({
  boutiques,
  directoryError,
}: {
  boutiques: PartnerDirectoryListing[];
  directoryError?: string | null;
}) {
  const [selectedCity, setSelectedCity] = useState("All cities");
  const cities = useMemo(() => {
    const listedCities = boutiques.map((boutique) => getCity(boutique.location)).filter(Boolean);
    return ["All cities", ...Array.from(new Set([...FEATURED_CITIES, ...listedCities])).sort()];
  }, [boutiques]);
  const visibleBoutiques = boutiques.filter((boutique) =>
    selectedCity === "All cities" || getCity(boutique.location).toLowerCase().includes(selectedCity.toLowerCase())
  );

  return (
    <section aria-labelledby="boutique-directory-heading" className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#4A1513]">
            <Store size={15} /> Independent & local
          </span>
          <h2 id="boutique-directory-heading" className="mt-2 font-serif text-2xl font-bold text-stone-900 sm:text-3xl">
            Discover women-led boutiques
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-stone-600">
            Browse admin-approved local boutiques alongside the wider Femazon collection.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-stone-600">
          <MapPin size={16} aria-hidden="true" />
          <span className="sr-only">Filter boutiques by city</span>
          <select
            value={selectedCity}
            onChange={(event) => setSelectedCity(event.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-[#4A1513]"
          >
            {cities.map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
        </label>
      </div>

      {directoryError && (
        <p role="status" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {directoryError}
        </p>
      )}

      {visibleBoutiques.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleBoutiques.map((boutique) => (
            <article key={boutique.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-lg font-bold text-stone-900">{boutique.businessName}</h3>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-800">
                  <ShieldCheck size={12} /> Approved
                </span>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
                <MapPin size={13} /> {boutique.location || "Location not listed"}
              </p>
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-stone-600">
                {boutique.description || boutique.categories}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {boutique.storeUrl ? (
                  <Link href={boutique.storeUrl} className="rounded-lg bg-[#4A1513] px-3 py-2 text-xs font-semibold text-white hover:bg-[#38100e]">
                    Visit boutique
                  </Link>
                ) : (
                  <a href={`mailto:support@femazon.com?subject=${encodeURIComponent(`Femazon boutique enquiry: ${boutique.businessName}`)}`} className="rounded-lg bg-[#4A1513] px-3 py-2 text-xs font-semibold text-white hover:bg-[#38100e]">
                    Enquire with Femazon
                  </a>
                )}
                {boutique.portfolioUrl && (
                  <a href={boutique.portfolioUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 hover:border-[#4A1513]/40">
                    View collection
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : !directoryError ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-8 text-center">
          <p className="text-sm text-stone-600">
            {selectedCity === "All cities" ? "No approved boutique profiles are listed yet." : `No approved boutiques listed for ${selectedCity} yet.`}
          </p>
          <Link href="/partner/register?type=SELLER" className="mt-3 inline-block text-sm font-semibold text-[#4A1513] underline underline-offset-4">
            Apply to join Femazon
          </Link>
        </div>
      ) : null}
    </section>
  );
}
