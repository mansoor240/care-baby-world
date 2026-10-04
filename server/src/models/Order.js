import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    slug: String,
    image: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 },
    variant: { type: String, default: "" },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, default: "" },
    house: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: addressSchema, required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String, default: "" },
    paymentMethod: { type: String, enum: ["cod", "online"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);