import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

export const JEWELRY_AND_ANARKALI_PRODUCTS = [
  // Best Paired Jewelry Items
  {
    name: "Nazaakat - Ruby Red Kundan Necklace & Earring Set",
    slug: "nazaakat-ruby-red-kundan-necklace-earring-set",
    category: "Jewellery",
    subcategory: "Necklaces",
    dressType: "Necklaces",
    occasion: "Wedding",
    price: 20500,
    discountPrice: 10250,
    stock: 10,
    sizes: ["Free Size"],
    colors: ["Ruby Red", "Gold"],
    description: "Royal handcrafted 22kt gold-plated necklace set encrusted with real uncut Polki and glowing pigeon blood ruby drops.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=85&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=85&auto=format&fit=crop"
    ]
  },
  {
    name: "Tad Accessories - Imitation Polki Pendant Necklace Set",
    slug: "tad-accessories-imitation-polki-pendant-necklace-set",
    category: "Jewellery",
    subcategory: "Necklaces",
    dressType: "Necklaces",
    occasion: "Wedding",
    price: 13000,
    discountPrice: 11500,
    stock: 15,
    sizes: ["Free Size"],
    colors: ["Emerald Green", "Gold"],
    description: "Intricate green enamelled meenakari pendant strung with fine pearls and emerald beads.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=85&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=85&auto=format&fit=crop"
    ]
  },
  {
    name: "Mnsh - Ruby Glow Choker Set",
    slug: "mnsh-ruby-glow-choker-set",
    category: "Jewellery",
    subcategory: "Necklaces",
    dressType: "Necklaces",
    occasion: "Party",
    price: 18500,
    discountPrice: 15000,
    stock: 8,
    sizes: ["Free Size"],
    colors: ["Ruby Red", "Silver"],
    description: "Sleek contemporary multi-strand cubic zirconia and ruby collar choker with matching stud earrings.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=85&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=85&auto=format&fit=crop"
    ]
  },
  {
    name: "Tad Accessories - Stone Studded & Imitation Polki Long Haar",
    slug: "tad-accessories-stone-studded-imitation-polki-long-haar",
    category: "Jewellery",
    subcategory: "Necklaces",
    dressType: "Necklaces",
    occasion: "Wedding",
    price: 14500,
    discountPrice: 12900,
    stock: 12,
    sizes: ["Free Size"],
    colors: ["Multi", "Gold"],
    description: "Navratan multi-gemstone long royal necklace handcrafted in brass alloy with fine filigree detailing.",
    image: "https://images.unsplash.com/photo-1611591477439-d3a39e6a0083?w=800&q=85&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1611591477439-d3a39e6a0083?w=800&q=85&auto=format&fit=crop"
    ]
  },

  // Similar Anarkali & Ethnic Sets
  {
    name: "Samyukta Singhania - Lavender Embroidered Tissue Anarkali Set",
    slug: "samyukta-singhania-lavender-embroidered-tissue-anarkali-set",
    category: "Ethnic",
    subcategory: "Anarkali",
    dressType: "Anarkali",
    occasion: "Wedding",
    price: 8500,
    discountPrice: 7200,
    stock: 18,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Lavender", "Pastel Lilac"],
    description: "Pastel lilac tissue silk flared Anarkali set detailed with delicate sequin spray, scalloped dupatta, and matching pants.",
    image: "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=85&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=85&auto=format&fit=crop"
    ]
  },
  {
    name: "Sheetal Batra - Elaya Embroidered Pastel Pink Anarkali Suit",
    slug: "sheetal-batra-elaya-embroidered-pastel-pink-anarkali-suit",
    category: "Ethnic",
    subcategory: "Anarkali",
    dressType: "Anarkali",
    occasion: "Wedding",
    price: 21000,
    discountPrice: 18500,
    stock: 10,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Blush Pink", "Gold"],
    description: "Pure organza blush pink floor-length Anarkali suit with heritage Kashmiri Tilla needlework and pearl tassels.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=800&q=85&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=800&q=85&auto=format&fit=crop"
    ]
  },
  {
    name: "Begum - Sunset Orange Silk Flared Anarkali & Dupatta",
    slug: "begum-sunset-orange-silk-flared-anarkali-dupatta",
    category: "Ethnic",
    subcategory: "Anarkali",
    dressType: "Anarkali",
    occasion: "Wedding",
    price: 21500,
    discountPrice: 19000,
    stock: 14,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Sunset Orange", "Pink"],
    description: "Vibrant dual-tone orange and fuchsia silk flared Anarkali set with gold gota patti work.",
    image: "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=800&q=85&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=800&q=85&auto=format&fit=crop"
    ]
  },
  {
    name: "Sheetal Batra - Ansha Handcrafted Ivory Gold Anarkali",
    slug: "sheetal-batra-ansha-handcrafted-ivory-gold-anarkali",
    category: "Ethnic",
    subcategory: "Anarkali",
    dressType: "Anarkali",
    occasion: "Wedding",
    price: 19500,
    discountPrice: 17500,
    stock: 8,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory", "Gold"],
    description: "Opulent ivory Chanderi silk Anarkali featuring dense marodi and zardozi borders with sheer organza veil.",
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=85&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=85&auto=format&fit=crop"
    ]
  },
  {
    name: "Aura Studio - Midnight Navy Blue Embroidered Anarkali",
    slug: "aura-studio-midnight-navy-blue-embroidered-anarkali",
    category: "Ethnic",
    subcategory: "Anarkali",
    dressType: "Anarkali",
    occasion: "Party",
    price: 14500,
    discountPrice: 11999,
    stock: 16,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy Blue", "Gold"],
    description: "Midnight navy blue Georgette flared Anarkali embellished with fine gold dori work.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=85&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=85&auto=format&fit=crop"
    ]
  },
  {
    name: "Ethnic Vibes - Regal Purple Silk Anarkali Salwar Set",
    slug: "ethnic-vibes-regal-purple-silk-anarkali-salwar-set",
    category: "Ethnic",
    subcategory: "Anarkali",
    dressType: "Anarkali",
    occasion: "Wedding",
    price: 16999,
    discountPrice: 13999,
    stock: 12,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Purple", "Gold"],
    description: "Regal amethyst purple Raw Silk Anarkali suit with heritage Dabka and Aari embroidery.",
    image: "https://images.unsplash.com/photo-1572804013309-82a891485787?w=800&q=85&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572804013309-82a891485787?w=800&q=85&auto=format&fit=crop"
    ]
  },
  {
    name: "Festive Glow - Rani Pink Zari Embellished Anarkali",
    slug: "festive-glow-rani-pink-zari-embellished-anarkali",
    category: "Ethnic",
    subcategory: "Anarkali",
    dressType: "Anarkali",
    occasion: "Wedding",
    price: 15500,
    discountPrice: 12500,
    stock: 15,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Rani Pink", "Gold"],
    description: "Celebratory Hot Rani Pink silk Anarkali highlighted with traditional Banarasi brocade borders.",
    image: "https://images.unsplash.com/photo-1550614000-4b95dd5e83ec?w=800&q=85&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1550614000-4b95dd5e83ec?w=800&q=85&auto=format&fit=crop"
    ]
  }
];

async function main() {
  console.log("Seeding Jewelry and Anarkali products...");

  for (const item of JEWELRY_AND_ANARKALI_PRODUCTS) {
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

  console.log(`Seeded ${JEWELRY_AND_ANARKALI_PRODUCTS.length} products successfully!`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
