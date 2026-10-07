import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, unique: true, index: true, trim: true },
    email: { type: String, default: "", lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    addresses: [
      {
        label: { type: String, default: "Home" },
        fullName: String,
        mobile: String,
        house: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);