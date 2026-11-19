"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Sparkles, ArrowRight, X, Heart, MapPin, User, Quote } from "lucide-react";

interface Story {
  id: string;
  tag: string;
  title: string;
  author: string;
  role: string;
  location: string;
  image: string;
  snippet: string;
  fullStory: string;
  stats?: string;
}

const BRAND_STORIES: Story[] = [
  {
    id: "story-1",
    tag: "WOMEN IN WEAVING",
    title: "Reviving Kovai Handlooms: Empowering Generational Weavers",
    author: "Sangeetha Ramasamy",
    role: "Founder, Kovai Handlooms & Silks",
    location: "Coimbatore, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=700",
    snippet: "How a family-run heritage studio in Coimbatore brought 40+ traditional loom weavers together to craft feather-light soft silk sarees.",
    fullStory: "Growing up in Pollachi near Coimbatore, Sangeetha watched her grandmother preserve Kanchi and Kovai soft silks for decades. In 2021, she noticed younger weavers were leaving looms due to middlemen taking 70% of margins. Partnering directly with generational women weavers in Coimbatore, Kovai Handlooms was born on Femazon. Today, every saree sold supports ethical wages and silk mark certification, bringing authentic South Indian textile mastery directly into modern wardrobes.",
    stats: "40+ Women Weavers Empowered",
  },
  {
    id: "story-2",
    tag: "ATELIER COUTURE",
    title: "From Besant Nagar to the Runway: The Nagla Couture Story",
    author: "Fathima Nagla",
    role: "Creative Director, Nagla Fashion Atelier",
    location: "Chennai, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=700",
    snippet: "Merging intricate zardozi embroidery with breathable silhouettes for contemporary brides and festive celebrations.",
    fullStory: "Nagla Fashion Atelier began in a small boutique in Chennai with just two master embroidery kaarigars. Fathima's vision was simple: traditional Indian bridal wear should be as comfortable and light to dance in as it is majestic. By showcasing on Femazon, Nagla Couture reached clients across India, designing custom trousseau pieces that honor heritage while embracing effortless drape and modern movement.",
    stats: "350+ Custom Bridal Ensembles",
  },
  {
    id: "story-3",
    tag: "CLEAN BEAUTY",
    title: "Crafting Botanical Skincare in the Heart of the Nilgiris",
    author: "Dr. Meera Krishnan",
    role: "Formulator, Siruvani Botanical Care",
    location: "Coimbatore & Nilgiris",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=700",
    snippet: "Cold-pressed facial serums and hair elixirs sourced directly from sustainable hill-grown botanicals.",
    fullStory: "Dr. Meera spent 12 years studying pharmacognosy before returning to her family's farm along the Siruvani river basin. Frustrated by commercial cosmetics laden with silicones, she crafted small-batch botanical facial oils and herbal scalp tonics. On Femazon, Siruvani Botanical Care quickly gained a loyal following of women seeking gentle, effective, and cruelty-free daily self-care.",
    stats: "100% Botanical Sourcing",
  },
  {
    id: "story-4",
    tag: "STYLIST SPOTLIGHT",
    title: "The Confidence of a Curated Wardrobe: A Stylist's Journey",
    author: "Priya Sundaram",
    role: "Senior Bridal & Personal Stylist",
    location: "Chennai, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=700",
    snippet: "Why personal styling is about discovering your authentic silhouette rather than chasing fleeting trends.",
    fullStory: "After dressing runway models for years, Priya realized that real women needed styling guidance the most—understanding what necklines enhance their posture, what colors illuminate their skin tone, and how to mix and match wardrobe pieces sustainably. Through Femazon's Personal Styling platform, she consults with brides and working professionals daily, creating personalized lookbooks and curated outfit combinations.",
    stats: "500+ Personal Consultations",
  },
];

export function StoriesBehindTheBrands() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  return (
    <section className="w-full bg-white py-14 sm:py-20 border-b border-stone-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 mb-2.5">
            <BookOpen size={13} className="text-[#4A1513]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A1513]">
              COMMUNITY &amp; HERITAGE
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-stone-900 font-light tracking-wide">
            Stories Behind the Brands
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-600 font-light">
            Meet the passionate women entrepreneurs, master weavers, and independent stylists shaping the Femazon marketplace.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRAND_STORIES.map((story) => (
            <div
              key={story.id}
              className="bg-[#FAF7F5] rounded-2xl overflow-hidden border border-stone-200/80 hover:border-[#4A1513]/40 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-[16/10] relative overflow-hidden bg-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9.5px] font-bold tracking-wider">
                    {story.tag}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
                    <MapPin size={12} className="text-[#4A1513]" />
                    <span className="font-medium text-stone-600">{story.location}</span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-semibold text-stone-900 group-hover:text-[#4A1513] transition-colors leading-snug line-clamp-2 mb-2">
                    {story.title}
                  </h3>

                  <p className="text-xs text-stone-600 font-light line-clamp-3 leading-relaxed mb-4">
                    {story.snippet}
                  </p>

                  <div className="pt-3 border-t border-stone-200/60">
                    <p className="text-xs font-semibold text-stone-800">{story.author}</p>
                    <p className="text-[11px] text-stone-500">{story.role}</p>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedStory(story)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white hover:bg-[#4A1513] text-[#4A1513] hover:text-white border border-stone-200/80 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                >
                  <span>Read Full Story</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Story Details Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Image Header */}
            <div className="aspect-[21/9] sm:aspect-[21/8] relative overflow-hidden bg-stone-900 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedStory.image}
                alt={selectedStory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close story"
              >
                <X size={16} />
              </button>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E5C3A6] block mb-1">
                  {selectedStory.tag} &bull; {selectedStory.location}
                </span>
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-light text-white leading-tight">
                  {selectedStory.title}
                </h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 text-xs">
                <div>
                  <p className="font-bold text-stone-900">{selectedStory.author}</p>
                  <p className="text-stone-500">{selectedStory.role}</p>
                </div>
                {selectedStory.stats && (
                  <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-bold text-[11px]">
                    {selectedStory.stats}
                  </span>
                )}
              </div>

              <div className="relative pl-4 border-l-2 border-[#4A1513] italic text-stone-700 text-xs sm:text-sm">
                &ldquo;{selectedStory.snippet}&rdquo;
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
                {selectedStory.fullStory}
              </p>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <Link
                  href="/brands"
                  onClick={() => setSelectedStory(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A1513] hover:underline"
                >
                  <span>Explore More Brand Stories</span>
                  <ArrowRight size={13} />
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedStory(null)}
                  className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
