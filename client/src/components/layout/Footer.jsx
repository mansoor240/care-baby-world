import { Link } from "react-router-dom";
import { storeConfig } from "../../config/store";
import { Mail, Phone, MapPin, Send, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-ink-900/5 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        {/* Brand column */}
        <div>
          <h3 className="font-display text-lg font-bold">
            Care<span className="text-blush-400">Baby</span>
          </h3>
          <p className="mt-2 text-sm text-ink-500">{storeConfig.tagline}</p>

          <div className="mt-4 space-y-2 text-xs text-ink-500">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              <span>
                {storeConfig.address.line1}, {storeConfig.address.area}
                <br />
                {storeConfig.address.city}, {storeConfig.address.state} —{" "}
                {storeConfig.address.pincode}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="shrink-0" />
              <a href={`tel:${storeConfig.phone}`} className="hover:text-ink-900">
                {storeConfig.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="shrink-0" />
              <a href={`mailto:${storeConfig.email}`} className="hover:text-ink-900">
                {storeConfig.email}
              </a>
            </div>
          </div>

          {/* Social icons */}
          <div className="mt-4 flex gap-2">
            {storeConfig.social?.instagram && (
              <a
                href={storeConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-full bg-cream text-ink-700 transition hover:bg-blush-50 hover:text-blush-500"
              >
                <Send size={16} />
              </a>
            )}
            {storeConfig.social?.facebook && (
              <a
                href={storeConfig.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="grid h-9 w-9 place-items-center rounded-full bg-cream text-ink-700 transition hover:bg-sky-50 hover:text-sky-500"
              >
                <Users size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Shop links */}
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

        {/* Help */}
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

        {/* Trust */}
        <div>
          <h4 className="text-sm font-semibold text-ink-900">We Accept</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {["UPI", "Visa", "Mastercard", "COD"].map((method) => (
              <span
                key={method}
                className="rounded-lg border border-ink-900/10 bg-cream px-3 py-1.5 text-xs font-medium text-ink-700"
              >
                {method}
              </span>
            ))}
          </div>

          <h4 className="mt-6 text-sm font-semibold text-ink-900">Store Hours</h4>
          <p className="mt-2 text-xs text-ink-500">{storeConfig.openingHours}</p>
        </div>
      </div>

      <div className="border-t border-ink-900/5 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-ink-500 sm:flex-row">
          <div>
            © {new Date().getFullYear()} {storeConfig.name}. All rights reserved.
          </div>
          <div>Made with ❤️ in Hyderabad</div>
        </div>
      </div>
    </footer>
  );
}