import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";
import { formatPrice } from "../../lib/format";
import {
  Upload, X, Loader2, ImagePlus, AlertTriangle, Save,
  PackageX, Plus, Trash2, Copy,
} from "lucide-react";

const emptyVariant = () => ({
  name: "",
  sku: "",
  price: 0,
  originalPrice: 0,
  stock: 0,
});

const empty = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  categorySlug: "",
  images: [],
  price: 0,
  originalPrice: 0,
  stock: 0,
  sku: "",
  brand: "CareBabyStore",
  ageRange: "",
  sizes: [],
  colors: [],
  features: [],
  featured: false,
  bestseller: false,
  rating: 0,
  reviewCount: 0,
  hasVariants: false,
  variants: [],
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  const [stockEdits, setStockEdits] = useState({});
  const [savingStock, setSavingStock] = useState(false);
  const [batchMode, setBatchMode] = useState(false);

  const load = async () => {
    const [p, c] = await Promise.all([
      api.get("/admin/products"),
      api.get("/admin/categories"),
    ]);
    setProducts(p.data);
    setCategories(c.data);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing({ ...empty });
    setShowForm(true);
  };
  const openEdit = (p) => {
    setEditing({
      ...empty,
      ...p,
      images: p.images || [],
      hasVariants: p.hasVariants || false,
      variants: p.variants || [],
    });
    setShowForm(true);
  };

  const save = async () => {
    setBusy(true);
    try {
      const payload = {
        ...editing,
        price: Number(editing.price) || 0,
        originalPrice: Number(editing.originalPrice) || 0,
        stock: Number(editing.stock) || 0,
        variants: (editing.variants || []).map((v) => ({
          ...v,
          price: Number(v.price) || 0,
          originalPrice: Number(v.originalPrice) || 0,
          stock: Number(v.stock) || 0,
        })),
      };

      if (editing.hasVariants) {
        if (payload.variants.length === 0) {
          toast.error("Add at least one variant");
          setBusy(false);
          return;
        }
        const invalid = payload.variants.find(
          (v) => !v.name?.trim() || !v.sku?.trim() || v.price <= 0
        );
        if (invalid) {
          toast.error("Each variant needs name, SKU, and price");
          setBusy(false);
          return;
        }
      } else {
        // Simple product: strip variants so server doesn't mis-calc
        payload.variants = [];
      }

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

  const saveAllStock = async () => {
    const edits = Object.entries(stockEdits);
    if (edits.length === 0) return toast.error("No stock changes to save");

    setSavingStock(true);
    try {
      await Promise.all(
        edits.map(([id, stock]) =>
          api.put(`/admin/products/${id}`, { stock: Number(stock) })
        )
      );
      toast.success(`Updated ${edits.length} product${edits.length === 1 ? "" : "s"}`);
      setStockEdits({});
      setBatchMode(false);
      load();
    } catch {
      toast.error("Could not save all stock");
    } finally {
      setSavingStock(false);
    }
  };

  const quickStockUpdate = async (product, delta) => {
    const newStock = Math.max(0, (product.stock || 0) + delta);
    try {
      await api.put(`/admin/products/${product._id}`, { stock: newStock });
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, stock: newStock } : p))
      );
      toast.success(`${product.name}: stock ${newStock}`, { duration: 1000 });
    } catch {
      toast.error("Could not update stock");
    }
  };

  const lowStock = products.filter((p) => !p.hasVariants && p.stock > 0 && p.stock < 10);
  const outOfStock = products.filter((p) => !p.hasVariants && p.stock === 0);
  const variantsLow = products.filter(
    (p) => p.hasVariants && p.variants?.some((v) => v.stock > 0 && v.stock < 10)
  );
  const variantsOut = products.filter(
    (p) => p.hasVariants && p.variants?.some((v) => v.stock === 0)
  );

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">Products</h1>
          <p className="mt-1 text-sm text-ink-500">{products.length} products</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setBatchMode(!batchMode)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              batchMode ? "bg-blush-500 text-white" : "border border-ink-900/10 bg-white text-ink-900"
            }`}
          >
            {batchMode ? "Exit Batch Mode" : "Batch Update Stock"}
          </button>
          <button
            onClick={openCreate}
            className="rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-white"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Alerts */}
      {(lowStock.length > 0 ||
        outOfStock.length > 0 ||
        variantsOut.length > 0 ||
        variantsLow.length > 0) && (
        <div className="mt-4 space-y-2">
          {outOfStock.length > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
              <PackageX size={20} className="shrink-0 text-red-500" />
              <div className="flex-1">
                <div className="font-medium text-red-700">
                  {outOfStock.length} product{outOfStock.length === 1 ? "" : "s"} out of stock
                </div>
              </div>
            </div>
          )}
          {variantsOut.length > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
              <PackageX size={20} className="shrink-0 text-red-500" />
              <div className="flex-1">
                <div className="font-medium text-red-700">
                  {variantsOut.length} variant product{variantsOut.length === 1 ? "" : "s"} with out-of-stock variants
                </div>
              </div>
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-sand-200 bg-sand-50 p-4">
              <AlertTriangle size={20} className="shrink-0 text-sand-500" />
              <div className="flex-1">
                <div className="font-medium text-sand-700">
                  {lowStock.length} product{lowStock.length === 1 ? "" : "s"} low on stock
                </div>
              </div>
            </div>
          )}
          {variantsLow.length > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-sand-200 bg-sand-50 p-4">
              <AlertTriangle size={20} className="shrink-0 text-sand-500" />
              <div className="flex-1">
                <div className="font-medium text-sand-700">
                  {variantsLow.length} variant product{variantsLow.length === 1 ? "" : "s"} with low-stock variants
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {batchMode && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-blush-50 p-4">
          <div className="text-sm text-ink-700">
            Edit stock for <strong>simple products</strong> below. Variant products must be edited individually. Click <strong>Save All</strong>.
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setStockEdits({}); setBatchMode(false); }}
              className="rounded-full border border-ink-900/10 px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={saveAllStock}
              disabled={savingStock || Object.keys(stockEdits).length === 0}
              className="flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2 text-sm text-white disabled:opacity-50"
            >
              {savingStock ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save All ({Object.keys(stockEdits).length})
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-xs text-ink-500">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Type</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const isLow = !p.hasVariants && p.stock > 0 && p.stock < 10;
              const isOut = !p.hasVariants && p.stock === 0;
              const editValue = stockEdits[p._id] ?? p.stock;
              const totalVariantStock = (p.variants || []).reduce(
                (s, v) => s + (v.stock || 0),
                0
              );
              const variantCount = p.variants?.length || 0;

              return (
                <tr key={p._id} className="border-t border-ink-900/5">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          className="h-10 w-10 rounded-xl object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-cream text-ink-300">
                          <ImagePlus size={16} />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-ink-900">{p.name}</div>
                        <div className="text-xs text-ink-500">{p.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-xs">
                    {p.hasVariants ? (
                      <span className="rounded-full bg-lavender-100 px-2 py-0.5 font-medium text-lavender-500">
                        {variantCount} variant{variantCount === 1 ? "" : "s"}
                      </span>
                    ) : (
                      <span className="text-ink-500">Simple</span>
                    )}
                  </td>
                  <td className="p-3">{formatPrice(p.price)}</td>
                  <td className="p-3">
                    {p.hasVariants ? (
                      // Variant products: read-only + Edit link
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${
                              totalVariantStock === 0
                                ? "text-red-500"
                                : totalVariantStock < 10
                                ? "text-sand-500"
                                : "text-sage-500"
                            }`}
                          >
                            {totalVariantStock}
                          </span>
                          <span className="text-xs text-ink-500">
                            across {variantCount} variant{variantCount === 1 ? "" : "s"}
                          </span>
                        </div>
                        <button
                          onClick={() => openEdit(p)}
                          className="w-fit text-xs text-blush-500 hover:underline"
                        >
                          Update variant stock →
                        </button>
                      </div>
                    ) : batchMode ? (
                      <input
                        type="number"
                        min="0"
                        value={editValue}
                        onChange={(e) =>
                          setStockEdits({ ...stockEdits, [p._id]: e.target.value })
                        }
                        className="w-20 rounded-lg border border-ink-900/20 bg-white px-2 py-1 text-sm"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => quickStockUpdate(p, -1)}
                          className="grid h-6 w-6 place-items-center rounded-full bg-cream text-xs hover:bg-red-50"
                        >
                          −
                        </button>
                        <span
                          className={`min-w-[2rem] text-center font-medium ${
                            isOut ? "text-red-500" : isLow ? "text-sand-500" : "text-sage-500"
                          }`}
                        >
                          {p.stock}
                        </span>
                        <button
                          onClick={() => quickStockUpdate(p, 1)}
                          className="grid h-6 w-6 place-items-center rounded-full bg-cream text-xs hover:bg-sage-50"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => openEdit(p)} className="mr-2 text-blush-500">
                      Edit
                    </button>
                    <button onClick={() => remove(p._id)} className="text-red-500">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {!products.length && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-ink-500">
                  No products yet.
                </td>
              </tr>
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
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFilePick = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const newUrls = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name}: not an image`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: over 5MB`);
        continue;
      }
      try {
        const formData = new FormData();
        formData.append("image", file);
        const { data } = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        newUrls.push(data.url);
      } catch (err) {
        toast.error(err.response?.data?.error || `${file.name}: upload failed`);
      }
    }
    if (newUrls.length > 0) {
      set({ images: [...(value.images || []), ...newUrls] });
      toast.success(`${newUrls.length} image${newUrls.length === 1 ? "" : "s"} uploaded`);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (url) =>
    set({ images: (value.images || []).filter((u) => u !== url) });

  const moveImage = (from, to) => {
    const imgs = [...(value.images || [])];
    const [moved] = imgs.splice(from, 1);
    imgs.splice(to, 0, moved);
    set({ images: imgs });
  };

  const addVariant = () => {
    set({
      variants: [
        ...(value.variants || []),
        {
          ...emptyVariant(),
          name: "",
          sku: `${value.sku || "SKU"}-${(value.variants?.length || 0) + 1}`,
        },
      ],
    });
  };

  const updateVariant = (idx, patch) => {
    const next = [...(value.variants || [])];
    next[idx] = { ...next[idx], ...patch };
    set({ variants: next });
  };

  const removeVariant = (idx) => {
    set({ variants: (value.variants || []).filter((_, i) => i !== idx) });
  };

  const duplicateVariant = (idx) => {
    const v = value.variants[idx];
    const copy = { ...v, name: `${v.name} (Copy)`, sku: `${v.sku}-COPY` };
    set({ variants: [...value.variants, copy] });
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink-900/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">
            {value._id ? "Edit product" : "New product"}
          </h2>
          <button onClick={onClose} className="text-ink-500">
            ✕
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <F label="Name" v={value.name} on={(v) => set({ name: v })} />
          <F label="Slug (optional)" v={value.slug} on={(v) => set({ slug: v })} />
          <div className="sm:col-span-2">
            <F
              label="Short description"
              v={value.shortDescription}
              on={(v) => set({ shortDescription: v })}
            />
          </div>
          <div className="sm:col-span-2">
            <FLabel label="Description">
              <textarea
                rows={3}
                value={value.description}
                onChange={(e) => set({ description: e.target.value })}
                className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm"
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
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </FLabel>
          <F label="SKU (base)" v={value.sku} on={(v) => set({ sku: v })} />
          <F label="Brand" v={value.brand} on={(v) => set({ brand: v })} />
          <F label="Age range" v={value.ageRange} on={(v) => set({ ageRange: v })} />

          {/* VARIANT TOGGLE */}
          <div className="sm:col-span-2 rounded-2xl border-2 border-dashed border-lavender-200 bg-lavender-50 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!value.hasVariants}
                onChange={(e) => {
                  const hasVariants = e.target.checked;
                  set({
                    hasVariants,
                    variants:
                      hasVariants && (value.variants?.length || 0) === 0
                        ? [{ ...emptyVariant() }]
                        : value.variants,
                  });
                }}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-lavender-700">
                  This product has variants
                </div>
                <div className="text-xs text-lavender-500 mt-1">
                  Enable for products like Pampers (Size 1, Size 2, Size 3) or
                  Lactogen (Stage 1, Stage 2). Each variant has its own SKU,
                  price, and stock.
                </div>
              </div>
            </label>
          </div>

          {/* VARIANT LIST */}
          {value.hasVariants ? (
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm text-ink-900">
                  Variants ({(value.variants || []).length})
                </h3>
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-1.5 rounded-full bg-lavender-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-lavender-600"
                >
                  <Plus size={12} /> Add Variant
                </button>
              </div>

              <div className="space-y-3">
                {(value.variants || []).map((v, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-ink-900/10 bg-white p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-ink-700">
                        Variant {idx + 1}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => duplicateVariant(idx)}
                          className="text-ink-500 hover:text-ink-900"
                          title="Duplicate"
                        >
                          <Copy size={14} />
                        </button>
                        {value.variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(idx)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <F
                        label="Variant name *"
                        v={v.name}
                        on={(val) => updateVariant(idx, { name: val })}
                        placeholder="e.g. Size 1 - 30pc"
                      />
                      <F
                        label="Variant SKU *"
                        v={v.sku}
                        on={(val) => updateVariant(idx, { sku: val })}
                        placeholder="e.g. PAM-S1-30"
                      />
                      <F
                        label="Price (₹) *"
                        type="number"
                        v={v.price}
                        on={(val) => updateVariant(idx, { price: val })}
                      />
                      <F
                        label="Original price (₹)"
                        type="number"
                        v={v.originalPrice}
                        on={(val) => updateVariant(idx, { originalPrice: val })}
                      />
                      <F
                        label="Stock *"
                        type="number"
                        v={v.stock}
                        on={(val) => updateVariant(idx, { stock: val })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <F
                label="Price (₹)"
                type="number"
                v={value.price}
                on={(v) => set({ price: v })}
              />
              <F
                label="Original price (₹)"
                type="number"
                v={value.originalPrice}
                on={(v) => set({ originalPrice: v })}
              />
              <F
                label="Stock"
                type="number"
                v={value.stock}
                on={(v) => set({ stock: v })}
              />
            </>
          )}

          {/* Images */}
          <div className="sm:col-span-2">
            <FLabel label="Product Images">
              <div className="space-y-3">
                <div
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink-900/15 p-6 transition hover:border-blush-400 hover:bg-blush-50 ${
                    uploading ? "opacity-50 cursor-wait" : ""
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 size={24} className="animate-spin text-blush-500" />
                      <div className="text-sm text-ink-500">Uploading…</div>
                    </>
                  ) : (
                    <>
                      <Upload size={24} className="text-blush-500" />
                      <div className="text-sm font-medium text-ink-900">
                        Click to upload images
                      </div>
                      <div className="text-xs text-ink-500">
                        PNG, JPG, WebP · Max 5MB · Multiple allowed
                      </div>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilePick}
                  className="hidden"
                />
                {value.images?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {value.images.map((url, i) => (
                      <div
                        key={url}
                        className="group relative aspect-square overflow-hidden rounded-2xl border border-ink-900/10 bg-cream"
                      >
                        <img src={url} alt="" className="h-full w-full object-cover" />
                        {i === 0 && (
                          <span className="absolute left-1 top-1 rounded-full bg-blush-400 px-2 py-0.5 text-[9px] font-bold text-white">
                            MAIN
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                        {i > 0 && (
                          <button
                            type="button"
                            onClick={() => moveImage(i, 0)}
                            className="absolute bottom-1 left-1 rounded-full bg-ink-900/70 px-2 py-0.5 text-[9px] font-medium text-white opacity-0 transition group-hover:opacity-100"
                          >
                            Make main
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FLabel>
          </div>

          <F
            label="Features (comma separated)"
            v={(value.features || []).join(", ")}
            on={(v) =>
              set({
                features: v
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
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
          <button
            onClick={onClose}
            className="rounded-full border border-ink-900/10 px-5 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={busy || uploading}
            className="rounded-full bg-ink-900 px-5 py-2 text-sm text-white disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function F({ label, v, on, type = "text", placeholder }) {
  return (
    <FLabel label={label}>
      <input
        type={type}
        value={v ?? ""}
        onChange={(e) => on(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm focus:border-blush-400 focus:outline-none"
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