import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import { NAGLA_SHOP_PRODUCTS, NAGLA_SHOP_VENDOR } from '../src/data/naglaFashionShop';

async function main() {
  console.log("Seeding NAGLA FASHION SHOP with authentic dress images...");

  // 1. Create or Find Vendor
  let vendor = await prisma.user.findUnique({
    where: { email: NAGLA_SHOP_VENDOR.email }
  });

  if (!vendor) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    vendor = await prisma.user.create({
      data: {
        email: NAGLA_SHOP_VENDOR.email,
        name: NAGLA_SHOP_VENDOR.name,
        password: hashedPassword,
        role: "VENDOR",
        vendorProfile: {
          create: {
            businessName: NAGLA_SHOP_VENDOR.businessName,
            ownerName: NAGLA_SHOP_VENDOR.name,
            businessCategory: NAGLA_SHOP_VENDOR.businessCategory,
            status: "APPROVED"
          }
        }
      }
    });
    console.log(`Created vendor: ${NAGLA_SHOP_VENDOR.businessName}`);
  } else {
    // Ensure VendorProfile exists and has current business name
    const profile = await prisma.vendorProfile.findUnique({
      where: { userId: vendor.id }
    });
    if (!profile) {
      await prisma.vendorProfile.create({
        data: {
          userId: vendor.id,
          businessName: NAGLA_SHOP_VENDOR.businessName,
          ownerName: NAGLA_SHOP_VENDOR.name,
          businessCategory: NAGLA_SHOP_VENDOR.businessCategory,
          status: "APPROVED"
        }
      });
    } else {
      await prisma.vendorProfile.update({
        where: { id: profile.id },
        data: {
          businessName: NAGLA_SHOP_VENDOR.businessName,
          status: "APPROVED"
        }
      });
    }
  }

  // 2. Upsert each Nagla Fashion Shop Product with real multi-angle images
  for (const item of NAGLA_SHOP_PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        discountPrice: item.discountPrice,
        image: item.image,
        images: JSON.stringify(item.images),
        category: item.category,
        subcategory: item.subcategory,
        dressType: item.subcategory,
        stock: item.stock,
        sizes: JSON.stringify(item.sizes),
        colors: JSON.stringify(item.colors),
        approvalStatus: "APPROVED",
        vendorId: vendor.id
      },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        discountPrice: item.discountPrice,
        image: item.image,
        images: JSON.stringify(item.images),
        category: item.category,
        subcategory: item.subcategory,
        dressType: item.subcategory,
        stock: item.stock,
        sizes: JSON.stringify(item.sizes),
        colors: JSON.stringify(item.colors),
        approvalStatus: "APPROVED",
        vendorId: vendor.id
      }
    });
    console.log(`Seeded Nagla product: ${item.name} (${item.images.length} gallery images)`);
  }

  console.log(`\nSuccessfully seeded ${NAGLA_SHOP_PRODUCTS.length} Nagla Fashion Shop products with authentic dress images!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
