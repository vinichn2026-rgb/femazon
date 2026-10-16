const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/HP/Desktop/femazon-project/feamzon-v1/feamzon-v1/femazon';
const dressDir = path.join(rootDir, 'assets/Dress').replace(/\\/g, '/');
const publicDressDir = path.join(rootDir, 'public/images/dress').replace(/\\/g, '/');
const outputFile = path.join(rootDir, 'src/data/dressImages.ts').replace(/\\/g, '/');
const assetsImagesFile = path.join(rootDir, 'src/assets/images.ts').replace(/\\/g, '/');

// Western wear subcategories identified in dataset
const westernSubcats = [
  'Cocktail & Party Nights', 'Cocktail Dresses', 'Evening Gowns',
  'Festive Puja Wear', 'Midi & Maxi Dresses', 'Modern Farewell & Soiree', 'Reception Glamour'
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const full = path.join(dir, item.name).replace(/\\/g, '/');
    if (item.isDirectory()) {
      results = results.concat(walk(full));
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(item.name)) {
      results.push(full);
    }
  }
  return results;
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function toCamelCase(str) {
  return str
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

const allImages = walk(dressDir);
console.log(`Found ${allImages.length} images in assets/Dress`);

// Group images with metadata
const items = allImages.map(fullPath => {
  let category = 'Other';
  let subcategory = 'General';
  
  if (fullPath.includes('Kurta Sets')) {
    category = 'Kurta Sets';
    const m = fullPath.match(/kurtas\/([^/]+)/);
    subcategory = m ? m[1] : 'General';
  } else if (fullPath.includes('Saree and other')) {
    const m = fullPath.match(/Sarees and Leghangas\/([^/]+)/);
    subcategory = m ? m[1] : 'General';
    category = westernSubcats.includes(subcategory) ? 'Western Wear' : 'Sarees';
  } else if (fullPath.includes('/Leghanga/')) {
    category = 'Lehengas';
    const m = fullPath.match(/\/Leghanga\/([^/]+)/);
    subcategory = m ? m[1] : 'General';
  }

  const fileName = path.basename(fullPath);
  const catSlug = slugify(category);
  const subcatSlug = slugify(subcategory);
  
  // Public destination path
  const publicRelPath = `/images/dress/${catSlug}/${subcatSlug}/${fileName}`;
  const publicDestDir = path.join(publicDressDir, catSlug, subcatSlug);
  const publicDestFile = path.join(publicDestDir, fileName);

  // Base identifier
  const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/_\d{10,}/, '').replace(/[…\.]/g, '');
  const idPrefix = toCamelCase(`${category} ${subcategory}`);
  const idSuffix = toCamelCase(baseName);
  let identifier = `${idPrefix}_${idSuffix}`;
  if (!/^[a-zA-Z_$]/.test(identifier)) {
    identifier = `img_${identifier}`;
  }

  return {
    fullPath,
    category,
    subcategory,
    catSlug,
    subcatSlug,
    fileName,
    publicRelPath,
    publicDestDir,
    publicDestFile,
    identifier
  };
});

// Ensure unique identifiers
const usedIds = new Set();
items.forEach(item => {
  let id = item.identifier;
  let counter = 2;
  while (usedIds.has(id)) {
    id = `${item.identifier}_${counter}`;
    counter++;
  }
  usedIds.add(id);
  item.identifier = id;
});

// 1. Copy all images to public/images/dress/...
let copyCount = 0;
items.forEach(item => {
  if (!fs.existsSync(item.publicDestDir)) {
    fs.mkdirSync(item.publicDestDir, { recursive: true });
  }
  fs.copyFileSync(item.fullPath, item.publicDestFile);
  copyCount++;
});
console.log(`Copied ${copyCount} images to ${publicDressDir}`);

// 2. Generate Universal TypeScript file
const categories = ['Kurta Sets', 'Lehengas', 'Sarees', 'Western Wear'];
const catKeys = {
  'Kurta Sets': 'kurtaSets',
  'Lehengas': 'lehengas',
  'Sarees': 'sarees',
  'Western Wear': 'westernWear'
};

