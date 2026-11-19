export interface MarketplaceCategory {
  id: string;
  name: string;
  slug: string;
  type: 'product' | 'service';
  tagline: string;
  heroImage: string;
  description: string;
  subcategories: {
    name: string;
    slug: string;
    image: string;
    description: string;
    count?: number;
  }[];
}

export const BEAUTY_PRODUCT_SUBCATEGORIES = [
  {
    name: "Skincare",
    slug: "skincare",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
    description: "Serums, cleansers, sunscreens, and botanical facial oils.",
  },
  {
    name: "Haircare",
    slug: "haircare",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop",
    description: "Nourishing hair oils, shampoos, masks, and scalp care.",
  },
  {
    name: "Makeup",
    slug: "makeup",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop",
    description: "Clean foundations, lip tints, kajals, and luminous palettes.",
  },
  {
    name: "Bath & Body",
    slug: "bath-body",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop",
    description: "Artisanal soaps, body scrubs, mists, and moisturizing lotions.",
  },
  {
    name: "Personal Hygiene",
    slug: "personal-hygiene",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop",
    description: "Gentle deodorants, hand care, and daily freshness essentials.",
  },
  {
    name: "Feminine Hygiene",
    slug: "feminine-hygiene",
    image: "https://images.unsplash.com/photo-1512290900672-1f55a15340a5?q=80&w=600&auto=format&fit=crop",
    description: "Organic pads, menstrual cups, intimate washes, and comfort care.",
  },
  {
    name: "Grooming Essentials",
    slug: "grooming-essentials",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
    description: "Brow kits, razors, wax strips, and everyday self-grooming.",
  },
  {
    name: "Beauty Tools",
    slug: "beauty-tools",
    image: "https://images.unsplash.com/photo-1512496015851-a1dc8b41cd83?q=80&w=600&auto=format&fit=crop",
    description: "Makeup brushes, jade rollers, gua sha, and hair styling tools.",
  },
];

