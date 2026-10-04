import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";

const empty = { name: "", slug: "", description: "", emoji: "", color: "blush", order: 0 };

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => api.get("/admin/categories").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (editing._id) await api.put(`/admin/categories/${editing._id}`, editing);
      else await api.post("/admin/categories", editing);
      toast.success("Saved");
      setEditing(null);
      load();
    } catch (e) {
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
        <button onClick={() => setEditing({ ...empty })} className="rounded-full bg-ink-900 px-5 py-2.5 text-sm text-white">
          + Add Category
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <div key={c._id} className="rounded-3xl bg-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <div className="text-2xl">{c.emoji}</div>
              <div className="space-x-2 text-xs">
                <button onClick={() => setEditing(c)} className="text-blush-500">Edit</button>
                <button onClick={() => remove(c._id)} className="text-red-500">Delete</button>
              </div>
            </div>
            <div className="mt-2 font-medium">{c.name}</div>
            <div className="text-xs text-ink-500">{c.slug}</div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/40 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-md rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl">{editing._id ? "Edit" : "New"} category</h2>
            <div className="mt-4 space-y-3">
              {[
                ["Name", "name"],
                ["Slug (optional)", "slug"],
                ["Emoji", "emoji"],
                ["Description", "description"],
              ].map(([label, key]) => (
                <label key={key} className="block">
                  <span className="mb-1 block text-xs font-medium">{label}</span>
                  <input
                    value={editing[key] || ""}
                    onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
                    className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-2.5 text-sm"
                  />
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-full border px-5 py-2 text-sm">Cancel</button>
              <button onClick={save} className="rounded-full bg-ink-900 px-5 py-2 text-sm text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}