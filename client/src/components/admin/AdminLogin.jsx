import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success("Welcome back");
      navigate("/admin");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-soft">
        <h1 className="font-display text-2xl">
          Care<span className="text-blush-400">BabyStore</span> Admin
        </h1>
        <p className="mt-1 text-sm text-ink-500">Sign in to manage your store</p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm focus:outline-none"
              autoComplete="username"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm focus:outline-none"
              autoComplete="current-password"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-ink-900 py-3 text-sm font-medium text-white hover:bg-ink-700 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-4 text-center text-xs text-ink-500">
          Default: admin / admin123 (change in <code>.env</code>)
        </p>
      </form>
    </div>
  );
}