import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Size 1 - 30pc"
    sku: { type: String, required: true, trim: true }, // e.g. "PAM-S1-30"
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    categorySlug: { type: String, required: true, index: true },
    images: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true },
    brand: { type: String, default: "" },
    ageRange: { type: String, default: "" },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    variants: [
      {
        name: { type: String, required: true },
        sku: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        originalPrice: { type: Number, default: 0 },
        stock: { type: Number, required: true, default: 0, min: 0 },
      },
    ],
    features: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false, index: true },
    bestseller: { type: Boolean, default: false, index: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },

    // ✅ NEW: Variant support
    hasVariants: { type: Boolean, default: false, index: true },
    variants: { type: [variantSchema], default: [] },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text" });

export default mongoose.model("Product", productSchema);