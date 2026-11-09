import { Router } from "express";
import Settings from "../models/Settings.js";
import Coupon from "../models/Coupon.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// ── Public: get current home offer ──
router.get("/home-offer", async (_req, res) => {
  try {
    const s = await Settings.findOne({ key: "site" });
    const code = s?.homeOfferCouponCode || "";
    if (!code) return res.json({ coupon: null });

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      active: true,
    });
    if (!coupon) return res.json({ coupon: null });

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

// ── Public: get one policy by slug ──
router.get("/policies/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    if (!["shipping", "returns", "privacy", "terms"].includes(slug)) {
      return res.status(404).json({ error: "Policy not found" });
    }

    const s = await Settings.findOne({ key: "site" });
    const content = s?.policies?.[slug] || "";

    if (!content.trim()) {
      return res.status(404).json({ error: "Policy not yet set" });
    }

    res.json({
      slug,
      content,
      lastUpdated: s?.policiesLastUpdated || s?.updatedAt || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load policy" });
  }
});

// ── Public: get all policies (for footer / build-time fallback) ──
router.get("/policies", async (_req, res) => {
  const s = await Settings.findOne({ key: "site" });
  res.json({
    policies: s?.policies || {},
    lastUpdated: s?.policiesLastUpdated || s?.updatedAt || null,
  });
});

// ── Admin: get current home-offer setting ──
router.get("/admin/home-offer", requireAdmin, async (_req, res) => {
  const s = await Settings.findOne({ key: "site" });
  res.json({
    homeOfferCouponCode: s?.homeOfferCouponCode || "",
  });
});

// ── Admin: update home-offer ──
router.put("/admin/home-offer", requireAdmin, async (req, res) => {
  try {
    const { homeOfferCouponCode = "" } = req.body;
    const code = (homeOfferCouponCode || "").trim().toUpperCase();

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

// ── Admin: get all policies ──
router.get("/admin/policies", requireAdmin, async (_req, res) => {
  const s = await Settings.findOne({ key: "site" });
  res.json({
    policies: s?.policies || { shipping: "", returns: "", privacy: "", terms: "" },
    lastUpdated: s?.policiesLastUpdated || null,
  });
});

// ── Admin: update policies ──
router.put("/admin/policies", requireAdmin, async (req, res) => {
  try {
    const { policies = {} } = req.body;
    const cleaned = {
      shipping: String(policies.shipping || ""),
      returns: String(policies.returns || ""),
      privacy: String(policies.privacy || ""),
      terms: String(policies.terms || ""),
    };

    await Settings.findOneAndUpdate(
      { key: "site" },
      { policies: cleaned, policiesLastUpdated: new Date() },
      { upsert: true, new: true }
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save policies" });
  }
});

export default router;