import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";
import { formatPrice } from "../../lib/format";

const empty = {
  name: "", slug: "", description: "", shortDescription: "",
  categorySlug: "", images: [""], price: 0, originalPrice: 0, stock: 0,
  sku: "", brand: "CareBabyStore", ageRange: "", sizes: [], colors: [],
  features: [], featured: false, bestseller: false, rating: 0, reviewCount: 0,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const [p, c] = await Promise.all([
      api.get("/admin/products"),
      api.get("/admin/categories"),
    ]);
    setProducts(p.data);
    setCategories(c.data);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing({ ...empty });
    setShowForm(true);
  };
  const openEdit = (p) => {
    setEditing({ ...p, images: p.images?.length ? p.images : [""] });
    setShowForm(true);
  };

  const save = async () => {
    setBusy(true);
    try {
      const payload = {
        ...editing,
        images: editing.images.filter(Boolean),
        price: Number(editing.price) || 0,
        originalPrice: Number(editing.originalPrice) || 0,
        stock: Number(editing.stock) || 0,
      };
      if (editing._id) await api.put(`/admin/products/${editing._id}`, payload);
      else await api.post("/admin/products", payload);
      toast.success("Saved");
      setShowForm(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.error || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/admin/products/${id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">Products</h1>
          <p className="mt-1 text-sm text-ink-500">{products.length} products</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-white"
        >
          + Add Product
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-xs text-ink-500">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-ink-900/5">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0]} className="h-10 w-10 rounded-xl object-cover" alt="" />
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-ink-500">{p.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-xs capitalize">{p.categorySlug}</td>
                <td className="p-3">{formatPrice(p.price)}</td>
                <td className="p-3">
                  <span className={p.stock > 0 ? "text-sage-500" : "text-red-500"}>
                    {p.stock}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => openEdit(p)} className="mr-2 text-blush-500">Edit</button>
                  <button onClick={() => remove(p._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
            {!products.length && (
              <tr><td colSpan="5" className="p-8 text-center text-ink-500">No products yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && editing && (
        <ProductForm
          value={editing}
          categories={categories}
          onChange={setEditing}
          onSave={save}
          onClose={() => setShowForm(false)}
          busy={busy}
        />
      )}
    </div>
  );
}

function ProductForm({ value, onChange, onSave, onClose, busy, categories }) {
  const set = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/40 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">
            {value._id ? "Edit product" : "New product"}
          </h2>
          <button onClick={onClose} className="text-ink-500">✕</button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <F label="Name" v={value.name} on={(v) => set({ name: v })} />
          <F label="Slug (optional)" v={value.slug} on={(v) => set({ slug: v })} />
          <div className="sm:col-span-2">
            <F label="Short description" v={value.shortDescription} on={(v) => set({ shortDescription: v })} />
          </div>
          <div className="sm:col-span-2">
            <FLabel label="Description">
              <textarea
                rows={4}
                value={value.description}
                onChange={(e) => set({ description: e.target.value })}
                className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm focus:outline-none"
              />
            </FLabel>
          </div>
          <FLabel label="Category">
            <select
              value={value.categorySlug}
              onChange={(e) => set({ categorySlug: e.target.value })}
              className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </FLabel>
          <F label="SKU" v={value.sku} on={(v) => set({ sku: v })} />
          <F label="Price (₹)" type="number" v={value.price} on={(v) => set({ price: v })} />
          <F label="Original price (₹)" type="number" v={value.originalPrice} on={(v) => set({ originalPrice: v })} />
          <F label="Stock" type="number" v={value.stock} on={(v) => set({ stock: v })} />
          <F label="Brand" v={value.brand} on={(v) => set({ brand: v })} />
          <F label="Age range" v={value.ageRange} on={(v) => set({ ageRange: v })} />

          <div className="sm:col-span-2">
            <FLabel label="Image URLs (one per line)">
              <textarea
                rows={3}
                value={value.images.join("\n")}
                onChange={(e) => set({ images: e.target.value.split("\n") })}
                className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-xs focus:outline-none"
              />
            </FLabel>
          </div>

          <F
            label="Sizes (comma separated)"
            v={(value.sizes || []).join(", ")}
            on={(v) => set({ sizes: v.split(",").map((s) => s.trim()).filter(Boolean) })}
          />
          <F
            label="Colors (comma separated)"
            v={(value.colors || []).join(", ")}
            on={(v) => set({ colors: v.split(",").map((s) => s.trim()).filter(Boolean) })}
          />
          <F
            label="Features (comma separated)"
            v={(value.features || []).join(", ")}
            on={(v) => set({ features: v.split(",").map((s) => s.trim()).filter(Boolean) })}
          />

          <div className="flex items-center gap-4 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!value.featured}
                onChange={(e) => set({ featured: e.target.checked })}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!value.bestseller}
                onChange={(e) => set({ bestseller: e.target.checked })}
              />
              Bestseller
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-ink-900/10 px-5 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={busy}
            className="rounded-full bg-ink-900 px-5 py-2 text-sm text-white disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function F({ label, v, on, type = "text" }) {
  return (
    <FLabel label={label}>
      <input
        type={type}
        value={v ?? ""}
        onChange={(e) => on(e.target.value)}
        className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm focus:outline-none"
      />
    </FLabel>
  );
}

function FLabel({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-700">{label}</span>
      {children}
    </label>
  );
}