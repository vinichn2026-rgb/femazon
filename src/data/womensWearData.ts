export interface WomensWearCategory {
  id: string;
  name: string;
  slug: string;
  group?: "Indian Wear" | "Western Wear" | "Other Fashion";
  image: string;
  description: string;
  subcategories: string[];
}

export interface WomensWearOccasion {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  keywords: string[];
}

export const WOMENS_WEAR_OCCASIONS: WomensWearOccasion[] = [
  {
    id: "festive-wedding",
    name: "Festive & Wedding",
    subtitle: "Sarees, Lehengas, Anarkalis & Shararas",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=600",
    keywords: ["saree", "lehenga", "anarkali", "sharara", "gharara", "bridal", "festive", "zari", "silk", "jewellery", "wedding"],
  },
  {
    id: "work-everyday",
    name: "Work & Everyday",
    subtitle: "Kurtas, Trousers, Shirts & Comfort Fits",
    image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600",
    keywords: ["kurta", "kurti", "salwar", "top", "shirt", "trouser", "pant", "cotton", "linen", "office", "everyday"],
  },
  {
    id: "party-evening",
    name: "Party & Evening",
    subtitle: "Dresses, Jumpsuits, Jackets & Clutches",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=600",
    keywords: ["dress", "gown", "jumpsuit", "jacket", "skirt", "cocktail", "evening", "party", "handbag", "heels"],
  },
  {
    id: "resort-brunch",
    name: "Resort & Lounge",
    subtitle: "Co-ord Sets, Ethnic Dresses & Loungewear",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=85&w=600",
    keywords: ["co-ord", "coord", "ethnic dress", "kaftan", "lounge", "nightwear", "resort", "brunch", "midi", "maxi"],
  },
];

export const WOMENS_WEAR_GROUP_NAMES: Array<"Indian Wear" | "Western Wear" | "Other Fashion"> = [
  "Indian Wear",
  "Western Wear",
  "Other Fashion",
];

export interface WomensWearProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  vendorName: string;
  vendorId?: number;
  category: string;
  subCategory: string;
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
  sizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isTrending: boolean;
  inStock: boolean;
  readyToShip: boolean;
  deliveryDays?: number;
  fabric: string;
  createdAt?: string;
  fabricCare?: string;
  description: string;
  packageContains?: string;
  silhouette?: string;
}

