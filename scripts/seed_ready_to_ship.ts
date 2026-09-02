import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Seeding Ready to Ship products...');

  const baseProducts = [
    { name: "Ready to Ship Georgette Anarkali", category: "Ethnic", subcategory: "Anarkali Suits", price: 2999 },
    { name: "Express Shipping Cotton Kurta", category: "Ethnic", subcategory: "Kurtis", price: 1299 },
    { name: "Same Day Dispatch Lehenga", category: "Ethnic", subcategory: "Lehenga", price: 5499 },
    { name: "Quick Deliver Floral Dress", category: "Dresses", subcategory: "Midi Dresses", price: 1899 },
    { name: "Fast Track Co-ord Set", category: "Co-ords", subcategory: "Co-ords", price: 2199 },
    { name: "Ready Stock Banarasi Saree", category: "Ethnic", subcategory: "Sarees", price: 4500 },
    { name: "Express Delivery Maxi Dress", category: "Dresses", subcategory: "Maxi Dresses", price: 3200 },
    { name: "In Stock Formal Trousers", category: "Co-ords", subcategory: "Pants", price: 1599 },
    { name: "Ready to Dispatch Satin Top", category: "Tops", subcategory: "Tops", price: 899 },
    { name: "Next Day Dispatch Palazzo", category: "Ethnic", subcategory: "Pants", price: 1100 },
    { name: "Fast Shipping Silk Dupatta", category: "Accessories", subcategory: "Scarves", price: 600 },
    { name: "Immediate Ship Choker Set", category: "Accessories", subcategory: "Jewellery", price: 1250 },
    { name: "Ready to Wear Patiala Suit", category: "Ethnic", subcategory: "Punjabi Suit", price: 2799 },
    { name: "Quick Ship Tunic", category: "Tops", subcategory: "Tops", price: 999 },
    { name: "Ready Stock Kurta Palazzo", category: "Ethnic", subcategory: "Kurta Palazzo Set", price: 3499 },
    { name: "Express Ship Wrap Dress", category: "Dresses", subcategory: "Midi Dresses", price: 2299 },
    { name: "In Stock Casual Shirt", category: "Tops", subcategory: "Crop Tops", price: 1499 },
    { name: "Ready Dispatch Denim Kurti", category: "Ethnic", subcategory: "Kurtis", price: 1799 },
    { name: "Same Day Ship Wide Leg Pants", category: "Co-ords", subcategory: "Pants", price: 1899 },
    { name: "Fast Track Velvet Gown", category: "Dresses", subcategory: "Midi Dresses", price: 4299 }
  ];

  for (let i = 0; i < baseProducts.length; i++) {
    const p = baseProducts[i];
    const slug = p.name.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
    
    await prisma.product.create({
      data: {
        name: p.name,
        slug: slug,
        price: p.price,
        discountPrice: Math.floor(p.price * 0.8), // 20% discount
        category: p.category,
        subcategory: p.subcategory,
        stock: 50,
        approvalStatus: "APPROVED",
        readyToShip: true,
        deliveryDays: Math.floor(Math.random() * 3) + 1, // 1 to 3 days
        image: "https://images.unsplash.com/photo-1583391733958-d20531e115fa?q=80&w=800&auto=format&fit=crop",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1583391733958-d20531e115fa?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop"
        ]),
        sizes: JSON.stringify(["S", "M", "L"]),
        colors: JSON.stringify(["Red", "Black", "White"])
      }
    });
  }

  console.log('Successfully seeded 20 Ready to Ship products.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
