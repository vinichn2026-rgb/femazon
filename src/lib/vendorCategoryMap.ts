/**
 * Centralized dynamic vendor business types, categories, and cascading subcategories.
 * Strictly adheres to Femazon product & vendor taxonomy.
 */

export type VendorBusinessType =
  | "Boutique / Women's Wear"
  | "Jewellery & Accessories"
  | "Beauty & Self-care"
  | "Gift Shop";

export interface CategoryDefinition {
  name: string;
  subcategories: string[];
}

export const VENDOR_BUSINESS_TYPES: {
  id: VendorBusinessType;
  label: string;
  description: string;
  icon: string;
  isServiceEligible?: boolean;
}[] = [
  {
    id: "Boutique / Women's Wear",
    label: "Boutique / Women's Wear",
    description: "Sarees, Kurtis, Salwar Suits, Western Wear, Ethnic Dresses & Blouses",
    icon: "👗",
  },
  {
    id: "Jewellery & Accessories",
    label: "Jewellery & Accessories",
    description: "Gold, Silver, Imitation Jewellery, Earrings, Bangles, Handbags & Potlis",
    icon: "💍",
  },
  {
    id: "Beauty & Self-care",
    label: "Beauty & Self-care",
    description: "Clean Skincare, Makeup, Haircare, Artisanal Soaps & Personal Care",
    icon: "✨",
  },
  {
    id: "Gift Shop",
    label: "Gift Shop",
    description: "Curated Hampers, Birthday, Anniversary, Wedding & Personalised Gifts",
    icon: "🎁",
  },
];

