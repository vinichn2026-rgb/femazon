"use client";

import { useState } from "react";

type FormState = {
  name: string;
  slug: string;
  category: string;
  description: string;
  price: string;
  stock: string;
};

const CATEGORIES = [
  "Sarees",
  "Kurtas & Kurta Sets",
  "Lehengas",
  "Salwar Suits",
  "Anarkali",
  "Sharara & Gharara",
  "Ethnic Dresses",
  "Tops & Shirts",
  "Dresses",
  "Co-ord Sets",
  "Trousers & Pants",
  "Skirts",
  "Jumpsuits",
  "Jackets",
  "Footwear",
  "Handbags",
  "Jewellery",
  "Fashion Accessories",
  "Innerwear & Loungewear",
  "Skincare",
  "Haircare",
  "Makeup",
  "Bath & Body",
  "Personal Hygiene",
  "Feminine Hygiene",
  "Grooming Essentials",
  "Beauty Tools",
  "Gift Hampers",
  "Flowers",
  "Chocolates",
  "Cakes",
  "Personalized Gifts",
  "Jewellery Gifts",
  "Beauty Gift Boxes",
  "Self-care Hampers",
  "Dry Fruit Hampers",
  "Plants",
  "Customized Gift Boxes",
];

export function VendorProductForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    category: "Sarees",
    description: "",
    price: "",
    stock: "",
  });
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price) * 100,
        stock: Number(form.stock),
      }),
    });

    const result = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(result.error || "Failed to add product.");
      return;
    }

    setMessage(`Product "${result.name}" added successfully.`);
    setForm({ name: "", slug: "", category: "Sarees", description: "", price: "", stock: "" });
  };

  return (
    <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#4A1513]">Vendor Product Tools</p>
          <h2 className="mt-3 text-2xl font-semibold">Add New Women's Wear Product</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Product name"
          className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
        />
        <input
          required
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          placeholder="Slug (unique)"
          className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
        />
        <div className="col-span-full sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
            Category *
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="col-span-full sm:col-span-1 flex gap-4">
          <input
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Price (in ₹)"
            type="number"
            className="w-1/2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
          />
          <input
            required
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            placeholder="Stock Qty"
            type="number"
            className="w-1/2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
          />
        </div>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Short product description, fabric and sizing guidance"
          className="col-span-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
          rows={3}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="col-span-full inline-flex items-center justify-center rounded-full bg-[#4A1513] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#38100e] disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          {isSubmitting ? "Saving..." : "Add Product"}
        </button>
      </form>
      {message && <p className="mt-4 text-sm font-medium text-emerald-600">{message}</p>}
    </section>
  );
}
