import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { formatPrice, discountPercent } from "../lib/format";

export default function HorizontalScroll({ products = [], title = "Best Sellers", subtitle = "Loved by parents" }) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Move cards horizontally based on scroll
  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.3, 1, 1, 0.3]);

  if (!products.length) return null;

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden py-16"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-10 max-w-7xl px-4"
      >
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blush-500 dark:text-blush-300">
              {subtitle}
            </div>
            <h2 className="mt-2 font-display text-3xl text-ink-900 dark:text-night-50 md:text-4xl">
              {title}
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden text-sm text-blush-500 hover:underline dark:text-blush-300 md:block"
          >
            View all →
          </Link>
        </div>
      </motion.div>

      {/* Horizontal scroll row */}
      <motion.div
        style={{ x, opacity }}
        className="flex gap-6 pl-4 md:pl-[calc((100vw-1280px)/2+1rem)]"
      >
        {products.map((product) => {
          const off = discountPercent(product.price, product.originalPrice);
          const inStock = product.stock > 0;

          return (
            <Link
              key={product._id}
              to={`/product/${product.slug}`}
              className="group relative flex w-72 shrink-0 flex-col overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-soft md:w-80 dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-cream dark:bg-night-700">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Discount badge */}
                {off && (
                  <span className="absolute left-3 top-3 rounded-full bg-blush-400 px-2.5 py-1 text-[11px] font-bold text-white">
                    {off}% OFF
                  </span>
                )}

                {/* Out of stock overlay */}
                {!inStock && (
                  <div className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-sm dark:bg-night-900/70">
                    <span className="rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-white dark:bg-night-950">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="line-clamp-2 text-sm font-semibold text-ink-900 dark:text-night-50">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-ink-900 dark:text-night-50">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-ink-300 line-through dark:text-night-400">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-ink-500 dark:text-night-300">
                  <span>⭐ {product.rating || "—"}</span>
                  <span>·</span>
                  <span className={inStock ? "text-sage-500 dark:text-sage-300" : "text-red-500 dark:text-red-400"}>
                    {inStock ? "In stock" : "Out of stock"}
                  </span>
                </div>
              </div>

              {/* Hover gradient overlay */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-blush-50/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blush-400/10" />
            </Link>
          );
        })}

        {/* End card */}
        <Link
          to="/shop"
          className="flex w-64 shrink-0 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-ink-900/15 bg-white/50 p-6 text-center transition hover:border-blush-400 hover:bg-blush-50 dark:border-white/10 dark:bg-night-800/50 dark:hover:border-blush-400/50"
        >
          <div className="grid h-14 w-14 place-items-center rounded-full bg-blush-50 text-2xl dark:bg-blush-400/15">
            🛍️
          </div>
          <div>
            <div className="font-display text-lg text-ink-900 dark:text-night-50">
              Explore more
            </div>
            <div className="mt-1 text-xs text-ink-500 dark:text-night-300">
              {products.length}+ products in our store
            </div>
          </div>
          <div className="text-sm font-medium text-blush-500 dark:text-blush-300">
            Shop all →
          </div>
        </Link>
      </motion.div>

      {/* Bottom hint */}
      <div className="mx-auto mt-6 max-w-7xl px-4">
        <div className="text-center text-xs text-ink-500 dark:text-night-400">
          ✨ Scroll to see more
        </div>
      </div>
    </section>
  );
}