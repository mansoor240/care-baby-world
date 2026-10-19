import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/client";
import ProductGrid from "../components/product/ProductGrid";
import Hero3D from "../components/Hero3D";
import { storeConfig } from "../config/store";
import { whatsappLink, whatsappMessages } from "../lib/whatsapp";
import { MessageCircle, Truck, ShieldCheck, RotateCcw, HeartHandshake, Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

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
      {/* ─── HERO with 3D animation ────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blush-50 via-cream to-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
          {/* Left: Text */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
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
                className="rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-700 transition-all hover:shadow-soft hover:-translate-y-0.5 active:scale-95"
              >
                Shop Now
              </Link>
              <Link
                to="/shop"
                className="rounded-full border border-ink-900/15 bg-white px-6 py-3 text-sm font-medium text-ink-900 hover:bg-cream transition-all hover:shadow-card hover:-translate-y-0.5 active:scale-95"
              >
                Explore Categories
              </Link>
            </div>
          </motion.div>

          {/* Right: 3D animated scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-[4/3] md:aspect-auto md:min-h-[420px]"
          >
            <Hero3D />
          </motion.div>
        </div>
      </section>

      {/* ─── CATEGORIES ─────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-6 flex items-end justify-between"
        >
          <h2 className="font-display text-2xl text-ink-900">Shop by Category</h2>
          <Link to="/shop" className="text-sm text-blush-500 hover:underline">View all →</Link>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {categories.map((c) => (
            <motion.div key={c.slug} variants={staggerItem}>
              <Link
                to={`/category/${c.slug}`}
                className="group block rounded-3xl bg-white p-4 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft hover:scale-[1.03]"
              >
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blush-50 text-2xl transition-transform duration-300 group-hover:scale-110">
                  {c.emoji || "🧸"}
                </div>
                <div className="mt-3 text-sm font-medium text-ink-900 transition-colors group-hover:text-blush-500">
                  {c.name}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── FEATURED ───────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-6 flex items-end justify-between"
        >
          <h2 className="font-display text-2xl text-ink-900">Featured Products</h2>
          <Link to="/shop" className="text-sm text-blush-500 hover:underline">See all →</Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <ProductGrid products={featured} loading={loading} />
        </motion.div>
      </section>

      {/* ─── OFFER BANNER ───────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-4xl bg-gradient-to-r from-lavender-100 via-blush-100 to-sand-100 p-8 md:p-12"
        >
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
                className="mt-5 inline-flex rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-700 transition-all hover:shadow-soft hover:-translate-y-0.5 active:scale-95"
              >
                Shop the offer
              </Link>
            </div>
            <div className="rounded-3xl bg-white/70 p-6 text-center backdrop-blur transition-transform duration-500 hover:scale-105">
              <div className="text-6xl">🎁</div>
              <p className="mt-3 text-sm text-ink-700">
                Free delivery on orders above {storeConfig.currency}{storeConfig.freeDeliveryThreshold}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── BESTSELLERS ────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-6"
        >
          <h2 className="font-display text-2xl text-ink-900">Best Sellers</h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <ProductGrid products={bestsellers} loading={loading} />
        </motion.div>
      </section>

      {/* ─── WHY US ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-8 text-center font-display text-2xl text-ink-900"
        >
          Why Shop With Us
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {[
            { icon: ShieldCheck, title: "Quality Products", text: "Carefully selected for your baby." },
            { icon: RotateCcw, title: "Easy Returns", text: "Hassle-free returns within 7 days." },
            { icon: Truck, title: "Fast Local Delivery", text: "1–3 days in and around the city." },
            { icon: HeartHandshake, title: "Secure Payments", text: "COD & online payments." },
            { icon: MessageCircle, title: "Friendly Support", text: "Chat with us on WhatsApp." },
          ].map((f) => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              className="group rounded-3xl bg-white p-5 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-blush-50 text-blush-500 transition-all duration-300 group-hover:scale-110 group-hover:bg-blush-100">
                <f.icon size={20} />
              </div>
              <div className="mt-3 text-sm font-semibold text-ink-900 transition-colors group-hover:text-blush-500">{f.title}</div>
              <div className="mt-1 text-xs text-ink-500">{f.text}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── REVIEWS ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-8 text-center font-display text-2xl text-ink-900"
        >
          What Parents Say
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid gap-4 md:grid-cols-3"
        >
          {[
            { name: "Sikander", text: "Very good products & you can get products at affordable price." },
            { name: "Syed Mushtaq Ahmed", text: "Best baby store in the locality, with good quality diapers at wholesale prices. They have all the baby accessories at affordable prices." },
            { name: "Ayyub Ahmed", text: "Best store for baby products, has a variety of diapers at wholesale prices." },
          ].map((r) => (
            <motion.blockquote
              key={r.name}
              variants={staggerItem}
              className="group rounded-3xl bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="text-blush-400 transition-transform duration-300 group-hover:scale-105">★★★★★</div>
              <p className="mt-3 text-sm text-ink-700">"{r.text}"</p>
              <footer className="mt-3 text-xs text-ink-500">— {r.name}</footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </section>

      {/* ─── WHATSAPP CTA ───────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="rounded-4xl bg-sage-50 p-8 text-center md:p-12"
        >
          <h3 className="font-display text-2xl text-ink-900">Need help choosing?</h3>
          <p className="mt-2 text-ink-500">Chat with our team on WhatsApp for recommendations.</p>
          <a
            href={whatsappLink(whatsappMessages.general)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-sage-500 px-6 py-3 text-sm font-medium text-white hover:bg-sage-400 transition-all hover:shadow-soft hover:-translate-y-0.5 active:scale-95"
          >
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </motion.div>
      </section>
    </div>
  );
}