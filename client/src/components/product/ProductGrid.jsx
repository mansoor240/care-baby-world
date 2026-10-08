import ProductCard from "./ProductCard";

export default function ProductGrid({
  products = [],
  loading = false,
  skeletonCount = 8,
}) {
  // Loading: show skeletons that match the real card layout
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!products.length) {
    return (
      <div className="rounded-3xl bg-white p-12 text-center shadow-card">
        <div className="text-5xl">🔍</div>
        <h3 className="mt-3 font-display text-xl">No products found</h3>
        <p className="mt-1 text-sm text-ink-500">
          Try adjusting filters or search again.
        </p>
      </div>
    );
  }

  // Loaded state — fade in
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 animate-[fadeIn_0.4s_ease-out]">
      {products.map((p, i) => (
        <div
          key={p._id}
          style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
          className="animate-[fadeIn_0.4s_ease-out_both]"
        >
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-card">
      {/* Image */}
      <div className="skeleton aspect-square w-full" />

      {/* Card body */}
      <div className="space-y-2 p-4">
        {/* Title — 2 lines */}
        <div className="skeleton h-3 w-full rounded-full" />
        <div className="skeleton h-3 w-2/3 rounded-full" />

        {/* Price */}
        <div className="skeleton mt-3 h-4 w-1/2 rounded-full" />

        {/* Rating */}
        <div className="skeleton h-3 w-1/3 rounded-full" />
      </div>
    </div>
  );
}