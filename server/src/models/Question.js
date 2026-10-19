import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    question: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "answered", "ignored"],
      default: "pending",
      index: true,
    },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

questionSchema.index({ createdAt: -1 });

export default mongoose.model("Question", questionSchema);