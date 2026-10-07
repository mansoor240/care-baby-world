import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCustomer } from "../context/CustomerContext";

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
      toast.success("Account created!");
      navigate("/account");
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-3xl bg-white p-8 shadow-card">
        <h1 className="font-display text-2xl">Create your account</h1>
        <p className="mt-1 text-sm text-ink-500">
          Save your orders and track them anytime.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Full Name" value={form.name} onChange={set("name")} autoComplete="name" />
          <Field
            label="Mobile Number"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
            inputMode="numeric"
            placeholder="10-digit mobile"
            autoComplete="tel-national"
          />
          <Field label="Email (optional)" type="email" value={form.email} onChange={set("email")} autoComplete="email" />
          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink-900 py-3 text-sm font-medium text-white hover:bg-ink-700 disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blush-500 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, placeholder, inputMode, autoComplete }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm focus:border-blush-400 focus:outline-none"
      />
    </label>
  );
}