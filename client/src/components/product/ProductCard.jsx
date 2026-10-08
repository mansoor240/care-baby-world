import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice, discountPercent } from "../../lib/format";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function ProductCard({ product }) {
  const cart = useCart();
  const wishlist = useWishlist();
  const off = discountPercent(product.price, product.originalPrice);
  const inStock = product.stock > 0;
  const wished = wishlist.has(product._id);

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
    <Link
      to={`/product/${product.slug}`}
      className="group block transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-card transition-shadow duration-300 group-hover:shadow-soft">
        <div className="aspect-square overflow-hidden bg-cream">
          <img
            src={product.images?.[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </div>

        {off && (
          <span className="absolute left-3 top-3 rounded-full bg-blush-400 px-2 py-0.5 text-[11px] font-semibold text-white">
            {off}% OFF
          </span>
        )}

        <button
          onClick={toggle}
          aria-label="Add to wishlist"
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white shadow-card transition-all duration-200 hover:scale-110 active:scale-95 ${
            wished
              ? "text-blush-500 scale-110"
              : "text-ink-500 hover:text-blush-500"
          }`}
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
          className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-ink-900 text-white shadow-soft transition-all duration-200 hover:bg-ink-700 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          aria-label="Add to cart"
        >
          <ShoppingBag size={16} />
        </button>
      </div>

      <div className="mt-3 px-1">
        <h3 className="line-clamp-2 text-sm font-medium text-ink-900">
          {product.name}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-semibold">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-ink-300 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-ink-500">
          <span>⭐ {product.rating || "—"}</span>
          <span>·</span>
          <span className={inStock ? "text-sage-500" : "text-red-500"}>
            {inStock ? "In stock" : "Out of stock"}
          </span>
        </div>
      </div>
    </Link>
  );
}