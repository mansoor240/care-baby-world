/**
 * Central store configuration.
 * Change these values to rebrand the template.
 */
export const storeConfig = {
  name: import.meta.env.VITE_STORE_NAME || "Care Baby Store",
  shortName: "Care",
  tagline: "Everything Your Little One Needs",
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || "919999999999",
  phone: import.meta.env.VITE_STORE_PHONE || "+91 99999 99999",
  email: "hello@CareBabyStore.example",
  address: {
    line1: "11-3-873/1, Backside Badie Masjid, New Mallepally",
    area: "Nampally, Jamia Masjid Rd, Bazar Ghat, New Mallepally",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500001",
  },
  mapsUrl: "https://maps.app.goo.gl/d9WTo6GPshpGybE79",
  openingHours: "Mon – Sat: 10:00 AM – 8:30 PM",
  currency: "₹",
  freeDeliveryThreshold: 999,
  deliveryFee: 49,
  estimatedDelivery: "1 – 3 business days",

  // 👇 ADD THIS BLOCK
  // Delivery pincodes for Hyderabad & surrounding metro areas.
  // Any pincode that starts with one of these prefixes will be accepted.
  deliveryPincodes: {
    prefixes: ["500", "501", "502"],
    list: [], // Optional: add exact pincodes for special zones
  },
  // 👆

  social: {
    instagram: "https://instagram.com/CareBabyStore",
    facebook: "https://facebook.com/CareBabyStore",
  },
  announcement: "Free delivery on orders above ₹999 · Local delivery in 1–3 days",
};