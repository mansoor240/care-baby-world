import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";
import { formatDate } from "../../lib/format";

const empty = {
  code: "", type: "percentage", value: 10,
  minOrderAmount: 0, active: true,
  expiresAt: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10),
};

export default function AdminCoupons() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => api.get("/admin/coupons").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      const payload = {
        ...editing,
        value: Number(editing.value),
        minOrderAmount: Number(editing.minOrderAmount),
        expiresAt: new Date(editing.expiresAt).toISOString(),
      };
      if (editing._id) await api.put(`/admin/coupons/${editing._id}`, payload);
      else await api.post("/admin/coupons", payload);
      toast.success("Saved");
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.error || "Save failed");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete coupon?")) return;
    await api.delete(`/admin/coupons/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Coupons</h1>
        <button onClick={() => setEditing({ ...empty })} className="rounded-full bg-ink-900 px-5 py-2.5 text-sm text-white">
          + Add Coupon
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-xs text-ink-500">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Type</th>
              <th className="p-3">Value</th>
              <th className="p-3">Min Order</th>
              <th className="p-3">Expires</th>
              <th className="p-3">Active</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c._id} className="border-t border-ink-900/5">
                <td className="p-3 font-mono font-semibold">{c.code}</td>
                <td className="p-3 text-xs capitalize">{c.type}</td>
                <td className="p-3">
                  {c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}
                </td>
                <td className="p-3">₹{c.minOrderAmount}</td>
                <td className="p-3 text-xs">{formatDate(c.expiresAt)}</td>
                <td className="p-3">{c.active ? "✅" : "—"}</td>
                <td className="p-3 text-right">
                  <button onClick={() => setEditing({ ...c, expiresAt: c.expiresAt.slice(0, 10) })} className="mr-2 text-blush-500">Edit</button>
                  <button onClick={() => remove(c._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr><td colSpan="7" className="p-8 text-center text-ink-500">No coupons yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/40 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-md rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl">{editing._id ? "Edit" : "New"} coupon</h2>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Code</span>
                <input
                  value={editing.code}
                  onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })}
                  className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-2.5 text-sm font-mono"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Type</span>
                <select
                  value={editing.type}
                  onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                  className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-2.5 text-sm"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed (₹)</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Value</span>
                <input type="number" value={editing.value}
                  onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                  className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-2.5 text-sm" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Min order amount (₹)</span>
                <input type="number" value={editing.minOrderAmount}
                  onChange={(e) => setEditing({ ...editing, minOrderAmount: e.target.value })}
                  className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-2.5 text-sm" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Expiry date</span>
                <input type="date" value={editing.expiresAt}
                  onChange={(e) => setEditing({ ...editing, expiresAt: e.target.value })}
                  className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-2.5 text-sm" />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!editing.active}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
                Active
              </label>
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