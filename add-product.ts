import { prisma } from './src/lib/prisma';

async function main() {
  const existing = await prisma.product.findUnique({ where: { slug: 'floral-kurti' } });
  if (!existing) {
    const product = await prisma.product.create({
      data: {
        name: 'Floral Kurti',
        slug: 'floral-kurti',
        description: 'A beautiful floral kurti for everyday wear.',
        price: 999,
        stock: 20,
        category: 'Kurtis',
        image: 'https://images.unsplash.com/photo-1599746146388-a7ec2004b67a?q=80&w=600&auto=format&fit=crop'
      }
    });
    console.log('Created product:', product);
  } else {
    console.log('Product already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
