import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import catalogSnapshot from '../src/data/catalog-snapshot.json';
import { NAGLA_SHOP_PRODUCTS, NAGLA_SHOP_VENDOR } from '../src/data/naglaFashionShop';

const VENDORS = [
  {
    email: "vendor.nagla@femazon.com",
    name: "Nagla Fashion Shop",
    businessName: "Nagla Fashion Shop",
    businessCategory: "Women's Ethnic & Western Wear",
    address: "Boutique Lane, T. Nagar, Chennai, Tamil Nadu"
  },
  {
    email: "vendor.aura@femazon.com",
    name: "Aura Designer Studio",
    businessName: "Aura Designer Studio",
    businessCategory: "Designer Couture & Indo-Western",
    address: "Jubilee Hills, Hyderabad, Telangana"
  },
  {
    email: "vendor.heritage@femazon.com",
    name: "Heritage Silk Weavers",
    businessName: "Heritage Silk Weavers",
    businessCategory: "Pure Silk Sarees & Handlooms",
    address: "Kanchipuram, Tamil Nadu"
  },
  {
    email: "vendor.blossom@femazon.com",
    name: "Little Diva Couture",
    businessName: "Little Diva Couture",
    businessCategory: "Girls' Ethnic & Festive Wear",
    address: "Indiranagar, Bengaluru, Karnataka"
  },
  {
    email: "vendor.glow@femazon.com",
    name: "Glow Botanica Luxury",
    businessName: "Glow Botanica Luxury",
    businessCategory: "Organic Skincare & Ayurvedic Beauty",
    address: "Fort, Mumbai, Maharashtra"
  },
  {
    email: "vendor.festive@femazon.com",
    name: "The Gifting Guild",
    businessName: "The Gifting Guild",
    businessCategory: "Artisanal Hampers & Personalized Keepsakes",
    address: "Connaught Place, New Delhi"
  }
];

