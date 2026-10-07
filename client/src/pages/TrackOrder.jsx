import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { formatPrice, formatDate } from "../lib/format";
import { whatsappLink, whatsappMessages } from "../lib/whatsapp";
import { MessageCircle, Package, CheckCircle2, Truck, Home, XCircle } from "lucide-react";

const STATUS_INFO = {
  pending:    { label: "Pending",    icon: Package,       color: "text-sand-500" },
  confirmed:  { label: "Confirmed",  icon: CheckCircle2,  color: "text-sky-500" },
  processing: { label: "Processing", icon: Package,       color: "text-lavender-500" },
  shipped:    { label: "Shipped",    icon: Truck,         color: "text-sage-500" },
  delivered:  { label: "Delivered",  icon: Home,          color: "text-sage-500" },
  cancelled:  { label: "Cancelled",  icon: XCircle,       color: "text-red-500" },
};

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [mobile, setMobile] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);

    if (!orderNumber.trim()) return setError("Please enter your order number");
    if (!/^[6-9]\d{9}$/.test(mobile.trim())) return setError("Enter a valid 10-digit mobile number");

    setLoading(true);
    try {
      const { data } = await api.get("/orders/track", {
        params: { orderNumber: orderNumber.trim(), mobile: mobile.trim() },
      });
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.error || "Could not find your order");
    } finally {
      setLoading(false);
    }
  };

  const statusInfo = order ? STATUS_INFO[order.status] : null;
  const StatusIcon = statusInfo?.icon;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl text-center">Track Your Order</h1>
      <p className="mt-2 text-center text-sm text-ink-500">
        Enter your order number and mobile number to see the current status.
      </p>

      <form onSubmit={submit} className="mt-8 rounded-3xl bg-white p-6 shadow-card">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-700">Order Number</span>
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            placeholder="e.g. TN-ABC123XY"
            className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm focus:border-blush-400 focus:outline-none"
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-ink-700">Mobile Number</span>
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit mobile used during checkout"
            inputMode="numeric"
            className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm focus:border-blush-400 focus:outline-none"
          />
        </label>

        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-ink-900 py-3 text-sm font-medium text-white hover:bg-ink-700 disabled:opacity-50"
        >
          {loading ? "Searching…" : "Track Order"}
        </button>
      </form>

      {order && statusInfo && (
        <div className="mt-8 space-y-6">
          {/* Status Card */}
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <div className="flex items-start gap-4">
              <div className={`grid h-12 w-12 place-items-center rounded-full bg-cream ${statusInfo.color}`}>
                <StatusIcon size={22} />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider text-ink-500">Current Status</div>
                <div className={`mt-1 font-display text-2xl ${statusInfo.color}`}>{statusInfo.label}</div>
                <div className="mt-1 text-xs text-ink-500">Order #{order.orderNumber}</div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 border-t border-ink-900/5 pt-4 text-sm sm:grid-cols-2">
              <div>
                <div className="text-xs text-ink-500">Placed on</div>
                <div className="mt-1 font-medium">{formatDate(order.createdAt)}</div>
              </div>
              <div>
                <div className="text-xs text-ink-500">Payment Method</div>
                <div className="mt-1 font-medium">
                  {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="font-display text-lg">Items</h2>
            <ul className="mt-4 space-y-4">
              {order.items.map((i) => (
                <li key={i.productId + i.variant} className="flex gap-4">
                  <img src={i.image} alt={i.name} className="h-16 w-16 rounded-2xl object-cover" />
                  <div className="flex-1 text-sm">
                    <div className="font-medium">{i.name}</div>
                    <div className="text-xs text-ink-500">
                      Qty {i.quantity} {i.variant && `· ${i.variant}`}
                    </div>
                  </div>
                  <div className="text-sm font-medium">{formatPrice(i.price * i.quantity)}</div>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-1.5 border-t border-ink-900/10 pt-4 text-sm">
              <div className="flex justify-between text-ink-700"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-ink-700"><span>Discount</span><span>− {formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between text-ink-700"><span>Delivery</span><span>{order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}</span></div>
              <div className="flex justify-between font-semibold text-ink-900"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="font-display text-lg">Delivery Address</h2>
            <p className="mt-2 text-sm text-ink-700">
              {order.customer.fullName}<br />
              {order.customer.house}, {order.customer.street}<br />
              {order.customer.city}, {order.customer.state} — {order.customer.pincode}<br />
              {order.customer.mobile}
            </p>
          </div>

          {/* Support */}
          <div className="rounded-3xl bg-sage-50 p-6 text-center">
            <h3 className="font-display text-lg">Need help with this order?</h3>
            <a
              href={whatsappLink(whatsappMessages.order(order.orderNumber))}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-sage-500 px-6 py-3 text-sm font-medium text-white hover:bg-sage-400"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      )}

      {!order && !loading && (
        <div className="mt-8 text-center">
          <Link to="/shop" className="text-sm text-blush-500 hover:underline">
            ← Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}