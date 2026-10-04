import { storeConfig } from "../config/store";

export function whatsappLink(message) {
  const number = storeConfig.whatsapp.replace(/\D/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${text}`;
}

export const whatsappMessages = {
  general: "Hi CareBabyStore! I'd like to know more about your products.",
  product: (name) => `Hi CareBabyStore! I'm interested in "${name}". Is it available?`,
  order: (orderNumber) => `Hi CareBabyStore! I'd like to ask about my order ${orderNumber}.`,
  support: "Hi CareBabyStore! I need some help with my order.",
};