export const MARKETPLACE_CATEGORIES: Record<string, MarketplaceCategory> = {
  shop: {
    id: "shop",
    name: "Shop",
    slug: "shop",
    type: "product",
    tagline: "Curated Women's Fashion & Lifestyle Collections",
    heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
    description: "Explore exquisite apparel, accessories, footwear, and artisanal collections sourced directly from verified boutique owners, regional craftswomen, and independent fashion designers.",
    subcategories: [
      {
        name: "Clothing",
        slug: "clothing",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
        description: "Anarkalis, Sarees, Kurta Sets, Co-ords, and Western dresses.",
        count: 142
      },
      {
        name: "Footwear",
        slug: "footwear",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop",
        description: "Handcrafted juttis, embellished kolhapuris, heels & everyday flats.",
        count: 58
      },
      {
        name: "Bags",
        slug: "bags",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop",
        description: "Designer potlis, statement clutches, tote bags & vegan leather satchels.",
        count: 44
      },
      {
        name: "Jewellery",
        slug: "jewellery",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
        description: "Kundan, temple jewellery, freshwater pearls, oxidized silver & minimal everyday gold.",
        count: 89
      },
      {
        name: "Accessories",
        slug: "accessories",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop",
        description: "Embroidered belts, silk scarves, hair ornaments & festive dupattas.",
        count: 36
      },
      {
        name: "Beauty Products",
        slug: "beauty-products",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop",
        description: "Organic skincare, clean makeup formulations, botanical hair mists & artisanal soaps.",
        count: 67
      }
    ]
  },
  beauty: {
    id: "beauty",
    name: "Beauty & Self-care",
    slug: "beauty",
    type: "service",
    tagline: "Salons, Makeup Artists & Wellness Specialists",
    heroImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop",
    description: "Explore beauty and self-care services currently listed on Femazon. Confirm service details and availability with providers before booking.",
    subcategories: [
      {
        name: "Beauty Parlours",
        slug: "beauty-parlours",
        image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=600&auto=format&fit=crop",
        description: "Complete head-to-toe salon packages, facials, waxing, and hair spa treatments.",
        count: 28
      },
      {
        name: "Makeup Artists",
        slug: "makeup-artists",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600&auto=format&fit=crop",
        description: "HD & Airbrush bridal makeup, festive lookouts, and camera-ready glam.",
        count: 35
      },
      {
        name: "Hair Stylists",
        slug: "hair-stylists",
        image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=600&auto=format&fit=crop",
        description: "Bespoke styling, keratin treatments, blowout styling, and floral braids.",
        count: 22
      },
      {
        name: "Skincare Professionals",
        slug: "skincare-professionals",
        image: "https://images.unsplash.com/photo-1512290900672-1f55a15340a5?q=80&w=600&auto=format&fit=crop",
        description: "Holistic skin brightening, anti-pollution detox, Ayurvedic facials & consultations.",
        count: 19
      },
      {
        name: "Nail Artists",
        slug: "nail-artists",
        image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=600&auto=format&fit=crop",
        description: "Gel nail extensions, Russian manicure, bridal nail art & chrome finishes.",
        count: 14
      },
      {
        name: "Mehendi Professionals",
        slug: "mehendi-professionals",
        image: "https://images.unsplash.com/photo-1598305015383-7d727b11c97a?q=80&w=600&auto=format&fit=crop",
        description: "Intricate Arabic, Rajasthani, Indo-Western & Bridal organic henna.",
        count: 42
      }
    ]
  },
  styling: {
    id: "styling",
    name: "Personal Styling",
    slug: "styling",
    type: "service",
    tagline: "Personal Styling & Wardrobe Support",
    heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
    description: "Discover what flatters your silhouette, declutter your closet, and craft signature ensembles for boardroom meetings, festive galas, and life milestones.",
    subcategories: [
      {
        name: "Personal Stylists",
        slug: "personal-stylists",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
        description: "1-on-1 personalized aesthetic styling, body-type analysis & color theory palette.",
        count: 18
      },
      {
        name: "Wardrobe Consultation",
        slug: "wardrobe-consultation",
        image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=600&auto=format&fit=crop",
        description: "Closet audits, capsule wardrobe curation, and smart mix-and-match styling.",
        count: 12
      },
      {
        name: "Personal Shopping Assistance",
        slug: "shopping-assistance",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
        description: "Guided shopping tours across designer boutiques and virtual shopping curation.",
        count: 15
      },
      {
        name: "Occasion-based Styling",
        slug: "occasion-styling",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
        description: "Comprehensive styling for high-profile galas, red carpets, family celebrations & corporate keynotes.",
        count: 24
      }
    ]
  },
};

export interface MarketplaceProfessional {
  id: string;
  providerId?: number;
  serviceId?: number;
  name: string;
  businessName?: string;
  category: string;
  subcategory: string;
  role: string;
  location?: string;
  rating: number;
  reviewsCount: number;
  experience?: string;
  pricingDetails?: string;
  startingPrice: number;
  image: string;
  badges: string[];
  bio: string;
  availability?: string;
  portfolioUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  verified: boolean;
  servicesOffered: {
    name: string;
    duration: string;
    price: number;
    description: string;
  }[];
}

