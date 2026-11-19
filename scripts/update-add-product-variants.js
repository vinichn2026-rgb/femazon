const fs = require('fs');

let code = fs.readFileSync('src/components/vendor/AddProductWithVariants.tsx', 'utf8');
code = code.replace(/\r\n/g, '\n');

const oldMap = `const CATEGORY_MAP: Record<string, string[]> = {
  'Kurta Sets': ['Anarkali Sets', 'Sharara & Gharara Sets', 'Straight Cut Suits', 'Angrakha Ensembles', 'Palazzo Sets'],
  'Lehengas': ['Bridal Lehengas', 'Bridesmaid Lehengas', 'Fusion / Drape Lehengas', 'Velvet Lehengas'],
  'Sarees': ['Banarasi Silk Sarees', 'Kanjeevaram Sarees', 'Chanderi Sarees', 'Organza Handpainted', 'Pre-Draped Sarees'],
  'Dresses & Gowns': ['Evening Gowns', 'Cocktail Dresses', 'Maxi Dresses', 'Cape Gowns'],
  'Indo-Western': ['Drape Skirt Sets', 'Jumpsuits', 'Cape Sets', 'Tunic Sets'],
  'Co-ord Sets': ['Embroidered Co-ords', 'Silk Co-ords', 'Printed Co-ords'],
  'Ready To Ship': ['Festive Express', 'Luxury Pret', 'Immediate Dispatch Exclusive']
};`;

const newMap = `const CATEGORY_MAP: Record<string, string[]> = {
  'Sarees': ['Banarasi Silk Sarees', 'Kanjeevaram Sarees', 'Chanderi Sarees', 'Organza Handpainted', 'Pre-Draped Sarees'],
  'Kurtis': ['Anarkali Kurtis', 'Straight Cut Kurtis', 'Chikankari Handloom', 'A-Line Flared', 'Short Kurtas'],
  'Salwar Suits': ['Sharara & Gharara Sets', 'Palazzo Suit Sets', 'Pakistani Long Suits', 'Churidar Ensembles', 'Jacket Suits'],
  'Lehengas': ['Bridal Lehengas', 'Bridesmaid Lehengas', 'Fusion / Drape Lehengas', 'Velvet Lehengas', 'Pastel Sangeet'],
  'Western Wear': ['Tailored Blazers', 'Jumpsuits & Rompers', 'Pleated Trousers', 'Jackets & Shrugs', 'Statement Skirts'],
  'Dresses': ['Evening Gowns', 'Cocktail Dresses', 'Maxi Dresses', 'Midi Dresses', 'Shirt Dresses'],
  'Tops': ['Peplum Tops', 'Crop Tops', 'Silk & Satin Shirts', 'Embroidered Tunics', 'Camisoles'],
  'Co-ord Sets': ['Linen Casual Co-ords', 'Festive Embroidered Sets', 'Printed Blazer Co-ords', 'Kaftan & Pant Sets'],
  'Blouses': ['Padded Designer Blouses', 'Brocade & Raw Silk', 'Mirror & Resham Work', 'Sleeveless Sweetheart', 'Deep Back Dori'],
  'Bottom Wear': ['Flared Palazzos', 'Cigarette Trousers', 'Dhoti Pants', 'Churidar Leggings', 'Culottes'],
  'Nightwear': ['Mulberry Silk Robes', 'Cotton Pajama Sets', 'Lounge Kaftans', 'Modal Sleepshirts', 'Satin Camisole Sets'],
  'Maternity Wear': ['Nursing & Feeding Kurtis', 'Wrap Maternity Dresses', 'Bump Support Leggings', 'Maternity Kaftans'],
  'Plus Size Fashion': ['Curve Festive Kurtis (2XL-6XL)', 'Plus Size Flared Lehengas', 'Comfort Fit Co-ords', 'Maxi Wrap Dresses'],
  'Activewear': ['Seamless Tights & Leggings', 'Supportive Sports Bras', 'Yoga & Pilates Sets', 'Zip-up Running Jackets'],
  'Kurta Sets': ['Anarkali Sets', 'Sharara & Gharara Sets', 'Straight Cut Suits', 'Angrakha Ensembles', 'Palazzo Sets'],
  'Ready To Ship': ['Festive Express', 'Luxury Pret', 'Immediate Dispatch Exclusive']
};`;

if (code.includes(oldMap)) {
  code = code.replace(oldMap, newMap);
  fs.writeFileSync('src/components/vendor/AddProductWithVariants.tsx', code, 'utf8');
  console.log('[OK] Updated CATEGORY_MAP in AddProductWithVariants.tsx');
} else {
  console.log('[WARN] oldMap not found in AddProductWithVariants.tsx');
}
