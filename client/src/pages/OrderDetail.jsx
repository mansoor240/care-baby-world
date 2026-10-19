import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import { formatPrice, formatDate } from "../lib/format";
import { whatsappLink, whatsappMessages } from "../lib/whatsapp";
import { CheckCircle2, Package, Truck, Home, XCircle, MessageCircle } from "lucide-react";

const STEPS = [
  { key: "pending", label: "Pending", icon: Package },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

const STATUS_ORDER = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/by-id/${id}`)
      .then((r) => setOrder(r.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-ink-700 dark:text-night-100">Loading…</div>;

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-ink-900 dark:text-night-50">Order not found</h1>
        <Link to="/account" className="mt-4 inline-block text-blush-500 dark:text-blush-300">← Back to my orders</Link>
      </div>
    );
  }

  const isCancelled = order.status === "cancelled";
  const currentIdx = STATUS_ORDER.indexOf(order.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/account" className="text-sm text-blush-500 hover:underline dark:text-blush-300">← Back to my orders</Link>

      <div className="mt-4 rounded-4xl bg-white p-6 shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-ink-900 dark:text-night-50">{order.orderNumber}</h1>
            <p className="mt-1 text-sm text-ink-500 dark:text-night-300">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${isCancelled ? "bg-red-100 text-red-500 dark:bg-red-400/20 dark:text-red-400" : "bg-sage-100 text-sage-500 dark:bg-sage-400/20 dark:text-sage-300"}`}>
            {order.status}
          </span>
        </div>
      </div>

      {!isCancelled && (
        <div className="mt-6 rounded-3xl bg-white p-6 shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
          <h2 className="font-display text-lg text-ink-900 dark:text-night-50">Progress</h2>
          <div className="mt-5 grid grid-cols-5 gap-2">
            {STEPS.map((step, i) => {
              const done = i <= currentIdx;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex flex-col items-center text-center">
                  <div className={`grid h-10 w-10 place-items-center rounded-full ${done ? "bg-sage-500 text-white dark:bg-sage-400" : "bg-cream text-ink-300 dark:bg-night-700 dark:text-night-400"}`}>
                    <Icon size={18} />
                  </div>
                  <div className={`mt-2 text-[10px] font-medium sm:text-xs ${done ? "text-ink-900 dark:text-night-50" : "text-ink-300 dark:text-night-400"}`}>
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="mt-6 rounded-3xl bg-red-50 p-6 text-center dark:bg-red-500/10">
          <XCircle className="mx-auto text-red-500 dark:text-red-400" size={32} />
          <h2 className="mt-2 font-display text-lg text-ink-900 dark:text-night-50">This order was cancelled</h2>
          <p className="mt-1 text-sm text-ink-700 dark:text-night-100">Contact us if you have questions.</p>
        </div>
      )}

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
        <h2 className="font-display text-lg text-ink-900 dark:text-night-50">Items</h2>
        <ul className="mt-4 space-y-4">
          {order.items.map((i) => (
            <li key={i.productId + i.variant} className="flex gap-4">
              <img src={i.image} alt={i.name} className="h-16 w-16 rounded-2xl object-cover" />
              <div className="flex-1 text-sm">
                <div className="font-medium text-ink-900 dark:text-night-50">{i.name}</div>
                <div className="text-xs text-ink-500 dark:text-night-400">Qty {i.quantity} {i.variant && `· ${i.variant}`}</div>
              </div>
              <div className="text-sm font-medium text-ink-900 dark:text-night-50">{formatPrice(i.price * i.quantity)}</div>
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-1.5 border-t border-ink-900/10 pt-4 text-sm dark:border-white/10">
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          {order.discount > 0 && <Row label="Discount" value={`− ${formatPrice(order.discount)}`} />}
          <Row label="Delivery" value={order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)} />
          <div className="border-t border-ink-900/10 pt-2 dark:border-white/10" />
          <Row label="Total" value={formatPrice(order.total)} bold />
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
        <h2 className="font-display text-lg text-ink-900 dark:text-night-50">Delivery Address</h2>
        <p className="mt-2 text-sm text-ink-700 dark:text-night-100">
          {order.customer.fullName}<br />
          {order.customer.house}, {order.customer.street}<br />
          {order.customer.city}, {order.customer.state} — {order.customer.pincode}<br />
          {order.customer.mobile}
        </p>
      </div>

      <div className="mt-6 text-center">
        <a
          href={whatsappLink(whatsappMessages.order(order.orderNumber))}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-sage-500 px-6 py-3 text-sm font-medium text-white hover:bg-sage-400"
        >
          <MessageCircle size={16} /> Ask about this order
        </a>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex justify-between ${bold ? "font-semibold text-ink-900 dark:text-night-50" : "text-ink-700 dark:text-night-100"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}