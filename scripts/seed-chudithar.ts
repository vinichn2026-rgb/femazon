import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

export const CHUDITHAR_PRODUCTS = [
  {
    name: "Chudithar - Product 1",
    category: "Chudithar",
    pattern: "A-Line Pattern",
    color: "Green",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 25,
    price: 999,
    discountPrice: 799,
    description: "Beautiful green A-line chudithar with printed design and elegant dupatta.",
    image: "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Chudithar - Product 2",
    category: "Chudithar",
    pattern: "Floral Pattern",
    color: "Pink",
    sizes: ["M", "L", "XL"],
    stock: 40,
    price: 1099,
    discountPrice: 899,
    description: "Charming pink floral pattern chudithar set crafted from soft breathable fabric.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Chudithar - Product 3",
    category: "Chudithar",
    pattern: "Printed Pattern",
    color: "Blue",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 30,
    price: 999,
    discountPrice: 749,
    description: "Vibrant royal blue printed chudithar suit tailored for traditional comfort.",
    image: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Chudithar - Product 4",
    category: "Chudithar",
    pattern: "A-Line Pattern",
    color: "Yellow",
    sizes: ["M", "L", "XL"],
    stock: 15,
    price: 999,
    discountPrice: 799,
    description: "Bright festive yellow A-line chudithar adorned with subtle border detailing.",
    image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "A-Line Kurti - Product 5",
    category: "Kurti",
    pattern: "Floral Pattern",
    color: "Purple",
    sizes: ["M", "L", "XL"],
    stock: 50,
    price: 1199,
    discountPrice: 849,
    description: "Graceful purple floral A-line kurti with lightweight comfortable silhouette.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Anarkali - Product 6",
    category: "Anarkali",
    pattern: "Printed Pattern",
    color: "Maroon",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 35,
    price: 1499,
    discountPrice: 1099,
    description: "Rich maroon printed anarkali dress with grand flared hem and matching dupatta.",
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Saree - Product 7",
    category: "Saree",
    pattern: "Woven Pattern",
    color: "Peach",
    sizes: ["Free Size"],
    stock: 20,
    price: 1999,
    discountPrice: 1499,
    description: "Elegant peach woven saree with subtle zari border and matching blouse piece.",
    image: "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Kurti - Product 8",
    category: "Kurti",
    pattern: "Straight Pattern",
    color: "Black",
    sizes: ["M", "L", "XL"],
    stock: 45,
    price: 1099,
    discountPrice: 799,
    description: "Sophisticated black straight cut kurti with minimalist neck embroidery.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Chudithar - Product 9",
    category: "Chudithar",
    pattern: "Printed Pattern",
    color: "Sky Blue",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 28,
    price: 999,
    discountPrice: 749,
    description: "Refreshing sky blue printed chudithar tailored for everyday chic comfort.",
    image: "https://images.unsplash.com/photo-1572804013309-82a891485787?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572804013309-82a891485787?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Anarkali - Product 10",
    category: "Anarkali",
    pattern: "Embroidered Pattern",
    color: "Wine",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 18,
    price: 1699,
    discountPrice: 1299,
    description: "Exquisite deep wine embroidered anarkali with intricate golden needlework.",
    image: "https://images.unsplash.com/photo-1550614000-4b95dd5e83ec?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1550614000-4b95dd5e83ec?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Kurti - Product 11",
    category: "Kurti",
    pattern: "Floral Pattern",
    color: "Red",
    sizes: ["M", "L", "XL"],
    stock: 32,
    price: 1099,
    discountPrice: 799,
    description: "Classic red floral print kurti in soft cotton fabric for stylish casual wear.",
    image: "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Chudithar - Product 12",
    category: "Chudithar",
    pattern: "A-Line Pattern",
    color: "Lavender",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 22,
    price: 1199,
    discountPrice: 899,
    description: "Serene lavender A-line chudithar suit set with floral motif dupatta.",
    image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Saree - Product 13",
    category: "Saree",
    pattern: "Printed Pattern",
    color: "Blue",
    sizes: ["Free Size"],
    stock: 25,
    price: 1899,
    discountPrice: 1399,
    description: "Royal blue silk-blend printed saree featuring artisan geometric borders.",
    image: "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Kurti - Product 14",
    category: "Kurti",
    pattern: "Straight Pattern",
    color: "Olive",
    sizes: ["M", "L", "XL"],
    stock: 38,
    price: 999,
    discountPrice: 749,
    description: "Trendy olive green straight pattern kurti with button-down yoke styling.",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Chudithar - Product 15",
    category: "Chudithar",
    pattern: "Floral Pattern",
    color: "Orange",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 17,
    price: 1099,
    discountPrice: 799,
    description: "Vibrant orange floral chudithar complete with matching bottom and chiffon dupatta.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Anarkali - Product 16",
    category: "Anarkali",
    pattern: "Embroidered Pattern",
    color: "Teal",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 24,
    price: 1599,
    discountPrice: 1199,
    description: "Stunning teal embroidered anarkali gown with embellished bodice.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Kurti - Product 17",
    category: "Kurti",
    pattern: "Printed Pattern",
    color: "Beige",
    sizes: ["M", "L", "XL"],
    stock: 42,
    price: 999,
    discountPrice: 699,
    description: "Subtle beige printed kurti with mandarin collar and side slits.",
    image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Chudithar - Product 18",
    category: "Chudithar",
    pattern: "A-Line Pattern",
    color: "Black",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 20,
    price: 1199,
    discountPrice: 899,
    description: "Contemporary black A-line chudithar suit set with contrast thread work.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Saree - Product 19",
    category: "Saree",
    pattern: "Woven Pattern",
    color: "Purple",
    sizes: ["Free Size"],
    stock: 16,
    price: 2199,
    discountPrice: 1699,
    description: "Opulent purple woven festive saree embellished with golden motifs.",
    image: "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617260517861-12c8236d812b?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Kurti - Product 20",
    category: "Kurti",
    pattern: "Printed Pattern",
    color: "Mustard",
    sizes: ["M", "L", "XL"],
    stock: 29,
    price: 1099,
    discountPrice: 799,
    description: "Radiant mustard printed kurti crafted from premium breathable cotton.",
    image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Chudithar - Product 21",
    category: "Chudithar",
    pattern: "Embroidered Pattern",
    color: "Mint Green",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 25,
    price: 1299,
    discountPrice: 949,
    description: "Pastel mint green embroidered chudithar with delicate lace hemlines.",
    image: "https://images.unsplash.com/photo-1572804013309-82a891485787?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572804013309-82a891485787?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Anarkali - Product 22",
    category: "Anarkali",
    pattern: "A-Line Pattern",
    color: "Royal Blue",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 19,
    price: 1799,
    discountPrice: 1399,
    description: "Royal blue floor-length anarkali suit set with ornate zardozi neckline.",
    image: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Chudithar - Product 23",
    category: "Chudithar",
    pattern: "Printed Pattern",
    color: "Coral Pink",
    sizes: ["M", "L", "XL"],
    stock: 33,
    price: 999,
    discountPrice: 749,
    description: "Sweet coral pink printed chudithar set with lightweight dupatta.",
    image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Kurti - Product 24",
    category: "Kurti",
    pattern: "Straight Pattern",
    color: "Emerald Green",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 27,
    price: 1199,
    discountPrice: 849,
    description: "Lustrous emerald green straight kurti with button placket accent.",
    image: "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583391733958-d15f00e992ac?w=800&q=80&auto=format&fit=crop"
    ]
  },
  {
    name: "Chudithar - Product 25",
    category: "Chudithar",
    pattern: "Floral Pattern",
    color: "Magenta",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 31,
    price: 1249,
    discountPrice: 899,
    description: "Glamorous magenta floral chudithar suit set with contrast border piping.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop"
    ]
  }
];

async function main() {
  console.log("Seeding 25 Chudithar & Ethnic Products...");

  // Clear existing products to ensure clean matching list
  await prisma.product.deleteMany({});

  for (let i = 0; i < CHUDITHAR_PRODUCTS.length; i++) {
    const item = CHUDITHAR_PRODUCTS[i];
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + (i + 1);

    await prisma.product.create({
      data: {
        name: item.name,
        slug: slug,
        description: item.description,
        price: item.price,
        discountPrice: item.discountPrice,
        stock: item.stock,
        category: item.category,
        subcategory: item.pattern,
        dressType: item.pattern,
        image: item.image,
        images: JSON.stringify(item.images),
        sizes: JSON.stringify(item.sizes),
        colors: JSON.stringify([item.color]),
        approvalStatus: "APPROVED"
      }
    });
  }

  console.log(`Successfully seeded ${CHUDITHAR_PRODUCTS.length} products!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
