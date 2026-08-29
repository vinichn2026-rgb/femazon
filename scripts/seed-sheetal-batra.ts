import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

export async function seedSheetalBatra() {
  console.log("Seeding Sheetal Batra Orange Chanderi Silk Umaira Embroidered Long Kurta Salwar Set...");

  const productData = {
    name: "Sheetal Batra - Orange Chanderi Silk Umaira Embroidered Long Kurta Salwar Set",
    slug: "sheetal-batra-umaira-embroidered-long-kurta-salwar-set",
    category: "Ethnic",
    subcategory: "Kurta Sets",
    dressType: "Kurta Sets",
    occasion: "Wedding",
    price: 75000,
    discountPrice: 62000,
    stock: 15,
    sizes: ["3XS", "XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "6XL", "Custom Fit"],
    colors: ["Sunset Orange", "Amber Gold", "Emerald Green", "Royal Wine"],
    description: "The Umaira Kurta Set by designer Sheetal Batra is impeccably tailored in pure Orange Chanderi Silk and Satin, highlighted with intricate Kashmiri Tilla embroidery, handcrafted Zardozi borders, and delicate traditional floral motifs. Complete with a pleated salwar and a sheer hand-embroidered organza dupatta.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=1000&q=85&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572804013309-82a891485787?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550614000-4b95dd5e83ec?w=1000&q=85&auto=format&fit=crop"
    ]
  };

  await prisma.product.upsert({
    where: { slug: productData.slug },
    update: {
      name: productData.name,
      category: productData.category,
      subcategory: productData.subcategory,
      dressType: productData.dressType,
      occasion: productData.occasion,
      price: productData.price,
      discountPrice: productData.discountPrice,
      stock: productData.stock,
      sizes: JSON.stringify(productData.sizes),
      colors: JSON.stringify(productData.colors),
      description: productData.description,
      image: productData.image,
      images: JSON.stringify(productData.images),
      approvalStatus: "APPROVED"
    },
    create: {
      name: productData.name,
      slug: productData.slug,
      category: productData.category,
      subcategory: productData.subcategory,
      dressType: productData.dressType,
      occasion: productData.occasion,
      price: productData.price,
      discountPrice: productData.discountPrice,
      stock: productData.stock,
      sizes: JSON.stringify(productData.sizes),
      colors: JSON.stringify(productData.colors),
      description: productData.description,
      image: productData.image,
      images: JSON.stringify(productData.images),
      approvalStatus: "APPROVED"
    }
  });

  console.log("Sheetal Batra product updated with 8 high-res editorial images!");
}

seedSheetalBatra()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
