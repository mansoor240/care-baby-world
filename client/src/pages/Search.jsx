import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/client";
import ProductGrid from "../components/product/ProductGrid";
import { Search as SearchIcon, X } from "lucide-react";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") || "";

  const [input, setInput] = useState(initialQ);
  const [debouncedQ, setDebouncedQ] = useState(initialQ);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Sync URL q → input on mount / back-button
  useEffect(() => {
    const q = params.get("q") || "";
    setInput(q);
    setDebouncedQ(q);
  }, [params]);

  // Debounce input → debouncedQ (250ms after last keystroke)
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(input.trim());
      // Update URL so refresh/share keeps the query
      if (input.trim()) setParams({ q: input.trim() }, { replace: true });
      else setParams({}, { replace: true });
    }, 250);
    return () => clearTimeout(t);
  }, [input, setParams]);

  // Fetch whenever debouncedQ changes
  useEffect(() => {
    if (!debouncedQ) {
      setResults([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api
      .get("/products", { params: { search: debouncedQ, limit: 24 } })
      .then((r) => {
        if (cancelled) return;
        setResults(r.data.items);
        setTotal(r.data.total);
      })
      .catch(() => {
        if (cancelled) return;
        setResults([]);
        setTotal(0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQ]);

  const clear = () => {
    setInput("");
    setDebouncedQ("");
    setParams({}, { replace: true });
  };

  const isShort = debouncedQ.length > 0 && debouncedQ.length <= 2;
  const resultLabel = isShort
    ? `${total} product${total === 1 ? "" : "s"} starting with`
    : `${total} result${total === 1 ? "" : "s"} for`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-3 text-xs text-ink-500 dark:text-night-400">
        <Link to="/" className="hover:text-ink-900 transition dark:hover:text-night-50">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-900 dark:text-night-50">Search</span>
      </nav>

      <h1 className="font-display text-3xl text-ink-900 dark:text-night-50">Search</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-night-300">
        Type anything — results update as you type.
      </p>

      <div className="mt-5">
        <div className="relative">
          <SearchIcon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300 dark:text-night-400"
          />
          <input
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search — try a letter like A, B, C…"
            autoFocus
            className="w-full rounded-full border border-ink-900/10 bg-white py-3.5 pl-12 pr-12 text-sm text-ink-900 placeholder:text-ink-300 focus:border-blush-400 focus:outline-none dark:border-white/10 dark:bg-night-800 dark:text-night-50 dark:placeholder:text-night-400"
          />
          {input && (
            <button
              type="button"
              onClick={clear}
              aria-label="Clear"
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-cream text-ink-500 hover:bg-blush-50 hover:text-blush-500 dark:bg-night-700 dark:text-night-300 dark:hover:bg-blush-400/20 dark:hover:text-blush-300"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {debouncedQ && !loading && (
          <p className="mb-4 text-sm text-ink-500 dark:text-night-300">
            {resultLabel}{" "}
            <span className="text-ink-900 font-medium dark:text-night-50">
              "{debouncedQ}"
            </span>
          </p>
        )}

        {loading && <ProductGrid loading />}

        {!loading && debouncedQ && results.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-card animate-[fadeIn_0.4s_ease-out] dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blush-50 text-4xl dark:bg-blush-400/15">
              🔍
            </div>
            <h3 className="mt-5 font-display text-xl text-ink-900 dark:text-night-50">
              No products found
            </h3>
            <p className="mt-2 text-sm text-ink-500 dark:text-night-300">
              {isShort
                ? `No products start with "${debouncedQ}". Try another letter.`
                : `Nothing matched "${debouncedQ}". Try a different word.`}
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-700 transition-transform active:scale-95 dark:bg-blush-500 dark:hover:bg-blush-400"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {!loading && !debouncedQ && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blush-50 text-4xl dark:bg-blush-400/15">
              🔍
            </div>
            <h3 className="mt-5 font-display text-xl text-ink-900 dark:text-night-50">
              Start typing
            </h3>
            <p className="mt-2 text-sm text-ink-500 dark:text-night-300">
              Type a letter — products appear instantly below.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && <ProductGrid products={results} />}
      </div>
    </div>
  );
}