export const WOMENS_WEAR_CATEGORIES: WomensWearCategory[] = [
  // INDIAN WEAR
  {
    id: "sarees",
    name: "Sarees",
    slug: "sarees",
    group: "Indian Wear",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=800",
    description: "Kanjeevaram silks, Banarasi weaves, organza, and effortless pre-draped cocktail sarees.",
    subcategories: ["Banarasi Silk", "Kanjeevaram Heritage", "Organza & Tissue", "Pre-Draped Sarees", "Chiffon & Georgette"]
  },
  {
    id: "kurtas-kurta-sets",
    name: "Kurtas & Kurta Sets",
    slug: "kurtas-kurta-sets",
    group: "Indian Wear",
    image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=800",
    description: "Everyday cotton kurtis, Chikankari tunics, straight kurta sets, and festive ensembles.",
    subcategories: ["Straight Kurta Sets", "Chikankari Handloom", "Festive Kurta Sets", "Short Kurtas", "Palazzo Sets"]
  },
  {
    id: "lehengas",
    name: "Lehengas",
    slug: "lehengas",
    group: "Indian Wear",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=800",
    description: "Heavy bridal zardozi lehengas, pastel sangeet skirts, and lightweight printed reception sets.",
    subcategories: ["Bridal Zardozi", "Pastel Sangeet", "Mirror Work", "Printed Silk", "Cape Lehengas"]
  },
  {
    id: "salwar-suits",
    name: "Salwar Suits",
    slug: "salwar-suits",
    group: "Indian Wear",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=800",
    description: "Palazzo dupatta ensembles, Pakistani long suits, and classic churidars.",
    subcategories: ["Palazzo Suit Sets", "Pakistani Long Suits", "Churidar Ensembles", "Jacket Suits"]
  },
  {
    id: "anarkali",
    name: "Anarkali",
    slug: "anarkali",
    group: "Indian Wear",
    image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=800",
    description: "Floor-length kalidar Anarkalis, embroidered silk flares, and breezy festive silhouettes.",
    subcategories: ["Floor-Length Anarkali", "Silk Kalidar", "Printed Anarkali", "Cape Anarkali"]
  },
  {
    id: "sharara-gharara",
    name: "Sharara & Gharara",
    slug: "sharara-gharara",
    group: "Indian Wear",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=800",
    description: "Statement flared sharara sets, heritage gota-patti ghararas, and festive peplum pairs.",
    subcategories: ["Gota Patti Sharara", "Peplum Gharara Sets", "Velvet & Silk Sharara", "Pastel Festive Sets"]
  },
  {
    id: "ethnic-dresses",
    name: "Ethnic Dresses",
    slug: "ethnic-dresses",
    group: "Indian Wear",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=85&w=800",
    description: "Indo-western drapes, embroidered maxi dresses, and fusion kaftan silhouettes.",
    subcategories: ["Indo-Western Gowns", "Embroidered Maxis", "Festive Kaftans", "Cape Dresses"]
  },

  // WESTERN WEAR
  {
    id: "tops-shirts",
    name: "Tops & Shirts",
    slug: "tops-shirts",
    group: "Western Wear",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=85&w=800",
    description: "Peplum tops, oversized satin shirts, embroidered tunics, and tailored work blouses.",
    subcategories: ["Silk & Satin Shirts", "Peplum Tops", "Crop Tops", "Embroidered Tunics"]
  },
  {
    id: "dresses",
    name: "Dresses",
    slug: "dresses",
    group: "Western Wear",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=85&w=800",
    description: "Flowing maxi dresses, elegant midis, party bodycon silhouettes, and breathable sundresses.",
    subcategories: ["Maxi Dresses", "Midi Dresses", "Evening Gowns", "Bodycon & Cocktail", "Shirt Dresses"]
  },
  {
    id: "co-ord-sets",
    name: "Co-ord Sets",
    slug: "co-ord-sets",
    group: "Western Wear",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=85&w=800",
    description: "Effortless linen 2-piece sets, printed resort sets, and statement velvet festive co-ords.",
    subcategories: ["Linen Casual Co-ords", "Festive Embroidered Sets", "Printed Blazer Co-ords", "Kaftan & Pant Sets"]
  },
  {
    id: "trousers-pants",
    name: "Trousers & Pants",
    slug: "trousers-pants",
    group: "Western Wear",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=85&w=800",
    description: "Tailored wide-leg trousers, cigarette pants, flared palazzos, and culottes.",
    subcategories: ["Wide-Leg Trousers", "Cigarette Pants", "Flared Palazzos", "Culottes"]
  },
  {
    id: "skirts",
    name: "Skirts",
    slug: "skirts",
    group: "Western Wear",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800",
    description: "Pleated satin midi skirts, wrap skirts, and structured A-line silhouettes.",
    subcategories: ["Pleated Midi Skirts", "Satin Slip Skirts", "Wrap Skirts", "A-Line Skirts"]
  },
  {
    id: "jumpsuits",
    name: "Jumpsuits",
    slug: "jumpsuits",
    group: "Western Wear",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800",
    description: "Tailored evening jumpsuits, belted utility silhouettes, and draped resort rompers.",
    subcategories: ["Evening Jumpsuits", "Belted Tailored", "Resort Jumpsuits", "Cape Jumpsuits"]
  },
  {
    id: "jackets",
    name: "Jackets",
    slug: "jackets",
    group: "Western Wear",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800",
    description: "Tailored power blazers, embroidered ethnic shrugs, and cropped luxury jackets.",
    subcategories: ["Tailored Blazers", "Embroidered Shrugs", "Cropped Jackets", "Trench & Capes"]
  },

  // OTHER FASHION
  {
    id: "footwear",
    name: "Footwear",
    slug: "footwear",
    group: "Other Fashion",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=85&w=800",
    description: "Handcrafted embroidered juttis, block heels, kolhapuris, and evening mules.",
    subcategories: ["Embroidered Juttis", "Block Heels", "Kolhapuris", "Evening Mules"]
  },
  {
    id: "handbags",
    name: "Handbags",
    slug: "handbags",
    group: "Other Fashion",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=85&w=800",
    description: "Artisanal potlis, beaded clutches, structured totes, and everyday sling bags.",
    subcategories: ["Potlis & Batua", "Embellished Clutches", "Structured Totes", "Crossbody Slings"]
  },
  {
    id: "jewellery",
    name: "Jewellery",
    slug: "jewellery",
    group: "Other Fashion",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=85&w=800",
    description: "Kundan chokers, temple jewellery, polki jhumkas, and contemporary minimal pieces.",
    subcategories: ["Necklaces & Chokers", "Earrings & Jhumkas", "Bangles & Bracelets", "Temple & Kundan"]
  },
  {
    id: "fashion-accessories",
    name: "Fashion Accessories",
    slug: "fashion-accessories",
    group: "Other Fashion",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=85&w=800",
    description: "Silk stoles, embroidered dupattas, statement belts, and handcrafted hair accessories.",
    subcategories: ["Dupattas & Stoles", "Statement Belts", "Hair Accessories", "Designer Blouses"]
  },
  {
    id: "innerwear-loungewear",
    name: "Innerwear & Loungewear",
    slug: "innerwear-loungewear",
    group: "Other Fashion",
    image: "https://images.unsplash.com/photo-1512290900672-1f55a15340a5?auto=format&fit=crop&q=85&w=800",
    description: "Mulberry silk robes, breathable cotton pajama sets, shapewear, and comfort loungewear.",
    subcategories: ["Mulberry Silk Robes", "Cotton Pajama Sets", "Lounge Kaftans", "Seamless Innerwear"]
  }
];

