require('dotenv').config();
const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Category configuration mapping Aza endpoints to Femazon store categories
const AZA_CATEGORY_MAP = [
  // 1. Kurta Sets
  {
    name: 'Anarkali Sets',
    url: 'https://www.azafashions.com/collection/women/kurta-sets/anarkali-sets',
    category: 'Kurta Sets',
    subcategory: 'Anarkali Kurta Sets',
    silhouette: 'Anarkali',
    dressType: 'Anarkali Set'
  },
  {
    name: 'Straight Kurta Sets',
    url: 'https://www.azafashions.com/collection/women/kurta-sets/straight-kurta-sets',
    category: 'Kurta Sets',
    subcategory: 'Straight Kurta Sets',
    silhouette: 'Straight',
    dressType: 'Straight Kurta Set'
  },
  {
    name: 'Sharara & Gharara Sets',
    url: 'https://www.azafashions.com/collection/women/kurta-sets/sharara-and-gharara-sets',
    category: 'Kurta Sets',
    subcategory: 'Sharara & Gharara Sets',
    silhouette: 'Sharara',
    dressType: 'Sharara Set'
  },
  {
    name: 'Palazzo Sets',
    url: 'https://www.azafashions.com/collection/women/kurta-sets/palazzo-sets',
    category: 'Kurta Sets',
    subcategory: 'Palazzo Kurta Sets',
    silhouette: 'Palazzo',
    dressType: 'Palazzo Set'
  },
  // 2. Lehengas
  {
    name: 'Bridal Lehengas',
    url: 'https://www.azafashions.com/collection/women/lehengas/bridal-lehengas',
    category: 'Lehengas',
    subcategory: 'Bridal Lehengas',
    silhouette: 'Flared',
    dressType: 'Bridal Lehenga'
  },
  {
    name: 'Fusion & Cape Lehengas',
    url: 'https://www.azafashions.com/collection/women/lehengas/fusion-cape-lehengas',
    category: 'Lehengas',
    subcategory: 'Fusion & Cape Lehengas',
    silhouette: 'Cape',
    dressType: 'Fusion Lehenga'
  },
  {
    name: 'Printed Lehengas',
    url: 'https://www.azafashions.com/collection/women/lehengas/printed-lehengas',
    category: 'Lehengas',
    subcategory: 'Printed Lehengas',
    silhouette: 'Flared',
    dressType: 'Printed Lehenga'
  },
  // 3. Sarees
  {
    name: 'Classic Sarees',
    url: 'https://www.azafashions.com/collection/women/sarees/classic-sarees',
    category: 'Sarees',
    subcategory: 'Classic Sarees',
    silhouette: 'Saree',
    dressType: 'Saree'
  },
  {
    name: 'Pre-Draped Sarees',
    url: 'https://www.azafashions.com/collection/women/sarees/pre-draped-sarees',
    category: 'Sarees',
    subcategory: 'Pre-Draped Sarees',
    silhouette: 'Pre-Draped',
    dressType: 'Draped Saree'
  },
  {
    name: 'Silk & Banarasi Sarees',
    url: 'https://www.azafashions.com/collection/women/sarees/silk-sarees',
    category: 'Sarees',
    subcategory: 'Pure Banarasi Silk',
    silhouette: 'Saree',
    dressType: 'Silk Saree'
  },
  // 4. Gowns & Dresses
  {
    name: 'Evening Gowns',
    url: 'https://www.azafashions.com/collection/women/gowns',
    category: 'Gowns',
    subcategory: 'Evening Gowns',
    silhouette: 'Gown',
    dressType: 'Evening Gown'
  },
  {
    name: 'Dresses',
    url: 'https://www.azafashions.com/collection/women/dresses',
    category: 'Dresses',
    subcategory: 'Maxi Dresses',
    silhouette: 'Maxi',
    dressType: 'Maxi Dress'
  },
  // 5. Jewellery
  {
    name: 'Necklaces',
    url: 'https://www.azafashions.com/collection/jewellery/necklaces',
    category: 'Jewellery',
    subcategory: 'Necklaces',
    silhouette: 'Necklace',
    dressType: 'Jewellery'
  },
  {
    name: 'Earrings',
    url: 'https://www.azafashions.com/collection/jewellery/earrings',
    category: 'Jewellery',
    subcategory: 'Earrings',
    silhouette: 'Earrings',
    dressType: 'Jewellery'
  },
  {
    name: 'Jewellery Sets',
    url: 'https://www.azafashions.com/collection/jewellery/jewellery-sets',
    category: 'Jewellery',
    subcategory: 'Jewellery Sets',
    silhouette: 'Set',
    dressType: 'Jewellery'
  },
  // 6. Handbags & Potlis
  {
    name: 'Potlis',
    url: 'https://www.azafashions.com/collection/accessories/potlis',
    category: 'Potlis',
    subcategory: 'Bridal Potlis',
    silhouette: 'Potli',
    dressType: 'Potli Bag'
  },
  {
    name: 'Handbags',
    url: 'https://www.azafashions.com/collection/accessories/handbags',
    category: 'Handbags',
    subcategory: 'Shoulder Bags',
    silhouette: 'Handbag',
    dressType: 'Handbag'
  },
  // 7. Men's Collection
  {
    name: 'Men Sherwanis',
    url: 'https://www.azafashions.com/collection/men/sherwanis',
    category: 'Men',
    subcategory: 'Sherwanis',
    silhouette: 'Sherwani',
    dressType: 'Sherwani'
  },
  {
    name: 'Men Kurta Sets',
    url: 'https://www.azafashions.com/collection/men/kurta-sets',
    category: 'Men',
    subcategory: 'Kurta Sets',
    silhouette: 'Kurta Set',
    dressType: 'Kurta Set'
  },
  {
    name: 'Men Nehru Jackets',
    url: 'https://www.azafashions.com/collection/men/nehru-jacket-and-sets',
    category: 'Men',
    subcategory: 'Nehru Jackets & Sets',
    silhouette: 'Nehru Jacket',
    dressType: 'Nehru Jacket'
  }
];

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function extractColors(text) {
  const commonColors = [
    'Red', 'Crimson', 'Maroon', 'Pink', 'Blush', 'Rose', 'Peach', 'Orange', 'Rust', 'Coral',
    'Yellow', 'Mustard', 'Gold', 'Golden', 'Cream', 'Ivory', 'White', 'Off White', 'Beige',
    'Green', 'Emerald', 'Mint', 'Sage', 'Teal', 'Olive', 'Bottle Green',
    'Blue', 'Navy', 'Indigo', 'Sky Blue', 'Royal Blue', 'Turquoise', 'Aqua',
    'Purple', 'Lavender', 'Lilac', 'Plum', 'Wine', 'Burgundy',
    'Black', 'Grey', 'Silver', 'Bronze', 'Multi', 'Multicolor'
  ];
  const detected = [];
  const lower = (text || '').toLowerCase();
  for (const c of commonColors) {
    const reg = new RegExp(`\\b${c.toLowerCase()}\\b`, 'i');
    if (reg.test(lower)) {
      detected.push(c);
    }
  }
  return detected.length > 0 ? detected : ['Multicolor'];
}

