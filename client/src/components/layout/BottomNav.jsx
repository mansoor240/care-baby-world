import { NavLink, useLocation } from "react-router-dom";
import { Home, Grid3x3, Search, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function BottomNav() {
  const cart = useCart();
  const location = useLocation();
  const count = cart.items.reduce((s, i) => s + i.quantity, 0);

  const handleTabClick = (to) => (e) => {
    if (location.pathname === to || (to === "/" && location.pathname === "/")) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const items = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/shop", icon: Grid3x3, label: "Shop" },
    { to: "/search", icon: Search, label: "Search" },
    { to: "/wishlist", icon: Heart, label: "Wishlist" },
    { to: "/cart", icon: ShoppingBag, label: "Cart", badge: count },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink-900/5 bg-white md:hidden dark:border-white/5 dark:bg-night-800">
      <div className="grid grid-cols-5">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === "/"}
            onClick={handleTabClick(it.to)}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-0.5 py-2 text-[11px] transition-colors ${
                isActive
                  ? "text-blush-500"
                  : "text-ink-500 dark:text-night-300"
              }`
            }
          >
            <it.icon size={20} />
            {it.badge > 0 && (
              <span className="absolute top-1 right-[28%] grid h-4 min-w-4 place-items-center rounded-full bg-blush-400 px-1 text-[10px] font-bold text-white">
                {it.badge}
              </span>
            )}
            <span>{it.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}