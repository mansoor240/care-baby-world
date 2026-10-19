import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ProductGrid({
  products = [],
  loading = false,
  skeletonCount = 8,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-3xl bg-white p-12 text-center shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
        <div className="text-5xl">🔍</div>
        <h3 className="mt-3 font-display text-xl text-ink-900 dark:text-night-50">
          No products found
        </h3>
        <p className="mt-1 text-sm text-ink-500 dark:text-night-300">
          Try adjusting filters or search again.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={container}
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
    >
      {products.map((p) => (
        <motion.div key={p._id} variants={item}>
          <ProductCard product={p} />
        </motion.div>
      ))}
    </motion.div>
  );
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
      <div className="skeleton aspect-square w-full" />
      <div className="space-y-2 p-4">
        <div className="skeleton h-3 w-full rounded-full" />
        <div className="skeleton h-3 w-2/3 rounded-full" />
        <div className="skeleton mt-3 h-4 w-1/2 rounded-full" />
        <div className="skeleton h-3 w-1/3 rounded-full" />
      </div>
    </div>
  );
}