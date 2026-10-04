import { Router } from "express";
import Coupon from "../models/Coupon.js";

const router = Router();

// POST /api/coupons/validate { code, subtotal }
router.post("/validate", async (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ error: "Coupon code required" });

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
  if (!coupon) return res.status(404).json({ error: "Invalid coupon" });
  if (new Date(coupon.expiresAt) < new Date())
    return res.status(400).json({ error: "Coupon expired" });
  if (subtotal < coupon.minOrderAmount)
    return res.status(400).json({
      error: `Minimum order ₹${coupon.minOrderAmount} required`,
    });

  const discount =
    coupon.type === "percentage"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;

  res.json({
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discount: Math.min(discount, subtotal),
  });
});

export default router;