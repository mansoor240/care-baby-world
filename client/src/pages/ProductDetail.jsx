import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice, discountPercent } from "../lib/format";
import { whatsappLink, whatsappMessages } from "../lib/whatsapp";
import ProductGrid from "../components/product/ProductGrid";
import { Heart, Truck, RotateCcw, ShieldCheck, MessageCircle } from "lucide-react";
import { storeConfig } from "../config/store";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
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
        <h1 className="mt-4 font-display text-2xl">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-blush-500 hover:underline">
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

    // Validate format
    if (!/^\d{6}$/.test(pincode)) {
      setPinMsg({
        type: "error",
        text: "Enter a valid 6-digit pincode",
      });
      return;
    }

    // Check if pincode is in delivery zone
    const { prefixes = [], list = [] } = storeConfig.deliveryPincodes || {};
    const isDeliverable =
      list.includes(pincode) ||
      prefixes.some((prefix) => pincode.startsWith(prefix));

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
      <nav className="text-xs text-ink-500">
        <Link to="/">Home</Link> /{" "}
        <Link to={`/category/${product.categorySlug}`} className="capitalize">
          {product.categorySlug.replace(/-/g, " ")}
        </Link>{" "}
        / <span className="text-ink-900">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {/* GALLERY */}
        <div>
          <div className="overflow-hidden rounded-4xl bg-white shadow-card">
            <div className="aspect-square bg-cream">
              <img
                src={product.images[activeImg]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-16 overflow-hidden rounded-2xl border-2 ${
                    i === activeImg ? "border-blush-400" : "border-transparent"
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
          <h1 className="font-display text-3xl text-ink-900">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-ink-500">
            <span>⭐ {product.rating} ({product.reviewCount} reviews)</span>
            <span>·</span>
            <span className={inStock ? "text-sage-500" : "text-red-500"}>
              {inStock ? `In stock (${product.stock})` : "Out of stock"}
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-ink-300 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="rounded-full bg-blush-100 px-2 py-0.5 text-xs font-semibold text-blush-500">
                  {off}% OFF
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-sm text-ink-700">{product.description}</p>

          {product.features?.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-sm text-ink-700">
              {product.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-sage-500">✓</span> {f}
                </li>
              ))}
            </ul>
          )}

          {product.sizes?.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-sm font-semibold">Size</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      size === s
                        ? "border-blush-400 bg-blush-50 text-blush-500"
                        : "border-ink-900/10 bg-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QTY + CTA */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-ink-900/10 bg-white">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-4 py-2 text-lg"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center">{qty}</span>
              <button
                onClick={() => setQty(Math.min(product.stock || 1, qty + 1))}
                className="px-4 py-2 text-lg"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={() => wishlist.toggle(product)}
              className={`grid h-11 w-11 place-items-center rounded-full border border-ink-900/10 bg-white ${
                wished ? "text-blush-500" : "text-ink-500"
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
              className="rounded-full border border-ink-900/15 bg-white py-3 text-sm font-medium hover:bg-cream active:scale-95 transition-transform disabled:opacity-40"
            >
              Add to Cart
            </button>
                     <button
              onClick={buyNow}
              disabled={!inStock}
              className="rounded-full bg-ink-900 py-3 text-sm font-medium text-white hover:bg-ink-700 active:scale-95 transition-transform disabled:opacity-40"
            >
              Buy Now
            </button>
          </div>

          {/* PINCODE */}
          <form onSubmit={checkPin} className="mt-6">
            <label className="mb-1.5 block text-sm font-medium">Check delivery</label>
            <div className="flex gap-2">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter pincode"
                className="flex-1 rounded-2xl border border-ink-900/10 bg-white px-4 py-3 text-sm focus:border-blush-400 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-2xl bg-blush-400 px-5 text-sm font-medium text-white hover:bg-blush-500"
              >
                Check
              </button>
            </div>
            {pinMsg && (
              <p
                className={`mt-2 text-xs ${
                  pinMsg.type === "success"
                    ? "text-sage-500"
                    : "text-red-500"
                }`}
              >
                {pinMsg.text}
              </p>
            )}          </form>

          {/* SHIPPING / RETURNS */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-3 text-center shadow-card">
              <Truck size={18} className="mx-auto text-blush-400" />
              <p className="mt-1 text-xs text-ink-700">Fast delivery</p>
            </div>
            <div className="rounded-2xl bg-white p-3 text-center shadow-card">
              <RotateCcw size={18} className="mx-auto text-blush-400" />
              <p className="mt-1 text-xs text-ink-700">7-day returns</p>
            </div>
            <div className="rounded-2xl bg-white p-3 text-center shadow-card">
              <ShieldCheck size={18} className="mx-auto text-blush-400" />
              <p className="mt-1 text-xs text-ink-700">Secure payments</p>
            </div>
          </div>

          <a
            href={whatsappLink(whatsappMessages.product(product.name))}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-sage-500 hover:underline"
          >
            <MessageCircle size={16} /> Ask about this product on WhatsApp
          </a>
        </div>
      </div>

      {related?.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}