import { createContext, useContext, useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [], // { productId, name, slug, image, price }
      toggle: (product) => {
        const exists = get().items.find((i) => i.productId === product._id);
        if (exists) {
          set({ items: get().items.filter((i) => i.productId !== product._id) });
        } else {
          set({
            items: [
              ...get().items,
              {
                productId: product._id,
                name: product.name,
                slug: product.slug,
                image: product.images?.[0] || "",
                price: product.price,
              },
            ],
          });
        }
      },
      has: (id) => !!get().items.find((i) => i.productId === id),
      remove: (id) => set({ items: get().items.filter((i) => i.productId !== id) }),
      clear: () => set({ items: [] }),
    }),
    { name: "tn_wishlist" }
  )
);

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const store = useWishlistStore();
  const value = useMemo(() => store, [store]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);