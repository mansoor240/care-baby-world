import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. "site"
    homeOfferCouponCode: { type: String, default: "" }, // "" = no banner

    // Admin-editable policies (markdown-ish plain text)
    policies: {
      shipping: { type: String, default: "" },
      returns: { type: String, default: "" },
      privacy: { type: String, default: "" },
      terms: { type: String, default: "" },
    },
    policiesLastUpdated: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);