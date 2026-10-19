import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCustomer } from "../context/CustomerContext";
import { ArrowRight } from "lucide-react";

export default function Login() {
  const { login } = useCustomer();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) return toast.error("Enter a valid 10-digit mobile");

    setLoading(true);
    try {
      await login({ mobile, password });
      toast.success("Welcome back!");
      navigate("/account");
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-cream dark:bg-night-900">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <span className="font-display text-2xl font-bold text-ink-900 dark:text-night-50">
            Care<span className="text-blush-400">BabyStore</span>
          </span>
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
          <h1 className="font-display text-2xl text-ink-900 dark:text-night-50">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-500 dark:text-night-300">Log in to see your orders.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink-700 dark:text-night-100">Mobile Number</span>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                inputMode="numeric"
                autoComplete="tel-national"
                className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-blush-400 focus:outline-none focus:ring-2 focus:ring-blush-100 dark:border-white/10 dark:bg-night-700 dark:text-night-50 dark:placeholder:text-night-400 dark:focus:ring-blush-400/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink-700 dark:text-night-100">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-blush-400 focus:outline-none focus:ring-2 focus:ring-blush-100 dark:border-white/10 dark:bg-night-700 dark:text-night-50 dark:placeholder:text-night-400 dark:focus:ring-blush-400/20"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 py-3.5 text-sm font-medium text-white hover:bg-ink-700 disabled:opacity-50 transition dark:bg-blush-500 dark:hover:bg-blush-400"
            >
              {loading ? "Logging in…" : "Log in"}
              {!loading && (
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-ink-500 dark:text-night-300">
          New here?{" "}
          <Link to="/signup" className="font-medium text-blush-500 hover:underline dark:text-blush-300">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}