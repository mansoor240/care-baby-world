import { Link } from "react-router-dom";
import { storeConfig } from "../../config/store";

export default function Footer() {
  return (
    <footer className="border-t border-ink-900/5 bg-white">
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
            className="inline-block font-display text-lg font-bold transition hover:opacity-80"
          >
            Care<span className="text-blush-400">BabyStore</span>
          </Link>
          <p className="mt-2 text-sm text-ink-500">{storeConfig.tagline}</p>
          <p className="mt-4 text-xs text-ink-500">
            {storeConfig.address.line1}, {storeConfig.address.area}
            <br />
            {storeConfig.address.city}, {storeConfig.address.state} —{" "}
            {storeConfig.address.pincode}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link to="/shop" className="hover:text-ink-900">All Products</Link></li>
            <li><Link to="/category/baby-clothing" className="hover:text-ink-900">Baby Clothing</Link></li>
            <li><Link to="/category/feeding" className="hover:text-ink-900">Feeding</Link></li>
            <li><Link to="/category/toys" className="hover:text-ink-900">Toys</Link></li>
            <li><Link to="/category/gift-sets" className="hover:text-ink-900">Gift Sets</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Help</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link to="/track" className="hover:text-ink-900">Track Order</Link></li>
            <li><Link to="/account" className="hover:text-ink-900">My Account</Link></li>
            <li><Link to="/policies/shipping" className="hover:text-ink-900">Shipping</Link></li>
            <li><Link to="/policies/returns" className="hover:text-ink-900">Returns & Refunds</Link></li>
            <li><Link to="/policies/privacy" className="hover:text-ink-900">Privacy Policy</Link></li>
            <li><Link to="/policies/terms" className="hover:text-ink-900">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li>{storeConfig.phone}</li>
            <li>{storeConfig.email}</li>
            <li>{storeConfig.openingHours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-900/5 py-4 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} {storeConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}