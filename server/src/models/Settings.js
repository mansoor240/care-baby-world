import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. "site"
    homeOfferCouponCode: { type: String, default: "" }, // "" = no banner
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);