import React from "react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ExploreCategorySection } from "@/components/home/ExploreCategorySection";
import { DiscoverBrandsAroundYou } from "@/components/home/DiscoverBrandsAroundYou";
import { WomensCollectionsSection } from "@/components/home/WomensCollectionsSection";
import { PersonalStylistSection } from "@/components/home/PersonalStylistSection";
import { GiftsOccasionsSection } from "@/components/home/GiftsOccasionsSection";
import { ServiceCarousel } from "@/components/home/ServiceCarousel";
import { DiscoverWhatsNewSection } from "@/components/home/DiscoverWhatsNewSection";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { HomeReviewsSection } from "@/components/home/HomeReviewsSection";

export default async function Home() {
  const favourites = [
    {
      category: "Women's Wear",
      title: "Royal Banarasi Silk Zari Saree",
      desc: "Opulent handwoven crimson silk saree featuring pure gold zari brocade work.",
      price: "₹4,999",
      originalPrice: "₹7,999",
      discount: "38% OFF",
      badge: "BESTSELLER",
      img: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?auto=format&fit=crop&q=85&w=800",
      actionText: "Shop Now",
      href: "/womens-wear",
    },
    {
      category: "Beauty & Self-Care",
      title: "Luxury Glow & Radiance Beauty Set",
      desc: "Curated botanical serum, rose water mist, and 24K gold nourishing cream.",
      price: "₹1,899",
      originalPrice: "₹2,699",
      discount: "30% OFF",
      badge: "TOP RATED",
      img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=85&w=800",
      actionText: "Shop Now",
      href: "/beauty",
    },
    {
      category: "Fine Jewellery",
      title: "Heritage Kundan & Pearl Choker Set",
      desc: "Handcrafted 22K gold-plated bridal necklace with emerald drops & matching jhumkas.",
      price: "₹3,499",
      originalPrice: "₹5,499",
      discount: "36% OFF",
      badge: "SIGNATURE PIECE",
      img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=85&w=800",
      actionText: "Shop Now",
      href: "/shop?category=Jewellery",
    },
    {
      category: "Curated Gifts",
      title: "The Royal Celebration Luxury Hamper",
      desc: "Artisanal saffron sweets, scented soy candles & personalized festive surprises.",
      price: "₹2,199",
      originalPrice: "₹3,299",
      discount: "33% OFF",
      badge: "POPULAR GIFT",
      img: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=85&w=800",
      actionText: "Explore Gifts",
      href: "/gifts",
    },
    {
      category: "Personal Styling",
      title: "1-on-1 Bespoke Styling Session",
      desc: "60-min personalized consultation, body-silhouette mapping & custom lookbook.",
      price: "₹1,999",
      originalPrice: "₹3,500",
      discount: "43% OFF",
      badge: "VERIFIED STYLIST",
      img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=85&w=800",
      actionText: "Book Now",
      href: "/personal-styling",
    },
  ];

  return (
    <div className="bg-white min-h-screen text-text-main font-sans overflow-x-hidden">
      {/* 1. Main Hero Banner (Aza Fashions Luxury Edge-to-Edge Slider) */}
      <HeroCarousel />

      {/* 2. Shop By Category (4 Main Shopping Departments Preview) */}
      <ExploreCategorySection />

      {/* 3. Trending Collections (Women's Wear Rich Interactive Carousel) */}
      <WomensCollectionsSection />

      {/* 4. Gifts for Every Occasion (Curated Hampers & Surprises) */}
      <GiftsOccasionsSection />

      {/* 5. Discover Your Personal Stylist (Book Verified Professionals) */}
      <div id="stylists">
        <PersonalStylistSection />
      </div>

      {/* 8. Beauty & Self-care Highlights (Femazon's Favourites Carousel) */}
      <section className="w-full bg-white py-3 sm:py-5 select-none">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="w-full bg-[#fbf9f6] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-accent/20 relative overflow-hidden shadow-2xs">
            <div className="absolute top-1/2 -translate-y-1/2 -left-10 hidden 2xl:block -rotate-90 origin-center opacity-25 select-none pointer-events-none">
              <span className="text-[120px] font-serif font-bold text-accent whitespace-nowrap uppercase tracking-tighter leading-none">
                FAVOURITES
              </span>
            </div>
            
            <div className="relative w-full z-10">
              <div className="flex flex-col items-center text-center mb-6 sm:mb-8 mx-auto">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#4A1513] block mb-1.5">
                  HANDPICKED &amp; BESTSELLING
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-stone-900 tracking-wide leading-tight">
                  Femazon&apos;s Favourites
                </h2>
                <p className="mt-1.5 text-stone-500 text-xs sm:text-sm font-sans italic max-w-xl mx-auto">
                  Explore our most-loved women&apos;s wear, luxury beauty, bridal jewellery, gifts and personal styling.
                </p>
              </div>
              
              <ServiceCarousel services={favourites} />
            </div>
          </div>
        </div>
      </section>

      {/* 8. Discover What's New & Video Highlights */}
      <DiscoverWhatsNewSection />

      {/* 9. Discover Brands Around You (Shop by Location: Coimbatore, Chennai, Bangalore, etc.) */}
      <DiscoverBrandsAroundYou />

      {/* 10. Instagram Editorial Feed (Follow Our Journey) */}
      <InstagramFeed />

      {/* 11. Grow Your Business / Newsletter Section */}
      <NewsletterSection />

      {/* 13. Rate & Review Section (Client Love & Verified Testimonials) */}
      <HomeReviewsSection />
    </div>
  );
}
