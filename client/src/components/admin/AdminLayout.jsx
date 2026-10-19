import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, FolderTree, Ticket, LogOut, HelpCircle, MessageSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const nav = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { to: "/admin/categories", label: "Categories", icon: FolderTree },
    { to: "/admin/coupons", label: "Coupons", icon: Ticket },
    { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
    { to: "/admin/questions", label: "Questions", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl grid gap-6 p-4 md:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl bg-white p-4 shadow-card h-fit md:sticky md:top-4">
          <Link to="/admin" className="block px-2 py-2 font-display text-lg font-bold">
            Care<span className="text-blush-400">BabyStore</span>{" "}
            <span className="text-xs text-ink-500">admin</span>
          </Link>
          <nav className="mt-4 space-y-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-2xl px-3 py-2 text-sm ${
                    isActive ? "bg-blush-50 text-blush-500 font-semibold" : "text-ink-700 hover:bg-cream"
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
              className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm text-ink-700 hover:bg-cream"
            >
              <LogOut size={16} /> Logout
            </button>
          </nav>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}