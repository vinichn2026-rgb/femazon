"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  UserCircle2, 
  MapPin, 
  Settings, 
  Check, 
  Edit3, 
  Package, 
  Heart, 
  CalendarDays,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { useFemazonStore } from "@/context/FemazonStoreContext";

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
    firstName?: string;
    lastName?: string;
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

export default function ProfileClient({ user: initialUser }: ProfileClientProps) {
  const { user: storeUser, setUser: setStoreUser } = useFemazonStore();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(storeUser?.firstName || initialUser.firstName || "Priya");
  const [lastName, setLastName] = useState(storeUser?.lastName || initialUser.lastName || "Sharma");
  const [email, setEmail] = useState(storeUser?.email || initialUser.email);
  const [phone, setPhone] = useState(storeUser?.phone || initialUser.phone);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulate save / API call
      await new Promise(r => setTimeout(r, 400));

      const updatedName = `${firstName.trim()} ${lastName.trim()}`;
      setStoreUser(prev => prev ? {
        ...prev,
        name: updatedName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim()
      } : null);

      setIsSaving(false);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-stone-900 mb-2">
          Hi, {firstName} 👋
        </h1>
        <p className="font-sans text-[14.5px] text-stone-500">
          Manage your personal details, saved addresses, and communication preferences
        </p>
      </div>

      {/* Save Notification */}
      {saveSuccess && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium animate-in fade-in duration-200">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Profile information updated successfully ✓</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Personal Details Card */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between mb-6">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F5] border border-stone-200 text-[#4A1513] flex items-center justify-center font-serif text-xl font-bold">
              {firstName.charAt(0)}
            </div>

            {!isEditing ? (
              <button 
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold uppercase tracking-wider text-[#4A1513] hover:underline flex items-center gap-1.5 transition cursor-pointer py-1 px-2.5 rounded-lg hover:bg-[#FAF7F5]"
              >
                <Edit3 size={14} /> 
                <span>Edit Profile</span>
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-800 transition cursor-pointer py-1 px-2.5 rounded-lg hover:bg-stone-100"
              >
                Cancel
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-serif text-stone-900 mb-0.5">
                  {firstName} {lastName}
                </h2>
                <p className="text-xs uppercase font-bold tracking-wider text-stone-400">
                  Femazon Customer
                </p>
              </div>

              <div className="space-y-3.5 border-t border-stone-100 pt-5 text-[13.5px]">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">First Name</span>
                  <span className="font-semibold text-stone-900">{firstName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Last Name</span>
                  <span className="font-semibold text-stone-900">{lastName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Email Address</span>
                  <span className="font-semibold text-stone-900">{email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Phone Number</span>
                  <span className="font-semibold text-stone-900">{phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Account Created</span>
                  <span className="font-medium text-stone-700">{initialUser.joinDate}</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-[#4A1513]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-[#4A1513]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-[#4A1513]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:outline-none focus:border-[#4A1513]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-full bg-[#4A1513] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#350B0A] transition cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-3 px-5 rounded-full border border-stone-300 text-stone-700 text-xs font-bold uppercase tracking-wider hover:bg-stone-50 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Saved Addresses & Quick Links */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-xl text-stone-900 flex items-center gap-2">
                <MapPin size={18} className="text-[#4A1513]" /> 
                <span>Saved Addresses</span>
              </h3>
              <Link 
                href="/addresses"
                className="text-xs font-bold uppercase tracking-wider text-[#4A1513] hover:underline"
              >
                Manage All
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-stone-200/80">
              <p className="font-bold text-sm text-stone-900 mb-1">{firstName} {lastName} (Default)</p>
              <p className="text-xs text-stone-600 leading-relaxed">
                Flat 402, Royal Palms Residency, South Extension Part II, New Delhi - 110049
              </p>
              <p className="text-xs text-stone-500 mt-2 font-medium">Ph: {phone}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-[#FAF7F5]/80 p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={22} className="text-[#4A1513]" />
              <div>
                <h4 className="text-sm font-bold text-stone-900">Security &amp; Privacy</h4>
                <p className="text-xs text-stone-500">Your information is protected by 256-bit SSL encryption.</p>
              </div>
            </div>
            <Link 
              href="/settings"
              className="text-xs font-bold uppercase tracking-wider text-[#4A1513] hover:underline whitespace-nowrap"
            >
              Settings →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
