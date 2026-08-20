"use client";

import { useState } from "react";
import { Sparkles, Users, Store, Package, Grid, CalendarDays, ShoppingCart, CheckCircle, XCircle, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminClient({ users, vendors, products, categories, orders, bookings, services }: any) {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  const handleAction = async (action: string, payload: any) => {
    if (action.includes("DELETE") && !confirm("Are you sure?")) return;
    
    const res = await fetch("/api/admin/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload })
    });
    
    if (!res.ok) {
      const err = await res.json().catch(()=>({}));
      alert(err.error || "Action failed");
      return;
    }
    
    router.refresh(); // Refresh server component data
  };

  const [newCatName, setNewCatName] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    await handleAction("CREATE_CATEGORY", { name: newCatName });
    setNewCatName("");
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white min-h-screen fixed left-0 top-0 hidden md:flex flex-col z-50">
        <div className="p-6 border-b border-primary">
          <h2 className="font-serif text-2xl font-bold">Admin Portal</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'overview', icon: <Grid size={18}/>, label: 'Overview' },
            { id: 'users', icon: <Users size={18}/>, label: 'Users' },
            { id: 'vendors', icon: <Store size={18}/>, label: 'Vendors' },
            { id: 'products', icon: <Package size={18}/>, label: 'Products' },
            { id: 'categories', icon: <Grid size={18}/>, label: 'Categories' },
            { id: 'services', icon: <Sparkles size={18}/>, label: 'Services' },
            { id: 'orders', icon: <ShoppingCart size={18}/>, label: 'Orders' },
            { id: 'bookings', icon: <CalendarDays size={18}/>, label: 'Bookings' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${activeTab === tab.id ? 'bg-primary text-white' : 'text-zinc-400 hover:bg-primary hover:text-white'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        <div className="mb-10">
          <h1 className="font-serif text-3xl font-bold text-primary mb-2 capitalize">{activeTab}</h1>
          <p className="text-sm text-zinc-500">Manage {activeTab} across the platform.</p>
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mb-2">Total Users</p>
              <p className="text-4xl font-serif text-primary">{users.length}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mb-2">Total Vendors</p>
              <p className="text-4xl font-serif text-primary">{vendors.length}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mb-2">Products</p>
              <p className="text-4xl font-serif text-primary">{products.length}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mb-2">Total Orders</p>
              <p className="text-4xl font-serif text-primary">{orders.length}</p>
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 border-b border-zinc-100 text-xs font-bold uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Name / Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-zinc-50/50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-primary text-sm">{u.name || "N/A"}</p>
                      <p className="text-zinc-500 text-xs">{u.email}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold">
                      <span className={`px-2 py-1 rounded bg-zinc-100 ${u.role === 'ADMIN' ? 'text-rose-600' : 'text-zinc-600'}`}>{u.role}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'ADMIN' && (
                        <button onClick={() => handleAction("DELETE_USER", { userId: u.id })} className="text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VENDORS */}
        {activeTab === 'vendors' && (
          <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 border-b border-zinc-100 text-xs font-bold uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Store Name</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {vendors.map((v: any) => (
                  <tr key={v.id} className="hover:bg-zinc-50/50">
                    <td className="px-6 py-4 font-bold text-primary text-sm">{v.businessName || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500">{v.user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${v.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{v.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {v.status !== 'APPROVED' && (
                        <button onClick={() => handleAction("APPROVE_VENDOR", { vendorId: v.id })} className="text-emerald-600 font-bold text-xs uppercase tracking-widest hover:underline">
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowProductForm(!showProductForm)} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary transition">
                <Plus size={16}/> {showProductForm ? "Cancel" : "Add Product"}
              </button>
            </div>

            {showProductForm && (
              <form onSubmit={async (e) => {
                e.preventDefault();
                const target = e.target as any;
                const name = target.name.value;
                const price = target.price.value;
                const category = target.category.value;
                const stock = target.stock.value;
                const image = target.image.value;
                if(!name || !price) return;
                await handleAction("CREATE_PRODUCT", { name, price, category, stock, image });
                target.reset();
                setShowProductForm(false);
              }} className="mb-6 bg-white p-6 rounded-3xl shadow-sm border border-zinc-100 flex flex-col gap-4">
                <h3 className="font-bold text-primary">Add Native Product</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <input required name="name" type="text" placeholder="Product Name" className="rounded-xl border px-4 py-3 text-sm focus:border-primary col-span-2" />
                  <input required name="price" type="number" placeholder="Price (₹)" className="rounded-xl border px-4 py-3 text-sm focus:border-primary" />
                  <input required name="stock" type="number" placeholder="Stock" className="rounded-xl border px-4 py-3 text-sm focus:border-primary" />
                  <input name="category" type="text" placeholder="Category (e.g. Kurtis)" className="rounded-xl border px-4 py-3 text-sm focus:border-primary col-span-2" />
                  
                  <div className="col-span-2 flex items-center gap-2">
                    <input name="image" type="text" placeholder="Image URL (or upload)" className="rounded-xl border px-4 py-3 text-sm focus:border-primary flex-1" id="admin-product-img" />
                    <label className="cursor-pointer bg-zinc-100 px-4 py-3 rounded-xl font-bold text-xs hover:bg-zinc-200 transition shrink-0 whitespace-nowrap">
                      {uploadingImage ? "Uploading..." : "Upload File"}
                      <input type="file" accept="image/*" className="hidden" disabled={uploadingImage} onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingImage(true);
                        const data = new FormData();
                        data.append("file", file);
                        const res = await fetch("/api/upload", { method: "POST", body: data });
                        const result = await res.json();
                        setUploadingImage(false);
                        if (result.url) {
                          const imgInput = document.getElementById("admin-product-img") as HTMLInputElement;
                          if(imgInput) imgInput.value = result.url;
                        }
                      }} />
                    </label>
                  </div>
                </div>
                <button type="submit" className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark transition w-max mt-2">Publish Product</button>
              </form>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
              <table className="w-full text-left">
              <thead className="bg-zinc-50 border-b border-zinc-100 text-xs font-bold uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.map((p: any) => (
                  <tr key={p.id} className="hover:bg-zinc-50/50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={p.image} className="w-10 h-10 rounded object-cover" />
                      <span className="font-bold text-primary text-sm truncate max-w-[200px]">{p.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">₹{p.price}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500">{p.vendor?.name || `Vendor #${p.vendorId}`}</td>
                    <td className="px-6 py-4 text-xs font-bold">
                      <span className={`px-2 py-1 rounded ${p.approvalStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : p.approvalStatus === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                        {p.approvalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      {p.approvalStatus !== 'APPROVED' && (
                        <button onClick={() => handleAction("APPROVE_PRODUCT", { productId: p.id })} className="text-emerald-600 hover:text-emerald-700"><CheckCircle size={18}/></button>
                      )}
                      {p.approvalStatus !== 'REJECTED' && (
                        <button onClick={() => handleAction("REJECT_PRODUCT", { productId: p.id })} className="text-red-500 hover:text-red-700"><XCircle size={18}/></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CATEGORIES */}
        {activeTab === 'categories' && (
          <div>
            <form onSubmit={handleAddCategory} className="mb-6 flex gap-3">
              <input 
                type="text" 
                placeholder="New Category Name (e.g. Footwear)" 
                value={newCatName} 
                onChange={e => setNewCatName(e.target.value)}
                className="rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-primary flex-1"
              />
              <button type="submit" className="bg-primary text-white px-6 rounded-xl font-bold text-sm hover:bg-primary transition">Add</button>
            </form>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((c: any) => (
                <div key={c.id} className="bg-white p-4 rounded-2xl border border-zinc-100 flex justify-between items-center shadow-sm">
                  <span className="font-bold text-primary">{c.name}</span>
                  <button onClick={() => handleAction("DELETE_CATEGORY", { categoryId: c.id })} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS & BOOKINGS (Read-Only for Admin overview) */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 border-b border-zinc-100 text-xs font-bold uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map((o: any) => (
                  <tr key={o.id}>
                    <td className="px-6 py-4 font-mono text-sm text-zinc-600">#{o.id}</td>
                    <td className="px-6 py-4 font-bold text-primary text-sm">{o.user.email}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500">₹{o.total}</td>
                    <td className="px-6 py-4 text-xs font-bold"><span className="px-2 py-1 rounded bg-blue-50 text-blue-600">{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SERVICES */}
        {activeTab === 'services' && (
          <div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const target = e.target as any;
              const name = target.name.value;
              const description = target.description.value;
              const price = target.price.value;
              const duration = target.duration.value;
              const image = target.image.value;
              if(!name) return;
              await handleAction("CREATE_SERVICE", { name, description, price, duration, image });
              target.reset();
            }} className="mb-6 bg-white p-6 rounded-3xl shadow-sm border border-zinc-100 flex flex-col gap-4">
              <h3 className="font-bold text-primary">Add New Service</h3>
              <div className="grid grid-cols-2 gap-4">
                <input required name="name" type="text" placeholder="Service Name" className="rounded-xl border px-4 py-3 text-sm focus:border-primary" />
                <input name="price" type="number" placeholder="Price (₹)" className="rounded-xl border px-4 py-3 text-sm focus:border-primary" />
                <input name="duration" type="number" placeholder="Duration (mins)" className="rounded-xl border px-4 py-3 text-sm focus:border-primary" />
                <input name="image" type="text" placeholder="Image URL" className="rounded-xl border px-4 py-3 text-sm focus:border-primary" />
                <textarea name="description" placeholder="Description" className="rounded-xl border px-4 py-3 text-sm focus:border-primary col-span-2 resize-none" rows={2} />
              </div>
              <button type="submit" className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary transition w-max">Create Service</button>
            </form>

            <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 border-b border-zinc-100 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  <tr>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Price / Duration</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {services?.map((s: any) => (
                    <tr key={s.id}>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img src={s.image || "/images/placeholder.jpg"} className="w-10 h-10 rounded object-cover" />
                        <div>
                          <p className="font-bold text-primary text-sm">{s.name}</p>
                          <p className="text-xs text-zinc-500 truncate max-w-sm">{s.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-500">₹{s.price} / {s.duration} mins</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleAction("DELETE_SERVICE", { serviceId: s.id })} className="text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 border-b border-zinc-100 text-xs font-bold uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date/Time</th>
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {bookings.map((b: any) => (
                  <tr key={b.id}>
                    <td className="px-6 py-4 font-bold text-primary text-sm">{b.service?.name}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500">{b.user?.email}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500">{b.date} {b.time}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500">{b.provider?.name || "Unassigned"}</td>
                    <td className="px-6 py-4 text-xs font-bold">
                      <span className={`px-2 py-1 rounded ${b.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' : b.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {b.status !== 'CONFIRMED' && (
                        <button onClick={() => handleAction("UPDATE_BOOKING_STATUS", { bookingId: b.id, status: 'CONFIRMED' })} className="text-emerald-600 text-xs font-bold uppercase tracking-widest hover:underline">Confirm</button>
                      )}
                      {b.status !== 'CANCELLED' && (
                        <button onClick={() => handleAction("UPDATE_BOOKING_STATUS", { bookingId: b.id, status: 'CANCELLED' })} className="text-red-600 text-xs font-bold uppercase tracking-widest hover:underline">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}
