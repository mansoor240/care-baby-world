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
    api
      .get(`/orders/by-id/${id}`)
      .then((r) => setOrder(r.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-20 text-center">Loading…</div>;

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl">Order not found</h1>
        <Link to="/account" className="mt-4 inline-block text-blush-500">
          ← Back to my orders
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === "cancelled";
  const currentIdx = STATUS_ORDER.indexOf(order.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/account" className="text-sm text-blush-500 hover:underline">
        ← Back to my orders
      </Link>

      <div className="mt-4 rounded-4xl bg-white p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl">{order.orderNumber}</h1>
            <p className="mt-1 text-sm text-ink-500">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
            isCancelled ? "bg-red-100 text-red-500" : "bg-sage-100 text-sage-500"
          }`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Progress Tracker */}
      {!isCancelled && (
        <div className="mt-6 rounded-3xl bg-white p-6 shadow-card">
          <h2 className="font-display text-lg">Progress</h2>
          <div className="mt-5 grid grid-cols-5 gap-2">
            {STEPS.map((step, i) => {
              const done = i <= currentIdx;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex flex-col items-center text-center">
                  <div className={`grid h-10 w-10 place-items-center rounded-full ${
                    done ? "bg-sage-500 text-white" : "bg-cream text-ink-300"
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div className={`mt-2 text-[10px] font-medium sm:text-xs ${
                    done ? "text-ink-900" : "text-ink-300"
                  }`}>
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="mt-6 rounded-3xl bg-red-50 p-6 text-center">
          <XCircle className="mx-auto text-red-500" size={32} />
          <h2 className="mt-2 font-display text-lg">This order was cancelled</h2>
          <p className="mt-1 text-sm text-ink-700">Contact us if you have questions.</p>
        </div>
      )}

      {/* Items */}
      <div className="mt-6 rounded-3xl bg-white p-6 shadow-card">
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
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          {order.discount > 0 && <Row label="Discount" value={`− ${formatPrice(order.discount)}`} />}
          <Row label="Delivery" value={order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)} />
          <div className="border-t border-ink-900/10 pt-2" />
          <Row label="Total" value={formatPrice(order.total)} bold />
        </div>
      </div>

      {/* Address */}
      <div className="mt-6 rounded-3xl bg-white p-6 shadow-card">
        <h2 className="font-display text-lg">Delivery Address</h2>
        <p className="mt-2 text-sm text-ink-700">
          {order.customer.fullName}<br />
          {order.customer.house}, {order.customer.street}<br />
          {order.customer.city}, {order.customer.state} — {order.customer.pincode}<br />
          {order.customer.mobile}
        </p>
      </div>

      {/* WhatsApp Support */}
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
    <div className={`flex justify-between ${bold ? "font-semibold text-ink-900" : "text-ink-700"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}