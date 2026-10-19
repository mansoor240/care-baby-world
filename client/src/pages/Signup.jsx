import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCustomer } from "../context/CustomerContext";
import { ArrowRight, Check } from "lucide-react";

export default function Signup() {
  const { signup } = useCustomer();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", mobile: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name required");
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return toast.error("Enter a valid 10-digit Indian mobile");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      await signup(form);
      toast.success("Welcome to CareBabyStore!");
      navigate("/account");
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-cream dark:bg-night-900">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <span className="font-display text-2xl font-bold text-ink-900 dark:text-night-50">
              Care<span className="text-blush-400">BabyStore</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl text-ink-900 dark:text-night-50">Create your account</h1>
          <p className="mt-2 text-sm text-ink-500 dark:text-night-300">
            Save your orders and track them anytime.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink-700 dark:text-night-100">Full Name</span>
              <input
                type="text"
                value={form.name}
                onChange={set("name")}
                autoComplete="name"
                placeholder="John Smith"
                className="w-full rounded-2xl border border-ink-900/10 bg-white px-4 py-3.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-blush-400 focus:outline-none focus:ring-2 focus:ring-blush-100 dark:border-white/10 dark:bg-night-800 dark:text-night-50 dark:placeholder:text-night-400 dark:focus:ring-blush-400/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink-700 dark:text-night-100">Mobile Number</span>
              <input
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="10-digit mobile"
                className="w-full rounded-2xl border border-ink-900/10 bg-white px-4 py-3.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-blush-400 focus:outline-none focus:ring-2 focus:ring-blush-100 dark:border-white/10 dark:bg-night-800 dark:text-night-50 dark:placeholder:text-night-400 dark:focus:ring-blush-400/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink-700 dark:text-night-100">Email (optional)</span>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-ink-900/10 bg-white px-4 py-3.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-blush-400 focus:outline-none focus:ring-2 focus:ring-blush-100 dark:border-white/10 dark:bg-night-800 dark:text-night-50 dark:placeholder:text-night-400 dark:focus:ring-blush-400/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink-700 dark:text-night-100">Password</span>
              <input
                type="password"
                value={form.password}
                onChange={set("password")}
                autoComplete="new-password"
                placeholder="Minimum 6 characters"
                className="w-full rounded-2xl border border-ink-900/10 bg-white px-4 py-3.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-blush-400 focus:outline-none focus:ring-2 focus:ring-blush-100 dark:border-white/10 dark:bg-night-800 dark:text-night-50 dark:placeholder:text-night-400 dark:focus:ring-blush-400/20"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 py-3.5 text-sm font-medium text-white hover:bg-ink-700 disabled:opacity-50 transition dark:bg-blush-500 dark:hover:bg-blush-400"
            >
              {loading ? "Creating account…" : "Create account"}
              {!loading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-500 dark:text-night-300">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blush-500 hover:underline dark:text-blush-300">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Benefits panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blush-500 to-blush-600 p-12 text-white items-center dark:from-blush-600 dark:to-blush-700">
        <div className="max-w-md">
          <div className="text-xs font-semibold uppercase tracking-wider text-blush-200">
            What you get
          </div>
          <h2 className="mt-3 font-display text-3xl">
            Save your orders, track easily.
          </h2>

          <ul className="mt-8 space-y-4">
            {[
              "Save your order history",
              "Track orders anytime",
              "Save addresses for faster checkout",
              "Faster repeat orders",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/20">
                  <Check size={14} />
                </div>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}