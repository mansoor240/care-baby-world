import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";
import { formatPrice, formatDate } from "../../lib/format";
import { whatsappLink } from "../../lib/whatsapp";
import { MessageCircle } from "lucide-react";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = () => api.get("/admin/orders").then((r) => setOrders(r.data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/orders/${id}/status`, { status });
    toast.success("Status updated");
    load();
    if (selected?._id === id) setSelected({ ...selected, status });
  };

  return (
    <div>
      <h1 className="font-display text-2xl">Orders</h1>
      <p className="mt-1 text-sm text-ink-500">{orders.length} orders</p>

      <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-xs text-ink-500">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t border-ink-900/5">
                <td className="p-3">
                  <div className="font-medium">{o.orderNumber}</div>
                  <div className="text-xs text-ink-500">{formatDate(o.createdAt)}</div>
                </td>
                <td className="p-3">
                  <div>{o.customer.fullName}</div>
                  <div className="text-xs text-ink-500">{o.customer.mobile}</div>
                </td>
                <td className="p-3 font-medium">{formatPrice(o.total)}</td>
                <td className="p-3 text-xs uppercase">{o.paymentMethod}</td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="rounded-full border border-ink-900/10 bg-white px-3 py-1 text-xs capitalize"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => setSelected(o)} className="text-blush-500 text-xs">View</button>
                </td>
              </tr>
            ))}
            {!orders.length && (
              <tr><td colSpan="6" className="p-8 text-center text-ink-500">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/40 p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">{selected.orderNumber}</h2>
              <button onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="mt-4 text-sm">
              <div className="font-semibold">{selected.customer.fullName}</div>
              <div className="text-ink-500">{selected.customer.mobile}</div>
              <div className="text-ink-500">
                {selected.customer.house}, {selected.customer.street}, {selected.customer.city}, {selected.customer.state} — {selected.customer.pincode}
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {selected.items.map((i) => (
                <li key={i.productId + i.variant} className="flex gap-3 text-sm">
                  <img src={i.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div>{i.name}</div>
                    <div className="text-xs text-ink-500">Qty {i.quantity}</div>
                  </div>
                  <div>{formatPrice(i.price * i.quantity)}</div>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-ink-900/10 pt-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(selected.subtotal)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>− {formatPrice(selected.discount)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{selected.deliveryFee === 0 ? "Free" : formatPrice(selected.deliveryFee)}</span></div>
              <div className="flex justify-between font-semibold"><span>Total</span><span>{formatPrice(selected.total)}</span></div>
            </div>
             <a
              href={whatsappLink(
                `Hi ${selected.customer.fullName}! Your order ${selected.orderNumber} is now ${selected.status}. Thank you for shopping with Care Baby World!`
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-sage-500 py-2.5 text-sm font-medium text-white hover:bg-sage-400"
            >
              <MessageCircle size={16} /> Notify Customer on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}