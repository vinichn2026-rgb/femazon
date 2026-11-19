export interface MarketplaceLocation {
  id: string;
  name: string;
  state: string;
  tagline: string;
  image: string;
  activeSellersCount: number;
  productCount: number;
  popularCategories: string[];
  featuredBrands: {
    id: string;
    name: string;
    category: string;
    image: string;
    rating: number;
  }[];
  description: string;
}

export const ACTIVE_MARKETPLACE_LOCATIONS: MarketplaceLocation[] = [
  {
    id: "coimbatore",
    name: "Coimbatore",
    state: "Tamil Nadu",
    tagline: "The Textile Hub of South India",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
    activeSellersCount: 8,
    productCount: 124,
    popularCategories: ["Kovai Soft Silks", "Handloom Cotton", "Bridal Jewellery", "Gift Hampers"],
    description: "Discover authentic handloom weavers, soft silk sarees, artisan boutiques and traditional gifting businesses from Coimbatore.",
    featuredBrands: [
      {
        id: "cbe-1",
        name: "Kovai Handlooms & Silks",
        category: "Women's Wear",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300",
        rating: 4.9,
      },
      {
        id: "cbe-2",
        name: "Kongu Artisanal Treats & Gifts",
        category: "Gifts for All Occasions",
        image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=300",
        rating: 4.8,
      },
      {
        id: "cbe-3",
        name: "Siruvani Botanical Care",
        category: "Beauty & Self-care",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=300",
        rating: 4.9,
      },
    ],
  },
  {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    tagline: "Heritage Silk & Modern Boutiques",
    image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=80&w=600",
    activeSellersCount: 14,
    productCount: 218,
    popularCategories: ["Kanjivaram Sarees", "Temple Jewellery", "Designer Kurtis", "Occasion Hampers"],
    description: "Explore Chennai's celebrated silk studios, Mylapore antique temple jewellery, Besant Nagar contemporary fashion and bespoke gift ateliers.",
    featuredBrands: [
      {
        id: "chn-1",
        name: "Mylapore Silk Heritage",
        category: "Women's Wear",
        image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=80&w=300",
        rating: 5.0,
      },
      {
        id: "chn-2",
        name: "Adyar Temple Ornaments",
        category: "Jewellery & Accessories",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300",
        rating: 4.9,
      },
      {
        id: "chn-3",
        name: "Madras Craft & Gifting Co.",
        category: "Gifts for All Occasions",
        image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=300",
        rating: 4.8,
      },
    ],
  },
  {
    id: "bangalore",
    name: "Bangalore",
    state: "Karnataka",
    tagline: "Contemporary Silhouettes & Fusion Couture",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600",
    activeSellersCount: 11,
    productCount: 165,
    popularCategories: ["Indo-Western", "Organic Skincare", "Minimalist Jewellery", "Bespoke Hampers"],
    description: "Indiranagar indie fashion labels, Koramangala clean beauty creators, and modern accessories studios crafting fresh styles.",
    featuredBrands: [
      {
        id: "blr-1",
        name: "Velvet Rose Atelier",
        category: "Women's Wear",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=300",
        rating: 4.9,
      },
      {
        id: "blr-2",
        name: "Koramangala Pure Botanicals",
        category: "Beauty & Self-care",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=300",
        rating: 4.9,
      },
    ],
  },
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    tagline: "Runway Glamour & Designer Couture",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=600",
    activeSellersCount: 16,
    productCount: 290,
    popularCategories: ["Bridal Lehengas", "Cocktail Gowns", "Kundan Chokers", "Luxury Gift Sets"],
    description: "Home to India's most prestigious couture boutiques, celebrity bridal studios, and luxury jewellery designers.",
    featuredBrands: [
      {
        id: "mum-1",
        name: "Nagla Fashion Atelier",
        category: "Women's Wear",
        image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=300",
        rating: 4.9,
      },
    ],
  },
  {
    id: "delhi",
    name: "Delhi NCR",
    state: "Delhi",
    tagline: "Royal Trousseau & Heritage Embroidery",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600",
    activeSellersCount: 12,
    productCount: 195,
    popularCategories: ["Zardozi Lehengas", "Anarkali Suits", "Polki Jewellery", "Wedding Hampers"],
    description: "Regal bridal ateliers from Mehrauli and Chandni Chowk specializing in timeless Mughal and royal zardozi works.",
    featuredBrands: [
      {
        id: "del-1",
        name: "Femazon Royal Heritage Studio",
        category: "Women's Wear",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=300",
        rating: 5.0,
      },
    ],
  },
];
