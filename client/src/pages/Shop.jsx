import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";
import ProductGrid from "../components/product/ProductGrid";
import Filters from "../components/product/Filters";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = useMemo(
    () => ({
      category: params.get("category") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      age: params.get("age") || "",
      sort: params.get("sort") || "popular",
      page: Number(params.get("page") || 1),
    }),
    [params]
  );

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data));
  }, []);

    useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();
    setLoading(true);

    api
      .get("/products", {
        params: {
          category: filters.category,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          age: filters.age,
          sort: filters.sort,
          page: filters.page,
          limit: 12,
        },
      })
      .then((r) => {
        if (cancelled) return;
        const elapsed = Date.now() - startedAt;
        const wait = Math.max(0, 300 - elapsed);

        setTimeout(() => {
          if (cancelled) return;
          setProducts(r.data.items);
          setMeta({
            total: r.data.total,
            page: r.data.page,
            pages: r.data.pages,
          });
          setLoading(false);
        }, wait);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === "" || v == null) next.delete(k);
      else next.set(k, v);
    });
    if (!("page" in patch)) next.set("page", "1");
    setParams(next);
  };

  const nextPage = () => update({ page: meta.page + 1 });
  const prevPage = () => update({ page: Math.max(1, meta.page - 1) });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl text-ink-900">Shop All Products</h1>
      <p className="mt-1 text-sm text-ink-500">{meta.total} products</p>

      <div className="mt-6 grid gap-6 md:grid-cols-[260px_1fr]">
        <aside>
          <Filters value={filters} onChange={update} categories={categories} />
        </aside>

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-ink-500">
              Showing page {meta.page} of {meta.pages || 1}
            </div>
            <select
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="rounded-full border border-ink-900/10 bg-white px-3 py-2 text-sm"
            >
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>

                    <ProductGrid products={products} loading={loading} />

          {meta.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                disabled={meta.page <= 1}
                onClick={prevPage}
                className="rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="text-sm text-ink-500">
                {meta.page} / {meta.pages}
              </span>
              <button
                disabled={meta.page >= meta.pages}
                onClick={nextPage}
                className="rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}