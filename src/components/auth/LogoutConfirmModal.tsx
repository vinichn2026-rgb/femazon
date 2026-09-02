"use client";

import React from 'react';
import { LogOut, AlertTriangle, X } from 'lucide-react';
import { useFemazonStore } from '@/context/FemazonStoreContext';

export function LogoutConfirmModal() {
  const { isLogoutConfirmOpen, cancelLogout, confirmLogout, user } = useFemazonStore();

  if (!isLogoutConfirmOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="fixed inset-0"
        onClick={cancelLogout}
      />
      
      <div className="relative w-full max-w-sm bg-white rounded-sm p-6 sm:p-7 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-200 z-10 font-sans">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={cancelLogout}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition p-1 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-12 h-12 rounded-xs bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
          <LogOut size={22} />
        </div>

        {/* Modal Headings */}
        <h3 className="font-serif text-xl font-bold text-stone-900 leading-tight">
          Sign Out of Femazon?
        </h3>
        <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
          {user?.name ? `You are signed in as ${user.name}. ` : ''}
          Are you sure you want to log out from this device?
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={confirmLogout}
            className="w-full py-3 rounded-sm bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-[0.16em] shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            <LogOut size={14} />
            <span>Yes, Log Out</span>
          </button>

          <button
            type="button"
            onClick={cancelLogout}
            className="w-full py-3 rounded-sm bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Cancel &amp; Stay Logged In
          </button>
        </div>

      </div>
    </div>
  );
}
