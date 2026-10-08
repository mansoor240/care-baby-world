import { useParams, Link } from "react-router-dom";
import { storeConfig } from "../config/store";

const CONTENT = {
  privacy: {
    title: "Privacy Policy",
    body: `This is a placeholder Privacy Policy. Replace it with a policy that reflects your actual data practices.

We collect the minimum information required to fulfil your order — your name, mobile number, delivery address, and optionally your email. We do not sell your data to third parties.

For questions, contact us at ${storeConfig.email}.`,
  },
  terms: {
    title: "Terms & Conditions",
    body: `This is a placeholder Terms & Conditions page. Replace with terms reviewed by your legal advisor.

By placing an order on ${storeConfig.name}, you agree to provide accurate delivery information and to pay the total amount shown at checkout.`,
  },
    shipping: {
    title: "Shipping Policy",
    body: `Delivery is available in Hyderabad and surrounding metro areas (pincodes starting with 500, 501, and 502). Estimated delivery: ${storeConfig.estimatedDelivery}.

Free delivery on orders above ${storeConfig.currency}${storeConfig.freeDeliveryThreshold}. A delivery fee of ${storeConfig.currency}${storeConfig.deliveryFee} applies below this threshold.

For delivery outside these areas, please contact us on WhatsApp before placing your order.`,
  },
  returns: {
    title: "Return & Refund Policy",
    body: `Placeholder Return & Refund Policy. Replace with your actual policy.

Unused products in original packaging may be returned within 7 days of delivery. Refunds are processed to the original payment method within 5–7 business days.`,
  },
};

export default function Policies() {
  const { slug } = useParams();
  const doc = CONTENT[slug];

  if (!doc) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl">Page not found</h1>
        <Link to="/" className="mt-3 inline-block text-blush-500">← Back home</Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl">{doc.title}</h1>
      <p className="mt-2 text-xs text-ink-500">
        ⚠️ Placeholder content — replace with your own legal text before going live.
      </p>
      <div className="prose mt-6 whitespace-pre-line text-sm leading-relaxed text-ink-700">
        {doc.body}
      </div>
    </article>
  );
}