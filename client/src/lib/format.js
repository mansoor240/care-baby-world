import { storeConfig } from "../config/store";

export const formatPrice = (n) =>
  `${storeConfig.currency}${Number(n || 0).toLocaleString("en-IN")}`;

export const discountPercent = (price, original) => {
  if (!original || original <= price) return null;
  return Math.round(((original - price) / original) * 100);
};

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });