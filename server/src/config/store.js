import "dotenv/config";

export const storeConfig = {
  name: process.env.STORE_NAME || "CareBabyStore",
  shortName: process.env.STORE_SHORT_NAME || "Care",
  whatsapp: process.env.WHATSAPP_NUMBER || "919999999999",
  deliveryFee: Number(process.env.DELIVERY_FEE || 49),
  freeDeliveryThreshold: Number(process.env.FREE_DELIVERY_THRESHOLD || 999),
  currency: "INR",
  currencySymbol: "₹",
  deliveryPincodePrefixes: ["500", "501", "502"],
};