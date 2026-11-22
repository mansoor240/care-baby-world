import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockoutMsg, setLockoutMsg] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ Force light mode on admin login page
  useEffect(() => {
    const html = document.documentElement;
    const wasDark = html.classList.contains("dark");
    if (wasDark) html.classList.remove("dark");
    return () => {
      if (wasDark) html.classList.add("dark");
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLockoutMsg("");
    try {
      await login(username, password);
      toast.success("Welcome back");
      navigate("/admin");
    } catch (err) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.error;

      if (status === 429) {
        // Rate limited — show persistent message on the form
        const msg =
          serverMsg ||
          "Too many login attempts. Try again in 15 minutes.";
        setLockoutMsg(msg);
        toast.error(msg);
      } else if (status === 401) {
        toast.error(serverMsg || "Invalid credentials");
      } else if (status >= 500) {
        toast.error("Server error. Please try again.");
      } else if (!err?.response) {
        toast.error("Cannot reach server. Check your connection.");
      } else {
        toast.error(serverMsg || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-soft"
      >
        <h1 className="font-display text-2xl">
          Care<span className="text-blush-400">BabyStore</span> Admin
        </h1>
        <p className="mt-1 text-sm text-ink-500">Sign in to manage your store</p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-700">
              Username
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm text-ink-900 focus:border-blush-400 focus:outline-none"
              autoComplete="username"
              disabled={!!lockoutMsg}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-700">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm text-ink-900 focus:border-blush-400 focus:outline-none"
              autoComplete="current-password"
              disabled={!!lockoutMsg}
            />
          </label>
        </div>

        {lockoutMsg && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {lockoutMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !!lockoutMsg}
          className="mt-6 w-full rounded-full bg-ink-900 py-3 text-sm font-medium text-white hover:bg-ink-700 disabled:opacity-50"
        >
          {loading
            ? "Signing in…"
            : lockoutMsg
            ? "Locked — try later"
            : "Sign in"}
        </button>

        <p className="mt-4 text-center text-xs text-ink-500">
          Change credentials in your server <code className="rounded bg-cream px-1 py-0.5 text-[10px]">.env</code>
        </p>
      </form>
    </div>
  );
}