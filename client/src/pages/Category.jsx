import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import ProductGrid from "../components/product/ProductGrid";

export default function Category() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ pages: 1, total: 0 });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/categories/${slug}`),
      api.get("/products", { params: { category: slug, sort, page, limit: 12 } }),
    ])
      .then(([c, p]) => {
        setCategory(c.data);
        setProducts(p.data.items);
        setMeta({ pages: p.data.pages, total: p.data.total });
      })
      .finally(() => setLoading(false));
  }, [slug, sort, page]);

  useEffect(() => {
    document.title = category ? `${category.name} — CareBabyStore` : "CareBabyStore";
  }, [category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-xs text-ink-500 dark:text-night-400">
        <Link to="/" className="hover:text-ink-900 transition dark:hover:text-night-50">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-900 dark:text-night-50">{category?.name || "Category"}</span>
      </nav>

      <header className="mt-4 rounded-4xl bg-gradient-to-r from-blush-50 to-sand-50 p-8 dark:from-night-700 dark:to-night-800">
        <h1 className="font-display text-3xl text-ink-900 dark:text-night-50">
          {category?.emoji} {category?.name}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-500 dark:text-night-300">{category?.description}</p>
      </header>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-ink-500 dark:text-night-300">{meta.total} products</p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-ink-900/10 bg-white px-3 py-2 text-sm text-ink-900 dark:border-white/10 dark:bg-night-800 dark:text-night-50"
        >
          <option value="popular">Popular</option>
          <option value="newest">Newest</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>
      </div>

      <div className="mt-6">
        {!loading && products.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-blush-50 text-5xl dark:bg-blush-400/15">
              🌱
            </div>
            <h3 className="mt-6 font-display text-2xl text-ink-900 dark:text-night-50">Coming soon</h3>
            <p className="mt-2 max-w-md mx-auto text-sm text-ink-500 dark:text-night-300">
              We're adding products to <strong>{category?.name || "this category"}</strong>.
              Check back soon or explore other categories.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/shop"
                className="rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-700 transition-transform active:scale-95 dark:bg-blush-500 dark:hover:bg-blush-400"
              >
                Browse all products
              </Link>
              <Link
                to="/"
                className="rounded-full border border-ink-900/15 bg-white px-6 py-3 text-sm font-medium text-ink-900 hover:bg-cream transition-transform active:scale-95 dark:border-white/15 dark:bg-night-800 dark:text-night-50 dark:hover:bg-night-700"
              >
                Go home
              </Link>
            </div>
          </div>
        ) : (
          <ProductGrid key={`${slug}-${sort}-${page}`} products={products} loading={loading} />
        )}
      </div>

      {meta.pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm text-ink-900 disabled:opacity-40 dark:border-white/10 dark:bg-night-800 dark:text-night-50"
          >
            ← Prev
          </button>
          <span className="text-sm text-ink-500 dark:text-night-300">
            {page} / {meta.pages}
          </span>
          <button
            disabled={page >= meta.pages}
            onClick={() => setPage(page + 1)}
            className="rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm text-ink-900 disabled:opacity-40 dark:border-white/10 dark:bg-night-800 dark:text-night-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}