const GIRLS_WEAR_PRODUCTS = [
  {
    name: "Girls Embellished Velvet Lehenga Choli Set",
    slug: "girls-embellished-velvet-lehenga-choli-set",
    description: "Royal maroon velvet lehenga choli for young girls with delicate zari embroidery and soft net dupatta.",
    price: 3499,
    discountPrice: 2499,
    category: "Girls' Wear",
    subcategory: "Lehenga Choli",
    dressType: "Lehenga",
    occasion: "Festive & Wedding",
    silhouette: "Flared",
    sizes: JSON.stringify(["2-3 Y", "4-5 Y", "6-7 Y", "8-9 Y", "10-11 Y"]),
    colors: JSON.stringify(["Maroon", "Gold", "Wine"]),
    image: "https://images.unsplash.com/photo-1621784563330-caee0b138a00?q=80&w=800&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1621784563330-caee0b138a00?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=800&auto=format&fit=crop"
    ]),
    stock: 25,
    brandName: "Little Diva Couture",
    vendorEmail: "vendor.blossom@femazon.com",
    daysAgo: 1
  },
  {
    name: "Pastel Pink Ruffled Organza Party Frock",
    slug: "pastel-pink-ruffled-organza-party-frock",
    description: "Ethereal pastel pink tiered organza party dress with flutter sleeves and satin sash bow.",
    price: 2899,
    discountPrice: 1999,
    category: "Girls' Wear",
    subcategory: "Party Dresses",
    dressType: "Frock",
    occasion: "Birthday & Party",
    silhouette: "A-Line",
    sizes: JSON.stringify(["3-4 Y", "5-6 Y", "7-8 Y", "9-10 Y"]),
    colors: JSON.stringify(["Blush Pink", "Mint Green"]),
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop"
    ]),
    stock: 30,
    brandName: "Little Diva Couture",
    vendorEmail: "vendor.blossom@femazon.com",
    daysAgo: 2
  },
  {
    name: "Girls Traditional Brocade Pattu Pavadai Set",
    slug: "girls-traditional-brocade-pattu-pavadai-set",
    description: "Authentic South Indian pure art silk jacquard pattu pavadai with rich zari border.",
    price: 2499,
    discountPrice: 1799,
    category: "Girls' Wear",
    subcategory: "Pattu Pavadai",
    dressType: "Ethnic Set",
    occasion: "Festive & Wedding",
    silhouette: "Traditional",
    sizes: JSON.stringify(["1-2 Y", "3-4 Y", "5-6 Y", "7-8 Y"]),
    colors: JSON.stringify(["Mustard Yellow", "Peacock Blue", "Rani Pink"]),
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop"
    ]),
    stock: 20,
    brandName: "Little Diva Couture",
    vendorEmail: "vendor.blossom@femazon.com",
    daysAgo: 3
  },
  {
    name: "Floral Embroidered Anarkali Gown with Dupatta",
    slug: "girls-floral-embroidered-anarkali-gown-with-dupatta",
    description: "Floor-length festive anarkali for girls with sequin work and soft lining.",
    price: 3299,
    discountPrice: 2299,
    category: "Girls' Wear",
    subcategory: "Anarkali Suits",
    dressType: "Anarkali",
    occasion: "Festive & Wedding",
    silhouette: "Anarkali",
    sizes: JSON.stringify(["4-5 Y", "6-7 Y", "8-9 Y", "10-12 Y"]),
    colors: JSON.stringify(["Teal", "Coral"]),
    image: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=800&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=800&auto=format&fit=crop"
    ]),
    stock: 18,
    brandName: "Little Diva Couture",
    vendorEmail: "vendor.blossom@femazon.com",
    daysAgo: 4
  },
  {
    name: "Embroidered Peplum Kurti & Sharara Pants",
    slug: "girls-embroidered-peplum-kurti-sharara-pants",
    description: "Chic peplum top with flared sharara pants and embroidered net jacket.",
    price: 2999,
    discountPrice: 2099,
    category: "Girls' Wear",
    subcategory: "Sharara Sets",
    dressType: "Sharara",
    occasion: "Festive & Wedding",
    silhouette: "Sharara",
    sizes: JSON.stringify(["3-4 Y", "5-6 Y", "7-8 Y", "9-10 Y"]),
    colors: JSON.stringify(["Sky Blue", "Lavender"]),
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop"
    ]),
    stock: 15,
    brandName: "Little Diva Couture",
    vendorEmail: "vendor.blossom@femazon.com",
    daysAgo: 5
  }
];

