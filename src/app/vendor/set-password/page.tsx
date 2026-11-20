import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, ShieldAlert, Store, HelpCircle } from "lucide-react";
import { verifyVendorPasswordSetupToken } from "@/lib/vendorPasswordSetup";
import VendorSetPasswordClient from "./VendorSetPasswordClient";
import { VendorPortalHeader } from "@/components/vendor/VendorPortalHeader";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Set Vendor Password | Femazon Partner Portal",
  description: "Securely create and activate your Femazon vendor partner account password.",
};

interface SetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function VendorSetPasswordPage({ searchParams }: SetPasswordPageProps) {
  const { token } = (await searchParams) || {};

  if (!token) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] flex flex-col justify-between font-sans">
        <VendorPortalHeader subTitle="Password Setup" storeHref="/shop" />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-[480px] bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-[0_12px_40px_rgba(74,21,19,0.06)] text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border border-amber-200 mb-6 text-amber-600 shadow-2xs">
              <AlertTriangle size={32} />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal mb-3">
              Setup Token Missing
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
              No password setup token was provided in the link. Please open the exact link received in your official Femazon approval email.
            </p>
            <div className="space-y-3">
              <Link
                href="/vendor/login"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#4A1513] hover:bg-[#380E0C] text-white text-xs font-bold uppercase tracking-wider transition shadow-md"
              >
                <span>Go to Vendor Login</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-6 rounded-full border border-stone-200 hover:border-stone-300 text-stone-700 text-xs font-semibold transition"
              >
                <HelpCircle size={14} />
                <span>Contact Support</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Verify token
  const result = await verifyVendorPasswordSetupToken(token);

  if (!result.valid || !result.user || !result.vendor) {
    const isAlreadyUsed = result.error?.includes("already been used");
    return (
      <div className="min-h-screen bg-[#FAF7F5] flex flex-col justify-between font-sans">
        <VendorPortalHeader subTitle="Password Setup" storeHref="/shop" />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-[480px] bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-[0_12px_40px_rgba(74,21,19,0.06)] text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 border border-rose-200 mb-6 text-rose-600 shadow-2xs">
              <ShieldAlert size={32} />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal mb-3">
              {isAlreadyUsed ? "Link Already Used" : "Invalid Setup Link"}
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
              {result.error || "This password setup link is invalid, expired, or has already been used."}
            </p>
            <div className="space-y-3">
              <Link
                href="/vendor/login"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#4A1513] hover:bg-[#380E0C] text-white text-xs font-bold uppercase tracking-wider transition shadow-md"
              >
                <span>Proceed to Vendor Login</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-6 rounded-full border border-stone-200 hover:border-stone-300 text-stone-700 text-xs font-semibold transition"
              >
                <HelpCircle size={14} />
                <span>Contact Administrator</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <VendorSetPasswordClient
      token={token}
      shopName={result.vendor.businessName}
      vendorId={result.vendor.id}
      email={result.user.email}
    />
  );
}
