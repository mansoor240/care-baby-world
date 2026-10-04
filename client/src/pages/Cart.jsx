import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import { storeConfig } from "../config/store";

export default function Cart() {
  const cart = useCart();
  const navigate = useNavigate();

  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery =
    subtotal >= storeConfig.freeDeliveryThreshold || subtotal === 0
      ? 0
      : storeConfig.deliveryFee;
  const discount = cart.coupon?.discount || 0;
  const total = subtotal - discount + delivery;

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-4 font-display text-2xl">Your cart is empty</h1>
        <p className="mt-1 text-sm text-ink-500">
          Add some products to get started.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl">Your Cart</h1>
      <p className="mt-1 text-sm text-ink-500">{cart.items.length} item(s)</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div
              key={item.key}
              className="flex gap-4 rounded-3xl bg-white p-4 shadow-card"
            >
              <Link to={`/product/${item.slug}`} className="shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded-2xl object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/product/${item.slug}`}
                    className="line-clamp-2 text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => cart.remove(item.key)}
                    className="text-ink-300 hover:text-red-500"
                    aria-label="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {item.variant && (
                  <div className="text-xs text-ink-500">Size: {item.variant}</div>
                )}
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-ink-900/10 bg-cream">
                    <button
                      onClick={() => cart.setQty(item.key, item.quantity - 1)}
                      className="px-3 py-1"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => cart.setQty(item.key, item.quantity + 1)}
                      className="px-3 py-1"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-3xl bg-white p-6 shadow-card h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-lg">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            {discount > 0 && (
              <Row label={`Discount (${cart.coupon.code})`} value={`− ${formatPrice(discount)}`} />
            )}
            <Row
              label="Delivery"
              value={delivery === 0 ? "Free" : formatPrice(delivery)}
            />
            <div className="border-t border-ink-900/10 pt-2" />
            <Row label="Total" value={formatPrice(total)} bold />
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-5 w-full rounded-full bg-ink-900 py-3 text-sm font-medium text-white hover:bg-ink-700"
          >
            Proceed to Checkout
          </button>
          <Link
            to="/shop"
            className="mt-2 block w-full rounded-full border border-ink-900/10 py-3 text-center text-sm"
          >
            Continue Shopping
          </Link>

          {subtotal < storeConfig.freeDeliveryThreshold && (
            <p className="mt-3 text-center text-xs text-ink-500">
              Add {formatPrice(storeConfig.freeDeliveryThreshold - subtotal)} more for free delivery
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex justify-between ${bold ? "font-semibold text-ink-900" : "text-ink-700"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}