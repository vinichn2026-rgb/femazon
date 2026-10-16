import { dressImages, dressPublicUrls, DressImageItem } from './dressImages';

export interface NaglaProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  subcategory: string;
  silhouette: string;
  flaggedForReview?: boolean;
  price: number;
  discountPrice: number;
  stock: number;
  sizes: string[];
  colors: string[];
  description: string;
  image: string; // Primary public URL
  images: string[]; // All public image URLs for gallery
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isTrending: boolean;
  inStock: boolean;
}

export const NAGLA_SHOP_VENDOR = {
  email: "nagla@shop.com",
  name: "Nagla Store Owner",
  businessName: "Nagla Women's",
  businessCategory: "Women's Luxury Fashion",
  rating: 4.9,
  verified: true
};

export const NAGLA_SHOP_PRODUCTS: NaglaProduct[] = [
  // 1. Floral Printed Kurti Set
  {
    id: "nagla-1",
    name: "Floral Printed Pure Cotton Kurti Set",
    slug: "floral-printed-pure-cotton-kurti-set",
    brand: "Nagla Women's",
    category: "Kurta Sets",
    subcategory: "Printed Kurta Sets",
    silhouette: "Straight",
    price: 1899,
    discountPrice: 1299,
    stock: 45,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Sunny Yellow", "Marigold"],
    description: "Handcrafted pure cotton printed kurta featuring exquisite yellow floral motifs, notched neck with gota-patti accents, paired with matching trousers and dupatta.",
    image: dressPublicUrls.kurtaSets.printedKurtaSets[0],
    images: dressPublicUrls.kurtaSets.printedKurtaSets,
    rating: 4.8,
    reviewCount: 142,
    isNew: true,
    isTrending: true,
    inStock: true
  },
  // 2. Elegant Maroon Anarkali Suit
  {
    id: "nagla-2",
    name: "Regal Maroon Silk Anarkali Kurta Set",
    slug: "regal-maroon-silk-anarkali-kurta-set",
    brand: "Nagla Women's",
    category: "Kurta Sets",
    subcategory: "Anarkali Kurta Sets",
    silhouette: "Anarkali",
    price: 3999,
    discountPrice: 2899,
    stock: 30,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Deep Maroon", "Gold"],
    description: "Opulent maroon silk Anarkali kurta accented with intricate golden zari embroidery, delicate tassels, matching churidar and scalloped sheer dupatta.",
    image: dressPublicUrls.kurtaSets.anarkaliKurtaSets[2],
    images: dressPublicUrls.kurtaSets.anarkaliKurtaSets,
    rating: 4.9,
    reviewCount: 98,
    isNew: true,
    isTrending: true,
    inStock: true
  },
  // 3. Peach Georgette Palazzo Set
  {
    id: "nagla-3",
    name: "Peach Chikankari Georgette Palazzo Set",
    slug: "peach-chikankari-georgette-palazzo-set",
    brand: "Nagla Women's",
    category: "Kurta Sets",
    subcategory: "Palazzo Kurta Sets",
    silhouette: "Palazzo",
    price: 3299,
    discountPrice: 2499,
    stock: 35,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Peach", "Blush Pink"],
    description: "Effortless festive elegance with hand-done Chikankari embroidery on soft pastel peach georgette, flared palazzos, and matching embellished border dupatta.",
    image: dressPublicUrls.kurtaSets.palazzoKurtaSets[3],
    images: dressPublicUrls.kurtaSets.palazzoKurtaSets,
    rating: 4.7,
    reviewCount: 76,
    isNew: false,
    isTrending: true,
    inStock: true
  },
  // 4. Midnight Blue Velvet Embroidered Set
  {
    id: "nagla-4",
    name: "Midnight Blue Velvet Zari Embroidered Set",
    slug: "midnight-blue-velvet-zari-embroidered-set",
    brand: "Nagla Women's",
    category: "Kurta Sets",
    subcategory: "Embroidered Kurta Sets",
    silhouette: "Straight",
    price: 4999,
    discountPrice: 3799,
    stock: 25,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Midnight Blue", "Gold"],
    description: "Plush royal midnight blue velvet kurta with rich gold bullion embroidery on neckline and sleeve hems, tailored with straight pants and organza stole.",
    image: dressPublicUrls.kurtaSets.embroideredKurtaSets[3],
    images: dressPublicUrls.kurtaSets.embroideredKurtaSets,
    rating: 5.0,
    reviewCount: 64,
    isNew: true,
    isTrending: true,
    inStock: true
  },
  // 5. Lavender Peplum Top & Trouser Set
  {
    id: "nagla-5",
    name: "Lavender Embroidered Peplum & Trouser Set",
    slug: "lavender-embroidered-peplum-trouser-set",
    brand: "Nagla Women's",
    category: "Kurta Sets",
    subcategory: "Peplum Kurta Sets",
    silhouette: "Peplum",
    price: 2499,
    discountPrice: 1899,
    stock: 40,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Lavender", "Silver"],
    description: "Flirty fit-and-flare peplum silhouette in soft lilac lavender, embellished with thread embroidery and paired with coordinating cigarette trousers.",
    image: dressPublicUrls.kurtaSets.peplumKurtaSets[3],
    images: dressPublicUrls.kurtaSets.peplumKurtaSets,
    rating: 4.6,
    reviewCount: 52,
    isNew: false,
    isTrending: false,
    inStock: true
  },
  // 6. Printed Designer Saree
  {
    id: "nagla-6",
    name: "Contemporary Floral Printed Designer Saree",
    slug: "contemporary-floral-printed-designer-saree",
    brand: "Nagla Women's",
    category: "Sarees",
    subcategory: "Printed Designer Sarees",
    silhouette: "Saree",
    price: 4500,
    discountPrice: 3200,
    stock: 28,
    sizes: ["Free Size"],
    colors: ["Multicolor Floral", "Ivory"],
    description: "Runway-inspired digital botanical print on lightweight fluid satin, accompanied by an embroidered designer blouse piece with halter neck detailing.",
    image: dressPublicUrls.sarees.printedDesignerSarees[3],
    images: dressPublicUrls.sarees.printedDesignerSarees,
    rating: 4.9,
    reviewCount: 119,
    isNew: true,
    isTrending: true,
    inStock: true
  },
  // 7. Chic Emerald Midi Dress
  {
    id: "nagla-7",
    name: "Emerald Tiered Floral Midi & Maxi Dress",
    slug: "emerald-tiered-floral-midi-maxi-dress",
    brand: "Nagla Women's",
    category: "Dresses",
    subcategory: "Midi Dresses",
    silhouette: "Midi",
    price: 2899,
    discountPrice: 1999,
    stock: 50,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Emerald Green", "Botanical"],
    description: "Breezy bohemian midi dress tailored in tiered flowy silhouette with smocked bust, puff sleeves, and romantic tiered flounces.",
    image: dressPublicUrls.westernWear.midiMaxiDresses[3],
    images: dressPublicUrls.westernWear.midiMaxiDresses,
    rating: 4.8,
    reviewCount: 88,
    isNew: true,
    isTrending: true,
    inStock: true
  },
  // 8. Classic White Cotton Kurta Set
  {
    id: "nagla-8",
    name: "Classic Ivory White Cotton Embroidered Kurti",
    slug: "classic-ivory-white-cotton-embroidered-kurti",
    brand: "Nagla Women's",
    category: "Kurta Sets",
    subcategory: "Cotton Kurta Sets",
    silhouette: "Straight",
    price: 1599,
    discountPrice: 1199,
    stock: 60,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Pristine White", "Silver"],
    description: "Breathable pure Mulmul cotton tunic featuring subtle tonal white-on-white Chikankari embroidery and lace inserts.",
    image: dressPublicUrls.kurtaSets.cottonKurtaSets[1],
    images: dressPublicUrls.kurtaSets.cottonKurtaSets,
    rating: 4.7,
    reviewCount: 95,
    isNew: false,
    isTrending: false,
    inStock: true
  },
  // 9. Flowy Chiffon Saree
  {
    id: "nagla-9",
    name: "Romantic Chiffon Georgette Draped Saree",
    slug: "romantic-chiffon-georgette-draped-saree",
    brand: "Nagla Women's",
    category: "Sarees",
    subcategory: "Chiffon & Georgette",
    silhouette: "Saree",
    price: 3699,
    discountPrice: 2799,
    stock: 32,
    sizes: ["Free Size"],
    colors: ["Dusty Rose", "Blush"],
    description: "Ultra-fluid chiffon georgette drape with delicate flutter scalloped hemline, paired with a fitted bustier blouse with micro-sequin embellishment.",
    image: dressPublicUrls.sarees.chiffonGeorgette[4],
    images: dressPublicUrls.sarees.chiffonGeorgette,
    rating: 4.9,
    reviewCount: 81,
    isNew: true,
    isTrending: true,
    inStock: true
  },
  // 10. Velvet Lehenga
  {
    id: "nagla-10",
    name: "Royal Navy Blue Velvet Embroidered Lehenga",
    slug: "royal-navy-blue-velvet-embroidered-lehenga",
    brand: "Nagla Women's",
    category: "Lehengas",
    subcategory: "Velvet Lehengas",
    silhouette: "Lehenga",
    price: 12500,
    discountPrice: 9499,
    stock: 18,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Royal Navy", "Antique Gold"],
    description: "Heavyweight micro-velvet lehenga skirt embellished with antique gold tilla and sequin kalis, paired with a matching deep-cut sweetheart blouse.",
    image: dressPublicUrls.lehengas.velvetLehengas[3],
    images: dressPublicUrls.lehengas.velvetLehengas,
    rating: 5.0,
    reviewCount: 47,
    isNew: true,
    isTrending: true,
    inStock: true
  },
  // 11. Sky Blue Linen Kurta & Trouser
  {
    id: "nagla-11",
    name: "Sky Blue Pure Linen Kurta & Trouser Set",
    slug: "sky-blue-pure-linen-kurta-trouser-set",
    brand: "Nagla Women's",
    category: "Kurta Sets",
    subcategory: "Pant Kurta Sets",
    silhouette: "Straight",
    price: 2199,
    discountPrice: 1699,
    stock: 44,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Sky Blue", "Pastel"],
    description: "Handloom linen blend kurta with subtle collar piping, comfort-fit ankle length trousers, designed for summer vacations and elevated daywear.",
    image: dressPublicUrls.kurtaSets.pantKurtaSets[4],
    images: dressPublicUrls.kurtaSets.pantKurtaSets,
    rating: 4.6,
    reviewCount: 39,
    isNew: false,
    isTrending: false,
    inStock: true
  },
  // 12. Burgundy Satin Cocktail Dress
  {
    id: "nagla-12",
    name: "Burgundy Heavy Satin Cocktail Dress",
    slug: "burgundy-heavy-satin-cocktail-dress",
    brand: "Nagla Women's",
    category: "Dresses",
    subcategory: "Cocktail Dresses",
    silhouette: "Fit and Flare",
    price: 4200,
    discountPrice: 3199,
    stock: 26,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Wine Burgundy", "Ruby"],
    description: "Couture structured cocktail dress crafted from lustrous thick Duchess satin with corset-boned bodice and asymmetrical wrap skirt.",
    image: dressPublicUrls.westernWear.cocktailDresses[4],
    images: dressPublicUrls.westernWear.cocktailDresses,
    rating: 4.9,
    reviewCount: 112,
    isNew: true,
    isTrending: true,
    inStock: true
  },
  // 13. Sequin Shimmer Saree
  {
    id: "nagla-13",
    name: "Glamour Sequin & Shimmer Reception Saree",
    slug: "glamour-sequin-shimmer-reception-saree",
    brand: "Nagla Women's",
    category: "Sarees",
    subcategory: "Sequin & Shimmer",
    silhouette: "Saree",
    price: 5499,
    discountPrice: 3999,
    stock: 22,
    sizes: ["Free Size"],
    colors: ["Metallic Champagne", "Silver"],
    description: "Statement party drape covered in dual-tone micro-sequins with effortless fluid drop, complete with unstitched padded designer blouse.",
    image: dressPublicUrls.sarees.sequinShimmer[1],
    images: dressPublicUrls.sarees.sequinShimmer,
    rating: 4.9,
    reviewCount: 104,
    isNew: true,
    isTrending: true,
    inStock: true
  },
  // 14. Midnight Blue Satin Evening Gown
  {
    id: "nagla-14",
    name: "Midnight Blue Floor-Length Satin Evening Gown",
    slug: "midnight-blue-floor-length-satin-evening-gown",
    brand: "Nagla Women's",
    category: "Gowns",
    subcategory: "Evening Gowns",
    silhouette: "Gown",
    price: 5999,
    discountPrice: 4499,
    stock: 20,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Midnight Blue", "Sapphire"],
    description: "Dramatic red-carpet gown featuring cowl neckline, draped fluid skirt train, and sleek concealed side zipper in premium satin.",
    image: dressPublicUrls.westernWear.eveningGowns[1],
    images: dressPublicUrls.westernWear.eveningGowns,
    rating: 5.0,
    reviewCount: 78,
    isNew: true,
    isTrending: true,
    inStock: true
  },
  // 15. Emerald Silk Straight Kurti
  {
    id: "nagla-15",
    name: "Emerald Green Raw Silk Straight Kurti Set",
    slug: "emerald-green-raw-silk-straight-kurti-set",
    brand: "Nagla Women's",
    category: "Kurta Sets",
    subcategory: "Straight Kurta Sets",
    silhouette: "Straight",
    price: 2799,
    discountPrice: 1999,
    stock: 40,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Emerald Green", "Forest Green"],
    description: "Classic straight-cut Chanderi silk kurta with intricate gold hand-embroidery along the placket, straight pants, and tissue silk dupatta.",
    image: dressPublicUrls.kurtaSets.straightKurtaSets[3],
    images: dressPublicUrls.kurtaSets.straightKurtaSets,
    rating: 4.8,
    reviewCount: 87,
    isNew: false,
    isTrending: true,
    inStock: true
  },
  // 16. Purple Zari Silk Kurta Set
  {
    id: "nagla-16",
    name: "Imperial Purple Zari Woven Silk Kurta Set",
    slug: "imperial-purple-zari-woven-silk-kurta-set",
    brand: "Nagla Women's",
    category: "Kurta Sets",
    subcategory: "Silk Kurta Sets",
    silhouette: "Straight",
    price: 3499,
    discountPrice: 2599,
    stock: 30,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Imperial Purple", "Gold"],
    description: "Rich woven silk kurta adorned with heritage Banarasi zari brocade, tailored trousers, and gold tissue dupatta with tassel borders.",
    image: dressPublicUrls.kurtaSets.silkKurtaSets[2],
    images: dressPublicUrls.kurtaSets.silkKurtaSets,
    rating: 4.9,
    reviewCount: 110,
    isNew: true,
    isTrending: true,
    inStock: true
  },
  // 17. Bridal Crimson Lehenga
  {
    id: "nagla-17",
    name: "Crimson Red Heritage Bridal Silk Lehenga",
    slug: "crimson-red-heritage-bridal-silk-lehenga",
    brand: "Nagla Women's",
    category: "Lehengas",
    subcategory: "Bridal Lehengas",
    silhouette: "Lehenga",
    price: 34999,
    discountPrice: 28999,
    stock: 10,
    sizes: ["XS", "S", "M", "L", "Custom"],
    colors: ["Crimson Red", "Antique Zari"],
    description: "Magnificent bridal lehenga in rich crimson silk crafted with heavy Zardozi hand-embroidery, dual dupattas, and ornate handcrafted latkans.",
    image: dressPublicUrls.lehengas.bridalLehengas[3],
    images: dressPublicUrls.lehengas.bridalLehengas,
    rating: 5.0,
    reviewCount: 89,
    isNew: true,
    isTrending: true,
    inStock: true
  },
  // 18. Pure Banarasi Royal Blue Saree
  {
    id: "nagla-18",
    name: "Royal Blue Pure Banarasi Katan Silk Saree",
    slug: "royal-blue-pure-banarasi-katan-silk-saree",
    brand: "Nagla Women's",
    category: "Sarees",
    subcategory: "Pure Banarasi Silk",
    silhouette: "Saree",
    price: 18500,
    discountPrice: 14999,
    stock: 15,
    sizes: ["Free Size"],
    colors: ["Royal Blue", "Gold Zari"],
    description: "Authentic handloom pure Katan silk Banarasi saree woven with intricate kadhwa floral motifs, opulent pallu, and unstitched blouse piece.",
    image: dressPublicUrls.sarees.pureBanarasiSilk[3],
    images: dressPublicUrls.sarees.pureBanarasiSilk,
    rating: 5.0,
    reviewCount: 72,
    isNew: true,
    isTrending: true,
    inStock: true
  }
];

export function getNaglaProductsByCategory(category: string): NaglaProduct[] {
  const query = category.toLowerCase().trim();
  return NAGLA_SHOP_PRODUCTS.filter(p => p.category.toLowerCase() === query || p.subcategory.toLowerCase().includes(query));
}

export function getNaglaProductBySlug(slug: string): NaglaProduct | undefined {
  return NAGLA_SHOP_PRODUCTS.find(p => p.slug === slug);
}

export default NAGLA_SHOP_PRODUCTS;
