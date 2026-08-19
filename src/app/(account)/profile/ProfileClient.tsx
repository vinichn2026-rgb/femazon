"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { UserCircle2, MapPin, Heart, ShoppingBag, Package, CalendarDays, LogOut, ChevronRight, Settings } from "lucide-react";

type Address = {
  id: number;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
};

type ProfileClientProps = {
  user: {
    name: string;
    email: string;
    phone: string;
    role: string;
    joinDate: string;
    addresses: Address[];
    stats: {
      orders: number;
      wishlist: number;
    }
  }
};

export default function ProfileClient({ user }: ProfileClientProps) {
  
  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-normal text-text-main mb-3">Profile</h1>
        <p className="font-sans text-[15px] text-text-muted">
          Manage your personal details and addresses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Profile Card */}
        <div className="rounded-[2rem] border border-accent/20 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <UserCircle2 size={32} />
            </div>
            <button className="text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-primary flex items-center gap-1 transition">
              <Settings size={14} /> Edit
            </button>
          </div>
          
          <h2 className="text-xl font-serif text-text-main mb-1">{user.name}</h2>
          <p className="text-sm text-zinc-500 mb-6">{user.email}</p>
          
          <div className="space-y-4 border-t border-accent/10 pt-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">Phone Number</span>
              <span className="font-medium text-text-main">{user.phone}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">Member Since</span>
              <span className="font-medium text-text-main">{user.joinDate}</span>
            </div>
          </div>
        </div>

        {/* Addresses Card */}
        <div className="rounded-[2rem] border border-accent/20 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-lg text-text-main flex items-center gap-2">
              <MapPin size={18} className="text-primary" /> Saved Addresses
            </h3>
            <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
              Add New
            </button>
          </div>

          {user.addresses.length === 0 ? (
            <div className="text-center py-6 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
              <p className="text-sm text-zinc-500">No addresses saved yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {user.addresses.map((addr) => (
                <div key={addr.id} className="p-4 rounded-2xl border border-accent/20 hover:border-primary/30 transition-colors">
                  <p className="font-bold text-sm text-text-main mb-1">{addr.name}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-[80%]">
                    {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">Ph: {addr.phone}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
