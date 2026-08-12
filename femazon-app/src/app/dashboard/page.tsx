import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { VendorProductForm } from '@/components/vendor/VendorProductForm';
import { BookingRequests } from '@/components/vendor/BookingRequests';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const isVendor = ['VENDOR', 'ADMIN'].includes(session.user.role);

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-600">Vendor portal</p>
          <h1 className="mt-3 text-3xl font-semibold">Welcome, {session.user.name || session.user.email}</h1>
          <p className="mt-2 text-zinc-600">Your role: {session.user.role}</p>
        </div>

        {isVendor ? (
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <VendorProductForm />
            <BookingRequests />
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">Vendor access required</h2>
            <p className="mt-3 text-zinc-600">
              This section is reserved for vendors and admins. Create an account with the vendor role to add products and manage service requests.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
