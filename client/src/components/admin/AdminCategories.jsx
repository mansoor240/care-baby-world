import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";
import { CategoryIcons, getCategoryIcon } from "../../components/categoryIcons";

const ICON_KEYS = Object.keys(CategoryIcons);

const empty = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  color: "blush",
  order: 0,
};

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => api.get("/admin/categories").then((r) => setItems(r.data));
  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    try {
      if (editing._id) await api.put(`/admin/categories/${editing._id}`, editing);
      else await api.post("/admin/categories", editing);
      toast.success("Saved");
      setEditing(null);
      load();
    } catch {
      toast.error("Save failed");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete category?")) return;
    await api.delete(`/admin/categories/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Categories</h1>
        <button
          onClick={() => setEditing({ ...empty })}
          className="rounded-full bg-ink-900 px-5 py-2.5 text-sm text-white"
        >
          + Add Category
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <div key={c._id} className="rounded-3xl bg-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-blush-50 text-blush-500">
                {getCategoryIcon(c.icon || c.slug)}
              </div>
              <div className="space-x-2 text-xs">
                <button onClick={() => setEditing(c)} className="text-blush-500">
                  Edit
                </button>
                <button onClick={() => remove(c._id)} className="text-red-500">
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-2 font-medium">{c.name}</div>
            <div className="text-xs text-ink-500">{c.slug}</div>
            {c.icon && (
              <div className="mt-1 text-[11px] text-ink-400">Icon: {c.icon}</div>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink-900/40 p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-xl">
              {editing._id ? "Edit" : "New"} category
            </h2>

            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Name</span>
                <input
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-2.5 text-sm"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium">Slug (optional)</span>
                <input
                  value={editing.slug || ""}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-2.5 text-sm"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium">Description</span>
                <textarea
                  rows={2}
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-2.5 text-sm"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium">
                  Icon
                  <span className="ml-1 text-ink-400">— leave blank to auto-match by slug</span>
                </span>
                <select
                  value={editing.icon || ""}
                  onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                  className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-2.5 text-sm"
                >
                  <option value="">Auto (by slug)</option>
                  {ICON_KEYS.map((k) => (
                    <option key={k} value={k}>
                      {k.replace(/-/g, " ")}
                    </option>
                  ))}
                </select>
              </label>

              {/* Icon preview */}
              <div className="flex items-center gap-3 rounded-2xl bg-cream p-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-blush-50 text-blush-500">
                  {getCategoryIcon(editing.icon || editing.slug || "")}
                </div>
                <div className="text-xs text-ink-500">
                  Preview — this is how the icon will look on the storefront.
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="rounded-full border border-ink-900/10 px-5 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="rounded-full bg-ink-900 px-5 py-2 text-sm text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}