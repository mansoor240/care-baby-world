import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [], loading = false, skeletonCount = 8 }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="skeleton aspect-[3/4] rounded-3xl" />
        ))}
      </div>
    );
  }
  if (!products.length) return null;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}