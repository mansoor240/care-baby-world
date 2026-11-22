import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Ticket,
  LogOut,
  HelpCircle,
  MessageSquare,
  Settings as SettingsIcon,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const wasDark = html.classList.contains("dark");
    if (wasDark) html.classList.remove("dark");
    return () => {
      if (wasDark) html.classList.add("dark");
    };
  }, []);

  const nav = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { to: "/admin/categories", label: "Categories", icon: FolderTree },
    { to: "/admin/coupons", label: "Coupons", icon: Ticket },
    { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
    { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
    { to: "/admin/questions", label: "Questions", icon: MessageSquare },
  ];

  const SidebarContent = (
    <>
      <Link
        to="/admin"
        className="block px-2 py-2 font-display text-lg font-bold"
        onClick={() => setDrawerOpen(false)}
      >
        Care<span className="text-blush-400">BabyStore</span>{" "}
        <span className="text-xs text-ink-500">admin</span>
      </Link>
      <nav className="mt-4 space-y-1">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={() => setDrawerOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm ${
                isActive
                  ? "bg-blush-50 text-blush-500 font-semibold"
                  : "text-ink-700 hover:bg-cream"
              }`
            }
          >
            <n.icon size={16} /> {n.label}
          </NavLink>
        ))}
        <button
          onClick={() => {
            logout();
            navigate("/admin/login");
          }}
          className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-sm text-ink-700 hover:bg-cream"
        >
          <LogOut size={16} /> Logout
        </button>
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-900/5 bg-cream px-4 py-3 md:hidden">
        <Link to="/admin" className="font-display text-lg font-bold">
          Care<span className="text-blush-400">BabyStore</span>{" "}
          <span className="text-xs text-ink-500">admin</span>
        </Link>
        <button
          onClick={() => setDrawerOpen(true)}
          className="rounded-full p-2 hover:bg-white"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-900/40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        >
          <aside
            className="h-full w-72 overflow-y-auto rounded-r-3xl bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <Link
                to="/admin"
                className="font-display text-lg font-bold"
                onClick={() => setDrawerOpen(false)}
              >
                Care<span className="text-blush-400">BabyStore</span>
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-full p-2 hover:bg-cream"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="mt-4 space-y-1">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm ${
                      isActive
                        ? "bg-blush-50 text-blush-500 font-semibold"
                        : "text-ink-700 hover:bg-cream"
                    }`
                  }
                >
                  <n.icon size={16} /> {n.label}
                </NavLink>
              ))}
              <button
                onClick={() => {
                  logout();
                  navigate("/admin/login");
                }}
                className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-sm text-ink-700 hover:bg-cream"
              >
                <LogOut size={16} /> Logout
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* Main layout */}
      <div className="mx-auto grid max-w-7xl gap-6 p-4 md:grid-cols-[240px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden h-fit rounded-3xl bg-white p-4 shadow-card md:sticky md:top-4 md:block">
          {SidebarContent}
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}