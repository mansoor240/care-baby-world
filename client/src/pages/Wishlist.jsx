import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../lib/format";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function Wishlist() {
  const wishlist = useWishlist();
  const cart = useCart();

  if (!wishlist.items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center animate-[fadeIn_0.4s_ease-out]">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-blush-50 text-5xl dark:bg-blush-400/15">
          💗
        </div>
        <h1 className="mt-6 font-display text-2xl text-ink-900 dark:text-night-50">Your wishlist is empty</h1>
        <p className="mt-2 text-sm text-ink-500 dark:text-night-300">
          Tap the heart on any product to save it here.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-700 transition-transform active:scale-95 dark:bg-blush-500 dark:hover:bg-blush-400"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl text-ink-900 dark:text-night-50">Wishlist</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {wishlist.items.map((w) => (
          <div key={w.productId} className="rounded-3xl bg-white p-3 shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
            <Link to={`/product/${w.slug}`}>
              <img src={w.image} alt={w.name} className="aspect-square w-full rounded-2xl object-cover" />
            </Link>
            <h3 className="mt-3 line-clamp-2 text-sm font-medium text-ink-900 dark:text-night-50">{w.name}</h3>
            <p className="text-sm font-semibold text-ink-900 dark:text-night-50">{formatPrice(w.price)}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  wishlist.remove(w.productId);
                  cart.add({ _id: w.productId, ...w, stock: 99 }, 1);
                  toast.success("Moved to cart");
                }}
                className="flex-1 rounded-full bg-ink-900 py-2 text-xs font-medium text-white dark:bg-blush-500"
              >
                Move to Cart
              </button>
              <button
                onClick={() => wishlist.remove(w.productId)}
                className="rounded-full border border-ink-900/10 px-3 text-xs text-ink-900 dark:border-white/10 dark:text-night-50"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}