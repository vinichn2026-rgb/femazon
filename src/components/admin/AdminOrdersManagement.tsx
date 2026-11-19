"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingCart,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Eye,
  Store,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
  MapPin,
  Mail,
  Phone,
  FileSpreadsheet,
  AlertTriangle,
  Loader2,
  Check
} from "lucide-react";

interface AdminOrdersManagementProps {
  orders: any[];
  onAction: (action: string, payload: any) => Promise<void>;
}

export function AdminOrdersManagement({ orders, onAction }: AdminOrdersManagementProps) {
  // Global & specific filters
  const [globalSearch, setGlobalSearch] = useState("");
  const [orderIdFilter, setOrderIdFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [vendorFilter, setVendorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dueDateFrom, setDueDateFrom] = useState("");
  const [dueDateTo, setDueDateTo] = useState("");
  const [deliveredDateFrom, setDeliveredDateFrom] = useState("");
  const [deliveredDateTo, setDeliveredDateTo] = useState("");
  const [minQty, setMinQty] = useState("");

  // Sorting
  const [sortBy, setSortBy] = useState<string>("date"); // 'id', 'date', 'dueDate', 'total', 'quantity'
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Detail Modal & Status Updater
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusFormData, setStatusFormData] = useState({
    status: "",
    remarks: "",
    dueDate: "",
    deliveredOn: "",
  });

  // Calculate vendor list per order and total quantities
  const enrichedOrders = useMemo(() => {
    return orders.map((o) => {
      const items = o.items || [];
      const totalQty = items.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0);
      
      const vendorNamesSet = new Set<string>();
      items.forEach((it: any) => {
        const vName = it.product?.vendor?.vendorProfile?.businessName || it.product?.vendor?.name || (it.product?.vendorId ? `Vendor #${it.product.vendorId}` : null);
        if (vName) vendorNamesSet.add(vName);
      });
      const vendorNames = Array.from(vendorNamesSet).join(", ") || "Femazon Direct";

      const customerName = o.shippingName || o.user?.name || o.user?.email || "Customer";
      
      // Check overdue: dueDate passed and not DELIVERED or CANCELLED
      let isOverdue = false;
      if (o.dueDate && o.status !== "DELIVERED" && o.status !== "CANCELLED") {
        const dueTime = new Date(o.dueDate).getTime();
        const nowTime = new Date().getTime();
        if (dueTime < nowTime) {
          isOverdue = true;
        }
      }

      return {
        ...o,
        customerName,
        vendorNames,
        totalQty,
        isOverdue,
      };
    });
  }, [orders]);

  // Filtering
  const filteredOrders = useMemo(() => {
    return enrichedOrders.filter((o) => {
      // 1. Global Search
      if (globalSearch.trim()) {
        const q = globalSearch.toLowerCase().trim();
        const matchesGlobal =
          o.id.toString().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.vendorNames.toLowerCase().includes(q) ||
          (o.shippingCity || "").toLowerCase().includes(q) ||
          (o.remarks || "").toLowerCase().includes(q) ||
          (o.status || "").toLowerCase().includes(q);
        if (!matchesGlobal) return false;
      }

      // 2. Specific Column Filters
      if (orderIdFilter.trim() && !o.id.toString().includes(orderIdFilter.trim())) return false;
      if (customerFilter.trim() && !o.customerName.toLowerCase().includes(customerFilter.toLowerCase().trim())) return false;
      if (vendorFilter.trim() && !o.vendorNames.toLowerCase().includes(vendorFilter.toLowerCase().trim())) return false;
      if (statusFilter !== "ALL" && o.status !== statusFilter) return false;

      // 3. Date Filters
      if (dateFrom) {
        const orderDate = new Date(o.createdAt).toISOString().split("T")[0];
        if (orderDate < dateFrom) return false;
      }
      if (dateTo) {
        const orderDate = new Date(o.createdAt).toISOString().split("T")[0];
        if (orderDate > dateTo) return false;
      }

      // 4. Due Date Filters
      if (dueDateFrom && o.dueDate) {
        const dDate = new Date(o.dueDate).toISOString().split("T")[0];
        if (dDate < dueDateFrom) return false;
      }
      if (dueDateTo && o.dueDate) {
        const dDate = new Date(o.dueDate).toISOString().split("T")[0];
        if (dDate > dueDateTo) return false;
      }

      // 5. Delivered Date Filters
      if (deliveredDateFrom && o.deliveredOn) {
        const delDate = new Date(o.deliveredOn).toISOString().split("T")[0];
        if (delDate < deliveredDateFrom) return false;
      }
      if (deliveredDateTo && o.deliveredOn) {
        const delDate = new Date(o.deliveredOn).toISOString().split("T")[0];
        if (delDate > deliveredDateTo) return false;
      }

      // 6. Quantity Filter
      if (minQty && o.totalQty < parseInt(minQty, 10)) return false;

      return true;
    });
  }, [
    enrichedOrders,
    globalSearch,
    orderIdFilter,
    customerFilter,
    vendorFilter,
    statusFilter,
    dateFrom,
    dateTo,
    dueDateFrom,
    dueDateTo,
    deliveredDateFrom,
    deliveredDateTo,
    minQty,
  ]);

  // Sorting
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      let valA: any = 0;
      let valB: any = 0;

      if (sortBy === "id") {
        valA = a.id;
        valB = b.id;
      } else if (sortBy === "date") {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      } else if (sortBy === "dueDate") {
        valA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        valB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      } else if (sortBy === "total") {
        valA = a.total;
        valB = b.total;
      } else if (sortBy === "quantity") {
        valA = a.totalQty;
        valB = b.totalQty;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredOrders, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedOrders.slice(startIndex, startIndex + pageSize);
  }, [sortedOrders, currentPage, pageSize]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Order ID",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Vendor(s)",
      "Order Date",
      "Order Due Date",
      "Quantity",
      "Total (INR)",
      "Status",
      "Delivered On",
      "Remarks"
    ];

    const rows = sortedOrders.map((o) => [
      `#${o.id}`,
      `"${o.customerName}"`,
      `"${o.user?.email || ''}"`,
      `"${o.shippingPhone || ''}"`,
      `"${o.vendorNames}"`,
      new Date(o.createdAt).toLocaleDateString("en-IN"),
      o.dueDate ? new Date(o.dueDate).toLocaleDateString("en-IN") : "N/A",
      o.totalQty,
      o.total,
      o.status,
      o.deliveredOn ? new Date(o.deliveredOn).toLocaleDateString("en-IN") : "N/A",
      `"${(o.remarks || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `femazon_orders_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order);
    setStatusFormData({
      status: order.status || "PLACED",
      remarks: order.remarks || "",
      dueDate: order.dueDate ? new Date(order.dueDate).toISOString().split("T")[0] : "",
      deliveredOn: order.deliveredOn ? new Date(order.deliveredOn).toISOString().split("T")[0] : "",
    });
  };

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);
    try {
      await onAction("UPDATE_ORDER_STATUS", {
        orderId: selectedOrder.id,
        status: statusFormData.status,
        remarks: statusFormData.remarks,
        dueDate: statusFormData.dueDate || null,
        deliveredOn: statusFormData.deliveredOn || null,
      });
      setSelectedOrder(null);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
              Fulfillment &amp; Logistics
            </span>
            <span className="text-xs text-stone-500">&bull; Multi-Vendor Order Tracking</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">Orders Management</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor customer orders, track vendor deliveries, manage due dates, and export transaction logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-[#4A1513] hover:bg-[#350B0A] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
        
        {/* Row 1: Global Search + Status + Page Size */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Global Search (Order ID, Customer, Vendor, City, Remarks)..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF7F5] rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-stone-900 placeholder:text-stone-400 border border-stone-200 focus:outline-none focus:border-[#4A1513]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#4A1513]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PLACED">Placed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 whitespace-nowrap">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#4A1513]"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>

        {/* Row 2: Granular Filters (Order ID, Customer, Vendor, Min Qty) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100 text-xs">
          <div>
            <input
              type="text"
              placeholder="Filter Order ID..."
              value={orderIdFilter}
              onChange={(e) => {
                setOrderIdFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#4A1513]"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Filter Customer Name..."
              value={customerFilter}
              onChange={(e) => {
                setCustomerFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#4A1513]"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Filter Vendor Name..."
              value={vendorFilter}
              onChange={(e) => {
                setVendorFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#4A1513]"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Min Quantity (e.g. 2)..."
              value={minQty}
              onChange={(e) => {
                setMinQty(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF7F5] border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#4A1513]"
            />
          </div>
        </div>

        {/* Row 3: Date Ranges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-stone-100 text-xs">
          
          {/* Order Date Range */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Order Date Range
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                className="w-1/2 bg-[#FAF7F5] border border-stone-200 rounded-lg px-2 py-1 text-[11px]"
              />
              <span className="text-stone-400">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                className="w-1/2 bg-[#FAF7F5] border border-stone-200 rounded-lg px-2 py-1 text-[11px]"
              />
            </div>
          </div>

          {/* Due Date Range */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Due Date Range
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={dueDateFrom}
                onChange={(e) => { setDueDateFrom(e.target.value); setCurrentPage(1); }}
                className="w-1/2 bg-[#FAF7F5] border border-stone-200 rounded-lg px-2 py-1 text-[11px]"
              />
              <span className="text-stone-400">to</span>
              <input
                type="date"
                value={dueDateTo}
                onChange={(e) => { setDueDateTo(e.target.value); setCurrentPage(1); }}
                className="w-1/2 bg-[#FAF7F5] border border-stone-200 rounded-lg px-2 py-1 text-[11px]"
              />
            </div>
          </div>

          {/* Delivered Date Range */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Delivered Date Range
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={deliveredDateFrom}
                onChange={(e) => { setDeliveredDateFrom(e.target.value); setCurrentPage(1); }}
                className="w-1/2 bg-[#FAF7F5] border border-stone-200 rounded-lg px-2 py-1 text-[11px]"
              />
              <span className="text-stone-400">to</span>
              <input
                type="date"
                value={deliveredDateTo}
                onChange={(e) => { setDeliveredDateTo(e.target.value); setCurrentPage(1); }}
                className="w-1/2 bg-[#FAF7F5] border border-stone-200 rounded-lg px-2 py-1 text-[11px]"
              />
            </div>
          </div>

        </div>

        {/* Clear Filters Helper */}
        <div className="flex justify-between items-center text-xs pt-2">
          <span className="text-stone-500">
            Showing <strong>{sortedOrders.length}</strong> matching orders (out of {orders.length} total)
          </span>
          {(globalSearch || orderIdFilter || customerFilter || vendorFilter || statusFilter !== "ALL" || dateFrom || dateTo || dueDateFrom || dueDateTo || deliveredDateFrom || deliveredDateTo || minQty) && (
            <button
              type="button"
              onClick={() => {
                setGlobalSearch("");
                setOrderIdFilter("");
                setCustomerFilter("");
                setVendorFilter("");
                setStatusFilter("ALL");
                setDateFrom("");
                setDateTo("");
                setDueDateFrom("");
                setDueDateTo("");
                setDeliveredDateFrom("");
                setDeliveredDateTo("");
                setMinQty("");
                setCurrentPage(1);
              }}
              className="text-[#4A1513] font-bold hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>

      </div>

      {/* Advanced Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F5] border-b border-stone-200 text-stone-500 uppercase tracking-wider font-bold text-[10.5px]">
              <tr>
                <th className="px-4 py-4 cursor-pointer hover:text-stone-900" onClick={() => toggleSort("id")}>
                  <div className="flex items-center gap-1">
                    <span>Order ID</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-4 py-4">Customer Name</th>
                <th className="px-4 py-4">Vendor(s)</th>
                <th className="px-4 py-4 cursor-pointer hover:text-stone-900" onClick={() => toggleSort("date")}>
                  <div className="flex items-center gap-1">
                    <span>Order Date</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-4 py-4 cursor-pointer hover:text-stone-900" onClick={() => toggleSort("dueDate")}>
                  <div className="flex items-center gap-1">
                    <span>Due Date</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-4 py-4 text-center cursor-pointer hover:text-stone-900" onClick={() => toggleSort("quantity")}>
                  <div className="flex items-center justify-center gap-1">
                    <span>Qty</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-4 py-4 cursor-pointer hover:text-stone-900" onClick={() => toggleSort("total")}>
                  <div className="flex items-center gap-1">
                    <span>Total</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Delivered On</th>
                <th className="px-4 py-4">Remarks</th>
                <th className="px-4 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-12 text-stone-400">
                    <ShoppingCart size={36} className="mx-auto mb-2 text-stone-300 stroke-1" />
                    <p className="font-medium text-sm text-stone-600">No orders match the selected filters</p>
                    <p className="text-xs text-stone-400 mt-0.5">Try clearing filter conditions or checking back later.</p>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((o) => {
                  const statusColors: any = {
                    PLACED: "bg-blue-50 text-blue-800 border-blue-200",
                    PROCESSING: "bg-amber-50 text-amber-800 border-amber-200",
                    SHIPPED: "bg-purple-50 text-purple-800 border-purple-200",
                    DELIVERED: "bg-emerald-50 text-emerald-800 border-emerald-200",
                    CANCELLED: "bg-rose-50 text-rose-800 border-rose-200",
                  };

                  return (
                    <tr 
                      key={o.id} 
                      className={`hover:bg-[#FAF7F5]/50 transition ${
                        o.isOverdue ? "bg-rose-50/40" : ""
                      }`}
                    >
                      {/* Order ID with Overdue Flag */}
                      <td className="px-4 py-3.5 font-mono font-bold text-stone-900">
                        <div className="flex items-center gap-1.5">
                          <span>#{o.id}</span>
                          {o.isOverdue && (
                            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300" title="Order Overdue!">
                              OVERDUE
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Customer Name */}
                      <td className="px-4 py-3.5 font-bold text-stone-900">
                        <p className="truncate max-w-[140px]">{o.customerName}</p>
                        <p className="text-stone-400 text-[10.5px] truncate max-w-[140px] font-normal">{o.user?.email}</p>
                      </td>

                      {/* Vendor Name */}
                      <td className="px-4 py-3.5 text-stone-700">
                        <div className="flex items-center gap-1 text-[11px] truncate max-w-[140px]">
                          <Store size={12} className="text-amber-800 shrink-0" />
                          <span className="truncate">{o.vendorNames}</span>
                        </div>
                      </td>

                      {/* Order Date */}
                      <td className="px-4 py-3.5 text-stone-600 text-[11px] whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>

                      {/* Order Due Date */}
                      <td className="px-4 py-3.5 text-[11px] whitespace-nowrap">
                        {o.dueDate ? (
                          <span className={o.isOverdue ? "text-rose-700 font-bold" : "text-stone-600"}>
                            {new Date(o.dueDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short"
                            })}
                          </span>
                        ) : (
                          <span className="text-stone-400 italic">Unscheduled</span>
                        )}
                      </td>

                      {/* Quantity */}
                      <td className="px-4 py-3.5 text-center font-bold text-stone-800">
                        {o.totalQty}
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3.5 font-serif font-bold text-stone-900">
                        ₹{o.total}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${statusColors[o.status] || "bg-stone-100 text-stone-800"}`}>
                          {o.status}
                        </span>
                      </td>

                      {/* Delivered On */}
                      <td className="px-4 py-3.5 text-stone-600 text-[11px] whitespace-nowrap">
                        {o.deliveredOn ? (
                          <span className="text-emerald-700 font-medium">
                            {new Date(o.deliveredOn).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short"
                            })}
                          </span>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>

                      {/* Remarks */}
                      <td className="px-4 py-3.5 text-stone-500 text-[11px] truncate max-w-[130px]">
                        {o.remarks || <span className="text-stone-300">-</span>}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(o)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#4A1513] text-stone-700 hover:text-white font-bold text-[11px] transition cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
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
            <span className="text-stone-500">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i;
                  if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                }
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-[#4A1513] text-white"
                        : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
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

      {/* ORDER DETAIL DRAWER & STATUS UPDATER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#4A1513]/10 text-[#4A1513] flex items-center justify-center font-bold">
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">Order #{selectedOrder.id} Details</h3>
                  <p className="text-xs text-stone-500">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-5 text-xs">
              
              {/* Customer & Shipping Details */}
              <div className="bg-[#FAF7F5] p-4 rounded-2xl border border-stone-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">Customer &amp; Shipping</p>
                <div className="grid grid-cols-2 gap-3 text-stone-800">
                  <div>
                    <p className="font-bold text-sm text-stone-900">{selectedOrder.customerName}</p>
                    <p className="text-stone-500 mt-0.5">{selectedOrder.user?.email}</p>
                    <p className="text-stone-500">{selectedOrder.shippingPhone || "No phone provided"}</p>
                  </div>
                  <div>
                    <p className="text-stone-700 leading-relaxed">
                      {selectedOrder.shippingAddr || "No street address snapshot"}<br />
                      {selectedOrder.shippingCity && `${selectedOrder.shippingCity}, `}
                      {selectedOrder.shippingState} {selectedOrder.shippingPin}
                    </p>
                    <p className="mt-1 font-semibold text-stone-600">Payment: {selectedOrder.paymentMethod || "COD"}</p>
                  </div>
                </div>
              </div>

              {/* Order Line Items & Vendor Attribution */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                  Order Items ({selectedOrder.items?.length || 0})
                </p>
                <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-100">
                  {(!selectedOrder.items || selectedOrder.items.length === 0) ? (
                    <div className="p-4 text-center text-stone-400">No item details recorded.</div>
                  ) : (
                    selectedOrder.items.map((it: any) => {
                      const itemVendor = it.product?.vendor?.vendorProfile?.businessName || it.product?.vendor?.name || `Vendor #${it.product?.vendorId || "N/A"}`;
                      return (
                        <div key={it.id} className="p-3.5 flex items-center justify-between bg-white hover:bg-stone-50/50">
                          <div className="flex items-center gap-3">
                            <img
                              src={it.product?.image || "/images/placeholder.jpg"}
                              alt={it.product?.name || "Product"}
                              className="w-12 h-12 rounded-xl object-cover border border-stone-200 bg-stone-100"
                            />
                            <div>
                              <p className="font-bold text-stone-900 text-xs">{it.product?.name || "Product Item"}</p>
                              <p className="text-stone-400 text-[10.5px]">
                                Vendor: <strong className="text-amber-800">{itemVendor}</strong>
                                {it.size && ` &bull; Size: ${it.size}`}
                                {it.color && ` &bull; Color: ${it.color}`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-stone-900 text-xs">₹{it.price} &times; {it.quantity || 1}</p>
                            <p className="text-[11px] font-bold text-[#4A1513]">₹{(it.price * (it.quantity || 1))}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-[#FAF7F5] p-3.5 rounded-xl border border-stone-100 flex items-center justify-between text-sm">
                <span className="font-bold text-stone-700">Total Order Amount</span>
                <span className="font-serif font-bold text-lg text-[#4A1513]">₹{selectedOrder.total}</span>
              </div>

              {/* Status Tracking & History Update Form */}
              <form onSubmit={handleUpdateOrderStatus} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-700">Update Order Tracking</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-bold uppercase text-stone-500 mb-1">Status</label>
                    <select
                      value={statusFormData.status}
                      onChange={(e) => setStatusFormData({ ...statusFormData, status: e.target.value })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#4A1513]"
                    >
                      <option value="PLACED">Placed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold uppercase text-stone-500 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={statusFormData.dueDate}
                      onChange={(e) => setStatusFormData({ ...statusFormData, dueDate: e.target.value })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#4A1513]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-bold uppercase text-stone-500 mb-1">Delivered Date</label>
                    <input
                      type="date"
                      value={statusFormData.deliveredOn}
                      onChange={(e) => setStatusFormData({ ...statusFormData, deliveredOn: e.target.value })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#4A1513]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold uppercase text-stone-500 mb-1">Remarks / Note</label>
                    <input
                      type="text"
                      placeholder="e.g. Courier tracking #123456"
                      value={statusFormData.remarks}
                      onChange={(e) => setStatusFormData({ ...statusFormData, remarks: e.target.value })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#4A1513]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingStatus}
                    className="px-5 py-2.5 rounded-xl bg-[#4A1513] hover:bg-[#350B0A] text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-60 cursor-pointer"
                  >
                    {isUpdatingStatus ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                    <span>Update Order Details</span>
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
