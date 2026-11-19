"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  Trash2,
  ShieldCheck,
  ShoppingBag
} from "lucide-react";

interface AdminCustomersProps {
  users: any[];
  orders: any[];
  bookings: any[];
  onAction: (action: string, payload: any) => Promise<void>;
}

export function AdminCustomers({ users, orders, bookings, onAction }: AdminCustomersProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const customers = useMemo(() => {
    return users.filter((u) => u.role === "CUSTOMER" || !u.role);
  }, [users]);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter((c) =>
      c.id.toString().includes(q) ||
      (c.name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
              Platform Membership
            </span>
            <span className="text-xs text-stone-500">&bull; Verified Shoppers &amp; Clients</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">Customer Directory</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            View shopper accounts, monitor client participation, and supervise platform activity.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-center shrink-0">
          <p className="text-[10px] text-stone-500 uppercase font-semibold">Total Customers</p>
          <p className="text-xl font-serif font-bold text-stone-900">{customers.length}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by Name, Email, Phone, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F5] rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-stone-800 placeholder:text-stone-400 border border-stone-200 focus:outline-none focus:border-[#4A1513]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F5] border-b border-stone-200 text-stone-500 uppercase tracking-wider font-bold text-[10.5px]">
              <tr>
                <th className="px-5 py-4">Customer ID</th>
                <th className="px-5 py-4">Name &amp; Identity</th>
                <th className="px-5 py-4">Contact Details</th>
                <th className="px-5 py-4 text-center">Orders</th>
                <th className="px-5 py-4 text-center">Styling Sessions</th>
                <th className="px-5 py-4">Joined Date</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-stone-400">
                    <Users size={36} className="mx-auto mb-2 text-stone-300 stroke-1" />
                    <p className="font-medium text-sm text-stone-600">No customer accounts found</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const customerOrders = orders.filter((o) => o.userId === c.id || o.user?.email === c.email).length;
                  const customerBookings = bookings.filter((b) => b.userId === c.id || b.customerEmail === c.email).length;

                  return (
                    <tr key={c.id} className="hover:bg-[#FAF7F5]/50 transition">
                      <td className="px-5 py-4 font-mono font-bold text-stone-900">
                        #CU-{c.id.toString().padStart(4, "0")}
                      </td>
                      <td className="px-5 py-4 font-bold text-stone-900">
                        {c.name || "Femazon Member"}
                      </td>
                      <td className="px-5 py-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <Mail size={12} className="text-stone-400 shrink-0" />
                          <span>{c.email}</span>
                        </div>
                        {c.phone && (
                          <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                            <Phone size={12} className="text-stone-400 shrink-0" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center font-bold text-stone-800">
                        {customerOrders}
                      </td>
                      <td className="px-5 py-4 text-center font-bold text-purple-900">
                        {customerBookings}
                      </td>
                      <td className="px-5 py-4 text-stone-500 text-[11px]">
                        {new Date(c.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => onAction("DELETE_USER", { userId: c.id })}
                          title="Delete User"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
