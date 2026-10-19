import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";
import { useCart } from "../context/CartContext";
import { useCustomer } from "../context/CustomerContext";
import { formatPrice } from "../lib/format";
import { storeConfig } from "../config/store";

const initialAddr = {
  fullName: "",
  mobile: "",
  email: "",
  house: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
};

export default function Checkout() {
  const cart = useCart();
  const { customer: loggedInCustomer, isLoggedIn } = useCustomer();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(initialAddr);
  const [payment, setPayment] = useState("cod");
  const [paymentMethods, setPaymentMethods] = useState({ cod: true, online: false, razorpayKeyId: null });
  const [couponCode, setCouponCode] = useState(cart.coupon?.code || "");
  const [applying, setApplying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get("/orders/payment-methods")
      .then((r) => setPaymentMethods(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isLoggedIn && loggedInCustomer) {
      setCustomer((prev) => ({
        ...prev,
        fullName: prev.fullName || loggedInCustomer.name || "",
        mobile: prev.mobile || loggedInCustomer.mobile || "",
        email: prev.email || loggedInCustomer.email || "",
      }));
    }
  }, [isLoggedIn, loggedInCustomer]);

  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = cart.coupon?.discount || 0;
  const delivery =
    subtotal >= storeConfig.freeDeliveryThreshold || subtotal === 0 ? 0 : storeConfig.deliveryFee;
  const total = subtotal - discount + delivery;

  if (cart.items.length === 0) {
    navigate("/cart");
    return null;
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplying(true);
    try {
      const { data } = await api.post("/coupons/validate", { code: couponCode.trim(), subtotal });
      cart.setCoupon(data);
      toast.success(`Coupon applied: −${formatPrice(data.discount)}`);
    } catch (e) {
      toast.error(e.response?.data?.error || "Invalid coupon");
      cart.setCoupon(null);
    } finally {
      setApplying(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!customer.fullName.trim()) return toast.error("Full name required");
    if (!/^[6-9]\d{9}$/.test(customer.mobile.replace(/\D/g, "").slice(-10)))
      return toast.error("Enter a valid 10-digit Indian mobile number");
    if (!customer.house || !customer.street || !customer.city || !customer.state)
      return toast.error("Please complete the address");
    if (!/^\d{6}$/.test(customer.pincode)) return toast.error("Enter a valid 6-digit pincode");

    const { prefixes = [], list = [] } = storeConfig.deliveryPincodes || {};
    const isDeliverable =
      list.includes(customer.pincode) ||
      prefixes.some((prefix) => customer.pincode.startsWith(prefix));
    if (!isDeliverable) {
      return toast.error(
        "Sorry, we currently deliver only in Hyderabad. Contact us on WhatsApp for special requests."
      );
    }

    setSubmitting(true);
    try {
      const headers = {};
      const token = localStorage.getItem("tn_customer_token");
      if (token) headers.Authorization = `Bearer ${token}`;

      const payload = {
        customer,
        items: cart.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          variant: i.variant,
        })),
        paymentMethod: payment,
        couponCode: cart.coupon?.code || "",
      };

      const { data } = await api.post("/orders", payload, { headers });

      if (payment === "cod") {
        cart.clear();
        toast.success("Order placed!");
        navigate(`/order/${data.orderNumber}`);
        return;
      }

      const options = {
        key: data.razorpayKeyId,
        amount: data.amount,
        currency: "INR",
        name: "CareBabyStore",
        description: `Order ${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: customer.fullName,
          email: customer.email || "",
          contact: customer.mobile,
        },
        theme: { color: "#E2708F" },
        handler: async (response) => {
          try {
            await api.post("/orders/verify-payment", {
              orderId: data._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            cart.clear();
            toast.success("Payment successful!");
            navigate(`/order/${data.orderNumber}`);
          } catch {
            toast.error("Payment received but verification failed. Contact support.");
            navigate(`/order/${data.orderNumber}`);
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled. You can try again.");
            setSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not place order");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl text-ink-900 dark:text-night-50">Checkout</h1>

      <form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
            <h2 className="font-display text-lg text-ink-900 dark:text-night-50">Contact</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name *" value={customer.fullName} onChange={(v) => setCustomer({ ...customer, fullName: v })} />
              <Field label="Mobile Number *" value={customer.mobile} onChange={(v) => setCustomer({ ...customer, mobile: v.replace(/\D/g, "").slice(0, 10) })} placeholder="10-digit Indian mobile" />
              <div className="sm:col-span-2">
                <Field label="Email (optional)" type="email" value={customer.email} onChange={(v) => setCustomer({ ...customer, email: v })} />
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
            <h2 className="font-display text-lg text-ink-900 dark:text-night-50">Delivery Address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="House / Flat / Building *" value={customer.house} onChange={(v) => setCustomer({ ...customer, house: v })} />
              </div>
              <div className="sm:col-span-2">
                <Field label="Street / Area *" value={customer.street} onChange={(v) => setCustomer({ ...customer, street: v })} />
              </div>
              <Field label="City *" value={customer.city} onChange={(v) => setCustomer({ ...customer, city: v })} />
              <Field label="State *" value={customer.state} onChange={(v) => setCustomer({ ...customer, state: v })} />
              <Field label="Pincode *" value={customer.pincode} onChange={(v) => setCustomer({ ...customer, pincode: v.replace(/\D/g, "").slice(0, 6) })} />
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
            <h2 className="font-display text-lg text-ink-900 dark:text-night-50">Payment Method</h2>
            <div className={`mt-4 grid gap-3 ${paymentMethods.online ? "sm:grid-cols-2" : ""}`}>
              <PayOption active={payment === "cod"} onClick={() => setPayment("cod")} title="Cash on Delivery" subtitle="Pay when you receive" />
              {paymentMethods.online && (
                <PayOption active={payment === "online"} onClick={() => setPayment("online")} title="Online Payment" subtitle="UPI / Cards / Netbanking" />
              )}
            </div>
            {payment === "online" && (
              <p className="mt-3 rounded-2xl bg-sand-50 p-3 text-xs text-ink-700 dark:bg-night-700 dark:text-night-100">
                You'll be redirected to a secure payment page to complete your order.
              </p>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-3xl bg-white p-6 shadow-card lg:sticky lg:top-24 dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
          <h2 className="font-display text-lg text-ink-900 dark:text-night-50">Order Summary</h2>

          <ul className="mt-4 space-y-3">
            {cart.items.map((i) => (
              <li key={i.key} className="flex gap-3">
                <img src={i.image} alt="" className="h-14 w-14 rounded-2xl object-cover" />
                <div className="flex-1 text-sm">
                  <div className="line-clamp-1 text-ink-900 dark:text-night-50">{i.name}</div>
                  <div className="text-xs text-ink-500 dark:text-night-400">
                    Qty {i.quantity} {i.variant && `· ${i.variant}`}
                  </div>
                </div>
                <div className="text-sm font-medium text-ink-900 dark:text-night-50">
                  {formatPrice(i.price * i.quantity)}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-ink-900/10 dark:border-white/10 pt-4">
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="flex-1 rounded-2xl border border-ink-900/10 bg-cream px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 dark:border-white/10 dark:bg-night-700 dark:text-night-50 dark:placeholder:text-night-400"
              />
              <button
                type="button"
                onClick={applyCoupon}
                disabled={applying}
                className="rounded-2xl bg-blush-400 px-4 text-sm font-medium text-white hover:bg-blush-500 disabled:opacity-50 dark:bg-blush-500 dark:hover:bg-blush-400"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            {discount > 0 && <Row label={`Discount (${cart.coupon.code})`} value={`− ${formatPrice(discount)}`} />}
            <Row label="Delivery" value={delivery === 0 ? "Free" : formatPrice(delivery)} />
            <div className="border-t border-ink-900/10 dark:border-white/10 pt-2" />
            <Row label="Total" value={formatPrice(total)} bold />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full rounded-full bg-ink-900 py-3 text-sm font-medium text-white hover:bg-ink-700 disabled:opacity-50 transition dark:bg-blush-500 dark:hover:bg-blush-400"
          >
            {submitting ? "Placing order…" : "Place Order"}
          </button>
          <p className="mt-2 text-center text-xs text-ink-500 dark:text-night-400">
            By placing this order you agree to our{" "}
            <a href="/policies/terms" className="underline">Terms</a>.
          </p>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-night-100">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-blush-400 focus:outline-none dark:border-white/10 dark:bg-night-700 dark:text-night-50 dark:placeholder:text-night-400"
      />
    </label>
  );
}

function PayOption({ active, onClick, title, subtitle, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-1 rounded-2xl border-2 p-4 text-left transition ${
        active
          ? "border-blush-400 bg-blush-50 dark:border-blush-300 dark:bg-blush-400/15"
          : "border-ink-900/10 bg-white dark:border-white/10 dark:bg-night-700"
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <span className="text-sm font-semibold text-ink-900 dark:text-night-50">{title}</span>
        {badge && (
          <span className="rounded-full bg-sand-100 px-2 py-0.5 text-[10px] font-medium text-sand-500 dark:bg-sand-400/20 dark:text-sand-300">
            {badge}
          </span>
        )}
      </div>
      <span className="text-xs text-ink-500 dark:text-night-300">{subtitle}</span>
    </button>
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