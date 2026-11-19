const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const OFFICIAL_CATEGORIES = [
  {
    name: "Women's Wear",
    slug: "womens-wear",
    description: "Designer sarees, kurtis, lehengas, Western formals & luxury couture."
  },
  {
    name: "Beauty Care",
    slug: "beauty-care",
    description: "Ayurvedic wellness, organic skincare, perfumes & luxury cosmetics."
  },
  {
    name: "Jewellery & Accessories",
    slug: "jewellery-accessories",
    description: "Fine jewellery, artisanal silver, bridal sets, clutches & accessories."
  },
  {
    name: "Gifts for All Occasions",
    slug: "gifts-for-all-occasions",
    description: "Curated hampers, bespoke festive gifts, florals & luxury keepsakes."
  }
];

async function seedCategories() {
  try {
    for (const cat of OFFICIAL_CATEGORIES) {
      const existing = await prisma.category.findUnique({
        where: { slug: cat.slug }
      });
      if (!existing) {
        await prisma.category.create({ data: cat });
        console.log(`✓ Created category: ${cat.name}`);
      } else {
        console.log(`• Category already exists: ${cat.name}`);
      }
    }
  } catch (err) {
    console.error('Error seeding categories:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seedCategories();
