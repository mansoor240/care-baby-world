import { storeConfig } from "../config/store.js";

/**
 * Server-side authoritative order total.
 * NEVER trust client-submitted prices.
 */
export function calculateTotals(items, coupon) {
  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);

  let discount = 0;
  if (coupon && coupon.active && new Date(coupon.expiresAt) > new Date()) {
    if (subtotal >= (coupon.minOrderAmount || 0)) {
      discount =
        coupon.type === "percentage"
          ? Math.round((subtotal * coupon.value) / 100)
          : coupon.value;
      discount = Math.min(discount, subtotal);
    }
  }

  const deliveryFee =
    subtotal >= storeConfig.freeDeliveryThreshold || subtotal === 0
      ? 0
      : storeConfig.deliveryFee;

  const total = subtotal - discount + deliveryFee;
  return { subtotal, discount, deliveryFee, total };
}