const BEAUTY_PRODUCTS = [
  {
    name: "Botanical Radiance Glow Face Oil",
    slug: "botanical-radiance-glow-face-oil",
    description: "Infused with saffron, rosehip seed oil, and 24k gold flakes for overnight cellular repair and luminous complexion.",
    price: 2200,
    discountPrice: 1650,
    category: "Beauty",
    subcategory: "Skincare",
    dressType: "Facial Oil",
    occasion: "Daily Care",
    silhouette: "30ml Bottle",
    sizes: JSON.stringify(["30ml", "50ml"]),
    colors: JSON.stringify(["Golden Amber"]),
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop"
    ]),
    stock: 45,
    brandName: "Glow Botanica Luxury",
    vendorEmail: "vendor.glow@femazon.com",
    daysAgo: 1
  },
  {
    name: "Pure Damask Rose Hydrating Face Mist",
    slug: "pure-damask-rose-hydrating-face-mist",
    description: "Steam-distilled pure Kannauj rose water for instant hydration and tightening pores.",
    price: 950,
    discountPrice: 750,
    category: "Beauty",
    subcategory: "Skincare",
    dressType: "Toner Mist",
    occasion: "Daily Care",
    silhouette: "100ml Spray",
    sizes: JSON.stringify(["100ml", "200ml"]),
    colors: JSON.stringify(["Clear"]),
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop"
    ]),
    stock: 60,
    brandName: "Glow Botanica Luxury",
    vendorEmail: "vendor.glow@femazon.com",
    daysAgo: 2
  },
  {
    name: "Ayurvedic Bringadi Intensive Hair Growth Oil",
    slug: "ayurvedic-bringadi-intensive-hair-growth-oil",
    description: "Traditional herbal blend of bhringraj, amla, and sesame oil for hair strengthening and scalp health.",
    price: 1450,
    discountPrice: 1150,
    category: "Beauty",
    subcategory: "Haircare",
    dressType: "Hair Oil",
    occasion: "Hair Therapy",
    silhouette: "150ml Bottle",
    sizes: JSON.stringify(["150ml", "250ml"]),
    colors: JSON.stringify(["Herbal Green"]),
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop"
    ]),
    stock: 40,
    brandName: "Glow Botanica Luxury",
    vendorEmail: "vendor.glow@femazon.com",
    daysAgo: 3
  },
  {
    name: "Silk Matte Satin Lipstick Capsule - Ruby Red",
    slug: "silk-matte-satin-lipstick-capsule-ruby-red",
    description: "Ultra-hydrating velvet matte lipstick enriched with almond oil and shea butter.",
    price: 1299,
    discountPrice: 999,
    category: "Beauty",
    subcategory: "Makeup",
    dressType: "Lipstick",
    occasion: "Glamour & Evening",
    silhouette: "Bullet 4g",
    sizes: JSON.stringify(["Standard 4g"]),
    colors: JSON.stringify(["Ruby Red", "Deep Wine", "Nude Rose"]),
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop"
    ]),
    stock: 50,
    brandName: "Glow Botanica Luxury",
    vendorEmail: "vendor.glow@femazon.com",
    daysAgo: 4
  },
  {
    name: "Artisanal Shea & French Lavender Bath Soap Bar",
    slug: "artisanal-shea-french-lavender-bath-soap-bar",
    description: "Cold-pressed luxury moisturizing bathing bar with essential oils and exfoliating lavender buds.",
    price: 499,
    discountPrice: 399,
    category: "Beauty",
    subcategory: "Bath & Body",
    dressType: "Artisan Soap",
    occasion: "Self Care",
    silhouette: "125g Bar",
    sizes: JSON.stringify(["125g"]),
    colors: JSON.stringify(["Soft Lilac"]),
    image: "https://images.unsplash.com/photo-1607006314646-9b5cebecebf6?q=80&w=800&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1607006314646-9b5cebecebf6?q=80&w=800&auto=format&fit=crop"
    ]),
    stock: 70,
    brandName: "Glow Botanica Luxury",
    vendorEmail: "vendor.glow@femazon.com",
    daysAgo: 6
  }
];

