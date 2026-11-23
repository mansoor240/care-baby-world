import { Router } from "express";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import { optionalCustomer } from "../middleware/customerAuth.js";

const router = Router();

// POST /api/coupons/validate { code, subtotal, mobile }
router.post("/validate", optionalCustomer, async (req, res) => {
  try {
    const { code, subtotal, mobile } = req.body;
    if (!code) return res.status(400).json({ error: "Coupon code required" });

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      active: true,
    });
    if (!coupon) return res.status(404).json({ error: "Invalid coupon" });
    if (new Date(coupon.expiresAt) < new Date())
      return res.status(400).json({ error: "Coupon expired" });
    if (subtotal < coupon.minOrderAmount)
      return res.status(400).json({
        error: `Minimum order ₹${coupon.minOrderAmount} required`,
      });

    // ─── One-time-per-customer check ───
    // If a mobile number is provided, block if this customer already used it.
    if (mobile) {
      const alreadyUsed = await Order.findOne({
        "customer.mobile": mobile,
        couponCode: coupon.code,
        status: { $ne: "cancelled" },
      });
      if (alreadyUsed) {
        return res.status(400).json({
          error:
            "You have already used this coupon. It can only be used once per customer.",
        });
      }
    }

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not validate coupon" });
  }
});

export default router;