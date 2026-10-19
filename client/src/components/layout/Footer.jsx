import { Link } from "react-router-dom";
import { storeConfig } from "../../config/store";

export default function Footer() {
  return (
    <footer className="border-t border-ink-900/5 bg-white dark:border-white/5 dark:bg-night-900">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <Link
            to="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="inline-block font-display text-lg font-bold text-ink-900 transition hover:opacity-80 dark:text-night-50"
          >
            Care<span className="text-blush-400">BabyStore</span>
          </Link>
          <p className="mt-2 text-sm text-ink-500 dark:text-night-300">
            {storeConfig.tagline}
          </p>
          <p className="mt-4 text-xs text-ink-500 dark:text-night-400">
            {storeConfig.address.line1}, {storeConfig.address.area}
            <br />
            {storeConfig.address.city}, {storeConfig.address.state} —{" "}
            {storeConfig.address.pincode}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900 dark:text-night-50">
            Shop
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500 dark:text-night-300">
            <li><Link to="/shop" className="hover:text-ink-900 dark:hover:text-night-50 transition">All Products</Link></li>
            <li><Link to="/category/baby-clothing" className="hover:text-ink-900 dark:hover:text-night-50 transition">Baby Clothing</Link></li>
            <li><Link to="/category/feeding" className="hover:text-ink-900 dark:hover:text-night-50 transition">Feeding</Link></li>
            <li><Link to="/category/toys" className="hover:text-ink-900 dark:hover:text-night-50 transition">Toys</Link></li>
            <li><Link to="/category/gift-sets" className="hover:text-ink-900 dark:hover:text-night-50 transition">Gift Sets</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900 dark:text-night-50">
            Help
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500 dark:text-night-300">
            <li><Link to="/faq" className="hover:text-ink-900 dark:hover:text-night-50 transition">FAQ</Link></li>
            <li><Link to="/track" className="hover:text-ink-900 dark:hover:text-night-50 transition">Track Order</Link></li>
            <li><Link to="/account" className="hover:text-ink-900 dark:hover:text-night-50 transition">My Account</Link></li>
            <li><Link to="/policies/shipping" className="hover:text-ink-900 dark:hover:text-night-50 transition">Shipping</Link></li>
            <li><Link to="/policies/returns" className="hover:text-ink-900 dark:hover:text-night-50 transition">Returns & Refunds</Link></li>
            <li><Link to="/policies/privacy" className="hover:text-ink-900 dark:hover:text-night-50 transition">Privacy Policy</Link></li>
            <li><Link to="/policies/terms" className="hover:text-ink-900 dark:hover:text-night-50 transition">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900 dark:text-night-50">
            Contact
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500 dark:text-night-300">
            <li>{storeConfig.phone}</li>
            <li>{storeConfig.email}</li>
            <li>{storeConfig.openingHours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-900/5 py-4 text-center text-xs text-ink-500 dark:border-white/5 dark:text-night-400">
        © {new Date().getFullYear()} {storeConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}