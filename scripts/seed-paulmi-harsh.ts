import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

export async function seedPaulmiHarsh() {
  console.log("Seeding Paulmi and Harsh Laverna Kurta & Pant Set...");

  const productData = {
    name: "Paulmi and Harsh - Laverna Floral Printed & Embroidered Kurta and Pant Set",
    slug: "paulmi-and-harsh-laverna-kurta-and-pant-set",
    category: "Ethnic",
    subcategory: "Kurta Sets",
    dressType: "Kurta Sets",
    occasion: "Casual",
    price: 28800,
    discountPrice: 24500,
    stock: 18,
    sizes: ["3XS", "XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "Custom Fit"],
    colors: ["Sage Blossom", "Pastel Lavender", "Ivory Rose", "Sunset Peach"],
    description: "The Laverna Kurta Set by Paulmi and Harsh is an ethereal blend of hand-drawn botanical flora and delicate Zardozi embroidery. Tailored in pure Chanderi silk with organza insert sleeves, it pairs seamlessly with slim-fit silk trousers and a printed organza dupatta.",
    image: "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=1000&q=85&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572804013309-82a891485787?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1000&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=1000&q=85&auto=format&fit=crop"
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

  console.log("Paulmi & Harsh Laverna Kurta Set seeded successfully!");
}

seedPaulmiHarsh()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
