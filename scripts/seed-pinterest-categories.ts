import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

export const PINTEREST_PRODUCTS = [
  // ==================== 1. DRESSES ====================
  {
    name: "Emerald Satin Midi Dress",
    slug: "emerald-satin-midi-dress",
    category: "Dresses",
    subcategory: "Midi Dresses",
    dressType: "Midi Dresses",
    occasion: "Party",
    price: 2499,
    discountPrice: 1899,
    stock: 28,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Emerald Green", "Black"],
    description: "Sleek emerald green cowl-neck midi dress crafted from lustrous heavyweight satin with adjustable spaghetti straps and side slit.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572804013309-82a891485787?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Floral Chiffon Tiered Maxi Dress",
    slug: "floral-chiffon-tiered-maxi-dress",
    category: "Dresses",
    subcategory: "Maxi Dresses",
    dressType: "Maxi Dresses",
    occasion: "Casual",
    price: 2999,
    discountPrice: 2299,
    stock: 35,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blush Pink", "Lavender"],
    description: "Whimsical pastel floral print maxi dress featuring tiered ruffle skirts, smocked bodice, and sheer balloon sleeves.",
    image: "https://images.unsplash.com/photo-1572804013309-82a891485787?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572804013309-82a891485787?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Velvet Corset Mini Dress",
    slug: "velvet-corset-mini-dress",
    category: "Dresses",
    subcategory: "Mini Dresses",
    dressType: "Mini Dresses",
    occasion: "Party",
    price: 2199,
    discountPrice: 1699,
    stock: 20,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Wine", "Black"],
    description: "Plush wine red stretch velvet mini dress engineered with structured boning at the bodice and sweetheart neckline.",
    image: "https://images.unsplash.com/photo-1550614000-4b95dd5e83ec?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1550614000-4b95dd5e83ec?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Golden Shimmer Evening Party Dress",
    slug: "golden-shimmer-evening-party-dress",
    category: "Dresses",
    subcategory: "Party Dresses",
    dressType: "Party Dresses",
    occasion: "Party",
    price: 3499,
    discountPrice: 2799,
    stock: 18,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gold", "Champagne"],
    description: "Glamorous metallic champagne party dress adorned with fine gold micro-sequins and an alluring open-back finish.",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Bohemian Linen Tiered Sundress",
    slug: "bohemian-linen-tiered-sundress",
    category: "Dresses",
    subcategory: "Maxi Dresses",
    dressType: "Maxi Dresses",
    occasion: "Casual",
    price: 1899,
    discountPrice: 1449,
    stock: 30,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Beige", "Olive"],
    description: "Pure breathable organic linen tiered dress with contrast horn buttons and a self-tie waist belt.",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&q=80&auto=format&fit=crop"
    ]
  },

  // ==================== 2. ETHNIC ====================
  {
    name: "Pastel Pink Chikankari Kurta Set",
    slug: "pastel-pink-chikankari-kurta-set",
    category: "Ethnic",
    subcategory: "Kurtas",
    dressType: "Kurtas",
    occasion: "Casual",
    price: 2499,
    discountPrice: 1899,
    stock: 40,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blush Pink", "White"],
    description: "Authentic Lucknowi hand-embroidered Chikankari cotton kurta paired with matching palazzo pants and chiffon dupatta.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Royal Wine Flared Anarkali Suit",
    slug: "royal-wine-flared-anarkali-suit",
    category: "Ethnic",
    subcategory: "Anarkali",
    dressType: "Anarkali",
    occasion: "Wedding",
    price: 3299,
    discountPrice: 2499,
    stock: 22,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Wine", "Maroon"],
    description: "Regal floor-length Georgette Anarkali suit featuring heavy Zari hand embroidery on the yoke and scalloped dupatta.",
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550614000-4b95dd5e83ec?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Indigo Block-Printed Ethnic Dress",
    slug: "indigo-block-printed-ethnic-dress",
    category: "Ethnic",
    subcategory: "Ethnic Dresses",
    dressType: "Ethnic Dresses",
    occasion: "Casual",
    price: 1799,
    discountPrice: 1299,
    stock: 35,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Indigo"],
    description: "Bagru artisan hand block-printed indigo cotton flare dress with wooden button accents and side pockets.",
    image: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572804013309-82a891485787?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Handcrafted Zardozi Silk Kurta Set",
    slug: "handcrafted-zardozi-silk-kurta-set",
    category: "Ethnic",
    subcategory: "Kurta Sets",
    dressType: "Kurta Sets",
    occasion: "Wedding",
    price: 3699,
    discountPrice: 2899,
    stock: 16,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Mustard", "Gold"],
    description: "Pure Chanderi silk straight kurta set with meticulous Zardozi needlework, paired with cigarette pants and organza dupatta.",
    image: "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Sage Green Embroidered Chudithar",
    slug: "sage-green-embroidered-chudithar",
    category: "Ethnic",
    subcategory: "Kurta Sets",
    dressType: "Kurta Sets",
    occasion: "Party",
    price: 1999,
    discountPrice: 1499,
    stock: 25,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Mint Green", "Sage"],
    description: "Pastel sage green cotton-silk A-line chudithar set with intricate floral threadwork and sheer dupatta.",
    image: "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop"
    ]
  },

  // ==================== 3. WESTERN ====================
  {
    name: "Sculpted Noir Ribbed Bodycon",
    slug: "sculpted-noir-ribbed-bodycon",
    category: "Western",
    subcategory: "Bodycon",
    dressType: "Bodycon",
    occasion: "Party",
    price: 1899,
    discountPrice: 1399,
    stock: 30,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black"],
    description: "Figure-hugging seamless ribbed knit bodycon dress with square neckline and mid-calf hem.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Olive Linen Button-Down A-Line Dress",
    slug: "olive-linen-button-down-a-line-dress",
    category: "Western",
    subcategory: "A-Line",
    dressType: "A-Line",
    occasion: "Casual",
    price: 2199,
    discountPrice: 1699,
    stock: 25,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Olive", "Khaki"],
    description: "Classic safari-inspired olive green A-line dress in breathable pure linen with tortoiseshell buttons.",
    image: "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Crisp White Poplin Shirt Dress",
    slug: "crisp-white-poplin-shirt-dress",
    category: "Western",
    subcategory: "Shirt Dresses",
    dressType: "Shirt Dresses",
    occasion: "Office",
    price: 2299,
    discountPrice: 1749,
    stock: 32,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White"],
    description: "Tailored 100% Egyptian cotton poplin shirt dress with folded cuffs and a detachable waist tie.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572804013309-82a891485787?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Sunset Ombre Flowing Western Maxi",
    slug: "sunset-ombre-flowing-western-maxi",
    category: "Western",
    subcategory: "Maxi Dresses",
    dressType: "Maxi Dresses",
    occasion: "Party",
    price: 2799,
    discountPrice: 2199,
    stock: 20,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Orange", "Coral Pink"],
    description: "Ethereal gradient ombre chiffon maxi dress designed with high-neck tie collars and backless drape.",
    image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Cowl Neck Silk Satin Slip Dress",
    slug: "cowl-neck-silk-satin-slip-dress",
    category: "Western",
    subcategory: "Bodycon",
    dressType: "Bodycon",
    occasion: "Party",
    price: 2499,
    discountPrice: 1899,
    stock: 24,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Champagne", "Black"],
    description: "Minimalist 90s-inspired bias-cut silk slip dress that drapes effortlessly across the silhouette.",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop"
    ]
  },

  // ==================== 4. TOPS ====================
  {
    name: "Ribbed Halter Knit Crop Top",
    slug: "ribbed-halter-knit-crop-top",
    category: "Tops",
    subcategory: "Crop Tops",
    dressType: "Crop Tops",
    occasion: "Casual",
    price: 899,
    discountPrice: 649,
    stock: 45,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Beige", "Black", "White"],
    description: "Premium stretch cotton ribbed crop top with cross-front halter neck design.",
    image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Classic French-Cuff Striped Shirt",
    slug: "classic-french-cuff-striped-shirt",
    category: "Tops",
    subcategory: "Shirts",
    dressType: "Shirts",
    occasion: "Office",
    price: 1599,
    discountPrice: 1199,
    stock: 30,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Sky Blue", "White"],
    description: "Oversized boyfriend-fit blue-and-white pinstripe cotton shirt with classic collar.",
    image: "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Victorian Ruffle Silk Chiffon Blouse",
    slug: "victorian-ruffle-silk-chiffon-blouse",
    category: "Tops",
    subcategory: "Blouses",
    dressType: "Blouses",
    occasion: "Party",
    price: 1699,
    discountPrice: 1299,
    stock: 22,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blush Pink", "Ivory"],
    description: "Romantic sheer chiffon blouse with cascading neck ruffles and pearl button placket.",
    image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572804013309-82a891485787?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Embroidered Cotton Linen Tunic",
    slug: "embroidered-cotton-linen-tunic",
    category: "Tops",
    subcategory: "Tunics",
    dressType: "Tunics",
    occasion: "Casual",
    price: 1299,
    discountPrice: 949,
    stock: 35,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Beige"],
    description: "Boho-chic breezy linen tunic featuring tonal geometric embroidery and split V-neck.",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Peplum Structured Sweetheart Top",
    slug: "peplum-structured-sweetheart-top",
    category: "Tops",
    subcategory: "Blouses",
    dressType: "Blouses",
    occasion: "Party",
    price: 1399,
    discountPrice: 999,
    stock: 28,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Maroon"],
    description: "Sculpted sweetheart neckline top with flared peplum hem and back exposed zip.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550614000-4b95dd5e83ec?w=800&q=80&auto=format&fit=crop"
    ]
  },

  // ==================== 5. FUSION ====================
  {
    name: "Textured Linen Blazer & Trouser Co-ord",
    slug: "textured-linen-blazer-trouser-co-ord",
    category: "Fusion",
    subcategory: "Co-ords",
    dressType: "Co-ords",
    occasion: "Office",
    price: 3499,
    discountPrice: 2699,
    stock: 20,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Beige", "Olive"],
    description: "Contemporary tailored 2-piece set with a relaxed single-breasted blazer and wide-leg trousers.",
    image: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550614000-4b95dd5e83ec?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Dhoti Skirt with Embroidered Cape",
    slug: "dhoti-skirt-with-embroidered-cape",
    category: "Fusion",
    subcategory: "Indo-Western",
    dressType: "Indo-Western",
    occasion: "Party",
    price: 3299,
    discountPrice: 2499,
    stock: 15,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Teal", "Wine"],
    description: "Modern Indo-Western fusion set featuring a satin pleated dhoti skirt, bustier top, and floor-sweeping sheer cape.",
    image: "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Pre-draped Saree Gown Fusion Dress",
    slug: "pre-draped-saree-gown-fusion-dress",
    category: "Fusion",
    subcategory: "Fusion Dresses",
    dressType: "Fusion Dresses",
    occasion: "Wedding",
    price: 3999,
    discountPrice: 3199,
    stock: 12,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Maroon", "Gold"],
    description: "Innovative ready-to-wear pre-stitched saree gown with pleated metallic pallu and encrusted waistband.",
    image: "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Jacquard Crop Top & Palazzo Set",
    slug: "jacquard-crop-top-palazzo-set",
    category: "Fusion",
    subcategory: "Sets",
    dressType: "Sets",
    occasion: "Party",
    price: 2699,
    discountPrice: 1999,
    stock: 25,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Purple", "Magenta"],
    description: "Rich Banarasi woven jacquard crop top paired with high-waisted flowing flared palazzos.",
    image: "https://images.unsplash.com/photo-1550614000-4b95dd5e83ec?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1550614000-4b95dd5e83ec?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Velvet Shrug & Slit Kurti Fusion",
    slug: "velvet-shrug-slit-kurti-fusion",
    category: "Fusion",
    subcategory: "Indo-Western",
    dressType: "Indo-Western",
    occasion: "Party",
    price: 2899,
    discountPrice: 2199,
    stock: 18,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Gold"],
    description: "Sleek side-slit contemporary kurti paired with an embroidered regal velvet longline shrug.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550614000-4b95dd5e83ec?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format&fit=crop"
    ]
  },

  // ==================== 6. OCCASION ====================
  {
    name: "Bridal Crimson Kanjivaram Silk Saree",
    slug: "bridal-crimson-kanjivaram-silk-saree",
    category: "Occasion",
    subcategory: "Wedding",
    dressType: "Wedding",
    occasion: "Wedding",
    price: 4999,
    discountPrice: 3999,
    stock: 15,
    sizes: ["Free Size"],
    colors: ["Red", "Gold"],
    description: "Heirloom-grade heavy Kanchipuram pure silk saree woven with real gold zari temple borders and rich pallu.",
    image: "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Midnight Sparkle Cocktail Gala Gown",
    slug: "midnight-sparkle-cocktail-gala-gown",
    category: "Occasion",
    subcategory: "Party",
    dressType: "Party",
    occasion: "Party",
    price: 4499,
    discountPrice: 3499,
    stock: 14,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Midnight Blue"],
    description: "Showstopping floor-grazing trumpet gown showered with hand-embellished crystal beads and illusion mesh neckline.",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Sunday Cotton Sundress with Belt",
    slug: "sunday-cotton-sundress-with-belt",
    category: "Occasion",
    subcategory: "Casual",
    dressType: "Casual",
    occasion: "Casual",
    price: 1599,
    discountPrice: 1199,
    stock: 35,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Yellow", "White"],
    description: "Sunny yellow daywear flared dress in breathable poplin cotton, accented with a wicker buckle waist belt.",
    image: "https://images.unsplash.com/photo-1572804013309-82a891485787?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572804013309-82a891485787?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Tailored Ivory Executive Pantsuit",
    slug: "tailored-ivory-executive-pantsuit",
    category: "Occasion",
    subcategory: "Office",
    dressType: "Office",
    occasion: "Office",
    price: 3799,
    discountPrice: 2999,
    stock: 20,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Ivory", "Beige"],
    description: "Sharp double-breasted power suit in premium stretch crepe with high-waisted pressed crease straight trousers.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Metallic Champagne Gala Evening Gown",
    slug: "metallic-champagne-gala-evening-gown",
    category: "Occasion",
    subcategory: "Wedding",
    dressType: "Wedding",
    occasion: "Wedding",
    price: 4299,
    discountPrice: 3299,
    stock: 12,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Champagne", "Gold"],
    description: "Couture metallic champagne pleated lamé gown featuring an asymmetrical shoulder drape and sweeping train.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80&auto=format&fit=crop"
    ]
  }
];

async function main() {
  console.log("Seeding 30 Pinterest-grade fashion products across all 6 Mega Menu categories...");

  // Keep existing products or upsert
  for (const item of PINTEREST_PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        dressType: item.dressType,
        occasion: item.occasion,
        price: item.price,
        discountPrice: item.discountPrice,
        stock: item.stock,
        sizes: JSON.stringify(item.sizes),
        colors: JSON.stringify(item.colors),
        description: item.description,
        image: item.image,
        images: JSON.stringify(item.images),
        approvalStatus: "APPROVED"
      },
      create: {
        name: item.name,
        slug: item.slug,
        category: item.category,
        subcategory: item.subcategory,
        dressType: item.dressType,
        occasion: item.occasion,
        price: item.price,
        discountPrice: item.discountPrice,
        stock: item.stock,
        sizes: JSON.stringify(item.sizes),
        colors: JSON.stringify(item.colors),
        description: item.description,
        image: item.image,
        images: JSON.stringify(item.images),
        approvalStatus: "APPROVED"
      }
    });
  }

  console.log(`Successfully seeded ${PINTEREST_PRODUCTS.length} Pinterest category products!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