export const MARKETPLACE_PROFESSIONALS: MarketplaceProfessional[] = [
  // BEAUTY & SELF-CARE
  {
    id: "prof-1",
    name: "Dr. Ananya Sundaram",
    businessName: "Ananya Holistic Skincare",
    category: "Beauty & Self-care",
    subcategory: "Skincare",
    role: "Aesthetician & Skin Specialist",
    location: "Chennai (Nungambakkam & Doorstep)",
    rating: 4.95,
    reviewsCount: 124,
    experience: "9+ Years",
    startingPrice: 2200,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    badges: ["Femazon Verified", "Medical Aesthetician"],
    bio: "Specializing in organic derma-facials, sensitive skin therapy, and bridal glow regimes tailored for South Asian complexions.",
    availability: "Mon - Sat (10:00 AM - 6:30 PM)",
    verified: true,
    servicesOffered: [
      { name: "24K Gold Collagen Facial", duration: "75 mins", price: 2800, description: "Deep cleanse, organic steam, lymphatic massage and 24K gold foil mask." },
      { name: "Anti-Pigmentation Detox Regime", duration: "60 mins", price: 2200, description: "Fruit enzyme peel, high frequency toning, and vitamin C infusion." }
    ]
  },
  {
    id: "prof-2",
    name: "Nazneen Fathima",
    businessName: "Noor Mehendi Studio",
    category: "Beauty & Self-care",
    subcategory: "Mehendi",
    role: "Master Henna Artist",
    location: "Chennai, Bangalore (Travels Worldwide)",
    rating: 4.98,
    reviewsCount: 210,
    experience: "11+ Years",
    startingPrice: 2500,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    badges: ["Award Winner 2025", "100% Organic Henna"],
    bio: "Renowned bridal mehendi designer known for miniature portrait art, intricate architectural silhouettes, and guaranteed mahogany stain.",
    availability: "Available all 7 days with advance slot booking",
    verified: true,
    servicesOffered: [
      { name: "Bridal Full Royal Arms & Feet", duration: "4-5 hrs", price: 8500, description: "Detailed storytelling motifs, couple portraits, reverse negative filling." },
      { name: "Guest & Festive Hands (Both Sides)", duration: "45 mins", price: 2500, description: "Elegant Indo-Arabic flow for family events and festivals." }
    ]
  },
  {
    id: "prof-salon-1",
    name: "Aparna & Team",
    businessName: "Bella Luxe Women's Salon & Spa",
    category: "Beauty & Self-care",
    subcategory: "Parlours and Salons",
    role: "Luxury Salon & Spa Therapists",
    location: "Chennai (Alwarpet Studio & Doorstep Van)",
    rating: 4.94,
    reviewsCount: 148,
    experience: "14+ Years",
    startingPrice: 2499,
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=600&auto=format&fit=crop",
    badges: ["Sanitized Kits", "Women-Only Crew"],
    bio: "Full-service boutique salon bringing private, hygienic spa treatments, Moroccan bath rituals, and hair detox directly to your comfort zone.",
    availability: "Tue - Sun (9:30 AM - 7:30 PM)",
    verified: true,
    servicesOffered: [
      { name: "Full Head-to-Toe Relaxing Spa Package", duration: "120 mins", price: 3499, description: "Aroma oil massage, botanical body polish, radiance facial, and herbal hair spa." },
      { name: "Organic Honey Waxing & Manicure-Pedicure", duration: "90 mins", price: 2499, description: "Pain-free stripless organic wax, deep scrub pedicure, and cuticle nourishment." }
    ]
  },
  {
    id: "prof-mua-1",
    name: "Kavita Reddy",
    businessName: "Kavita Reddy Makeup Studio",
    category: "Beauty & Self-care",
    subcategory: "Makeup Artists",
    role: "Celebrity & Party Makeup Artist",
    location: "Chennai, Hyderabad",
    rating: 4.96,
    reviewsCount: 184,
    experience: "10+ Years",
    startingPrice: 4500,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600&auto=format&fit=crop",
    badges: ["HD & Airbrush Certified", "International Brands Only"],
    bio: "Expert in soft glam, glass skin finishes, and red-carpet party looks using Dior, NARS, and Charlotte Tilbury cosmetics.",
    availability: "All 7 Days (Book 48h in advance)",
    verified: true,
    servicesOffered: [
      { name: "Signature Soft Glam Party Makeup", duration: "75 mins", price: 4500, description: "Flawless HD skin prep, sultry eye look, premium mink lashes, and setting spray." },
      { name: "Sangeet & Cocktail Drama Makeup", duration: "90 mins", price: 6000, description: "Graphic or smoky eye, waterproof airbrush base, sculpting, and hair texturizing." }
    ]
  },
  {
    id: "prof-5",
    name: "Deepa Krishnan",
    businessName: "Luxe Drapes & Hair Artistry",
    category: "Beauty & Self-care",
    subcategory: "Hair Services",
    role: "Master Saree Draper & Hair Stylist",
    location: "Chennai & Suburbs (Doorstep Service)",
    rating: 4.97,
    reviewsCount: 176,
    experience: "10+ Years",
    startingPrice: 1500,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
    badges: ["15-Min Drape Guarantee", "500+ Brides Draped"],
    bio: "Specialist in pleating heavy Kanjivaram silks, Gujarati drapes, and modern pre-stitched silhouettes that stay pin-drop perfect all day.",
    availability: "All 7 Days (Early morning slots available)",
    verified: true,
    servicesOffered: [
      { name: "Traditional Bridal Silk Saree Drape + Hair Setting", duration: "60 mins", price: 2200, description: "Ironing pleats, pin-lock draping, fresh jasmine garland styling." },
      { name: "Family Draping Package (3 Sarees)", duration: "90 mins", price: 3800, description: "Express flawless draping for bride's mother, sisters, or bridesmaids." }
    ]
  },
  {
    id: "prof-nails-1",
    name: "Trisha Roy",
    businessName: "Polished Chic Nail Studio",
    category: "Beauty & Self-care",
    subcategory: "Nail Services",
    role: "Senior Nail Artist & Extensionist",
    location: "Chennai (Besant Nagar & Home Visits)",
    rating: 4.91,
    reviewsCount: 96,
    experience: "6+ Years",
    startingPrice: 1400,
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=600&auto=format&fit=crop",
    badges: ["Cruelty-Free Gel", "Bridal Specialist"],
    bio: "Bespoke gel extensions, chrome finishes, press-on customization, and Russian manicures that protect your natural nail bed.",
    availability: "Mon - Sat (11:00 AM - 8:00 PM)",
    verified: true,
    servicesOffered: [
      { name: "Gel Extensions with French Chrome Art", duration: "90 mins", price: 2400, description: "Russian cuticles, durable soft gel tips, chrome glaze, and Swarovski accents." },
      { name: "Express Gel Polish & Nail Strengthening", duration: "45 mins", price: 1400, description: "Shaping, cuticle cleanup, IBX strengthener, and 3-week chip-resistant color." }
    ]
  },

  // PERSONAL STYLING
  {
    id: "prof-3",
    name: "Radhika Sethumadhavan",
    businessName: "Couture Persona Styling",
    category: "Personal Styling",
    subcategory: "Personal Stylists",
    role: "Editorial & Personal Wardrobe Stylist",
    location: "Chennai & Pan-India Virtual",
    rating: 4.92,
    reviewsCount: 88,
    experience: "8+ Years",
    startingPrice: 3500,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
    badges: ["NIFT Alum", "Celebrity Stylist"],
    bio: "Helps professional women, entrepreneurs, and brides define an authentic wardrobe identity without following fast-fashion traps.",
    availability: "Tue - Sun (11:00 AM - 7:00 PM)",
    verified: true,
    servicesOffered: [
      { name: "1-on-1 Full Body & Color Archetype Session", duration: "90 mins", price: 3500, description: "Detailed PDF color palette, silhouette recommendations, lookbook blueprint." },
      { name: "Complete Wardrobe Audit & Capsule Build", duration: "3 hrs", price: 6500, description: "In-home wardrobe declutter, 25+ styled outfits photographed with existing clothes." }
    ]
  },
  {
    id: "prof-style-wardrobe",
    name: "Priyanka Nair",
    businessName: "Capsule Wardrobe Studio",
    category: "Personal Styling",
    subcategory: "Wardrobe Consultation",
    role: "Closet Organizer & Wardrobe Consultant",
    location: "Chennai & Bangalore",
    rating: 4.93,
    reviewsCount: 72,
    experience: "7+ Years",
    startingPrice: 3000,
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=600&auto=format&fit=crop",
    badges: ["Sustainable Fashion Advocate", "Capsule Pro"],
    bio: "Transform your daily morning routine with a streamlined, 35-piece capsule wardrobe tailored to South Asian climates and executive lifestyles.",
    availability: "Wed - Mon (10:00 AM - 6:00 PM)",
    verified: true,
    servicesOffered: [
      { name: "In-Person Closet Declutter & Reorganization", duration: "3.5 hrs", price: 5500, description: "Category sorting, donate vs. tailor pile, outfit cataloging, and gap analysis." },
      { name: "Virtual Seasonal Wardrobe Reset", duration: "75 mins", price: 3000, description: "Digital closet audit via video call with shopping list for missing staple pieces." }
    ]
  },
  {
    id: "prof-style-shopping",
    name: "Neha Mathur",
    businessName: "Style Companion by Neha",
    category: "Personal Styling",
    subcategory: "Personal Shopping Assistance",
    role: "Boutique & Designer Shopping Guide",
    location: "Chennai (T. Nagar, Khader Nawaz Khan Rd)",
    rating: 4.95,
    reviewsCount: 81,
    experience: "6+ Years",
    startingPrice: 2800,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
    badges: ["Boutique Insider", "Discounts Access"],
    bio: "Save hours and avoid buyers remorse with a personal shopping companion who knows every hidden designer store and master tailor in the city.",
    availability: "Fri - Sun (11:00 AM - 8:00 PM)",
    verified: true,
    servicesOffered: [
      { name: "Half-Day Guided Shopping Experience", duration: "4 hrs", price: 4000, description: "Curated store itinerary matching your budget, fit trial feedback, and alterations supervision." },
      { name: "Curated Virtual Shopping Lookbook", duration: "Online", price: 2800, description: "20 handpicked direct buy links across ethnic & western wear with accessories." }
    ]
  },
  {
    id: "prof-style-occasion",
    name: "Maya Menon",
    businessName: "Maya Menon Couture Advisory",
    category: "Personal Styling",
    subcategory: "Occasion-based Styling",
    role: "Gala, Red Carpet & Keynote Stylist",
    location: "Chennai, Pan-India",
    rating: 4.97,
    reviewsCount: 64,
    experience: "9+ Years",
    startingPrice: 4200,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
    badges: ["Runway Stylist", "VIP Discretion"],
    bio: "Head-to-toe ensemble conceptualization for high-profile weddings, leadership keynotes, award ceremonies, and media appearances.",
    availability: "Available with 1-week prior booking",
    verified: true,
    servicesOffered: [
      { name: "Milestone Occasion Complete Styling", duration: "2 Sessions", price: 7500, description: "Outfit sourcing, jewellery matching, footwear, handbag, and hair/makeup brief." },
      { name: "Cocktail / Reception Statement Look", duration: "90 mins", price: 4200, description: "Styling modern Indo-Western or fusion evening gown with customized accessories." }
    ]
  },

];

