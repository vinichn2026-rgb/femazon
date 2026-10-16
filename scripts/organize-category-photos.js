const fs = require('fs');
const path = require('path');

const ROOT_PUBLIC = path.join(__dirname, '..', 'public', 'images');
const DRESS_DIR = path.join(ROOT_PUBLIC, 'dress');
const TARGET_DIR = path.join(ROOT_PUBLIC, 'categories');

const MAPPINGS = [
  // 1. ANARKALI - BLUE (Explicitly asked by user!)
  {
    category: 'anarkali',
    folderName: 'anarkali-blue-1',
    srcDir: path.join(DRESS_DIR, 'kurta-sets', 'a-line-kurta-sets'),
  },
  // 2. ANARKALI - CREAM / SAMYUKTA SINGHANIA (Explicitly asked by user!)
  {
    category: 'anarkali',
    folderName: 'anarkali-cream-samyukta-1',
    srcDir: path.join(DRESS_DIR, 'kurta-sets', 'cotton-kurta-sets'),
  },
  // 3. ANARKALI - MAROON
  {
    category: 'anarkali',
    folderName: 'anarkali-maroon-1',
    srcDir: path.join(DRESS_DIR, 'kurta-sets', 'anarkali-kurta-sets'),
  },
  // 4. ANARKALI - GOLD
  {
    category: 'anarkali',
    folderName: 'anarkali-gold-1',
    srcDir: path.join(DRESS_DIR, 'kurta-sets', 'festive-kurta-sets'),
  },
  // 5. LEHENGAS - BRIDAL CRIMSON RED
  {
    category: 'lehengas',
    folderName: 'lehenga-crimson-red-1',
    srcDir: path.join(DRESS_DIR, 'lehengas', 'bridal-lehengas'),
  },
  // 6. LEHENGAS - DUSTY ROSE BRIDESMAID
  {
    category: 'lehengas',
    folderName: 'lehenga-dusty-rose-1',
    srcDir: path.join(DRESS_DIR, 'lehengas', 'bridesmaid-lehengas'),
  },
  // 7. SAREES - BRIDAL SILK
  {
    category: 'sarees',
    folderName: 'saree-bridal-silk-1',
    srcDir: path.join(DRESS_DIR, 'sarees', 'bridal-drapes'),
  },
  // 8. SAREES - CAPE JACKET
  {
    category: 'sarees',
    folderName: 'saree-cape-jacket-1',
    srcDir: path.join(DRESS_DIR, 'sarees', 'cape-jacket-sarees'),
  }
];

function assignSlots(files) {
  const result = {};
  const remaining = [...files];

  const takeMatch = (pattern) => {
    const idx = remaining.findIndex(f => pattern.test(f.toLowerCase()));
    if (idx !== -1) {
      return remaining.splice(idx, 1)[0];
    }
    return null;
  };

  // Match front
  result['front.jpg'] = takeMatch(/front|woman_wearing.*(?<!_2)\.jpe?g$/i) || remaining.shift();

  // Match back
  result['back.jpg'] = takeMatch(/back|tassel/i) || remaining.shift();

  // Match full
  result['full.jpg'] = takeMatch(/_2\.jpe?g|full|displayed|traditional/i) || remaining.shift();

  // Match detail
  result['detail.jpg'] = takeMatch(/neck|embroidery|detail|motif/i) || remaining.shift();

  return result;
}

function main() {
  console.log('--- Organizing category-based photos automatically ---');

  for (const item of MAPPINGS) {
    if (!fs.existsSync(item.srcDir)) {
      console.warn(`Source folder does not exist: ${item.srcDir}`);
      continue;
    }

    const allFiles = fs.readdirSync(item.srcDir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
    const slots = assignSlots(allFiles);

    const destDir = path.join(TARGET_DIR, item.category, item.folderName);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    console.log(`\n📁 /public/images/categories/${item.category}/${item.folderName}/`);
    for (const [slotName, originalFile] of Object.entries(slots)) {
      if (originalFile) {
        const srcPath = path.join(item.srcDir, originalFile);
        const destPath = path.join(destDir, slotName);
        fs.copyFileSync(srcPath, destPath);
        console.log(`   ├── ${slotName} (from ${originalFile})`);
      }
    }
  }

  console.log('\n--- Category structure created successfully! ---');
}

main();
