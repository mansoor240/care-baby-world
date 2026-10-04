import { createContext, useContext, useEffect, useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/* Zustand store (persisted to localStorage) */
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      add: (product, qty = 1, variant = "") => {
        const key = `${product._id}::${variant}`;
        const existing = get().items.find((i) => i.key === key);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.key === key ? { ...i, quantity: i.quantity + qty } : i
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                key,
                productId: product._id,
                name: product.name,
                slug: product.slug,
                image: product.images?.[0] || "",
                price: product.price,
                originalPrice: product.originalPrice,
                quantity: qty,
                variant,
                stock: product.stock,
              },
            ],
          });
        }
      },
      remove: (key) => set({ items: get().items.filter((i) => i.key !== key) }),
      setQty: (key, qty) =>
        set({
          items: get().items.map((i) =>
            i.key === key ? { ...i, quantity: Math.max(1, qty) } : i
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

/* React context for a more idiomatic API in components */
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