function extractSizes(tokens, category) {
  if (['Jewellery', 'Handbags', 'Potlis'].includes(category)) {
    return ['One Size'];
  }
  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    return ['S', 'M', 'L', 'XL', 'XXL'];
  }
  const sizes = [];
  for (const t of tokens) {
    if (typeof t === 'string') {
      const parts = t.split('|');
      if (parts[1] && !sizes.includes(parts[1])) {
        sizes.push(parts[1]);
      }
    }
  }
  return sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'];
}

function fetchCategoryPage(url, page = 1) {
  const fullUrl = page > 1 ? `${url}?page=${page}` : url;
  const cmd = `curl.exe -s -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36" -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8" -H "Accept-Language: en-US,en;q=0.9" "${fullUrl}"`;
  
  const html = execSync(cmd, { maxBuffer: 15 * 1024 * 1024 }).toString('utf8');
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) {
    throw new Error(`Failed to extract __NEXT_DATA__ from ${fullUrl}`);
  }
  const parsed = JSON.parse(match[1]);
  const list = parsed.props?.pageProps?.data?.list || [];
  return list;
}

async function importCategoryPage(catDef, page = 1) {
  console.log(`\n======================================================`);
  console.log(`[PAGE ${page}] Crawling Category: ${catDef.name} (${catDef.category} > ${catDef.subcategory})`);
  console.log(`URL: ${catDef.url}${page > 1 ? `?page=${page}` : ''}`);
  console.log(`======================================================`);

  let azaProducts = [];
  try {
    azaProducts = fetchCategoryPage(catDef.url, page);
  } catch (err) {
    console.error(`Error fetching page ${page} for ${catDef.name}:`, err.message);
    return 0;
  }

  console.log(`Extracted ${azaProducts.length} raw designer products from Aza Fashions.`);
  let importedCount = 0;

  for (const item of azaProducts) {
    try {
      const uniqueId = item.uniqueId || Math.random().toString(36).substring(7);
      const designer = (item.designerName || 'Aza Designer').trim();
      const title = (item.title || 'Designer Ensemble').trim();
      const fullName = `${designer} ${title}`;
      const slug = `aza-${slugify(designer)}-${slugify(title)}-${uniqueId}`.slice(0, 100);

      // High-res gallery images
      const images = Array.isArray(item.imageUrl) && item.imageUrl.length > 0
        ? item.imageUrl
        : ['/images/dress/placeholder.jpg'];
      const primaryImage = images[0];

      // Prices & discount
      const origPrice = Number(item.priceRow || item.price || 14999);
      const sellPrice = Number(item.sellingPrice || item.sellingPriceRow || origPrice);
      const discountPrice = sellPrice < origPrice ? sellPrice : null;

      // Extract colors & sizes
      const colors = extractColors(`${title} ${designer}`);
      const sizes = extractSizes(item.sizeActTokenUsa, catDef.category);

      const description = `${title} by luxury designer ${designer}. Features fine craftsmanship, premium fabric textures, and signature artisanal finishes crafted for special celebrations and weddings.`;

      const productPayload = {
        name: fullName,
        slug,
        description,
        price: origPrice,
        discountPrice,
        image: primaryImage,
        images: JSON.stringify(images),
        category: catDef.category,
        subcategory: catDef.subcategory,
        silhouette: catDef.silhouette,
        dressType: catDef.dressType,
        brandName: designer,
        sizes: JSON.stringify(sizes),
        colors: JSON.stringify(colors),
        stock: 25,
        approvalStatus: 'APPROVED',
        readyToShip: item.rts === 'true' || item.rtsUsa === 'true' || true,
        deliveryDays: item.rts === 'true' ? 3 : 7,
      };

      await prisma.product.upsert({
        where: { slug },
        update: productPayload,
        create: productPayload
      });

      importedCount++;
      process.stdout.write(`✓ [${importedCount}/${azaProducts.length}] ${fullName.slice(0, 45)}...\r`);
    } catch (e) {
      console.error(`\nFailed to upsert product:`, e.message);
    }
  }

  console.log(`\nCategory [${catDef.name}] Page ${page} Completed: ${importedCount} products successfully imported/mapped!`);
  return importedCount;
}

async function main() {
  const args = process.argv.slice(2);
  const targetCategoryArg = args.find(a => a.startsWith('--category='))?.split('=')[1];
  const maxPages = Number(args.find(a => a.startsWith('--pages='))?.split('=')[1] || 1);

  console.log(`Starting Aza Fashions Page-by-Page Product & Image Importer`);
  console.log(`Total Configured Categories: ${AZA_CATEGORY_MAP.length}`);
  console.log(`Max Pages per Category: ${maxPages}`);

  let totalImported = 0;
  const categoriesToRun = targetCategoryArg
    ? AZA_CATEGORY_MAP.filter(c => c.name.toLowerCase().includes(targetCategoryArg.toLowerCase()) || c.category.toLowerCase().includes(targetCategoryArg.toLowerCase()))
    : AZA_CATEGORY_MAP;

  for (const catDef of categoriesToRun) {
    for (let page = 1; page <= maxPages; page++) {
      const count = await importCategoryPage(catDef, page);
      totalImported += count;
    }
  }

  console.log(`\n======================================================`);
  console.log(`IMPORT COMPLETE: Successfully imported ${totalImported} products with all high-resolution images!`);
  console.log(`======================================================`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