export const WOMENS_WEAR_PRODUCTS: WomensWearProduct[] = [
  // 1. SAREES
  {
    id: "saree-01",
    name: "Crimson Royal Kanjeevaram Pure Zari Silk Saree",
    slug: "crimson-royal-kanjeevaram-pure-zari-silk-saree",
    brand: "Pooja's Handloom Silks",
    vendorName: "Pooja's Handloom Silks (Mylapore Boutique)",
    vendorId: 101,
    category: "Sarees",
    subCategory: "Kanjeevaram Heritage",
    price: 18500,
    originalPrice: 24500,
    discount: 24,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["Free Size (6.2m with Blouse)"],
    colors: ["Crimson Red", "Deep Gold"],
    rating: 4.9,
    reviewCount: 68,
    isNew: true,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "100% Pure Mulberry Silk & Gold Zari",
    fabricCare: "Dry Clean Only. Wrap in Muslin Cloth.",
    description: "Handcrafted by hereditary master weavers in Kanchipuram with traditional temple border motifs and pure zari pallu. Silk Mark Certified.",
    packageContains: "1 Saree with Unstitched Contrast Blouse Piece"
  },
  {
    id: "saree-02",
    name: "Blush Pink Hand-painted Organza Floral Saree",
    slug: "blush-pink-hand-painted-organza-floral-saree",
    brand: "Aura Designer Wear",
    vendorName: "Aura Designer Studio (Chennai)",
    category: "Sarees",
    subCategory: "Organza & Tissue",
    price: 8999,
    originalPrice: 12500,
    discount: 28,
    images: [
      "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["Free Size (6.2m with Blouse)"],
    colors: ["Blush Pink", "Sage Green"],
    rating: 4.8,
    reviewCount: 42,
    isNew: true,
    isTrending: false,
    inStock: true,
    readyToShip: true,
    deliveryDays: 3,
    fabric: "Pure Sheer Organza with Gota Patti Highlights",
    fabricCare: "Dry Clean Only",
    description: "Lightweight sheer organza drape adorned with delicate hand-painted pastel blooms and glistening gota scalloped edges.",
    packageContains: "1 Saree with Unstitched Satin Silk Blouse Piece"
  },
  {
    id: "saree-03",
    name: "Banarasi Pure Katan Silk Meenakari Saree",
    slug: "banarasi-pure-katan-silk-meenakari-saree",
    brand: "Varanasi Heritage Weaves",
    vendorName: "Varanasi Heritage Weaves (Chowk)",
    category: "Sarees",
    subCategory: "Banarasi Silk",
    price: 14800,
    originalPrice: 19500,
    discount: 24,
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["Free Size (6.2m with Blouse)"],
    colors: ["Emerald Green", "Rani Pink"],
    rating: 4.9,
    reviewCount: 53,
    isNew: true,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "100% Pure Katan Silk with Kadwa Floral Jaal & Meenakari Accents",
    fabricCare: "Dry Clean Only. Wrapped in breathable cotton muslin.",
    description: "Authentic Varanasi handloom weaving with fine floral jaal patterns woven in pure gold tested zari and vibrant meenakari details.",
    packageContains: "1 Saree with Running Silk Blouse"
  },
  {
    id: "saree-04",
    name: "Midnight Twilight Pre-Draped Cocktail Ruffle Saree",
    slug: "midnight-twilight-pre-draped-cocktail-ruffle-saree",
    brand: "Tarun Tahiliani Pret Partner",
    vendorName: "Luxe Drapes Boutique",
    category: "Sarees",
    subCategory: "Pre-Draped Sarees",
    price: 11200,
    originalPrice: 15000,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Midnight Navy", "Champagne Gold"],
    rating: 4.8,
    reviewCount: 31,
    isNew: true,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 3,
    fabric: "Pleated Shimmer Georgette with Embellished Crystal Belt",
    fabricCare: "Dry Clean Only",
    description: "Effortless pre-stitched cocktail saree ready to wear in 30 seconds. Features sculpted knife pleats and an ornate hand-embroidered waist belt.",
    packageContains: "Pre-stitched Saree with Stitched Blouse & Handcrafted Belt"
  },
  {
    id: "saree-05",
    name: "Handspun Chanderi Pattu Tissue Festive Saree",
    slug: "handspun-chanderi-pattu-tissue-festive-saree",
    brand: "Madhya Crafts Guild",
    vendorName: "Madhya Crafts Guild",
    category: "Sarees",
    subCategory: "Organza & Tissue",
    price: 7499,
    originalPrice: 9999,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["Free Size (6.2m with Blouse)"],
    colors: ["Pale Peach", "Warm Gold"],
    rating: 4.7,
    reviewCount: 28,
    isNew: false,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 4,
    fabric: "Chanderi Silk Cotton with Real Zari Border",
    fabricCare: "Dry Clean Only",
    description: "Lustrous gossamer Chanderi tissue drape with antique zari bootis and signature ashrafi motifs.",
    packageContains: "1 Saree with Unstitched Blouse Fabric"
  },
  {
    id: "saree-06",
    name: "Sunset Coral Floral Chiffon Festive Saree",
    slug: "sunset-coral-floral-chiffon-festive-saree",
    brand: "Sabyasachi Inspired Artisans",
    vendorName: "Aditi Couture Studio",
    category: "Sarees",
    subCategory: "Chiffon & Georgette",
    price: 5999,
    originalPrice: 7999,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["Free Size (6.2m with Blouse)"],
    colors: ["Sunset Coral", "Ivory Rose"],
    rating: 4.8,
    reviewCount: 47,
    isNew: true,
    isTrending: false,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "Pure French Chiffon with Sequin Scallop Border",
    fabricCare: "Dry Clean Only",
    description: "Featherlight Parisian chiffon saree in romantic sunset florals finished with micro-sequin scalloped border detailing.",
    packageContains: "1 Saree with Embroidered Raw Silk Blouse Piece"
  },

  // 2. KURTIS
  {
    id: "kurti-01",
    name: "Handcrafted Lucknowi Chikankari Modal Silk Kurti",
    slug: "handcrafted-lucknowi-chikankari-modal-silk-kurti",
    brand: "Heritage Thread Studio",
    vendorName: "Heritage Thread Studio (Boutique Partner)",
    category: "Kurtis",
    subCategory: "Chikankari Handloom",
    price: 3200,
    originalPrice: 4800,
    discount: 33,
    images: [
      "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pastel Lilac", "Ivory White", "Mint Green"],
    rating: 4.9,
    reviewCount: 84,
    isNew: true,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "Modal Silk with Pure Cotton Shadow Embroidery",
    fabricCare: "Gentle Hand Wash in Mild Detergent",
    description: "Authentic 32-stitch hand Chikankari embroidery created by women artisans. Ultra-soft breathable modal silk fabric.",
    packageContains: "1 Kurti with matching cotton slip"
  },
  {
    id: "kurti-02",
    name: "Flared Anarkali Floor-length Festive Kurti",
    slug: "flared-anarkali-floor-length-festive-kurti",
    brand: "Sheetal Batra",
    vendorName: "Sheetal Batra Pret",
    category: "Kurtis",
    subCategory: "Anarkali Kurtis",
    price: 6500,
    originalPrice: 8500,
    discount: 23,
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Mustard Gold", "Wine Red"],
    rating: 4.7,
    reviewCount: 39,
    isNew: false,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 3,
    fabric: "Chanderi Silk with Zari Yoke Work",
    fabricCare: "Dry Clean Recommended",
    description: "Graceful 28-kali flared anarkali silhouette with ornate metallic thread embroidery and matching tassel ties."
  },
  {
    id: "kurti-03",
    name: "Kashmiri Aari Embroidered Chanderi Straight Kurti",
    slug: "kashmiri-aari-embroidered-chanderi-straight-kurti",
    brand: "Kashmir Loom Studio",
    vendorName: "Kashmir Loom Studio",
    category: "Kurtis",
    subCategory: "Straight Cut Kurtis",
    price: 4299,
    originalPrice: 5800,
    discount: 26,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Dusty Rose", "Sage Green"],
    rating: 4.8,
    reviewCount: 41,
    isNew: true,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "Chanderi Silk with Intricate Needlework Yoke",
    fabricCare: "Dry Clean Only",
    description: "Classic straight-cut Chanderi kurti embellished with traditional Kashmiri Aari threadwork along the neckline, sleeves, and hemline.",
    packageContains: "1 Straight Kurti"
  },
  {
    id: "kurti-04",
    name: "Indigo Dabu Hand Block Print Pure Cotton A-Line Kurta",
    slug: "indigo-dabu-hand-block-print-pure-cotton-a-line-kurta",
    brand: "Bagru Earth Pret",
    vendorName: "Bagru Earth Pret Collective",
    category: "Kurtis",
    subCategory: "A-Line Flared",
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    colors: ["Indigo Blue", "Off-White"],
    rating: 4.9,
    reviewCount: 96,
    isNew: false,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 1,
    fabric: "100% Organic Handspun Cotton with Natural Indigo Dyes",
    fabricCare: "Cold Wash Separately with Mild Detergent",
    description: "Breathable daily wear A-line cotton kurta printed using mud-resist Dabu hand block technique by Rajasthan master craftspeople.",
    packageContains: "1 Cotton A-Line Kurta"
  },
  {
    id: "kurti-05",
    name: "Ivory & Mirrorwork Flared Angrakha Tunic Kurti",
    slug: "ivory-mirrorwork-flared-angrakha-tunic-kurti",
    brand: "House of Pataudi Pret",
    vendorName: "Royal Heritage Boutiques",
    category: "Kurtis",
    subCategory: "Anarkali Kurtis",
    price: 3899,
    originalPrice: 5200,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Ivory Gold", "Powder Blue"],
    rating: 4.8,
    reviewCount: 52,
    isNew: true,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "Georgette with Foil Mirror Work & Latkan Tie-ups",
    fabricCare: "Gentle Hand Wash or Dry Clean",
    description: "Festive crossover Angrakha silhouette highlighted with shimmering foil mirrors, gota ribbon edges, and handmade bell latkans.",
    packageContains: "1 Angrakha Kurti"
  },
  {
    id: "kurti-06",
    name: "Contemporary Mulberry Short Silk Tunic Kurta",
    slug: "contemporary-mulberry-short-silk-tunic-kurta",
    brand: "Fabindia Craft Collective",
    vendorName: "Fabindia Craft Collective",
    category: "Kurtis",
    subCategory: "Short Kurtas",
    price: 2499,
    originalPrice: 3200,
    discount: 22,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ruby Magenta", "Emerald Green"],
    rating: 4.7,
    reviewCount: 34,
    isNew: true,
    isTrending: false,
    inStock: true,
    readyToShip: true,
    deliveryDays: 3,
    fabric: "Mulberry Silk Blend with Mandarin Collar",
    fabricCare: "Hand Wash or Dry Clean",
    description: "Versatile hip-length short tunic kurta styled with a chic Chinese collar, side slits, and mother-of-pearl button placket.",
    packageContains: "1 Short Silk Tunic Kurta"
  },

  // 3. SALWAR SUITS
  {
    id: "suit-01",
    name: "Emerald Green Georgette Flared Sharara Dupatta Set",
    slug: "emerald-green-georgette-flared-sharara-dupatta-set",
    brand: "Paulmi & Harsh",
    vendorName: "Paulmi & Harsh Couture",
    category: "Salwar Suits",
    subCategory: "Sharara & Gharara Sets",
    price: 14500,
    originalPrice: 19500,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Emerald Green", "Royal Navy"],
    rating: 4.9,
    reviewCount: 57,
    isNew: true,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "Flowing Pure Viscose Georgette with Shantoon Lining",
    fabricCare: "Dry Clean Only",
    description: "Intricately embroidered peplum short kurta paired with a dramatically voluminous tiered sharara and sheer scalloped dupatta."
  },
  {
    id: "suit-02",
    name: "Powder Blue Chanderi Silk Straight Palazzo Suit",
    slug: "powder-blue-chanderi-silk-straight-palazzo-suit",
    brand: "Nazakat Ethnic",
    vendorName: "Nazakat Ethnic Boutique",
    category: "Salwar Suits",
    subCategory: "Palazzo Suit Sets",
    price: 5200,
    originalPrice: 7200,
    discount: 27,
    images: [
      "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Powder Blue", "Peach Nude"],
    rating: 4.8,
    reviewCount: 33,
    isNew: false,
    isTrending: false,
    inStock: true,
    readyToShip: true,
    deliveryDays: 3,
    fabric: "Chanderi Silk with Organza Border",
    fabricCare: "Dry Clean Recommended",
    description: "Classic straight-cut kurta paired with tailored wide palazzos and a botanical print organza dupatta."
  },

  // 4. LEHENGAS
  {
    id: "lehenga-01",
    name: "Wine Maroon Velvet Zardozi Bridal Heritage Lehenga",
    slug: "wine-maroon-velvet-zardozi-bridal-heritage-lehenga",
    brand: "Surkh Syahi",
    vendorName: "Surkh Syahi Bridal Studio",
    category: "Lehengas",
    subCategory: "Bridal Zardozi",
    price: 54000,
    originalPrice: 68000,
    discount: 20,
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["Semi-Stitched (Fits up to Bust 44, Waist 42)"],
    colors: ["Wine Maroon", "Bridal Red"],
    rating: 5.0,
    reviewCount: 94,
    isNew: true,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 4,
    fabric: "Micro Velvet with Pure Dabka & Nakshi Zardozi",
    fabricCare: "Specialist Dry Clean Only",
    description: "Heirloom bridal masterpiece crafted over 180 hours with antique gold zardozi embroidery, padded blouse, and double dupatta."
  },
  {
    id: "lehenga-02",
    name: "Pastel Sage Green Foil Mirror Sangeet Lehenga",
    slug: "pastel-sage-green-foil-mirror-sangeet-lehenga",
    brand: "Aura Designer Wear",
    vendorName: "Aura Designer Studio (Chennai)",
    category: "Lehengas",
    subCategory: "Pastel Sangeet",
    price: 26500,
    originalPrice: 35000,
    discount: 24,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Sage Green", "Ice Blue"],
    rating: 4.9,
    reviewCount: 46,
    isNew: true,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 3,
    fabric: "Net with Mirror Accents & Can-can Underlayer",
    fabricCare: "Dry Clean Only",
    description: "Light-catching mirror work ideal for sangeet dance nights. Features lightweight bounce with full flared can-can support."
  },

  // 5. WESTERN WEAR
  {
    id: "western-01",
    name: "Tailored Double-Breasted Ivory Power Blazer & Trouser",
    slug: "tailored-double-breasted-ivory-power-blazer-trouser",
    brand: "Femme Executive",
    vendorName: "Femme Executive Studio",
    category: "Western Wear",
    subCategory: "Tailored Blazers",
    price: 6800,
    originalPrice: 9500,
    discount: 28,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory White", "Camel Beige", "Onyx Black"],
    rating: 4.8,
    reviewCount: 51,
    isNew: true,
    isTrending: false,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "Crepe Twill Blend with Satin Inner Lining",
    fabricCare: "Dry Clean Recommended",
    description: "Structured boardroom-ready blazer featuring horn buttons, sharp lapels, and high-waisted pleated flare trousers."
  },
  {
    id: "western-02",
    name: "Pleated Halter-Neck Belted Satin Jumpsuit",
    slug: "pleated-halter-neck-belted-satin-jumpsuit",
    brand: "Urban Muse",
    vendorName: "Urban Muse Pret",
    category: "Western Wear",
    subCategory: "Jumpsuits & Rompers",
    price: 4400,
    originalPrice: 6200,
    discount: 29,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["S", "M", "L"],
    colors: ["Rust Terracotta", "Emerald Green"],
    rating: 4.7,
    reviewCount: 38,
    isNew: false,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 3,
    fabric: "Heavy Lustrous Poly-Satin",
    fabricCare: "Machine Wash Delicate",
    description: "Effortlessly glamorous cocktail jumpsuit featuring a high gathered halter neckline and tailored wide-leg trousers."
  },

  // 6. DRESSES
  {
    id: "dress-01",
    name: "Tiered Floral Chiffon Romantic Maxi Dress",
    slug: "tiered-floral-chiffon-romantic-maxi-dress",
    brand: "Floral Bloom Pret",
    vendorName: "Floral Bloom Designer Boutique",
    category: "Dresses",
    subCategory: "Maxi Dresses",
    price: 3499,
    originalPrice: 5200,
    discount: 32,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Lavender Floral", "Peach Blossom"],
    rating: 4.8,
    reviewCount: 77,
    isNew: true,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "Airy Chiffon with Soft Cotton-Voile Lining",
    fabricCare: "Gentle Hand Wash",
    description: "Breezy tiered silhouette with delicate smocked bodice, flutter cap sleeves, and romantic watercolor garden print."
  },
  {
    id: "dress-02",
    name: "Sleek Ruched Satin Cowl-Neck Midi Dress",
    slug: "sleek-ruched-satin-cowl-neck-midi-dress",
    brand: "Night Glamour",
    vendorName: "Night Glamour Studio",
    category: "Dresses",
    subCategory: "Midi Dresses",
    price: 2899,
    originalPrice: 4200,
    discount: 31,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Champagne Gold", "Classic Black", "Ruby Red"],
    rating: 4.9,
    reviewCount: 62,
    isNew: false,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "High-stretch Duchess Satin",
    fabricCare: "Hand Wash or Gentle Cycle",
    description: "Sculpting body-skimming midi dress with side ruched seam and an elegant draped cowl neckline."
  },

  // 7. TOPS
  {
    id: "top-01",
    name: "Embroidered Schiffli Pure Cotton Peplum Top",
    slug: "embroidered-schiffli-pure-cotton-peplum-top",
    brand: "Aura Studio",
    vendorName: "Aura Designer Studio (Chennai)",
    category: "Tops",
    subCategory: "Peplum Tops",
    price: 1899,
    originalPrice: 2899,
    discount: 34,
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Pristine White", "Butter Yellow"],
    rating: 4.7,
    reviewCount: 45,
    isNew: true,
    isTrending: false,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "100% Breathable Schiffli Eyelet Cotton",
    fabricCare: "Machine Wash Cold",
    description: "Flattering cinched peplum waist with embroidered scalloped hem and sweetheart neckline."
  },
  {
    id: "top-02",
    name: "Oversized Mulberry Silk Button-Down Blouse Shirt",
    slug: "oversized-mulberry-silk-button-down-blouse-shirt",
    brand: "Luxe Minimalist",
    vendorName: "Luxe Minimalist Pret",
    category: "Tops",
    subCategory: "Silk & Satin Shirts",
    price: 3600,
    originalPrice: 4999,
    discount: 28,
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Classic Olive", "Ivory Cream"],
    rating: 4.9,
    reviewCount: 38,
    isNew: false,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 3,
    fabric: "Pure Mulberry Silk Crepe",
    fabricCare: "Gentle Hand Wash or Dry Clean",
    description: "Drapes like liquid gold over trousers or tucked into skirts with mother-of-pearl button accents."
  },

  // 8. CO-ORD SETS
  {
    id: "coord-01",
    name: "Linen Notch-Collar Relaxed 2-Piece Co-ord Set",
    slug: "linen-notch-collar-relaxed-2-piece-coord-set",
    brand: "Naturals Pret",
    vendorName: "Naturals Organic Apparel",
    category: "Co-ord Sets",
    subCategory: "Linen Casual Co-ords",
    price: 3800,
    originalPrice: 5500,
    discount: 30,
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Terracotta Rust", "Oatmeal Beige", "Denim Blue"],
    rating: 4.9,
    reviewCount: 92,
    isNew: true,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "100% European Washed Linen",
    fabricCare: "Machine Wash Gentle",
    description: "Breathable all-day comfort featuring a relaxed short-sleeve shirt and elasticated drawstring trousers with deep pockets."
  },
  {
    id: "coord-02",
    name: "Festive Embroidered Silk Kaftan & Straight Pant Co-ord",
    slug: "festive-embroidered-silk-kaftan-straight-pant-coord",
    brand: "Sheetal Batra",
    vendorName: "Sheetal Batra Pret",
    category: "Co-ord Sets",
    subCategory: "Festive Embroidered Sets",
    price: 8900,
    originalPrice: 11900,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Deep Teal", "Sunset Amber"],
    rating: 4.8,
    reviewCount: 44,
    isNew: true,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 3,
    fabric: "Bemberg Silk with Antique Zari Yoke",
    fabricCare: "Dry Clean Only",
    description: "Effortless festive elegance with a fluid silk kaftan top and matching cigarette trousers."
  },

  // 9. BLOUSES
  {
    id: "blouse-01",
    name: "Gold Hand-Zari Raw Silk Padded Saree Blouse",
    slug: "gold-hand-zari-raw-silk-padded-saree-blouse",
    brand: "Pooja's Handloom Silks",
    vendorName: "Pooja's Handloom Silks (Mylapore Boutique)",
    vendorId: 101,
    category: "Blouses",
    subCategory: "Padded Designer Blouses",
    price: 2499,
    originalPrice: 3800,
    discount: 34,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["34", "36", "38", "40", "42 (2-inch Alter Margin Inside)"],
    colors: ["Antique Gold", "Ruby Maroon", "Bottle Green"],
    rating: 4.9,
    reviewCount: 88,
    isNew: true,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "Pure Raw Silk with Cotton Inner Lining & Quality Foam Cups",
    fabricCare: "Dry Clean Only",
    description: "Ready-to-wear tailored saree blouse with back hook closure, deep U-neck, and delicate latkan strings. Built with 2 inches of side expansion margin."
  },
  {
    id: "blouse-02",
    name: "Mirror & Resham Handworked Velvet Sweetheart Blouse",
    slug: "mirror-resham-handworked-velvet-sweetheart-blouse",
    brand: "Nazakat Ethnic",
    vendorName: "Nazakat Ethnic Boutique",
    category: "Blouses",
    subCategory: "Mirror & Resham Work",
    price: 3200,
    originalPrice: 4500,
    discount: 29,
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["36", "38", "40", "42"],
    colors: ["Midnight Blue", "Emerald Green"],
    rating: 4.8,
    reviewCount: 52,
    isNew: false,
    isTrending: false,
    inStock: true,
    readyToShip: true,
    deliveryDays: 3,
    fabric: "Silk Velvet with Authentic Mirror Embeds",
    fabricCare: "Dry Clean Only",
    description: "Pairs with any plain organza or net saree to instantly create a high-fashion designer look."
  },

  // 10. BOTTOM WEAR
  {
    id: "bottom-01",
    name: "Pure Cotton Tiered Flared Palazzo Pants",
    slug: "pure-cotton-tiered-flared-palazzo-pants",
    brand: "Everyday Femme",
    vendorName: "Everyday Femme Basics",
    category: "Bottom Wear",
    subCategory: "Flared Palazzos",
    price: 1299,
    originalPrice: 1899,
    discount: 31,
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["Free Size (Waist 28-38)", "Plus Size (Waist 38-46)"],
    colors: ["Off-White", "Classic Black", "Beige Khaki"],
    rating: 4.7,
    reviewCount: 65,
    isNew: true,
    isTrending: false,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "60s Count Breathable Cambric Cotton",
    fabricCare: "Machine Wash Regular",
    description: "Extra wide 48-inch flair resembling a skirt with elasticated back and drawstring front."
  },
  {
    id: "bottom-02",
    name: "Straight Ankle-Length Slit Cigarette Trousers",
    slug: "straight-ankle-length-slit-cigarette-trousers",
    brand: "Urban Muse",
    vendorName: "Urban Muse Pret",
    category: "Bottom Wear",
    subCategory: "Cigarette Trousers",
    price: 1599,
    originalPrice: 2299,
    discount: 30,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Gold Chanderi", "Ivory Cotton", "Deep Maroon"],
    rating: 4.8,
    reviewCount: 54,
    isNew: false,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "Cotton Silk with Zari Side Slits",
    fabricCare: "Hand Wash Cold",
    description: "The essential bottom to pair with formal kurtis and tunic shirts with delicate embroidered side slits."
  },

  // 11. NIGHTWEAR
  {
    id: "night-01",
    name: "Lustrous Mulberry Silk Wrap Kimono Robe & Slip Set",
    slug: "lustrous-mulberry-silk-wrap-kimono-robe-slip-set",
    brand: "Luxe Slumber",
    vendorName: "Luxe Slumber Boutique",
    category: "Nightwear",
    subCategory: "Mulberry Silk Robes",
    price: 4500,
    originalPrice: 6500,
    discount: 30,
    images: [
      "https://images.unsplash.com/photo-1512290900672-1f55a15340a5?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["S-M", "L-XL", "Free Size"],
    colors: ["Rose Gold", "Midnight Navy", "Champagne"],
    rating: 4.9,
    reviewCount: 71,
    isNew: true,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "22 Momme Silk-Finish Satin",
    fabricCare: "Gentle Cold Hand Wash",
    description: "Silky soft touch against your skin with lace trimmed cuffs, detachable tie belt, and adjustable slip dress."
  },
  {
    id: "night-02",
    name: "Organic Cotton Button-Down Notched Pajama Set",
    slug: "organic-cotton-button-down-notched-pajama-set",
    brand: "Everyday Femme",
    vendorName: "Everyday Femme Basics",
    category: "Nightwear",
    subCategory: "Cotton Pajama Sets",
    price: 2199,
    originalPrice: 3200,
    discount: 31,
    images: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1512290900672-1f55a15340a5?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Classic Stripe Blue", "Polka Dusty Rose"],
    rating: 4.8,
    reviewCount: 49,
    isNew: false,
    isTrending: false,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "100% GOTS Certified Organic Cotton",
    fabricCare: "Machine Wash Tumble Dry",
    description: "Breathable crisp cotton pyjamas with white piping detail, chest pocket, and comfortable drawstring waist."
  },

  // 12. MATERNITY WEAR
  {
    id: "maternity-01",
    name: "Concealed Zip Nursing Pure Cotton Flared Kurti",
    slug: "concealed-zip-nursing-pure-cotton-flared-kurti",
    brand: "MamaGlow Maternity",
    vendorName: "MamaGlow Maternity Studio",
    category: "Maternity Wear",
    subCategory: "Nursing & Feeding Kurtis",
    price: 1899,
    originalPrice: 2899,
    discount: 34,
    images: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["M", "L", "XL", "XXL", "3XL"],
    colors: ["Sage Botanical", "Indigo Dabu Print"],
    rating: 4.9,
    reviewCount: 96,
    isNew: true,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "100% Pre-Shrunk Breathable Cotton",
    fabricCare: "Machine Wash Cold",
    description: "Ingeniously designed dual invisible vertical zippers on both sides for discreet, comfortable feeding on-the-go. Expandable pleats adapt through all trimesters."
  },
  {
    id: "maternity-02",
    name: "Over-Bump High-Rise Seamless Prenatal Support Leggings",
    slug: "over-bump-high-rise-seamless-prenatal-support-leggings",
    brand: "MamaGlow Maternity",
    vendorName: "MamaGlow Maternity Studio",
    category: "Maternity Wear",
    subCategory: "Bump Support Leggings",
    price: 1499,
    originalPrice: 2200,
    discount: 31,
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Jet Black", "Charcoal Melange"],
    rating: 4.9,
    reviewCount: 68,
    isNew: false,
    isTrending: false,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "Moisture-wicking 4-Way Stretch Lycra",
    fabricCare: "Machine Wash Delicate",
    description: "Specially engineered gently compressive belly panel that lifts and relieves lower back pressure without feeling tight."
  },

  // 13. PLUS SIZE FASHION
  {
    id: "plus-01",
    name: "Embroidered Georgette Flared Anarkali (Sizes 2XL to 6XL)",
    slug: "embroidered-georgette-flared-anarkali-plus-size",
    brand: "Curve Luxe Fashion",
    vendorName: "Curve Luxe Fashion (Bangalore)",
    category: "Plus Size Fashion",
    subCategory: "Curve Festive Kurtis (2XL-6XL)",
    price: 4999,
    originalPrice: 7500,
    discount: 33,
    images: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["2XL", "3XL", "4XL", "5XL", "6XL"],
    colors: ["Royal Navy", "Deep Wine", "Teal Blue"],
    rating: 4.9,
    reviewCount: 82,
    isNew: true,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 3,
    fabric: "Georgette with Soft Cotton Lining",
    fabricCare: "Dry Clean Recommended",
    description: "Expertly tailored for fuller busts and curves with generous armhole sizing, non-pinching elastic back, and slimming panel design."
  },
  {
    id: "plus-02",
    name: "Plus Size Printed Wrap Midi Dress with Belt",
    slug: "plus-size-printed-wrap-midi-dress-belt",
    brand: "Curve Luxe Fashion",
    vendorName: "Curve Luxe Fashion (Bangalore)",
    category: "Plus Size Fashion",
    subCategory: "Maxi Wrap Dresses",
    price: 2999,
    originalPrice: 4200,
    discount: 28,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["2XL", "3XL", "4XL", "5XL"],
    colors: ["Burgundy Floral", "Black Polka"],
    rating: 4.8,
    reviewCount: 47,
    isNew: false,
    isTrending: false,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "High Recovery Stretch Jersey",
    fabricCare: "Machine Wash Delicate",
    description: "True wrap silhouette that cinches at your natural waistline, creating an enviable hourglass contour."
  },

  // 14. ACTIVEWEAR
  {
    id: "active-01",
    name: "High-Waist Seamless Squat-Proof Workout Leggings",
    slug: "high-waist-seamless-squat-proof-workout-leggings",
    brand: "ActiveFemme Studio",
    vendorName: "ActiveFemme Studio (Chennai)",
    category: "Activewear",
    subCategory: "Seamless Tights & Leggings",
    price: 1899,
    originalPrice: 2899,
    discount: 34,
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black Onyx", "Burgundy Plum", "Slate Grey"],
    rating: 4.9,
    reviewCount: 91,
    isNew: true,
    isTrending: true,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "Buttery Soft Nylon-Spandex with Ribbed Waistband",
    fabricCare: "Machine Wash Cold, Hang Dry",
    description: "100% squat-proof opacity, zero front seam, sweat-wicking compression, and hidden waistband key pocket."
  },
  {
    id: "active-02",
    name: "High-Impact Cross-Back Supportive Sports Bra",
    slug: "high-impact-cross-back-supportive-sports-bra",
    brand: "ActiveFemme Studio",
    vendorName: "ActiveFemme Studio (Chennai)",
    category: "Activewear",
    subCategory: "Supportive Sports Bras",
    price: 1399,
    originalPrice: 1999,
    discount: 30,
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=85&w=800",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=85&w=800"
    ],
    sizes: ["S (32B-34B)", "M (34C-36B)", "L (36C-38B)", "XL (38C-40C)"],
    colors: ["Black", "Blush Pink", "Sage Green"],
    rating: 4.8,
    reviewCount: 63,
    isNew: false,
    isTrending: false,
    inStock: true,
    readyToShip: true,
    deliveryDays: 2,
    fabric: "High-Tension Compressive Performance Knit",
    fabricCare: "Machine Wash Gentle",
    description: "Maximum bounce control for running, aerobics, and gym workouts. Includes removable breathable molded cups."
  }
];
