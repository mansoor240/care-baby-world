import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomer } from "../context/CustomerContext";
import api from "../api/client";
import { formatPrice, formatDate } from "../lib/format";
import { Package, LogOut, User, MapPin } from "lucide-react";

const STATUS_STYLES = {
  pending:    "bg-sand-100 text-sand-500",
  confirmed:  "bg-sky-100 text-sky-500",
  processing: "bg-lavender-100 text-lavender-500",
  shipped:    "bg-sage-100 text-sage-500",
  delivered:  "bg-sage-100 text-sage-500",
  cancelled:  "bg-red-100 text-red-500",
};

export default function MyAccount() {
  const { customer, isLoggedIn, ready, logout } = useCustomer();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!ready) return;
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [ready, isLoggedIn, navigate]);

  // Fetch orders when logged in
  useEffect(() => {
    if (!ready || !isLoggedIn) return;
    setLoading(true);
    api
      .get("/customers/me/orders")
      .then((r) => setOrders(r.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [ready, isLoggedIn]);

  const handleLogout = () => {
    logout();
  };

  if (!ready || !isLoggedIn) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="rounded-4xl bg-gradient-to-r from-blush-50 to-sand-50 p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Welcome, {customer?.name?.split(" ")[0]}</h1>
            <p className="mt-1 text-sm text-ink-700">
              {customer?.mobile} {customer?.email && `· ${customer.email}`}
            </p>
          </div>
                              <button
  onClick={handleLogout}
  className="flex items-center gap-2 rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm hover:bg-cream"
>
  <LogOut size={14} /> Logout
</button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link to="/account" className="flex items-start gap-3 rounded-3xl bg-white p-5 shadow-card">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-blush-50 text-blush-500">
            <Package size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold">My Orders</div>
            <div className="text-xs text-ink-500">View order history</div>
          </div>
        </Link>
        <Link to="/checkout" className="flex items-start gap-3 rounded-3xl bg-white p-5 shadow-card">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-blush-50 text-blush-500">
            <MapPin size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold">Addresses</div>
            <div className="text-xs text-ink-500">Saved at checkout</div>
          </div>
        </Link>
        <div className="flex items-start gap-3 rounded-3xl bg-white p-5 shadow-card">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-blush-50 text-blush-500">
            <User size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold">{customer?.name}</div>
            <div className="text-xs text-ink-500">{customer?.mobile}</div>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="mt-8">
        <h2 className="mb-4 font-display text-2xl">My Orders</h2>

        {loading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton h-24 rounded-3xl" />
            ))}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-card">
            <div className="text-4xl">📦</div>
            <h3 className="mt-3 font-display text-xl">No orders yet</h3>
            <p className="mt-1 text-sm text-ink-500">
              Start shopping to place your first order.
            </p>
            <Link
              to="/shop"
              className="mt-5 inline-flex rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-700"
            >
              Shop Now
            </Link>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((o) => (
              <Link
                key={o._id}
                to={`/account/orders/${o._id}`}
                className="block rounded-3xl bg-white p-5 shadow-card transition hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{o.orderNumber}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${STATUS_STYLES[o.status] || "bg-cream text-ink-500"}`}>
                        {o.status}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-ink-500">
                      Placed {formatDate(o.createdAt)} · {o.items.length} item(s)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatPrice(o.total)}</div>
                    <div className="text-xs text-ink-500 capitalize">{o.paymentMethod}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 overflow-hidden">
                  {o.items.slice(0, 4).map((i) => (
                    <img
                      key={i.productId + i.variant}
                      src={i.image}
                      alt=""
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                  ))}
                  {o.items.length > 4 && (
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-cream text-xs text-ink-500">
                      +{o.items.length - 4}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}