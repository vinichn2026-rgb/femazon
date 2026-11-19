const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verifyLogins() {
  try {
    // 1. Verify Admin
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@femazon.com' }
    });
    const isAdminPasswordValid = await bcrypt.compare('Admin@Femazon2026', admin.password);
    console.log('Admin Auth Verification:', {
      found: !!admin,
      role: admin?.role,
      passwordValid: isAdminPasswordValid,
      allowedAdmin: admin?.role === 'ADMIN' && isAdminPasswordValid
    });

    // 2. Verify Vendor
    const vendor = await prisma.user.findUnique({
      where: { email: 'vendor@femazon.com' },
      include: { vendorProfile: true }
    });
    const isVendorPasswordValid = await bcrypt.compare('Vendor@Femazon2026', vendor.password);
    console.log('Vendor Auth Verification:', {
      found: !!vendor,
      role: vendor?.role,
      passwordValid: isVendorPasswordValid,
      hasVendorProfile: !!vendor?.vendorProfile,
      vendorStatus: vendor?.vendorProfile?.status,
      allowedVendor: vendor?.role === 'VENDOR' && isVendorPasswordValid
    });
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

verifyLogins();
