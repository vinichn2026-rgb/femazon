const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

// Products configuration with structured photos: front, back, full, detail
const PRODUCTS = [
  {
    category: 'anarkali',
    slug: 'anarkali-cream-samyukta',
    displayName: 'Samyukta Singhania - Cream Butti Pattern Anarkali Set',
    photos: {
      'front.jpg': 'https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=1000&q=85&auto=format&fit=crop',
      'back.jpg': 'https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=1000&q=85&auto=format&fit=crop',
      'full.jpg': 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1000&q=85&auto=format&fit=crop',
      'detail.jpg': 'https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=1000&q=85&auto=format&fit=crop',
    }
  },
  {
    category: 'anarkali',
    slug: 'anarkali-blue-1',
    displayName: 'Royal Indigo Silk Embroidered Anarkali Set',
    photos: {
      'front.jpg': 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&q=85&auto=format&fit=crop',
      'back.jpg': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1000&q=85&auto=format&fit=crop',
      'full.jpg': 'https://images.unsplash.com/photo-1572804013309-82a891485787?w=1000&q=85&auto=format&fit=crop',
      'detail.jpg': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&q=85&auto=format&fit=crop',
    }
  },
  {
    category: 'anarkali',
    slug: 'anarkali-maroon-1',
    displayName: 'Heritage Maroon Flared Silk Anarkali Set with Tassels',
    localSources: {
      'front.jpg': path.join(__dirname, '..', 'public', 'images', 'dress', 'kurta-sets', 'anarkali-kurta-sets', 'Woman_wearing_maroon_Anarkali_kurta_202609091540.jpeg'),
      'back.jpg': path.join(__dirname, '..', 'public', 'images', 'dress', 'kurta-sets', 'anarkali-kurta-sets', 'Maroon_silk_kurta_with_tassels_202609091540.jpeg'),
      'full.jpg': path.join(__dirname, '..', 'public', 'images', 'dress', 'kurta-sets', 'anarkali-kurta-sets', 'Woman_wearing_maroon_Anarkali_kurta_202609091540_2.jpeg'),
      'detail.jpg': path.join(__dirname, '..', 'public', 'images', 'dress', 'kurta-sets', 'anarkali-kurta-sets', 'Embroidered_silk_kurta_neck_design_202609091540.jpeg'),
    }
  },
  {
    category: 'anarkali',
    slug: 'anarkali-pink-elaya',
    displayName: 'Sheetal Batra - Elaya Embroidered Pastel Pink Anarkali Suit',
    photos: {
      'front.jpg': 'https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=1000&q=85&auto=format&fit=crop',
      'back.jpg': 'https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=1000&q=85&auto=format&fit=crop',
      'full.jpg': 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1000&q=85&auto=format&fit=crop',
      'detail.jpg': 'https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=1000&q=85&auto=format&fit=crop',
    }
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Status ${response.statusCode} for ${url}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(dest));
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('--- Setting up categorized product photos ---');

  for (const item of PRODUCTS) {
    const targetDir = path.join(BASE_DIR, item.category, item.slug);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    console.log(`\nCreated folder: ${targetDir}`);

    // If local sources exist, copy them
    if (item.localSources) {
      for (const [filename, sourcePath] of Object.entries(item.localSources)) {
        const dest = path.join(targetDir, filename);
        if (fs.existsSync(sourcePath)) {
          fs.copyFileSync(sourcePath, dest);
          console.log(`  [LOCAL COPY] -> ${filename}`);
        } else {
          console.warn(`  [MISSING LOCAL] -> ${sourcePath}`);
        }
      }
    }

    // If remote photos exist, download them
    if (item.photos) {
      for (const [filename, url] of Object.entries(item.photos)) {
        const dest = path.join(targetDir, filename);
        try {
          console.log(`  [DOWNLOADING] ${filename}...`);
          await downloadFile(url, dest);
          console.log(`  [SAVED] -> ${filename}`);
        } catch (e) {
          console.error(`  [FAILED] ${filename}:`, e.message);
        }
      }
    }
  }

  console.log('\n--- All category folders and images created successfully! ---');
}

main().catch(console.error);
