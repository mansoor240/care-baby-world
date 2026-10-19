import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";
import { Check, X, Trash2 } from "lucide-react";

const STATUS_STYLES = {
  pending:  "bg-sand-100 text-sand-500",
  answered: "bg-sage-100 text-sage-500",
  ignored:  "bg-ink-900/10 text-ink-500",
};

const formatDate = (d) =>
  new Date(d).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  const load = () => {
    setLoading(true);
    api
      .get("/admin-faqs/questions", { params: { status: filter } })
      .then((r) => setQuestions(r.data))
      .catch(() => toast.error("Could not load questions"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/admin-faqs/questions/${id}`, { status });
      toast.success(`Marked as ${status}`);
      load();
    } catch {
      toast.error("Could not update");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this question?")) return;
    try {
      await api.delete(`/admin-faqs/questions/${id}`);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Could not delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">Customer Questions</h1>
          <p className="mt-1 text-sm text-ink-500">
            {questions.length} question{questions.length === 1 ? "" : "s"}
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm"
        >
          <option value="pending">Pending</option>
          <option value="answered">Answered</option>
          <option value="ignored">Ignored</option>
          <option value="">All</option>
        </select>
      </div>

      {loading && (
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 rounded-3xl" />
          ))}
        </div>
      )}

      {!loading && questions.length === 0 && (
        <div className="mt-6 rounded-3xl bg-white p-12 text-center shadow-card">
          <div className="text-4xl">💬</div>
          <h3 className="mt-3 font-display text-xl">No questions</h3>
          <p className="mt-2 text-sm text-ink-500">
            {filter === "pending"
              ? "All caught up! No pending questions."
              : "No questions in this category."}
          </p>
        </div>
      )}

      {!loading && questions.length > 0 && (
        <div className="mt-6 space-y-3">
          {questions.map((q) => (
            <div key={q._id} className="rounded-3xl bg-white p-5 shadow-card">
                            <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-ink-900">
                  {q.name || "Anonymous"}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                    STATUS_STYLES[q.status]
                  }`}
                >
                  {q.status}
                </span>
                <span className="text-xs text-ink-500">
                  {formatDate(q.createdAt)}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-3 text-xs text-ink-500">
                {q.mobile && (
                  <a
                    href={`tel:${q.mobile}`}
                    className="hover:text-ink-900"
                  >
                    📞 {q.mobile}
                  </a>
                )}
                {q.email && (
                  <a
                    href={`mailto:${q.email}`}
                    className="hover:text-ink-900"
                  >
                    ✉️ {q.email}
                  </a>
                )}
              </div>

              <p className="mt-3 whitespace-pre-line text-sm text-ink-700">
                {q.question}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {q.status !== "answered" && (
                  <button
                    onClick={() => setStatus(q._id, "answered")}
                    className="flex items-center gap-1 rounded-full bg-sage-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sage-400"
                  >
                    <Check size={12} /> Mark answered
                  </button>
                )}
                {q.status !== "ignored" && (
                  <button
                    onClick={() => setStatus(q._id, "ignored")}
                    className="flex items-center gap-1 rounded-full border border-ink-900/10 px-3 py-1.5 text-xs hover:bg-cream"
                  >
                    <X size={12} /> Ignore
                  </button>
                )}
                {q.status !== "pending" && (
                  <button
                    onClick={() => setStatus(q._id, "pending")}
                    className="rounded-full border border-ink-900/10 px-3 py-1.5 text-xs hover:bg-cream"
                  >
                    Reopen
                  </button>
                )}
                <button
                  onClick={() => remove(q._id)}
                  className="ml-auto flex items-center gap-1 rounded-full text-red-500 px-3 py-1.5 text-xs hover:bg-red-50"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}