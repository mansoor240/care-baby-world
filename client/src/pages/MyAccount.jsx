import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomer } from "../context/CustomerContext";
import api from "../api/client";
import { formatPrice, formatDate } from "../lib/format";
import { Package, LogOut, User, MapPin, Truck, Plus, Trash2 } from "lucide-react";

const STATUS_STYLES = {
  pending:    "bg-sand-100 text-sand-500",
  confirmed:  "bg-sky-100 text-sky-500",
  processing: "bg-lavender-100 text-lavender-500",
  shipped:    "bg-sage-100 text-sage-500",
  delivered:  "bg-sage-100 text-sage-500",
  cancelled:  "bg-red-100 text-red-500",
};

const STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function MyAccount() {
  const { customer, isLoggedIn, ready, logout } = useCustomer();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: "Home",
    fullName: "",
    mobile: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !isLoggedIn) navigate("/login", { replace: true });
  }, [ready, isLoggedIn, navigate]);

  useEffect(() => {
    if (!ready || !isLoggedIn) return;
    setLoading(true);
    Promise.all([
      api.get("/customers/me/orders"),
      api.get("/customers/me/addresses"),
    ])
      .then(([o, a]) => {
        setOrders(o.data);
        setAddresses(a.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ready, isLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const saveAddress = async () => {
    if (!newAddr.fullName || !newAddr.mobile || !newAddr.house || !newAddr.pincode) {
      return alert("Please fill all required fields");
    }
    try {
      const { data } = await api.post("/customers/me/addresses", newAddr);
      setAddresses(data);
      setAddingAddress(false);
      setNewAddr({
        label: "Home",
        fullName: "",
        mobile: "",
        house: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      });
    } catch (e) {
      alert(e.response?.data?.error || "Could not save address");
    }
  };

  const removeAddress = async (idx) => {
    if (!confirm("Delete this address?")) return;
    try {
      const { data } = await api.delete(`/customers/me/addresses/${idx}`);
      setAddresses(data);
    } catch {
      alert("Could not delete");
    }
  };

  if (!ready || !isLoggedIn) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="rounded-4xl bg-gradient-to-r from-blush-50 to-sand-50 p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">
              Welcome, {customer?.name?.split(" ")[0]}
            </h1>
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

      {/* Quick Links — 4 cards */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <a
          href="#orders"
          className="flex items-start gap-3 rounded-3xl bg-white p-5 shadow-card hover:shadow-soft transition"
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-blush-50 text-blush-500">
            <Package size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold">My Orders</div>
            <div className="text-xs text-ink-500">
              {orders.length > 0 ? `${orders.length} order(s)` : "No orders yet"}
            </div>
          </div>
        </a>

        <a
          href="#addresses"
          className="flex items-start gap-3 rounded-3xl bg-white p-5 shadow-card hover:shadow-soft transition"
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-blush-50 text-blush-500">
            <MapPin size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold">My Addresses</div>
            <div className="text-xs text-ink-500">
              {addresses.length} saved
            </div>
          </div>
        </a>

        <Link
          to="/track"
          className="flex items-start gap-3 rounded-3xl bg-white p-5 shadow-card hover:shadow-soft transition"
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-blush-50 text-blush-500">
            <Truck size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold">Track Order</div>
            <div className="text-xs text-ink-500">By order number</div>
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

      {/* Orders Section */}
      <div className="mt-10" id="orders">
        <h2 className="mb-4 font-display text-2xl">My Orders</h2>

        {loading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton h-32 rounded-3xl" />
            ))}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-card animate-[fadeIn_0.4s_ease-out]">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-blush-50 text-5xl">
              📦
            </div>
            <h3 className="mt-6 font-display text-2xl">No orders yet</h3>
            <p className="mt-2 max-w-md mx-auto text-sm text-ink-500">
              When you place your first order, you'll see it here. You can
              track its status anytime.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-700 transition-transform active:scale-95"
            >
              Start shopping
            </Link>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((o) => (
              <OrderCard key={o._id} order={o} />
            ))}
          </div>
        )}
      </div>

      {/* Addresses Section */}
      <div className="mt-10" id="addresses">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl">My Addresses</h2>
          {addresses.length < 5 && !addingAddress && (
            <button
              onClick={() => {
                setAddingAddress(true);
                setNewAddr({
                  label: "Home",
                  fullName: customer?.name || "",
                  mobile: customer?.mobile || "",
                  house: "",
                  street: "",
                  city: "",
                  state: "",
                  pincode: "",
                });
              }}
              className="flex items-center gap-1 rounded-full bg-ink-900 px-4 py-2 text-sm text-white hover:bg-ink-700"
            >
              <Plus size={14} /> Add Address
            </button>
          )}
        </div>

        {addresses.length === 0 && !addingAddress && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-card">
            <MapPin size={32} className="mx-auto text-ink-300" />
            <p className="mt-2 text-sm text-ink-500">No addresses saved yet.</p>
            <p className="text-xs text-ink-500">They'll be saved automatically at checkout.</p>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((addr, idx) => (
            <div key={idx} className="rounded-3xl bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blush-50 px-2 py-0.5 text-xs font-semibold text-blush-500">
                    {addr.label || "Home"}
                  </span>
                </div>
                <button
                  onClick={() => removeAddress(idx)}
                  className="text-ink-300 hover:text-red-500"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-3 text-sm text-ink-700">
                <div className="font-medium">{addr.fullName}</div>
                <div>{addr.house}, {addr.street}</div>
                <div>{addr.city}, {addr.state} — {addr.pincode}</div>
                <div className="mt-1 text-xs text-ink-500">📞 {addr.mobile}</div>
              </div>
            </div>
          ))}
        </div>

        {addingAddress && (
          <div className="mt-4 rounded-3xl bg-white p-6 shadow-card">
            <h3 className="font-display text-lg">New Address</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input label="Label" value={newAddr.label} onChange={(v) => setNewAddr({ ...newAddr, label: v })} />
              <Input label="Full Name" value={newAddr.fullName} onChange={(v) => setNewAddr({ ...newAddr, fullName: v })} />
              <Input label="Mobile" value={newAddr.mobile} onChange={(v) => setNewAddr({ ...newAddr, mobile: v.replace(/\D/g, "").slice(0, 10) })} />
              <Input label="Pincode" value={newAddr.pincode} onChange={(v) => setNewAddr({ ...newAddr, pincode: v.replace(/\D/g, "").slice(0, 6) })} />
              <div className="sm:col-span-2">
                <Input label="House / Flat" value={newAddr.house} onChange={(v) => setNewAddr({ ...newAddr, house: v })} />
              </div>
              <div className="sm:col-span-2">
                <Input label="Street / Area" value={newAddr.street} onChange={(v) => setNewAddr({ ...newAddr, street: v })} />
              </div>
              <Input label="City" value={newAddr.city} onChange={(v) => setNewAddr({ ...newAddr, city: v })} />
              <Input label="State" value={newAddr.state} onChange={(v) => setNewAddr({ ...newAddr, state: v })} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setAddingAddress(false)}
                className="rounded-full border border-ink-900/10 px-5 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveAddress}
                className="rounded-full bg-ink-900 px-5 py-2 text-sm text-white hover:bg-ink-700"
              >
                Save Address
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  const currentIdx = STEPS.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-900/5 p-5">
        <div className="flex items-center gap-3">
          <span className="font-semibold">{order.orderNumber}</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
              STATUS_STYLES[order.status] || "bg-cream text-ink-500"
            }`}
          >
            {order.status}
          </span>
        </div>
        <div className="text-sm text-ink-500">
          Placed {formatDate(order.createdAt)}
        </div>
      </div>

      {!isCancelled && (
        <div className="px-5 pt-4">
          <div className="flex items-center">
            {STEPS.map((s, i) => {
              const done = i <= currentIdx;
              return (
                <div key={s} className="flex flex-1 items-center">
                  <div
                    className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${
                      done ? "bg-sage-500 text-white" : "bg-cream text-ink-300"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 ${
                        i < currentIdx ? "bg-sage-500" : "bg-cream"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-ink-500">
            <span>Pending</span>
            <span>Confirmed</span>
            <span>Processing</span>
            <span>Shipped</span>
            <span>Delivered</span>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 overflow-hidden">
          {order.items.slice(0, 4).map((i) => (
            <img
              key={i.productId + i.variant}
              src={i.image}
              alt=""
              className="h-14 w-14 rounded-2xl object-cover"
            />
          ))}
          {order.items.length > 4 && (
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cream text-xs text-ink-500">
              +{order.items.length - 4}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="text-sm text-ink-500">
            {order.items.length} item(s)
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">{formatPrice(order.total)}</div>
            <div className="text-xs text-ink-500 capitalize">
              {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid online"}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            to={`/account/orders/${order._id}`}
            className="flex-1 rounded-full bg-ink-900 py-2.5 text-center text-sm font-medium text-white hover:bg-ink-700"
          >
            View Details
          </Link>
          <Link
            to="/track"
            className="flex-1 rounded-full border border-ink-900/10 bg-white py-2.5 text-center text-sm font-medium hover:bg-cream"
          >
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-2.5 text-sm focus:border-blush-400 focus:outline-none"
      />
    </label>
  );
}