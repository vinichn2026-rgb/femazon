"use client";

import { useState, useEffect } from "react";
import { Store, Package, ShoppingCart, Plus, Edit2, Trash2, Grid, User, Archive, TrendingUp } from "lucide-react";

export default function DashboardClient({ vendorProfile }: { vendorProfile: any }) {
  const [activeTab, setActiveTab] = useState("overview");
  
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", discountPrice: "", category: "Dresses", subcategory: "", stock: "", image: "", images: "", sizes: "", colors: "", sku: ""
  });

  const fetchProducts = async () => {
    const res = await fetch("/api/seller/products");
    if (res.ok) setProducts(await res.json());
  };

  const fetchOrders = async () => {
    const res = await fetch("/api/seller/orders");
    if (res.ok) setOrders(await res.json());
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchProducts();
      await fetchOrders();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAddProduct = async (status: string) => {
    // Convert multiline images string to an array
    const imageArray = formData.images.split('\n').map(u => u.trim()).filter(Boolean);
    
    // We still set a main `image` for backward compatibility, using the first from `images` or the standalone `image` field.
    const mainImage = formData.image || imageArray[0] || "";

    const method = editingProductId ? "PUT" : "POST";
    const url = editingProductId ? `/api/seller/products/${editingProductId}` : "/api/seller/products";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        images: imageArray.length > 0 ? imageArray : null,
        image: mainImage,
        status
      })
    });
    if (res.ok) {
      setShowAddForm(false);
      setEditingProductId(null);
      setFormData({ name: "", description: "", price: "", discountPrice: "", category: "Dresses", subcategory: "", stock: "", image: "", images: "", sizes: "", colors: "", sku: "" });
      fetchProducts();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || data.message || "Failed to add product. Please check all required fields (Name, Price, Stock).");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data
      });
      const result = await res.json();
      
      if (res.ok && result.url) {
        setFormData(prev => ({
          ...prev,
          images: prev.images ? prev.images + '\n' + result.url : result.url
        }));
      } else {
        alert(result.error || "Upload failed");
      }
    } catch (err) {
      alert("Network error during upload");
    } finally {
      setUploadingImage(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(`/api/seller/products/${id}`, { method: "DELETE" });
    if (res.ok) fetchProducts();
  };

  const handleOrderStatus = async (orderItemId: number, newStatus: string) => {
    const res = await fetch(`/api/seller/orders/${orderItemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) fetchOrders();
  };

  const handleUpdateStock = async (id: number, currentStock: number) => {
    const newStockStr = prompt("Enter new stock quantity:", currentStock.toString());
    if (newStockStr === null) return;
    const newStock = parseInt(newStockStr);
    if (isNaN(newStock) || newStock < 0) return alert("Invalid stock number.");

    const res = await fetch(`/api/seller/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: newStock })
    });
    if (res.ok) fetchProducts();
  };

  const handleTogglePublish = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "DRAFT" ? "PENDING" : "DRAFT";
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

    const res = await fetch(`/api/seller/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approvalStatus: newStatus })
    });
    if (res.ok) fetchProducts();
  };

  const handleEditProduct = (p: any) => {
    setEditingProductId(p.id);
    let parsedImages = "";
    try {
      if (p.images) {
        const arr = JSON.parse(p.images);
        if (Array.isArray(arr)) parsedImages = arr.join('\n');
      }
    } catch (e) {
      parsedImages = p.images || "";
    }

    setFormData({
      name: p.name,
      description: p.description || "",
      price: p.price.toString(),
      discountPrice: p.discountPrice?.toString() || "",
      category: p.category || "Dresses",
      subcategory: p.subcategory || "",
      stock: p.stock.toString(),
      image: p.image || "",
      images: parsedImages,
      sizes: p.sizes || "",
      colors: p.colors || "",
      sku: p.sku || ""
    });
    setShowAddForm(true);
  };

  // Compute stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.approvalStatus === 'APPROVED').length;
  const pendingProducts = products.filter(p => p.approvalStatus === 'PENDING').length;
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + (o.quantity * o.price), 0);

  const TABS = [
    { id: 'overview', icon: <Grid size={18} />, label: 'Overview' },
    { id: 'products', icon: <Package size={18} />, label: 'Products' },
    { id: 'inventory', icon: <Archive size={18} />, label: 'Inventory' },
    { id: 'orders', icon: <ShoppingCart size={18} />, label: 'Orders' },
    { id: 'sales', icon: <TrendingUp size={18} />, label: 'Sales' },
    { id: 'profile', icon: <User size={18} />, label: 'Profile' }
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-accent/20 hidden md:block">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Store className="text-primary" />
            <span className="font-serif text-xl font-bold text-text-main truncate">{vendorProfile.businessName}</span>
          </div>
          
          <nav className="space-y-2">
            {TABS.map(tab => (
              <button 
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowAddForm(false);
                  setEditingProductId(null);
                  setFormData({ name: "", description: "", price: "", discountPrice: "", category: "Dresses", subcategory: "", stock: "", image: "", images: "", sizes: "", colors: "", sku: "" });
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${activeTab === tab.id ? "bg-primary/10 text-primary" : "text-zinc-500 hover:bg-zinc-50"}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="font-serif text-3xl font-bold text-text-main mb-2 capitalize">
              {activeTab}
            </h1>
            <p className="text-sm text-text-muted">Manage your store and grow your business.</p>
          </div>
          {activeTab === 'products' && !showAddForm && (
            <button 
              onClick={() => {
                setEditingProductId(null);
                setFormData({ name: "", description: "", price: "", discountPrice: "", category: "Dresses", subcategory: "", stock: "", image: "", images: "", sizes: "", colors: "", sku: "" });
                setShowAddForm(true);
              }}
              className="bg-text-main text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full flex items-center gap-2 hover:bg-primary transition shadow-md"
            >
              <Plus size={16} /> Add Product
            </button>
          )}
        </header>

        {loading ? (
          <div className="text-zinc-500">Loading data...</div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Total Products</p>
                  <p className="text-3xl font-serif text-text-main">{totalProducts}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Active Products</p>
                  <p className="text-3xl font-serif text-emerald-700">{activeProducts}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-amber-100">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">Pending Products</p>
                  <p className="text-3xl font-serif text-amber-700">{pendingProducts}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Total Orders</p>
                  <p className="text-3xl font-serif text-text-main">{totalOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Total Sales</p>
                  <p className="text-3xl font-serif text-text-main">₹{totalSales.toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div>
                {showAddForm ? (
                  <div className="bg-white rounded-[2rem] p-8 border border-accent/20 shadow-sm max-w-2xl">
                    <h3 className="font-serif text-xl mb-6">Create New Product</h3>
                    <form onSubmit={e => e.preventDefault()} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-zinc-500 mb-1">Product Name</label>
                          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-lg border px-4 py-2" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-zinc-500 mb-1">Description</label>
                          <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full rounded-lg border px-4 py-2 resize-none" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-zinc-500 mb-1">Product Images (URLs)</label>
                          <textarea rows={3} value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} placeholder="https://..." className="w-full rounded-lg border px-4 py-2 resize-none mb-2" />
                          <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-zinc-100 text-zinc-600 px-4 py-2 rounded font-bold text-xs hover:bg-zinc-200 transition flex items-center gap-2">
                              {uploadingImage ? "Uploading..." : "Upload Local Image"}
                              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
                            </label>
                            <span className="text-xs text-zinc-400">Supported: JPG, PNG, WEBP</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 mb-1">Price (₹)</label>
                          <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full rounded-lg border px-4 py-2" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 mb-1">Discount Price (₹)</label>
                          <input type="number" value={formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: e.target.value})} className="w-full rounded-lg border px-4 py-2" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 mb-1">Category</label>
                          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full rounded-lg border px-4 py-2 bg-white">
                            <option>Dresses</option>
                            <option>Sarees</option>
                            <option>Kurtis</option>
                            <option>Jewelry</option>
                            <option>Footwear</option>
                            <option>Accessories</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 mb-1">Subcategory</label>
                          <input type="text" value={formData.subcategory} onChange={e => setFormData({...formData, subcategory: e.target.value})} className="w-full rounded-lg border px-4 py-2" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 mb-1">Stock</label>
                          <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full rounded-lg border px-4 py-2" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 mb-1">SKU</label>
                          <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full rounded-lg border px-4 py-2" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 mb-1">Sizes (Comma separated)</label>
                          <input type="text" placeholder="S, M, L, XL" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} className="w-full rounded-lg border px-4 py-2" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 mb-1">Colors (Comma separated)</label>
                          <input type="text" placeholder="Red, Blue, Black" value={formData.colors} onChange={e => setFormData({...formData, colors: e.target.value})} className="w-full rounded-lg border px-4 py-2" />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-6 border-t mt-6">
                        <button type="button" onClick={() => handleAddProduct('DRAFT')} className="bg-zinc-100 text-zinc-600 px-6 py-3 rounded-lg font-bold text-sm hover:bg-zinc-200">Save Draft</button>
                        <button type="button" onClick={() => handleAddProduct('PENDING')} className="bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-primary-dark">Publish</button>
                        <div className="flex-1"></div>
                        <button type="button" onClick={() => setShowAddForm(false)} className="text-zinc-500 px-6 py-3 rounded-lg font-bold text-sm hover:bg-zinc-50">Cancel</button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="bg-white rounded-[2rem] border border-accent/20 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-zinc-50 border-b border-zinc-100">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Product</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Price</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Stock</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Status</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Created Date</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {products.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">No products added yet.</td>
                          </tr>
                        ) : (
                          products.map(p => (
                            <tr key={p.id} className="hover:bg-zinc-50/50 transition">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded bg-zinc-100 overflow-hidden shrink-0">
                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm text-text-main line-clamp-1">{p.name}</p>
                                    <p className="text-xs text-zinc-500">SKU: {p.sku || "N/A"}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-bold text-primary text-sm">₹{p.price}</td>
                              <td className="px-6 py-4 text-sm font-medium">
                                <button onClick={() => handleUpdateStock(p.id, p.stock)} className="hover:underline text-zinc-700 decoration-zinc-300 underline-offset-2">
                                  {p.stock}
                                </button>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                                  p.approvalStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                                  p.approvalStatus === 'DRAFT' ? 'bg-zinc-100 text-zinc-600' :
                                  p.approvalStatus === 'REJECTED' ? 'bg-red-50 text-red-600' :
                                  'bg-amber-50 text-amber-600'
                                }`}>
                                  {p.approvalStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-zinc-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => handleTogglePublish(p.id, p.approvalStatus)} className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition">
                                    {p.approvalStatus === 'DRAFT' ? 'Publish' : 'Unpublish'}
                                  </button>
                                  <button onClick={() => handleEditProduct(p)} className="p-1.5 text-zinc-400 hover:text-primary transition" title="Edit">
                                    <Edit2 size={16} />
                                  </button>
                                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-zinc-400 hover:text-red-500 transition" title="Delete">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === "inventory" && (
              <div className="bg-white rounded-[2rem] border border-accent/20 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50 border-b border-zinc-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Product</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Category</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Stock Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">No inventory data.</td>
                      </tr>
                    ) : (
                      products.map(p => (
                        <tr key={p.id} className="hover:bg-zinc-50/50 transition">
                          <td className="px-6 py-4 font-bold text-sm text-text-main">{p.name}</td>
                          <td className="px-6 py-4 text-sm text-zinc-500">{p.category}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${p.stock > 10 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : p.stock > 0 ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                              {p.stock > 0 ? `${p.stock} In Stock` : 'Out of Stock'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sales Tab */}
            {activeTab === "sales" && (
              <div className="bg-white p-8 rounded-[2rem] border border-accent/20 shadow-sm text-center">
                <TrendingUp size={48} className="mx-auto text-primary mb-4" />
                <h3 className="font-serif text-2xl text-text-main mb-2">Sales Analytics</h3>
                <p className="text-zinc-500 max-w-md mx-auto">Detailed sales graphs and revenue reports will be available in the next version of the platform.</p>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white p-8 rounded-[2rem] border border-accent/20 shadow-sm max-w-2xl">
                <h3 className="font-serif text-2xl text-text-main mb-6">Business Profile</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Business Name</p>
                    <p className="font-medium text-lg">{vendorProfile.businessName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Owner</p>
                    <p className="font-medium text-lg">{vendorProfile.ownerName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Contact</p>
                    <p className="font-medium">{vendorProfile.email || "N/A"} • {vendorProfile.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Address</p>
                    <p className="font-medium">{vendorProfile.address || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</p>
                    <span className="inline-block mt-1 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {vendorProfile.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-[2rem] border border-accent/20 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50 border-b border-zinc-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Order ID</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Product</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Customer City</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Date</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Item Status</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">No orders received yet.</td>
                      </tr>
                    ) : (
                      orders.map(o => (
                        <tr key={o.id} className="hover:bg-zinc-50/50 transition">
                          <td className="px-6 py-4 font-mono text-sm text-zinc-600">#{o.orderId}</td>
                          <td className="px-6 py-4 font-bold text-sm text-text-main flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-zinc-100 overflow-hidden shrink-0">
                              <img src={o.product?.image || "/images/placeholder.jpg"} className="w-full h-full object-cover" />
                            </div>
                            <span className="truncate max-w-[200px]">{o.product?.name || "Deleted Product"} (x{o.quantity})</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-zinc-600">{o.order.shippingCity || "N/A"}</td>
                          <td className="px-6 py-4 text-sm text-zinc-500">{new Date(o.order.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                              o.status === 'SHIPPED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                              o.status === 'PACKED' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                              o.status === 'CONFIRMED' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                              'bg-zinc-100 text-zinc-600 border border-zinc-200'
                            }`}>
                              {o.status || 'PLACED'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {(!o.status || o.status === 'PLACED') && (
                                <button onClick={() => handleOrderStatus(o.id, 'CONFIRMED')} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded bg-primary text-white hover:bg-zinc-700 transition">Confirm</button>
                              )}
                              {o.status === 'CONFIRMED' && (
                                <button onClick={() => handleOrderStatus(o.id, 'PACKED')} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Pack</button>
                              )}
                              {o.status === 'PACKED' && (
                                <button onClick={() => handleOrderStatus(o.id, 'SHIPPED')} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition">Ship</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
