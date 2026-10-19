import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, MessageCircle, Search } from "lucide-react";
import { whatsappLink, whatsappMessages } from "../lib/whatsapp";

const FAQ_DATA = [
  {
    category: "Orders & Delivery",
    items: [
      {
        q: "How long does delivery take?",
        a: "We deliver across Hyderabad in 1–3 business days. Orders placed before 2 PM are usually delivered the next day. For areas outside Hyderabad, please contact us on WhatsApp before ordering.",
      },
      {
        q: "Do you offer free delivery?",
        a: "Yes! Free delivery on all orders above ₹999. Below that, a flat ₹49 delivery fee applies.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. After placing an order, you'll receive an order number. Visit our Track Order page, enter your mobile number, and you can see all your orders anytime — even without creating an account.",
      },
      {
        q: "What areas do you deliver to?",
        a: "We deliver to Hyderabad and surrounding metro areas (pincodes starting with 500, 501, and 502). If you're outside this area, message us on WhatsApp for special arrangements.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "Unused products in original packaging can be returned within 7 days of delivery. Just message us on WhatsApp with your order number and reason for return.",
      },
      {
        q: "How long do refunds take?",
        a: "Once we receive the returned product and verify it, refunds are processed to your original payment method within 5–7 business days. For COD orders, we transfer the amount to your bank account.",
      },
      {
        q: "Are all products returnable?",
        a: "Most products are returnable. However, opened consumables (like opened diaper packs, used bottles, or personal care items) cannot be returned for hygiene reasons.",
      },
    ],
  },
  {
    category: "Products & Quality",
    items: [
      {
        q: "Are your products safe for newborns?",
        a: "We carefully curate products from trusted manufacturers. Every product listing includes the manufacturer's recommended age range and materials. Always follow the manufacturer's instructions for use.",
      },
      {
        q: "Do you sell authentic products?",
        a: "Yes. We source directly from authorized distributors and manufacturers. If you have concerns about any specific product, please contact us — we'll provide sourcing details.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Cash on Delivery (COD) and online payments via UPI, cards, and netbanking. Online payment is powered by our secure payment partner.",
      },
      {
        q: "Is online payment secure?",
        a: "Yes. All online payments are processed through PCI-DSS compliant payment gateways. We never store your card details on our servers.",
      },
      {
        q: "Can I use a coupon?",
        a: "Yes! Apply your coupon code at checkout. Common coupons: WELCOME10 (10% off first order above ₹499), TINY100 (₹100 off orders above ₹799).",
      },
    ],
  },
  {
    category: "Account & Support",
    items: [
      {
        q: "Do I need an account to order?",
        a: "No. You can checkout as a guest. But creating an account lets you track all orders in one place, save addresses, and check out faster next time.",
      },
      {
        q: "How do I contact you?",
        a: "The fastest way is WhatsApp — tap the floating green button or message us at the number in the footer. We respond within 2 hours during store hours.",
      },
      {
        q: "What are your store hours?",
        a: "Mon – Sat: 10:00 AM – 8:30 PM. Sunday: closed (but WhatsApp messages are still answered by 6 PM).",
      },
    ],
  },
];

export default function FAQ() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState({});

  const toggle = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter FAQ by search
  const filtered = FAQ_DATA.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  const totalItems = filtered.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-ink-500">
        <Link to="/" className="hover:text-ink-900 transition">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-900">FAQ</span>
      </nav>

      {/* Header */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-blush-50 px-4 py-1.5 text-xs font-medium text-blush-500">
          ❓ Help Center
        </div>
        <h1 className="mt-4 font-display text-4xl text-ink-900">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-ink-500">
          Everything you need to know about orders, delivery, payments, and products.
        </p>
      </div>

      {/* Search */}
      <div className="mt-8 relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions… e.g. delivery, return, payment"
          className="w-full rounded-full border border-ink-900/10 bg-white pl-12 pr-4 py-3.5 text-sm focus:border-blush-400 focus:outline-none"
        />
      </div>

      {search && (
        <p className="mt-3 text-center text-sm text-ink-500">
          {totalItems} result{totalItems === 1 ? "" : "s"} for "{search}"
        </p>
      )}

      {/* Empty search */}
      {search && filtered.length === 0 && (
        <div className="mt-10 rounded-3xl bg-white p-12 text-center shadow-card">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blush-50 text-4xl">
            🔍
          </div>
          <h3 className="mt-5 font-display text-xl">No results found</h3>
          <p className="mt-2 text-sm text-ink-500">
            Try different keywords or{" "}
            <a
              href={whatsappLink(whatsappMessages.general)}
              target="_blank"
              rel="noreferrer"
              className="text-sage-500 underline"
            >
              message us on WhatsApp
            </a>
            .
          </p>
        </div>
      )}

      {/* Categories */}
      {filtered.map((cat, catIdx) => (
        <div key={cat.category} className="mt-10">
          <h2 className="mb-3 font-display text-xl text-ink-900">
            {cat.category}
          </h2>
          <div className="space-y-2">
            {cat.items.map((item, itemIdx) => {
              const key = `${catIdx}-${itemIdx}`;
              const isOpen = openItems[key];
              return (
                <div
                  key={itemIdx}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? "border-blush-200 bg-white shadow-card"
                      : "border-ink-900/5 bg-white"
                  }`}
                >
                  <button
                    onClick={() => toggle(catIdx, itemIdx)}
                    className="flex w-full items-start justify-between gap-4 p-4 text-left"
                  >
                    <span className="font-medium text-ink-900">{item.q}</span>
                    <ChevronDown
                      size={18}
                      className={`mt-0.5 shrink-0 text-ink-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <p className="px-4 pb-4 text-sm leading-relaxed text-ink-700">
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Still need help */}
      <div className="mt-12 rounded-4xl bg-sage-50 p-8 text-center">
        <h3 className="font-display text-2xl text-ink-900">
          Still have questions?
        </h3>
        <p className="mt-2 text-sm text-ink-500">
          Our team is happy to help. Message us and we'll reply within 2 hours.
        </p>
        <a
          href={whatsappLink(whatsappMessages.support)}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-sage-500 px-6 py-3 text-sm font-medium text-white hover:bg-sage-400 transition-all hover:shadow-soft hover:-translate-y-0.5 active:scale-95"
        >
          <MessageCircle size={16} /> Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}