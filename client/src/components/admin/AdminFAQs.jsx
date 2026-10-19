import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

const empty = {
  question: "",
  answer: "",
  category: "General",
  order: 0,
  published: true,
};

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/admin-faqs")
      .then((r) => setFaqs(r.data))
      .catch(() => toast.error("Could not load FAQs"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const save = async () => {
    if (!editing.question.trim() || !editing.answer.trim()) {
      return toast.error("Question and answer are required");
    }

    setSaving(true);
    try {
      if (editing._id) {
        await api.put(`/admin-faqs/${editing._id}`, editing);
        toast.success("FAQ updated");
      } else {
        await api.post("/admin-faqs", editing);
        toast.success("FAQ created");
      }
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      await api.delete(`/admin-faqs/${id}`);
      toast.success("FAQ deleted");
      load();
    } catch {
      toast.error("Could not delete");
    }
  };

  const togglePublished = async (faq) => {
    try {
      await api.put(`/admin-faqs/${faq._id}`, {
        ...faq,
        published: !faq.published,
      });
      toast.success(faq.published ? "Unpublished" : "Published");
      load();
    } catch {
      toast.error("Could not update");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">FAQs</h1>
          <p className="mt-1 text-sm text-ink-500">
            {faqs.length} question{faqs.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...empty })}
          className="flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-ink-700"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {loading && (
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 rounded-3xl" />
          ))}
        </div>
      )}

      {!loading && faqs.length === 0 && (
        <div className="mt-6 rounded-3xl bg-white p-12 text-center shadow-card">
          <div className="text-4xl">📝</div>
          <h3 className="mt-3 font-display text-xl">No FAQs yet</h3>
          <p className="mt-2 text-sm text-ink-500">
            Add common questions to help your customers.
          </p>
        </div>
      )}

      {!loading && faqs.length > 0 && (
        <div className="mt-6 space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq._id}
              className={`rounded-3xl bg-white p-5 shadow-card ${
                !faq.published ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blush-50 px-2 py-0.5 text-xs font-semibold text-blush-500">
                      {faq.category}
                    </span>
                    {!faq.published && (
                      <span className="rounded-full bg-sand-100 px-2 py-0.5 text-xs font-semibold text-sand-500">
                        UNPUBLISHED
                      </span>
                    )}
                  </div>
                  <div className="mt-2 font-medium text-ink-900">
                    {faq.question}
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm text-ink-500">
                    {faq.answer}
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => togglePublished(faq)}
                    className="grid h-8 w-8 place-items-center rounded-full text-ink-500 hover:bg-cream"
                    title={faq.published ? "Unpublish" : "Publish"}
                  >
                    {faq.published ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => setEditing(faq)}
                    className="grid h-8 w-8 place-items-center rounded-full text-blush-500 hover:bg-blush-50"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => remove(faq._id)}
                    className="grid h-8 w-8 place-items-center rounded-full text-red-500 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="font-display text-xl">
              {editing._id ? "Edit FAQ" : "New FAQ"}
            </h2>

            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-700">
                  Question *
                </span>
                <input
                  value={editing.question}
                  onChange={(e) =>
                    setEditing({ ...editing, question: e.target.value })
                  }
                  placeholder="e.g. How long does delivery take?"
                  className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm focus:border-blush-400 focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-700">
                  Answer *
                </span>
                <textarea
                  rows={5}
                  value={editing.answer}
                  onChange={(e) =>
                    setEditing({ ...editing, answer: e.target.value })
                  }
                  placeholder="Detailed answer..."
                  className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm focus:border-blush-400 focus:outline-none"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink-700">
                    Category
                  </span>
                  <input
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
                    placeholder="e.g. Delivery"
                    className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm focus:border-blush-400 focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink-700">
                    Order (lower = first)
                  </span>
                  <input
                    type="number"
                    value={editing.order}
                    onChange={(e) =>
                      setEditing({ ...editing, order: e.target.value })
                    }
                    className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm focus:border-blush-400 focus:outline-none"
                  />
                </label>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.published}
                  onChange={(e) =>
                    setEditing({ ...editing, published: e.target.checked })
                  }
                />
                Published (visible to customers)
              </label>
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
                disabled={saving}
                className="rounded-full bg-ink-900 px-5 py-2 text-sm text-white hover:bg-ink-700 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}