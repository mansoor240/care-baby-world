import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import ProductGrid from "../components/product/ProductGrid";
import { storeConfig } from "../config/store";
import { whatsappLink, whatsappMessages } from "../lib/whatsapp";
import { MessageCircle, Truck, ShieldCheck, RotateCcw, HeartHandshake, Star } from "lucide-react";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/products", { params: { featured: true, limit: 8 } }),
      api.get("/products", { params: { bestseller: true, limit: 8 } }),
      api.get("/categories"),
    ])
      .then(([f, b, c]) => {
        setFeatured(f.data.items);
        setBestsellers(b.data.items);
        setCategories(c.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blush-50 via-cream to-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
          <div className="flex flex-col justify-center reveal-left">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-blush-500 shadow-card">
              <Star size={12} fill="currentColor" /> Trusted by local families
            </span>
            <h1 className="mt-4 font-display text-4xl leading-tight text-ink-900 sm:text-5xl">
              Everything Your <span className="text-blush-400">Little One</span> Needs
            </h1>
            <p className="mt-4 max-w-md text-ink-500">
              Baby essentials, clothing, toys and care products — all in one place. Delivered to your doorstep.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-700 transition-transform active:scale-95"
              >
                Shop Now
              </Link>
              <Link
                to="/shop"
                className="rounded-full border border-ink-900/15 bg-white px-6 py-3 text-sm font-medium text-ink-900 hover:bg-cream transition-transform active:scale-95"
              >
                Explore Categories
              </Link>
            </div>
          </div>
          <div className="relative reveal-right">
            <div className="aspect-[4/3] overflow-hidden rounded-4xl bg-white shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80"
                alt="Baby essentials"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between reveal">
          <h2 className="font-display text-2xl text-ink-900">Shop by Category</h2>
          <Link to="/shop" className="text-sm text-blush-500 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              className={`group rounded-3xl bg-white p-4 text-center shadow-card transition hover:-translate-y-1 hover:shadow-soft reveal stagger-${Math.min(i + 1, 6)}`}
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blush-50 text-2xl transition-transform group-hover:scale-110">
                {c.emoji || "🧸"}
              </div>
              <div className="mt-3 text-sm font-medium text-ink-900">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-end justify-between reveal">
          <h2 className="font-display text-2xl text-ink-900">Featured Products</h2>
          <Link to="/shop" className="text-sm text-blush-500 hover:underline">See all →</Link>
        </div>
        <div className="reveal">
          <ProductGrid products={featured} loading={loading} />
        </div>
      </section>

      {/* OFFER BANNER */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="overflow-hidden rounded-4xl bg-gradient-to-r from-lavender-100 via-blush-100 to-sand-100 p-8 md:p-12 reveal-scale">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-blush-500">
                Limited Time
              </div>
              <h3 className="mt-2 font-display text-3xl text-ink-900">
                Use code <span className="text-blush-500">WELCOME10</span>
              </h3>
              <p className="mt-2 text-ink-500">
                Get 10% off your first order above ₹499. Applicable at checkout.
              </p>
              <Link
                to="/shop"
                className="mt-5 inline-flex rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-700 transition-transform active:scale-95"
              >
                Shop the offer
              </Link>
            </div>
            <div className="rounded-3xl bg-white/70 p-6 text-center backdrop-blur">
              <div className="text-6xl">🎁</div>
              <p className="mt-3 text-sm text-ink-700">
                Free delivery on orders above {storeConfig.currency}{storeConfig.freeDeliveryThreshold}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 reveal">
          <h2 className="font-display text-2xl text-ink-900">Best Sellers</h2>
        </div>
        <div className="reveal">
          <ProductGrid products={bestsellers} loading={loading} />
        </div>
      </section>

      {/* WHY US */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-8 text-center font-display text-2xl text-ink-900 reveal">
          Why Shop With Us
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: ShieldCheck, title: "Quality Products", text: "Carefully selected for your baby." },
            { icon: RotateCcw, title: "Easy Returns", text: "Hassle-free returns within 7 days." },
            { icon: Truck, title: "Fast Local Delivery", text: "1–3 days in and around the city." },
            { icon: HeartHandshake, title: "Secure Payments", text: "COD & online payments." },
            { icon: MessageCircle, title: "Friendly Support", text: "Chat with us on WhatsApp." },
          ].map((f, i) => (
            <div
              key={f.title}
              className={`rounded-3xl bg-white p-5 text-center shadow-card transition hover:-translate-y-1 hover:shadow-soft reveal stagger-${i + 1}`}
            >
              <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-blush-50 text-blush-500">
                <f.icon size={20} />
              </div>
              <div className="mt-3 text-sm font-semibold text-ink-900">{f.title}</div>
              <div className="mt-1 text-xs text-ink-500">{f.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-8 text-center font-display text-2xl text-ink-900 reveal">
          What Parents Say
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { name: "Priya S.", text: "Super soft rompers and quick delivery. My go-to store now!" },
            { name: "Arjun M.", text: "The gift set was beautifully packed. Excellent quality." },
            { name: "Neha K.", text: "Loved the WhatsApp support — very helpful team." },
          ].map((r, i) => (
            <blockquote
              key={r.name}
              className={`rounded-3xl bg-white p-6 shadow-card reveal stagger-${i + 1}`}
            >
              <div className="text-blush-400">★★★★★</div>
              <p className="mt-3 text-sm text-ink-700">"{r.text}"</p>
              <footer className="mt-3 text-xs text-ink-500">— {r.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="rounded-4xl bg-sage-50 p-8 text-center md:p-12 reveal-scale">
          <h3 className="font-display text-2xl text-ink-900">Need help choosing?</h3>
          <p className="mt-2 text-ink-500">Chat with our team on WhatsApp for recommendations.</p>
          <a
            href={whatsappLink(whatsappMessages.general)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-sage-500 px-6 py-3 text-sm font-medium text-white hover:bg-sage-400 transition-transform active:scale-95"
          >
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}