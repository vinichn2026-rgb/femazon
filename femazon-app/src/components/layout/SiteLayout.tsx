import Link from 'next/link';
import { ShoppingBag, Search, UserCircle2, Menu } from 'lucide-react';

type AuthSession = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function SiteLayout({
  children,
  authSession,
}: {
  children: React.ReactNode;
  authSession?: AuthSession | null;
}) {
  const isLoggedIn = Boolean(authSession);
  const role = authSession?.role;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-full bg-zinc-900 p-2 text-white">
              <ShoppingBag size={18} />
            </div>
            <div>
              <p className="text-lg font-semibold">Femazon</p>
              <p className="text-xs text-zinc-500">Marketplace</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
            <Link href="/" className="transition hover:text-amber-600">Home</Link>
            <Link href="/products" className="transition hover:text-amber-600">Products</Link>
            <Link href="/services" className="transition hover:text-amber-600">Services</Link>
            {isLoggedIn ? (
              <>
                <span className="text-zinc-500">{authSession?.name}</span>
                <Link href="/profile" className="transition hover:text-amber-600">Profile</Link>
                <Link href="/orders" className="transition hover:text-amber-600">My Orders</Link>
                <Link href="/bookings" className="transition hover:text-amber-600">My Bookings</Link>
                {role === 'VENDOR' && (
                  <Link href="/vendor/dashboard" className="transition hover:text-amber-600">Vendor Dashboard</Link>
                )}
                {role === 'ADMIN' && (
                  <Link href="/admin/dashboard" className="transition hover:text-amber-600">Admin Dashboard</Link>
                )}
                <Link href="/api/auth/logout" className="transition hover:text-amber-600">Logout</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="transition hover:text-amber-600">Login</Link>
                <Link href="/register" className="transition hover:text-amber-600">Create Account</Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button className="rounded-full border border-zinc-200 p-2 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900">
              <Search size={18} />
            </button>
            <button className="rounded-full border border-zinc-200 p-2 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900">
              <UserCircle2 size={18} />
            </button>
            <button className="rounded-full border border-zinc-200 p-2 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 md:hidden">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-zinc-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 Femazon. Built for the marketplace experience.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-zinc-900">Home</Link>
            <Link href="/dashboard" className="hover:text-zinc-900">Dashboard</Link>
            {!isLoggedIn && <Link href="/login" className="hover:text-zinc-900">Login</Link>}
          </div>
        </div>
      </footer>
    </div>
  );
}
