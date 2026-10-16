import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

export const ACCESSORY_CATEGORY_PRODUCTS = [
  {
    name: 'Classic Quilted Leather Shoulder Bag',
    slug: 'classic-quilted-leather-shoulder-bag',
    description: 'Timeless quilted Italian leather shoulder bag with gold-tone chain strap and turn-lock closure. Perfect for day-to-evening elegance.',
    price: 4999,
    discountPrice: 3499,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop'
    ]),
    category: 'Handbags',
    subcategory: 'Shoulder Bags',
    dressType: 'Handbag',
    silhouette: 'Handbag',
    stock: 25,
    sizes: JSON.stringify(['One Size']),
    colors: JSON.stringify(['Black', 'Gold', 'Beige']),
    approvalStatus: 'APPROVED',
    readyToShip: true,
    brandName: 'Femazon Luxe',
  },
  {
    name: 'Structured Top-Handle Leather Tote',
    slug: 'structured-top-handle-leather-tote',
    description: 'Polished structured tote bag in genuine saffiano leather with detachable crossbody strap and spacious interior compartments.',
    price: 5499,
    discountPrice: 3999,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'
    ]),
    category: 'Handbags',
    subcategory: 'Totes',
    dressType: 'Handbag',
    silhouette: 'Handbag',
    stock: 30,
    sizes: JSON.stringify(['One Size']),
    colors: JSON.stringify(['Tan Brown', 'Black', 'Burgundy']),
    approvalStatus: 'APPROVED',
    readyToShip: true,
    brandName: 'Femazon Luxe',
  },
  {
    name: 'Artisanal Zari Embroidered Silk Potli',
    slug: 'artisanal-zari-embroidered-silk-potli',
    description: 'Heritage hand-embroidered raw silk potli bag adorned with pearl tassels, drawstring closure, and intricate zari floral motifs for wedding ensembles.',
    price: 2499,
    discountPrice: 1799,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop',
      '/categories/potlis.jpg'
    ]),
    category: 'Potlis',
    subcategory: 'Bridal Potlis',
    dressType: 'Potli',
    silhouette: 'Potli',
    stock: 40,
    sizes: JSON.stringify(['One Size']),
    colors: JSON.stringify(['Maroon', 'Gold', 'Emerald Green']),
    approvalStatus: 'APPROVED',
    readyToShip: true,
    brandName: 'Femazon Heritage',
  },
  {
    name: 'Embellished Minaudière Evening Clutch',
    slug: 'embellished-minaudiere-evening-clutch',
    description: 'Dazzling stone-studded crystal clutch minaudière with detachable metallic snake chain. The quintessential reception companion.',
    price: 3899,
    discountPrice: 2899,
    image: 'https://images.unsplash.com/photo-1566150902887-9679ec158ba6?q=80&w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1566150902887-9679ec158ba6?q=80&w=800&auto=format&fit=crop'
    ]),
    category: 'Handbags',
    subcategory: 'Clutches',
    dressType: 'Handbag',
    silhouette: 'Handbag',
    stock: 20,
    sizes: JSON.stringify(['One Size']),
    colors: JSON.stringify(['Champagne Gold', 'Silver']),
    approvalStatus: 'APPROVED',
    readyToShip: true,
    brandName: 'Femazon Luxe',
  },
  {
    name: 'Handcrafted Velvet Zardozi Bridal Potli',
    slug: 'handcrafted-velvet-zardozi-bridal-potli',
    description: 'Royal velvet bridal potli with antique dabka and zardozi needlework, finished with handmade latkan tassels.',
    price: 2999,
    discountPrice: 2199,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop'
    ]),
    category: 'Potlis',
    subcategory: 'Bridal Potlis',
    dressType: 'Potli',
    silhouette: 'Potli',
    stock: 35,
    sizes: JSON.stringify(['One Size']),
    colors: JSON.stringify(['Crimson Red', 'Navy Blue']),
    approvalStatus: 'APPROVED',
    readyToShip: true,
    brandName: 'Femazon Heritage',
  },
  {
    name: 'Minimalist Woven Crossbody Saddle Bag',
    slug: 'minimalist-woven-crossbody-saddle-bag',
    description: 'Contemporary vegan leather saddle bag with woven front flap, adjustable shoulder strap, and magnetic snap button.',
    price: 2799,
    discountPrice: 1999,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'
    ]),
    category: 'Handbags',
    subcategory: 'Crossbody Bags',
    dressType: 'Handbag',
    silhouette: 'Handbag',
    stock: 28,
    sizes: JSON.stringify(['One Size']),
    colors: JSON.stringify(['Caramel Brown', 'Ivory White']),
    approvalStatus: 'APPROVED',
    readyToShip: true,
    brandName: 'Femazon Luxe',
  },
  {
    name: 'Hand-Embroidered Zari Raw Silk Shawl',
    slug: 'hand-embroidered-zari-raw-silk-shawl',
    description: 'Pure Pashmina feel luxurious raw silk shawl featuring delicate aari floral embroidery along the borders.',
    price: 3499,
    discountPrice: 2499,
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop'
    ]),
    category: 'Shawls',
    subcategory: 'Silk Shawls',
    dressType: 'Shawl',
    silhouette: 'Shawl',
    stock: 25,
    sizes: JSON.stringify(['Free Size']),
    colors: JSON.stringify(['Maroon', 'Black', 'Emerald']),
    approvalStatus: 'APPROVED',
    readyToShip: true,
    brandName: 'Femazon Heritage',
  },
  {
    name: 'Kashmiri Jamawar Woven Woolen Shawl',
    slug: 'kashmiri-jamawar-woven-woolen-shawl',
    description: 'Authentic all-over Kashmiri Jamawar paisley design fine wool shawl for regal winter weddings.',
    price: 4999,
    discountPrice: 3899,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop'
    ]),
    category: 'Shawls',
    subcategory: 'Jamawar Shawls',
    dressType: 'Shawl',
    silhouette: 'Shawl',
    stock: 20,
    sizes: JSON.stringify(['Free Size']),
    colors: JSON.stringify(['Multicolor', 'Crimson']),
    approvalStatus: 'APPROVED',
    readyToShip: true,
    brandName: 'Femazon Heritage',
  },
  {
    name: 'Handcrafted Zardozi Embroidered Bridal Juttis',
    slug: 'handcrafted-zardozi-embroidered-bridal-juttis',
    description: 'Pure leather cushioned sole Punjabi juttis embellished with real dabka, pearls, and gold sequins.',
    price: 2499,
    discountPrice: 1799,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'
    ]),
    category: 'Footwear',
    subcategory: 'Juttis',
    dressType: 'Footwear',
    silhouette: 'Footwear',
    stock: 45,
    sizes: JSON.stringify(['36', '37', '38', '39', '40']),
    colors: JSON.stringify(['Gold', 'Champagne', 'Maroon']),
    approvalStatus: 'APPROVED',
    readyToShip: true,
    brandName: 'Femazon Heritage',
  },
  {
    name: 'Gold Embellished Stiletto Kolhapuris',
    slug: 'gold-embellished-stiletto-kolhapuris',
    description: 'Designer high heel block Kolhapuri sandals with metallic braided straps and comfortable memory foam insole.',
    price: 2999,
    discountPrice: 2199,
    image: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop'
    ]),
    category: 'Footwear',
    subcategory: 'Heels',
    dressType: 'Footwear',
    silhouette: 'Footwear',
    stock: 30,
    sizes: JSON.stringify(['36', '37', '38', '39', '40']),
    colors: JSON.stringify(['Rose Gold', 'Metallic Gold']),
    approvalStatus: 'APPROVED',
    readyToShip: true,
    brandName: 'Femazon Luxe',
  },
  {
    name: 'Handmade Pearl & Crystal Bridal Sheeshpatti',
    slug: 'handmade-pearl-crystal-bridal-sheeshpatti',
    description: 'Regal bridal headband hair accessory adorned with freshwater pearls, kundan florets, and gold-plated wirework.',
    price: 1899,
    discountPrice: 1299,
    image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=800&auto=format&fit=crop'
    ]),
    category: 'Hair Accessories',
    subcategory: 'Headbands',
    dressType: 'Hair Accessory',
    silhouette: 'Hair Accessory',
    stock: 40,
    sizes: JSON.stringify(['Free Size']),
    colors: JSON.stringify(['Gold', 'Pearl White']),
    approvalStatus: 'APPROVED',
    readyToShip: true,
    brandName: 'Femazon Heritage',
  },
  {
    name: 'Pure Mulberry Silk Printed Stole',
    slug: 'pure-mulberry-silk-printed-stole',
    description: 'Featherweight 100% mulberry silk designer printed scarf with rolled hand-stitched hem.',
    price: 1699,
    discountPrice: 1199,
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop'
    ]),
    category: 'Stoles & Scarves',
    subcategory: 'Silk Scarves',
    dressType: 'Stole',
    silhouette: 'Stole',
    stock: 35,
    sizes: JSON.stringify(['Free Size']),
    colors: JSON.stringify(['Teal Floral', 'Blush Pastel']),
    approvalStatus: 'APPROVED',
    readyToShip: true,
    brandName: 'Femazon Luxe',
  },
  {
    name: 'Embellished Metallic Saree Belt (Kamarbandh)',
    slug: 'embellished-metallic-saree-belt-kamarbandh',
    description: 'Contemporary adjustable metallic waist belt with kundan and crystal detailing, crafted to cinch sarees and lehengas.',
    price: 1499,
    discountPrice: 999,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'
    ]),
    category: 'Belts',
    subcategory: 'Waist Belts',
    dressType: 'Belt',
    silhouette: 'Belt',
    stock: 50,
    sizes: JSON.stringify(['Free Size']),
    colors: JSON.stringify(['Gold', 'Silver']),
    approvalStatus: 'APPROVED',
    readyToShip: true,
    brandName: 'Femazon Heritage',
  }
];

async function main() {
  console.log('Seeding accessory category products...');
  for (const item of ACCESSORY_CATEGORY_PRODUCTS) {
    const existing = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (!existing) {
      await prisma.product.create({ data: item });
      console.log('Created:', item.name, '->', item.category);
    } else {
      await prisma.product.update({
        where: { slug: item.slug },
        data: item
      });
      console.log('Updated:', item.name, '->', item.category);
    }
  }
  console.log('Finished seeding!');
}

main().catch(console.error);
