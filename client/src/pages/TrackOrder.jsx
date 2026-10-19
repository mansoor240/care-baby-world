import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { formatPrice, formatDate } from "../lib/format";
import { whatsappLink, whatsappMessages } from "../lib/whatsapp";
import {
  MessageCircle,
  Package,
  CheckCircle2,
  Truck,
  Home,
  XCircle,
  Search,
  ChevronRight,
} from "lucide-react";

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
  const [orders, setOrders] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setOrders(null);
    setSelectedOrder(null);

    if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      return setError("Enter a valid 10-digit mobile number");
    }

    setLoading(true);
    try {
      const params = { mobile: mobile.trim() };
      if (orderNumber.trim()) params.orderNumber = orderNumber.trim();

      const { data } = await api.get("/orders/track", { params });

      if (data.single) {
        setSelectedOrder(data.orders[0]);
      } else {
        setOrders(data.orders);
        // Auto-select if only one order
        if (data.orders.length === 1) {
          setSelectedOrder(data.orders[0]);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Could not find your order");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setOrders(null);
    setSelectedOrder(null);
    setError("");
  };

    // ─── View single order detail ──────────────────────
  if (selectedOrder) {
    const statusInfo = STATUS_INFO[selectedOrder.status];
    const StatusIcon = statusInfo?.icon;
    const hasList = orders && orders.length > 1;

    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <button
          onClick={() => {
            if (hasList) {
              // If there's a list of orders, go back to list
              setSelectedOrder(null);
            } else {
              // Otherwise, go back to search
              reset();
            }
          }}
          className="mb-4 inline-flex items-center gap-1 text-sm text-blush-500 hover:underline"
        >
          ← {hasList ? "Back to orders" : "Back to search"}
        </button>

        <div className="space-y-6">
          {/* Status Card */}
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <div className="flex items-start gap-4">
              <div
                className={`grid h-12 w-12 place-items-center rounded-full bg-cream ${statusInfo.color}`}
              >
                <StatusIcon size={22} />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider text-ink-500">
                  Current Status
                </div>
                <div className={`mt-1 font-display text-2xl ${statusInfo.color}`}>
                  {statusInfo.label}
                </div>
                <div className="mt-1 text-xs text-ink-500">
                  Order #{selectedOrder.orderNumber}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 border-t border-ink-900/5 pt-4 text-sm sm:grid-cols-2">
              <div>
                <div className="text-xs text-ink-500">Placed on</div>
                <div className="mt-1 font-medium">
                  {formatDate(selectedOrder.createdAt)}
                </div>
              </div>
              <div>
                <div className="text-xs text-ink-500">Payment Method</div>
                <div className="mt-1 font-medium">
                  {selectedOrder.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="font-display text-lg">Items</h2>
            <ul className="mt-4 space-y-4">
              {selectedOrder.items.map((i) => (
                <li key={i.productId + i.variant} className="flex gap-4">
                  <img
                    src={i.image}
                    alt={i.name}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                  <div className="flex-1 text-sm">
                    <div className="font-medium">{i.name}</div>
                    <div className="text-xs text-ink-500">
                      Qty {i.quantity} {i.variant && `· ${i.variant}`}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {formatPrice(i.price * i.quantity)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-1.5 border-t border-ink-900/10 pt-4 text-sm">
              <Row label="Subtotal" value={formatPrice(selectedOrder.subtotal)} />
              {selectedOrder.discount > 0 && (
                <Row
                  label="Discount"
                  value={`− ${formatPrice(selectedOrder.discount)}`}
                />
              )}
              <Row
                label="Delivery"
                value={
                  selectedOrder.deliveryFee === 0
                    ? "Free"
                    : formatPrice(selectedOrder.deliveryFee)
                }
              />
              <div className="border-t border-ink-900/10 pt-2" />
              <Row label="Total" value={formatPrice(selectedOrder.total)} bold />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="font-display text-lg">Delivery Address</h2>
            <p className="mt-2 text-sm text-ink-700">
              {selectedOrder.customer.fullName}
              <br />
              {selectedOrder.customer.house}, {selectedOrder.customer.street}
              <br />
              {selectedOrder.customer.city}, {selectedOrder.customer.state} —{" "}
              {selectedOrder.customer.pincode}
              <br />
              {selectedOrder.customer.mobile}
            </p>
          </div>

          {/* Support */}
          <div className="rounded-3xl bg-sage-50 p-6 text-center">
            <h3 className="font-display text-lg">Need help with this order?</h3>
            <a
              href={whatsappLink(whatsappMessages.order(selectedOrder.orderNumber))}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-sage-500 px-6 py-3 text-sm font-medium text-white hover:bg-sage-400"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ─── Order list (when multiple orders found) ───────
  if (orders && orders.length > 1) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <button
          onClick={reset}
          className="mb-4 inline-flex items-center gap-1 text-sm text-blush-500 hover:underline"
        >
          ← Back to search
        </button>

        <h1 className="font-display text-2xl">Your Orders</h1>
        <p className="mt-1 text-sm text-ink-500">
          Found {orders.length} order{orders.length === 1 ? "" : "s"} for{" "}
          <strong>{mobile}</strong>
        </p>

        <div className="mt-6 space-y-3">
          {orders.map((o) => {
            const info = STATUS_INFO[o.status];
            const Icon = info?.icon;
            return (
              <button
                key={o._id}
                onClick={() => setSelectedOrder(o)}
                className="group block w-full rounded-3xl bg-white p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream ${info.color}`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="font-semibold text-ink-900">
                        {o.orderNumber}
                      </div>
                      <div className="mt-0.5 text-xs text-ink-500">
                        {formatDate(o.createdAt)} · {o.items.length} item
                        {o.items.length === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-ink-300 transition group-hover:translate-x-1 group-hover:text-ink-900"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`rounded-full bg-cream px-2.5 py-0.5 text-[10px] font-bold uppercase ${info.color}`}
                  >
                    {info.label}
                  </span>
                  <span className="text-sm font-semibold">
                    {formatPrice(o.total)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Search form ───────────────────────────────────
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl text-center">Track Your Order</h1>
      <p className="mt-2 text-center text-sm text-ink-500">
        Enter your mobile number to see your orders.
      </p>

      <form onSubmit={submit} className="mt-8 rounded-3xl bg-white p-6 shadow-card">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-700">
            Mobile Number <span className="text-red-500">*</span>
          </span>
          <input
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="10-digit mobile used during checkout"
            inputMode="numeric"
            className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm focus:border-blush-400 focus:outline-none"
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-ink-700">
            Order Number{" "}
            <span className="text-xs font-normal text-ink-500">
              (optional — leave blank to see all your orders)
            </span>
          </span>
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            placeholder="e.g. TN-ABC123XY"
            className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm focus:border-blush-400 focus:outline-none"
          />
        </label>

        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 py-3 text-sm font-medium text-white hover:bg-ink-700 disabled:opacity-50 transition"
        >
          <Search size={16} />
          {loading ? "Searching…" : "Find My Orders"}
        </button>
      </form>

      <div className="mt-6 rounded-2xl bg-sand-50 p-4 text-center">
        <p className="text-xs text-ink-700">
          💡 <strong>Just placed an order?</strong> Check your WhatsApp —
          we sent you the order number there.
        </p>
      </div>

      <div className="mt-4 text-center">
        <Link to="/shop" className="text-sm text-blush-500 hover:underline">
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div
      className={`flex justify-between ${
        bold ? "font-semibold text-ink-900" : "text-ink-700"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}