const fs = require('fs');

let code = fs.readFileSync('src/components/layout/SiteLayout.tsx', 'utf8');
code = code.replace(/\r\n/g, '\n');

// 1. Remove AI WARDROBE and add WOMEN'S WEAR in mainNavLinks
const oldMainNav = `const mainNavLinks = [
  { name: 'EXPLORE', hasMega: false, href: '/' },
  { name: 'SHOP', hasMega: false, href: '/shop' },
  { name: 'CURATED', hasMega: false, href: '/curated' },
  { name: 'SERVICES', hasMega: true, href: '/services' },
  { name: 'AI WARDROBE', hasMega: false, href: '/ai-wardrobe' },
];`;

const newMainNav = `const mainNavLinks = [
  { name: 'HOME', hasMega: false, href: '/' },
  { name: "WOMEN'S WEAR", hasMega: true, href: '/womens-wear' },
  { name: 'SHOP', hasMega: true, href: '/shop' },
  { name: 'SERVICES', hasMega: true, href: '/services' },
  { name: 'CURATED', hasMega: false, href: '/curated' },
];`;

if (code.includes(oldMainNav)) {
  code = code.replace(oldMainNav, newMainNav);
  console.log('[OK] Updated mainNavLinks (removed AI Wardrobe, added Womens Wear)');
} else {
  console.log('[WARN] oldMainNav not matched');
}

// 2. Add Women's Wear mega menu to CATEGORY_MEGA_MENUS
const womensWearMega = `  "Women's Wear": {
    columns: [
      {
        title: "ETHNIC & HERITAGE",
        items: [
          { label: "Sarees (Silk & Organza)", href: "/womens-wear?category=Sarees" },
          { label: "Kurtis & Chikankari", href: "/womens-wear?category=Kurtis" },
          { label: "Salwar Suits & Shararas", href: "/womens-wear?category=Salwar+Suits" },
          { label: "Bridal & Festive Lehengas", href: "/womens-wear?category=Lehengas" },
          { label: "Designer Saree Blouses", href: "/womens-wear?category=Blouses" },
        ],
      },
      {
        title: "WESTERN & DAILY LUXURY",
        items: [
          { label: "Western Wear & Blazers", href: "/womens-wear?category=Western+Wear" },
          { label: "Maxi & Party Dresses", href: "/womens-wear?category=Dresses" },
          { label: "Tops & Silk Shirts", href: "/womens-wear?category=Tops" },
          { label: "Co-ord Sets (Linen & Silk)", href: "/womens-wear?category=Co-ord+Sets" },
          { label: "Bottom Wear & Palazzos", href: "/womens-wear?category=Bottom+Wear" },
        ],
      },
      {
        title: "SPECIALITY & INCLUSIVE",
        items: [
          { label: "Plus Size Fashion (2XL-6XL)", href: "/womens-wear?category=Plus+Size+Fashion" },
          { label: "Maternity & Nursing Wear", href: "/womens-wear?category=Maternity+Wear" },
          { label: "Mulberry Silk Nightwear", href: "/womens-wear?category=Nightwear" },
          { label: "Seamless Activewear", href: "/womens-wear?category=Activewear" },
          { label: "View All 14 Categories →", href: "/womens-wear" },
        ],
      },
    ],
    cards: [
      {
        title: "Handloom Sarees",
        subtitle: "Pure Zari Weaves",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=600",
        href: "/womens-wear?category=Sarees",
      },
      {
        title: "Designer Kurtis",
        subtitle: "Chikankari Handwork",
        image: "https://images.unsplash.com/photo-1583391733958-65e2be10c3fb?auto=format&fit=crop&q=85&w=600",
        href: "/womens-wear?category=Kurtis",
      },
      {
        title: "Linen Co-ords",
        subtitle: "Effortless Silhouettes",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=85&w=600",
        href: "/womens-wear?category=Co-ord+Sets",
      },
      {
        title: "Curve & Plus Size",
        subtitle: "Flattering 2XL to 6XL",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=85&w=600",
        href: "/womens-wear?category=Plus+Size+Fashion",
      },
    ],
  },
`;

const needle = 'export const CATEGORY_MEGA_MENUS: Record<string, CategoryMenuData> = {\n';
if (code.includes(needle) && !code.includes('"Women\'s Wear":')) {
  code = code.replace(needle, needle + womensWearMega);
  console.log('[OK] Added Women\'s Wear mega menu');
}

// 3. Update SUB_NAV_ITEMS to feature Women's Wear
const oldSubNav = `export const SUB_NAV_ITEMS = [
  "New",
  "Kurta Sets",
  "Lehengas",
  "Sarees",
  "Ready To Ship",
  "Wedding",
  "Indo-Western",
  "Western Wear",
  "Dresses",
  "Femazon Services",
  "On Sale"
];`;

const newSubNav = `export const SUB_NAV_ITEMS = [
  "Women's Wear",
  "Sarees",
  "Kurta Sets",
  "Lehengas",
  "Western Wear",
  "Dresses",
  "Co-ord Sets",
  "Ready To Ship",
  "Wedding",
  "Femazon Services"
];`;

if (code.includes(oldSubNav)) {
  code = code.replace(oldSubNav, newSubNav);
  console.log('[OK] Updated SUB_NAV_ITEMS with Women\'s Wear');
}

// 4. Update the href mapping in Tier 2 category nav
const oldHrefLogic = `              const href = isVton
                ? '/virtual-try-on'
                : isServices
                ? '/services'
                : isSale
                ? '/shop?onSale=true'
                : \`/shop?category=\${encodeURIComponent(item)}\`;`;

const newHrefLogic = `              const href = item === "Women's Wear"
                ? '/womens-wear'
                : isVton
                ? '/virtual-try-on'
                : isServices
                ? '/services'
                : isSale
                ? '/shop?onSale=true'
                : \`/womens-wear?category=\${encodeURIComponent(item)}\`;`;

if (code.includes(oldHrefLogic)) {
  code = code.replace(oldHrefLogic, newHrefLogic);
  console.log('[OK] Updated Tier 2 nav href logic');
}

fs.writeFileSync('src/components/layout/SiteLayout.tsx', code, 'utf8');
console.log('SiteLayout.tsx updated successfully.');
