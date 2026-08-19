"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, FileText, CheckCircle, User, Mail, Phone, MapPin, Tag } from "lucide-react";

export default function SellerRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    businessCategory: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/seller/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.status === 401) {
        setError("Please login first to register as a seller.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Registration failed");
      }

      setSuccess(true);
      // Wait for a few seconds to let them read the pending message, then redirect home
      setTimeout(() => {
        router.push("/");
      }, 5000);

    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="bg-white rounded-[2rem] p-12 shadow-xl border border-emerald-100 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="font-serif text-3xl text-text-main mb-2">Application Received!</h2>
          <p className="text-zinc-500 mb-8">Your vendor profile has been submitted and is currently <strong>Pending Approval</strong>. Our team will review your details shortly.</p>
          <button onClick={() => router.push("/")} className="w-full bg-text-main text-white font-bold text-sm uppercase tracking-widest py-3 rounded-full hover:bg-primary transition shadow-md">
            Return Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl text-text-main mb-4">Become a Seller</h1>
          <p className="text-lg text-text-muted">Start selling your premium fashion products on Femazon to millions of customers.</p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-accent/20">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main flex items-center gap-2">
                  <Store size={16} className="text-primary" /> Business Name *
                </label>
                <input 
                  required 
                  type="text" 
                  value={formData.businessName}
                  onChange={e => setFormData({...formData, businessName: e.target.value})}
                  placeholder="e.g. Elegant Ethnic Wear" 
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main flex items-center gap-2">
                  <User size={16} className="text-primary" /> Owner Name *
                </label>
                <input 
                  required 
                  type="text" 
                  value={formData.ownerName}
                  onChange={e => setFormData({...formData, ownerName: e.target.value})}
                  placeholder="Owner's full name" 
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main flex items-center gap-2">
                  <Mail size={16} className="text-primary" /> Business Email *
                </label>
                <input 
                  required 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="contact@business.com" 
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main flex items-center gap-2">
                  <Phone size={16} className="text-primary" /> Phone Number *
                </label>
                <input 
                  required 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="10-digit mobile number" 
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main flex items-center gap-2">
                <MapPin size={16} className="text-primary" /> Business Address *
              </label>
              <input 
                required 
                type="text" 
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                placeholder="Full address of your registered business" 
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main flex items-center gap-2">
                <Tag size={16} className="text-primary" /> Business Category *
              </label>
              <select
                required
                value={formData.businessCategory}
                onChange={e => setFormData({...formData, businessCategory: e.target.value})}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              >
                <option value="" disabled>Select a category</option>
                <option value="Clothing & Apparel">Clothing & Apparel</option>
                <option value="Jewelry & Accessories">Jewelry & Accessories</option>
                <option value="Footwear">Footwear</option>
                <option value="Beauty & Cosmetics">Beauty & Cosmetics</option>
                <option value="Boutique & Designer">Boutique & Designer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main flex items-center gap-2">
                <FileText size={16} className="text-primary" /> Store Description
              </label>
              <textarea 
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Tell customers about what you sell..." 
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-text-main text-white font-bold text-sm uppercase tracking-widest py-4 rounded-full mt-4 hover:bg-primary transition shadow-md disabled:opacity-50"
            >
              {loading ? "Submitting Application..." : "Apply to Sell"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
