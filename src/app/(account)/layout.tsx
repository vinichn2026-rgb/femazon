import Link from "next/link";
import { UserCircle2, Package, Heart, ShoppingBag, CalendarDays, MapPin, Settings, Sparkles, LogOut } from "lucide-react";
import LogoutButton from "./LogoutButton"; // We'll create this simple client component

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const NAV_LINKS = [
    { href: "/profile", label: "Profile", icon: <UserCircle2 size={18} /> },
    { href: "/orders", label: "My Orders", icon: <Package size={18} /> },
    { href: "/wishlist", label: "Wishlist", icon: <Heart size={18} /> },
    { href: "/cart", label: "My Cart", icon: <ShoppingBag size={18} /> },
    { href: "/bookings", label: "My Bookings", icon: <CalendarDays size={18} /> },
    { href: "/wardrobe", label: "My Wardrobe", icon: <Sparkles size={18} /> },
    { href: "/addresses", label: "Addresses", icon: <MapPin size={18} /> },
    { href: "/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm sticky top-24">
            <h2 className="font-serif text-2xl text-text-main mb-6">My Account</h2>
            
            <nav className="space-y-1">
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-500 hover:text-text-main hover:bg-zinc-50 transition"
                >
                  <span className="text-zinc-400">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-zinc-100">
              <LogoutButton />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>
        
      </div>
    </div>
  );
}