let tsCode = `/**
 * AUTO-GENERATED DRESS IMAGES REGISTRY
 * All images sourced from assets/Dress folder
 * Total Images: ${items.length}
 * Compatible with Next.js, Node.js scripts, Prisma, and standard <img> tags
 */

export interface DressImageItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  src: string;
  publicUrl: string;
}

// ==========================================
// 1. INDIVIDUAL IMAGE URL EXPORTS
// ==========================================
`;

items.forEach(item => {
  tsCode += `export const ${item.identifier} = "${item.publicRelPath}";\n`;
});

tsCode += `\n// ==========================================
// 2. ALL IMAGES ARRAY
// ==========================================
export const ALL_DRESS_IMAGES: DressImageItem[] = [
`;

items.forEach(item => {
  const cleanName = item.fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/_\d{10,}/, '')
    .replace(/[…_]/g, ' ')
    .trim();
  tsCode += `  {
    id: "${item.identifier}",
    name: "${cleanName}",
    category: "${item.category}",
    subcategory: "${item.subcategory}",
    src: ${item.identifier},
    publicUrl: "${item.publicRelPath}"
  },\n`;
});

tsCode += `];\n\n`;

// Group by category and subcategory
tsCode += `// ==========================================
// 3. GROUPED BY CATEGORY & SUBCATEGORY
// ==========================================
export const dressImages = {\n`;

categories.forEach(cat => {
  const catKey = catKeys[cat];
  tsCode += `  ${catKey}: {\n`;
  const catItems = items.filter(i => i.category === cat);
  const subcats = Array.from(new Set(catItems.map(i => i.subcategory)));
  
  subcats.forEach(sub => {
    const subKey = toCamelCase(sub);
    const subItems = catItems.filter(i => i.subcategory === sub);
    tsCode += `    /** ${sub} (${subItems.length} images) */\n`;
    tsCode += `    ${subKey}: [\n`;
    subItems.forEach(i => {
      tsCode += `      ${i.identifier},\n`;
    });
    tsCode += `    ],\n`;
  });
  tsCode += `  },\n`;
});

tsCode += `};\n\n`;

// Public URL maps for easy use
tsCode += `// Alias for convenience
export const dressPublicUrls = dressImages;

// Category shortcuts
export const kurtaSetImages = dressImages.kurtaSets;
export const lehengaImages = dressImages.lehengas;
export const sareeImages = dressImages.sarees;
export const westernDressImages = dressImages.westernWear;

// ==========================================
// 4. HELPER FUNCTIONS
// ==========================================
export function getDressImagesBySubcategory(subcategoryName: string): DressImageItem[] {
  const query = subcategoryName.toLowerCase().trim();
  return ALL_DRESS_IMAGES.filter(
    item => item.subcategory.toLowerCase() === query || 
            item.subcategory.toLowerCase().includes(query)
  );
}

export function getDressImagesByCategory(categoryName: string): DressImageItem[] {
  const query = categoryName.toLowerCase().trim();
  return ALL_DRESS_IMAGES.filter(
    item => item.category.toLowerCase() === query || 
            item.category.toLowerCase().includes(query)
  );
}

export function getDressImageUrlsBySubcategory(subcategoryName: string): string[] {
  return getDressImagesBySubcategory(subcategoryName).map(item => item.publicUrl);
}

export default dressImages;
`;

// Ensure src/data exists
const dataDir = path.dirname(outputFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
fs.writeFileSync(outputFile, tsCode, 'utf8');
console.log(`Generated ${outputFile}`);

// Ensure src/assets exists and write src/assets/images.ts re-exporting dressImages
const assetsDir = path.dirname(assetsImagesFile);
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const assetsImagesCode = `/**
 * Central Images Export
 * Re-exports all dress images, nagla fashion shop products, and helper methods
 */

export * from '@/data/dressImages';
export * from '@/data/naglaFashionShop';
export { default } from '@/data/dressImages';
`;

fs.writeFileSync(assetsImagesFile, assetsImagesCode, 'utf8');
console.log(`Generated ${assetsImagesFile}`);