const GIFTS_PRODUCTS = [
  {
    name: "Royal Festive Silk & Gold Gift Hamper",
    slug: "royal-festive-silk-gold-gift-hamper",
    description: "Luxury velvet hamper box featuring pure brass diya, organic saffron honey, artisanal chocolates, and gold-foil greeting card.",
    price: 3999,
    discountPrice: 2999,
    category: "Gifts",
    subcategory: "Luxury Hampers",
    dressType: "Gift Box",
    occasion: "Festive & Wedding",
    silhouette: "Gift Hamper",
    sizes: JSON.stringify(["Standard Hamper Box"]),
    colors: JSON.stringify(["Crimson Red", "Royal Emerald"]),
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop"
    ]),
    stock: 25,
    brandName: "The Gifting Guild",
    vendorEmail: "vendor.festive@femazon.com",
    daysAgo: 1
  },
  {
    name: "Personalized Engraved Kundan Jewelry Box",
    slug: "personalized-engraved-kundan-jewelry-box",
    description: "Handcrafted wooden keepsake chest with brass filigree, mirror lid, and custom engraved brass monogram plate.",
    price: 2499,
    discountPrice: 1899,
    category: "Gifts",
    subcategory: "Personalized Keepsakes",
    dressType: "Jewellery Box",
    occasion: "Anniversary & Birthday",
    silhouette: "Keepsake Box",
    sizes: JSON.stringify(["Medium (8x6 inch)"]),
    colors: JSON.stringify(["Antique Walnut", "Ivory Lacquer"]),
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop"
    ]),
    stock: 30,
    brandName: "The Gifting Guild",
    vendorEmail: "vendor.festive@femazon.com",
    daysAgo: 2
  },
  {
    name: "Artisanal Belgian Chocolate & Macaron Gift Casket",
    slug: "artisanal-belgian-chocolate-macaron-gift-casket",
    description: "Assortment of 16 handcrafted single-origin truffles and Parisian macarons in a gold-embossed keepsake tin.",
    price: 1899,
    discountPrice: 1499,
    category: "Gifts",
    subcategory: "Gourmet & Chocolates",
    dressType: "Chocolate Box",
    occasion: "Celebration",
    silhouette: "Casket 16 Pcs",
    sizes: JSON.stringify(["16 Pieces Box"]),
    colors: JSON.stringify(["Gold Tin", "Maroon Velvet"]),
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop"
    ]),
    stock: 40,
    brandName: "The Gifting Guild",
    vendorEmail: "vendor.festive@femazon.com",
    daysAgo: 3
  },
  {
    name: "Aromatherapy Soy Candle & Essential Oil Gift Set",
    slug: "aromatherapy-soy-candle-essential-oil-gift-set",
    description: "Pair of hand-poured jasmine & sandalwood soy candles with a ceramic diffuser and rose water vial.",
    price: 1699,
    discountPrice: 1299,
    category: "Gifts",
    subcategory: "Wellness Gifts",
    dressType: "Candle Set",
    occasion: "Housewarming & Self Care",
    silhouette: "Gift Pack",
    sizes: JSON.stringify(["Set of 3"]),
    colors: JSON.stringify(["Matte White & Amber"]),
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop"
    ]),
    stock: 35,
    brandName: "The Gifting Guild",
    vendorEmail: "vendor.festive@femazon.com",
    daysAgo: 5
  }
];

