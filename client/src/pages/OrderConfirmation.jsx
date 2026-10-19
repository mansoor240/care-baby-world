import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import { formatPrice, formatDate } from "../lib/format";
import { whatsappLink, whatsappMessages } from "../lib/whatsapp";
import { storeConfig } from "../config/store";
import { MessageCircle, CheckCircle2 } from "lucide-react";

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${orderNumber}`)
      .then((r) => setOrder(r.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading)
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">Loading…</div>
    );

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl">Order not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-blush-500">
          ← Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Header Card */}
      <div className="rounded-4xl bg-sage-50 p-8 text-center">
        <CheckCircle2 className="mx-auto text-sage-500" size={48} />
        <h1 className="mt-3 font-display text-3xl">Thank you!</h1>
        <p className="mt-1 text-sm text-ink-700">
          Your order has been placed successfully.
        </p>
                <div className="mt-3 space-y-2">
          <p className="rounded-full bg-white px-4 py-2 text-base font-bold text-ink-900">
            Order # {order.orderNumber}
          </p>
          <p className="text-xs text-ink-700">
            📌 <strong>Save this order number</strong> to track your order anytime.
          </p>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            to="/track"
            className="rounded-full bg-ink-900 px-5 py-2.5 text-xs font-medium text-white hover:bg-ink-700 transition"
          >
            Track this order
          </Link>
          <button
            type="button"
            onClick={() => {
              const message = `My order from CareBabyStore:\n\nOrder #: ${order.orderNumber}\nTotal: ₹${order.total}\nStatus: ${order.status}\n\nTrack: https://care-baby-world.vercel.app/track`;
              navigator.clipboard.writeText(message);
              alert("Order details copied! Save this in your notes or WhatsApp yourself.");
            }}
            className="rounded-full border border-ink-900/15 bg-white px-5 py-2.5 text-xs font-medium text-ink-900 hover:bg-cream transition"
          >
            📋 Copy details
          </button>
          <a
            href={whatsappLink(
              `Hi! I just placed order ${order.orderNumber} on CareBabyStore. Total: ₹${order.total}. Can you confirm my order?`
            )}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-sage-500 px-5 py-2.5 text-xs font-medium text-white hover:bg-sage-400 transition"
          >
            💬 Save on WhatsApp
          </a>
        </div>
      </div>

      {/* Order Details */}
      <section className="mt-8 rounded-3xl bg-white p-6 shadow-card">
        <h2 className="font-display text-lg">Order Details</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <Info label="Name" value={order.customer.fullName} />
          <Info label="Mobile" value={order.customer.mobile} />
          <Info
            label="Payment"
            value={order.paymentMethod === "cod" ? "Cash on Delivery" : "Online"}
          />
          <Info label="Ordered on" value={formatDate(order.createdAt)} />
        </dl>

        <h3 className="mt-6 font-semibold">Delivery Address</h3>
        <p className="mt-1 text-sm text-ink-700">
          {order.customer.house}, {order.customer.street}
          <br />
          {order.customer.city}, {order.customer.state} — {order.customer.pincode}
        </p>
      </section>

      {/* Items */}
      <section className="mt-6 rounded-3xl bg-white p-6 shadow-card">
        <h2 className="font-display text-lg">Items</h2>
        <ul className="mt-4 space-y-4">
          {order.items.map((i) => (
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
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          {order.discount > 0 && (
            <Row label="Discount" value={`− ${formatPrice(order.discount)}`} />
          )}
          <Row
            label="Delivery"
            value={order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}
          />
          <div className="border-t border-ink-900/10 pt-2" />
          <Row label="Total" value={formatPrice(order.total)} bold />
        </div>
      </section>

      {/* Estimated Delivery */}
      <section className="mt-6 rounded-3xl bg-sand-50 p-6">
        <h2 className="font-display text-lg">Estimated Delivery</h2>
        <p className="mt-1 text-sm text-ink-700">
          {storeConfig.estimatedDelivery}. We'll contact you before dispatch.
        </p>
      </section>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/track"
          className="flex flex-1 items-center justify-center rounded-full bg-ink-900 py-3 text-sm font-medium text-white hover:bg-ink-700"
        >
          Track This Order
        </Link>
        <a
          href={whatsappLink(whatsappMessages.order(order.orderNumber))}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-sage-500 py-3 text-sm font-medium text-white hover:bg-sage-400"
        >
          <MessageCircle size={16} /> Contact Support
        </a>
        <Link
          to="/shop"
          className="flex flex-1 items-center justify-center rounded-full border border-ink-900/10 bg-white py-3 text-sm font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-ink-500">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
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