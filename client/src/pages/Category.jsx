import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
      <nav className="text-xs text-ink-500">
        Home / <span className="text-ink-900">{category?.name || "Category"}</span>
      </nav>

      <header className="mt-4 rounded-4xl bg-gradient-to-r from-blush-50 to-sand-50 p-8">
        <h1 className="font-display text-3xl text-ink-900">
          {category?.emoji} {category?.name}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-500">{category?.description}</p>
      </header>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-ink-500">{meta.total} products</p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-ink-900/10 bg-white px-3 py-2 text-sm"
        >
          <option value="popular">Popular</option>
          <option value="newest">Newest</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>
      </div>

            <div className="mt-6">
        <ProductGrid
          key={`${slug}-${sort}-${page}`}
          products={products}
          loading={loading}
        />
      </div>

      {meta.pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-sm text-ink-500">
            {page} / {meta.pages}
          </span>
          <button
            disabled={page >= meta.pages}
            onClick={() => setPage(page + 1)}
            className="rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}