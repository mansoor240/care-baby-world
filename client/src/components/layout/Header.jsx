import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCustomer } from "../../context/CustomerContext";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/category/baby-clothing", label: "Clothing" },
  { to: "/category/feeding", label: "Feeding" },
  { to: "/category/toys", label: "Toys" },
  { to: "/category/gift-sets", label: "Gifts" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const cart = useCart();
  const wishlist = useWishlist();
  const { customer, isLoggedIn } = useCustomer();

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const cartCount = cart.items.reduce((s, i) => s + i.quantity, 0);
  const wishCount = wishlist.items.length;

  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/5 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <button
          className="md:hidden -ml-1 p-2 text-ink-900"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/" className="font-display text-xl font-bold text-ink-900">
          Care<span className="text-blush-400">BabyStore</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-4">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `text-sm ${isActive ? "text-ink-900 font-semibold" : "text-ink-500 hover:text-ink-900"}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden md:flex items-center">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for products…"
              className="w-56 lg:w-72 rounded-full border border-ink-900/10 bg-white pl-9 pr-4 py-2 text-sm focus:border-blush-400 focus:outline-none"
            />
          </div>
        </form>

        <div className="ml-auto md:ml-2 flex items-center gap-1">
          <Link to="/search" className="md:hidden p-2" aria-label="Search">
            <Search size={20} />
          </Link>
          <Link to="/wishlist" className="relative p-2" aria-label="Wishlist">
            <Heart size={20} />
            {wishCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-blush-400 px-1 text-[10px] font-bold text-white">
                {wishCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative p-2" aria-label="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-blush-400 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
                    {isLoggedIn ? (
            <Link
              to="/account"
              className="hidden md:flex items-center gap-2 rounded-full border border-ink-900/10 bg-white px-3 py-1.5 text-sm hover:bg-cream"
            >
              <User size={16} />
              <span className="max-w-[80px] truncate">
                Hi, {customer?.name?.split(" ")[0]}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-2 rounded-full border border-ink-900/10 bg-white px-3 py-1.5 text-sm hover:bg-cream"
            >
              <User size={16} />
              Login
            </Link>
          )}
          <Link to={isLoggedIn ? "/account" : "/login"} className="md:hidden p-2" aria-label="Account">
            <User size={20} />
          </Link>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink-900/5 bg-white">
          <form onSubmit={submit} className="p-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full border border-ink-900/10 bg-cream px-4 py-2 text-sm focus:outline-none"
            />
          </form>
          <nav className="grid gap-1 p-2">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm text-ink-700 hover:bg-cream"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}