export const VENDOR_CATEGORY_MAP: Record<VendorBusinessType, CategoryDefinition[]> = {
  "Boutique / Women's Wear": [
    {
      name: "Sarees",
      subcategories: [
        "Banarasi Silk Sarees",
        "Kanjeevaram Silk Sarees",
        "Chanderi Sarees",
        "Organza Sarees",
        "Georgette Sarees",
        "Pre-Draped Sarees",
        "Cotton Handloom Sarees",
        "Tussar & Linen Sarees"
      ],
    },
    {
      name: "Kurtis",
      subcategories: [
        "Anarkali Kurtis",
        "Straight Cut Kurtis",
        "A-Line Kurtis",
        "Short Kurtis & Tunics",
        "Embroidered Festive Kurtis",
        "Daily Wear Kurtis"
      ],
    },
    {
      name: "Salwar Suits",
      subcategories: [
        "Sharara & Gharara Sets",
        "Palazzo Suits",
        "Churidar Suits",
        "Straight Cut Suits",
        "Angrakha Ensembles"
      ],
    },
    {
      name: "Dresses",
      subcategories: [
        "Maxi Dresses",
        "Evening Gowns",
        "Cocktail Dresses",
        "Midi Dresses",
        "Cape Gowns"
      ],
    },
    {
      name: "Tops",
      subcategories: [
        "Shirts & Collared Tops",
        "Crop Tops & Camis",
        "Festive Tunics",
        "Casual Cotton Tops"
      ],
    },
    {
      name: "Western Wear",
      subcategories: [
        "Jumpsuits & Rompers",
        "Blazers & Formal Co-ords",
        "Casual Co-ord Sets",
        "Trousers & Jeans"
      ],
    },
    {
      name: "Ethnic Wear",
      subcategories: [
        "Bridal Lehengas",
        "Bridesmaid Lehengas",
        "Indo-Western Drape Sets",
        "Silk Co-ords",
        "Velvet Lehengas"
      ],
    },
    {
      name: "Blouses",
      subcategories: [
        "Bridal Embroidered Blouses",
        "Designer Padded Blouses",
        "Sleeveless Blouses",
        "Brocade & Silk Blouses"
      ],
    },
    {
      name: "Women's Bottom Wear",
      subcategories: [
        "Flared Palazzos",
        "Churidars & Leggings",
        "Ethnic Skirts",
        "Cigarette Pants",
        "Dhoti Pants"
      ],
    },
  ],

  "Jewellery & Accessories": [
    {
      name: "Gold Jewellery",
      subcategories: [
        "Gold Necklaces & Chokers",
        "Gold Earrings & Jhumkas",
        "Gold Bangles & Kadas",
        "Gold Rings",
        "Gold Mangalsutras & Pendants"
      ],
    },
    {
      name: "Silver Jewellery",
      subcategories: [
        "925 Sterling Silver Jewellery",
        "Oxidised Silver Jewellery",
        "Silver Anklets & Payals",
        "Silver Rings & Toe Rings",
        "Silver Chokers & Necklaces"
      ],
    },
    {
      name: "Imitation Jewellery",
      subcategories: [
        "Kundan & Polki Sets",
        "Temple & Heritage Jewellery",
        "American Diamond (AD) Sets",
        "Meenakari Jewellery",
        "Beaded & Pearl Jewellery"
      ],
    },
    {
      name: "Earrings",
      subcategories: [
        "Jhumkas & Chandbalis",
        "Studs & Tops",
        "Hoops & Balis",
        "Danglers & Drop Earrings",
        "Ear Cuffs"
      ],
    },
    {
      name: "Necklaces",
      subcategories: [
        "Bridal Chokers",
        "Collar & Princess Necklaces",
        "Long Haar & Rani Haar",
        "Minimalist Daily Pendants"
      ],
    },
    {
      name: "Bangles",
      subcategories: [
        "Bridal Chooda Sets",
        "Kada Bangles",
        "Silk Thread Bangles",
        "Glass & Lac Bangles",
        "Adjustable Bracelets"
      ],
    },
    {
      name: "Rings",
      subcategories: [
        "Solitaire Rings",
        "Statement Cocktail Rings",
        "Traditional Floral Rings",
        "Stackable Band Rings"
      ],
    },
    {
      name: "Handbags",
      subcategories: [
        "Handcrafted Potli Bags",
        "Bridal Embellished Clutches",
        "Structured Tote Bags",
        "Sling & Crossbody Bags",
        "Ethnic Batua Bags"
      ],
    },
    {
      name: "Hair Accessories",
      subcategories: [
        "Maang Tikka & Passa",
        "Matha Patti & Sheeshpatti",
        "Hair Pins & Brooches",
        "Floral Hair Vines & Juda Pins"
      ],
    },
  ],

  "Beauty & Self-care": [
    {
      name: "Skincare",
      subcategories: [
        "Botanical Face Serums",
        "Hydrating Face Creams & Gels",
        "Gentle Cleansers & Face Washes",
        "Broad Spectrum Sunscreens",
        "Exfoliating Masks & Scrubs"
      ],
    },
    {
      name: "Makeup",
      subcategories: [
        "Clean Lipsticks & Lip Tints",
        "Foundations & Skin Tints",
        "Kajal, Eyeliners & Mascaras",
        "Blush & Mineral Highlighters",
        "Setting Powders & Sprays"
      ],
    },
    {
      name: "Haircare",
      subcategories: [
        "Traditional Ayurvedic Hair Oils",
        "Sulphate-Free Shampoos",
        "Nourishing Hair Conditioners",
        "Hair Masks & Spa Creams",
        "Scalp Serums"
      ],
    },
    {
      name: "Personal Care",
      subcategories: [
        "Artisanal Cold-Processed Soaps",
        "Body Washes & Shower Gels",
        "Deep Nourish Body Lotions & Butters",
        "Aromatic Bath Salts & Soaks",
        "Hand & Foot Care Creams"
      ],
    },
    {
      name: "Beauty Products",
      subcategories: [
        "Kumkumadi & Glow Oils",
        "Pure Rosewater & Botanical Mists",
        "Natural Aromatherapy & Essential Oils",
        "Holistic Wellness Kits"
      ],
    },
    {
      name: "Nail Care",
      subcategories: [
        "Non-Toxic Nail Polishes",
        "Nail Strengthening Serums",
        "Cuticle Care Oils & Balms"
      ],
    },
  ],

  "Gift Shop": [
    {
      name: "Birthday Gifts",
      subcategories: [
        "Curated Birthday Gift Boxes",
        "Birthday Keepsakes for Her",
        "Birthday Hampers for Him",
        "Milestone Celebration Favors"
      ],
    },
    {
      name: "Anniversary Gifts",
      subcategories: [
        "Couple Memory Keepsakes",
        "Romantic Luxury Hampers",
        "Custom Engraved Frames",
        "Anniversary Celebration Boxes"
      ],
    },
    {
      name: "Wedding Gifts",
      subcategories: [
        "Bridal Trousseau Boxes",
        "Custom Wedding Favors",
        "Luxury Shagun & Cash Boxes",
        "Gourmet Gifting Suites"
      ],
    },
    {
      name: "Personalised Gifts",
      subcategories: [
        "Customized Nameplates & Wall Art",
        "Engraved Wooden Keepsakes",
        "Personalized Drinkware & Mugs",
        "Custom Photo Albums & Journals"
      ],
    },
    {
      name: "Gift Hampers",
      subcategories: [
        "Artisanal Sweets & Dry Fruit Hampers",
        "Luxury Spa & Self-care Hampers",
        "Tea & Coffee Connoisseur Boxes",
        "Corporate Appreciation Hampers"
      ],
    },
    {
      name: "Return Gifts",
      subcategories: [
        "Housewarming Favors",
        "Mehendi & Sangeet Favors",
        "Baby Shower Keepsakes",
        "Festive Pooja Favors"
      ],
    },
    {
      name: "Festival Gifts",
      subcategories: [
        "Diwali Celebration Hampers",
        "Rakhi Gift Boxes & Sets",
        "Eid Mubarak Gift Boxes",
        "Christmas & New Year Hampers"
      ],
    },
  ],
};

