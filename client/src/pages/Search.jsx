import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/client";
import ProductGrid from "../components/product/ProductGrid";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    api
      .get("/products", { params: { search: q, limit: 24 } })
      .then((r) => {
        setResults(r.data.items);
        setTotal(r.data.total);
      })
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl">Search</h1>
      <p className="mt-1 text-sm text-ink-500">
        {q ? `${total} results for "${q}"` : "Type in the search bar to find products."}
      </p>

      <div className="mt-6">
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

        {!loading && results.length > 0 && <ProductGrid products={results} />}
      </div>
    </div>
  );
}