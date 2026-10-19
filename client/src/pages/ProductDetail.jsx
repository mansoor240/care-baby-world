import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice, discountPercent } from "../lib/format";
import { whatsappLink, whatsappMessages } from "../lib/whatsapp";
import ProductGrid from "../components/product/ProductGrid";
import ImageLightbox from "../components/ImageLightbox";
import { Heart, Truck, RotateCcw, ShieldCheck, MessageCircle } from "lucide-react";
import { storeConfig } from "../config/store";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [pincode, setPincode] = useState("");
  const [pinMsg, setPinMsg] = useState(null);

  const cart = useCart();
  const wishlist = useWishlist();

  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    setQty(1);
    api
      .get(`/products/slug/${slug}`)
      .then((r) => {
        setData(r.data);
        setSize(r.data.product.sizes?.[0] || "");
        document.title = `${r.data.product.name} — CareBabyStore`;
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="skeleton aspect-square rounded-4xl" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4 rounded-2xl" />
            <div className="skeleton h-4 w-1/3 rounded-2xl" />
            <div className="skeleton h-6 w-1/4 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-5xl">🥺</div>
        <h1 className="mt-4 font-display text-2xl text-ink-900 dark:text-night-50">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-blush-500 hover:underline dark:text-blush-300">
          ← Back to shop
        </Link>
      </div>
    );
  }

  const { product, related } = data;
  const off = discountPercent(product.price, product.originalPrice);
  const inStock = product.stock > 0;
  const wished = wishlist.has(product._id);

  const addToCart = () => {
    if (!inStock) return;
    cart.add(product, qty, size);
    toast.success(`Added ${qty} × ${product.name}`);
  };

  const buyNow = () => {
    addToCart();
    navigate("/checkout");
  };

  const checkPin = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setPinMsg({ type: "error", text: "Enter a valid 6-digit pincode" });
      return;
    }
    const { prefixes = [], list = [] } = storeConfig.deliveryPincodes || {};
    const isDeliverable =
      list.includes(pincode) || prefixes.some((prefix) => pincode.startsWith(prefix));
    if (isDeliverable) {
      setPinMsg({
        type: "success",
        text: `✅ Delivers to ${pincode} in ${storeConfig.estimatedDelivery} · Free above ${storeConfig.currency}${storeConfig.freeDeliveryThreshold}`,
      });
    } else {
      setPinMsg({
        type: "error",
        text: `❌ Sorry, we currently deliver only in Hyderabad. Contact us on WhatsApp for special requests.`,
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-xs text-ink-500 dark:text-night-400">
        <Link to="/" className="hover:text-ink-900 dark:hover:text-night-50 transition">Home</Link>{" / "}
        <Link to={`/category/${product.categorySlug}`} className="capitalize hover:text-ink-900 dark:hover:text-night-50 transition">
          {product.categorySlug.replace(/-/g, " ")}
        </Link>{" / "}
        <span className="text-ink-900 dark:text-night-50">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {/* GALLERY */}
        <div>
          <div className="overflow-hidden rounded-4xl bg-white shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="block w-full"
            >
              <div className="aspect-square bg-cream dark:bg-night-700">
                <img
                  src={product.images[activeImg]}
                  alt={product.name}
                  className="product-main-img h-full w-full object-cover cursor-zoom-in"
                />
              </div>
            </button>
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-16 overflow-hidden rounded-2xl border-2 transition-all ${
                    i === activeImg
                      ? "border-blush-400 dark:border-blush-300"
                      : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div>
          <h1 className="font-display text-3xl text-ink-900 dark:text-night-50">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-ink-500 dark:text-night-300">
            <span>⭐ {product.rating} ({product.reviewCount} reviews)</span>
            <span>·</span>
            <span className={inStock ? "text-sage-500 dark:text-sage-300" : "text-red-500 dark:text-red-400"}>
              {inStock ? `In stock (${product.stock})` : "Out of stock"}
            </span>
          </div>

          {!inStock && (
            <div className="mt-4 rounded-2xl border border-sand-200 bg-sand-50 p-4 dark:border-sand-400/20 dark:bg-sand-400/10">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <div className="font-semibold text-ink-900 dark:text-night-50">Currently out of stock</div>
                  <p className="mt-1 text-sm text-ink-700 dark:text-night-300">
                    This product is temporarily unavailable. Message us on WhatsApp to get notified when it's back.
                  </p>
                  <a
                    href={whatsappLink(`Hi! I'd like to know when "${product.name}" is back in stock.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-sage-500 px-4 py-2 text-sm font-medium text-white hover:bg-sage-400 transition"
                  >
                    <MessageCircle size={14} /> Notify me
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-ink-900 dark:text-night-50">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-ink-300 line-through dark:text-night-400">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="rounded-full bg-blush-100 px-2 py-0.5 text-xs font-semibold text-blush-500 dark:bg-blush-400/20 dark:text-blush-300">
                  {off}% OFF
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-sm text-ink-700 dark:text-night-100">{product.description}</p>

          {product.features?.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-sm text-ink-700 dark:text-night-100">
              {product.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-sage-500 dark:text-sage-300">✓</span> {f}
                </li>
              ))}
            </ul>
          )}

          {product.sizes?.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-sm font-semibold text-ink-900 dark:text-night-50">Size</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      size === s
                        ? "border-blush-400 bg-blush-50 text-blush-500 dark:border-blush-300 dark:bg-blush-400/20 dark:text-blush-300"
                        : "border-ink-900/10 bg-white text-ink-900 dark:border-white/10 dark:bg-night-800 dark:text-night-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-ink-900/10 bg-white dark:border-white/10 dark:bg-night-800">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-4 py-2 text-lg text-ink-900 dark:text-night-50"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center text-ink-900 dark:text-night-50">{qty}</span>
              <button
                onClick={() => setQty(Math.min(product.stock || 1, qty + 1))}
                className="px-4 py-2 text-lg text-ink-900 dark:text-night-50"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={() => wishlist.toggle(product)}
              className={`grid h-11 w-11 place-items-center rounded-full border border-ink-900/10 bg-white transition-all hover:scale-110 active:scale-95 dark:border-white/10 dark:bg-night-800 ${
                wished ? "text-blush-500 dark:text-blush-300" : "text-ink-500 dark:text-night-300"
              }`}
              aria-label="Wishlist"
            >
              <Heart size={18} fill={wished ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={addToCart}
              disabled={!inStock}
              className="rounded-full border border-ink-900/15 bg-white py-3 text-sm font-medium text-ink-900 hover:bg-cream active:scale-95 transition-all disabled:opacity-40 dark:border-white/15 dark:bg-night-800 dark:text-night-50 dark:hover:bg-night-700"
            >
              Add to Cart
            </button>
            <button
              onClick={buyNow}
              disabled={!inStock}
              className="rounded-full bg-ink-900 py-3 text-sm font-medium text-white hover:bg-ink-700 active:scale-95 transition-all disabled:opacity-40 dark:bg-blush-500 dark:hover:bg-blush-400"
            >
              Buy Now
            </button>
          </div>

          <form onSubmit={checkPin} className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-ink-900 dark:text-night-50">Check delivery</label>
            <div className="flex gap-2">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter pincode"
                className="flex-1 rounded-2xl border border-ink-900/10 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-blush-400 focus:outline-none dark:border-white/10 dark:bg-night-800 dark:text-night-50 dark:placeholder:text-night-400"
              />
              <button
                type="submit"
                className="rounded-2xl bg-blush-400 px-5 text-sm font-medium text-white hover:bg-blush-500 transition-all hover:-translate-y-0.5 hover:shadow-soft active:scale-95 dark:bg-blush-500 dark:hover:bg-blush-400"
              >
                Check
              </button>
            </div>
            {pinMsg && (
              <p className={`mt-2 text-xs ${pinMsg.type === "success" ? "text-sage-500 dark:text-sage-300" : "text-red-500 dark:text-red-400"}`}>
                {pinMsg.text}
              </p>
            )}
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-3 text-center shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
              <Truck size={18} className="mx-auto text-blush-400 dark:text-blush-300" />
              <p className="mt-1 text-xs text-ink-700 dark:text-night-100">Fast delivery</p>
            </div>
            <div className="rounded-2xl bg-white p-3 text-center shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
              <RotateCcw size={18} className="mx-auto text-blush-400 dark:text-blush-300" />
              <p className="mt-1 text-xs text-ink-700 dark:text-night-100">7-day returns</p>
            </div>
            <div className="rounded-2xl bg-white p-3 text-center shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
              <ShieldCheck size={18} className="mx-auto text-blush-400 dark:text-blush-300" />
              <p className="mt-1 text-xs text-ink-700 dark:text-night-100">Secure payments</p>
            </div>
          </div>

          <a
            href={whatsappLink(whatsappMessages.product(product.name))}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-sage-500 hover:underline dark:text-sage-300"
          >
            <MessageCircle size={16} /> Ask about this product on WhatsApp
          </a>
        </div>
      </div>

      {related?.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl text-ink-900 dark:text-night-50">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}

      {lightboxOpen && (
        <ImageLightbox
          images={product.images}
          activeIndex={activeImg}
          onClose={() => setLightboxOpen(false)}
          onChange={setActiveImg}
        />
      )}
    </div>
  );
}