export const INITIAL_PARTNER_APPLICATIONS = [
  {
    id: 101,
    name: "Pooja Ramachandran",
    email: "pooja.ram@boutiquepooja.com",
    phone: "+91 98401 22334",
    businessName: "Pooja's Handloom Silks & Studio",
    applicantType: "BOUTIQUE",
    categories: "Clothing, Saree, Handloom",
    description: "Curator of authentic Chettinad cottons and pure Kanchipuram zari sarees directly from weaver clusters in Tamil Nadu.",
    experience: "7 years running boutique in Mylapore, Chennai",
    location: "Chennai, Tamil Nadu",
    serviceInfo: "Monthly inventory volume ~200 pieces; looking to expand pan-India via Femazon.",
    pricingInfo: "Rs. 2,500 - Rs. 35,000",
    portfolio: "https://instagram.com/poojahandloomstudio",
    documents: "GSTIN_33ABCDE1234F1Z5.pdf",
    status: "PENDING",
    createdAt: new Date().toISOString()
  },
  {
    id: 102,
    name: "Dr. Shalini Varma",
    email: "drshalini@ayurskin.in",
    phone: "+91 97910 88776",
    businessName: "AyurGlow Organic Skincare",
    applicantType: "INDIVIDUAL_PROFESSIONAL",
    categories: "Skincare, Beauty Products, Wellness",
    description: "Ayurvedic dermatologist formulating handmade saffron night elixirs, ubtans, and cold-pressed kumkumadi oils.",
    experience: "12 years clinical Ayurveda, ISO-certified formulation lab",
    location: "Bangalore & Chennai",
    serviceInfo: "Consultations and small-batch organic beauty merchandise.",
    pricingInfo: "Consultation: Rs. 999 | Products: Rs. 650 - Rs. 2,400",
    portfolio: "https://ayurglow.in/portfolio",
    documents: "AYUSH_LICENSE_2024.pdf",
    status: "UNDER_REVIEW",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 103,
    name: "Swetha Nambiar",
    email: "swetha@nambiarjewels.com",
    phone: "+91 94441 55443",
    businessName: "Nambiar Silver Heritage",
    applicantType: "SELLER",
    categories: "Jewellery, Accessories",
    description: "Authentic 92.5 Hallmarked oxidized silver temple jewellery, chokers, jhumkas, and anklets crafted in Salem.",
    experience: "Second generation silversmith boutique",
    location: "Salem & Chennai",
    serviceInfo: "Ready stock of 300+ SKUs with hallmark guarantee certification.",
    pricingInfo: "Rs. 1,200 - Rs. 18,000",
    portfolio: "https://nambiarjewels.example.com",
    documents: "BIS_HALLMARK_CERT_2025.pdf",
    status: "APPROVED",
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 104,
    name: "Aparna Sundar",
    email: "aparna@bellaluxespa.in",
    phone: "+91 98840 55667",
    businessName: "Bella Luxe Women's Salon & Spa",
    applicantType: "PARLOUR_SALON",
    categories: "Parlours and Salons, Skincare, Hair Services",
    description: "All-women certified team providing hygienic at-home spa therapies, bridal salon packages, and organic hair detox.",
    experience: "14 years in Alwarpet & luxury doorstep service",
    location: "Chennai, Tamil Nadu",
    serviceInfo: "Mobile spa van with sterilized equipment and disposable kits.",
    pricingInfo: "Rs. 1,500 - Rs. 8,500",
    portfolio: "https://bellaluxespa.in",
    documents: "HEALTH_TRADE_LICENSE_2025.pdf",
    status: "PENDING",
    createdAt: new Date(Date.now() - 43200000).toISOString()
  },
  {
    id: 105,
    name: "Meera & Shreya",
    email: "contact@femmeconcierge.com",
    phone: "+91 98410 77889",
    businessName: "Femme Concierge & Local Errands",
    applicantType: "SERVICE_BUSINESS",
    categories: "Personal Assistance, Shopping Assistance, Errand Services",
    description: "Police-verified women team assisting female executives, elderly ladies, and new mothers with boutique errands, saree shopping accompaniment, and city tasks.",
    experience: "5 years running verified women concierge network",
    location: "Chennai (Adyar, Velachery, OMR, Besant Nagar)",
    serviceInfo: "Doorstep courier, shopping assistant, and hospital/bank accompaniment.",
    pricingInfo: "Rs. 650 - Rs. 3,500",
    portfolio: "https://femmeconcierge.com",
    documents: "BUSINESS_REG_MSME_2024.pdf",
    status: "UNDER_REVIEW",
    createdAt: new Date(Date.now() - 129600000).toISOString()
  }
];
