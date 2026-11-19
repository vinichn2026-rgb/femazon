const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  try {
    console.log('Connecting to database...');

    // 1. Create or update Admin User
    const adminPasswordHash = await bcrypt.hash('Admin@Femazon2026', 10);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@femazon.com' },
      update: {
        password: adminPasswordHash,
        role: 'ADMIN',
        name: 'Femazon Administrator',
      },
      create: {
        email: 'admin@femazon.com',
        name: 'Femazon Administrator',
        phone: '+91 9876543210',
        password: adminPasswordHash,
        role: 'ADMIN',
      },
    });
    console.log('✓ Admin User created/updated:', {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
      name: adminUser.name,
    });

    // 2. Create or update Vendor User
    const vendorPasswordHash = await bcrypt.hash('Vendor@Femazon2026', 10);
    const vendorUser = await prisma.user.upsert({
      where: { email: 'vendor@femazon.com' },
      update: {
        password: vendorPasswordHash,
        role: 'VENDOR',
        name: 'Femazon Boutique Partner',
      },
      create: {
        email: 'vendor@femazon.com',
        name: 'Femazon Boutique Partner',
        phone: '+91 9876543211',
        password: vendorPasswordHash,
        role: 'VENDOR',
      },
    });

    // 3. Create or update Vendor Profile
    const vendorProfile = await prisma.vendorProfile.upsert({
      where: { userId: vendorUser.id },
      update: {
        businessName: 'Femazon Partner Boutique',
        ownerName: 'Boutique Owner',
        email: vendorUser.email,
        phone: vendorUser.phone,
        businessCategory: 'Luxury Ethnic & Western Wear',
        address: 'Flagship Studio, Jubilee Hills, Hyderabad',
        status: 'APPROVED',
      },
      create: {
        userId: vendorUser.id,
        businessName: 'Femazon Partner Boutique',
        ownerName: 'Boutique Owner',
        email: vendorUser.email,
        phone: vendorUser.phone,
        businessCategory: 'Luxury Ethnic & Western Wear',
        address: 'Flagship Studio, Jubilee Hills, Hyderabad',
        status: 'APPROVED',
      },
    });

    console.log('✓ Vendor User created/updated:', {
      id: vendorUser.id,
      email: vendorUser.email,
      role: vendorUser.role,
      vendorProfileId: vendorProfile.id,
      businessName: vendorProfile.businessName,
      status: vendorProfile.status,
    });

    console.log('\nAll credentials seeded successfully!');
  } catch (err) {
    console.error('Error seeding users:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seed();
