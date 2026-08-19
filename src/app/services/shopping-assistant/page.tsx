import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ShoppingAssistantClient from './ShoppingAssistantClient';

export const dynamic = 'force-dynamic';

export default async function ShoppingAssistantPage() {
  const service = await prisma.service.findUnique({
    where: { slug: 'shopping-assistant' },
    include: {
      providers: true
    }
  });

  if (!service) {
    return notFound();
  }

  return <ShoppingAssistantClient service={service} />;
}
