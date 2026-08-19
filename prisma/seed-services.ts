import { prisma } from '../src/lib/prisma';

async function main() {
  console.log("Seeding Services and Providers...");

  const services = [
    { name: "Mehndi", slug: "mehndi", description: "Expert henna artists for your special day.", basePrice: 2000, image: "https://images.unsplash.com/photo-1598305015383-7d727b11c97a?q=80&w=800&auto=format&fit=crop" },
    { name: "Makeup", slug: "makeup", description: "Professional makeup artists for any occasion.", basePrice: 5000, image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop" },
    { name: "Hair Styling", slug: "hair-styling", description: "Get the perfect hairdo for weddings and parties.", basePrice: 1500, image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop" },
    { name: "Personal Styling", slug: "styling", description: "Revamp your wardrobe with a professional stylist.", basePrice: 3000, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop" },
    { name: "Shopping Assistant", slug: "shopping-assistant", description: "Your personal guide to the best fashion finds.", basePrice: 1000, image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=800&auto=format&fit=crop" }
  ];

  for (const svc of services) {
    const createdSvc = await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {},
      create: svc
    });

    // Add some mock providers for each service (only if they don't exist yet to prevent dupes)
    const existing = await prisma.provider.findFirst({ where: { serviceId: createdSvc.id } });
    if (!existing) {
      await prisma.provider.createMany({
        data: [
          { name: "Aisha Khan", bio: `Expert ${svc.name} professional with 5 years of experience.`, rating: 4.8, reviewCount: 120, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop", serviceId: createdSvc.id },
          { name: "Neha Sharma", bio: `Award-winning ${svc.name} artist.`, rating: 4.9, reviewCount: 85, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop", serviceId: createdSvc.id },
          { name: "Priya Patel", bio: `Specializes in contemporary ${svc.name} styles.`, rating: 4.6, reviewCount: 40, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop", serviceId: createdSvc.id }
        ]
      });
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Cannot disconnect safely with adapter sometimes, but we can try
  });
