const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verifyDashboardData() {
  try {
    console.log('--- Super Admin Control Centre Audit Verification ---');

    // 1. Check Admin User
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    console.log('✓ Admin User in DB:', admin ? `${admin.email} (ID: ${admin.id})` : 'None');

    // 2. Check Categories
    const categories = await prisma.category.findMany();
    console.log('✓ Product Categories:', categories.map(c => c.name));

    // 3. Check Vendors
    const vendors = await prisma.vendorProfile.findMany({
      include: { user: { include: { products: true } } }
    });
    console.log(`✓ Product Vendors: ${vendors.length}`);

    // 4. Check Stylists
    const stylists = await prisma.stylistProfile.findMany({
      include: { packages: true, portfolios: true, bookings: true }
    });
    console.log(`✓ Personal Stylists: ${stylists.length}`);

    // 5. Check Orders
    const orders = await prisma.order.findMany({
      include: { user: true, items: { include: { product: true } } }
    });
    console.log(`✓ Product Orders: ${orders.length}`);

    // 6. Check Bookings
    const bookings = await prisma.stylistBooking.findMany({
      include: { stylist: true, package: true, user: true }
    });
    console.log(`✓ Stylist Bookings: ${bookings.length}`);

    console.log('\n--- All Database queries verified successfully! ---');
  } catch (err) {
    console.error('Verification failed:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

verifyDashboardData();