export async function seedDatabase() {
  console.log("Seeding vendors and authentic marketplace products to PostgreSQL...");
  const hashedPassword = await bcrypt.hash("password123", 10);
  const vendorMap = new Map<string, number>();

  // 1. Create/Ensure all Vendors exist
  for (const v of VENDORS) {
    const user = await prisma.user.upsert({
      where: { email: v.email },
      update: {
        name: v.name,
        role: "VENDOR",
      },
      create: {
        email: v.email,
        name: v.name,
        password: hashedPassword,
        role: "VENDOR",
      }
    });

    await prisma.vendorProfile.upsert({
      where: { userId: user.id },
      update: {
        businessName: v.businessName,
        businessCategory: v.businessCategory,
        address: v.address,
        status: "APPROVED",
      },
      create: {
        userId: user.id,
        businessName: v.businessName,
        businessCategory: v.businessCategory,
        address: v.address,
        status: "APPROVED",
      }
    });

    vendorMap.set(v.email, user.id);
  }

  // 2. Seed Nagla Shop Products
  const naglaVendorId = vendorMap.get("vendor.nagla@femazon.com");
  for (let i = 0; i < NAGLA_SHOP_PRODUCTS.length; i++) {
    const item = NAGLA_SHOP_PRODUCTS[i];
    const createdDate = new Date(Date.now() - (i + 1) * 86400000);
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        discountPrice: item.discountPrice,
        image: item.image,
        images: JSON.stringify(item.images),
        category: "Women's Wear",
        subcategory: item.subcategory,
        dressType: item.subcategory,
        stock: item.stock,
        sizes: JSON.stringify(item.sizes),
        colors: JSON.stringify(item.colors),
        approvalStatus: "APPROVED",
        brandName: "Nagla Fashion",
        vendorId: naglaVendorId,
        createdAt: createdDate,
      },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        discountPrice: item.discountPrice,
        image: item.image,
        images: JSON.stringify(item.images),
        category: "Women's Wear",
        subcategory: item.subcategory,
        dressType: item.subcategory,
        stock: item.stock,
        sizes: JSON.stringify(item.sizes),
        colors: JSON.stringify(item.colors),
        approvalStatus: "APPROVED",
        brandName: "Nagla Fashion",
        vendorId: naglaVendorId,
        createdAt: createdDate,
      }
    });
  }

  // 3. Seed Catalog Snapshot Products (Sarees, Lehengas, Kurtas, Indo-Western, etc.)
  const auraVendorId = vendorMap.get("vendor.aura@femazon.com");
  const heritageVendorId = vendorMap.get("vendor.heritage@femazon.com");

  for (let i = 0; i < catalogSnapshot.length; i++) {
    const item: any = catalogSnapshot[i];
    const vendorId = item.category?.includes("Silk") || item.category === "Sarees" 
      ? heritageVendorId 
      : auraVendorId;
    const daysAgo = (i % 25) + 1;
    const createdDate = new Date(Date.now() - daysAgo * 86400000);

    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        discountPrice: item.discountPrice,
        image: item.image,
        images: typeof item.images === 'string' ? item.images : JSON.stringify(item.images),
        category: item.category === 'Dresses' || item.category === 'Western Wear' || item.category === 'Sarees' || item.category === 'Lehengas' || item.category === 'Kurta Sets' || item.category === 'Co-ord Sets' || item.category === 'Indo-Western' || item.category === 'Gowns' || item.category === 'Tops'
          ? "Women's Wear"
          : item.category,
        subcategory: item.subcategory || item.category,
        dressType: item.dressType || item.category,
        occasion: item.occasion || "Festive & Party",
        silhouette: item.silhouette || "Classic",
        stock: item.stock || 25,
        sizes: typeof item.sizes === 'string' ? item.sizes : JSON.stringify(item.sizes || ["S", "M", "L"]),
        colors: typeof item.colors === 'string' ? item.colors : JSON.stringify(item.colors || ["Maroon", "Gold"]),
        approvalStatus: "APPROVED",
        readyToShip: item.readyToShip ?? true,
        brandName: item.brandName || "Femazon Luxe",
        vendorId,
        createdAt: createdDate,
      },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        discountPrice: item.discountPrice,
        image: item.image,
        images: typeof item.images === 'string' ? item.images : JSON.stringify(item.images),
        category: item.category === 'Dresses' || item.category === 'Western Wear' || item.category === 'Sarees' || item.category === 'Lehengas' || item.category === 'Kurta Sets' || item.category === 'Co-ord Sets' || item.category === 'Indo-Western' || item.category === 'Gowns' || item.category === 'Tops'
          ? "Women's Wear"
          : item.category,
        subcategory: item.subcategory || item.category,
        dressType: item.dressType || item.category,
        occasion: item.occasion || "Festive & Party",
        silhouette: item.silhouette || "Classic",
        stock: item.stock || 25,
        sizes: typeof item.sizes === 'string' ? item.sizes : JSON.stringify(item.sizes || ["S", "M", "L"]),
        colors: typeof item.colors === 'string' ? item.colors : JSON.stringify(item.colors || ["Maroon", "Gold"]),
        approvalStatus: "APPROVED",
        readyToShip: item.readyToShip ?? true,
        brandName: item.brandName || "Femazon Luxe",
        vendorId,
        createdAt: createdDate,
      }
    });
  }

  // 4. Seed Girls' Wear
  for (const item of GIRLS_WEAR_PRODUCTS) {
    const vId = vendorMap.get(item.vendorEmail);
    const createdDate = new Date(Date.now() - item.daysAgo * 86400000);
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        discountPrice: item.discountPrice,
        image: item.image,
        images: item.images,
        category: item.category,
        subcategory: item.subcategory,
        dressType: item.dressType,
        occasion: item.occasion,
        silhouette: item.silhouette,
        sizes: item.sizes,
        colors: item.colors,
        stock: item.stock,
        approvalStatus: "APPROVED",
        brandName: item.brandName,
        vendorId: vId,
        createdAt: createdDate,
      },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        discountPrice: item.discountPrice,
        image: item.image,
        images: item.images,
        category: item.category,
        subcategory: item.subcategory,
        dressType: item.dressType,
        occasion: item.occasion,
        silhouette: item.silhouette,
        sizes: item.sizes,
        colors: item.colors,
        stock: item.stock,
        approvalStatus: "APPROVED",
        brandName: item.brandName,
        vendorId: vId,
        createdAt: createdDate,
      }
    });
  }

  // 5. Seed Beauty Products
  for (const item of BEAUTY_PRODUCTS) {
    const vId = vendorMap.get(item.vendorEmail);
    const createdDate = new Date(Date.now() - item.daysAgo * 86400000);
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        discountPrice: item.discountPrice,
        image: item.image,
        images: item.images,
        category: item.category,
        subcategory: item.subcategory,
        dressType: item.dressType,
        occasion: item.occasion,
        silhouette: item.silhouette,
        sizes: item.sizes,
        colors: item.colors,
        stock: item.stock,
        approvalStatus: "APPROVED",
        brandName: item.brandName,
        vendorId: vId,
        createdAt: createdDate,
      },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        discountPrice: item.discountPrice,
        image: item.image,
        images: item.images,
        category: item.category,
        subcategory: item.subcategory,
        dressType: item.dressType,
        occasion: item.occasion,
        silhouette: item.silhouette,
        sizes: item.sizes,
        colors: item.colors,
        stock: item.stock,
        approvalStatus: "APPROVED",
        brandName: item.brandName,
        vendorId: vId,
        createdAt: createdDate,
      }
    });
  }

  // 6. Seed Gifts
  for (const item of GIFTS_PRODUCTS) {
    const vId = vendorMap.get(item.vendorEmail);
    const createdDate = new Date(Date.now() - item.daysAgo * 86400000);
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        discountPrice: item.discountPrice,
        image: item.image,
        images: item.images,
        category: item.category,
        subcategory: item.subcategory,
        dressType: item.dressType,
        occasion: item.occasion,
        silhouette: item.silhouette,
        sizes: item.sizes,
        colors: item.colors,
        stock: item.stock,
        approvalStatus: "APPROVED",
        brandName: item.brandName,
        vendorId: vId,
        createdAt: createdDate,
      },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        discountPrice: item.discountPrice,
        image: item.image,
        images: item.images,
        category: item.category,
        subcategory: item.subcategory,
        dressType: item.dressType,
        occasion: item.occasion,
        silhouette: item.silhouette,
        sizes: item.sizes,
        colors: item.colors,
        stock: item.stock,
        approvalStatus: "APPROVED",
        brandName: item.brandName,
        vendorId: vId,
        createdAt: createdDate,
      }
    });

    // Ensure GiftProduct relation exists
    await prisma.giftProduct.upsert({
      where: { productId: product.id },
      update: {
        occasion: item.occasion,
        recipient: "Her / Family",
        isPersonalizable: true,
        allowsGiftWrap: true,
        allowsGiftCard: true,
      },
      create: {
        productId: product.id,
        occasion: item.occasion,
        recipient: "Her / Family",
        isPersonalizable: true,
        allowsGiftWrap: true,
        allowsGiftCard: true,
      }
    });
  }

  const finalCount = await prisma.product.count();
  console.log(`Database populated successfully! Total Products in PostgreSQL: ${finalCount}`);
}

seedDatabase()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
