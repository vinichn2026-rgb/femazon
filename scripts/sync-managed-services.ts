import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

export const MANAGED_SERVICES = [
  {
    name: 'Mehendi (Henna Art)',
    slug: 'mehndi',
    description: 'Traditional and bridal henna art created for celebrations, weddings, and festive gatherings. Our team coordinates experienced artists to visit your location.',
    basePrice: 2000,
    image: 'https://images.unsplash.com/photo-1598305015383-7d727b11c97a?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Makeup and Beauty',
    slug: 'makeup',
    description: 'Simple, elegant party and bridal makeup for family events, weddings, and special milestones. Femazon arranges trusted beauty specialists at your doorstep.',
    basePrice: 3500,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Personal Styling & Wardrobe Help',
    slug: 'styling',
    description: 'Personal assistance in putting together graceful outfits, draping sarees, matching jewellery, and planning looks for festive functions and weddings.',
    basePrice: 2500,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Event & Celebration Planning',
    slug: 'event-planning',
    description: 'Full coordination for housewarmings, birthday celebrations, baby showers, and family functions. We handle decor, coordination, and vendors.',
    basePrice: 5000,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Hair Styling & Draping',
    slug: 'hair-styling',
    description: 'Classic blowouts, traditional flower-adorned braids, elegant updos, and expert saree draping for you and your family.',
    basePrice: 1500,
    image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Personal Shopping Assistant',
    slug: 'shopping-assistant',
    description: 'Dedicated shopping guidance to help you select fabrics, coordinate family outfits, or choose bridal trousseau with ease.',
    basePrice: 1200,
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=800&auto=format&fit=crop',
  }
];

async function syncServices() {
  console.log('Syncing official Femazon managed services...');
  for (const s of MANAGED_SERVICES) {
    const existing = await prisma.service.findUnique({ where: { slug: s.slug } });
    let serviceRecord;
    if (existing) {
      serviceRecord = await prisma.service.update({
        where: { slug: s.slug },
        data: s
      });
      console.log('Updated service:', s.name);
    } else {
      serviceRecord = await prisma.service.create({ data: s });
      console.log('Created service:', s.name);
    }

    // Ensure internal Femazon Supporter provider exists for assignment
    const defaultProvider = await prisma.provider.findFirst({
      where: { serviceId: serviceRecord.id }
    });

    if (!defaultProvider) {
      await prisma.provider.create({
        data: {
          name: 'Femazon Operations Team',
          bio: 'Femazon internal operations team coordinating professional support.',
          rating: 5.0,
          reviewCount: 1,
          serviceId: serviceRecord.id
        }
      });
      console.log('Created internal supporter for:', s.name);
    }
  }
  console.log('Service sync complete!');
}

syncServices().catch(console.error);
