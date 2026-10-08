import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/client";
import ProductGrid from "../components/product/ProductGrid";
import { Search as SearchIcon, X } from "lucide-react";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [input, setInput] = useState(q);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Keep input in sync with URL
  useEffect(() => {
    setInput(q);
  }, [q]);

  // Fetch results when query changes
  useEffect(() => {
    if (!q) {
      setResults([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    api
      .get("/products", { params: { search: q, limit: 24 } })
      .then((r) => {
        setResults(r.data.items);
        setTotal(r.data.total);
      })
      .finally(() => setLoading(false));
  }, [q]);

  const submit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) {
      setParams({ q: trimmed });
    } else {
      setParams({});
    }
  };

  const clear = () => {
    setInput("");
    setParams({});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl">Search</h1>
      <p className="mt-1 text-sm text-ink-500">
        Find your favourite baby products.
      </p>

      {/* Search input */}
      <form onSubmit={submit} className="mt-5">
        <div className="relative">
          <SearchIcon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300"
          />
          <input
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for products… e.g. romper, bottle, toys"
            autoFocus
            className="w-full rounded-full border border-ink-900/10 bg-white py-3.5 pl-12 pr-12 text-sm focus:border-blush-400 focus:outline-none"
          />
          {input && (
            <button
              type="button"
              onClick={clear}
              aria-label="Clear"
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-cream text-ink-500 hover:bg-blush-50 hover:text-blush-500"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      {/* Results */}
      <div className="mt-6">
        {q && (
          <p className="mb-4 text-sm text-ink-500">
            {total} result{total === 1 ? "" : "s"} for{" "}
            <span className="text-ink-900 font-medium">"{q}"</span>
          </p>
        )}

        {loading && <ProductGrid loading />}

        {!loading && q && results.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-card animate-[fadeIn_0.4s_ease-out]">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blush-50 text-4xl">
              🔍
            </div>
            <h3 className="mt-5 font-display text-xl">No results found</h3>
            <p className="mt-2 text-sm text-ink-500">
              Try different keywords or browse categories.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-700 transition-transform active:scale-95"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {!loading && !q && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-card">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blush-50 text-4xl">
              🔍
            </div>
            <h3 className="mt-5 font-display text-xl">Start searching</h3>
            <p className="mt-2 text-sm text-ink-500">
              Type what you're looking for above.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && <ProductGrid products={results} />}
      </div>
    </div>
  );
}