import { createContext, useContext, useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      // `variant` can be:
      //   - "" or null        → no-variant product (legacy)
      //   - an object {_id, name, price, originalPrice, stock, sku, __idx}
      add: (product, qty = 1, variant = "") => {
        const variantId = variant?._id || null;
        const variantTag =
          variantId || variant?.sku || variant?.name || variant?.__idx || "base";
        const key = `${product._id}::${variantTag}`;
        const existing = get().items.find((i) => i.key === key);

        const price = variant?.price ?? product.price;
        const originalPrice = variant?.originalPrice ?? product.originalPrice;
        const stock = variant?.stock ?? product.stock;
        const variantName = variant?.name || "";

        if (existing) {
          const nextQty = Math.min(existing.quantity + qty, stock || 99);
          set({
            items: get().items.map((i) =>
              i.key === key ? { ...i, quantity: nextQty, stock } : i
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                key,
                productId: product._id,
                variantId,
                variantName,
                name: product.name,
                slug: product.slug,
                image: product.images?.[0] || "",
                price,
                originalPrice,
                quantity: qty,
                stock,
              },
            ],
          });
        }
      },

      remove: (key) => set({ items: get().items.filter((i) => i.key !== key) }),

      setQty: (key, qty) =>
        set({
          items: get().items.map((i) =>
            i.key === key
              ? { ...i, quantity: Math.max(1, Math.min(qty, i.stock ?? 99)) }
              : i
          ),
        }),

      clear: () => set({ items: [], coupon: null }),
      setCoupon: (coupon) => set({ coupon }),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    { name: "tn_cart" }
  )
);

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const store = useCartStore();
  const value = useMemo(() => store, [store]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};