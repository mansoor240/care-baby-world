import { useRef } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { motion, useMotionValue } from "framer-motion";
import { formatPrice, discountPercent } from "../../lib/format";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function ProductCard({ product }) {
  const cart = useCart();
  const wishlist = useWishlist();
  const cardRef = useRef(null);

  const off = discountPercent(product.price, product.originalPrice);
  const inStock = product.stock > 0;
  const wished = wishlist.has(product._id);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(y * -10);
    rotateY.set(x * 10);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const add = (e) => {
    e.preventDefault();
    if (!inStock) return;
    cart.add(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const toggle = (e) => {
    e.preventDefault();
    wishlist.toggle(product);
  };

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative"
        style={{ perspective: 1000 }}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative overflow-hidden rounded-3xl bg-white shadow-card transition-shadow duration-300 group-hover:shadow-soft dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5"
        >
          <div className="aspect-square overflow-hidden bg-cream dark:bg-night-700">
            <img
              src={product.images?.[0]}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              style={{ transform: "translateZ(20px)" }}
            />
          </div>

          {off && (
            <span
              className="absolute left-3 top-3 rounded-full bg-blush-400 px-2 py-0.5 text-[11px] font-semibold text-white"
              style={{ transform: "translateZ(30px)" }}
            >
              {off}% OFF
            </span>
          )}

          {!inStock && (
            <div className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-sm dark:bg-night-900/70">
              <span className="rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-white dark:bg-night-950">
                Sold Out
              </span>
            </div>
          )}

          <button
            onClick={toggle}
            aria-label="Add to wishlist"
            className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white shadow-card transition-all duration-200 hover:scale-110 active:scale-95 dark:bg-night-700 dark:shadow-none dark:ring-1 dark:ring-white/10 ${
              wished
                ? "text-blush-500 scale-110"
                : "text-ink-500 hover:text-blush-500 dark:text-night-300"
            }`}
            style={{ transform: "translateZ(30px)" }}
          >
            <Heart
              size={16}
              fill={wished ? "currentColor" : "none"}
              className={wished ? "animate-[pop_0.3s_ease-out]" : ""}
            />
          </button>

          <button
            onClick={add}
            disabled={!inStock}
            className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-ink-900 text-white shadow-soft transition-all duration-200 hover:bg-ink-700 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 dark:bg-blush-500 dark:hover:bg-blush-400"
            aria-label="Add to cart"
            style={{ transform: "translateZ(30px)" }}
          >
            <ShoppingBag size={16} />
          </button>
        </motion.div>
      </div>

      <div className="mt-3 px-1">
        <h3 className="line-clamp-2 text-sm font-medium text-ink-900 dark:text-night-50">
          {product.name}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-semibold text-ink-900 dark:text-night-50">
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
    </Link>
  );
}