"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-sm font-bold transition-colors hover:bg-red-100"
    >
      <LogOut size={16} /> Logout
    </button>
  );
}
