import Link from "next/link";
import {
  ArrowRight,
  Gift,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Store,
  UserCheck,
} from "lucide-react";

export const metadata = {
  title: "Femazon Partner Hub | Multi-Vendor Marketplace",
  description:
    "Register as a Boutique Owner, Fashion Seller, Beauty Product Seller, Beauty Professional, Personal Stylist, Gift Shop, Independent Gift Creator, or Women's Product Seller.",
};

const PARTNER_TYPES = [
  {
    title: "Boutique Owners",
    description:
      "Showcase your physical or online boutique, list curated ethnic & western collections, manage inventory, and receive orders.",
    registerHref: "/seller/register",
    dashboardHref: "/vendor/dashboard",
    dashboardLabel: "Seller Dashboard",
    badge: "Storefront & Catalog",
  },
  {
    title: "Fashion Sellers",
    description:
      "Sell Indian wear, western wear, footwear, handbags, and jewellery across Femazon's multi-brand marketplace.",
    registerHref: "/seller/register",
    dashboardHref: "/vendor/products",
    dashboardLabel: "Product & Inventory",
    badge: "Multi-Brand Fashion",
  },
  {
    title: "Beauty Product Sellers",
    description:
      "List skincare, haircare, makeup, bath & body, personal & feminine hygiene, grooming essentials, and beauty tools.",
    registerHref: "/seller/register",
    dashboardHref: "/vendor/dashboard",
    dashboardLabel: "Seller Dashboard",
    badge: "Beauty Store",
  },
  {
    title: "Beauty Professionals",
    description:
      "Beauty parlours, makeup artists, hair stylists, skincare pros, nail artists, and mehendi specialists.",
    registerHref: "/partner/register?type=SERVICE_PROVIDER&partnerType=beauty-professional",
    dashboardHref: "/vendor/bookings",
    dashboardLabel: "Bookings & Services",
    badge: "Services & Appointments",
  },
  {
    title: "Personal Stylists",
    description:
      "Build your stylist profile, upload your portfolio, create dynamic styling packages, and accept 1-on-1 client bookings.",
    registerHref: "/personal-styling/register",
    dashboardHref: "/stylist/dashboard",
    dashboardLabel: "Stylist Dashboard",
    badge: "Signature Marketplace",
  },
  {
    title: "Gift Shops",
    description:
      "Offer curated gift hampers, flowers, chocolates, cakes, and celebration boxes for all occasions.",
    registerHref: "/partner/register?type=SELLER&partnerType=gift-shop",
    dashboardHref: "/vendor/dashboard",
    dashboardLabel: "Seller Dashboard",
    badge: "Gifting Store",
  },
  {
    title: "Independent Gift Creators",
    description:
      "Sell personalized keepsakes, handmade hampers, plants, and customized gift boxes crafted with love.",
    registerHref: "/partner/register?type=SELLER&partnerType=gift-creator",
    dashboardHref: "/vendor/dashboard",
    dashboardLabel: "Seller Dashboard",
    badge: "Artisan Gifting",
  },
  {
    title: "Women's Product Sellers",
    description:
      "Reach women shoppers with everyday essentials, accessories, wellness items, and lifestyle products.",
    registerHref: "/seller/register",
    dashboardHref: "/vendor/dashboard",
    dashboardLabel: "Seller Dashboard",
    badge: "Lifestyle & Essentials",
  },
];

export default function PartnerHubPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F5] pb-20 text-stone-900">
      <section className="bg-[#3D110F] py-16 text-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1300px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-rose-200 mb-3">
            <Store size={14} /> FEMAZON MULTI-VENDOR ECOSYSTEM
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Become a Femazon Partner
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-rose-100/90 leading-relaxed">
            Choose your partner role below to register your business or practice. All partner applications are reviewed and approved by the Femazon Admin team before becoming publicly visible.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-rose-100">
            <ShieldCheck size={15} className="text-emerald-300 shrink-0" />
            <span>Admin Approval Workflow: Application Submitted → Under Review → Approved → Live on Femazon</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1300px] px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PARTNER_TYPES.map((partner) => (
            <article
              key={partner.title}
              className="flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs hover:shadow-lg transition"
            >
              <div>
                <span className="inline-block rounded-full bg-rose-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#4A1513]">
                  {partner.badge}
                </span>
                <h2 className="mt-3 font-serif text-xl font-bold text-stone-900">
                  {partner.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-stone-600">
                  {partner.description}
                </p>
              </div>

              <div className="mt-6 space-y-2 border-t border-stone-100 pt-4">
                <Link
                  href={partner.registerHref}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#4A1513] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#38100e] transition"
                >
                  <UserCheck size={13} />
                  <span>Register</span>
                  <ArrowRight size={13} />
                </Link>
                <Link
                  href={partner.dashboardHref}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 hover:border-[#4A1513] hover:text-[#4A1513] transition"
                >
                  <LayoutDashboard size={13} />
                  <span>{partner.dashboardLabel}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#4A1513] shrink-0">
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Already an approved Femazon Partner?
              </h3>
              <p className="text-xs text-stone-600">
                Access your Seller Portal, Stylist Dashboard, or Service Bookings directly.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/vendor/dashboard"
              className="rounded-full border border-[#4A1513] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#4A1513] hover:bg-rose-50 transition"
            >
              Seller Portal
            </Link>
            <Link
              href="/stylist/dashboard"
              className="rounded-full bg-[#4A1513] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#38100e] transition"
            >
              Stylist Portal
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
