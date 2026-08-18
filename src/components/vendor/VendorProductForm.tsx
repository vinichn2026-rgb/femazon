"use client";

import { useState } from "react";

type FormState = {
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: string;
};

export function VendorProductForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
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
    setForm({ name: "", slug: "", description: "", price: "", stock: "" });
  };

  return (
    <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-600">Vendor product tools</p>
          <h2 className="mt-3 text-2xl font-semibold">Add new product stock</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Product name"
          className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
        />
        <input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          placeholder="Slug (unique)"
          className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Short product description"
          className="col-span-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
          rows={4}
        />
        <input
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="Price (in rupees)"
          type="number"
          className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
        />
        <input
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          placeholder="Stock quantity"
          type="number"
          className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="col-span-full inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          {isSubmitting ? "Saving..." : "Add product"}
        </button>
      </form>

      {message ? <p className="mt-4 text-sm text-zinc-600">{message}</p> : null}
    </section>
  );
}
