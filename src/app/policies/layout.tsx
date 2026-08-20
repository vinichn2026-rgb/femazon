"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/policies/privacy", label: "Privacy Policy" },
    { href: "/policies/terms", label: "Terms & Conditions" },
    { href: "/policies/shipping", label: "Shipping Policy" },
    { href: "/policies/returns", label: "Return & Refund Policy" },
  ];

  return (
    <main className="min-h-screen bg-surface py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-primary mb-2">
            <ShieldCheck size={24} />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-text-main">
            Legal & Policies
          </h1>
          <p className="font-sans text-text-muted text-[15px] max-w-xl mx-auto">
            Everything you need to know about how we protect your data, our terms of service, and our shipping and return procedures.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-3xl p-3 border border-zinc-200 shadow-sm flex flex-row md:flex-col overflow-x-auto no-scrollbar gap-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      whitespace-nowrap px-5 py-3.5 rounded-2xl text-[13px] font-bold tracking-wide transition-all
                      ${isActive 
                        ? 'bg-text-main text-white shadow-md' 
                        : 'text-text-muted hover:bg-zinc-100 hover:text-text-main'}
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Policy Content */}
          <div className="flex-1 min-w-0 bg-white rounded-[2.5rem] border border-zinc-200 p-8 md:p-12 shadow-sm prose prose-zinc max-w-none prose-headings:font-serif prose-headings:font-normal prose-h1:text-3xl prose-h2:text-2xl prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            {children}
          </div>

        </div>
      </div>
    </main>
  );
}
