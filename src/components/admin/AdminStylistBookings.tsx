"use client";

import React, { useState, useMemo } from "react";
import {
  CalendarDays,
  Search,
  Filter,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
  AlertCircle,
  Loader2,
  Check,
  UserCheck
} from "lucide-react";

interface AdminStylistBookingsProps {
  bookings: any[];
  onAction: (action: string, payload: any) => Promise<void>;
}

export function AdminStylistBookings({ bookings, onAction }: AdminStylistBookingsProps) {
  const [globalSearch, setGlobalSearch] = useState("");
  const [bookingIdFilter, setBookingIdFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [stylistFilter, setStylistFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Sorting
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Detail Modal & Status Updater
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Enrich bookings with helper flags (upcoming, pending confirmation)
  const enrichedBookings = useMemo(() => {
    return bookings.map((b) => {
      const isPending = b.status === "PENDING" || b.status === "REQUEST_RECEIVED";
      const customerName = b.customerName || b.user?.name || b.user?.email || "Client";
      const stylistName = b.stylist?.fullName || "Unassigned Stylist";
      const serviceName = b.package?.title || "Personal Styling Consultation";
      const packagePlan = b.package?.packageType || b.package?.duration || "Standard Plan";

      // Check upcoming booking
      let isUpcoming = false;
      if (b.bookingDate) {
        try {
          const bDate = new Date(b.bookingDate);
          if (bDate.getTime() > Date.now() && b.status !== "CANCELLED" && b.status !== "COMPLETED") {
            isUpcoming = true;
          }
        } catch {}
      }

      return {
        ...b,
        customerName,
        stylistName,
        serviceName,
        packagePlan,
        isPending,
        isUpcoming,
      };
    });
  }, [bookings]);

  // Filtering
  const filteredBookings = useMemo(() => {
    return enrichedBookings.filter((b) => {
      if (globalSearch.trim()) {
        const q = globalSearch.toLowerCase().trim();
        const matchesGlobal =
          b.id.toString().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.stylistName.toLowerCase().includes(q) ||
          b.serviceName.toLowerCase().includes(q) ||
          (b.location || "").toLowerCase().includes(q);
        if (!matchesGlobal) return false;
      }

      if (bookingIdFilter.trim() && !b.id.toString().includes(bookingIdFilter.trim())) return false;
      if (serviceFilter.trim() && !b.serviceName.toLowerCase().includes(serviceFilter.toLowerCase().trim())) return false;
      if (customerFilter.trim() && !b.customerName.toLowerCase().includes(customerFilter.toLowerCase().trim())) return false;
      if (stylistFilter.trim() && !b.stylistName.toLowerCase().includes(stylistFilter.toLowerCase().trim())) return false;
      if (statusFilter !== "ALL" && b.status !== statusFilter) return false;

      if (dateFrom && b.bookingDate) {
        if (b.bookingDate < dateFrom) return false;
      }
      if (dateTo && b.bookingDate) {
        if (b.bookingDate > dateTo) return false;
      }

      return true;
    });
  }, [
    enrichedBookings,
    globalSearch,
    bookingIdFilter,
    serviceFilter,
    customerFilter,
    stylistFilter,
    statusFilter,
    dateFrom,
    dateTo,
  ]);

  // Sorting
  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      let valA: any = 0;
      let valB: any = 0;

      if (sortBy === "id") {
        valA = a.id;
        valB = b.id;
      } else if (sortBy === "date") {
        valA = a.bookingDate || "";
        valB = b.bookingDate || "";
      } else if (sortBy === "amount") {
        valA = a.totalAmount;
        valB = b.totalAmount;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredBookings, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedBookings.length / pageSize) || 1;
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedBookings.slice(startIndex, startIndex + pageSize);
  }, [sortedBookings, currentPage, pageSize]);

  const handleUpdateStatus = async (bookingId: number, status: string) => {
    setIsUpdatingStatus(true);
    try {
      await onAction("UPDATE_STYLIST_BOOKING_STATUS", {
        bookingId,
        status,
      });
      if (selectedBooking) {
        setSelectedBooking({ ...selectedBooking, status });
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">
              Personal Styling Sessions
            </span>
            <span className="text-xs text-stone-500">&bull; Appointments &amp; Consultations</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">Bookings Management</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor client appointments, track stylist confirmations, manage sessions, and verify commission settlements.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-center">
            <p className="text-[10px] text-stone-500 uppercase font-semibold">Total</p>
            <p className="text-base font-serif font-bold text-stone-900">{bookings.length}</p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 text-center">
            <p className="text-[10px] text-purple-800 uppercase font-semibold">Pending</p>
            <p className="text-base font-serif font-bold text-purple-900">
              {bookings.filter(b => b.status === 'PENDING').length}
            </p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-[10px] text-emerald-800 uppercase font-semibold">Confirmed</p>
            <p className="text-base font-serif font-bold text-emerald-900">
              {bookings.filter(b => b.status === 'CONFIRMED').length}
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
        
        {/* Row 1: Global Search + Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Global Search (Booking ID, Client, Stylist, Service)..."
              value={globalSearch}
              onChange={(e) => { setGlobalSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#FAF7F5] rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-stone-900 placeholder:text-stone-400 border border-stone-200 focus:outline-none focus:border-[#4A1513]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#4A1513]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Confirmation</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#4A1513]"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {/* Row 2: Granular Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100 text-xs">
          <div>
            <input
              type="text"
              placeholder="Filter Booking ID..."
              value={bookingIdFilter}
              onChange={(e) => { setBookingIdFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#4A1513]"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Filter Service Name..."
              value={serviceFilter}
              onChange={(e) => { setServiceFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#4A1513]"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Filter Customer Name..."
              value={customerFilter}
              onChange={(e) => { setCustomerFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#4A1513]"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Filter Stylist Name..."
              value={stylistFilter}
              onChange={(e) => { setStylistFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#4A1513]"
            />
          </div>
        </div>

        {/* Clear Filters Helper */}
        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-stone-500">
            Showing <strong>{sortedBookings.length}</strong> matching bookings (out of {bookings.length} total)
          </span>
          {(globalSearch || bookingIdFilter || serviceFilter || customerFilter || stylistFilter || statusFilter !== "ALL" || dateFrom || dateTo) && (
            <button
              type="button"
              onClick={() => {
                setGlobalSearch("");
                setBookingIdFilter("");
                setServiceFilter("");
                setCustomerFilter("");
                setStylistFilter("");
                setStatusFilter("ALL");
                setDateFrom("");
                setDateTo("");
                setCurrentPage(1);
              }}
              className="text-purple-900 font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F5] border-b border-stone-200 text-stone-500 uppercase tracking-wider font-bold text-[10.5px]">
              <tr>
                <th className="px-5 py-4 cursor-pointer hover:text-stone-900" onClick={() => { setSortBy("id"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>
                  <div className="flex items-center gap-1">
                    <span>Booking ID</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-5 py-4">Service &amp; Package</th>
                <th className="px-5 py-4">Client Name</th>
                <th className="px-5 py-4">Stylist Professional</th>
                <th className="px-5 py-4 cursor-pointer hover:text-stone-900" onClick={() => { setSortBy("date"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>
                  <div className="flex items-center gap-1">
                    <span>Date &amp; Time</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 cursor-pointer hover:text-stone-900" onClick={() => { setSortBy("amount"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>
                  <div className="flex items-center gap-1">
                    <span>Total</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-stone-400">
                    <CalendarDays size={36} className="mx-auto mb-2 text-stone-300 stroke-1" />
                    <p className="font-medium text-sm text-stone-600">No styling bookings found</p>
                    <p className="text-xs text-stone-400 mt-0.5">Client reservations will appear here automatically.</p>
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((b) => {
                  const statusColors: any = {
                    PENDING: "bg-amber-50 text-amber-800 border-amber-200",
                    CONFIRMED: "bg-blue-50 text-blue-800 border-blue-200",
                    IN_PROGRESS: "bg-purple-50 text-purple-800 border-purple-200",
                    COMPLETED: "bg-emerald-50 text-emerald-800 border-emerald-200",
                    CANCELLED: "bg-rose-50 text-rose-800 border-rose-200",
                  };

                  return (
                    <tr key={b.id} className="hover:bg-[#FAF7F5]/50 transition">
                      
                      {/* Booking ID with Badges */}
                      <td className="px-5 py-3.5 font-mono font-bold text-purple-900">
                        <div className="flex items-center gap-1.5">
                          <span>#BK-{b.id.toString().padStart(4, "0")}</span>
                          {b.isUpcoming && (
                            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-purple-100 text-purple-900">
                              Upcoming
                            </span>
                          )}
                          {b.isPending && (
                            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-amber-100 text-amber-900 animate-pulse">
                              Pending
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Service & Package */}
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-stone-900 text-sm truncate max-w-[180px]">{b.serviceName}</p>
                        <p className="text-stone-400 text-[10.5px] truncate max-w-[180px]">{b.packagePlan}</p>
                      </td>

                      {/* Customer Name */}
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-stone-900">{b.customerName}</p>
                        <p className="text-stone-400 text-[10.5px]">{b.customerPhone || b.customerEmail}</p>
                      </td>

                      {/* Stylist Professional */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={b.stylist?.profileImage || "/images/placeholder.jpg"}
                            alt={b.stylistName}
                            className="w-7 h-7 rounded-full object-cover border border-purple-200 bg-stone-100 shrink-0"
                          />
                          <span className="font-semibold text-stone-800 truncate max-w-[140px]">{b.stylistName}</span>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-5 py-3.5 text-stone-600 text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1 text-stone-800 font-semibold">
                          <Calendar size={12} className="text-stone-400" />
                          <span>{b.bookingDate || "Date TBD"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-stone-500 text-[10.5px] mt-0.5">
                          <Clock size={11} className="text-stone-400" />
                          <span>{b.bookingTime || "Standard slot"}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10.5px] font-bold border ${statusColors[b.status] || "bg-stone-100 text-stone-800"}`}>
                          {b.status}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-3.5 font-serif font-bold text-stone-900">
                        ₹{b.totalAmount}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(b)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-purple-900 hover:bg-stone-100 transition cursor-pointer"
                            title="View Session Details"
                          >
                            <Eye size={15} />
                          </button>

                          {b.status === "PENDING" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(b.id, "CONFIRMED")}
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
                            >
                              <Check size={12} />
                              Confirm
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#FAF7F5] border-t border-stone-200 flex items-center justify-between text-xs">
            <span className="text-stone-500">Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL DRAWER / MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">Styling Booking #{selectedBooking.id}</h3>
                  <p className="text-xs text-stone-500">Status: {selectedBooking.status}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              
              {/* Package & Stylist */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FAF7F5] p-3.5 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Service Package</p>
                  <p className="text-sm font-bold text-stone-900 mt-0.5">{selectedBooking.serviceName}</p>
                  <p className="text-[11px] text-stone-500">{selectedBooking.packagePlan}</p>
                </div>

                <div className="bg-[#FAF7F5] p-3.5 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Assigned Stylist</p>
                  <p className="text-sm font-bold text-stone-900 mt-0.5">{selectedBooking.stylistName}</p>
                  <p className="text-[11px] text-stone-500">{selectedBooking.stylist?.city || "Remote"}</p>
                </div>
              </div>

              {/* Client & Contact */}
              <div className="bg-[#FAF7F5] p-3.5 rounded-xl border border-stone-100">
                <p className="text-[10px] text-stone-400 uppercase font-semibold mb-1">Client Contact</p>
                <div className="grid grid-cols-2 gap-2 text-stone-800">
                  <p><strong>Name:</strong> {selectedBooking.customerName}</p>
                  <p><strong>Email:</strong> {selectedBooking.customerEmail || selectedBooking.user?.email}</p>
                  <p><strong>Phone:</strong> {selectedBooking.customerPhone || "N/A"}</p>
                  <p><strong>Mode:</strong> {selectedBooking.deliveryMode || "Online"}</p>
                </div>
              </div>

              {/* Appointment Schedule */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100">
                  <p className="text-[10px] text-purple-900 uppercase font-semibold">Scheduled Date &amp; Time</p>
                  <p className="text-sm font-bold text-purple-950 mt-0.5">
                    {selectedBooking.bookingDate} at {selectedBooking.bookingTime}
                  </p>
                </div>

                <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100">
                  <p className="text-[10px] text-purple-900 uppercase font-semibold">Financial Breakdown</p>
                  <p className="text-sm font-bold text-purple-950 mt-0.5">
                    ₹{selectedBooking.totalAmount} (Comm: ₹{selectedBooking.commissionAmount || 0})
                  </p>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="bg-[#FAF7F5] p-3.5 rounded-xl border border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold mb-1">Client Requirements / Notes</p>
                  <p className="text-xs text-stone-700 leading-relaxed">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Quick Status Update Form */}
              <div className="pt-3 border-t border-stone-100">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Change Session Status</p>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedBooking.status}
                    onChange={(e) => handleUpdateStatus(selectedBooking.id, e.target.value)}
                    disabled={isUpdatingStatus}
                    className="flex-1 bg-[#FAF7F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#4A1513]"
                  >
                    <option value="PENDING">Pending Confirmation</option>
                    <option value="ACCEPTED">Accepted by Stylist</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  {isUpdatingStatus && <Loader2 size={16} className="animate-spin text-[#4A1513]" />}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
