import { Router } from "express";
import Settings from "../models/Settings.js";
import Coupon from "../models/Coupon.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// ── Public: get current home offer (used by storefront) ──
router.get("/home-offer", async (_req, res) => {
  try {
    const s = await Settings.findOne({ key: "site" });
    const code = s?.homeOfferCouponCode || "";
    if (!code) return res.json({ coupon: null });

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      active: true,
    });
    if (!coupon) return res.json({ coupon: null }); // deactivated → hide banner

    res.json({
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount,
      },
    });
  } catch (err) {
    console.error(err);
    res.json({ coupon: null });
  }
});

// ── Admin: get current setting ──
router.get("/admin/home-offer", requireAdmin, async (_req, res) => {
  const s = await Settings.findOne({ key: "site" });
  res.json({
    homeOfferCouponCode: s?.homeOfferCouponCode || "",
  });
});

// ── Admin: update setting ──
router.put("/admin/home-offer", requireAdmin, async (req, res) => {
  try {
    const { homeOfferCouponCode = "" } = req.body;
    const code = (homeOfferCouponCode || "").trim().toUpperCase();

    // If a code was provided, verify the coupon exists
    if (code) {
      const exists = await Coupon.findOne({ code });
      if (!exists) return res.status(400).json({ error: "Coupon not found" });
    }

    await Settings.findOneAndUpdate(
      { key: "site" },
      { homeOfferCouponCode: code },
      { upsert: true, new: true }
    );
    res.json({ ok: true, homeOfferCouponCode: code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save settings" });
  }
});

export default router;