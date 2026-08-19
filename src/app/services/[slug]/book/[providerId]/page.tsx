import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BookingClient from './BookingClient';

export default async function BookingPage({ params }: { params: { slug: string, providerId: string } }) {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug }
  });

  const provider = await prisma.provider.findUnique({
    where: { id: Number(params.providerId) }
  });

  if (!service || !provider) {
    return notFound();
  }

  return <BookingClient service={service} provider={provider} />;
}
