import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, default: "", lowercase: true },
    mobile: { type: String, required: true },
    addresses: [{ type: Object }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);