export interface ProductType {
  id: string;
  name: string;
  brand: string;
  category: string;
  subCategory: string;
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
  sizes: string[];
  colors: string[]; // Names or hex codes
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isTrending: boolean;
  inStock: boolean;
  createdAt: string; // ISO String
}

export const PRODUCTS: ProductType[] = [
  {
    id: "p1",
    name: "Embroidered Georgette Anarkali Kurta",
    brand: "Aura Studio",
    category: "Ethnic",
    subCategory: "Anarkali Suits",
    price: 2499,
    originalPrice: 4999,
    discount: 50,
    images: [
      "https://images.unsplash.com/photo-1583391733958-d20531e115fa?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Emerald Green", "Black"],
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
    isTrending: true,
    inStock: true,
    createdAt: "2024-03-10T10:00:00Z"
  },
  {
    id: "p2",
    name: "Oversized Linen Casual Shirt",
    brand: "Urban Chic",
    category: "Tops",
    subCategory: "Crop Tops",
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XXL"],
    colors: ["White", "Navy"],
    rating: 4.5,
    reviewCount: 86,
    isNew: false,
    isTrending: false,
    inStock: true,
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "p3",
    name: "Pleated Floral Midi Dress",
    brand: "Festive Glow",
    category: "Dresses",
    subCategory: "Midi Dresses",
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550905b05?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["XS", "S", "M"],
    colors: ["Blush Pink", "Lavender"],
    rating: 4.9,
    reviewCount: 210,
    isNew: true,
    isTrending: true,
    inStock: true,
    createdAt: "2024-03-15T10:00:00Z"
  },
  {
    id: "p4",
    name: "Wide Leg Formal Trousers",
    brand: "Urban Chic",
    category: "Co-ords",
    subCategory: "Pants",
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    images: [
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550614000-4b95d4edfa21?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L"],
    colors: ["Black", "White"],
    rating: 4.3,
    reviewCount: 67,
    isNew: false,
    isTrending: false,
    inStock: false,
    createdAt: "2023-11-20T10:00:00Z"
  },
  {
    id: "p5",
    name: "Handwoven Silk Banarasi Saree",
    brand: "Ethnic Vibes",
    category: "Ethnic",
    subCategory: "Sarees",
    price: 6500,
    originalPrice: 8500,
    discount: 23,
    images: [
      "https://images.unsplash.com/photo-1583391733958-d20531e115fa?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550905b05?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["Free Size"],
    colors: ["Red", "Mustard"],
    rating: 5.0,
    reviewCount: 34,
    isNew: true,
    isTrending: true,
    inStock: true,
    createdAt: "2024-03-01T10:00:00Z"
  },
  {
    id: "p6",
    name: "Satin Slip Co-ord Set",
    brand: "Aura Studio",
    category: "Co-ords",
    subCategory: "Co-ords",
    price: 2199,
    originalPrice: 2999,
    discount: 26,
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["M", "L"],
    colors: ["Lavender", "Black"],
    rating: 4.1,
    reviewCount: 12,
    isNew: false,
    isTrending: false,
    inStock: true,
    createdAt: "2024-02-10T10:00:00Z"
  },
  {
    id: "p7",
    name: "Printed Cotton Kurti",
    brand: "Ethnic Vibes",
    category: "Ethnic",
    subCategory: "Kurtis",
    price: 899,
    originalPrice: 1599,
    discount: 43,
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733958-d20531e115fa?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Mustard", "Emerald Green"],
    rating: 4.4,
    reviewCount: 89,
    isNew: false,
    isTrending: true,
    inStock: true,
    createdAt: "2023-12-05T10:00:00Z"
  },
  {
    id: "p8",
    name: "Chunky Gold Plated Hoop Earrings",
    brand: "Festive Glow",
    category: "Accessories",
    subCategory: "Jewellery",
    price: 499,
    originalPrice: 999,
    discount: 50,
    images: [
      "https://images.unsplash.com/photo-1550614000-4b95d4edfa21?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["Free Size"],
    colors: [],
    rating: 4.7,
    reviewCount: 432,
    isNew: false,
    isTrending: true,
    inStock: true,
    createdAt: "2023-10-15T10:00:00Z"
  },
  {
    id: "p9",
    name: "Ruffled Wrap Maxi Dress",
    brand: "Aura Studio",
    category: "Dresses",
    subCategory: "Maxi Dresses",
    price: 2899,
    originalPrice: 3999,
    discount: 27,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["S", "M"],
    colors: ["Red", "Blush Pink"],
    rating: 4.6,
    reviewCount: 54,
    isNew: true,
    isTrending: false,
    inStock: true,
    createdAt: "2024-03-20T10:00:00Z"
  },
  {
    id: "p10",
    name: "Ribbed Knit Turtleneck Top",
    brand: "Urban Chic",
    category: "Tops",
    subCategory: "Tops",
    price: 999,
    originalPrice: 1499,
    discount: 33,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "White"],
    rating: 4.8,
    reviewCount: 310,
    isNew: false,
    isTrending: true,
    inStock: true,
    createdAt: "2023-09-10T10:00:00Z"
  },
  {
    id: "p11",
    name: "Sequin Embroidered Lehenga Choli",
    brand: "Festive Glow",
    category: "Ethnic",
    subCategory: "Lehenga",
    price: 8500,
    originalPrice: 12000,
    discount: 29,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550905b05?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733958-d20531e115fa?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["M", "L"],
    colors: ["Navy", "Emerald Green"],
    rating: 4.9,
    reviewCount: 88,
    isNew: true,
    isTrending: true,
    inStock: true,
    createdAt: "2024-03-05T10:00:00Z"
  },
  {
    id: "p12",
    name: "Structured Faux Leather Tote",
    brand: "Urban Chic",
    category: "Accessories",
    subCategory: "Bags",
    price: 2499,
    originalPrice: 3500,
    discount: 28,
    images: [
      "https://images.unsplash.com/photo-1550614000-4b95d4edfa21?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["Free Size"],
    colors: ["Black", "Mustard"],
    rating: 4.5,
    reviewCount: 112,
    isNew: false,
    isTrending: false,
    inStock: true,
    createdAt: "2024-01-20T10:00:00Z"
  },
  {
    id: "p13",
    name: "Cotton V-Neck T-Shirt",
    brand: "Urban Chic",
    category: "Tops",
    subCategory: "Tops",
    price: 599,
    originalPrice: 999,
    discount: 40,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Lavender"],
    rating: 4.2,
    reviewCount: 450,
    isNew: false,
    isTrending: false,
    inStock: true,
    createdAt: "2023-06-10T10:00:00Z"
  },
  {
    id: "p14",
    name: "Velvet A-Line Gown",
    brand: "Aura Studio",
    category: "Dresses",
    subCategory: "Midi Dresses",
    price: 4599,
    originalPrice: 6999,
    discount: 34,
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["XS", "S", "M"],
    colors: ["Navy", "Red"],
    rating: 4.8,
    reviewCount: 76,
    isNew: true,
    isTrending: true,
    inStock: false,
    createdAt: "2024-03-22T10:00:00Z"
  },
  {
    id: "p15",
    name: "Block Print Palazzo Pants",
    brand: "Ethnic Vibes",
    category: "Ethnic",
    subCategory: "Pants",
    price: 1199,
    originalPrice: 1899,
    discount: 36,
    images: [
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Emerald Green", "Mustard"],
    rating: 4.6,
    reviewCount: 198,
    isNew: false,
    isTrending: true,
    inStock: true,
    createdAt: "2023-08-15T10:00:00Z"
  },
  {
    id: "p16",
    name: "Layered Pearl Choker Necklace",
    brand: "Festive Glow",
    category: "Accessories",
    subCategory: "Jewellery",
    price: 1499,
    originalPrice: 2499,
    discount: 40,
    images: [
      "https://images.unsplash.com/photo-1550614000-4b95d4edfa21?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550905b05?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["Free Size"],
    colors: [],
    rating: 4.9,
    reviewCount: 312,
    isNew: false,
    isTrending: true,
    inStock: true,
    createdAt: "2023-11-01T10:00:00Z"
  }
];
