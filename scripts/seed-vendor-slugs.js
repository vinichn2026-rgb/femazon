const { Pool } = require('pg');
require('dotenv').config();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const pool = new Pool({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query('SELECT id, "businessName", slug FROM "VendorProfile"');
    console.log(`Found ${res.rows.length} vendors in DB`);

    for (const v of res.rows) {
      if (!v.slug) {
        const newSlug = slugify(v.businessName || `vendor-${v.id}`);
        await pool.query('UPDATE "VendorProfile" SET slug = $1 WHERE id = $2', [newSlug, v.id]);
        console.log(`Assigned slug "${newSlug}" to vendor #${v.id} (${v.businessName})`);
      } else {
        console.log(`Vendor #${v.id} (${v.businessName}) already has slug: ${v.slug}`);
      }
    }
  } catch (err) {
    console.error('Error seeding slugs:', err);
  } finally {
    await pool.end();
  }
}

main();
