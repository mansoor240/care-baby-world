import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import api from "../api/client";
import ProductGrid from "../components/product/ProductGrid";
import CategoryCard3D from "../components/CategoryCard3D";
import ScrollShowcase from "../components/ScrollShowcase";
import ScrollRevealText from "../components/ScrollRevealText";
import HorizontalScroll from "../components/HorizontalScroll";
import { storeConfig } from "../config/store";
import { whatsappLink, whatsappMessages } from "../lib/whatsapp";
import { MessageCircle, Truck, ShieldCheck, RotateCcw, HeartHandshake } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
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

  const featuredRef = useRef(null);
  const featuredScroll = useScroll({
    target: featuredRef,
    offset: ["start end", "end start"],
  });
  const featuredY = useTransform(featuredScroll.scrollYProgress, [0, 1], [50, -50]);
  const featuredScale = useTransform(featuredScroll.scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

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
      {/* ─── SCROLL SHOWCASE (Cinematic Top) ─────────── */}
      <ScrollShowcase />

      {/* ─── CATEGORIES ─────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-6 flex items-end justify-between"
        >
          <h2 className="font-display text-2xl text-ink-900 dark:text-night-50">Shop by Category</h2>
          <Link to="/shop" className="text-sm text-blush-500 hover:underline dark:text-blush-300">View all →</Link>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {categories.map((c, i) => (
            <motion.div key={c.slug} variants={staggerItem}>
              <CategoryCard3D category={c} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── FEATURED ─────────────────────────────────── */}
      <section ref={featuredRef} className="mx-auto max-w-7xl px-4 py-8">
        <motion.div
          style={{ y: featuredY }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-6 flex items-end justify-between"
        >
          <h2 className="font-display text-2xl text-ink-900 dark:text-night-50">Featured Products</h2>
          <Link to="/shop" className="text-sm text-blush-500 hover:underline dark:text-blush-300">See all →</Link>
        </motion.div>
        <motion.div
          style={{ scale: featuredScale }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <ProductGrid products={featured} loading={loading} />
        </motion.div>
      </section>

      {/* ─── HORIZONTAL SCROLL BESTSELLERS ────────────── */}
      <HorizontalScroll
        products={bestsellers}
        title="Best Sellers"
        subtitle="Loved by parents"
      />

      {/* ─── OFFER BANNER ───────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-4xl bg-gradient-to-r from-lavender-100 via-blush-100 to-sand-100 p-8 md:p-12 dark:from-night-700 dark:via-night-800 dark:to-night-700"
        >
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-blush-500 dark:text-blush-300">
                Limited Time
              </div>
              <h3 className="mt-2 font-display text-3xl text-ink-900 dark:text-night-50">
                Use code <span className="text-blush-500 dark:text-blush-300">WELCOME10</span>
              </h3>
              <p className="mt-2 text-ink-500 dark:text-night-300">
                Get 10% off your first order above ₹499. Applicable at checkout.
              </p>
              <Link
                to="/shop"
                className="mt-5 inline-flex rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-700 transition-all hover:shadow-soft hover:-translate-y-0.5 active:scale-95 dark:bg-blush-500 dark:hover:bg-blush-400"
              >
                Shop the offer
              </Link>
            </div>
            <div className="rounded-3xl bg-white/70 p-6 text-center backdrop-blur transition-transform duration-500 hover:scale-105 dark:bg-night-800/70">
              <div className="text-6xl">🎁</div>
              <p className="mt-3 text-sm text-ink-700 dark:text-night-100">
                Free delivery on orders above {storeConfig.currency}{storeConfig.freeDeliveryThreshold}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── WHY US ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 text-center">
          <ScrollRevealText
            text="Why Shop With Us"
            className="justify-center font-display text-2xl text-ink-900 dark:text-night-50"
          />
        </div>
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
              className="group rounded-3xl bg-white p-5 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5"
            >
              <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-blush-50 text-blush-500 transition-all duration-300 group-hover:scale-110 group-hover:bg-blush-100 dark:bg-blush-400/15 dark:text-blush-300 dark:group-hover:bg-blush-400/25">
                <f.icon size={20} />
              </div>
              <div className="mt-3 text-sm font-semibold text-ink-900 transition-colors group-hover:text-blush-500 dark:text-night-50 dark:group-hover:text-blush-300">
                {f.title}
              </div>
              <div className="mt-1 text-xs text-ink-500 dark:text-night-300">{f.text}</div>
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
          className="mb-8 text-center font-display text-2xl text-ink-900 dark:text-night-50"
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
              className="group rounded-3xl bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5"
            >
              <div className="text-blush-400 transition-transform duration-300 group-hover:scale-105 dark:text-blush-300">
                ★★★★★
              </div>
              <p className="mt-3 text-sm text-ink-700 dark:text-night-100">"{r.text}"</p>
              <footer className="mt-3 text-xs text-ink-500 dark:text-night-400">— {r.name}</footer>
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
          className="rounded-4xl bg-sage-50 p-8 text-center md:p-12 dark:bg-night-800 dark:ring-1 dark:ring-white/5"
        >
          <h3 className="font-display text-2xl text-ink-900 dark:text-night-50">Need help choosing?</h3>
          <p className="mt-2 text-ink-500 dark:text-night-300">
            Chat with our team on WhatsApp for recommendations.
          </p>
          <a
            href={whatsappLink(whatsappMessages.general)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-sage-500 px-6 py-3 text-sm font-medium text-white hover:bg-sage-400 transition-all hover:shadow-soft hover:-translate-y-0.5 active:scale-95 dark:bg-sage-500"
          >
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </motion.div>
      </section>
    </div>
  );
}