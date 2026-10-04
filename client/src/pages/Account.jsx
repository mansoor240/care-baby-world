import { Link } from "react-router-dom";
import { User, Package, Heart, MapPin, LogOut } from "lucide-react";
import { storeConfig } from "../config/store";

export default function Account() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl">My Account</h1>
      <p className="mt-1 text-sm text-ink-500">
        Customer accounts are optional in this MVP. Track orders via WhatsApp.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          { icon: Package, title: "My Orders", text: "Track recent orders", to: "/shop" },
          { icon: Heart, title: "Wishlist", text: "Saved items", to: "/wishlist" },
          { icon: MapPin, title: "Addresses", text: "Manage delivery addresses", to: "/checkout" },
          { icon: User, title: "Profile", text: "Name and contact", to: "/account" },
        ].map((it) => (
          <Link
            key={it.title}
            to={it.to}
            className="flex items-start gap-3 rounded-3xl bg-white p-5 shadow-card hover:shadow-soft"
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-blush-50 text-blush-500">
              <it.icon size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold">{it.title}</div>
              <div className="text-xs text-ink-500">{it.text}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-3xl bg-sand-50 p-6 text-sm">
        <p className="text-ink-700">
          For order help, chat with us on WhatsApp: <b>{storeConfig.phone}</b>
        </p>
      </div>
    </div>
  );
}