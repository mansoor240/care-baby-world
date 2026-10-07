import { Link } from "react-router-dom";
import { storeConfig } from "../../config/store";

export default function Footer() {
  return (
    <footer className="border-t border-ink-900/5 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <h3 className="font-display text-lg font-bold">
            Care<span className="text-blush-400">BabyStore</span>
          </h3>
          <p className="mt-2 text-sm text-ink-500">{storeConfig.tagline}</p>
          <p className="mt-4 text-xs text-ink-500">{storeConfig.address.line1}, {storeConfig.address.area}<br/>{storeConfig.address.city}, {storeConfig.address.state} — {storeConfig.address.pincode}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/category/baby-clothing">Baby Clothing</Link></li>
            <li><Link to="/category/feeding">Feeding</Link></li>
            <li><Link to="/category/toys">Toys</Link></li>
            <li><Link to="/category/gift-sets">Gift Sets</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Help</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link to="/track">Track Order</Link></li>
            <li><Link to="/policies/shipping">Shipping</Link></li>
            <li><Link to="/policies/returns">Returns & Refunds</Link></li>
            <li><Link to="/policies/privacy">Privacy Policy</Link></li>
            <li><Link to="/policies/terms">Terms & Conditions</Link></li>
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