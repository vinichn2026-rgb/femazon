import { CheckoutSummary } from '@/components/cart/CheckoutSummary';
import { getServerAuthPayload } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const authPayload = await getServerAuthPayload();
  if (!authPayload || !authPayload.email) {
    redirect('/login?callbackUrl=/checkout');
  }

  let dbUser: any = null;
  let savedAddresses: any[] = [];

  try {
    dbUser = await prisma.user.findUnique({
      where: { email: authPayload.email },
      include: {
        addresses: {
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
        }
      }
    });

    if (dbUser?.addresses) {
      savedAddresses = dbUser.addresses;
    }
  } catch (err) {
    console.warn('[CheckoutPage] DB query warning:', err);
  }

  const initialUser = {
    id: dbUser?.id?.toString() || authPayload.sub || '',
    name: dbUser?.name || authPayload.name || authPayload.email.split('@')[0],
    email: authPayload.email,
    phone: dbUser?.phone || '',
  };

  return <CheckoutSummary initialUser={initialUser} initialAddresses={savedAddresses} />;
}
