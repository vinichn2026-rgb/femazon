import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const password = await bcrypt.hash('Password@123', 10);

  // 1. Admin
  await prisma.user.upsert({
    where: { email: 'admin@femazon.com' },
    update: { password, role: 'ADMIN' },
    create: {
      name: 'Super Admin',
      email: 'admin@femazon.com',
      phone: '9999999999',
      password,
      role: 'ADMIN'
    }
  });

  // 2. Vendor
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@femazon.com' },
    update: { password, role: 'VENDOR' },
    create: {
      name: 'Test Vendor',
      email: 'vendor@femazon.com',
      phone: '8888888888',
      password,
      role: 'VENDOR'
    }
  });

  await prisma.vendorProfile.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      businessName: 'Femazon Vendor Shop',
      status: 'APPROVED'
    }
  });

  // 3. Customer
  await prisma.user.upsert({
    where: { email: 'customer@femazon.com' },
    update: { password, role: 'CUSTOMER' },
    create: {
      name: 'Test Customer',
      email: 'customer@femazon.com',
      phone: '7777777777',
      password,
      role: 'CUSTOMER'
    }
  });

  console.log('Test users created successfully!');
}

main().catch(console.error);
