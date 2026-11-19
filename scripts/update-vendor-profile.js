const { Pool } = require('pg');
require('dotenv').config();

async function main() {
  const pool = new Pool({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'VendorProfile';
    `);
    const cols = res.rows.map(r => r.column_name);
    console.log('Current VendorProfile columns:', cols);

    if (!cols.includes('approvalemailsent')) {
      console.log('Adding approvalEmailSent column...');
      await pool.query(`ALTER TABLE "VendorProfile" ADD COLUMN IF NOT EXISTS "approvalEmailSent" BOOLEAN DEFAULT false;`);
    }
    if (!cols.includes('approvalemailsentat')) {
      console.log('Adding approvalEmailSentAt column...');
      await pool.query(`ALTER TABLE "VendorProfile" ADD COLUMN IF NOT EXISTS "approvalEmailSentAt" TIMESTAMP(3);`);
    }
    if (!cols.includes('approvalemailerror')) {
      console.log('Adding approvalEmailError column...');
      await pool.query(`ALTER TABLE "VendorProfile" ADD COLUMN IF NOT EXISTS "approvalEmailError" TEXT;`);
    }
    
    // Also check slug for public vendor shop page:
    if (!cols.includes('slug')) {
      console.log('Adding slug column to VendorProfile for public shop pages...');
      await pool.query(`ALTER TABLE "VendorProfile" ADD COLUMN IF NOT EXISTS "slug" TEXT;`);
      await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS "VendorProfile_slug_key" ON "VendorProfile"("slug");`);
    }

    console.log('VendorProfile table updated successfully!');
  } catch (err) {
    console.error('Error updating schema:', err);
  } finally {
    await pool.end();
  }
}

main();
