import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL ?? 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

const IMAGES = [
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop", // Floral Kurti
  "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=800&q=80&auto=format&fit=crop", // Ethnic
  "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800&q=80&auto=format&fit=crop", // Co-ords
  "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=800&q=80&auto=format&fit=crop", // Ethnic Dress
  "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80&auto=format&fit=crop", // Casual Top
  "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop", // Designer Saree
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop", // Chic Dress
  "https://images.unsplash.com/photo-1572804013309-82a891485787?w=800&q=80&auto=format&fit=crop", // White Top
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format&fit=crop", // Flowy Dress
  "https://images.unsplash.com/photo-1550614000-4b95dd5e83ec?w=800&q=80&auto=format&fit=crop", // Velvet Co-ords
  "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=800&q=80&auto=format&fit=crop", // Summer Top
  "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80&auto=format&fit=crop", // Boho Dress
  "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&q=80&auto=format&fit=crop", // Accessories
  "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80&auto=format&fit=crop", // Full Covered Gown
  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80&auto=format&fit=crop", // Classic Kurti
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop"  // Accessories 2
];

const MOCK_PRODUCTS = [
  { name: "Floral Printed Kurti", category: "Kurtis", price: 1299, discountPrice: 999 },
  { name: "Elegant Anarkali Dress", category: "Ethnic", price: 1999, discountPrice: 1499 },
  { name: "Satin Co-ord Set", category: "Co-ords", price: 2299, discountPrice: 1799 },
  { name: "Embroidered Ethnic Dress", category: "Ethnic", price: 1699, discountPrice: 1299 },
  { name: "Casual Women’s Top", category: "Tops", price: 999, discountPrice: 799 },
  { name: "Designer Saree", category: "Ethnic", price: 2499, discountPrice: 1999 },
  { name: "Chic Midi Dress", category: "Dresses", price: 1599, discountPrice: 1199 },
  { name: "Classic White Tunic", category: "Tops", price: 899, discountPrice: 699 },
  { name: "Flowy Chiffon Dress", category: "Dresses", price: 2199, discountPrice: 1699 },
  { name: "Velvet Lounge Co-ords", category: "Co-ords", price: 1899, discountPrice: 1499 },
  { name: "Summer Breeze Top", category: "Tops", price: 799, discountPrice: 599 },
  { name: "Bohemian Maxi Dress", category: "Dresses", price: 1499, discountPrice: 1099 },
  { name: "Gold-Plated Necklace", category: "Accessories", price: 999, discountPrice: 699 },
  { name: "Full Covered Gown", category: "Dresses", price: 3499, discountPrice: 2899 },
  { name: "Cotton Straight Kurti", category: "Kurtis", price: 1199, discountPrice: 899 },
  { name: "Elegant Chudidar Suit", category: "Ethnic", price: 1899, discountPrice: 1499 }
];

async function main() {
  console.log("Seeding NAGLA SHOP and products...");

  // 1. Create or Find Vendor
  let vendor = await prisma.user.findUnique({
    where: { email: "nagla@shop.com" }
  });

  if (!vendor) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    vendor = await prisma.user.create({
      data: {
        email: "nagla@shop.com",
        name: "Nagla Store Owner",
        password: hashedPassword,
        role: "VENDOR",
        vendorProfile: {
          create: {
            businessName: "NAGLA SHOP",
            ownerName: "Nagla Owner",
            businessCategory: "Women's Fashion",
            status: "APPROVED"
          }
        }
      }
    });
    console.log("Created vendor NAGLA SHOP");
  } else {
    // Ensure VendorProfile exists
    const profile = await prisma.vendorProfile.findUnique({
      where: { userId: vendor.id }
    });
    if (!profile) {
      await prisma.vendorProfile.create({
        data: {
          userId: vendor.id,
          businessName: "NAGLA SHOP",
          status: "APPROVED"
        }
      });
    }
  }

  // 2. Clear existing products to ensure clean demo environment
  await prisma.product.deleteMany({});
  console.log("Cleared existing products.");

  // 3. Insert 16 Products
  for (let i = 0; i < MOCK_PRODUCTS.length; i++) {
    const item = MOCK_PRODUCTS[i];
    const imageUrl = IMAGES[i];

    await prisma.product.create({
      data: {
        name: item.name,
        slug: item.name.toLowerCase().replace(/ /g, '-') + '-' + i,
        description: `Premium quality ${item.name.toLowerCase()} curated for modern fashion.`,
        price: item.price,
        discountPrice: item.discountPrice,
        image: imageUrl,
        images: JSON.stringify([imageUrl, imageUrl]), // Mock multiple images with same image for now
        category: item.category,
        subcategory: item.category,
        stock: 50,
        sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
        colors: JSON.stringify(["Black", "White"]),
        approvalStatus: "APPROVED",
        vendorId: vendor.id
      }
    });
  }

  console.log("Successfully seeded 16 products for NAGLA SHOP.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
