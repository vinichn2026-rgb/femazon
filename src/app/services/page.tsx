import { SimpleServicesClient } from '@/components/services/SimpleServicesClient';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Femazon Managed Services | Mehendi, Beauty, Styling & Saree Draping',
  description: 'Book trusted at-home fashion, makeup, mehendi, and styling services coordinated directly by Femazon for you and your family.',
};

export const dynamic = 'force-dynamic';

let cachedServices: any[] | null = null;
let lastServicesFetch = 0;
const SERVICES_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default async function ServicesPage() {
  const now = Date.now();
  let dbServices: any[] = cachedServices || [];

  if (!cachedServices || now - lastServicesFetch > SERVICES_CACHE_TTL) {
    try {
      const freshServices = await prisma.service.findMany({
        orderBy: { id: 'asc' }
      });
      if (freshServices && freshServices.length > 0) {
        cachedServices = freshServices;
        lastServicesFetch = now;
        dbServices = freshServices;
      }
    } catch (err: any) {
      console.warn('[ServicesPage] Notice: Using cached/fallback catalog due to DB latency:', err?.message || err);
    }
  }

  return (
    <main>
      <SimpleServicesClient dbServices={dbServices} />
    </main>
  );
}
