const fs = require('fs');

// 1. Update ShopClient.tsx
let shopCode = fs.readFileSync('src/components/shop/ShopClient.tsx', 'utf8');
shopCode = shopCode.replace(/\r\n/g, '\n');

const oldCats = `const CATEGORIES = [
  "All",
  "Kurta Sets",
  "Lehengas",
  "Sarees",
  "Wedding",
  "Dresses",
  "Gowns",
  "Handbags",
  "Potlis",
  "Footwear",
  "Shawls",
  "Hair Accessories",
  "Stoles & Scarves",
  "Belts",
  "Indo-Western",
  "Western Wear",
  "Co-ord Sets",
  "Kaftans",
  "Tops",
  "Femazon Exclusive",
  "On Sale",
  "New Arrivals"
];`;

const newCats = `const CATEGORIES = [
  "All",
  "Sarees",
  "Kurtis",
  "Salwar Suits",
  "Lehengas",
  "Western Wear",
  "Dresses",
  "Tops",
  "Co-ord Sets",
  "Blouses",
  "Bottom Wear",
  "Nightwear",
  "Maternity Wear",
  "Plus Size Fashion",
  "Activewear",
  "Kurta Sets",
  "Gowns",
  "Footwear",
  "Handbags",
  "Potlis",
  "Jewellery",
  "Accessories"
];`;

if (shopCode.includes(oldCats)) {
  shopCode = shopCode.replace(oldCats, newCats);
  fs.writeFileSync('src/components/shop/ShopClient.tsx', shopCode, 'utf8');
  console.log('[OK] Updated src/components/shop/ShopClient.tsx');
} else {
  console.log('[WARN] Old categories block not found in ShopClient.tsx');
}

// 2. Update VendorDashboardClient.tsx category dropdown
let vendorCode = fs.readFileSync('src/components/vendor/VendorDashboardClient.tsx', 'utf8');
vendorCode = vendorCode.replace(/\r\n/g, '\n');

const oldVendorSelect = `<select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-[#FAF7F5] rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4A1513]"
                          >
                            <option value="Chudithar & Suits">Chudithar & Suits</option>
                            <option value="Dresses">Dresses</option>
                            <option value="Ethnic">Ethnic & Sarees</option>
                            <option value="Wedding & Party">Wedding & Party</option>
                            <option value="Western Wear">Western Wear</option>
                            <option value="Footwear">Footwear</option>
                          </select>`;

const newVendorSelect = `<select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-[#FAF7F5] rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4A1513]"
                          >
                            <option value="Sarees">Sarees</option>
                            <option value="Kurtis">Kurtis</option>
                            <option value="Salwar Suits">Salwar Suits</option>
                            <option value="Lehengas">Lehengas</option>
                            <option value="Western Wear">Western Wear</option>
                            <option value="Dresses">Dresses</option>
                            <option value="Tops">Tops</option>
                            <option value="Co-ord Sets">Co-ord Sets</option>
                            <option value="Blouses">Blouses</option>
                            <option value="Bottom Wear">Bottom Wear</option>
                            <option value="Nightwear">Nightwear</option>
                            <option value="Maternity Wear">Maternity Wear</option>
                            <option value="Plus Size Fashion">Plus Size Fashion</option>
                            <option value="Activewear">Activewear</option>
                            <option value="Footwear">Footwear</option>
                            <option value="Bags & Potlis">Bags & Potlis</option>
                            <option value="Jewellery & Accessories">Jewellery & Accessories</option>
                          </select>`;

if (vendorCode.includes(oldVendorSelect)) {
  vendorCode = vendorCode.replace(oldVendorSelect, newVendorSelect);
  fs.writeFileSync('src/components/vendor/VendorDashboardClient.tsx', vendorCode, 'utf8');
  console.log('[OK] Updated src/components/vendor/VendorDashboardClient.tsx');
} else {
  // Try with HTML entity &amp;
  const oldVendorSelectAmp = `<select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-[#FAF7F5] rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4A1513]"
                          >
                            <option value="Chudithar & Suits">Chudithar &amp; Suits</option>
                            <option value="Dresses">Dresses</option>
                            <option value="Ethnic">Ethnic &amp; Sarees</option>
                            <option value="Wedding & Party">Wedding &amp; Party</option>
                            <option value="Western Wear">Western Wear</option>
                            <option value="Footwear">Footwear</option>
                          </select>`;
  if (vendorCode.includes(oldVendorSelectAmp)) {
    vendorCode = vendorCode.replace(oldVendorSelectAmp, newVendorSelect);
    fs.writeFileSync('src/components/vendor/VendorDashboardClient.tsx', vendorCode, 'utf8');
    console.log('[OK] Updated src/components/vendor/VendorDashboardClient.tsx (amp match)');
  } else {
    console.log('[WARN] Old vendor select not matched in VendorDashboardClient.tsx');
  }
}
