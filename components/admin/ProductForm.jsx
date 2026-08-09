"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm({ product }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    tagline: product?.tagline || "",
    description: product?.description || "",
    ingredients: product?.ingredients || "",
    price: product ? (product.price / 100).toString() : "",
    category: product?.category || "Herbal Tea",
    images: product?.images?.join(", ") || "",
    stock: product?.stock?.toString() || "100",
    active: product?.active ?? true
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      price: Math.round(Number(form.price) * 100),
      stock: Number(form.stock),
      images: form.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    };

    const url = isEdit ? `/api/products/${product.id}` : "/api/products";
    const method = isEdit ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  const categories = ["Herbal Tea", "Tincture", "Salve & Balm", "Essential Oil", "Body Oil"];

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4 max-w-2xl">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="eyebrow block mb-2">Name</label>
          <input required className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className="eyebrow block mb-2">Slug (URL)</label>
          <input
            className="input"
            placeholder={slugify(form.name) || "auto-generated"}
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="eyebrow block mb-2">Tagline</label>
        <input className="input" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
      </div>

      <div>
        <label className="eyebrow block mb-2">Description</label>
        <textarea required rows={4} className="input" value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>

      <div>
        <label className="eyebrow block mb-2">Ingredients</label>
        <input className="input" value={form.ingredients} onChange={(e) => set("ingredients", e.target.value)} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="eyebrow block mb-2">Price (USD)</label>
          <input required type="number" step="0.01" min="0" className="input" value={form.price} onChange={(e) => set("price", e.target.value)} />
        </div>
        <div>
          <label className="eyebrow block mb-2">Stock</label>
          <input type="number" min="0" className="input" value={form.stock} onChange={(e) => set("stock", e.target.value)} />
        </div>
        <div>
          <label className="eyebrow block mb-2">Category</label>
          <select className="input" value={form.category} onChange={(e) => set("category", e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="eyebrow block mb-2">Image URLs (comma separated)</label>
        <input
          className="input"
          placeholder="https://... , https://..."
          value={form.images}
          onChange={(e) => set("images", e.target.value)}
        />
        <p className="text-xs text-ink/40 mt-1">
          Paste in image links for now — file uploads can be added later with cloud storage.
        </p>
      </div>

      {isEdit && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
          Visible in the shop
        </label>
      )}

      {error && <p className="text-sm text-clay-dark">{error}</p>}

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