/**
 * Automatically detects the canonical business type from the vendor's profile or registered category.
 */
export function detectBusinessType(
  businessCategory?: string | null,
  businessType?: string | null
): VendorBusinessType {
  const combined = `${businessCategory || ''} ${businessType || ''}`.toLowerCase();

  if (
    combined.includes('jewel') ||
    combined.includes('accessory') ||
    combined.includes('potli') ||
    combined.includes('gold') ||
    combined.includes('silver') ||
    combined.includes('bangle') ||
    combined.includes('earring')
  ) {
    return 'Jewellery & Accessories';
  }

  if (
    combined.includes('beauty') ||
    combined.includes('skincare') ||
    combined.includes('haircare') ||
    combined.includes('cosmetic') ||
    combined.includes('soap') ||
    combined.includes('makeup') ||
    combined.includes('wellness')
  ) {
    return 'Beauty & Self-care';
  }

  if (
    combined.includes('gift') ||
    combined.includes('hamper') ||
    combined.includes('artisan') ||
    combined.includes('craft') ||
    combined.includes('personalised') ||
    combined.includes('favor')
  ) {
    return 'Gift Shop';
  }

  // Default to Boutique / Women's Wear
  return "Boutique / Women's Wear";
}

/**
 * Returns true only if the vendor is explicitly a salon, beauty stylist, or bespoke service provider.
 * Pure physical product sellers (Boutique, Jewellery, Gift Shop) return false.
 */
export function isServiceVendor(
  businessCategory?: string | null,
  businessType?: string | null
): boolean {
  const combined = `${businessCategory || ''} ${businessType || ''}`.toLowerCase();
  return (
    combined.includes('salon') ||
    combined.includes('makeup artist') ||
    combined.includes('stylist') ||
    combined.includes('tailoring service') ||
    combined.includes('bespoke service') ||
    combined.includes('custom tailor')
  );
}

/**
 * Get categories list for a business type.
 */
export function getCategoriesForBusinessType(type: VendorBusinessType): CategoryDefinition[] {
  return VENDOR_CATEGORY_MAP[type] || VENDOR_CATEGORY_MAP["Boutique / Women's Wear"];
}

/**
 * Get subcategories list for a category within a business type.
 */
export function getSubcategoriesForCategory(
  type: VendorBusinessType,
  categoryName: string
): string[] {
  const categories = getCategoriesForBusinessType(type);
  const matched = categories.find((c) => c.name.toLowerCase() === categoryName.trim().toLowerCase());
  return matched ? matched.subcategories : [];
}
