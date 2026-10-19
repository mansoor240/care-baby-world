import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronDown, MessageCircle, Search, Send } from "lucide-react";
import api from "../api/client";
import { whatsappLink, whatsappMessages } from "../lib/whatsapp";

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState({});
  const [showAskForm, setShowAskForm] = useState(false);
  const [askForm, setAskForm] = useState({ name: "", mobile: "", email: "", question: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get("/faqs")
      .then((r) => setFaqs(r.data))
      .catch(() => toast.error("Could not load FAQs"))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = {};
  filtered.forEach((f) => {
    const cat = f.category || "General";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(f);
  });

  const submitQuestion = async (e) => {
    e.preventDefault();
    if (askForm.question.trim().length < 5)
      return toast.error("Question must be at least 5 characters");

    setSubmitting(true);
    try {
      await api.post("/faqs/ask", askForm);
      toast.success("Thanks! We'll get back to you soon.");
      setAskForm({ name: "", mobile: "", email: "", question: "" });
      setShowAskForm(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not send question");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="skeleton h-16 rounded-2xl" />
        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-16 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <nav className="text-xs text-ink-500 dark:text-night-400">
        <Link to="/" className="hover:text-ink-900 transition dark:hover:text-night-50">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-900 dark:text-night-50">FAQ</span>
      </nav>

      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-blush-50 px-4 py-1.5 text-xs font-medium text-blush-500 dark:bg-blush-400/15 dark:text-blush-300">
          ❓ Help Center
        </div>
        <h1 className="mt-4 font-display text-4xl text-ink-900 dark:text-night-50">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-ink-500 dark:text-night-300">
          Everything you need to know about orders, delivery, payments, and products.
        </p>
      </div>

      {/* Search */}
      <div className="mt-8 relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300 dark:text-night-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions… e.g. delivery, return, payment"
          className="w-full rounded-full border border-ink-900/10 bg-white pl-12 pr-4 py-3.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-blush-400 focus:outline-none dark:border-white/10 dark:bg-night-800 dark:text-night-50 dark:placeholder:text-night-400"
        />
      </div>

      {/* No FAQs */}
      {faqs.length === 0 && (
        <div className="mt-10 rounded-3xl bg-white p-12 text-center shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
          <div className="text-4xl">📝</div>
          <h3 className="mt-3 font-display text-xl text-ink-900 dark:text-night-50">No FAQs yet</h3>
          <p className="mt-2 text-sm text-ink-500 dark:text-night-300">
            Have a question? Ask us below and we'll answer it.
          </p>
        </div>
      )}

      {/* Search no results */}
      {faqs.length > 0 && filtered.length === 0 && (
        <div className="mt-10 rounded-3xl bg-white p-12 text-center shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
          <div className="text-4xl">🔍</div>
          <h3 className="mt-3 font-display text-xl text-ink-900 dark:text-night-50">
            No matching questions
          </h3>
          <p className="mt-2 text-sm text-ink-500 dark:text-night-300">
            Try different keywords or ask us directly.
          </p>
        </div>
      )}

      {/* Categories */}
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="mt-10">
          <h2 className="mb-3 font-display text-xl text-ink-900 dark:text-night-50">{cat}</h2>
          <div className="space-y-2">
            {items.map((item) => {
              const isOpen = openItems[item._id];
              return (
                <div
                  key={item._id}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? "border-blush-200 bg-white shadow-card dark:border-blush-400/30 dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5"
                      : "border-ink-900/5 bg-white dark:border-white/5 dark:bg-night-800"
                  }`}
                >
                  <button
                    onClick={() => toggle(item._id)}
                    className="flex w-full items-start justify-between gap-4 p-4 text-left"
                  >
                    <span className="font-medium text-ink-900 dark:text-night-50">{item.question}</span>
                    <ChevronDown
                      size={18}
                      className={`mt-0.5 shrink-0 text-ink-400 dark:text-night-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <p className="px-4 pb-4 whitespace-pre-line text-sm leading-relaxed text-ink-700 dark:text-night-100">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Ask a question */}
      <div className="mt-12 rounded-4xl bg-sage-50 p-8 text-center dark:bg-night-800 dark:ring-1 dark:ring-white/5">
        <h3 className="font-display text-2xl text-ink-900 dark:text-night-50">
          Still have a question?
        </h3>
        <p className="mt-2 text-sm text-ink-500 dark:text-night-300">
          Send us your question and we'll reply within 2 hours during store hours.
        </p>

        {!showAskForm ? (
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setShowAskForm(true)}
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-700 transition-all hover:shadow-soft hover:-translate-y-0.5 active:scale-95 dark:bg-blush-500 dark:hover:bg-blush-400"
            >
              <Send size={16} /> Ask a question
            </button>
            <a
              href={whatsappLink(whatsappMessages.support)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-sage-500 px-6 py-3 text-sm font-medium text-white hover:bg-sage-400 transition-all hover:shadow-soft hover:-translate-y-0.5 active:scale-95"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>
        ) : (
          <form
            onSubmit={submitQuestion}
            className="mx-auto mt-6 max-w-lg rounded-3xl bg-white p-6 text-left shadow-card dark:bg-night-700 dark:shadow-none dark:ring-1 dark:ring-white/10"
          >
            <h4 className="font-display text-lg text-ink-900 dark:text-night-50">
              Ask your question
            </h4>

            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-night-100">
                  Your Name{" "}
                  <span className="text-xs font-normal text-ink-500 dark:text-night-400">
                    (optional)
                  </span>
                </span>
                <input
                  type="text"
                  value={askForm.name}
                  onChange={(e) => setAskForm({ ...askForm, name: e.target.value })}
                  placeholder="e.g. Priya (or leave blank)"
                  className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-blush-400 focus:outline-none dark:border-white/10 dark:bg-night-600 dark:text-night-50 dark:placeholder:text-night-400"
                />
              </label>

              <div className="rounded-2xl bg-cream/50 p-3 dark:bg-night-800/50">
                <p className="text-xs text-ink-500 dark:text-night-400">
                  Optional — add contact info if you'd like a direct reply.
                </p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-night-100">
                      Mobile
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={askForm.mobile}
                      onChange={(e) =>
                        setAskForm({ ...askForm, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })
                      }
                      placeholder="9876543210"
                      className="w-full rounded-2xl border border-ink-900/10 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-blush-400 focus:outline-none dark:border-white/10 dark:bg-night-600 dark:text-night-50 dark:placeholder:text-night-400"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-night-100">
                      Email
                    </span>
                    <input
                      type="email"
                      value={askForm.email}
                      onChange={(e) => setAskForm({ ...askForm, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-ink-900/10 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-blush-400 focus:outline-none dark:border-white/10 dark:bg-night-600 dark:text-night-50 dark:placeholder:text-night-400"
                    />
                  </label>
                </div>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-night-100">
                  Your Question *
                </span>
                <textarea
                  rows={3}
                  value={askForm.question}
                  onChange={(e) => setAskForm({ ...askForm, question: e.target.value })}
                  placeholder="e.g. Do you have larger sizes for baby blankets?"
                  className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-blush-400 focus:outline-none dark:border-white/10 dark:bg-night-600 dark:text-night-50 dark:placeholder:text-night-400"
                />
              </label>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setShowAskForm(false)}
                className="flex-1 rounded-full border border-ink-900/10 bg-white py-2.5 text-sm font-medium text-ink-900 hover:bg-cream transition dark:border-white/10 dark:bg-night-700 dark:text-night-50 dark:hover:bg-night-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-full bg-ink-900 py-2.5 text-sm font-medium text-white hover:bg-ink-700 disabled:opacity-50 transition dark:bg-blush-500 dark:hover:bg-blush-400"
              >
                {submitting ? "Sending…" : "Send question"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}