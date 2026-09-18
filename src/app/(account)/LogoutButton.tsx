"use client";

import { useFemazonStore } from "@/context/FemazonStoreContext";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { requestLogout } = useFemazonStore();

  const handleLogout = () => {
    if (requestLogout) {
      requestLogout();
    } else {
      fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
        signOut({ callbackUrl: "/" });
      });
    }
  };

  return (
    <button 
      type="button"
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-sm font-bold transition-colors hover:bg-red-100 cursor-pointer"
    >
      <LogOut size={16} /> Sign Out
    </button>
  );
}
