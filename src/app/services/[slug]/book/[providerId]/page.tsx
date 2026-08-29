import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BookingClient from './BookingClient';

export default async function BookingPage({ params }: { params: Promise<{ slug: string, providerId: string }> }) {
  const resolvedParams = await params;
  const service = await prisma.service.findUnique({
    where: { slug: resolvedParams.slug }
  });

  const provider = await prisma.provider.findUnique({
    where: { id: Number(resolvedParams.providerId) }
  });

  if (!service || !provider) {
    return notFound();
  }

  return <BookingClient service={service} provider={provider} />;
}
